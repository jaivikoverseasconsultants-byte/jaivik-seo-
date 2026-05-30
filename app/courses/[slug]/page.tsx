import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import COURSE_CATEGORIES, { COURSE_CATEGORY_SLUGS } from '@/data/course-categories';
import { courses, getCourseBySlug } from '@/data/courses';
import { universities } from '@/data/universities';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';
import { buildMetadata, formatINR, formatUSD } from '@/lib/seo';

const SalaryChart = dynamic(() => import('@/components/charts/SalaryChart'), { ssr: false });
const JobRolesChart = dynamic(() => import('@/components/charts/JobRolesChart'), { ssr: false });

// ── Static params: covers BOTH course-category slugs AND individual course slugs ──
export function generateStaticParams() {
  const catParams = COURSE_CATEGORY_SLUGS.map(slug => ({ slug }));
  const courseParams = courses.map(c => ({ slug: c.slug }));
  return [...catParams, ...courseParams];
}

const FLAGS: Record<string, string> = {
  USA: '🇺🇸', UK: '🇬🇧', Canada: '🇨🇦', Australia: '🇦🇺', Germany: '🇩🇪',
  France: '🇫🇷', Netherlands: '🇳🇱', Singapore: '🇸🇬', Ireland: '🇮🇪',
  'New Zealand': '🇳🇿', Sweden: '🇸🇪', UAE: '🇦🇪', Denmark: '🇩🇰',
  Italy: '🇮🇹', Spain: '🇪🇸',
};

const WORK_RIGHTS: Record<string, string> = {
  USA: 'OPT 12 months (STEM 36)', UK: 'Graduate Route 2 years',
  Canada: 'PGWP up to 3 years', Australia: 'Graduate 2–4 years',
  Germany: '18-month job-seeker', France: 'APS 12 months',
  Netherlands: 'Orientation Year 12 months', Singapore: 'Employment Pass',
  Ireland: '3rd Level Graduate 2 years', 'New Zealand': 'Post-study 3 years',
  Sweden: '6-month job-seeker', UAE: 'Employment visa sponsorship',
  Denmark: '6-month job-seeker', Italy: 'Job-seeker 12 months',
  Spain: 'Job-seeker 12 months',
};

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;

  // Check if it's a course-category stream
  const cat = COURSE_CATEGORIES.find(c => c.slug === slug);
  if (cat) {
    const matchCount = universities.filter(u =>
      u.popularCourses?.some(c => cat.keywords.some(k => c.toLowerCase().includes(k)))
    ).length;
    return buildMetadata({
      title: `${cat.name} Abroad for Indian Students 2026 – Fees, IELTS & Universities`,
      description: `Study ${cat.name} abroad. ${matchCount}+ universities in ${cat.topCountries.join(', ')}. Avg fee $${Math.round(cat.avgFeeUSD / 1000)}K/yr, IELTS ${cat.ieltsTypical}+. Free guidance from Jaivik Overseas.`,
      path: `/courses/${slug}`,
      keywords: [`${cat.name} abroad`, `${cat.name} universities`, `study ${cat.name} india`, `${cat.name} fees for indian students`],
    });
  }

  // Fallback: individual course detail
  const c = getCourseBySlug(slug);
  if (!c) return {} as Metadata;
  return buildMetadata({
    title: `${c.name} Abroad – Fees, Salary, Eligibility & Top Universities 2026`,
    description: `${c.name} abroad – Duration: ${c.duration}. Avg fees: ${formatUSD(c.avgFeesUSD)} (${formatINR(c.avgFeesINR)}). Avg salary: ${formatUSD(c.avgSalaryUSD)}/year. Job growth: ${c.roi.jobGrowthRate}%. Available in ${c.countriesOffered.slice(0, 3).join(', ')}.`,
    path: `/courses/${slug}`,
    keywords: [c.name, c.category, 'study abroad', 'fees', 'eligibility', 'salary'],
  });
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function CourseSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // ── A) Course-category stream page ──────────────────────────────────────────
  const cat = COURSE_CATEGORIES.find(c => c.slug === slug);
  if (cat) {
    const matchingUnis = universities
      .filter(u => u.popularCourses?.some(c =>
        cat.keywords.some(k => c.toLowerCase().includes(k.toLowerCase()))
      ))
      .sort((a, b) => (a.qsRanking ?? 9999) - (b.qsRanking ?? 9999));

    const byCountry: Record<string, typeof universities> = {};
    for (const u of matchingUnis) {
      if (!byCountry[u.country]) byCountry[u.country] = [];
      byCountry[u.country].push(u);
    }

    const countryStats = Object.entries(byCountry)
      .map(([country, unis]) => ({
        country,
        count: unis.length,
        avgFee: Math.round(unis.reduce((s, u) => s + u.annualTuitionUSD, 0) / unis.length),
        minIelts: Math.min(...unis.map(u => u.requirements?.ieltsMin ?? 6.5)),
      }))
      .sort((a, b) => b.count - a.count);

    const breadcrumb = {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { position: 1, '@type': 'ListItem', name: 'Home', item: 'https://study.jaivikoverseasconsultants.com' },
        { position: 2, '@type': 'ListItem', name: 'Courses', item: 'https://study.jaivikoverseasconsultants.com/courses' },
        { position: 3, '@type': 'ListItem', name: cat.name, item: `https://study.jaivikoverseasconsultants.com/courses/${slug}` },
      ],
    };

    const faq = {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `What is the average fee for ${cat.name} abroad?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Average annual tuition for ${cat.name} is approximately $${Math.round(cat.avgFeeUSD / 1000)}K USD (₹${(cat.avgFeeUSD * 84 / 100000).toFixed(1)}L INR). Germany and Netherlands are cheaper; USA and UK can be $30K–$65K/year.`,
          },
        },
        {
          '@type': 'Question',
          name: `Which countries are best for ${cat.name}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Top countries for ${cat.name} are ${cat.topCountries.join(', ')}. Each offers different tuition fees, work rights, and post-study immigration pathways.`,
          },
        },
        {
          '@type': 'Question',
          name: `What IELTS score is required for ${cat.name}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Most universities require IELTS ${cat.ieltsTypical}+ for ${cat.name}. Top-ranked programs may require ${cat.ieltsTypical + 0.5}+. Some pathway programs accept lower scores.`,
          },
        },
      ],
    };

    return (
      <>
        <JsonLd data={breadcrumb} />
        <JsonLd data={faq} />

        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-blue-200 text-xs mb-4 flex-wrap">
              <Link href="/" className="hover:text-white">Home</Link> /
              <Link href="/courses" className="hover:text-white">Courses</Link> /
              <span className="text-white">{cat.name}</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2">
                <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                  {cat.emoji} {cat.level === 'UG' ? 'Undergraduate' : cat.level === 'PG' ? 'Postgraduate' : 'UG & PG'} · {matchingUnis.length}+ Universities
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  {cat.name} Abroad for Indian Students 2026
                </h1>
                <p className="text-blue-200 text-lg mb-5">{cat.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Universities', value: `${matchingUnis.length}+` },
                    { label: 'Avg Fee/Year', value: `$${Math.round(cat.avgFeeUSD / 1000)}K` },
                    { label: 'Min IELTS', value: `${cat.ieltsTypical}+` },
                    { label: 'Avg Salary', value: `$${Math.round(cat.avgSalaryUSD / 1000)}K` },
                  ].map(s => (
                    <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                      <p className="text-xl font-bold">{s.value}</p>
                      <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5">
                <LeadForm source={`course-${slug}`} defaultCountry="USA" compact />
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {/* Country Comparison */}
            {countryStats.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Best Countries for {cat.name}</h2>
                <div className="space-y-3">
                  {countryStats.map(cs => (
                    <Link key={cs.country}
                      href={`/universities/country/${cs.country.toLowerCase().replace(/ /g, '-')}`}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-brand-50 hover:text-brand-700 transition-colors group">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{FLAGS[cs.country] || '🌍'}</span>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-brand-700 text-sm">{cs.country}</p>
                          <p className="text-xs text-gray-500">{WORK_RIGHTS[cs.country] || 'Post-study work available'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-brand-700">${Math.round(cs.avgFee / 1000)}K/yr avg</p>
                        <p className="text-xs text-gray-500">{cs.count} unis · IELTS {cs.minIelts}+</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* University List */}
            {matchingUnis.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Top Universities Offering {cat.name}
                </h2>
                <div className="space-y-3">
                  {matchingUnis.slice(0, 40).map((u, i) => (
                    <div key={u.id} className="relative bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all group cursor-pointer">
                      <Link href={`/universities/${u.slug}`} className="absolute inset-0 rounded-2xl z-0" aria-label={`View ${u.name}`} />
                      <div className="relative z-10 flex items-start gap-4">
                        <div className="w-8 h-8 bg-brand-50 rounded-full flex items-center justify-center text-brand-700 font-bold text-sm flex-shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                              <span className="font-bold text-gray-900 group-hover:text-brand-700 text-sm">{u.name}</span>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {FLAGS[u.country] || ''} {u.city}, {u.country}
                                {u.qsRanking ? ` · QS #${u.qsRanking}` : ''}
                              </p>
                            </div>
                            <span className="text-brand-700 font-bold text-sm whitespace-nowrap">
                              ${Math.round(u.annualTuitionUSD / 1000)}K/yr
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2 text-xs">
                            <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full">Visa {u.visaApprovalRate}%</span>
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full">IELTS {u.requirements?.ieltsMin}+</span>
                            <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full">{u.intakeMonths?.join(' & ')} intake</span>
                          </div>
                          <div className="flex gap-3 mt-2">
                            <span className="text-xs text-brand-700 font-medium">View Profile →</span>
                            <Link href={`/universities/${u.slug}/courses`}
                              className="relative z-10 text-xs bg-brand-700 text-white px-3 py-1 rounded-full font-medium hover:bg-brand-800 transition-colors">
                              Browse Courses →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {matchingUnis.length > 40 && (
                    <p className="text-center text-sm text-gray-500 py-3">
                      + {matchingUnis.length - 40} more universities available.{' '}
                      <Link href="/course-finder" className="text-brand-700 underline">Use Course Finder to filter by budget & IELTS →</Link>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Career Outcomes */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Career Outcomes After {cat.name}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {cat.careerOptions.map(c => (
                  <div key={c} className="flex items-center gap-2 p-3 bg-brand-50 rounded-xl">
                    <span className="text-brand-600 font-bold text-lg">✓</span>
                    <span className="text-sm text-gray-800 font-medium">{c}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-green-700">${Math.round(cat.avgSalaryUSD / 1000)}K</p>
                  <p className="text-xs text-green-600 mt-1">Avg Starting Salary (USD)</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-blue-700">₹{(cat.avgSalaryUSD * 84 / 100000).toFixed(0)}L</p>
                  <p className="text-xs text-blue-600 mt-1">Approx. in Indian Rupees</p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">FAQ — {cat.name} Abroad</h2>
              <div className="space-y-4">
                {[
                  { q: `How much does ${cat.name} cost abroad for Indian students?`, a: `Average annual tuition for ${cat.name} is $${Math.round(cat.avgFeeUSD / 1000)}K–$${Math.round(cat.avgFeeUSD * 1.3 / 1000)}K USD (₹${(cat.avgFeeUSD * 84 / 100000).toFixed(1)}L–₹${(cat.avgFeeUSD * 1.3 * 84 / 100000).toFixed(1)}L/yr). Germany and Netherlands are more affordable; USA and UK tend to be higher.` },
                  { q: `What IELTS score is required for ${cat.name}?`, a: `Most universities require IELTS ${cat.ieltsTypical}+ for ${cat.name}. Highly-ranked universities may require ${cat.ieltsTypical + 0.5}+. Pathway programs may accept ${Math.max(5.0, cat.ieltsTypical - 0.5)}+.` },
                  { q: `Which country is best for ${cat.name}?`, a: `${cat.topCountries[0]} is considered the best for ${cat.name} due to its world-class universities and strong employment opportunities. ${cat.topCountries[1]} offers strong value, and ${cat.topCountries[2] || 'Canada'} provides excellent PR pathways.` },
                  { q: `Can I get PR after studying ${cat.name} abroad?`, a: `Yes. Canada (PGWP → Express Entry), Australia (485 Temporary Graduate visa), and UK (Graduate Route 2 years) all offer strong post-study immigration pathways after completing a ${cat.name} degree.` },
                ].map(({ q, a }) => (
                  <div key={q} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">{q}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-700 rounded-2xl p-6 text-white text-center">
              <h2 className="text-xl font-bold mb-2">Ready to Study {cat.name} Abroad?</h2>
              <p className="text-blue-200 text-sm mb-5">Get a personalised university shortlist based on your IELTS score, budget, and target country.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/book-counselling" className="btn-gold">Book Free Counselling →</Link>
                <Link href="/course-finder" className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-colors">
                  Use Course Finder →
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-20 space-y-5">
              <LeadForm source={`course-${slug}-sidebar`} defaultCountry={cat.topCountries[0]} />

              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">At a Glance</h3>
                {[
                  ['Level', cat.level === 'UG' ? 'Undergraduate' : cat.level === 'PG' ? 'Postgraduate' : 'UG & PG'],
                  ['Avg Annual Fee', `$${Math.round(cat.avgFeeUSD / 1000)}K`],
                  ['In INR', `₹${(cat.avgFeeUSD * 84 / 100000).toFixed(1)}L/yr`],
                  ['IELTS Minimum', `${cat.ieltsTypical}+`],
                  ['Avg Salary', `$${Math.round(cat.avgSalaryUSD / 1000)}K/yr`],
                  ['Universities', `${matchingUnis.length}+ listed`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-xs">
                    <span className="text-gray-500">{k}</span>
                    <span className="font-semibold text-gray-900">{v}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Top Countries</h3>
                {cat.topCountries.map(c => {
                  const cs = countryStats.find(s => s.country === c);
                  return (
                    <Link key={c} href={`/universities/country/${c.toLowerCase().replace(/ /g, '-')}`}
                      className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 text-sm hover:text-brand-700">
                      <span>{FLAGS[c] || '🌍'} {c}</span>
                      <span className="text-xs text-gray-500">{cs ? `${cs.count} unis` : 'Available'}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Related Courses</h3>
                {COURSE_CATEGORIES
                  .filter(c => c.slug !== slug && c.topCountries.some(t => cat.topCountries.includes(t)))
                  .slice(0, 6)
                  .map(c => (
                    <Link key={c.slug} href={`/courses/${c.slug}`}
                      className="block py-1.5 text-sm text-brand-700 hover:underline">
                      {c.emoji} {c.name} →
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── B) Individual course detail page ─────────────────────────────────────────
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

            {/* ROI */}
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
              <p className="text-sm text-gray-600 mt-4">* Based on average salaries of Indian students returning home after completing {c.name} abroad. Individual results may vary.</p>
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
                    a: `The job growth rate for ${c.name} is projected at ${c.roi.jobGrowthRate}% through 2031. This is significantly above average for all occupations.`,
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
