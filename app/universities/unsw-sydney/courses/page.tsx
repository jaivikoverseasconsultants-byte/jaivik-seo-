import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { unswW2Courses } from '@/data/unsw-w2-courses';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';
import { verifiedAvgFee } from '@/lib/fee-verification';

export const metadata: Metadata = buildMetadata({
  title: 'UNSW Sydney International Courses – All Programs, Fees & IELTS 2026',
  description: `UNSW Sydney – ${unswW2Courses.length} courses for international students. Free guidance from Jaivik Overseas Consultants.`,
  path: '/universities/unsw-sydney/courses',
  keywords: ['UNSW courses', 'UNSW Sydney', 'study in Australia'],
});

function groupByLevel(courses: typeof unswW2Courses) {
  const groups: Record<string, typeof unswW2Courses> = {};
  courses.forEach((c) => { const lv = c.studyLevel || 'Other'; if (!groups[lv]) groups[lv] = []; groups[lv].push(c); });
  return groups;
}

export default function CoursesPage() {
  const courses = unswW2Courses;
  const groups = groupByLevel(courses);
  const withFee = courses.filter(c => c.annualUSD > 0);
  const avgFeeUSD = verifiedAvgFee(withFee as any[], 'annualUSD');
  const feeINRLakh = withFee.length ? (withFee.reduce((s, c) => s + c.annualINR, 0) / withFee.length / 100000).toFixed(1) : '0';
  const levelOrder = ['Undergraduate', 'Postgraduate', 'MBA'];
  const orderedGroups = levelOrder.filter(l => groups[l]).map(l => [l, groups[l]] as [string, typeof unswW2Courses]);
  const allGroups = [...orderedGroups, ...Object.keys(groups).filter(l => !levelOrder.includes(l)).map(l => [l, groups[l]] as [string, typeof unswW2Courses])];

  const schema = { '@context': 'https://schema.org', '@type': 'CollegeOrUniversity', name: 'UNSW Sydney', sameAs: 'https://www.unsw.edu.au', url: 'https://www.unsw.edu.au' };
  const courseListSchema = {
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: 'UNSW Sydney — Courses for International Students',
    numberOfItems: courses.length,
    itemListElement: courses.slice(0, 5).map((c, i) => ({
      '@type': 'ListItem', position: i + 1,
      item: { '@type': 'Course', name: c.name, provider: { '@type': 'CollegeOrUniversity', name: 'UNSW Sydney' }, educationalLevel: c.studyLevel },
    })),
  };

  return (
    <>
      <JsonLd data={schema} />
      <JsonLd data={courseListSchema} />
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="/universities/unsw-sydney" className="hover:text-white">UNSW</Link> /
            <span>Courses</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">UNSW Sydney</h1>
          <p className="text-blue-100 text-lg mb-6">{courses.length} Programs · Sydney, Australia</p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/10 rounded-xl px-5 py-3 text-center"><div className="text-2xl font-bold">{courses.length}</div><div className="text-blue-200 text-xs">Courses</div></div>
            {avgFeeUSD > 0 && <div className="bg-white/10 rounded-xl px-5 py-3 text-center"><div className="text-2xl font-bold">${avgFeeUSD.toLocaleString()}</div><div className="text-blue-200 text-xs">Avg Fee/year (USD)</div></div>}
            {avgFeeUSD > 0 && <div className="bg-white/10 rounded-xl px-5 py-3 text-center"><div className="text-2xl font-bold">₹{feeINRLakh}L</div><div className="text-blue-200 text-xs">Avg Fee (INR)</div></div>}
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-10">
        {allGroups.map(([level, levelCourses]) => (
          <div key={level} className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-sm">{level}</span>
              <span className="text-gray-500 text-sm font-normal">{levelCourses.length} programs</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {levelCourses.map((course) => {
                const fee = course.annualAUD || course.annualUSD;
                return (
                  <Link key={course.id} href={`/universities/unsw-sydney/courses/${course.slug}`}
                    className="block bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-brand-200 transition-all group">
                    <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors mb-2 text-sm leading-snug">{course.name}</h3>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{course.level}</span>
                      {fee > 0 && <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full">A${fee.toLocaleString()}/yr</span>}
                      {course.ieltsMin > 0 && <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">IELTS {course.ieltsMin}+</span>}
                      <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">{course.duration}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>
      <section className="bg-brand-50 py-12 px-4"><div className="max-w-2xl mx-auto"><h2 className="text-2xl font-bold text-center text-brand-900 mb-2">Apply to UNSW</h2><p className="text-center text-gray-600 mb-6">Get free expert guidance from Jaivik Overseas Consultants</p><LeadForm /></div></section>
    </>
  );
}
