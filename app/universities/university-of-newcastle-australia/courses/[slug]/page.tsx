import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { uonCourses, getUonCourseBySlug } from '@/data/uon-courses';
import { buildMetadata } from '@/lib/seo';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';
import CourseRichContent from '@/components/CourseRichContent';

export const dynamicParams = false;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const course = getUonCourseBySlug(slug);
  if (!course) return {};
  return buildMetadata({
    title: `${course.name} at University of Newcastle — Fees, IELTS & Intake for Indian Students 2026`,
    description: `${course.name} at University of Newcastle, ${(course as any).city || course.country} costs ₹${(course.annualINR / 100000).toFixed(1)}L/year for Indian students. IELTS ${course.ieltsMin}+, intakes ${course.intakeMonths.join(' & ')}. Apply with Jaivik Overseas — 13 years expertise, 99% visa success.`,
    path: `/universities/university-of-newcastle-australia/courses/${slug}`,
    keywords: [course.name, 'UoN', 'University of Newcastle', 'study in Australia', course.level],
    noIndex: true
  });
}

export default async function CoursePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const course = getUonCourseBySlug(slug);
  if (!course) notFound();

  const schema = {
    '@context': 'https://schema.org', '@type': 'Course',
    name: course.name,
    provider: { '@type': 'CollegeOrUniversity', name: 'University of Newcastle', sameAs: 'https://www.newcastle.edu.au' },
    courseMode: 'full-time',
    educationalLevel: course.studyLevel,
    timeRequired: `P${course.durationYears}Y`,
    url: course.url,
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
            <Link href="/universities/university-of-newcastle-australia" className="hover:text-white">UoN</Link> /
            <Link href="/universities/university-of-newcastle-australia/courses" className="hover:text-white">Courses</Link> /
            <span className="text-white">{course.name}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇦🇺 University of Newcastle · Newcastle, Australia
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.name}</h1>
              <p className="text-blue-200 text-lg mb-5">{course.studyLevel} · {course.duration} · {course.campus}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Annual Fee (AUD)', value: `A$${course.annualAUD.toLocaleString()}` },
                  { label: 'Fee in INR', value: `₹${feeINRLakh}L/yr` },
                  { label: 'IELTS Minimum', value: `${course.ieltsMin}+` },
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
              <LeadForm source={`uon-course-${slug}`} defaultCountry="Australia" compact />
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
                { label: 'Qualification', value: course.level },
                { label: 'Duration', value: course.duration + ' full-time' },
                { label: 'Campus', value: course.campus },
                { label: 'Intakes', value: course.intakeMonths.join(' & ') },
                { label: 'Annual Tuition (AUD)', value: `A$${course.annualAUD.toLocaleString()}` },
                { label: 'Annual Tuition (USD)', value: `$${course.annualUSD.toLocaleString()}` },
                { label: 'Living Cost (AUD/yr)', value: `A$${course.livingCostAUD.toLocaleString()}` },
                { label: 'Total Course Fee', value: `A$${course.totalAUD.toLocaleString()}` },
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
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Total Cost of Study (Indian Students)</h2>
            <div className="space-y-3">
              {[
                { label: `Tuition × ${course.durationYears} yr${course.durationYears !== 1 ? 's' : ''}`, value: `A$${course.totalAUD.toLocaleString()}`, hi: true },
                { label: `Living × ${course.durationYears} yr${course.durationYears !== 1 ? 's' : ''}`, value: `A$${(course.livingCostAUD * course.durationYears).toLocaleString()}` },
                { label: 'Total Estimated Cost', value: `A$${(course.totalAUD + course.livingCostAUD * course.durationYears).toLocaleString()}`, hi: true },
                { label: 'In Indian Rupees (₹)', value: `₹${((course.totalAUD + course.livingCostAUD * course.durationYears) * 0.65 * 84 / 100000).toFixed(1)} Lakh`, hi: true },
              ].map(r => (
                <div key={r.label} className={`flex justify-between items-center p-3 rounded-xl ${r.hi ? 'bg-brand-50 font-bold' : 'bg-gray-50'}`}>
                  <span className="text-sm text-gray-700">{r.label}</span>
                  <span className={`text-sm ${r.hi ? 'text-brand-700' : 'text-gray-900'}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Visa & Work Rights — Australia</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Student Visa', value: 'Australia Student Visa' },
                { label: 'Work Rights (Term)', value: '48 hrs/fortnight' },
                { label: 'Work Rights (Vacation)', value: 'Full-time' },
                { label: 'Post-Study Visa', value: '485 Post-Study Work Visa – 2 to 4 years' },
              ].map(f => (
                <div key={f.label} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Post-Study Work Rights &amp; PR Pathway</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm font-bold text-blue-900 mb-1">485 Graduate Visa (Temporary Graduate)</p>
                <p className="text-sm text-blue-800">After completing your degree, apply for the Subclass 485 Post-Study Work Stream. Work full-time anywhere in Australia — 2 years for Bachelor's, 3 years for Honours/Masters, 4 years for PhD.</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                <p className="text-sm font-bold text-green-900 mb-1">Skilled Independent Visa (Subclass 189) Pathway</p>
                <p className="text-sm text-green-800">Australian work experience from your 485 Visa contributes to your points for the Skilled Independent Visa (SC 189). Skilled occupations from engineering, IT, healthcare, and accounting fields are in high demand.</p>
              </div>
            </div>
          </div>


          <CourseRichContent course={course as any} universityName="University of Newcastle" universitySlug="university-of-newcastle-australia" />
          <div className="bg-brand-700 rounded-2xl p-6 text-white text-center">
            <h2 className="text-xl font-bold mb-2">Interested in {course.name}?</h2>
            <p className="text-blue-200 text-sm mb-4">
              Book a free counselling session. Our Australia admissions advisors help Indian students every step of the way.
            </p>
            <Link href="/book-counselling" className="btn-gold inline-block">Get Free Guidance →</Link>
          </div>
        </div>

        <div className="space-y-5">
          <div className="sticky top-20">
            <LeadForm source={`uon-course-${slug}-sidebar`} defaultCountry="Australia" />
            <div className="mt-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Related Links</h3>
              <div className="space-y-2">
                <a href={course.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-brand-700 hover:underline">Official Course Page ↗</a>
                <Link href="/universities/university-of-newcastle-australia/courses" className="block text-sm text-brand-700 hover:underline">All UoN Courses →</Link>
                <Link href="/universities/country/australia" className="block text-sm text-brand-700 hover:underline">Study in Australia Guide →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
