import Link from 'next/link';
import type { Metadata } from 'next';
import { universities, countries } from '@/data/universities';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Top Universities Abroad for Indian Students 2026',
  description: 'Explore 50+ top universities in USA, UK, Canada, Australia, Germany & Singapore. Compare fees, rankings, visa rates, and intake dates. Free admission guidance from Jaivik Overseas Consultants, Ghaziabad.',
  path: '/universities',
  keywords: ['top universities abroad', 'best universities for Indian students', 'study abroad universities'],
});

export default function UniversitiesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Top Universities Abroad for Indian Students</h1>
        <p className="text-gray-500">Compare {universities.length} universities across {countries.length} countries. Filter by country, fees, ranking, and more.</p>
      </div>

      {/* Filter by Country */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link href="/universities" className="px-4 py-2 bg-brand-700 text-white rounded-full text-sm font-medium">All</Link>
        {countries.map(c => (
          <Link key={c} href={`/universities/country/${c.toLowerCase().replace(' ', '-')}`}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:border-brand-300 hover:text-brand-700 transition-colors">
            {c}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {universities.map(u => (
          <Link key={u.id} href={`/universities/${u.slug}`}
            className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-gray-900 group-hover:text-brand-700">{u.name}</p>
                <p className="text-xs text-gray-500">{u.city}, {u.country}</p>
              </div>
              <span className="badge bg-brand-50 text-brand-700 text-xs">#{u.qsRanking} QS</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs mb-4">
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <p className="font-bold text-brand-700">${(u.annualTuitionUSD / 1000).toFixed(0)}K</p>
                <p className="text-gray-400">Tuition/yr</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <p className="font-bold text-green-600">{u.visaApprovalRate}%</p>
                <p className="text-gray-400">Visa Rate</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <p className="font-bold text-orange-500">{u.acceptanceRate}%</p>
                <p className="text-gray-400">Accept Rate</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {u.intakeMonths.slice(0, 2).map(m => (
                  <span key={m} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{m}</span>
                ))}
              </div>
              <span className="text-xs text-brand-700 font-medium">View Details â†’</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

