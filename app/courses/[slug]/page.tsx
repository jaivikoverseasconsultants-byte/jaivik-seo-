import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { courses, getCourseBySlug } from '@/data/courses';
import { universities } from '@/data/universities';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';
import { buildMetadata, formatINR, formatUSD } from '@/lib/seo';

const SalaryChart = dynamic(() => import('@/components/charts/SalaryChart'), { ssr: false });
const JobRolesChart = dynamic(() => import('@/components/charts/JobRolesChart'), { ssr: false });

export async function generateStaticParams() {
  return courses.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCourseBySlug(slug);
  if (!c) return {} as Metadata;
  return buildMetadata({
    title: `${c.name} Abroad – Fees, Salary, Eligibility & Top Universities 2025`,
    description: `${c.name} abroad – Duration: ${c.duration}. Avg fees: ${formatUSD(c.avgFeesUSD)} (${formatINR(c.avgFeesINR)}). Avg salary after graduation: ${formatUSD(c.avgSalaryUSD)}/year. Job growth: ${c.roi.jobGrowthRate}%. Available in ${c.countriesOffered.slice(0, 3).join(', ')}.`,
    path: `/courses/${slug}`,
    keywords: [c.name, c.category, 'study abroad', 'fees', 'eligibility', 'salary'],
  });
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = getCourseBySlug(slug);
  if (!found) notFound();
  const c = found;

  const topUnis = universities.filter(u => c.topUniversitySlugs.includes(u.slug)).slice(0, 5);

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: c.name,
    description: c.description,
    provider: {
      '@type': 'Organization',
      name: 'Jaivik Overseas Consultants',
      sameAs: 'https://jaivikoverseasconsultants.com',
    },
    courseMode: 'full-time',
    educationalLevel: c.level,
    timeToComplete: `PT${c.durationMonths}M`,
    teaches: c.syllabus.join(', '),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the average fee for ${c.name} abroad?`,
        acceptedAnswer: { '@type': 'Answer', text: `The average total fee for ${c.name} abroad is ${formatUSD(c.avgFeesUSD)} (approximately ${formatINR(c.avgFeesINR)}) for the complete program.` },
      },
      {
        '@type': 'Question',
        name: `What is the salary after ${c.name}?`,
        acceptedAnswer: { '@type': 'Answer', text: `After completing ${c.name} abroad, graduates earn an average of ${formatUSD(c.avgSalaryUSD)} per year internationally. In India, the average package on return is around ${formatINR(c.avgSalaryINR)}.` },
      },
      {
        '@type': 'Question',
        name: `What IELTS score is required for ${c.name}?`,
        acceptedAnswer: { '@type': 'Answer', text: `Most universities offering ${c.name} require a minimum IELTS score of ${c.eligibility.minIELTS}. Top universities like MIT and Stanford may require ${c.eligibility.minIELTS + 0.5} or higher.` },
      },
    ],
  };

  return (
    <>
      <JsonLd data={courseSchema} />
      <JsonLd data={faqSchema} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-3">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/courses" className="hover:text-white">Courses</Link> /
            <span>{c.name}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="badge bg-white/20 text-white">{c.level}</span>
                <span className="badge bg-white/20 text-white">{c.category}</span>
                <span className={`badge ${c.demandLevel === 'Very High' ? 'bg-red-500' : 'bg-orange-500'} text-white`}>
                  {c.demandLevel} Demand
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{c.name}</h1>
              <p className="text-blue-200 mb-4">{c.duration} · {c.level} · Available in {c.countriesOffered.slice(0, 4).join(', ')}</p>
              <p className="text-blue-100 leading-relaxed max-w-2xl mb-5">{c.description}</p>
              <div className="flex flex-wrap gap-2">
                {c.highlights.map(h => (
                  <span key={h} className="text-xs bg-white/10 text-white px-3 py-1.5 rounded-full">✓ {h}</span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source={`course-${c.slug}`} defaultCourse={c.name} compact />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { label: 'Avg Total Fees', value: `$${(c.avgFeesUSD / 1000).toFixed(0)}K`, sub: formatINR(c.avgFeesINR), color: 'text-brand-700' },
              { label: 'Avg Grad Salary', value: formatUSD(c.avgSalaryUSD), sub: formatINR(c.avgSalaryINR) + '/yr', color: 'text-green-600' },
              { label: 'Job Growth', value: `+${c.roi.jobGrowthRate}%`, sub: 'by 2031', color: 'text-orange-500' },
              { label: 'Payback Period', value: `${c.roi.paybackPeriodYears} yrs`, sub: 'avg ROI', color: 'text-purple-600' },
              { label: 'Duration', value: c.duration, sub: c.level, color: 'text-brand-700' },
              { label: 'Min IELTS', value: `${c.eligibility.minIELTS}`, sub: 'TOEFL: ' + c.eligibility.minTOEFL, color: 'text-gray-700' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SalaryChart data={c.salaryByCountry} />
              <JobRolesChart data={c.jobRoles} />
            </div>

            {/* Eligibility */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="section-title">Eligibility Requirements</h2>
              <p className="text-gray-500 text-sm mb-5">Minimum requirements for admission to {c.name} programs abroad</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Minimum GPA', value: `${c.eligibility.minGPA}/10` },
                  { label: 'IELTS Score', value: `${c.eligibility.minIELTS}+` },
                  { label: 'TOEFL iBT', value: `${c.eligibility.minTOEFL}+` },
                  { label: 'GRE Score', value: c.eligibility.minGRE ? `${c.eligibility.minGRE}+` : 'Not required' },
                  { label: 'GMAT Score', value: c.eligibility.minGMAT ? `${c.eligibility.minGMAT}+` : 'Not required' },
                  { label: 'Work Experience', value: c.eligibility.workExperienceYears > 0 ? `${c.eligibility.workExperienceYears}+ years` : 'Not required' },
                  { label: 'Backlogs Allowed', value: c.eligibility.backlogs === 0 ? 'None' : `Up to ${c.eligibility.backlogs}` },
                ].map(req => (
                  <div key={req.label} className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-lg font-bold text-brand-700">{req.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{req.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Syllabus */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="section-title">Course Syllabus Highlights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {c.syllabus.map((subject, i) => (
                  <div key={subject} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-800">{subject}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Outcomes */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="section-title">Career Outcomes After {c.name}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                {c.careerOutcomes.map(role => (
                  <div key={role} className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
                    <span className="text-green-500 text-sm">✓</span>
                    <span className="text-sm font-medium text-gray-800">{role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ROI Section */}
            <div className="bg-gradient-to-r from-brand-50 to-blue-50 rounded-2xl p-6 border border-brand-100">
              <h2 className="section-title text-brand-900">ROI Analysis – Is {c.name} Worth It?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Year 1 Avg Salary (India)</p>
                  <p className="text-xl font-bold text-green-600">{formatINR(c.roi.avgSalaryYear1INR)}</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Year 5 Avg Salary (India)</p>
                  <p className="text-xl font-bold text-green-700">{formatINR(c.roi.avgSalaryYear5INR)}</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Estimated Payback Period</p>
                  <p className="text-xl font-bold text-brand-700">{c.roi.paybackPeriodYears} years</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">* Based on average salaries of Indian students returning home after completing {c.name} abroad. Individual results may vary based on specialization, university, and experience.</p>
            </div>

            {/* Top Universities */}
            {topUnis.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="section-title">Top Universities for {c.name}</h2>
                <div className="space-y-3 mt-4">
                  {topUnis.map(u => (
                    <Link key={u.id} href={`/universities/${u.slug}`}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-brand-50 hover:border-brand-200 border border-transparent transition-all group">
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-brand-700 text-sm">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.city}, {u.country} · QS #{u.qsRanking}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-brand-700 text-sm">${(u.annualTuitionUSD / 1000).toFixed(0)}K/yr</p>
                        <p className="text-xs text-gray-400">Visa {u.visaApprovalRate}%</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="section-title">Frequently Asked Questions</h2>
              <div className="space-y-5 mt-4">
                {[
                  {
                    q: `What is the total cost of ${c.name} abroad?`,
                    a: `The average total program cost for ${c.name} is ${formatUSD(c.avgFeesUSD)} (${formatINR(c.avgFeesINR)}). You should budget an additional $12,000–$20,000/year for living expenses depending on the country.`,
                  },
                  {
                    q: `Which countries offer the best ${c.name} programs?`,
                    a: `The best countries for ${c.name} are ${c.countriesOffered.join(', ')}. USA offers highest salary potential, while Germany offers near-free tuition. Canada and Australia have clear PR pathways.`,
                  },
                  {
                    q: `What is the job growth rate for ${c.name} graduates?`,
                    a: `The job growth rate for ${c.name} is projected at ${c.roi.jobGrowthRate}% through 2031 according to the US Bureau of Labor Statistics. This is significantly above average for all occupations.`,
                  },
                  {
                    q: `Do I need work experience for ${c.name}?`,
                    a: c.eligibility.workExperienceYears > 0
                      ? `Yes, most top programs for ${c.name} require ${c.eligibility.workExperienceYears}+ years of work experience. This is especially true for MBA programs.`
                      : `No, ${c.name} does not typically require work experience. Fresh graduates from India are eligible to apply directly after their undergraduate degree.`,
                  },
                ].map(faq => (
                  <div key={faq.q} className="border-b border-gray-50 pb-4">
                    <p className="font-semibold text-gray-900 text-sm mb-1">Q: {faq.q}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="sticky top-20">
              <LeadForm source={`course-${c.slug}-sidebar`} defaultCourse={c.name} />

              <div className="mt-5 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-3 text-sm">Available In</h3>
                <div className="flex flex-wrap gap-2">
                  {c.countriesOffered.map(country => (
                    <Link key={country}
                      href={`/universities/country/${country.toLowerCase().replace(' ', '-')}`}
                      className="text-xs bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full hover:border-brand-300 hover:text-brand-700 transition-colors">
                      {country}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-4 bg-gold-50 rounded-2xl p-5 border border-gold-200">
                <h3 className="font-semibold text-gold-800 mb-2 text-sm">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {c.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gold-100 text-gold-700 px-2 py-1 rounded-full">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
