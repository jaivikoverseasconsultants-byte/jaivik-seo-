import Link from 'next/link';
import type { Metadata } from 'next';
import { mdisCourses } from '@/data/mdis-courses';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Management Development Institute of Singapore Courses & Programs 2026 – Fees, IELTS & Intakes',
  description: '25 programs at Management Development Institute of Singapore for Indian students. Tuition, IELTS requirements, intake dates. Free counselling by Jaivik Overseas.',
  path: '/universities/mdis-singapore/courses',
});

const levels = ['All', 'Bachelor', 'Master', 'Doctoral', 'Diploma'];

export default function MdisCoursesPage() {
  const courses = mdisCourses;
  const avgFee = Math.round(courses.reduce((s,c)=>s+c.annualSGD,0)/courses.length);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-700">Home</Link> /
        <Link href="/universities" className="hover:text-brand-700">Universities</Link> /
        <Link href="/universities/mdis-singapore" className="hover:text-brand-700">Management Development Institute of Singapore</Link> /
        <span className="text-gray-800 font-medium">Courses</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Management Development Institute of Singapore — All Courses & Programs 2026</h1>
        <p className="text-gray-500">{courses.length} programs listed · Avg ~S$${Math.round(avgFee/1000)}K SGD/yr</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm sticky top-20">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Quick Facts</h3>
            {[
              ['Programs', courses.length.toString()],
              ['Min IELTS', courses[0]?.ieltsMin + '+'],
              ['Intake', 'Aug & Jan'],
              ['Country', 'Singapore'],
              ['Work Rights', '16 hrs/wk (with approval)'],
              ['Post-Study', 'Employment Pass eligible'],
            ].map(([k,v])=>(
              <div key={k} className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-xs">
                <span className="text-gray-500">{k}</span>
                <span className="font-semibold text-gray-900 text-right">{v}</span>
              </div>
            ))}
            <Link href="/book-counselling" className="btn-primary w-full text-center mt-4 block text-sm">
              Free Counselling →
            </Link>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-3">
          {courses.map(c => (
            <Link key={c.id} href={`/universities/mdis-singapore/courses/${c.slug}`}
              className="block bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 hover:text-brand-700 text-sm">{c.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{c.level} · {c.duration} · {c.campus}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">IELTS {c.ieltsMin}+</span>
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{c.intakeMonths.join(' & ')}</span>
                  </div>
                </div>
                <div className="text-right whitespace-nowrap">
                  <p className="font-bold text-brand-700 text-sm">S$${(c.annualSGD/1000).toFixed(0)}K/yr</p>
                  <p className="text-xs text-gray-400">≈ ₹{(c.annualINR/100000).toFixed(1)}L/yr</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
