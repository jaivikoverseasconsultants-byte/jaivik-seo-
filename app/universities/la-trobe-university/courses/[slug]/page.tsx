import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { laTrobeUniversityCourses, getLaTrobeUniversityCourseBySlug } from '@/data/la-trobe-university-courses';
import { buildMetadata } from '@/lib/seo';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';
import CourseRichContent from '@/components/CourseRichContent';

import { feeDisplay, feeDisplayINRLakh, feeSentenceINR, titleFeeFragment } from '@/lib/fee-verification';
import { courseAnnualINRLakh, RATE_TO_INR, inrToLakh } from '@/lib/currency';
import { publishedEnglishTests, englishOnRequestNote } from '@/lib/english-verification';

const UNIVERSITY_SLUG = 'la-trobe-university';
const UNI_NAME = 'La Trobe University';

export async function generateStaticParams() {
  return laTrobeUniversityCourses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const course = getLaTrobeUniversityCourseBySlug(slug);
  if (!course) return {};
  return buildMetadata({
    title: `${course.name} at ${UNI_NAME}`,
    description: `${course.name} at La Trobe University${feeSentenceINR(course as any, course.annualINR)}, ${course.duration}, intakes ${course.intakeMonths.join(', ')}. Apply with Jaivik Overseas — 13 years expertise, 99% visa success.`,
    path: `/universities/la-trobe-university/courses/${slug}`,
    keywords: [course.name, 'La Trobe University', 'La Trobe', 'study in Australia', course.level],
  });
}

export default async function CoursePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const course = getLaTrobeUniversityCourseBySlug(slug);
  if (!course) notFound();

  const feeINRLakh = courseAnnualINRLakh(course as any, 1) ?? '0';
  // Six-month graduate certificates are priced for the whole course, not per year.
  const wholeCourse = course.annualAUD === 0 && course.totalAUD > 0;
  const totalLakh = wholeCourse ? inrToLakh(course.totalAUD * RATE_TO_INR.AUD) : null;
  const inrValue = wholeCourse ? (totalLakh ? `≈ ₹${totalLakh} lakh` : feeDisplay(course as any, 0, 'INR')) : feeDisplayINRLakh(course as any, feeINRLakh, '');
  const english = publishedEnglishTests(UNIVERSITY_SLUG, course as never);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    provider: { '@type': 'CollegeOrUniversity', name: 'La Trobe University', sameAs: 'https://www.latrobe.edu.au' },
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
            <Link href="/universities/la-trobe-university" className="hover:text-white">La Trobe University</Link> /
            <Link href="/universities/la-trobe-university/courses" className="hover:text-white">Courses</Link> /
            <span className="text-white">{course.name}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇦🇺 La Trobe University · {course.campus}
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
              <LeadForm source={`la-trobe-university-course-${slug}`} defaultCountry="Australia" compact />
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
                ['CRICOS code', course.cricos],
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
                {course.feeSourceUrl && <> <a href={course.feeSourceUrl} className="underline" target="_blank" rel="noopener noreferrer">Source: La Trobe course page (international)</a></>}
              </p>
            )}
          </div>

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
            <LeadForm source={`la-trobe-university-course-${slug}-sidebar`} defaultCountry="Australia" />
            <div className="mt-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Related Links</h3>
              <div className="space-y-2">
                <a href={course.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-brand-700 hover:underline">Official Course Page ↗</a>
                <Link href="/universities/la-trobe-university/courses" className="block text-sm text-brand-700 hover:underline">All La Trobe University Courses →</Link>
                <Link href="/universities/country/australia" className="block text-sm text-brand-700 hover:underline">Study in Australia Guide →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
