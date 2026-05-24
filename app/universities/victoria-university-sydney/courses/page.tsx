import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { vu_sydneyCourses } from '@/data/vu-sydney-courses';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'VU Sydney International Courses – All Programs, Fees & IELTS 2025',
  description: `Victoria University Sydney — ${(vu_sydneyCourses as unknown as any[]).length} courses for international students. IELTS 6+. February & July intakes. Free admission guidance from Jaivik Overseas Consultants.`,
  path: '/universities/victoria-university-sydney/courses',
  keywords: ['VU Sydney courses', 'Victoria University Sydney international', 'VU Sydney fees', 'study in Australia'],
});

const levelOrder = ["Undergraduate","Undergraduate (Honours)","Masters","Graduate Diploma","Graduate Certificate","Diploma","Certificate","PhD","Postgraduate"];

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
  const courses = vu_sydneyCourses as unknown as any[];
  const groups = groupByLevel(courses);
  const totalCourses = courses.length;
  const avgFee = Math.round(courses.reduce((s: number, c: any) => s + c.annualAUD, 0) / (totalCourses || 1));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: 'Victoria University Sydney',
    sameAs: 'https://www.vu.edu.au',
    address: { '@type': 'PostalAddress', addressLocality: 'Sydney', addressRegion: 'New South Wales', addressCountry: 'AU' },
  };

  return (
    <>
      <JsonLd data={schema} />

      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <span className="text-white">VU Sydney</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇦🇺 Sydney, Australia · #601 QS World Ranking
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Victoria University Sydney — International Courses
              </h1>
              <p className="text-blue-200 text-lg mb-5">
                {totalCourses} programs · Avg A${avgFee.toLocaleString()}/yr · IELTS 6+ · February & July intakes
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Courses', value: totalCourses },
                  { label: 'QS Ranking', value: '#601' },
                  { label: 'Avg Annual Fee', value: `A$${Math.round(avgFee/1000)}K` },
                  { label: 'Campus', value: 'Sydney Campus' },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source="vu-sydney-courses-index" defaultCountry="Australia" compact />
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
                  <Link key={c.slug} href={`/universities/victoria-university-sydney/courses/${c.slug}`}
                    className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all flex items-center justify-between group">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-brand-700 text-sm leading-snug">{c.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{c.duration} · {c.intakeMonths.join(' & ')} · {c.campus}</p>
                    </div>
                    <div className="ml-4 text-right flex-shrink-0">
                      <p className="text-sm font-bold text-brand-700">{`A$${c.annualAUD.toLocaleString()}/yr`}</p>
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
            <LeadForm source="vu-sydney-courses-sidebar" defaultCountry="Australia" />
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Quick Facts — VU Sydney</h3>
              {[
                ['Established', '1990'],
                ['Location', 'Sydney, New South Wales'],
                ['Campus', 'Sydney Campus'],
                ['IELTS Min', '6 overall'],
                ['Intakes', 'February & July'],
                ['Work Rights', '48 hrs/fortnight'],
                ['Post-Study', 'Grad Visa 2–4 years'],
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
