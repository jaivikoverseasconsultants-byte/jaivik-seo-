import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { uclCourses, getUclCourseBySlug } from '@/data/ucl-courses';
import { buildMetadata } from '@/lib/seo';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';
import CourseRichContent from '@/components/CourseRichContent';

import { isPswEligible } from '@/lib/psw-eligibility';
import { showOnCoursePage, entryRequirementsVaryByCourse } from '@/lib/course-field-variance';

import { feeDisplay, feeDisplayINRLakh, isFeeVerified, feeSentenceINR, titleFeeFragment } from '@/lib/fee-verification';
/** decides which "course facts" are really university-wide constants */
const UNIVERSITY_SLUG = 'university-college-london';
export async function generateStaticParams() {
  return uclCourses.map(c => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const course = getUclCourseBySlug(slug);
  if (!course) return {};
  return buildMetadata({
    title: `${course.name} at University College London — ${titleFeeFragment(course as any, course.annualINR)}IELTS & Requirements for Indian Students`,
    description: `${course.name} at University College London, ${(course as any).city || course.country}${feeSentenceINR(course as any, course.annualINR)} IELTS ${course.ieltsMin}+, intakes ${course.intakeMonths.join(' & ')}. Apply with Jaivik Overseas — 13 years expertise, 99% visa success.`,
    path: `/universities/university-college-london/courses/${slug}`,
    keywords: [course.name, 'UCL', 'University College London', 'study in London UK', course.level],
  });
}

const CAREER_OUTCOMES: Record<string, { role: string; salaryGBP: number; salaryINR: number }[]> = {
  cs: [
    { role: 'Software Engineer', salaryGBP: 60000, salaryINR: 1300000 },
    { role: 'Data Scientist', salaryGBP: 65000, salaryINR: 1500000 },
    { role: 'Machine Learning Engineer', salaryGBP: 72000, salaryINR: 1800000 },
  ],
  finance: [
    { role: 'Financial Analyst', salaryGBP: 55000, salaryINR: 1200000 },
    { role: 'Investment Banker', salaryGBP: 80000, salaryINR: 2000000 },
    { role: 'Risk Manager', salaryGBP: 65000, salaryINR: 1500000 },
  ],
  engineering: [
    { role: 'Civil/Mechanical Engineer', salaryGBP: 42000, salaryINR: 900000 },
    { role: 'Project Manager', salaryGBP: 55000, salaryINR: 1200000 },
    { role: 'R&D Engineer', salaryGBP: 48000, salaryINR: 1000000 },
  ],
  science: [
    { role: 'Research Scientist', salaryGBP: 38000, salaryINR: 800000 },
    { role: 'Clinical Research Associate', salaryGBP: 42000, salaryINR: 900000 },
    { role: 'Biotech Analyst', salaryGBP: 45000, salaryINR: 1000000 },
  ],
  humanities: [
    { role: 'Policy Analyst', salaryGBP: 38000, salaryINR: 800000 },
    { role: 'Management Consultant', salaryGBP: 55000, salaryINR: 1200000 },
    { role: 'Research Analyst', salaryGBP: 35000, salaryINR: 700000 },
  ],
};

function getCareers(slug: string) {
  if (slug.includes('computer') || slug.includes('data') || slug.includes('machine') || slug.includes('aml') || slug.includes('cyber') || slug.includes('info-management') || slug.includes('human-computer')) return CAREER_OUTCOMES.cs;
  if (slug.includes('finance') || slug.includes('economics') || slug.includes('mba') || slug.includes('management') || slug.includes('marketing')) return CAREER_OUTCOMES.finance;
  if (slug.includes('-beng-') || slug.includes('engineering') || slug.includes('architecture')) return CAREER_OUTCOMES.engineering;
  if (slug.includes('science') || slug.includes('biochem') || slug.includes('pharmacology') || slug.includes('genetics') || slug.includes('neuroscience') || slug.includes('medical') || slug.includes('health')) return CAREER_OUTCOMES.science;
  return CAREER_OUTCOMES.humanities;
}

function getWhyUCL(courseName: string): string {
  return `UCL consistently ranks among the world's top 10 universities and is London's leading multidisciplinary research institution. For ${courseName}, UCL offers exceptional research depth, direct access to London's global hub of finance, technology, media and government, and renowned faculty who are leaders in their fields. UCL's central London location means internships, industry placements and graduate roles are minutes away. International students benefit from the UK's 2-year Graduate Route visa after graduation — allowing you to work or look for skilled employment with no job offer needed. UCL has a strong Indian alumni network with 3,000+ Indian graduates now working globally.`;
}

export default async function CoursePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const course = getUclCourseBySlug(slug);
  if (!course) notFound();

  const careers = getCareers(slug);
  const feeINRLakh = (course.annualINR / 100000).toFixed(1);
  const totalCostGBP = course.totalGBP + course.livingCostGBP * course.durationYears;
  const totalCostINRLakh = (totalCostGBP * 1.27 * 84 / 100000).toFixed(1);

  const schema = {
    '@context': 'https://schema.org', '@type': 'Course',
    name: course.name,
    provider: { '@type': 'CollegeOrUniversity', name: 'University College London', sameAs: 'https://www.ucl.ac.uk/' },
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
            <Link href="/universities/university-college-london" className="hover:text-white">UCL</Link> /
            <Link href="/universities/university-college-london/courses" className="hover:text-white">Courses</Link> /
            <span className="text-white">{course.name}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇬🇧 UCL London · #9 QS World Ranking
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.name} at University College London — {titleFeeFragment(course as any, course.annualINR)}IELTS &amp; Requirements for Indian Students</h1>
              <p className="text-blue-200 text-lg mb-5">{course.studyLevel} · {course.duration} · {course.campus}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Annual Fee (GBP)', value: feeDisplay(course as any, course.annualGBP, 'GBP') },
                  { label: 'Fee in INR', value: feeDisplayINRLakh(course as any, feeINRLakh, '/yr') },
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
              <LeadForm source={`ucl-course-${slug}`} defaultCountry="UK" compact />
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
                ...(showOnCoursePage(UNIVERSITY_SLUG, 'campus') ? [{ label: 'Campus', value: course.campus }] : []),
                ...(showOnCoursePage(UNIVERSITY_SLUG, 'intakeMonths') ? [{ label: 'Intakes', value: course.intakeMonths.join(' & ') }] : []),
                { label: 'Annual Fee (GBP)', value: feeDisplay(course as any, course.annualGBP, 'GBP') },
                { label: 'Annual Fee (USD)', value: feeDisplay(course as any, course.annualUSD, 'USD') },
                { label: 'Total Course Fee', value: feeDisplay(course as any, course.totalGBP, 'GBP') },
              ].map(f => (
                <div key={f.label} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why UCL */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Why Choose UCL for {course.name}?</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{getWhyUCL(course.name)}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
              {[
                { icon: '🏆', label: '#9 QS World Ranking' },
                { icon: '🌆', label: 'Central London location' },
                { icon: '📋', label: '2-yr Graduate Route Visa' },
                { icon: '🇮🇳', label: '3,000+ Indian alumni' },
                { icon: '🔬', label: 'World-leading research' },
                { icon: '💼', label: 'London job market access' },
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
                    <p className="text-sm font-bold text-brand-700">£{(c.salaryGBP / 1000).toFixed(0)}K/yr</p>
                    <p className="text-xs text-gray-500">≈ ₹{(c.salaryINR / 100000).toFixed(0)}L/yr in India</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">* Salary estimates for UK/London market. Indian equivalents are approximate comparisons.</p>
          </div>

          {/* English Requirements */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">English Language Requirements</h2>
            {entryRequirementsVaryByCourse(UNIVERSITY_SLUG) ? (
              <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'IELTS Academic', value: `${course.ieltsMin}+`, sub: 'No band below 6.0' },
                { label: 'TOEFL iBT', value: `${course.toeflMin}+`, sub: 'Writing 24+' },
                { label: 'PTE Academic', value: `${course.pteMin}+`, sub: 'No band below 59' },
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
                University College London publishes one English language requirement across its courses
                rather than a per-course score. See the full entry requirements and intake dates on the{' '}
                <Link href={`/universities/${UNIVERSITY_SLUG}`} className="text-brand-700 font-medium hover:underline">university page</Link>.
              </p>
            )}
          </div>

          {/* Total Cost */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Total Cost of Study (Indian Students)</h2>
            <div className="space-y-3">
              {[
                { label: `Tuition × ${course.durationYears} yr${course.durationYears !== 1 ? 's' : ''}`, value: feeDisplay(course as any, course.totalGBP, 'GBP'), hi: false },
                { label: `Living in London × ${course.durationYears} yr${course.durationYears !== 1 ? 's' : ''} (~£1,300/mo)`, value: `£${(course.livingCostGBP * course.durationYears).toLocaleString()}`, hi: false },
                { label: 'Total Estimated Cost', value: feeDisplay(course as any, totalCostGBP, 'GBP'), hi: true },
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">Visa & Work Rights — UK</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Student Visa', value: 'UK Student Visa (Tier 4)' },
                { label: 'Work Rights (Term)', value: '20 hrs/week during term' },
                { label: 'Work Rights (Vacation)', value: 'Full-time during holidays' },
                ...(isPswEligible(course as any) ? [{ label: 'Post-Study Visa', value: '2-year Graduate Route Visa' }] : []),
                { label: 'PR Pathway', value: 'Skilled Worker Visa → ILR after 5 yrs' },
                { label: 'NHS Access', value: 'Full NHS healthcare for students' },
              ].map(f => (
                <div key={f.label} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}

          <CourseRichContent course={course as any} universityName="University College London" universitySlug="university-college-london" />
          <div className="bg-brand-700 rounded-2xl p-6 text-white text-center">
            <h2 className="text-xl font-bold mb-2">Ready to Apply for {course.name} at UCL?</h2>
            <p className="text-blue-200 text-sm mb-5">Our UK admissions advisors guide Indian students through the entire UCL application process — from SOP writing to visa filing.</p>
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
            <LeadForm source={`ucl-course-${slug}-sidebar`} defaultCountry="UK" />
            <div className="mt-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Quick Facts</h3>
              {[
                ['University', 'UCL London'],
                ['Qualification', course.level],
                ['Duration', course.duration],
                ['Annual Fee', feeDisplay(course as any, course.annualGBP, 'GBP')],
                ['IELTS Min', `${course.ieltsMin}`],
                ['Intake', course.intakeMonths.join(' & ')],
                ['Campus', course.campus],
                ['Post-Study', '2-yr Graduate Route'],
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
                <a href={course.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-brand-700 hover:underline">Official UCL Course Page ↗</a>
                <Link href="/universities/university-college-london/courses" className="block text-sm text-brand-700 hover:underline">All UCL Courses →</Link>
                <Link href="/universities/university-of-manchester/courses" className="block text-sm text-brand-700 hover:underline">Manchester Courses →</Link>
                <Link href="/universities/country/uk" className="block text-sm text-brand-700 hover:underline">Study in UK Guide →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
