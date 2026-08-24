import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ljmuCourses, getLjmuCourseBySlug } from '@/data/ljmu-courses';
import { buildMetadata } from '@/lib/seo';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';
import CourseRichContent from '@/components/CourseRichContent';

import { showOnCoursePage, entryRequirementsVaryByCourse } from '@/lib/course-field-variance';

/** decides which "course facts" are really university-wide constants */
const UNIVERSITY_SLUG = 'liverpool-john-moores-university';
export function generateStaticParams() {
  return ljmuCourses.map(c => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const course = getLjmuCourseBySlug(slug);
  if (!course) return {};
  return buildMetadata({
    title: `${course.name} at Liverpool John Moores University — Fees in INR, IELTS & Requirements for Indian Students`,
    description: `${course.name} at LJMU, Liverpool${course.annualINR > 0 ? ` costs ₹${(course.annualINR / 100000).toFixed(1)}L/year for Indian students.` : '.'}${course.ieltsMin > 0 ? ` IELTS ${course.ieltsMin}+,` : ''} intakes ${course.intakeMonths.join(' & ')}. Apply with Jaivik Overseas — 13 years expertise, 99% visa success.`,
    path: `/universities/liverpool-john-moores-university/courses/${slug}`,
    keywords: [course.name, 'LJMU', 'Liverpool John Moores University', 'study in UK', course.level],
  });
}

export default async function CoursePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const course = getLjmuCourseBySlug(slug);
  if (!course) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    provider: {
      '@type': 'CollegeOrUniversity',
      name: 'Liverpool John Moores University',
      sameAs: 'https://www.ljmu.ac.uk',
    },
    courseMode: 'full-time',
    educationalLevel: course.studyLevel,
    ...(course.durationYears > 0 ? { timeRequired: `P${course.durationYears}Y` } : {}),
    // withdrawn courses point at the university's course-listing page,

    // which is not this course's own page — don't assert it as the Course url

    ...((course as any).withdrawn ? {} : { url: course.url }),
  };

  const feeINRLakh = (course.annualINR / 100000).toFixed(1);

  return (
    <>
      <JsonLd data={schema} />

      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="/universities/liverpool-john-moores-university" className="hover:text-white">Liverpool John Moores</Link> /
            <Link href="/universities/liverpool-john-moores-university/courses" className="hover:text-white">Courses</Link> /
            <span className="text-white">{course.name}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇬🇧 Liverpool John Moores University · Liverpool, UK
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{(course as any).withdrawn ? `${course.name} — No Longer Offered` : <>{course.name} at Liverpool John Moores University — Fees in INR, IELTS &amp; Requirements for Indian Students</>}</h1>
              <p className="text-blue-200 text-lg mb-5">
                {course.studyLevel} · {course.duration} · {course.campus}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  course.annualGBP > 0 ? { label: 'Annual Fee (GBP)', value: `£${course.annualGBP.toLocaleString()}` } : null,
                  course.annualINR > 0 ? { label: 'Fee in INR', value: `₹${feeINRLakh}L/yr` } : null,
                  course.ieltsMin > 0 ? { label: 'IELTS Minimum', value: `${course.ieltsMin}+` } : null,
                  { label: 'Duration', value: course.duration },
                ].filter((s): s is { label: string; value: string } => s !== null).map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source={`ljmu-course-${slug}`} defaultCountry="UK" compact />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {(course as any).withdrawn && (
          <div className="lg:col-span-2 bg-amber-50 border border-amber-300 rounded-2xl p-6" role="note">
            <h2 className="text-lg font-bold text-amber-900 mb-2">
              ⚠️ This course is no longer offered by Liverpool John Moores University
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
                        href={`/universities/liverpool-john-moores-university/courses/${alt.slug}`}
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
                course.annualGBP > 0 ? { label: 'Annual Tuition (GBP)', value: `£${course.annualGBP.toLocaleString()}` } : null,
                course.annualUSD > 0 ? { label: 'Annual Tuition (USD)', value: `$${course.annualUSD.toLocaleString()}` } : null,
                course.totalGBP > 0 ? { label: 'Total Course Fee', value: `£${course.totalGBP.toLocaleString()}` } : null,
              ].filter((f): f is { label: string; value: string } => f !== null).map(f => (
                <div key={f.label} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          {(course.ieltsMin > 0 || course.toeflMin > 0 || course.pteMin > 0) && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">English Language Requirements</h2>
            {entryRequirementsVaryByCourse(UNIVERSITY_SLUG) ? (
              <div className="grid grid-cols-3 gap-4">
              {[
                course.ieltsMin > 0 ? { label: 'IELTS Academic', value: `${course.ieltsMin}+`, sub: 'No band below 5.5' } : null,
                course.toeflMin > 0 ? { label: 'TOEFL iBT', value: `${course.toeflMin}+`, sub: 'Writing 21+' } : null,
                course.pteMin > 0 ? { label: 'PTE Academic', value: `${course.pteMin}+`, sub: 'No band below 51' } : null,
              ].filter((e): e is { label: string; value: string; sub: string } => e !== null).map(e => (
                <div key={e.label} className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-xl font-bold text-brand-700">{e.value}</p>
                  <p className="text-xs font-semibold text-gray-700 mt-1">{e.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{e.sub}</p>
                </div>
              ))}
            </div>
            ) : (
              <p className="text-sm text-gray-600">
                Liverpool John Moores University publishes one English language requirement across its courses
                rather than a per-course score. See the full entry requirements and intake dates on the{' '}
                <Link href={`/universities/${UNIVERSITY_SLUG}`} className="text-brand-700 font-medium hover:underline">university page</Link>.
              </p>
            )}
          </div>
          )}

          {course.annualINR > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Total Cost of Study (Indian Students)</h2>
            <div className="space-y-3">
              {[
                { label: `Tuition Fee × ${course.durationYears} year${course.durationYears !== 1 ? 's' : ''}`, value: `£${course.totalGBP.toLocaleString()}`, highlight: true },
                { label: `Living Cost × ${course.durationYears} year${course.durationYears !== 1 ? 's' : ''}`, value: `£${(course.livingCostGBP * course.durationYears).toLocaleString()}` },
                { label: 'Total Estimated Cost', value: `£${(course.totalGBP + course.livingCostGBP * course.durationYears).toLocaleString()}`, highlight: true },
                { label: 'In Indian Rupees (₹)', value: `₹${((course.totalGBP + course.livingCostGBP * course.durationYears) * 107 / 100000).toFixed(1)} Lakh`, highlight: true },
              ].map(r => (
                <div key={r.label} className={`flex justify-between items-center p-3 rounded-xl ${r.highlight ? 'bg-brand-50 font-bold' : 'bg-gray-50'}`}>
                  <span className="text-sm text-gray-700">{r.label}</span>
                  <span className={`text-sm ${r.highlight ? 'text-brand-700' : 'text-gray-900'}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
          )}

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">UK Student Visa & Work Rights</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Visa Type', value: 'UK Student Visa' },
                { label: 'Work Rights (Term)', value: '20 hrs/week' },
                { label: 'Work Rights (Vacation)', value: 'Full-time' },
                { label: 'Graduate Route Visa', value: '2 years (3 for PhD)' },
              ].map(f => (
                <div key={f.label} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          <CourseRichContent course={course as any} universityName="Liverpool John Moores University" universitySlug="liverpool-john-moores-university" />
          <div className="bg-brand-700 rounded-2xl p-6 text-white text-center">
            <h2 className="text-xl font-bold mb-2">Interested in {course.name}?</h2>
            <p className="text-blue-200 text-sm mb-4">
              Book a free counselling session. Our UK admissions advisors help Indian students every step of the way.
            </p>
            <Link href="/book-counselling" className="btn-gold inline-block">
              Get Free Guidance →
            </Link>
          </div>
        </div>

        <div className="space-y-5">
          <div className="sticky top-20">
            <LeadForm source={`ljmu-course-${slug}-sidebar`} defaultCountry="UK" />
            <div className="mt-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Related Links</h3>
              <div className="space-y-2">
                <a href={course.url} target="_blank" rel="noopener noreferrer"
                  className="block text-sm text-brand-700 hover:underline">
                  {(course as any).withdrawn
                    ? 'University Course Listing (this course is no longer offered) ↗'
                    : 'Official Course Page ↗'}
                </a>
                <Link href="/universities/liverpool-john-moores-university/courses" className="block text-sm text-brand-700 hover:underline">
                  All LJMU Courses →
                </Link>
                <Link href="/universities/country/uk" className="block text-sm text-brand-700 hover:underline">
                  Study in UK Guide →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
