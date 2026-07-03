import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { umassAmherstCourses, getUmassAmherstCourseBySlug } from '@/data/umass-courses';
import { buildMetadata } from '@/lib/seo';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';
import CourseRichContent from '@/components/CourseRichContent';

export const dynamicParams = false;

export function generateStaticParams() {
  return umassAmherstCourses.map(c => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const course = getUmassAmherstCourseBySlug(slug);
  if (!course) return {};
  return buildMetadata({
    title: `${course.name} at University of Massachusetts Amherst — Fees, IELTS & Intake 2026`,
    description: `${course.name} at University of Massachusetts Amherst costs ₹${((course.annualINR || 0) / 100000).toFixed(1)}L/year. IELTS ${course.ieltsMin}+, intakes ${course.intakeMonths?.join(' & ')}. Free guidance from Jaivik Overseas.`,
    path: `/universities/umass-amherst/courses/${slug}`,
    keywords: [course.name, 'UMass Amherst', 'University of Massachusetts Amherst', 'study in United States', course.level],
    noIndex: true,
  });
}

export default async function CoursePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const course = getUmassAmherstCourseBySlug(slug);
  if (!course) notFound();

  const feeDisplay = course.annualUSD ? `$${(course.annualUSD as number).toLocaleString()}` : 'Contact for fees';
  const feeINRLakh = ((course.annualINR || 0) / 100000).toFixed(1);

  const schema = {
    '@context': 'https://schema.org', '@type': 'Course',
    name: course.name,
    provider: { '@type': 'CollegeOrUniversity', name: 'University of Massachusetts Amherst', sameAs: 'https://www.umass.edu' },
    courseMode: 'full-time',
    educationalLevel: course.studyLevel,
    url: course.url,
  };

  return (
    <>
      <JsonLd data={schema} />
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="/universities/umass-amherst/courses" className="hover:text-white">UMass Amherst</Link> /
            <span className="text-white">{course.name}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇺🇸 University of Massachusetts Amherst · Amherst, United States
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.name}</h1>
              <p className="text-blue-200 text-lg mb-5">{course.studyLevel} · {course.duration} · {course.campus}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Annual Fee', value: feeDisplay },
                  { label: 'Fee in INR', value: `₹${feeINRLakh}L/yr` },
                  { label: 'IELTS Min', value: `${course.ieltsMin}+` },
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
              <LeadForm source={`umass-amherst-${slug}`} defaultCountry="United States" compact />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Course Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ['Qualification', course.level],
                ['Duration', course.duration],
                ['Campus', course.campus],
                ['Intakes', course.intakeMonths?.join(' & ')],
                ['Annual Fee', feeDisplay],
                ['Fee in INR', `₹${feeINRLakh}L/yr`],
                ['Living Cost', `$${course.livingCostUSD?.toLocaleString()}/yr`],
              ].map(([label, value]) => (
                <div key={label as string} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
                  <p className="text-sm font-semibold text-gray-900">{value ?? '—'}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">English Language Requirements</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'IELTS Academic', value: `${course.ieltsMin}+`, sub: 'Overall band' },
                { label: 'TOEFL iBT', value: `${course.toeflMin}+`, sub: 'Internet-based' },
                { label: 'PTE Academic', value: `${course.pteMin ?? '65'}+`, sub: 'Pearson' },
              ].map(e => (
                <div key={e.label} className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-xl font-bold text-brand-700">{e.value}</p>
                  <p className="text-xs font-semibold text-gray-700 mt-1">{e.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{e.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <CourseRichContent course={course as any} universityName="University of Massachusetts Amherst" universitySlug="umass-amherst" />

          <div className="bg-brand-700 rounded-2xl p-6 text-white text-center">
            <h2 className="text-xl font-bold mb-2">Interested in {course.name}?</h2>
            <p className="text-blue-200 text-sm mb-4">Free counselling for Indian students — SOP, visa, and admission support.</p>
            <Link href="/book-counselling" className="btn-gold inline-block">Get Free Guidance →</Link>
          </div>
        </div>

        <div className="space-y-5">
          <div className="sticky top-20">
            <LeadForm source={`umass-amherst-${slug}-sidebar`} defaultCountry="United States" />
            <div className="mt-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Related Links</h3>
              <div className="space-y-2">
                <a href={course.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-brand-700 hover:underline">Official Course Page ↗</a>
                <Link href="/universities/umass-amherst/courses" className="block text-sm text-brand-700 hover:underline">All UMass Amherst Courses →</Link>
                <Link href="/universities/country/usa" className="block text-sm text-brand-700 hover:underline">Study in United States Guide →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
