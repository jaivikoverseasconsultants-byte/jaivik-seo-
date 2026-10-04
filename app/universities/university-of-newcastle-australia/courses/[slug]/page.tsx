import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { newcastleCoursesReal, getNewcastleCourseRealBySlug } from '@/data/newcastle-courses-real';
import { buildMetadata } from '@/lib/seo';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';
import CourseRichContent from '@/components/CourseRichContent';
import { feeDisplay, isFeeVerified } from '@/lib/fee-verification';

const UNIVERSITY_SLUG = 'university-of-newcastle-australia';
const UNI_NAME = 'University of Newcastle';

// No official University of Newcastle source is reachable — see data/newcastle-courses-real.ts's
// header comment. This page never claims a CRICOS code, a university-published fee or a
// post-study-work eligibility; everything shown is a labelled partner-platform estimate.

export async function generateStaticParams() {
  return newcastleCoursesReal.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const course = getNewcastleCourseRealBySlug(slug);
  if (!course) return {};
  return buildMetadata({
    title: `${course.name} at ${UNI_NAME} (Estimate)`,
    description: `${course.name} at the University of Newcastle — partner-platform estimate: ${course.duration}, ~A$${course.kcEstimate.tuitionMinAUD.toLocaleString('en-US')}/yr. Not independently verified. Apply with Jaivik Overseas — 13 years expertise, 99% visa success.`,
    path: `/universities/university-of-newcastle-australia/courses/${slug}`,
    keywords: [course.name, 'University of Newcastle', 'UON', 'study in Australia', course.level],
  });
}

export default async function CoursePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const course = getNewcastleCourseRealBySlug(slug);
  if (!course) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    provider: { '@type': 'CollegeOrUniversity', name: 'University of Newcastle', sameAs: 'https://www.newcastle.edu.au' },
    courseMode: 'full-time',
    educationalLevel: course.studyLevel,
    // No offers/price block: nothing here is a university-published fee.
  };

  return (
    <>
      <JsonLd data={schema} />
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4 flex-wrap">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities/university-of-newcastle-australia" className="hover:text-white">University of Newcastle</Link> /
            <Link href="/universities/university-of-newcastle-australia/courses" className="hover:text-white">Courses</Link> /
            <span className="text-white">{course.name}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇦🇺 University of Newcastle · Estimate only
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.name} at {UNI_NAME}</h1>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
                {[
                  // University-published fee: always "On request" here (feeVerified is false site-wide
                  // for this university). The partner-platform estimate is shown separately below.
                  { label: 'Annual Fee (university)', value: feeDisplay(course as any, course.annualAUD, 'AUD') },
                  { label: 'Duration', value: course.duration },
                  { label: 'Intakes', value: course.intakeMonths.length ? course.intakeMonths.map((m) => m.slice(0, 3)).join(' / ') : 'Rolling' },
                ].map((s) => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source={`university-of-newcastle-australia-course-${slug}`} defaultCountry="Australia" compact />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* No official source reachable: everything here, not just fee, is a partner-platform estimate.
              Guarded on isFeeVerified() so this box can never appear beside a verified fee. */}
          {!isFeeVerified(course as any) && (
          <div className="rounded-2xl p-5 border border-dashed border-amber-300 bg-amber-50">
            <h2 className="text-sm font-semibold text-amber-800 mb-1">Nothing on this page is independently verified</h2>
            <p className="text-xs text-amber-800 mb-3">
              The University of Newcastle&apos;s own course pages and handbook could not be read (Cloudflare-protected pages; the handbook&apos;s
              robots.txt allows only Googlebot). Duration, intakes and fee below come only from a partner platform and have not been checked
              against the university&apos;s own site. No CRICOS code is shown because it could not be confirmed, and no post-study-work
              visa eligibility is claimed for the same reason.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700 bg-white/60 rounded-xl p-4">
              <div><span className="block text-xs text-gray-500">Annual tuition (estimate)</span>~A${course.kcEstimate.tuitionMinAUD.toLocaleString('en-US')}{course.kcEstimate.tuitionMaxAUD !== course.kcEstimate.tuitionMinAUD ? `–${course.kcEstimate.tuitionMaxAUD.toLocaleString('en-US')}` : ''}</div>
              {course.kcEstimate.avgScholarshipAUD ? <div><span className="block text-xs text-gray-500">Average scholarship (estimate)</span>~A${course.kcEstimate.avgScholarshipAUD.toLocaleString('en-US')}</div> : null}
              {course.kcEstimate.initialDepositAUD ? <div><span className="block text-xs text-gray-500">Initial deposit (estimate)</span>~A${course.kcEstimate.initialDepositAUD.toLocaleString('en-US')}</div> : null}
            </div>
            <p className="text-xs text-amber-800 mt-3">Confirm every figure directly with the University of Newcastle or with us before you plan around it.</p>
          </div>
          )}

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Course Overview</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Qualification', course.name],
                ['Level', course.level],
                ['Duration (estimate)', `${course.duration} full-time`],
                ['Location', course.campus],
                ['Intakes (estimate)', course.intakeMonths.length ? course.intakeMonths.join(', ') : 'Rolling / contact university'],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col">
                  <span className="text-xs text-gray-500">{k}</span>
                  <span className="font-semibold text-gray-900 mt-0.5">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">English Language Requirements</h2>
            <p className="text-sm text-gray-600">Not published — not independently verified for the University of Newcastle. Confirm directly with the university or with us.</p>
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
            <LeadForm source={`university-of-newcastle-australia-course-${slug}-sidebar`} defaultCountry="Australia" />
            <div className="mt-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Related Links</h3>
              <div className="space-y-2">
                <a href={course.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-brand-700 hover:underline">Search the University&apos;s Website ↗</a>
                <Link href="/universities/university-of-newcastle-australia/courses" className="block text-sm text-brand-700 hover:underline">All University of Newcastle Courses →</Link>
                <Link href="/universities/country/australia" className="block text-sm text-brand-700 hover:underline">Study in Australia Guide →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
