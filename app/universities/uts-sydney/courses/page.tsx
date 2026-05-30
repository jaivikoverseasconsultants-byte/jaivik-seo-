import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { utsCourses } from '@/data/uts-courses';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'UTS Sydney International Courses â€“ All Programs, Fees & IELTS 2026',
  description: `University of Technology Sydney â€” ${utsCourses.length} courses for international students. Fees from A$28,000/yr. IELTS 6.5+. February & July intakes. Free admission guidance from Jaivik Overseas Consultants.`,
  path: '/universities/uts-sydney/courses',
  keywords: ['UTS Sydney courses', 'University of Technology Sydney international', 'UTS fees', 'study in Australia'],
});

const levelOrder = ['Undergraduate', 'Undergraduate (Honours)', 'Masters', 'Graduate Diploma', 'Graduate Certificate', 'Diploma', 'PhD', 'Postgraduate'];

function groupByLevel(courses: typeof utsCourses) {
  const groups: Record<string, typeof utsCourses> = {};
  courses.forEach(c => {
    const lv = c.level;
    if (!groups[lv]) groups[lv] = [];
    groups[lv].push(c);
  });
  return groups;
}

export default function UTSCoursesPage() {
  const groups = groupByLevel(utsCourses);
  const totalCourses = utsCourses.length;
  const avgFee = Math.round(utsCourses.reduce((s, c) => s + c.annualAUD, 0) / totalCourses);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: 'University of Technology Sydney',
    sameAs: 'https://www.uts.edu.au',
    address: { '@type': 'PostalAddress', addressLocality: 'Sydney', addressRegion: 'New South Wales', addressCountry: 'AU' },
  };

  return (
    <>
      <JsonLd data={schema} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <span className="text-white">UTS Sydney</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                ðŸ‡¦ðŸ‡º Sydney, Australia Â· #88 QS World Ranking
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                University of Technology Sydney â€” International Courses
              </h1>
              <p className="text-blue-200 text-lg mb-5">
                {totalCourses} programs Â· Avg A${avgFee.toLocaleString()}/yr Â· IELTS 6.5+ Â· Feb & Jul intakes
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Courses', value: totalCourses },
                  { label: 'QS Ranking', value: '#88' },
                  { label: 'Avg Annual Fee', value: `A$${(avgFee/1000).toFixed(0)}K` },
                  { label: 'Campus', value: 'Sydney CBD' },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source="uts-courses-index" defaultCountry="Australia" compact />
            </div>
          </div>
        </div>
      </section>

      {/* Course listing by level */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-10">
          {Object.entries(groups)
            .sort(([a], [b]) => levelOrder.indexOf(a) - levelOrder.indexOf(b))
            .map(([level, courses]) => (
            <div key={level}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                {level} Programs
                <span className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded-full font-normal">{courses.length}</span>
              </h2>
              <div className="space-y-3">
                {courses.sort((a, b) => a.name.localeCompare(b.name)).map(c => (
                  <Link key={c.slug} href={`/universities/uts-sydney/courses/${c.slug}`}
                    className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all flex items-center justify-between group">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-brand-700 text-sm leading-snug">{c.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{c.duration} Â· {c.intakeMonths.join(' & ')} Â· {c.campus}</p>
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

        {/* Sidebar */}
        <div>
          <div className="sticky top-20 space-y-5">
            <LeadForm source="uts-courses-sidebar" defaultCountry="Australia" />
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Quick Facts â€” UTS Sydney</h3>
              {[
                ['Established', '1988'],
                ['Location', 'Sydney CBD, NSW'],
                ['Campus', 'Urban â€” City Campus'],
                ['Int. Students', '~25%'],
                ['IELTS Min', '6.5 (Writing 6.0)'],
                ['Work Rights', '48 hrs/fortnight'],
                ['Post-Study', 'Grad Visa 2â€“4 years'],
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

