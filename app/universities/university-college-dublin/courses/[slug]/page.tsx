import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ucdCourses, getUcdCourseBySlug } from '@/data/ucd-courses';
import { buildMetadata } from '@/lib/seo';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';
import CourseRichContent from '@/components/CourseRichContent';

import { isPswEligible } from '@/lib/psw-eligibility';
import { showOnCoursePage, entryRequirementsVaryByCourse } from '@/lib/course-field-variance';

import { feeDisplay, feeDisplayINRLakh, isFeeVerified, feeSentenceINR, titleFeeFragment } from '@/lib/fee-verification';
import { RATE_TO_INR, courseAnnualINRLakh } from '@/lib/currency';
/** decides which "course facts" are really university-wide constants */
const UNIVERSITY_SLUG = 'university-college-dublin';
export async function generateStaticParams() {
  return (ucdCourses as unknown as any[]).map((c: any) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const course = getUcdCourseBySlug(slug);
  if (!course) return {};
  return buildMetadata({
    title: `${course.name} at University College Dublin — ${titleFeeFragment(course as any, course.annualINR)}IELTS & Requirements for Indian Students`,
    description: `${course.name} at University College Dublin, ${(course as any).city || course.country}${feeSentenceINR(course as any, course.annualINR)} IELTS ${course.ieltsMin}+, intakes ${course.intakeMonths.join(' & ')}. Apply with Jaivik Overseas — 13 years expertise, 99% visa success.`,
    path: `/universities/university-college-dublin/courses/${slug}`,
    keywords: [course.name, 'UCD', 'University College Dublin', 'study in Ireland', course.level],
  });
}

export default async function CoursePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const course = getUcdCourseBySlug(slug);
  if (!course) notFound();

  const schema = {
    '@context': 'https://schema.org', '@type': 'Course',
    name: course.name,
    provider: { '@type': 'CollegeOrUniversity', name: 'University College Dublin', sameAs: 'https://www.ucd.ie' },
    courseMode: 'full-time',
    educationalLevel: course.studyLevel,
    ...(course.durationYears > 0 ? { timeRequired: `P${course.durationYears}Y` } : {}),
    // withdrawn courses point at the university's course-listing page,

    // which is not this course's own page — don't assert it as the Course url

    ...((course as any).withdrawn ? {} : { url: course.url }),
  };

  const feeINRLakh = (courseAnnualINRLakh(course as any, 1) ?? '0');

  return (
    <>
      <JsonLd data={schema} />
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="/universities/university-college-dublin" className="hover:text-white">UCD</Link> /
            <Link href="/universities/university-college-dublin/courses" className="hover:text-white">Courses</Link> /
            <span className="text-white">{course.name}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇮🇪 University College Dublin · Dublin, Ireland
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{(course as any).withdrawn ? `${course.name} — No Longer Offered` : <>{course.name} at University College Dublin — {titleFeeFragment(course as any, course.annualINR)}IELTS &amp; Requirements for Indian Students</>}</h1>
              <p className="text-blue-200 text-lg mb-5">{course.studyLevel} · {course.duration} · {course.campus}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Annual Fee (EUR)', value: feeDisplay(course as any, course.annualEUR, 'EUR') },
                  { label: 'Fee in INR', value: feeDisplayINRLakh(course as any, feeINRLakh, '/yr') },
                  ...(showOnCoursePage(UNIVERSITY_SLUG, 'ieltsMin') ? [{ label: 'IELTS Minimum', value: `${course.ieltsMin}+` }] : []),
                  { label: 'Duration', value: course.duration },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source={`ucd-course-${slug}`} defaultCountry="Ireland" compact />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {(course as any).withdrawn && (
          <div className="lg:col-span-2 bg-amber-50 border border-amber-300 rounded-2xl p-6" role="note">
            <h2 className="text-lg font-bold text-amber-900 mb-2">
              ⚠️ This course is no longer offered by University College Dublin
            </h2>
            <p className="text-sm text-amber-900/90">
              <strong>{course.name}</strong> is no longer listed by the university and is not
              open for applications. The fees, entry requirements and intake dates below were
              accurate when the course was last offered and are kept for reference only — they
              should not be used to plan an application.
            </p>
            {(course as any).alternatives?.length > 0 && (
              <>
                <p className="text-sm font-semibold text-amber-900 mt-4 mb-2">
                  Current courses at this university:
                </p>
                <ul className="space-y-1.5">
                  {((course as any).alternatives as { name: string; slug: string }[]).map(alt => (
                    <li key={alt.slug}>
                      <Link
                        href={`/universities/university-college-dublin/courses/${alt.slug}`}
                        className="text-sm font-medium text-brand-700 hover:underline"
                      >
                        {alt.name} →
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <p className="text-xs text-amber-900/80 mt-4">
              Jaivik Overseas can match you to a current course free of charge.
            </p>
          </div>
        )}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Course Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Qualification', value: course.level },
                { label: 'Duration', value: course.duration + ' full-time' },
                ...(showOnCoursePage(UNIVERSITY_SLUG, 'campus') ? [{ label: 'Campus', value: course.campus }] : []),
                ...(showOnCoursePage(UNIVERSITY_SLUG, 'intakeMonths') ? [{ label: 'Intakes', value: course.intakeMonths.join(' & ') }] : []),
                { label: 'Annual Tuition (EUR)', value: feeDisplay(course as any, course.annualEUR, 'EUR') },
                { label: 'Annual Tuition (USD)', value: feeDisplay(course as any, course.annualUSD, 'USD') },
                { label: 'Total Course Fee', value: feeDisplay(course as any, course.totalEUR, 'EUR') },
              ].map(f => (
                <div key={f.label} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">English Language Requirements</h2>
            {entryRequirementsVaryByCourse(UNIVERSITY_SLUG) ? (
              <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'IELTS Academic', value: `${course.ieltsMin}+`, sub: 'No band below 5.5' },
                { label: 'TOEFL iBT', value: `${course.toeflMin}+`, sub: 'Writing 21+' },
                { label: 'PTE Academic', value: `${course.pteMin}+`, sub: 'No band below 51' },
              ].map(e => (
                <div key={e.label} className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-xl font-bold text-brand-700">{e.value}</p>
                  <p className="text-xs font-semibold text-gray-700 mt-1">{e.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{e.sub}</p>
                </div>
              ))}
            </div>
            ) : (
              <p className="text-sm text-gray-600">
                University College Dublin publishes one English language requirement across its courses
                rather than a per-course score. See the full entry requirements and intake dates on the{' '}
                <Link href={`/universities/${UNIVERSITY_SLUG}`} className="text-brand-700 font-medium hover:underline">university page</Link>.
              </p>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Total Cost of Study (Indian Students)</h2>
            <div className="space-y-3">
              {[
                { label: `Tuition × ${course.durationYears} yr${course.durationYears !== 1 ? 's' : ''}`, value: feeDisplay(course as any, course.totalEUR, 'EUR'), hi: true },
                { label: `Living × ${course.durationYears} yr${course.durationYears !== 1 ? 's' : ''}`, value: `€${(course.livingCostEUR * course.durationYears).toLocaleString()}` },
                { label: 'Total Estimated Cost', value: (isFeeVerified(course as any) ? `€${(course.totalEUR + course.livingCostEUR * course.durationYears).toLocaleString()}` : 'On request'), hi: true },
                { label: 'In Indian Rupees (₹)', value: (isFeeVerified(course as any) ? `₹${((course.totalEUR + course.livingCostEUR * course.durationYears) * 1.08 * RATE_TO_INR.USD / 100000).toFixed(1)} Lakh` : 'On request'), hi: true },
              ].map(r => (
                <div key={r.label} className={`flex justify-between items-center p-3 rounded-xl ${r.hi ? 'bg-brand-50 font-bold' : 'bg-gray-50'}`}>
                  <span className="text-sm text-gray-700">{r.label}</span>
                  <span className={`text-sm ${r.hi ? 'text-brand-700' : 'text-gray-900'}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Visa & Work Rights — Ireland</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Student Visa', value: 'Ireland Student Visa' },
                { label: 'Work Rights (Term)', value: '20 hrs/week' },
                { label: 'Work Rights (Vacation)', value: 'Full-time' },
                ...(isPswEligible(course as any) ? [{ label: 'Post-Study Visa', value: 'Ireland Graduate Visa – 2 years' }] : []),
              ].map(f => (
                <div key={f.label} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{f.value}</p>
                </div>
              ))}
            </div>
          </div>


          <CourseRichContent course={course as any} universityName="University College Dublin" universitySlug="university-college-dublin" />
          <div className="bg-brand-700 rounded-2xl p-6 text-white text-center">
            <h2 className="text-xl font-bold mb-2">Interested in {course.name}?</h2>
            <p className="text-blue-200 text-sm mb-4">
              Book a free counselling session. Our Ireland admissions advisors help Indian students every step of the way.
            </p>
            <Link href="/book-counselling" className="btn-gold inline-block">Get Free Guidance →</Link>
          </div>
        </div>

        <div className="space-y-5">
          <div className="sticky top-20">
            <LeadForm source={`ucd-course-${slug}-sidebar`} defaultCountry="Ireland" />
            <div className="mt-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Related Links</h3>
              <div className="space-y-2">
                <a href={course.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-brand-700 hover:underline">{(course as any).withdrawn ? 'University Course Listing (this course is no longer offered) ↗' : 'Official Course Page ↗'}</a>
                <Link href="/universities/university-college-dublin/courses" className="block text-sm text-brand-700 hover:underline">All UCD Courses →</Link>
                <Link href="/universities/country/ireland" className="block text-sm text-brand-700 hover:underline">Study in Ireland Guide →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
