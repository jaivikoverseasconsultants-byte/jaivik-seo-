import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { fuberlinCourses } from '@/data/fu-berlin-courses';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: 'Free University of Berlin International Courses – All Programs, Fees & IELTS 2026',
  description: `Free University of Berlin – ${(fuberlinCourses as unknown as any[]).length} courses for international students. Free guidance from Jaivik Overseas Consultants.`,
  path: '/universities/free-university-berlin/courses',
  keywords: ['FU Berlin courses', 'Free University of Berlin international', 'study in Germany'],
});

const levelOrder = ['Undergraduate', 'Foundation', 'Graduate Certificate', 'Graduate Diploma', 'Masters', 'MBA', 'PhD', 'Postgraduate'];

function groupByLevel(courses: any[]) {
  const groups: Record<string, any[]> = {};
  courses.forEach((c: any) => { const lv = c.level || 'Other'; if (!groups[lv]) groups[lv] = []; groups[lv].push(c); });
  return groups;
}

export default function CoursesPage() {
  const courses = fuberlinCourses as unknown as any[];
  const groups = groupByLevel(courses);
  const totalCourses = courses.length;
  const pgCourses = courses.filter((c: any) => c.studyLevel !== 'Undergraduate');
  const avgFee = pgCourses.length
    ? Math.round(pgCourses.reduce((s: number, c: any) => s + (c.annualEUR || c.annualUSD || 0), 0) / pgCourses.length)
    : Math.round(courses.reduce((s: number, c: any) => s + (c.annualEUR || c.annualUSD || 0), 0) / (totalCourses || 1));
  const feeINRLakh = (avgFee * 90 / 100000).toFixed(1);

  const schema = {
    '@context': 'https://schema.org', '@type': 'CollegeOrUniversity',
    name: 'Free University of Berlin', sameAs: 'https://www.fu-berlin.de', url: 'https://www.fu-berlin.de',
  };
  const orderedGroups = levelOrder.filter(l => groups[l]).map(l => [l, groups[l]]);
  const allGroups = [...orderedGroups, ...Object.keys(groups).filter(l => !levelOrder.includes(l)).map(l => [l, groups[l]])] as [string, any[]][];

  return (
    <>
      <JsonLd data={schema} />
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="/universities/free-university-berlin" className="hover:text-white">FU Berlin</Link> /
            <span>Courses</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Free University of Berlin</h1>
          <p className="text-blue-100 text-lg mb-6">{totalCourses} Programs · Berlin, Germany · IELTS 6.0–7.0+</p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/10 rounded-xl px-5 py-3 text-center"><div className="text-2xl font-bold">{totalCourses}</div><div className="text-blue-200 text-xs">Courses</div></div>
            <div className="bg-white/10 rounded-xl px-5 py-3 text-center"><div className="text-2xl font-bold">€{avgFee.toLocaleString()}</div><div className="text-blue-200 text-xs">Avg PG Fee/year</div></div>
            <div className="bg-white/10 rounded-xl px-5 py-3 text-center"><div className="text-2xl font-bold">₹{feeINRLakh}L</div><div className="text-blue-200 text-xs">Avg Fee (INR)</div></div>
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
              {levelCourses.map((course: any) => {
                const fee = course.annualEUR || course.annualUSD || 0;
                return (
                  <Link key={course.id} href={`/universities/free-university-berlin/courses/${course.slug}`}
                    className="block bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-brand-200 transition-all group">
                    <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors mb-2 text-sm leading-snug">{course.name}</h3>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{course.level}</span>
                      <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full">€{fee.toLocaleString()}/yr</span>
                      <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">IELTS {course.ieltsMin}+</span>
                      <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">{course.duration}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>
      <section className="bg-brand-50 py-12 px-4"><div className="max-w-2xl mx-auto"><h2 className="text-2xl font-bold text-center text-brand-900 mb-2">Apply to FU Berlin</h2><p className="text-center text-gray-600 mb-6">Get free expert guidance from Jaivik Overseas Consultants</p><LeadForm /></div></section>
    </>
  );
}
