import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { ljmuCourses } from '@/data/ljmu-courses';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';
import { isFeeVerified, verifiedAvgFee } from '@/lib/fee-verification';

export const metadata: Metadata = buildMetadata({
  title: 'Liverpool John Moores University International Courses – All Programs, Fees & IELTS 2026',
  description: `Liverpool John Moores University — ${ljmuCourses.length} courses for international students. IELTS 6.0+. September intakes. Free admission guidance from Jaivik Overseas Consultants.`,
  path: '/universities/liverpool-john-moores-university/courses',
  keywords: ['LJMU courses', 'Liverpool John Moores University international', 'LJMU fees', 'study in UK', 'UK university Liverpool'],
});

const levelOrder = ["Undergraduate","Foundation","Graduate Certificate","Graduate Diploma","Masters","PhD","Postgraduate"];

function groupByLevel(courses: any[]) {
  const groups: Record<string, any[]> = {};
  courses.forEach((c: any) => {
    const lv = c.level;
    if (!groups[lv]) groups[lv] = [];
    groups[lv].push(c);
  });
  return groups;
}

export default function CoursesPage() {
  const courses = ljmuCourses as unknown as any[];
  const groups = groupByLevel(courses);
  const totalCourses = courses.length;
  const pgCourses = courses.filter((c: any) => c.studyLevel === 'Masters' || c.studyLevel === 'Postgraduate');
  const avgFee = verifiedAvgFee(pgCourses.length ? (pgCourses as any[]) : (courses as any[]), 'annualGBP');

  const _minIelts = courses.length ? Math.min(...courses.map((c: any) => Number(c.ieltsMin) || 6.0)) : 6.0;
  const _feeVerifiedCourses = (courses as any[]).filter((c: any) => isFeeVerified(c) && Number(c.annualUSD) > 0);
  const _avgFeeUSD = _feeVerifiedCourses.length
    ? Math.round(_feeVerifiedCourses.reduce((s: number, c: any) => s + Number(c.annualUSD), 0) / _feeVerifiedCourses.length)
    : 0;
  const _intakeSample: string[] = (courses[0] as any)?.intakeMonths ?? ['September'];
  const _intakesText = _intakeSample.join(' and ');

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How many courses does Liverpool John Moores University offer for international students?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Liverpool John Moores University offers ${courses.length} programs for international students including Undergraduate, Master's, and PhD degrees.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the minimum IELTS score required at Liverpool John Moores University?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The minimum IELTS score at Liverpool John Moores University is ${_minIelts}+. High-demand programs may require up to 7.0.`,
        },
      },
      ...(_avgFeeUSD > 0 ? [{
        '@type': 'Question',
        name: `What is the average tuition fee at Liverpool John Moores University?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The average annual tuition at Liverpool John Moores University is approximately ${_avgFeeUSD.toLocaleString()} USD. Fees vary by program and level.`,
        },
      }] : []),
      {
        '@type': 'Question',
        name: `What intake options does Liverpool John Moores University offer?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Liverpool John Moores University offers ${_intakesText} intake${_intakeSample.length > 1 ? 's' : ''}. Apply 3–6 months before the intake opening.`,
        },
      },
      {
        '@type': 'Question',
        name: `How can Indian students apply to Liverpool John Moores University?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Indian students can apply to Liverpool John Moores University through Jaivik Overseas Consultants — free application guidance, SOP writing, and visa assistance included.`,
        },
      },
    ],
  };

  const courseListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Liverpool John Moores University — Courses for International Students`,
    description: `${courses.length} programs at Liverpool John Moores University, United Kingdom. Min IELTS ${_minIelts}+.`,
    numberOfItems: courses.length,
    itemListElement: courses.slice(0, 5).map((c: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Course',
        name: c.name,
        provider: { '@type': 'CollegeOrUniversity', name: 'Liverpool John Moores University' },
        ...(isFeeVerified(c as any) && Number(c.annualUSD) > 0
          ? { offers: { '@type': 'Offer', price: Number(c.annualUSD), priceCurrency: 'USD' } }
          : {}),
        educationalLevel: c.level ?? c.studyLevel ?? 'Undergraduate',
      },
    })),
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: 'Liverpool John Moores University',
    sameAs: 'https://www.ljmu.ac.uk',
    address: { '@type': 'PostalAddress', addressLocality: 'Liverpool', addressRegion: 'England', addressCountry: 'GB' },
  };

  return (
    <>
      <JsonLd data={schema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={courseListSchema} />

      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="/universities/country/uk" className="hover:text-white">UK</Link> /
            <span className="text-white">Liverpool John Moores</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇬🇧 Liverpool, United Kingdom · TEF Gold
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Liverpool John Moores University — International Courses
              </h1>
              <p className="text-blue-200 text-lg mb-5">
                {totalCourses} programs · {avgFee > 0 ? `Avg £${avgFee.toLocaleString()}/yr` : 'Fees on request'} · IELTS 6.0+ · September intakes
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Courses', value: totalCourses },
                  { label: 'TEF Rating', value: 'Gold' },
                  { label: 'Avg PG Fee', value: avgFee > 0 ? `£${Math.round(avgFee/1000)}K` : 'On request' },
                  { label: 'Campus', value: 'Liverpool' },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source="ljmu-courses-index" defaultCountry="UK" compact />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-10">
          {Object.entries(groups)
            .sort(([a], [b]) => levelOrder.indexOf(a) - levelOrder.indexOf(b))
            .map(([level, lvCourses]) => (
            <div key={level}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                {level} Programs
                <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded-full font-normal">{(lvCourses as any[]).length}</span>
              </h2>
              <div className="space-y-3">
                {(lvCourses as any[]).sort((a: any, b: any) => a.name.localeCompare(b.name)).map((c: any) => (
                  <Link key={c.slug} href={`/universities/liverpool-john-moores-university/courses/${c.slug}`}
                    className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all flex items-center justify-between group">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-brand-700 text-sm leading-snug">
                        {c.name}
                        {(c as any).withdrawn && (
                          <span className="ml-2 align-middle inline-block bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            No longer offered
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{c.duration} · {c.intakeMonths.join(' & ')} · {c.campus}</p>
                    </div>
                    <div className="ml-4 text-right flex-shrink-0">
                      <p className="text-sm font-bold text-brand-700">{`£${c.annualGBP.toLocaleString()}/yr`}</p>
                      <p className="text-xs text-gray-400">≈ ₹{(c.annualINR/100000).toFixed(1)}L/yr</p>
                      <p className="text-xs text-gray-500">IELTS {c.ieltsMin}+</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="sticky top-20 space-y-5">
            <LeadForm source="ljmu-courses-sidebar" defaultCountry="UK" />
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Quick Facts — LJMU</h3>
              {[
                ['Established', '1823'],
                ['Location', 'Liverpool, England'],
                ['IELTS Min', '6.0 overall'],
                ['Intakes', 'September & January'],
                ['Work Rights', '20 hrs/week (term)'],
                ['Graduate Visa', '2 years post-study'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-xs">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-semibold text-gray-900">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
