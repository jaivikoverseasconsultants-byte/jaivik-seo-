import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import CurrencyConverter from '@/components/CurrencyConverter';
import Link from 'next/link';

export const metadata: Metadata = buildMetadata({
  title: 'Currency Converter – USD, CAD, GBP, AUD to INR | Jaivik Overseas',
  description:
    'Live currency converter for Indian students studying abroad. Convert USD, CAD, GBP, AUD, EUR, SGD, NZD, AED, DKK, SEK to Indian Rupees (INR) with live exchange rates. Free tool by Jaivik Overseas Consultants.',
  path: '/currency-converter',
  keywords: ['currency converter', 'USD to INR', 'CAD to INR', 'GBP to INR', 'AUD to INR', 'study abroad fees in rupees'],
});

const POPULAR_CONVERSIONS = [
  { from: 'USD', amount: 30000, label: 'US university tuition (1 year)' },
  { from: 'CAD', amount: 25000, label: 'Canadian university tuition (1 year)' },
  { from: 'GBP', amount: 20000, label: 'UK university tuition (1 year)' },
  { from: 'AUD', amount: 35000, label: 'Australian university tuition (1 year)' },
  { from: 'EUR', amount: 15000, label: 'European university tuition (1 year)' },
];

const CURRENCY_INFO = [
  { code: 'USD', country: 'United States', flag: '🇺🇸', note: 'OPT work permit up to 36 months for STEM graduates' },
  { code: 'CAD', country: 'Canada', flag: '🇨🇦', note: 'PGWP up to 3 years; PR pathway via Express Entry' },
  { code: 'GBP', country: 'United Kingdom', flag: '🇬🇧', note: 'Graduate Route Visa – 2 years post-study work' },
  { code: 'AUD', country: 'Australia', flag: '🇦🇺', note: 'Subclass 485 visa – up to 4 years post-study work' },
  { code: 'EUR', country: 'Europe (Eurozone)', flag: '🇪🇺', note: 'Job-seeker visas available in Germany, Netherlands & more' },
  { code: 'SGD', country: 'Singapore', flag: '🇸🇬', note: 'One-Year Tech Pass & Employment Pass available' },
  { code: 'NZD', country: 'New Zealand', flag: '🇳🇿', note: 'Post-Study Work Visa up to 3 years' },
  { code: 'AED', country: 'UAE (Dubai)', flag: '🇦🇪', note: 'No income tax; freelance & employment visas available' },
  { code: 'DKK', country: 'Denmark', flag: '🇩🇰', note: 'Post-graduate work permit; strong tech & pharma sector' },
  { code: 'SEK', country: 'Sweden', flag: '🇸🇪', note: '12-month job-seeker visa after graduation' },
];

export default function CurrencyConverterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-800 to-brand-900 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            💱 Live Exchange Rates
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Study Abroad Currency Converter
          </h1>
          <p className="text-blue-200 text-lg mb-2">
            Convert tuition fees &amp; living costs to Indian Rupees instantly
          </p>
          <p className="text-blue-300 text-sm">
            Supports USD, CAD, GBP, AUD, EUR, SGD, NZD, AED, DKK &amp; SEK → INR · Rates updated every 24 hours
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Main converter */}
          <div>
            <CurrencyConverter />
            <p className="text-xs text-gray-400 mt-3 text-center">
              Rates from ExchangeRate-API · Cached 24 hours · For reference only
            </p>
          </div>

          {/* Info panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-3 text-sm">Why Convert to INR?</h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  Plan your study abroad budget in familiar Indian Rupees
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  Compare total cost of study across different countries
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  Estimate education loan requirements in INR
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  Understand living cost in rupees before you travel
                </li>
              </ul>
            </div>

            <div className="bg-brand-50 rounded-2xl p-5 border border-brand-100">
              <h2 className="font-bold text-brand-900 mb-3 text-sm">Typical Annual Costs in INR</h2>
              <div className="space-y-2">
                {POPULAR_CONVERSIONS.map(c => (
                  <div key={c.from} className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">{c.label}</span>
                    <span className="font-semibold text-brand-700 text-right ml-2">
                      {c.from} {c.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">*Use converter above for live INR equivalent</p>
            </div>
          </div>
        </div>

        {/* Currency guide */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Currencies for Indian Students Studying Abroad</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CURRENCY_INFO.map(c => (
              <div key={c.code} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{c.flag}</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{c.code} – {c.country}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{c.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          <strong>Disclaimer:</strong> Currency conversions shown here are indicative only and based on mid-market exchange rates.
          Actual rates offered by banks, remittance services, or forex bureaus will differ. INR figures are approximate
          (1 USD ≈ ₹83.5 as reference). Please contact your bank or Jaivik Overseas Consultants for accurate fee estimates
          before making any financial decisions.
        </div>

        {/* CTA */}
        <div className="mt-8 bg-brand-700 rounded-2xl p-6 text-white text-center">
          <h2 className="text-xl font-bold mb-2">Need Help Planning Your Study Abroad Budget?</h2>
          <p className="text-blue-200 text-sm mb-4">
            Our counsellors help Indian students understand the true cost of studying abroad — including tuition, living, visa,
            and forex. Book a free session today.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/book-counselling" className="btn-gold inline-block">
              Book Free Counselling →
            </Link>
            <Link href="/universities" className="inline-block bg-white/10 border border-white/30 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/20 transition-colors">
              Browse Universities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
