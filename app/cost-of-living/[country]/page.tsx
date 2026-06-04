import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { costOfLivingGuides, getCostGuideBySlug } from '@/data/cost-of-living';
import { buildMetadata } from '@/lib/seo';
import LeadForm from '@/components/LeadForm';

export function generateStaticParams() {
  return costOfLivingGuides.map(g => ({ country: g.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ country: string }> }
): Promise<Metadata> {
  const { country } = await params;
  const guide = getCostGuideBySlug(country);
  if (!guide) return {};
  return buildMetadata({
    title: guide.metaTitle,
    description: guide.metaDescription,
    path: `/cost-of-living/${country}`,
    keywords: [`cost of living ${guide.country}`, 'study abroad budget', 'student expenses', 'Indian students 2026'],
  });
}

export default async function CostOfLivingPage(
  { params }: { params: Promise<{ country: string }> }
) {
  const { country } = await params;
  const guide = getCostGuideBySlug(country);
  if (!guide) notFound();

  const sym = guide.currencySymbol;
  const inrRate = guide.inrRate;

  function toINR(amount: number) {
    const val = Math.round((amount * inrRate) / 1000) * 1000;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${(val / 1000).toFixed(0)}K`;
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4 flex-wrap">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/cost-of-living" className="hover:text-white">Cost of Living</Link> /
            <span className="text-white">{guide.country}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <span className="inline-block bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                Cost of Living 2026
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-3">
                {guide.flagEmoji} Cost of Living in {guide.country} for Indian Students 2026
              </h1>
              <p className="text-blue-200 text-sm leading-relaxed mb-5">{guide.intro}</p>

              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-blue-300 text-xs mb-1">Annual Tuition</p>
                  <p className="text-white text-sm font-bold">{sym} {guide.annualTuitionRange.min.toLocaleString()}–{guide.annualTuitionRange.max.toLocaleString()}</p>
                  <p className="text-blue-300 text-xs">₹{(guide.annualTuitionRange.minINR / 100000).toFixed(1)}L–₹{(guide.annualTuitionRange.maxINR / 100000).toFixed(1)}L</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-blue-300 text-xs mb-1">Work Rights</p>
                  <p className="text-white text-xs font-semibold leading-snug">{guide.workRights.split('.')[0]}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-blue-300 text-xs mb-1">Part-Time Earnings</p>
                  <p className="text-white text-xs font-semibold leading-snug">{guide.averagePartTimeEarnings.split('=')[1]?.trim() || guide.averagePartTimeEarnings}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5">
              <LeadForm source={`col-${country}`} compact defaultCountry={guide.country} />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">

          {/* City breakdowns */}
          {guide.cities.map(city => (
            <div key={city.city} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-brand-700 text-white px-6 py-4">
                <h2 className="text-lg font-bold">📍 {city.city}</h2>
              </div>

              <div className="p-6">
                {/* Monthly breakdown table */}
                <h3 className="text-sm font-bold text-gray-800 mb-3">Monthly Expenses Breakdown</h3>
                <div className="overflow-x-auto rounded-xl border border-gray-200 mb-5">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Category</th>
                        <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">Monthly ({sym})</th>
                        <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">Monthly (INR)</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide hidden sm:table-cell">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: 'Rent', data: city.rent, note: city.rent.note },
                        { label: 'Groceries', data: city.groceries, note: 'Indian home cooking' },
                        { label: 'Transport', data: city.transport, note: city.transport.note },
                        { label: 'Utilities', data: city.utilities, note: city.utilities.note },
                        { label: 'Miscellaneous', data: city.misc, note: 'Phone, personal, entertainment' },
                      ].map((row, i) => (
                        <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 font-semibold text-gray-800 text-sm">{row.label}</td>
                          <td className="px-4 py-3 text-right text-gray-700 text-sm whitespace-nowrap">
                            {row.data.min === row.data.max
                              ? `${sym} ${row.data.min.toLocaleString()}`
                              : `${sym} ${row.data.min.toLocaleString()}–${row.data.max.toLocaleString()}`}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-700 text-sm whitespace-nowrap">
                            {row.data.min === row.data.max
                              ? toINR(row.data.min)
                              : `${toINR(row.data.min)}–${toINR(row.data.max)}`}
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell">{row.note || '—'}</td>
                        </tr>
                      ))}
                      <tr className="bg-brand-50 font-bold">
                        <td className="px-4 py-3 text-brand-900 text-sm">TOTAL / MONTH</td>
                        <td className="px-4 py-3 text-right text-brand-900 text-sm whitespace-nowrap">
                          {sym} {city.totalMonthly.min.toLocaleString()}–{city.totalMonthly.max.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-brand-900 text-sm whitespace-nowrap">
                          {toINR(city.totalMonthly.min)}–{toINR(city.totalMonthly.max)}
                        </td>
                        <td className="hidden sm:table-cell" />
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* City highlights */}
                <h3 className="text-sm font-bold text-gray-800 mb-2">💡 {city.city} for Indian Students</h3>
                <ul className="space-y-1.5">
                  {city.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          {/* City comparison */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🏙️ City Comparison: Monthly Living Cost</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brand-700 text-white">
                    <th className="px-4 py-3 text-left font-semibold text-xs uppercase">City</th>
                    <th className="px-4 py-3 text-right font-semibold text-xs uppercase">Monthly ({sym})</th>
                    <th className="px-4 py-3 text-right font-semibold text-xs uppercase">Monthly (INR)</th>
                    <th className="px-4 py-3 text-right font-semibold text-xs uppercase">Annual (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {guide.cities.map((city, i) => (
                    <tr key={city.city} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 font-semibold text-gray-800">{city.city}</td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {sym} {city.totalMonthly.min.toLocaleString()}–{city.totalMonthly.max.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {toINR(city.totalMonthly.min)}–{toINR(city.totalMonthly.max)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {toINR(city.totalMonthly.min * 12)}–{toINR(city.totalMonthly.max * 12)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Annual total with tuition */}
          <div className="bg-brand-50 rounded-2xl border border-brand-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">💰 Total Annual Cost (Tuition + Living)</h2>
            <div className="overflow-x-auto rounded-xl border border-brand-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brand-700 text-white">
                    <th className="px-4 py-3 text-left font-semibold text-xs uppercase">City</th>
                    <th className="px-4 py-3 text-right font-semibold text-xs uppercase">Living ({sym}/yr)</th>
                    <th className="px-4 py-3 text-right font-semibold text-xs uppercase">Tuition Range ({sym}/yr)</th>
                    <th className="px-4 py-3 text-right font-semibold text-xs uppercase">Total (INR/yr)</th>
                  </tr>
                </thead>
                <tbody>
                  {guide.cities.map((city, i) => {
                    const livingMin = city.totalMonthly.min * 12;
                    const livingMax = city.totalMonthly.max * 12;
                    const tuitionMin = guide.annualTuitionRange.min;
                    const tuitionMax = guide.annualTuitionRange.max;
                    return (
                      <tr key={city.city} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 font-semibold text-gray-800">{city.city}</td>
                        <td className="px-4 py-3 text-right text-gray-700">
                          {sym} {livingMin.toLocaleString()}–{livingMax.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-700">
                          {sym} {tuitionMin.toLocaleString()}–{tuitionMax.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-brand-800">
                          {toINR(livingMin + tuitionMin)}–{toINR(livingMax + tuitionMax)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Saving tips */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">💡 Money-Saving Tips for Indian Students</h2>
            <ul className="space-y-3">
              {guide.savingTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Work rights */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">💼 Part-Time Work Rights in {guide.country}</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">{guide.workRights}</p>
            <div className="bg-brand-50 rounded-xl p-4 border border-brand-100">
              <p className="text-sm font-semibold text-brand-800">📊 Estimated Part-Time Earnings:</p>
              <p className="text-sm text-gray-700 mt-1">{guide.averagePartTimeEarnings}</p>
            </div>
          </div>

          {/* Related links */}
          <div className="bg-brand-50 rounded-2xl p-5 border border-brand-100">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">🔗 Useful Links</h3>
            <div className="flex flex-wrap gap-2">
              {guide.relatedLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm bg-white border border-brand-200 text-brand-700 px-4 py-2 rounded-xl hover:bg-brand-700 hover:text-white transition-all font-medium"
                >
                  {link.label} →
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="sticky top-20 space-y-5">
            <LeadForm source={`col-sidebar-${country}`} defaultCountry={guide.country} />

            <div className="bg-brand-700 text-white rounded-2xl p-5">
              <p className="font-bold mb-2 text-sm">💰 Plan Your Budget</p>
              <p className="text-blue-200 text-xs mb-4">Our counsellors help you plan a realistic budget, find scholarships, and maximise your part-time earnings. Book a free session.</p>
              <Link href="/book-counselling" className="block text-center bg-gold-500 hover:bg-gold-600 text-white text-sm font-bold py-2.5 px-4 rounded-xl transition-colors">
                Book Free Budget Session →
              </Link>
              <a href="https://wa.me/919971226347" target="_blank" rel="noopener noreferrer"
                className="block text-center mt-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2.5 px-4 rounded-xl transition-colors">
                💬 WhatsApp Us
              </a>
              <a href="tel:+919971226347" className="block text-center mt-2 text-blue-200 hover:text-white text-xs font-medium transition-colors">
                📞 +91 99712 26347
              </a>
            </div>

            {/* Other guides */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Other Cost Guides</h3>
              {costOfLivingGuides.filter(g => g.slug !== country).map(g => (
                <Link key={g.slug} href={`/cost-of-living/${g.slug}`}
                  className="flex items-center gap-2 py-2.5 border-b border-gray-50 last:border-0 group">
                  <span className="text-lg">{g.flagEmoji}</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 group-hover:text-brand-700">Cost of Living in {g.country}</p>
                    <p className="text-xs text-gray-400">{g.cities.map(c => c.city).join(', ')}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Quick Links</h3>
              {[
                { href: `/visa-guide/${country}`, label: `🛂 ${guide.country} Visa Guide` },
                { href: `/universities/country/${country}`, label: `🎓 ${guide.country} Universities` },
                { href: '/mock-test', label: '📝 Free IELTS Mock Test' },
                { href: '/course-finder', label: '🔍 Course Finder' },
              ].map(l => (
                <Link key={l.href} href={l.href}
                  className="block py-2 border-b border-gray-50 last:border-0 text-xs font-medium text-brand-700 hover:text-brand-900">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
