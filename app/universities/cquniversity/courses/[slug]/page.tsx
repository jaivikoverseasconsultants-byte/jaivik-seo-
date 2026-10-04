import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { cquCoursesReal, getCquCourseRealBySlug } from '@/data/cqu-courses-real';
import { buildMetadata } from '@/lib/seo';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';
import CourseRichContent from '@/components/CourseRichContent';

import { feeDisplay, feeDisplayINRLakh, feeSentenceINR, titleFeeFragment } from '@/lib/fee-verification';
import { courseAnnualINRLakh, RATE_TO_INR, inrToLakh } from '@/lib/currency';
import { publishedEnglishTests, englishOnRequestNote } from '@/lib/english-verification';

const UNIVERSITY_SLUG = 'cquniversity';
const UNI_NAME = 'CQUniversity';

export async function generateStaticParams() {
  return cquCoursesReal.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const course = getCquCourseRealBySlug(slug);
  if (!course) return {};
  return buildMetadata({
    title: `${course.name} at ${UNI_NAME}`,
    description: `${course.name} at CQUniversity, ${course.duration}, intakes ${course.intakeMonths.join(', ')}. Apply with Jaivik Overseas — 13 years expertise, 99% visa success.`,
    path: `/universities/cquniversity/courses/${slug}`,
    keywords: [course.name, 'CQUniversity', 'Central Queensland University', 'study in Australia', course.level],
  });
}

export default async function CoursePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const course = getCquCourseRealBySlug(slug);
  if (!course) notFound();

  const feeINRLakh = courseAnnualINRLakh(course as any, 1) ?? '0';
  // No CQU-published fee could be read; the only figure is the partner-platform estimate box below.
  const wholeCourse = false;
  const totalLakh = wholeCourse ? inrToLakh(course.totalAUD * RATE_TO_INR.AUD) : null;
  const inrValue = wholeCourse ? (totalLakh ? `≈ ₹${totalLakh} lakh` : feeDisplay(course as any, 0, 'INR')) : feeDisplayINRLakh(course as any, feeINRLakh, '');
  const english = publishedEnglishTests(UNIVERSITY_SLUG, course as never);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    provider: { '@type': 'CollegeOrUniversity', name: 'CQUniversity', sameAs: 'https://www.cqu.edu.au' },
    courseMode: 'full-time',
    educationalLevel: course.studyLevel,
    ...(course.durationYears > 0 ? { timeRequired: `P${course.durationYears}Y` } : {}),
    url: course.url,
  };

  return (
    <>
      <JsonLd data={schema} />
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4 flex-wrap">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities/cquniversity" className="hover:text-white">CQUniversity</Link> /
            <Link href="/universities/cquniversity/courses" className="hover:text-white">Courses</Link> /
            <span className="text-white">{course.name}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇦🇺 CQUniversity · {course.campus}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.name} at {UNI_NAME} — {titleFeeFragment(course as any, course.annualINR)}Requirements for Indian Students</h1>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                {[
                  wholeCourse
                    ? { label: `Whole Course (${course.feeYear})`, value: feeDisplay(course as any, course.totalAUD, 'AUD') }
                    : { label: `Annual Fee (${course.feeYear})`, value: feeDisplay(course as any, course.annualAUD, 'AUD') },
                  { label: 'Fee (INR)', value: wholeCourse ? inrValue : feeDisplayINRLakh(course as any, feeINRLakh, '/yr') },
                  { label: 'Duration', value: course.duration },
                  { label: 'Intakes', value: course.intakeMonths.map((m) => m.slice(0, 3)).join(' / ') },
                ].map((s) => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source={`cquniversity-course-${slug}`} defaultCountry="Australia" compact />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Course Overview</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Qualification', course.name],
                ['Level', course.level],
                ['Duration', `${course.duration} full-time`],
                ['Campus', course.campus],
                ['Intakes', course.intakeMonths.join(', ')],
                ['Course code / CRICOS', `${course.courseCode} / ${course.cricos}`],
                wholeCourse
                  ? [`Whole-course fee (AUD, ${course.feeYear})`, feeDisplay(course as any, course.totalAUD, 'AUD')]
                  : [`Annual fee (AUD, ${course.feeYear})`, feeDisplay(course as any, course.annualAUD, 'AUD')],
                [wholeCourse ? 'Whole-course fee (INR)' : 'Annual fee (INR)', inrValue],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col">
                  <span className="text-xs text-gray-500">{k}</span>
                  <span className="font-semibold text-gray-900 mt-0.5">{v}</span>
                </div>
              ))}
            </div>
            {course.feeBasis && (
              <p className="text-xs text-gray-500 mt-4">
                Fee basis: {course.feeBasis}.
                
              </p>
            )}
          </div>

          {/* Partner-platform figures, never styled like a university-published fee. */}
          {course.kcEstimate ? (
          <div className="rounded-2xl p-5 border border-dashed border-gray-300 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700 mb-1">Tuition, scholarship and deposit — estimates</h2>
            <p className="text-xs text-gray-500 mb-3">Estimated via partner platform — not published by university.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
              <div><span className="block text-xs text-gray-500">Annual tuition (estimate)</span>~A${course.kcEstimate.tuitionMinAUD.toLocaleString('en-US')}{course.kcEstimate.tuitionMaxAUD !== course.kcEstimate.tuitionMinAUD ? `–${course.kcEstimate.tuitionMaxAUD.toLocaleString('en-US')}` : ''}</div>
              {course.kcEstimate.avgScholarshipAUD ? <div><span className="block text-xs text-gray-500">Average scholarship (estimate)</span>~A${course.kcEstimate.avgScholarshipAUD.toLocaleString('en-US')}</div> : null}
              {course.kcEstimate.initialDepositAUD ? <div><span className="block text-xs text-gray-500">Initial deposit (estimate)</span>~A${course.kcEstimate.initialDepositAUD.toLocaleString('en-US')}</div> : null}
            </div>
            {course.kcEstimate.majors.length > 0 && <p className="text-xs text-gray-500 mt-3">Covers: {course.kcEstimate.majors.join('; ')}.</p>}
            <p className="text-xs text-gray-500 mt-3">Confirm the fee with CQUniversity or with us before you plan around it.</p>
          </div>
          ) : (
          <div className="rounded-2xl p-5 border border-amber-200 bg-amber-50">
            <h2 className="text-sm font-semibold text-amber-900 mb-1">Fee on request</h2>
            <p className="text-xs text-amber-800">
              We don&apos;t have a tuition estimate for this course yet — CQUniversity&apos;s own fee pages aren&apos;t publicly
              readable right now. Book a free session and we&apos;ll get the current fee confirmed with the university for you.
            </p>
            <Link href="/book-counselling" className="inline-block mt-3 text-xs font-semibold text-brand-700 hover:underline">Get this confirmed free →</Link>
          </div>
          )}

          {course.campusIntakes.length > 1 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Campuses and Intakes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {course.campusIntakes.map((ci) => (
                  <div key={ci.campus} className="flex justify-between gap-3 bg-gray-50 rounded-xl px-4 py-3">
                    <span className="font-semibold text-gray-900">{ci.campus}</span>
                    <span className="text-gray-600">{ci.months.join(', ')}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">The international fee is the same at every campus listed.</p>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">English Language Requirements</h2>
            {english.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {english.map((t) => (
                  <div key={t.label} className="bg-blue-50 rounded-xl p-4 text-center">
                    <p className="text-xl font-bold text-brand-700">{t.value}+</p>
                    <p className="text-xs font-semibold text-gray-700 mt-1">{t.label}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">{englishOnRequestNote(UNI_NAME)}</p>
            )}
          </div>

          <CourseRichContent course={course as any} universityName={UNI_NAME} universitySlug={UNIVERSITY_SLUG} />
          <div className="bg-brand-50 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 mb-3">Need Help Applying?</h2>
            <p className="text-sm text-gray-600 mb-4">Free 30-minute counselling session with our Australia team.</p>
            <Link href="/book-counselling" className="btn-gold inline-block">Book Free Counselling →</Link>
          </div>
        </div>

        <div className="space-y-5">
          <div className="sticky top-20">
            <LeadForm source={`cquniversity-course-${slug}-sidebar`} defaultCountry="Australia" />
            <div className="mt-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Related Links</h3>
              <div className="space-y-2">
                <a href={course.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-brand-700 hover:underline">Official Course Page ↗</a>
                <Link href="/universities/cquniversity/courses" className="block text-sm text-brand-700 hover:underline">All CQUniversity Courses →</Link>
                <Link href="/universities/country/australia" className="block text-sm text-brand-700 hover:underline">Study in Australia Guide →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
