import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { tuMunichCourses } from '@/data/tu-munich-courses';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'TU Munich International Courses — Programs, Fees & IELTS 2026',
  description: `TU Munich (Technical University of Munich) — ${tuMunichCourses.length} courses for international students. Near-zero tuition (€300/yr admin fee). IELTS 6.5+. October intake. Free admission guidance.`,
  path: '/universities/technical-university-of-munich/courses',
  keywords: ['TU Munich courses', 'Technical University Munich international', 'study in Germany', 'TUM degree programs', 'TUM engineering'],
});

const levelOrder = ["Undergraduate", "Graduate Certificate", "Graduate Diploma", "Masters", "PhD", "Postgraduate"];

function groupByLevel(courses: any[]) {
  const g: Record<string, any[]> = {};
  courses.forEach((c: any) => { if (!g[c.studyLevel]) g[c.studyLevel] = []; g[c.studyLevel].push(c); });
  return g;
}

export default function CoursesPage() {
  const courses = tuMunichCourses as any[];
  const groups = groupByLevel(courses);
  const total = courses.length;

  const schema = {
    '@context': 'https://schema.org', '@type': 'CollegeOrUniversity',
    name: 'Technical University of Munich',
    sameAs: 'https://www.tum.de/en/',
    address: { '@type': 'PostalAddress', addressLocality: 'Munich', addressRegion: 'Bavaria', addressCountry: 'DE' },
  };

  return (
    <>
      <JsonLd data={schema} />
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="/universities/country/germany" className="hover:text-white">Germany</Link> /
            <Link href="/universities/technical-university-of-munich" className="hover:text-white">TU Munich</Link> /
            <span className="text-white">Courses</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇩🇪 Munich, Germany · #37 QS World Ranking
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                TU Munich — International Degree Programs
              </h1>
              <p className="text-blue-200 text-lg mb-5">
                {total} programs · ~€300/yr (admin fee only) · IELTS 6.5+ · October & April intakes
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Courses', value: total },
                  { label: 'QS Ranking', value: '#37 QS' },
                  { label: 'Annual Fee', value: '€300' },
                  { label: 'Campus', value: 'Munich / Garching' },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source="tum-courses-index" defaultCountry="Germany" compact />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-10">
          {Object.entries(groups)
            .sort(([a], [b]) => levelOrder.indexOf(a) - levelOrder.indexOf(b))
            .map(([level, lvC]) => (
            <div key={level}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                {level} Programs
                <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded-full">{(lvC as any[]).length}</span>
              </h2>
              <div className="space-y-3">
                {(lvC as any[]).sort((a: any, b: any) => a.name.localeCompare(b.name)).map((c: any) => (
                  <Link key={c.slug} href={`/universities/technical-university-of-munich/courses/${c.slug}`}
                    className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all flex items-center justify-between group">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-brand-700 text-sm leading-snug">{c.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{c.duration} · {c.intakeMonths.join(' & ')} · {c.campus}</p>
                    </div>
                    <div className="ml-4 text-right flex-shrink-0">
                      <p className="text-sm font-bold text-brand-700">€{c.annualEUR.toLocaleString()}/yr</p>
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
            <LeadForm source="tum-courses-sidebar" defaultCountry="Germany" />
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Quick Facts — TU Munich</h3>
              {[
                ['Established', '1868'],
                ['Location', 'Munich & Garching, Germany'],
                ['IELTS Min', '6.5 overall'],
                ['Intakes', 'October & April'],
                ['Tuition', '~€300/yr (admin fee only)'],
                ['Work Rights', 'Up to 20 hrs/week during studies'],
                ['Post-Study Visa', '18-month Job Seeker Visa'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-xs">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-semibold text-gray-900">{v}</span>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Other German Universities</h3>
              <div className="space-y-2">
                <Link href="/universities/lmu-munich/courses" className="block text-sm text-brand-700 hover:underline">LMU Munich Courses →</Link>
                <Link href="/universities/country/germany" className="block text-sm text-brand-700 hover:underline">All Germany Universities →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
