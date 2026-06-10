import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { okanaganCourses } from '@/data/okanagan-courses';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'OC International Courses – All Programs, Fees & IELTS 2026',
  description: `Okanagan College — ${(okanaganCourses as unknown as any[]).length} courses for international students. PGWP Eligible · IELTS 6+. September & January intakes. Free admission guidance from Jaivik Overseas Consultants.`,
  path: '/universities/okanagan-college/courses',
  keywords: ['OC courses', 'Okanagan College international', 'OC fees', 'study in Canada', 'Canada university', 'PGWP'],
});

const levelOrder = ["Undergraduate","Honours Bachelor","Advanced Diploma","Graduate Certificate","Masters","Graduate Diploma","Diploma","Certificate","Foundation","PhD","Postgraduate"];

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
  const courses = okanaganCourses as unknown as any[];
  const groups = groupByLevel(courses);
  const totalCourses = courses.length;
  const avgFee = Math.round(courses.reduce((s: number, c: any) => s + c.annualCAD, 0) / (totalCourses || 1));

  
  const _minIelts = courses.length ? Math.min(...courses.map((c: any) => Number(c.ieltsMin) || 6.0)) : 6.0;
  const _avgFeeUSD = courses.length
    ? Math.round(courses.reduce((s: number, c: any) => s + (Number(c.annualUSD) || 0), 0) / courses.length)
    : 0;
  const _intakeSample: string[] = (courses[0] as any)?.intakeMonths ?? ['September'];
  const _intakesText = _intakeSample.join(' and ');

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How many courses does Okanagan College offer for international students?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Okanagan College offers ${courses.length} programs for international students including Undergraduate, Master's, and PhD degrees.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the minimum IELTS score required at Okanagan College?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The minimum IELTS score at Okanagan College is ${_minIelts}+. High-demand programs may require up to 7.0.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the average tuition fee at Okanagan College?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The average annual tuition at Okanagan College is approximately ${_avgFeeUSD.toLocaleString()} USD (≈ ₹${(_avgFeeUSD * 84 / 100000).toFixed(1)}L INR). Fees vary by program and level.`,
        },
      },
      {
        '@type': 'Question',
        name: `What intake options does Okanagan College offer?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Okanagan College offers ${_intakesText} intake${_intakeSample.length > 1 ? 's' : ''}. Apply 3–6 months before the intake opening.`,
        },
      },
      {
        '@type': 'Question',
        name: `How can Indian students apply to Okanagan College?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Indian students can apply to Okanagan College in Canada through Jaivik Overseas Consultants — free application guidance, SOP writing, and visa assistance included.`,
        },
      },
    ],
  };

  const courseListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Okanagan College — Courses for International Students`,
    description: `${courses.length} programs at Okanagan College, Canada. Min IELTS ${_minIelts}+.`,
    numberOfItems: courses.length,
    itemListElement: courses.slice(0, 5).map((c: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Course',
        name: c.name,
        provider: { '@type': 'CollegeOrUniversity', name: 'Okanagan College' },
        offers: { '@type': 'Offer', price: Number(c.annualUSD) || 0, priceCurrency: 'USD' },
        educationalLevel: c.level ?? c.studyLevel ?? 'Undergraduate',
      },
    })),
  };


  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: 'Okanagan College',
    sameAs: 'https://www.okanagan.bc.ca',
    address: { '@type': 'PostalAddress', addressLocality: 'Kelowna', addressRegion: 'British Columbia', addressCountry: 'CA' },
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
            <Link href="/universities/country/canada" className="hover:text-white">Canada</Link> /
            <span className="text-white">OC</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇨🇦 Kelowna, Canada · PGWP Eligible
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Okanagan College — International Courses
              </h1>
              <p className="text-blue-200 text-lg mb-5">
                {totalCourses} programs · Avg CAD $${avgFee.toLocaleString()}/yr · IELTS 6+ · September & January intakes
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Courses', value: totalCourses },
                  { label: 'QS Ranking', value: 'N/A' },
                  { label: 'Avg Annual Fee', value: `$${Math.round(avgFee/1000)}K CAD` },
                  { label: 'PGWP', value: 'Eligible ✅' },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source="okanagan-courses-index" defaultCountry="Canada" compact />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-10">
          {Object.entries(groups)
            .sort(([a], [b]) => {
              const oa = levelOrder.indexOf(a) === -1 ? 99 : levelOrder.indexOf(a);
              const ob = levelOrder.indexOf(b) === -1 ? 99 : levelOrder.indexOf(b);
              return oa - ob;
            })
            .map(([level, lvCourses]) => (
            <div key={level}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                {level} Programs
                <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded-full font-normal">{lvCourses.length}</span>
              </h2>
              <div className="space-y-3">
                {(lvCourses as any[]).sort((a: any, b: any) => a.name.localeCompare(b.name)).map((c: any) => (
                  <Link key={c.slug} href={`/universities/okanagan-college/courses/${c.slug}`}
                    className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all flex items-center justify-between group">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-brand-700 text-sm leading-snug">{c.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{c.duration} · {c.intakeMonths.join(' & ')} · {c.campus}</p>
                    </div>
                    <div className="ml-4 text-right flex-shrink-0">
                      <p className="text-sm font-bold text-brand-700">{`$${c.annualCAD.toLocaleString()} CAD/yr`}</p>
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
            <LeadForm source="okanagan-courses-sidebar" defaultCountry="Canada" />
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Quick Facts — OC</h3>
              {[
                ['Established', '1963'],
                ['Location', 'Kelowna, British Columbia'],
                ['Campus', 'Kelowna Campus'],
                ['IELTS Min', '6 overall'],
                ['Intakes', 'September & January'],
                ['Work Rights', '24 hrs/week (term)'],
                ['PGWP', 'Eligible — up to 3 years'],
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

