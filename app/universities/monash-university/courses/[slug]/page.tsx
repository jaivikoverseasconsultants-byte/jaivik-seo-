import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { monashCourses, getMonashCourseBySlug } from '@/data/monash-courses';
import { buildMetadata } from '@/lib/seo';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';
import CourseRichContent from '@/components/CourseRichContent';

export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const course = getMonashCourseBySlug(slug);
  if (!course) return {};
  const fee = (course as any).annualAUD || (course as any).annualUSD || 0;
  return buildMetadata({
    title: `${course.name} at Monash University — Fees, IELTS & Intake for Indian Students 2026`,
    description: `${course.name} at Monash University, ${(course as any).city || course.country} costs ₹${(course.annualINR / 100000).toFixed(1)}L/year for Indian students. IELTS ${course.ieltsMin}+, intakes ${course.intakeMonths.join(' & ')}. Apply with Jaivik Overseas — 13 years expertise, 99% visa success.`,
    path: `/universities/monash-university/courses/${slug}`,
    keywords: [course.name, 'Monash', 'Monash University', 'study in Australia', course.level],
    noIndex: true
  });
}

export default async function CoursePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const course = getMonashCourseBySlug(slug);
  if (!course) notFound();

  const fee = (course as any).annualAUD || (course as any).annualUSD || 0;
  const feeINRLakh = (course.annualINR / 100000).toFixed(1);
  const totalFee = (course as any)['totalAUD'] || fee * course.durationYears;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    provider: {
      '@type': 'CollegeOrUniversity',
      name: 'Monash University',
      sameAs: 'https://www.monash.edu',
    },
    courseMode: 'full-time',
    educationalLevel: course.studyLevel,
    timeRequired: `P${course.durationYears}Y`,
    url: course.url,
  };

  // Career outcomes by field
  const fieldKey = course.name.toLowerCase();
  const careerMap: Record<string, { roles: string[], avgUSD: number }> = {
    default: { roles: ['Industry Professional', 'Research Associate', 'Consultant', 'Manager'], avgUSD: 85000 },
    'computer science': { roles: ['Software Engineer', 'Data Scientist', 'ML Engineer', 'Technical Lead'], avgUSD: 120000 },
    'data science': { roles: ['Data Scientist', 'ML Engineer', 'Data Analyst', 'AI Researcher'], avgUSD: 115000 },
    'artificial intelligence': { roles: ['AI Engineer', 'ML Researcher', 'Data Scientist', 'AI Product Manager'], avgUSD: 125000 },
    'cyber security': { roles: ['Security Engineer', 'Penetration Tester', 'CISO', 'Security Analyst'], avgUSD: 110000 },
    'business': { roles: ['Business Analyst', 'Management Consultant', 'Strategy Manager', 'Operations Director'], avgUSD: 95000 },
    'finance': { roles: ['Financial Analyst', 'Investment Banker', 'Portfolio Manager', 'CFO'], avgUSD: 110000 },
    'engineering': { roles: ['Design Engineer', 'Project Engineer', 'Engineering Manager', 'Technical Director'], avgUSD: 100000 },
    'mba': { roles: ['Product Manager', 'Strategy Consultant', 'Business Development Manager', 'CEO'], avgUSD: 130000 },
  };

  let career = careerMap.default;
  for (const [key, val] of Object.entries(careerMap)) {
    if (fieldKey.includes(key)) { career = val; break; }
  }
  const avgINR = Math.round(career.avgUSD * 83.5);
  const avgINRLakh = (avgINR / 100000).toFixed(1);

  return (
    <>
      <JsonLd data={schema} />

      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4 flex-wrap">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="/universities/monash-university" className="hover:text-white">Monash</Link> /
            <Link href="/universities/monash-university/courses" className="hover:text-white">Courses</Link> /
            <span>{course.name}</span>
          </div>
          <div className="inline-block bg-white/10 text-blue-100 text-xs px-3 py-1 rounded-full mb-3">
            {course.level} · {course.studyLevel}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.name}</h1>
          <p className="text-blue-100 text-lg">
            Monash University · Melbourne, Australia · {course.duration}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {/* Key Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Program Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Annual Fee', value: `A$${fee.toLocaleString()}`, sub: `₹${feeINRLakh}L/year` },
                  { label: 'Total Fees', value: `A$${totalFee.toLocaleString()}`, sub: `${course.durationYears} year(s)` },
                  { label: 'IELTS', value: `${course.ieltsMin}+`, sub: `TOEFL ${course.toeflMin}+` },
                  { label: 'Duration', value: course.duration, sub: course.studyLevel },
                  { label: 'Intake', value: (course.intakeMonths || []).join(' & '), sub: 'Annual' },
                  { label: 'Campus', value: course.campus?.split(',')[0] || 'Melbourne', sub: 'Australia' },
                ].map(({ label, value, sub }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 mb-1">{label}</div>
                    <div className="font-bold text-gray-900">{value}</div>
                    {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Why Monash */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Why Choose Monash University?</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Globally recognised degree – opens doors to top employers worldwide</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Strong Indian student community – peer support from day one</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Expert faculty and cutting-edge research facilities</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Strong industry connections and placement support</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Temporary Graduate Visa (500): 2-4 years post-study work</span>
                </li>
              </ul>
            </div>

            {/* Career Outcomes */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Career Outcomes</h2>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-white rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-700">${career.avgUSD.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Avg Graduate Salary (USD)</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-700">₹{avgINRLakh}L</div>
                  <div className="text-xs text-gray-500">Avg Graduate Salary (INR)</div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium mb-2">Top Roles for Graduates:</p>
                <div className="flex flex-wrap gap-2">
                  {career.roles.map((role: string) => (
                    <span key={role} className="bg-white text-green-800 text-xs px-3 py-1 rounded-full border border-green-200">{role}</span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
  
          <CourseRichContent course={course as any} universityName="Monash University" universitySlug="monash-university" />
          <div className="bg-brand-700 text-white rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-2">Apply to {course.name}</h3>
              <p className="text-blue-100 text-sm mb-4">Get free expert guidance for your application</p>
              <Link href="/thank-you" className="block w-full bg-white text-brand-700 text-center font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors">
                Apply Now – Free Guidance
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-3">Eligibility</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">IELTS</span>
                  <span className="font-medium">{course.ieltsMin}+ overall</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">TOEFL</span>
                  <span className="font-medium">{course.toeflMin}+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">PTE</span>
                  <span className="font-medium">{course.pteMin}+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Education</span>
                  <span className="font-medium">{course.studyLevel === 'Undergraduate' ? '10+2 / A Levels' : "Bachelor's Degree"}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-3">Cost of Living</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Living Cost</span>
                  <span className="font-medium">A${(course as any)['livingCostAUD']?.toLocaleString() || 'N/A'}/year</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">In INR</span>
                  <span className="font-medium">₹{(course.livingCostINR / 100000).toFixed(1)}L/year</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">City</span>
                  <span className="font-medium">Melbourne</span>
                </div>
              </div>
            </div>

            <Link href="/universities/monash-university/courses" className="flex items-center gap-2 text-brand-700 hover:text-brand-900 font-medium text-sm">
              ← All Monash Courses
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-brand-50 py-12 px-4 mt-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-brand-900 mb-2">Ready to Apply?</h2>
          <p className="text-center text-gray-600 mb-6">Get personalised guidance from our expert counsellors</p>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
