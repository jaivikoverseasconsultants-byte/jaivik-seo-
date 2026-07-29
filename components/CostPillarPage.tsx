import Link from 'next/link';
import { getUniversityBySlug } from '@/data/universities';
import type { CostPillarConfig } from '@/data/cost-pillars';
import {
  getTuitionStats, getCostGuideForPillar, getCombinedCityBudgets, getBudgetBandsForCountry,
} from '@/lib/cost-pillars';
import { authorPersonSchema } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import VerifiedBy from '@/components/VerifiedBy';
import WhatsAppLeadCTA from '@/components/WhatsAppLeadCTA';
import FindMyCourseCTA from '@/components/FindMyCourseCTA';

export default function CostPillarPage({ config }: { config: CostPillarConfig }) {
  const tuition = getTuitionStats(config.registryCountry);
  const guide = getCostGuideForPillar(config);
  const combined = tuition && guide ? getCombinedCityBudgets(tuition, guide) : [];
  const budgetBands = getBudgetBandsForCountry(config.registryCountry);

  const cheapestCity = guide?.cities.length
    ? guide.cities.slice().sort((a, b) => a.totalMonthlyINR.min - b.totalMonthlyINR.min)[0]
    : null;

  const faqs = [
    tuition && combined.length
      ? {
          q: `What is the total cost of studying in ${config.displayName} for Indian students?`,
          a: `Combining real tuition fee data (₹${tuition.cheapestLakh}L–₹${tuition.maxLakh}L per year, from ${tuition.count} real courses) with real city-by-city living costs, total yearly budgets on this site range from roughly ₹${Math.min(...combined.map(c => parseFloat(c.lowYearlyLakh))).toFixed(1)}L to ₹${Math.max(...combined.map(c => parseFloat(c.highYearlyLakh))).toFixed(1)}L, depending on your university, course, and city. See the table below for a city-by-city breakdown.`,
        }
      : null,
    cheapestCity
      ? {
          q: `What is the cheapest city to live in while studying in ${config.displayName}?`,
          a: `Among the cities on this site, ${cheapestCity.city} has the lowest real cost of living — ₹${cheapestCity.totalMonthlyINR.min.toLocaleString('en-IN')}–₹${cheapestCity.totalMonthlyINR.max.toLocaleString('en-IN')} per month for rent, groceries, transport, and other essentials. See the living cost table below for the full city comparison.`,
        }
      : null,
    tuition
      ? {
          q: `What is the average tuition fee in ${config.displayName}?`,
          a: `Across ${tuition.count} real courses on this site, tuition fees range from ₹${tuition.cheapestLakh}L to ₹${tuition.maxLakh}L per year, with a median of ₹${tuition.medianLakh}L. ${tuition.bachelor ? `Bachelor's programmes range ₹${tuition.bachelor.minLakh}L–₹${tuition.bachelor.maxLakh}L. ` : ''}${tuition.master ? `Master's programmes range ₹${tuition.master.minLakh}L–₹${tuition.master.maxLakh}L. ` : ''}See the cheapest options table below, or the full course list at the university-specific hubs.`,
        }
      : null,
    guide
      ? {
          q: `How can I reduce the cost of studying in ${config.displayName}?`,
          a: `Choosing a lower-fee course and a lower-cost city both help — see the "Ways to Reduce Cost" section below for real, filtered course lists. Part-time work also helps offset living costs: ${guide.workRights} Typical part-time earnings: ${guide.averagePartTimeEarnings}.`,
        }
      : null,
  ].filter((f): f is { q: string; a: string } => f !== null);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    author: authorPersonSchema,
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <JsonLd data={faqSchema} />

      <div className="flex items-center gap-2 text-gray-400 text-xs mb-6">
        <Link href="/" className="hover:text-brand-700">Home</Link> /
        <span>Cost of Studying in {config.displayName}</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {config.flagEmoji} Cost of Studying in {config.displayName} for Indian Students — Tuition + Living Costs in INR 2026
        </h1>
        <p className="text-gray-600 max-w-3xl">
          {tuition ? `${tuition.count} real courses` : 'Real course data'} combined with real, city-by-city cost-of-living
          data for {guide ? guide.cities.length : 0} {config.displayName} cities — everything computed from our own crawled
          data, never an invented industry average.
        </p>
      </div>

      {/* Tuition */}
      {tuition && (
        <div className="mb-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Real Tuition Fees in {config.displayName}</h2>
          <p className="text-gray-500 text-sm mb-4">Computed from {tuition.count} real courses crawled from university course pages.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-lg font-bold text-brand-700">₹{tuition.cheapestLakh}L</p>
              <p className="text-xs text-gray-500 mt-1">Cheapest Real Course</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-lg font-bold text-brand-700">₹{tuition.medianLakh}L</p>
              <p className="text-xs text-gray-500 mt-1">Median</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-lg font-bold text-brand-700">₹{tuition.maxLakh}L</p>
              <p className="text-xs text-gray-500 mt-1">Highest Found</p>
            </div>
          </div>
          {(tuition.bachelor || tuition.master) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tuition.bachelor && (
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-xs text-blue-600 font-medium mb-1">🎓 Bachelor&apos;s Programmes ({tuition.bachelor.count} real courses)</p>
                  <p className="font-bold text-gray-900">₹{tuition.bachelor.minLakh}L – ₹{tuition.bachelor.maxLakh}L/year</p>
                  <p className="text-xs text-gray-500 mt-1">Median: ₹{tuition.bachelor.medianLakh}L</p>
                </div>
              )}
              {tuition.master && (
                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="text-xs text-purple-600 font-medium mb-1">🎓 Master&apos;s Programmes ({tuition.master.count} real courses)</p>
                  <p className="font-bold text-gray-900">₹{tuition.master.minLakh}L – ₹{tuition.master.maxLakh}L/year</p>
                  <p className="text-xs text-gray-500 mt-1">Median: ₹{tuition.master.medianLakh}L</p>
                </div>
              )}
            </div>
          )}
          <Link
            href={`/universities/${tuition.cheapestCourse.universitySlug}/courses/${tuition.cheapestCourse.slug}`}
            className="inline-block mt-4 text-sm text-brand-700 font-semibold hover:underline"
          >
            View Cheapest Course — {tuition.cheapestCourse.name} at {getUniversityBySlug(tuition.cheapestCourse.universitySlug)?.name ?? tuition.cheapestCourse.universitySlug} →
          </Link>
        </div>
      )}

      {/* Living costs */}
      {guide && (
        <div className="mb-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Real Living Costs by City</h2>
          <p className="text-gray-500 text-sm mb-4">Monthly costs for rent, groceries, transport, utilities, and other essentials — real, city-specific data, not a country-wide average.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-3 font-semibold text-gray-700">City</th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-700">Rent</th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-700">Groceries</th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-700">Transport</th>
                  <th className="text-right py-2 pl-2 font-semibold text-gray-700">Total/Month (INR)</th>
                </tr>
              </thead>
              <tbody>
                {guide.cities.map(city => (
                  <tr key={city.city} className="border-b border-gray-100 hover:bg-brand-50">
                    <td className="py-2.5 pr-3 font-medium text-gray-900">{city.city}</td>
                    <td className="text-right py-2.5 px-2 text-gray-700">{city.currency} {city.rent.min}–{city.rent.max}</td>
                    <td className="text-right py-2.5 px-2 text-gray-700">{city.currency} {city.groceries.min}–{city.groceries.max}</td>
                    <td className="text-right py-2.5 px-2 text-gray-700">{city.currency} {city.transport.min}–{city.transport.max}</td>
                    <td className="text-right py-2.5 pl-2 font-semibold text-gray-900">₹{city.totalMonthlyINR.min.toLocaleString('en-IN')}–₹{city.totalMonthlyINR.max.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link href={`/cost-of-living/${config.costGuideSlug}`} className="inline-block mt-4 text-sm text-brand-700 font-semibold hover:underline">
            Full {config.displayName} Cost of Living Guide (saving tips, per-city highlights) →
          </Link>
        </div>
      )}

      {/* Total combined budget */}
      {combined.length > 0 && (
        <div className="mb-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Total Yearly Budget — Tuition + Living Combined</h2>
          <p className="text-gray-500 text-sm mb-4">
            Each range below sums our real tuition fee range (₹{tuition!.cheapestLakh}L–₹{tuition!.maxLakh}L/year) with that
            city&apos;s real living-cost range (×12 months) — an honest combination of two real ranges, not a single invented average.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-3 font-semibold text-gray-700">City</th>
                  <th className="text-right py-2 pl-2 font-semibold text-gray-700">Total Yearly Budget (Tuition + Living)</th>
                </tr>
              </thead>
              <tbody>
                {combined.map(({ city, lowYearlyLakh, highYearlyLakh }) => (
                  <tr key={city.city} className="border-b border-gray-100 hover:bg-brand-50">
                    <td className="py-2.5 pr-3 font-medium text-gray-900">{city.city}</td>
                    <td className="text-right py-2.5 pl-2 font-semibold text-brand-700">₹{lowYearlyLakh}L – ₹{highYearlyLakh}L</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ways to reduce cost */}
      <div className="mb-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Ways to Reduce Your Cost in {config.displayName}</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <Link href={`/cheapest-universities-${config.cheapestHubSlug}`} className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-2 rounded-full hover:bg-brand-100 transition-colors">
            Cheapest Universities in {config.displayName} →
          </Link>
          {budgetBands.map(b => (
            <Link key={b} href={`/${config.budgetCountrySlug}-under-${b}-lakh`} className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-2 rounded-full hover:bg-brand-100 transition-colors">
              Study in {config.displayName} Under ₹{b}L →
            </Link>
          ))}
          {config.pswHubSlug && (
            <Link href={`/courses-with-psw/${config.pswHubSlug}`} className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-2 rounded-full hover:bg-brand-100 transition-colors">
              Courses with Post-Study Work Rights →
            </Link>
          )}
        </div>
        {guide && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-sm font-semibold text-green-800 mb-1">💼 Earn Back Part of Your Cost</p>
            <p className="text-xs text-green-700">{guide.workRights}</p>
            <p className="text-xs text-green-700 mt-1">Typical part-time earnings: {guide.averagePartTimeEarnings}</p>
          </div>
        )}
      </div>

      {/* FAQ */}
      {faqs.length > 0 && (
        <div className="mb-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Cost of Studying in {config.displayName} — Frequently Asked Questions</h2>
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, i) => (
              <details key={i} className="group py-3 first:pt-0 last:pb-0" open={i === 0}>
                <summary className="flex items-start justify-between gap-3 cursor-pointer list-none">
                  <span className="text-sm font-semibold text-gray-900 leading-snug">{faq.q}</span>
                  <span className="flex-shrink-0 mt-0.5 text-brand-700 transition-transform group-open:rotate-45 text-lg leading-none">+</span>
                </summary>
                <p className="text-sm text-gray-700 leading-relaxed mt-2.5 pr-6">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <FindMyCourseCTA headline={`Not sure which ${config.displayName} university fits YOUR profile & budget?`} />
      </div>

      <div className="mt-6">
        <WhatsAppLeadCTA
          headline={`Get ${config.displayName} Universities Matching Your Budget on WhatsApp`}
          context={`Cost of studying in ${config.displayName}`}
          source={`cost-pillar-${config.slug}`}
        />
      </div>

      <div className="mt-6">
        <VerifiedBy />
      </div>
    </div>
  );
}
