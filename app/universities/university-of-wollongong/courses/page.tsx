import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { uowCourses } from '@/data/uow-courses';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

import { annualFeeLabel, averageAnnualFee } from '@/lib/course-fee-display';
import { isFeeVerified } from '@/lib/fee-verification';
export const metadata: Metadata = buildMetadata({
  title: 'University of Wollongong International Courses – All Programs, Fees & IELTS 2026',
  description: `University of Wollongong — ${(uowCourses as unknown as any[]).length} courses for international students. IELTS 6+. February & July intakes. Free admission guidance from Jaivik Overseas Consultants.`,
  path: '/universities/university-of-wollongong/courses',
  keywords: ['UOW courses', 'University of Wollongong international', 'UOW fees', 'study in Australia Wollongong'],
});

const levelOrder = ['Undergraduate', 'Bachelor', 'Masters', 'Graduate Diploma', 'Graduate Certificate', 'PhD', 'Postgraduate'];

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
  const courses = uowCourses as unknown as any[];
  const groups = groupByLevel(courses);
  const totalCourses = courses.length;
  const avgFee = averageAnnualFee(courses);
  const _minIelts = courses.length ? Math.min(...courses.map((c: any) => Number(c.ieltsMin) || 6.0)) : 6.0;
  const _pricedCourses = courses.filter((c: any) => Number(c.annualUSD) > 0 && isFeeVerified(c));
  const _avgFeeUSD = _pricedCourses.length ? Math.round(_pricedCourses.reduce((s: number, c: any) => s + Number(c.annualUSD), 0) / _pricedCourses.length) : 0;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: `How many courses does the University of Wollongong offer for international students?`, acceptedAnswer: { '@type': 'Answer', text: `UOW offers ${courses.length} programs for international students including Undergraduate, Master's, and PhD degrees.` } },
      { '@type': 'Question', name: `What is the minimum IELTS score required at UOW?`, acceptedAnswer: { '@type': 'Answer', text: `The minimum IELTS score at UOW is ${_minIelts}+. Some programs may require higher scores.` } },
      ...(_avgFeeUSD > 0 ? [{ '@type': 'Question', name: `What is the average tuition fee at UOW?`, acceptedAnswer: { '@type': 'Answer', text: `The average annual tuition at UOW is approximately $${_avgFeeUSD.toLocaleString()} USD (≈ ₹${(_avgFeeUSD * 84 / 100000).toFixed(1)}L INR).` } }] : []),
      { '@type': 'Question', name: `What intakes does UOW offer?`, acceptedAnswer: { '@type': 'Answer', text: `UOW offers February and July intakes. Apply 3–6 months before the intake.` } },
      { '@type': 'Question', name: `How can Indian students apply to UOW?`, acceptedAnswer: { '@type': 'Answer', text: `Indian students can apply to UOW through Jaivik Overseas Consultants — free application guidance, SOP writing, and visa assistance included.` } },
    ],
  };

  const schema = {
    '@context': 'https://schema.org', '@type': 'CollegeOrUniversity',
    name: 'University of Wollongong',
    sameAs: 'https://www.uow.edu.au',
    address: { '@type': 'PostalAddress', addressLocality: 'Wollongong', addressRegion: 'New South Wales', addressCountry: 'AU' },
  };

  return (
    <>
      <JsonLd data={schema} />
      <JsonLd data={faqSchema} />

      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <span className="text-white">University of Wollongong</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇦🇺 Wollongong, NSW, Australia · #173 QS World Ranking
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                University of Wollongong — International Courses
              </h1>
              <p className="text-blue-200 text-lg mb-5">
                {totalCourses} programs · {avgFee > 0 ? `Avg A$${avgFee.toLocaleString()}/yr` : 'Fees on request'} · IELTS 6+ · February & July intakes
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Courses', value: totalCourses },
                  { label: 'QS Ranking', value: '#173' },
                  { label: 'Avg Annual Fee', value: `A$${Math.round(avgFee / 1000)}K` },
                  { label: 'Campus', value: 'Wollongong, NSW' },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source="uow-courses-index" defaultCountry="Australia" compact />
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
                  <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded-full font-normal">{lvCourses.length}</span>
                </h2>
                <div className="space-y-3">
                  {(lvCourses as any[]).sort((a: any, b: any) => a.name.localeCompare(b.name)).map((c: any) => (
                    <Link key={c.slug} href={`/universities/university-of-wollongong/courses/${c.slug}`}
                      className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all flex items-center justify-between group">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 group-hover:text-brand-700 text-sm leading-snug">{c.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{c.duration} · {c.intakeMonths.join(' & ')} · {c.campus}</p>
                      </div>
                      <div className="ml-4 text-right flex-shrink-0">
                        <p className="text-sm font-bold text-brand-700">{annualFeeLabel(c)}</p>
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
            <LeadForm source="uow-courses-sidebar" defaultCountry="Australia" />
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Quick Facts — UOW</h3>
              {[
                ['Established', '1951'],
                ['Location', 'Wollongong, NSW'],
                ['QS Ranking', '#173 (2025)'],
                ['IELTS Min', '6.0 overall'],
                ['Intakes', 'February & July'],
                ['Work Rights', '48 hrs/fortnight'],
                ['Post-Study', '485 Visa – 2 to 4 years'],
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
