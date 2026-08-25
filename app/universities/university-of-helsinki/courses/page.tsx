import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { universityOfHelsinkiCourses } from '@/data/university-of-helsinki-courses';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';
import { isFeeVerified, verifiedAvgFee } from '@/lib/fee-verification';

export const metadata: Metadata = buildMetadata({
  title: 'University of Helsinki Courses 2026 – Programs, Fees & IELTS for Indian Students',
  description: '107 programs at University of Helsinki for international students. €13,000/yr. IELTS 6.5+. September intake. Free admission guidance from Jaivik Overseas.',
  path: '/universities/university-of-helsinki/courses',
  keywords: ['University of Helsinki courses', 'Helsinki international students', 'study in Finland', 'Finland university'],
});

const levelOrder = ['Bachelor','Master','PhD','Executive','Postgraduate'];

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
  const courses = universityOfHelsinkiCourses as any[];
  const groups = groupByLevel(courses);
  const totalCourses = courses.length;
  const avgFee = verifiedAvgFee(courses as any[], 'annualEUR');

  const _minIelts = courses.length ? Math.min(...courses.map((c: any) => Number(c.ieltsMin) || 6.5)) : 6.5;
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
        name: `How many courses does University of Helsinki offer for international students?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `University of Helsinki offers ${courses.length} programs for international students including Master's degree programmes taught in English.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the minimum IELTS score required at University of Helsinki?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The minimum IELTS score at University of Helsinki is ${_minIelts}+. High-demand programs may require up to 7.0.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the tuition fee at University of Helsinki?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The annual tuition at University of Helsinki is approximately €13,000 (≈ ₹${(13000 * 91 / 100000).toFixed(1)}L INR) for non-EU international students.`,
        },
      },
      {
        '@type': 'Question',
        name: `What intake does University of Helsinki offer?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `University of Helsinki offers a September intake for most programmes. Apply by January for September entry.`,
        },
      },
      {
        '@type': 'Question',
        name: `How can Indian students apply to University of Helsinki?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Indian students can apply to University of Helsinki in Finland through Jaivik Overseas Consultants — free application guidance, SOP writing, and visa assistance included.`,
        },
      },
    ],
  };

  const courseListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `University of Helsinki — Courses for International Students`,
    description: `${courses.length} programs at University of Helsinki, Finland. Min IELTS ${_minIelts}+.`,
    numberOfItems: courses.length,
    itemListElement: courses.slice(0, 5).map((c: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Course',
        name: c.name,
        provider: { '@type': 'CollegeOrUniversity', name: 'University of Helsinki' },
        ...(isFeeVerified(c as any) && Number(c.annualUSD) > 0
          ? { offers: { '@type': 'Offer', price: Number(c.annualUSD), priceCurrency: 'USD' } }
          : {}),
        educationalLevel: c.level ?? c.studyLevel ?? 'Postgraduate',
      },
    })),
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: 'University of Helsinki',
    sameAs: 'https://www.helsinki.fi',
    address: { '@type': 'PostalAddress', addressLocality: 'Helsinki', addressRegion: 'Uusimaa', addressCountry: 'FI' },
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
            <Link href="/universities/country/finland" className="hover:text-white">Finland</Link> /
            <span className="text-white">Helsinki</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇫🇮 Helsinki, Finland · #107 QS World Ranking
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">University of Helsinki — International Courses</h1>
              <p className="text-blue-200 text-lg mb-5">
                {totalCourses} programs · Avg €{Math.round(avgFee / 1000)}K EUR/yr · IELTS 6.5+ · September intake
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Courses', value: totalCourses },
                  { label: 'QS Ranking', value: '#107 World' },
                  { label: 'Avg Fee', value: `€${Math.round(avgFee / 1000)}K` },
                  { label: 'Campus', value: 'Helsinki' },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source="university-of-helsinki-courses" defaultCountry="Finland" compact />
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
                  <Link key={c.slug} href={`/universities/university-of-helsinki/courses/${c.slug}`}
                    className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all flex items-center justify-between group">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-brand-700 text-sm leading-snug">{c.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{c.duration} · {c.intakeMonths.join(' & ')} · {c.campus}</p>
                    </div>
                    <div className="ml-4 text-right flex-shrink-0">
                      <p className="text-sm font-bold text-brand-700">€{c.annualEUR.toLocaleString()}/yr</p>
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
            <LeadForm source="university-of-helsinki-sidebar" defaultCountry="Finland" />
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Quick Facts — Helsinki</h3>
              {[
                ['Location', 'Helsinki, Finland'],
                ['IELTS Min', '6.5 overall'],
                ['Intakes', 'September'],
                ['Work Rights', 'Post-study work permit available'],
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
