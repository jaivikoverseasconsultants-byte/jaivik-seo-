import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { lundUniversityCourses, getLundUniversityCourseBySlug } from '@/data/lund-university-courses';
import { buildMetadata } from '@/lib/seo';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';
import CourseRichContent from '@/components/CourseRichContent';

export function generateStaticParams() {
  return lundUniversityCourses.map(c => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const course = getLundUniversityCourseBySlug(slug);
  if (!course) return {};
  return buildMetadata({
    title: `${course.name} at Lund University 2026 – Fees, IELTS & Requirements`,
    description: `${course.name} at Lund University: ${course.duration}, €${course.annualEUR.toLocaleString()}/EUR/yr. IELTS ${course.ieltsMin}+. Intake: ${course.intakeMonths.join(' & ')}. Free guidance from Jaivik Overseas.`,
    path: `/universities/lund-university/courses/${slug}`,
    keywords: [course.name, 'Lund University', 'study in Sweden', course.level],
  });
}

export default async function CourseDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const course = getLundUniversityCourseBySlug(slug);
  if (!course) notFound();

  const feeINRLakh = (course.annualINR / 100000).toFixed(1);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    provider: { '@type': 'CollegeOrUniversity', name: 'Lund University', sameAs: 'https://www.lu.se' },
    courseMode: 'full-time',
    educationalLevel: course.studyLevel,
    timeRequired: `P${course.durationYears}Y`,
  };

  return (
    <>
      <JsonLd data={schema} />
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4 flex-wrap">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities/lund-university/courses" className="hover:text-white">Lund</Link> /
            <span className="text-white">{course.name}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇸🇪 Lund University · Lund, Sweden
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.name}</h1>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                {[
                  { label: 'Annual Fee', value: `€${course.annualEUR.toLocaleString()}` },
                  { label: 'Fee (INR)', value: `₹${feeINRLakh}L/yr` },
                  { label: 'Duration', value: course.duration },
                  { label: 'IELTS Min', value: `${course.ieltsMin}+` },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source="lund-university-${slug}" defaultCountry="Sweden" compact />
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
                ['University', 'Lund University'],
                ['Level', course.level],
                ['Duration', course.duration],
                ['Campus', course.campus],
                ['Country', 'Sweden'],
                ['Intake', course.intakeMonths.join(' & ')],
                ['IELTS Minimum', `${course.ieltsMin} overall`],
                ['TOEFL Minimum', `${course.toeflMin}+`],
                ['Annual Fee (EUR)', `€${course.annualEUR.toLocaleString()}`],
                ['Annual Fee (USD)', `$${course.annualUSD.toLocaleString()}`],
                ['Annual Fee (INR)', `₹${(course.annualINR/100000).toFixed(1)}L`],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col">
                  <span className="text-xs text-gray-500">{k}</span>
                  <span className="font-semibold text-gray-900 mt-0.5">{v}</span>
                </div>
              ))}
            </div>
          </div>


          <CourseRichContent course={course as any} universityName="Lund University" universitySlug="lund-university" />
          <div className="bg-brand-50 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 mb-3">Need Help Applying?</h2>
            <p className="text-sm text-gray-600 mb-4">Our counsellors have guided 500+ Indian students to {course.level} programs in Sweden. Free 30-min session.</p>
            <Link href="/book-counselling" className="btn-gold inline-block">Book Free Counselling →</Link>
          </div>
        </div>

        <div>
          <div className="sticky top-20">
            <LeadForm source="lund-university-detail-sidebar" defaultCountry="Sweden" />
          </div>
        </div>
      </div>
    </>
  );
}
