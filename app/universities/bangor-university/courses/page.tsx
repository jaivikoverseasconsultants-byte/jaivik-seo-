import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { bangorCourses } from '@/data/bangor-courses';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Bangor University Courses 2026 – Programs, Fees & IELTS for Indian Students',
  description: `Bangor University — ${(bangorCourses as unknown as any[]).length} programs for international students. IELTS 6.0+. September intakes. Free admission guidance from Jaivik Overseas.`,
  path: '/universities/bangor-university/courses',
  keywords: ['Bangor courses', 'Bangor University international', 'Bangor University fees', 'study in United Kingdom'],
});

const levelOrder = ['Undergraduate','Foundation','Master','MBA','Postgraduate','PhD'];

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
  const courses = bangorCourses as unknown as any[];
  const groups = groupByLevel(courses);
  const totalCourses = courses.length;
  const avgFee = courses.length
    ? Math.round(courses.reduce((s: number, c: any) => s + (Number(c.annualGBP) || 0), 0) / courses.length)
    : 0;

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
      { '@type': 'Question', name: 'How many courses does Bangor University offer for international students?',
        acceptedAnswer: { '@type': 'Answer', text: `Bangor University offers ${courses.length} programs for international students.` } },
      { '@type': 'Question', name: 'What is the minimum IELTS score required at Bangor University?',
        acceptedAnswer: { '@type': 'Answer', text: `The minimum IELTS at Bangor University is ${_minIelts}+.` } },
      { '@type': 'Question', name: 'What is the average tuition fee at Bangor University?',
        acceptedAnswer: { '@type': 'Answer', text: `Avg tuition at Bangor University is approx ${_avgFeeUSD.toLocaleString()} USD (≈ ₹${(_avgFeeUSD * 84 / 100000).toFixed(1)}L INR).` } },
      { '@type': 'Question', name: 'How can Indian students apply to Bangor University?',
        acceptedAnswer: { '@type': 'Answer', text: 'Apply through Jaivik Overseas Consultants — free guidance, SOP writing, and visa assistance.' } },
    ],
  };

  const schema = {
    '@context': 'https://schema.org', '@type': 'CollegeOrUniversity',
    name: 'Bangor University', sameAs: 'https://www.bangor.ac.uk',
    address: { '@type': 'PostalAddress', addressLocality: 'Bangor', addressRegion: 'Wales', addressCountry: 'GB' },
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
            <Link href="/universities/country/uk" className="hover:text-white">United Kingdom</Link> /
            <span className="text-white">Bangor</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🏴󠁧󠁢󠁷󠁬󠁳󠁿 Bangor, United Kingdom · QS 801+
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Bangor University — International Courses</h1>
              <p className="text-blue-200 text-lg mb-5">
                {totalCourses} programs · Avg £{Math.round(avgFee / 1000)}K/yr · IELTS 6.0+ · September intakes
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Courses', value: totalCourses },
                  { label: 'QS Ranking', value: '#801+' },
                  { label: 'Avg Fee', value: `£${Math.round(avgFee/1000)}K` },
                  { label: 'Campus', value: 'Bangor' },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source="bangor-university-courses" defaultCountry="United Kingdom" compact />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-10">
          {Object.entries(groups).sort(([a], [b]) => levelOrder.indexOf(a) - levelOrder.indexOf(b)).map(([level, lvCourses]) => (
            <div key={level}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                {level} Programs
                <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded-full font-normal">{(lvCourses as any[]).length}</span>
              </h2>
              <div className="space-y-3">
                {(lvCourses as any[]).sort((a: any, b: any) => a.name.localeCompare(b.name)).map((c: any) => (
                  <Link key={c.slug} href={`/universities/bangor-university/courses/${c.slug}`}
                    className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all flex items-center justify-between group">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-brand-700 text-sm leading-snug">{c.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{c.duration} · {c.intakeMonths?.join(' & ')} · {c.campus}</p>
                    </div>
                    <div className="ml-4 text-right flex-shrink-0">
                      <p className="text-sm font-bold text-brand-700">£{(c.annualGBP / 1000).toFixed(0)}K/yr</p>
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
            <LeadForm source="bangor-university-courses-sidebar" defaultCountry="United Kingdom" />
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Quick Facts — Bangor</h3>
              {[
                ['Location', 'Bangor, United Kingdom'],
                ['Established', '1884'],
                ['IELTS Min', '6.0 overall'],
                ['Intakes', 'September'],
                ['Work Rights', '20 hrs/week (term)'],
                ['Post-Study', '2 years post-study'],
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
