import Link from 'next/link';
import type { Metadata } from 'next';
import { courses, courseCategories } from '@/data/courses';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Courses to Study Abroad from India â€“ Fees, Jobs & ROI 2026',
  description: `Explore ${courses.length}+ courses available to study abroad. Compare fees, job growth rates, salary, and eligibility. Find the best course for your profile. Free guidance from Jaivik Overseas Consultants, Ghaziabad.`,
  path: '/courses',
  keywords: ['courses to study abroad', 'best courses for Indian students abroad', 'MS MBA courses abroad'],
});

const categoryColors: Record<string, string> = {
  'Engineering & Technology': 'bg-blue-50 text-blue-700',
  'Business & Management': 'bg-purple-50 text-purple-700',
  'Healthcare & Medicine': 'bg-green-50 text-green-700',
  'Law & Social Sciences': 'bg-yellow-50 text-yellow-700',
  'PhD & Research': 'bg-red-50 text-red-700',
  'Undergraduate': 'bg-orange-50 text-orange-700',
};

export default function CoursesPage() {
  const grouped = courseCategories.map(cat => ({
    category: cat,
    courses: courses.filter(c => c.category === cat),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Courses to Study Abroad from India</h1>
        <p className="text-gray-500">Compare {courses.length} programs across {courseCategories.length} categories. Find your perfect course by fees, salary, and job growth.</p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {courseCategories.map(cat => (
          <Link key={cat}
            href={`/courses/category/${cat.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, 'and')}`}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:border-brand-300 hover:text-brand-700 transition-colors">
            {cat}
          </Link>
        ))}
      </div>

      {/* Grouped by category */}
      <div className="space-y-12">
        {grouped.map(({ category, courses: cats }) => (
          <div key={category}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>{category}</span>
              <span className="text-sm font-normal text-gray-400">({cats.length} courses)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cats.map(c => (
                <Link key={c.id} href={`/courses/${c.slug}`}
                  className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`badge text-xs ${categoryColors[c.category] || 'bg-gray-100 text-gray-600'}`}>
                      {c.level}
                    </span>
                    <span className={`badge text-xs ${c.demandLevel === 'Very High' ? 'bg-red-50 text-red-600' : c.demandLevel === 'High' ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-600'}`}>
                      {c.demandLevel} Demand
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-brand-700 mb-2 text-sm leading-tight">{c.name}</h3>
                  <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="font-bold text-brand-700">${(c.avgFeesUSD / 1000).toFixed(0)}K</p>
                      <p className="text-gray-400">Avg Fees</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="font-bold text-green-600">+{c.roi.jobGrowthRate}%</p>
                      <p className="text-gray-400">Job Growth</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="font-bold text-orange-500">{c.duration.split('â€“')[0]}yr</p>
                      <p className="text-gray-400">Duration</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {c.countriesOffered.slice(0, 3).map(country => (
                      <span key={country} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{country}</span>
                    ))}
                    {c.countriesOffered.length > 3 && (
                      <span className="text-xs text-gray-400">+{c.countriesOffered.length - 3} more</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

