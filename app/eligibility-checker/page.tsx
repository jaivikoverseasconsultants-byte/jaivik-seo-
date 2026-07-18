'use client';

import { useState } from 'react';
import Link from 'next/link';

// NOTE (2026-07-18, BUILD-LOG.md §2 items 11-13): this page used to score
// students against a hand-typed `UNI_REQS` array (ieltsMin/gpaMin/backlogs/
// annualINRL per university) with a "Strong/Possible/Stretch" tiering
// algorithm. None of those per-university numbers were real — they were
// fabricated placeholder data, not sourced from any university's actual
// admissions page. That entire matching engine has been removed. This page
// now honestly collects the same profile information (still useful context
// for a counsellor) but does not pretend to auto-score it against invented
// thresholds — see the "Results" step below.

// Real, static slugs — /universities/country/<hub> exists for all of these
// (app/universities/country/[country]/page.tsx's normalizeCountry() map);
// cheapestHub is only set where /cheapest-universities-<slug> actually
// exists (data/fear-cluster-guides.ts's CHEAPEST_COUNTRY_SLUGS) — France has
// no cheapest-in-country hub, so it's intentionally omitted there.
const COUNTRY_SLUGS: Record<string, { hub: string; cheapestHub?: string }> = {
  UK: { hub: 'uk', cheapestHub: 'uk' },
  Canada: { hub: 'canada', cheapestHub: 'canada' },
  Australia: { hub: 'australia', cheapestHub: 'australia' },
  Germany: { hub: 'germany', cheapestHub: 'germany' },
  Ireland: { hub: 'ireland', cheapestHub: 'ireland' },
  Singapore: { hub: 'singapore', cheapestHub: 'singapore' },
  'New Zealand': { hub: 'new-zealand', cheapestHub: 'new-zealand' },
  USA: { hub: 'usa', cheapestHub: 'usa' },
  Netherlands: { hub: 'netherlands', cheapestHub: 'netherlands' },
  France: { hub: 'france' },
};

const COUNTRIES = Object.keys(COUNTRY_SLUGS);
const BUDGETS = ['Under ₹15L/yr', '₹15–25L/yr', '₹25–35L/yr', '₹35L+/yr'];

export default function EligibilityCheckerPage() {
  const [step, setStep] = useState(1);
  const [qual, setQual] = useState('');
  const [pct, setPct] = useState('');
  const [backlogs, setBacklogs] = useState('0');
  const [gap, setGap] = useState('None');
  const [ielts, setIelts] = useState('');
  const [budget, setBudget] = useState('');
  const [countries, setCountries] = useState<string[]>(['UK']);
  const [name, setNameV] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const ieltsNum = parseFloat(ielts) || 0;
  const hasBacklogs = backlogs !== '0';
  const hasGap = gap !== 'None';
  const lowOrNoIelts = ielts === '' || ieltsNum < 6.5;

  const selectedCountries = countries.length > 0 ? countries : COUNTRIES;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = new FormData();
    body.append('name', name);
    body.append('email', email);
    body.append('phone', phone);
    body.append('message', `Eligibility Checker — Qual: ${qual}, %: ${pct}, IELTS: ${ielts}, Gap: ${gap}, Backlogs: ${backlogs}, Countries: ${countries.join(', ')}, Budget: ${budget}`);
    await fetch('https://formspree.io/f/xgoqzezk', { method: 'POST', body, headers: { Accept: 'application/json' } });
    setSubmitted(true);
  }

  return (
    <>
    <section className="bg-gradient-to-br from-[#0a1628] to-[#1a2e4a] text-white py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center gap-2 text-blue-200 text-xs mb-4 justify-center">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-white">Eligibility Checker</span>
        </div>
        <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          ✅ Free · No Sign-up Required
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">University Eligibility Checker 2026</h1>
        <p className="text-blue-200 max-w-xl mx-auto">
          Tell us your profile — we&apos;ll point you to real universities and honest next steps, not a made-up
          pass/fail score.
        </p>
      </div>
    </section>
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <p className="text-gray-500">Answer a few questions — get real resources and a path to a counsellor who checks current, exact requirements.</p>
      </div>

      {step === 1 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Your Qualification</label>
              <select value={qual} onChange={e => setQual(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500">
                <option value="">Select…</option>
                {['12th / HSC', "Bachelor's Degree", "Master's Degree", 'Working Professional'].map(q => (
                  <option key={q}>{q}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Percentage / CGPA (out of 100 or 10)</label>
              <input type="number" placeholder="e.g. 72 or 7.2" value={pct} onChange={e => setPct(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Number of Backlogs</label>
              <select value={backlogs} onChange={e => setBacklogs(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500">
                {['0', '1-2', '3-5', '5+'].map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Gap Year(s)</label>
              <select value={gap} onChange={e => setGap(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500">
                {['None', '1 year', '2 years', '3+ years'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">IELTS Score (or expected)</label>
              <input type="number" step="0.5" min="4" max="9" placeholder="e.g. 6.5" value={ielts} onChange={e => setIelts(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500" />
              <p className="text-xs text-gray-400 mt-1">Enter 0 if not yet taken</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Annual Budget</label>
              <select value={budget} onChange={e => setBudget(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500">
                <option value="">Any budget</option>
                {BUDGETS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Target Countries (select multiple)</label>
            <div className="flex flex-wrap gap-2">
              {COUNTRIES.map(c => (
                <button key={c}
                  onClick={() => setCountries(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    countries.includes(c)
                      ? 'bg-brand-700 text-white border-brand-700'
                      : 'border-gray-200 text-gray-700 hover:border-brand-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">Leave all unselected to check all countries</p>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!qual || !pct}
            className="w-full py-3.5 bg-brand-700 hover:bg-brand-800 disabled:opacity-40 text-white font-bold rounded-xl transition-colors"
          >
            See My Results →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep(1)} className="text-sm text-brand-700 hover:underline">← Edit Profile</button>
            <p className="text-sm text-gray-500">Profile: {qual}, {pct}%, IELTS {ielts || 'not given'}</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <h2 className="text-base font-bold text-amber-900 mb-2">Why We Don&apos;t Show a Pass/Fail Score</h2>
            <p className="text-sm text-amber-800 leading-relaxed">
              We don&apos;t run your profile against a made-up list of per-university GPA, backlog, or IELTS
              cutoffs — those numbers change by course and intake, and aren&apos;t something we can verify
              centrally the way we verify real tuition fees on this site. Instead, here are real universities to
              explore for your target countries, honest guides for the specific things you told us about, and a
              direct path to a counsellor who checks current, exact requirements before you apply anywhere.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Explore Real Universities in Your Selected Countries</h2>
            <div className="flex flex-wrap gap-2">
              {selectedCountries.map(c => (
                <Link
                  key={c}
                  href={`/universities/country/${COUNTRY_SLUGS[c].hub}`}
                  className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-2 rounded-full hover:bg-brand-100 transition-colors"
                >
                  Study in {c} →
                </Link>
              ))}
            </div>
          </div>

          {selectedCountries.some(c => COUNTRY_SLUGS[c].cheapestHub) && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Real, Cheapest-Fee Options</h2>
              <div className="flex flex-wrap gap-2">
                {selectedCountries.filter(c => COUNTRY_SLUGS[c].cheapestHub).map(c => (
                  <Link
                    key={c}
                    href={`/cheapest-universities-${COUNTRY_SLUGS[c].cheapestHub}`}
                    className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-2 rounded-full hover:bg-brand-100 transition-colors"
                  >
                    Cheapest Universities in {c} →
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Guides Based on What You Told Us</h2>
            <div className="flex flex-wrap gap-2">
              {hasBacklogs && (
                <Link href="/universities-accepting-backlogs" className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-2 rounded-full hover:bg-brand-100 transition-colors">
                  🎓 Universities Accepting Backlogs →
                </Link>
              )}
              <Link href="/low-cgpa-universities-abroad" className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-2 rounded-full hover:bg-brand-100 transition-colors">
                📉 Low CGPA? Universities You Can Apply To →
              </Link>
              {hasGap && (
                <Link href="/study-gap-accepted-universities" className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-2 rounded-full hover:bg-brand-100 transition-colors">
                  📅 Study Abroad With a Study Gap →
                </Link>
              )}
              {lowOrNoIelts && (
                <Link href="/study-abroad-without-ielts" className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-2 rounded-full hover:bg-brand-100 transition-colors">
                  🗣️ Study Abroad Without IELTS →
                </Link>
              )}
            </div>
          </div>

          {/* Lead capture */}
          <div className="bg-brand-700 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-bold mb-1">Want a Counsellor to Review Your Profile?</h3>
            <p className="text-blue-200 text-sm mb-5">Our team reviews your profile honestly and checks current, exact requirements with real universities before you apply anywhere.</p>
            {submitted ? (
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-center">
                <p className="font-semibold text-green-300">✅ Received! We&apos;ll contact you within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input required type="text" placeholder="Your Name" value={name} onChange={e => setNameV(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300/60 text-sm focus:outline-none focus:border-gold-400" />
                  <input required type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300/60 text-sm focus:outline-none focus:border-gold-400" />
                  <input required type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300/60 text-sm focus:outline-none focus:border-gold-400" />
                </div>
                <button type="submit"
                  className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors">
                  Get My Free Profile Review →
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
}
