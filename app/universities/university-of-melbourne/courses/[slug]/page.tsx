import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { uomCourses, getUomCourseBySlug } from '@/data/uom-courses';
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
  const course = getUomCourseBySlug(slug);
  if (!course) return {};
  return buildMetadata({
    title: `${course.name} at University of Melbourne — Fees, IELTS & Intake for Indian Students 2026`,
    description: `${course.name} at University of Melbourne, ${(course as any).city || course.country} costs ₹${(course.annualINR / 100000).toFixed(1)}L/year for Indian students. IELTS ${course.ieltsMin}+, intakes ${course.intakeMonths.join(' & ')}. Apply with Jaivik Overseas — 13 years expertise, 99% visa success.`,
    path: `/universities/university-of-melbourne/courses/${slug}`,
    keywords: [course.name, 'UniMelb', 'University of Melbourne', 'study in Australia', course.level],
    noIndex: true
  });
}

const CAREER_OUTCOMES: Record<string, { role: string; salaryAUD: number; salaryINR: number }[]> = {
  cs: [
    { role: 'Software Engineer', salaryAUD: 100000, salaryINR: 1300000 },
    { role: 'Data Scientist', salaryAUD: 110000, salaryINR: 1500000 },
    { role: 'Machine Learning Engineer', salaryAUD: 120000, salaryINR: 1800000 },
  ],
  business: [
    { role: 'Business Analyst', salaryAUD: 90000, salaryINR: 1100000 },
    { role: 'Strategy Consultant', salaryAUD: 105000, salaryINR: 1400000 },
    { role: 'Finance Manager', salaryAUD: 110000, salaryINR: 1500000 },
  ],
  engineering: [
    { role: 'Civil/Mechanical Engineer', salaryAUD: 90000, salaryINR: 1000000 },
    { role: 'Project Manager', salaryAUD: 105000, salaryINR: 1200000 },
    { role: 'R&D Engineer', salaryAUD: 95000, salaryINR: 1100000 },
  ],
  science: [
    { role: 'Research Scientist', salaryAUD: 80000, salaryINR: 900000 },
    { role: 'Clinical Research Associate', salaryAUD: 85000, salaryINR: 1000000 },
    { role: 'Biotech Analyst', salaryAUD: 90000, salaryINR: 1100000 },
  ],
  arts: [
    { role: 'Policy Analyst', salaryAUD: 75000, salaryINR: 800000 },
    { role: 'Management Consultant', salaryAUD: 100000, salaryINR: 1200000 },
    { role: 'Research Analyst', salaryAUD: 70000, salaryINR: 750000 },
  ],
};

function getCareers(slug: string) {
  if (slug.includes('computer') || slug.includes('data') || slug.includes('software') || slug.includes('information')) return CAREER_OUTCOMES.cs;
  if (slug.includes('commerce') || slug.includes('mba') || slug.includes('management') || slug.includes('finance') || slug.includes('marketing')) return CAREER_OUTCOMES.business;
  if (slug.includes('-beng-') || slug.includes('-meng-') || slug.includes('engineering') || slug.includes('architecture')) return CAREER_OUTCOMES.engineering;
  if (slug.includes('science') || slug.includes('biochem') || slug.includes('biomedical') || slug.includes('health') || slug.includes('biotech') || slug.includes('neuroscience') || slug.includes('psychology')) return CAREER_OUTCOMES.science;
  return CAREER_OUTCOMES.arts;
}

function getWhyMelbourne(courseName: string): string {
  return `The University of Melbourne is Australia's #1 university and ranks #13 globally. For ${courseName}, Melbourne offers world-class research infrastructure, strong industry connections across Australia's most vibrant city, and a graduate model that allows you to build breadth across disciplines before specialising. Melbourne graduates are among the most employable in Australia — the city is home to 80% of Australia's top ASX companies, a growing tech hub, and the nation's leading healthcare cluster. After graduation, the Australian Graduate Visa allows 2–4 years of open work rights depending on your qualification level, with a clear pathway to Permanent Residency through Skills Assessment or Employer Sponsorship.`;
}

export default async function CoursePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const course = getUomCourseBySlug(slug);
  if (!course) notFound();

  const careers = getCareers(slug);
  const feeINRLakh = (course.annualINR / 100000).toFixed(1);
  const totalCostAUD = course.totalAUD + course.livingCostAUD * course.durationYears;
  const totalCostINRLakh = (totalCostAUD * 0.65 * 84 / 100000).toFixed(1);

  const schema = {
    '@context': 'https://schema.org', '@type': 'Course',
    name: course.name,
    provider: { '@type': 'CollegeOrUniversity', name: 'University of Melbourne', sameAs: 'https://www.unimelb.edu.au/' },
    courseMode: 'full-time',
    educationalLevel: course.studyLevel,
    timeRequired: `P${course.durationYears}Y`,
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
            <Link href="/universities/university-of-melbourne" className="hover:text-white">Melbourne</Link> /
            <Link href="/universities/university-of-melbourne/courses" className="hover:text-white">Courses</Link> /
            <span className="text-white">{course.name}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇦🇺 University of Melbourne · #13 QS
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.name}</h1>
              <p className="text-blue-200 text-lg mb-5">{course.studyLevel} · {course.duration} · {course.campus}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Annual Fee (AUD)', value: `A$${course.annualAUD.toLocaleString()}` },
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
              <LeadForm source={`uom-course-${slug}`} defaultCountry="Australia" compact />
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
                { label: 'Annual Fee (AUD)', value: `A$${course.annualAUD.toLocaleString()}` },
                { label: 'Annual Fee (USD)', value: `$${course.annualUSD.toLocaleString()}` },
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

          {/* Why Melbourne */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Why Choose Melbourne for {course.name}?</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{getWhyMelbourne(course.name)}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
              {[
                { icon: '🏆', label: '#13 QS — Australia\'s #1' },
                { icon: '🦘', label: 'Graduate Visa 2–4 years' },
                { icon: '🏙️', label: '80% of ASX top companies in Melbourne' },
                { icon: '🔬', label: 'Excellence in Research' },
                { icon: '🌏', label: '30,000+ international students' },
                { icon: '🛂', label: 'Clear PR pathway via skills list' },
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
                    <p className="text-sm font-bold text-brand-700">A${(c.salaryAUD / 1000).toFixed(0)}K/yr</p>
                    <p className="text-xs text-gray-500">≈ ₹{(c.salaryINR / 100000).toFixed(0)}L/yr in India</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">* Salary estimates for Australian market. Indian equivalents are approximate comparisons.</p>
          </div>

          {/* English Requirements */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">English Language Requirements</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'IELTS Academic', value: `${course.ieltsMin}+`, sub: 'No band below 6.0' },
                { label: 'TOEFL iBT', value: `${course.toeflMin}+`, sub: 'Writing 21+' },
                { label: 'PTE Academic', value: `${course.pteMin}+`, sub: 'No band below 50' },
              ].map(e => (
                <div key={e.label} className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-xl font-bold text-brand-700">{e.value}</p>
                  <p className="text-xs font-semibold text-gray-700 mt-1">{e.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{e.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total Cost */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Total Cost of Study (Indian Students)</h2>
            <div className="space-y-3">
              {[
                { label: `Tuition × ${course.durationYears} yr${course.durationYears !== 1 ? 's' : ''}`, value: `A$${course.totalAUD.toLocaleString()}`, hi: false },
                { label: `Living in Melbourne × ${course.durationYears} yr${course.durationYears !== 1 ? 's' : ''} (~A$1,833/mo)`, value: `A$${(course.livingCostAUD * course.durationYears).toLocaleString()}`, hi: false },
                { label: 'Total Estimated Cost', value: `A$${totalCostAUD.toLocaleString()}`, hi: true },
                { label: 'In Indian Rupees', value: `₹${totalCostINRLakh} Lakh`, hi: true },
              ].map(r => (
                <div key={r.label} className={`flex justify-between items-center p-3 rounded-xl ${r.hi ? 'bg-brand-50 font-bold' : 'bg-gray-50'}`}>
                  <span className="text-sm text-gray-700">{r.label}</span>
                  <span className={`text-sm ${r.hi ? 'text-brand-700' : 'text-gray-900'}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visa & Work Rights */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Visa & Work Rights — Australia</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Student Visa', value: 'Subclass 500 Student Visa' },
                { label: 'Work Rights (Term)', value: '48 hrs per fortnight' },
                { label: 'Work Rights (Vacation)', value: 'Unlimited during study breaks' },
                { label: 'Post-Study Visa', value: 'Graduate Visa (Subclass 485) 2–4 years' },
                { label: 'PR Pathway', value: 'Skilled Migration via Skills List' },
                { label: 'Spouse Work Rights', value: 'Open work rights for partner' },
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
                <p className="text-sm text-blue-800">After completing your degree, apply for the Subclass 485 Post-Study Work Stream. Work full-time anywhere in Australia — 2 years for Bachelor&apos;s, 3 years for Honours/Masters, 4 years for PhD.</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                <p className="text-sm font-bold text-green-900 mb-1">Skilled Independent Visa (Subclass 189) Pathway</p>
                <p className="text-sm text-green-800">Australian work experience from your 485 Visa contributes to your points for the Skilled Independent Visa (SC 189). Skilled occupations from engineering, IT, healthcare, and accounting fields are in high demand.</p>
              </div>
            </div>
          </div>

          {/* CTA */}

          <CourseRichContent course={course as any} universityName="University of Melbourne" universitySlug="university-of-melbourne" />
          <div className="bg-brand-700 rounded-2xl p-6 text-white text-center">
            <h2 className="text-xl font-bold mb-2">Ready to Apply for {course.name}?</h2>
            <p className="text-blue-200 text-sm mb-5">Our Australia admissions experts help Indian students with everything from selecting the right course to visa application.</p>
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
            <LeadForm source={`uom-course-${slug}-sidebar`} defaultCountry="Australia" />
            <div className="mt-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Quick Facts</h3>
              {[
                ['University', 'University of Melbourne'],
                ['Qualification', course.level],
                ['Duration', course.duration],
                ['Annual Fee', `A$${course.annualAUD.toLocaleString()}`],
                ['IELTS Min', `${course.ieltsMin}`],
                ['Intake', course.intakeMonths.join(' & ')],
                ['Campus', course.campus],
                ['Post-Study', 'Graduate Visa 2–4 yrs'],
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
                <a href={course.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-brand-700 hover:underline">Official UniMelb Page ↗</a>
                <Link href="/universities/university-of-melbourne/courses" className="block text-sm text-brand-700 hover:underline">All Melbourne Courses →</Link>
                <Link href="/universities/university-of-sydney/courses" className="block text-sm text-brand-700 hover:underline">University of Sydney Courses →</Link>
                <Link href="/universities/country/australia" className="block text-sm text-brand-700 hover:underline">Study in Australia Guide →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
