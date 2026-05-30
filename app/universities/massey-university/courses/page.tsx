import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { masseyCourses } from '@/data/massey-courses';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Massey University International Courses â€“ Programs, Fees & IELTS 2026',
  description: `Massey University â€” ${(masseyCourses as unknown as any[]).length} courses for international students. IELTS 6+. February & July intakes. Free admission guidance from Jaivik Overseas Consultants.`,
  path: '/universities/massey-university/courses',
  keywords: ['Massey courses', 'Massey University international', 'study in New Zealand', 'New Zealand university'],
});

const levelOrder = ["Undergraduate","Foundation","Graduate Certificate","Graduate Diploma","Masters","PhD","Postgraduate"];

function groupByLevel(courses: any[]) {
  const g: Record<string, any[]> = {};
  courses.forEach((c: any) => { if (!g[c.level]) g[c.level] = []; g[c.level].push(c); });
  return g;
}

export default function CoursesPage() {
  const courses = masseyCourses as unknown as any[];
  const groups  = groupByLevel(courses);
  const total   = courses.length;
  const pgC     = courses.filter((c: any) => c.studyLevel === 'Masters' || c.studyLevel === 'Postgraduate');
  const avgFee  = pgC.length
    ? Math.round(pgC.reduce((s: number, c: any) => s + c.annualNZD, 0) / pgC.length)
    : Math.round(courses.reduce((s: number, c: any) => s + c.annualNZD, 0) / (total || 1));

  const schema = {
    '@context': 'https://schema.org', '@type': 'CollegeOrUniversity',
    name: 'Massey University', sameAs: 'https://www.massey.ac.nz',
    address: { '@type': 'PostalAddress', addressLocality: 'Palmerston North', addressRegion: 'Manawatu', addressCountry: 'NZ' },
  };

  return (
    <>
      <JsonLd data={schema} />
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="/universities/country/new-zealand" className="hover:text-white">New Zealand</Link> /
            <span className="text-white">Massey</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                ðŸ‡³ðŸ‡¿ Palmerston North, New Zealand Â· #401 QS World Ranking
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Massey University â€” International Courses
              </h1>
              <p className="text-blue-200 text-lg mb-5">
                {total} programs Â· Avg NZ${avgFee.toLocaleString()}/yr Â· IELTS 6+ Â· February & July intakes
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Courses', value: total },
                  { label: 'QS Ranking', value: '#401 QS' },
                  { label: 'Avg PG Fee', value: `NZ$${Math.round(avgFee/1000)}K` },
                  { label: 'Campus', value: 'Palmerston North' },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source="massey-courses-index" defaultCountry="New Zealand" compact />
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
                  <Link key={c.slug} href={`/universities/massey-university/courses/${c.slug}`}
                    className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all flex items-center justify-between group">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-brand-700 text-sm leading-snug">{c.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{c.duration} Â· {c.intakeMonths.join(' & ')} Â· {c.campus}</p>
                    </div>
                    <div className="ml-4 text-right flex-shrink-0">
                      <p className="text-sm font-bold text-brand-700">{`NZ$${c.annualNZD.toLocaleString()}/yr`}</p>
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
            <LeadForm source="massey-courses-sidebar" defaultCountry="New Zealand" />
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Quick Facts â€” Massey</h3>
              {[
                ['Established', '1927'],
                ['Location', 'Palmerston North, New Zealand'],
                ['IELTS Min', '6 overall'],
                ['Intakes', 'February & July'],
                ['Work Rights', '20 hrs/week (term)'],
                ['Post-Study Visa', 'Open Work Visa (Post-Study)'],
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

