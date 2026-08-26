import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { plymouthW2Courses, getPlymouthW2CourseBySlug } from '@/data/plymouth-w2-courses';
import { buildMetadata } from '@/lib/seo';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';
import CourseRichContent from '@/components/CourseRichContent';
import CourseKeyFacts from '@/components/CourseKeyFacts';
import { feeSentenceINR, feeDisplay, feeDisplayINRLakh, titleFeeFragment } from '@/lib/fee-verification';
import { courseAnnualINRLakh } from '@/lib/currency';

export async function generateStaticParams() {
  return plymouthW2Courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = getPlymouthW2CourseBySlug(slug);
  if (!course) return {};
  return buildMetadata({
    title: `${course.name} at University of Plymouth — ${titleFeeFragment(course as any, course.annualINR)}IELTS & Requirements for Indian Students`,
    description: `${course.name} at University of Plymouth, Plymouth${feeSentenceINR(course as any, course.annualINR)}${course.ieltsMin > 0 ? ` IELTS ${course.ieltsMin}+,` : ''} Apply with Jaivik Overseas — 13 years expertise, 99% visa success.`,
    path: `/universities/university-of-plymouth/courses/${slug}`,
    keywords: [course.name, 'Plymouth', 'University of Plymouth', 'study in UK', course.level],
  });
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getPlymouthW2CourseBySlug(slug);
  if (!course) notFound();

  const fee = (course.annualGBP || course.annualUSD);
  const feeINRLakh = (courseAnnualINRLakh(course as any, 1) ?? '0');
  const schema = { '@context': 'https://schema.org', '@type': 'Course', name: course.name, provider: { '@type': 'CollegeOrUniversity', name: 'University of Plymouth', sameAs: 'https://www.plymouth.ac.uk' }, courseMode: 'full-time', educationalLevel: course.studyLevel };

  return (
    <>
      <JsonLd data={schema} />
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4 flex-wrap">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="/universities/university-of-plymouth" className="hover:text-white">Plymouth</Link> /
            <Link href="/universities/university-of-plymouth/courses" className="hover:text-white">Courses</Link> /
            <span>{course.name}</span>
          </div>
          <div className="inline-block bg-white/10 text-blue-100 text-xs px-3 py-1 rounded-full mb-3">{course.level} · {course.studyLevel}</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.name} at University of Plymouth — {titleFeeFragment(course as any, course.annualINR)}IELTS &amp; Requirements for Indian Students</h1>
          <p className="text-blue-100 text-lg">University of Plymouth · Plymouth, UK · {course.duration}</p>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Program Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  fee > 0 ? { label: 'Annual Fee', value: feeDisplay(course as any, fee, 'GBP'), sub: feeDisplayINRLakh(course as any, feeINRLakh, '/year') } : null,
                  course.ieltsMin > 0 ? { label: 'IELTS', value: `${course.ieltsMin}+`, sub: undefined } : null,
                  { label: 'Duration', value: course.duration, sub: course.studyLevel },
                  { label: 'Campus', value: 'Plymouth', sub: 'UK' },
                ].filter((x): x is { label: string; value: string; sub: string | undefined } => x !== null).map(({ label, value, sub }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">{label}</div>
                    <div className="font-bold text-gray-900">{value}</div>
                    {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
                  </div>
                ))}
              </div>
            </div>
            <CourseKeyFacts course={course as any} universityName="University of Plymouth" universitySlug="university-of-plymouth" />
          </div>
          <div className="space-y-6">
            <CourseRichContent course={course as any} universityName="University of Plymouth" universitySlug="university-of-plymouth" />
            <div className="bg-brand-700 text-white rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-2">Apply to {course.name}</h3>
              <p className="text-blue-100 text-sm mb-4">Get free expert guidance</p>
              <Link href="/thank-you" className="block w-full bg-white text-brand-700 text-center font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors">Apply Now – Free Guidance</Link>
            </div>
            <Link href="/universities/university-of-plymouth/courses" className="flex items-center gap-2 text-brand-700 hover:text-brand-900 font-medium text-sm">← All Plymouth Courses</Link>
          </div>
        </div>
      </section>
      <section className="bg-brand-50 py-12 px-4 mt-4"><div className="max-w-2xl mx-auto"><h2 className="text-2xl font-bold text-center text-brand-900 mb-2">Ready to Apply?</h2><p className="text-center text-gray-600 mb-6">Get personalised guidance from our expert counsellors</p><LeadForm /></div></section>
    </>
  );
}
