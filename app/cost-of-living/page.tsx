import type { Metadata } from 'next';
import Link from 'next/link';
import { costOfLivingGuides } from '@/data/cost-of-living';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Cost of Living Abroad 2026 for Indian Students | Canada, UK & Australia',
  description: 'Detailed cost of living guides for Indian students studying abroad in 2026. Monthly budgets for Toronto, Vancouver, London, Manchester, Sydney, and Melbourne in INR.',
  path: '/cost-of-living',
  keywords: ['cost of living abroad', 'study abroad budget', 'student expenses Canada UK Australia', 'Indian students monthly budget'],
});

export default function CostOfLivingIndexPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Cost of Living 2026
          </span>
          <h1 className="text-3xl font-bold mb-3">Cost of Living Guides for Indian Students</h1>
          <p className="text-blue-200 text-sm leading-relaxed">
            City-by-city monthly budget breakdowns — rent, groceries, transport and more — in both local currency and INR. Updated for 2026.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {costOfLivingGuides.map(guide => (
            <Link
              key={guide.slug}
              href={`/cost-of-living/${guide.slug}`}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-200 transition-all group"
            >
              <div className="text-4xl mb-3">{guide.flagEmoji}</div>
              <h2 className="text-base font-bold text-gray-900 group-hover:text-brand-700 mb-1">{guide.country}</h2>
              <p className="text-xs text-gray-500 mb-3">{guide.cities.map(c => c.city).join(' · ')}</p>

              <div className="space-y-2 mb-4">
                {guide.cities.slice(0, 2).map(city => (
                  <div key={city.city} className="flex justify-between text-xs">
                    <span className="text-gray-500">{city.city} monthly</span>
                    <span className="font-semibold text-gray-800">
                      ₹{Math.round(city.totalMonthlyINR.min / 1000)}K–₹{Math.round(city.totalMonthlyINR.max / 1000)}K
                    </span>
                  </div>
                ))}
              </div>

              <span className="text-xs font-semibold text-brand-700 group-hover:text-brand-900">
                Full Breakdown →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-brand-50 rounded-2xl p-8 text-center border border-brand-100">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Plan Your Study Abroad Budget</h2>
          <p className="text-sm text-gray-600 mb-5 max-w-xl mx-auto">
            Get a personalised budget plan from our counsellors. We help you find scholarships, plan part-time work, and make the most of your money abroad.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/book-counselling"
              className="bg-brand-700 hover:bg-brand-800 text-white text-sm font-bold py-3 px-8 rounded-xl transition-colors">
              Book Free Budget Session
            </Link>
            <a href="https://wa.me/919971226347" target="_blank" rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-3 px-8 rounded-xl transition-colors">
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
