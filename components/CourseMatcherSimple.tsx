'use client';
import { useState } from 'react';
import Link from 'next/link';

const COUNTRIES = [
  { name: 'Canada',    flag: '🇨🇦', slug: 'canada',      feeRange: '₹8–35L', highlight: 'PR Pathway' },
  { name: 'UK',        flag: '🇬🇧', slug: 'uk',          feeRange: '₹12–30L', highlight: '2yr Graduate Visa' },
  { name: 'Australia', flag: '🇦🇺', slug: 'australia',   feeRange: '₹10–30L', highlight: '485 Work Visa' },
  { name: 'Germany',   flag: '🇩🇪', slug: 'germany',     feeRange: '₹1–5L', highlight: 'Near-Free Tuition' },
  { name: 'USA',       flag: '🇺🇸', slug: 'usa',         feeRange: '₹25–80L', highlight: 'OPT 3 Years' },
  { name: 'Ireland',   flag: '🇮🇪', slug: 'ireland',     feeRange: '₹12–20L', highlight: '2yr Stay-Back' },
  { name: 'Singapore', flag: '🇸🇬', slug: 'singapore',   feeRange: '₹18–35L', highlight: 'Asia Hub' },
  { name: 'Any',       flag: '🌍', slug: '',             feeRange: '', highlight: 'Best match' },
];

type Status = '12th Pass' | 'Graduate' | 'Working Professional';
type Budget = 'Under ₹5L' | '₹5–10L' | '₹10–20L' | '₹20L+';

const STATUSES: { value: Status; icon: string; desc: string }[] = [
  { value: '12th Pass',           icon: '📘', desc: 'Looking for Undergraduate programs' },
  { value: 'Graduate',            icon: '🎓', desc: 'Looking for Masters / MBA' },
  { value: 'Working Professional', icon: '💼', desc: 'Executive MBA / Part-time programs' },
];

const BUDGETS: { value: Budget; icon: string; desc: string }[] = [
  { value: 'Under ₹5L',  icon: '💚', desc: 'Germany, Eastern Europe options' },
  { value: '₹5–10L',    icon: '💛', desc: 'Canada colleges, UK affordable unis' },
  { value: '₹10–20L',   icon: '🧡', desc: 'Australia, UK, Canada universities' },
  { value: '₹20L+',     icon: '❤️',  desc: 'Top-ranked global universities' },
];

function buildWhatsAppLink(country: string, status: Status | '', budget: Budget | '') {
  const msg = encodeURIComponent(
    `Hi Jaivik Overseas! I used your quiz and my preferences are:\n🌍 Country: ${country || 'Any'}\n🎓 Status: ${status || 'Not specified'}\n💰 Budget: ${budget || 'Not specified'}\n\nPlease send me matching university options!`
  );
  return `https://wa.me/919971226347?text=${msg}`;
}

export default function CourseMatcherSimple() {
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState('');
  const [countrySlug, setCountrySlug] = useState('');
  const [status, setStatus] = useState<Status | ''>('');
  const [budget, setBudget] = useState<Budget | ''>('');

  function selectCountry(name: string, slug: string) {
    setCountry(name);
    setCountrySlug(slug);
    setStep(2);
  }

  function selectStatus(s: Status) {
    setStatus(s);
    setStep(3);
  }

  function selectBudget(b: Budget) {
    setBudget(b);
    setStep(4);
  }

  const waLink = buildWhatsAppLink(country, status, budget);
  const uniLink = countrySlug ? `/universities/country/${countrySlug}` : '/universities';

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map(n => (
          <div key={n} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
              step > n ? 'bg-green-500 text-white' : step === n ? 'bg-brand-700 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > n ? '✓' : n}
            </div>
            <p className={`text-xs font-medium hidden sm:block ${step >= n ? 'text-gray-900' : 'text-gray-400'}`}>
              {n === 1 ? 'Country' : n === 2 ? 'Your Status' : 'Budget'}
            </p>
            {n < 3 && <div className={`flex-1 h-0.5 mx-1 ${step > n ? 'bg-green-400' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Country */}
      {step === 1 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Where do you want to study?</h2>
          <p className="text-gray-500 text-sm mb-6">Select a destination country</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {COUNTRIES.map(c => (
              <button
                key={c.name}
                onClick={() => selectCountry(c.name, c.slug)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-gray-100 hover:border-brand-400 hover:bg-brand-50 transition-all group"
              >
                <span className="text-3xl">{c.flag}</span>
                <p className="font-bold text-gray-900 group-hover:text-brand-700 text-sm">{c.name}</p>
                {c.feeRange && <p className="text-xs text-gray-400">{c.feeRange}/yr</p>}
                {c.highlight && <span className="text-[10px] bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium group-hover:bg-brand-100">{c.highlight}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Status */}
      {step === 2 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <button onClick={() => setStep(1)} className="text-brand-700 text-sm hover:underline">← Back</button>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">{country} {COUNTRIES.find(c => c.name === country)?.flag}</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1 mt-3">What is your current qualification?</h2>
          <p className="text-gray-500 text-sm mb-6">This helps us match the right level of program</p>
          <div className="space-y-3">
            {STATUSES.map(s => (
              <button
                key={s.value}
                onClick={() => selectStatus(s.value)}
                className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-100 hover:border-brand-400 hover:bg-brand-50 transition-all text-left group"
              >
                <span className="text-3xl flex-shrink-0">{s.icon}</span>
                <div>
                  <p className="font-bold text-gray-900 group-hover:text-brand-700 text-base">{s.value}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{s.desc}</p>
                </div>
                <span className="ml-auto text-brand-600 text-lg font-light">→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Budget */}
      {step === 3 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <button onClick={() => setStep(2)} className="text-brand-700 text-sm hover:underline">← Back</button>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">{country} · {status}</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1 mt-3">What is your annual budget?</h2>
          <p className="text-gray-500 text-sm mb-6">Tuition fee per year (excluding living costs)</p>
          <div className="grid grid-cols-2 gap-3">
            {BUDGETS.map(b => (
              <button
                key={b.value}
                onClick={() => selectBudget(b.value)}
                className="flex flex-col items-start gap-2 p-5 rounded-2xl border-2 border-gray-100 hover:border-brand-400 hover:bg-brand-50 transition-all text-left group"
              >
                <span className="text-2xl">{b.icon}</span>
                <p className="font-bold text-gray-900 group-hover:text-brand-700 text-base">{b.value}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Results */}
      {step === 4 && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setStep(3)} className="text-brand-700 text-sm hover:underline">← Back</button>
            </div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">🎯</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Your Profile is Ready!</h2>
              <p className="text-gray-500 text-sm">Based on: <strong>{country}</strong> · <strong>{status}</strong> · <strong>{budget}</strong>/yr</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {[
                { icon: '🌍', label: 'Destination', value: country || 'Any Country' },
                { icon: '🎓', label: 'Program Level', value: status === '12th Pass' ? 'Undergraduate' : status === 'Graduate' ? 'Masters / MBA' : 'Executive MBA' },
                { icon: '💰', label: 'Budget/Year', value: budget },
              ].map(item => (
                <div key={item.label} className="bg-brand-50 rounded-xl p-3 text-center">
                  <p className="text-lg">{item.icon}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.label}</p>
                  <p className="font-bold text-brand-700 text-sm mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl transition-colors text-base shadow-lg shadow-green-500/20"
              >
                <svg className="w-5 h-5 fill-white flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Get My Free University List on WhatsApp
              </a>
              <Link
                href={uniLink}
                className="w-full flex items-center justify-center gap-2 border-2 border-brand-700 text-brand-700 hover:bg-brand-50 font-semibold py-3.5 rounded-2xl transition-colors text-sm"
              >
                Browse {country || 'All'} Universities →
              </Link>
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
              🔒 No spam · Our counsellors respond within 30 minutes · 100% free guidance
            </p>
          </div>

          <div className="bg-brand-700 rounded-2xl p-5 text-white text-center">
            <p className="font-bold mb-1">Want a personalised university shortlist?</p>
            <p className="text-blue-200 text-sm mb-3">13 years experience · 1,400+ students placed · Free service</p>
            <Link href="/book-counselling" className="inline-block bg-gold-500 hover:bg-gold-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
              Book Free 30-min Counselling →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
