import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { tuMunichCourses, getTuMunichCourseBySlug } from '@/data/tu-munich-courses';
import { buildMetadata } from '@/lib/seo';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';
import CourseRichContent from '@/components/CourseRichContent';

import { isPswEligible } from '@/lib/psw-eligibility';
export async function generateStaticParams() {
  return (tuMunichCourses as unknown as any[]).map((c: any) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const course = getTuMunichCourseBySlug(slug);
  if (!course) return {};
  return buildMetadata({
    title: `${course.name} at Technical University of Munich — Fees in INR, IELTS & Requirements for Indian Students`,
    description: `${course.name} at Technical University of Munich, ${(course as any).city || course.country} costs ₹${(course.annualINR / 100000).toFixed(1)}L/year for Indian students. IELTS ${course.ieltsMin}+, intakes ${course.intakeMonths.join(' & ')}. Apply with Jaivik Overseas — 13 years expertise, 99% visa success.`,
    path: `/universities/technical-university-of-munich/courses/${slug}`,
    keywords: [course.name, 'TU Munich', 'Technical University Munich', 'study in Germany', course.level],
  });
}

// Career outcomes by course category
const CAREER_OUTCOMES: Record<string, { role: string; salaryUSD: number; salaryINR: number }[]> = {
  engineering: [
    { role: 'Mechanical/Electrical Engineer', salaryUSD: 75000, salaryINR: 1000000 },
    { role: 'Project Manager', salaryUSD: 90000, salaryINR: 1300000 },
    { role: 'R&D Engineer', salaryUSD: 80000, salaryINR: 1100000 },
  ],
  cs: [
    { role: 'Software Engineer', salaryUSD: 90000, salaryINR: 1200000 },
    { role: 'Data Scientist', salaryUSD: 95000, salaryINR: 1300000 },
    { role: 'Machine Learning Engineer', salaryUSD: 105000, salaryINR: 1500000 },
  ],
  science: [
    { role: 'Research Scientist', salaryUSD: 70000, salaryINR: 900000 },
    { role: 'Lab Analyst', salaryUSD: 60000, salaryINR: 800000 },
    { role: 'Product Development Specialist', salaryUSD: 75000, salaryINR: 1000000 },
  ],
  management: [
    { role: 'Business Analyst', salaryUSD: 85000, salaryINR: 1100000 },
    { role: 'Strategy Consultant', salaryUSD: 95000, salaryINR: 1300000 },
    { role: 'Operations Manager', salaryUSD: 90000, salaryINR: 1200000 },
  ],
};

function getCareers(slug: string) {
  if (slug.includes('computer') || slug.includes('data') || slug.includes('robotics') || slug.includes('quantum') || slug.includes('information')) return CAREER_OUTCOMES.cs;
  if (slug.includes('management') || slug.includes('mba')) return CAREER_OUTCOMES.management;
  if (slug.includes('biochem') || slug.includes('biotech') || slug.includes('food') || slug.includes('physics') || slug.includes('math') || slug.includes('statistics')) return CAREER_OUTCOMES.science;
  return CAREER_OUTCOMES.engineering;
}

function getWhyTUM(courseName: string): string {
  return `TU Munich consistently ranks among the world's top 40 universities and is Germany's #1 technical university. For ${courseName}, TUM offers world-class research facilities, direct industry partnerships with BMW, Siemens, MAN, and Airbus, and a near-zero tuition model. The program is internationally accredited, taught partially in English at postgraduate level, and gives access to Munich's thriving innovation ecosystem — home to over 1,000 tech and engineering companies. Graduates benefit from Germany's 18-month job seeker visa and a clear pathway to EU Blue Card and permanent residency.`;
}

export default async function CoursePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const course = getTuMunichCourseBySlug(slug);
  if (!course) notFound();

  const careers = getCareers(slug);
  const feeINRLakh = (course.annualINR / 100000).toFixed(1);
  const totalCostEUR = course.totalEUR + course.livingCostEUR * course.durationYears;
  const totalCostINRLakh = (totalCostEUR * 1.08 * 84 / 100000).toFixed(1);

  const schema = {
    '@context': 'https://schema.org', '@type': 'Course',
    name: course.name,
    provider: { '@type': 'CollegeOrUniversity', name: 'Technical University of Munich', sameAs: 'https://www.tum.de/en/' },
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
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="/universities/technical-university-of-munich" className="hover:text-white">TU Munich</Link> /
            <Link href="/universities/technical-university-of-munich/courses" className="hover:text-white">Courses</Link> /
            <span className="text-white">{course.name}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇩🇪 TU Munich · Munich, Germany · #37 QS
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.name} at Technical University of Munich — Fees in INR, IELTS &amp; Requirements for Indian Students</h1>
              <p className="text-blue-200 text-lg mb-5">{course.studyLevel} · {course.duration} · {course.campus}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Annual Fee (EUR)', value: `€${course.annualEUR.toLocaleString()}` },
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
              <LeadForm source={`tum-course-${slug}`} defaultCountry="Germany" compact />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">

          {/* Course Overview */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Course Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Qualification', value: course.level },
                { label: 'Duration', value: course.duration + ' full-time' },
                { label: 'Campus', value: course.campus },
                { label: 'Intakes', value: course.intakeMonths.join(' & ') },
                { label: 'Annual Fee (EUR)', value: `€${course.annualEUR.toLocaleString()}` },
                { label: 'Annual Fee (USD)', value: `$${course.annualUSD.toLocaleString()}` },
                { label: 'Living Cost (EUR/yr)', value: `€${course.livingCostEUR.toLocaleString()}` },
                { label: 'Total Course Fee', value: `€${course.totalEUR.toLocaleString()}` },
              ].map(f => (
                <div key={f.label} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why TU Munich */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Why Choose TU Munich for {course.name}?</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{getWhyTUM(course.name)}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
              {[
                { icon: '🏆', label: '#37 QS World Ranking' },
                { icon: '💶', label: 'Near-zero tuition (€300/yr admin fee)' },
                { icon: '🏭', label: 'Industry ties: BMW, Siemens, Airbus' },
                { icon: '🔬', label: 'Excellence Initiative university' },
                { icon: '🌍', label: '120+ nationalities on campus' },
                { icon: '📋', label: '18-month Post-Study Job Seeker Visa' },
              ].map(h => (
                <div key={h.label} className="flex items-start gap-2 p-3 bg-brand-50 rounded-xl">
                  <span className="text-lg">{h.icon}</span>
                  <p className="text-xs text-gray-800 font-medium">{h.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Career Outcomes */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Career Outcomes after {course.name}</h2>
            <div className="space-y-3">
              {careers.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <span className="text-sm font-semibold text-gray-900">{c.role}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-brand-700">${(c.salaryUSD / 1000).toFixed(0)}K/yr</p>
                    <p className="text-xs text-gray-500">≈ ₹{(c.salaryINR / 100000).toFixed(0)}L/yr in India</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">* Salary estimates for Germany/EU market. Indian market salaries are approximate comparisons.</p>
          </div>

          {/* English Requirements */}
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
            <div className="mt-4 p-4 bg-amber-50 rounded-xl">
              <p className="text-xs text-amber-800 font-medium">📌 Note: German language proficiency (B1/B2) is recommended for daily life. Many Engineering MSc programs are fully taught in English.</p>
            </div>
          </div>

          {/* Total Cost */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Total Cost of Study (Indian Students)</h2>
            <div className="space-y-3">
              {[
                { label: `Tuition × ${course.durationYears} yr${course.durationYears !== 1 ? 's' : ''}`, value: `€${course.totalEUR.toLocaleString()}`, hi: false },
                { label: `Living × ${course.durationYears} yr${course.durationYears !== 1 ? 's' : ''} (~€1,200/mo)`, value: `€${(course.livingCostEUR * course.durationYears).toLocaleString()}`, hi: false },
                { label: 'Total Estimated Cost', value: `€${totalCostEUR.toLocaleString()}`, hi: true },
                { label: 'In Indian Rupees', value: `₹${totalCostINRLakh} Lakh`, hi: true },
              ].map(r => (
                <div key={r.label} className={`flex justify-between items-center p-3 rounded-xl ${r.hi ? 'bg-brand-50 font-bold' : 'bg-gray-50'}`}>
                  <span className="text-sm text-gray-700">{r.label}</span>
                  <span className={`text-sm ${r.hi ? 'text-brand-700' : 'text-gray-900'}`}>{r.value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">* Tuition is the semester administration fee only — no tuition fees at German public universities. Living cost estimate for Munich.</p>
          </div>

          {/* Visa & Work Rights */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Visa & Work Rights — Germany</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Student Visa', value: 'Germany Student Visa (Section 16b AufenthG)' },
                { label: 'Work Rights (Term)', value: '20 hrs/week OR 120 full days/year' },
                { label: 'Work Rights (Vacation)', value: 'Full-time during semester breaks' },
                ...(isPswEligible(course as any) ? [{ label: 'Post-Study Visa', value: '18-month Job Seeker Visa after graduation' }] : []),
                { label: 'Long-term Stay', value: 'EU Blue Card → PR after 21-33 months' },
                { label: 'Health Insurance', value: '~€110/month (statutory insurance)' },
              ].map(f => (
                <div key={f.label} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}

          <CourseRichContent course={course as any} universityName="Technical University of Munich" universitySlug="technical-university-of-munich" />
          <div className="bg-brand-700 rounded-2xl p-6 text-white text-center">
            <h2 className="text-xl font-bold mb-2">Ready to Apply for {course.name}?</h2>
            <p className="text-blue-200 text-sm mb-5">Our Germany admissions advisors give free, personalised guidance to Indian students. We have helped 200+ students secure admissions in German universities.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/thank-you" className="btn-gold inline-block">Apply Now →</Link>
              <Link href="/book-counselling" className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-colors">
                Free Counselling →
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="sticky top-20">
            <LeadForm source={`tum-course-${slug}-sidebar`} defaultCountry="Germany" />
            <div className="mt-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Quick Facts</h3>
              {[
                ['University', 'TU Munich (TUM)'],
                ['Qualification', course.level],
                ['Duration', course.duration],
                ['Annual Fee', `€${course.annualEUR.toLocaleString()}`],
                ['IELTS Min', `${course.ieltsMin}`],
                ['Intake', course.intakeMonths.join(' & ')],
                ['Campus', course.campus],
                ['Post-Study', '18-month Job Seeker Visa'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-xs">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-semibold text-gray-900 text-right max-w-[55%]">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Related Links</h3>
              <div className="space-y-2">
                <a href={course.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-brand-700 hover:underline">Official TUM Course Page ↗</a>
                <Link href="/universities/technical-university-of-munich/courses" className="block text-sm text-brand-700 hover:underline">All TU Munich Courses →</Link>
                <Link href="/universities/lmu-munich/courses" className="block text-sm text-brand-700 hover:underline">LMU Munich Courses →</Link>
                <Link href="/universities/country/germany" className="block text-sm text-brand-700 hover:underline">Study in Germany Guide →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
