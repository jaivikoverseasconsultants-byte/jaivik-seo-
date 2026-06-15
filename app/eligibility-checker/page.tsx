'use client';

import { useState } from 'react';
import Link from 'next/link';

interface UniReq {
  name: string;
  slug: string;
  country: string;
  flag: string;
  qsRank: number;
  ieltsMin: number;
  gpaMin: number;
  backlogs: number;
  gapAllowed: number;
  annualINRL: number; // in lakh
}

const UNI_REQS: UniReq[] = [
  { name: 'University of Manchester',     slug: 'university-of-manchester',         country: 'UK',        flag: '🇬🇧', qsRank: 34,  ieltsMin: 6.5, gpaMin: 6.5, backlogs: 2, gapAllowed: 2, annualINRL: 25 },
  { name: 'University of Edinburgh',      slug: 'university-of-edinburgh',          country: 'UK',        flag: '🇬🇧', qsRank: 27,  ieltsMin: 6.5, gpaMin: 7.0, backlogs: 1, gapAllowed: 2, annualINRL: 28 },
  { name: 'University of Warwick',        slug: 'university-of-warwick',            country: 'UK',        flag: '🇬🇧', qsRank: 69,  ieltsMin: 6.5, gpaMin: 7.0, backlogs: 1, gapAllowed: 2, annualINRL: 30 },
  { name: 'University of Sheffield',      slug: 'university-of-sheffield',          country: 'UK',        flag: '🇬🇧', qsRank: 113, ieltsMin: 6.0, gpaMin: 6.0, backlogs: 3, gapAllowed: 3, annualINRL: 22 },
  { name: 'University of Birmingham',     slug: 'university-of-birmingham',         country: 'UK',        flag: '🇬🇧', qsRank: 90,  ieltsMin: 6.5, gpaMin: 6.5, backlogs: 2, gapAllowed: 2, annualINRL: 24 },
  { name: 'University of Glasgow',        slug: 'university-of-glasgow',            country: 'UK',        flag: '🇬🇧', qsRank: 78,  ieltsMin: 6.5, gpaMin: 6.5, backlogs: 2, gapAllowed: 2, annualINRL: 22 },
  { name: 'University of Bath',           slug: 'university-of-bath',               country: 'UK',        flag: '🇬🇧', qsRank: 178, ieltsMin: 6.5, gpaMin: 7.0, backlogs: 1, gapAllowed: 1, annualINRL: 24 },
  { name: 'Northumbria University',       slug: 'northumbria-university',           country: 'UK',        flag: '🇬🇧', qsRank: 801, ieltsMin: 6.0, gpaMin: 5.5, backlogs: 5, gapAllowed: 5, annualINRL: 16 },
  { name: 'Coventry University',          slug: 'coventry-university',              country: 'UK',        flag: '🇬🇧', qsRank: 701, ieltsMin: 5.5, gpaMin: 5.0, backlogs: 8, gapAllowed: 5, annualINRL: 14 },
  { name: 'University of British Columbia', slug: 'university-of-british-columbia', country: 'Canada',    flag: '🇨🇦', qsRank: 38,  ieltsMin: 6.5, gpaMin: 7.5, backlogs: 0, gapAllowed: 1, annualINRL: 28 },
  { name: 'University of Toronto',        slug: 'university-of-toronto',            country: 'Canada',    flag: '🇨🇦', qsRank: 25,  ieltsMin: 7.0, gpaMin: 8.0, backlogs: 0, gapAllowed: 1, annualINRL: 32 },
  { name: 'McMaster University',          slug: 'mcmaster-university',              country: 'Canada',    flag: '🇨🇦', qsRank: 189, ieltsMin: 6.5, gpaMin: 7.0, backlogs: 2, gapAllowed: 2, annualINRL: 20 },
  { name: 'York University',              slug: 'york-university',                  country: 'Canada',    flag: '🇨🇦', qsRank: 461, ieltsMin: 6.5, gpaMin: 6.5, backlogs: 3, gapAllowed: 3, annualINRL: 17 },
  { name: 'Monash University',            slug: 'monash-university',                country: 'Australia', flag: '🇦🇺', qsRank: 37,  ieltsMin: 6.5, gpaMin: 7.0, backlogs: 2, gapAllowed: 2, annualINRL: 28 },
  { name: 'University of Queensland',     slug: 'university-of-queensland',         country: 'Australia', flag: '🇦🇺', qsRank: 40,  ieltsMin: 6.5, gpaMin: 7.0, backlogs: 2, gapAllowed: 2, annualINRL: 27 },
  { name: 'RMIT University',              slug: 'rmit-university',                  country: 'Australia', flag: '🇦🇺', qsRank: 140, ieltsMin: 6.5, gpaMin: 6.0, backlogs: 3, gapAllowed: 3, annualINRL: 22 },
  { name: 'La Trobe University',          slug: 'la-trobe-university',              country: 'Australia', flag: '🇦🇺', qsRank: 351, ieltsMin: 6.0, gpaMin: 6.0, backlogs: 5, gapAllowed: 4, annualINRL: 19 },
  { name: 'TU Munich',                    slug: 'technical-university-of-munich',   country: 'Germany',   flag: '🇩🇪', qsRank: 37,  ieltsMin: 7.0, gpaMin: 8.0, backlogs: 0, gapAllowed: 1, annualINRL: 1  },
  { name: 'RWTH Aachen University',       slug: 'rwth-aachen-university',           country: 'Germany',   flag: '🇩🇪', qsRank: 106, ieltsMin: 6.5, gpaMin: 7.5, backlogs: 1, gapAllowed: 2, annualINRL: 1  },
  { name: 'NUS Singapore',               slug: 'national-university-of-singapore', country: 'Singapore', flag: '🇸🇬', qsRank: 8,   ieltsMin: 7.0, gpaMin: 8.5, backlogs: 0, gapAllowed: 0, annualINRL: 35 },
];

const COUNTRIES = ['UK', 'Canada', 'Australia', 'Germany', 'Ireland', 'Singapore', 'New Zealand', 'USA', 'Netherlands', 'France'];
const BUDGETS = ['Under ₹15L/yr', '₹15–25L/yr', '₹25–35L/yr', '₹35L+/yr'];

function getBudgetMax(b: string): number {
  if (b === 'Under ₹15L/yr') return 15;
  if (b === '₹15–25L/yr') return 25;
  if (b === '₹25–35L/yr') return 35;
  return 999;
}
function getBudgetMin(b: string): number {
  if (b === 'Under ₹15L/yr') return 0;
  if (b === '₹15–25L/yr') return 15;
  if (b === '₹25–35L/yr') return 25;
  return 35;
}

function percentToGPA(pct: number): number {
  if (pct >= 85) return 8.5;
  if (pct >= 75) return 7.5;
  if (pct >= 65) return 6.5;
  if (pct >= 55) return 5.5;
  return 4.5;
}

function scoreMatch(u: UniReq, ielts: number, gpa: number, backlogs: number, gap: number, countries: string[], budgetMax: number, budgetMin: number) {
  if (countries.length > 0 && !countries.includes(u.country)) return null;
  if (u.annualINRL < budgetMin || u.annualINRL > budgetMax) return null;

  const ieltsGap = ielts - u.ieltsMin;
  const gpaGap = gpa - u.gpaMin;
  const backlogOk = backlogs <= u.backlogs;
  const gapOk = gap <= u.gapAllowed;

  if (!backlogOk && backlogs > u.backlogs + 3) return null;
  if (!gapOk && gap > u.gapAllowed + 2) return null;

  if (ieltsGap >= 0.5 && gpaGap >= 0.5 && backlogOk && gapOk) return 'strong';
  if (ieltsGap >= -0.5 && gpaGap >= -0.5 && (backlogOk || backlogs <= u.backlogs + 1)) return 'possible';
  if (ieltsGap >= -1 && gpaGap >= -1) return 'stretch';
  return null;
}

export default function EligibilityCheckerPage() {
  const [step, setStep] = useState(1);
  const [qual, setQual] = useState('');
  const [pct, setPct] = useState('');
  const [backlogs, setBacklogs] = useState('0');
  const [gap, setGap] = useState('None');
  const [ielts, setIelts] = useState('');
  const [budget, setBudget] = useState('');
  const [countries, setCountries] = useState<string[]>([]);
  const [name, setNameV] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const backlogNum = backlogs === '5+' ? 6 : parseInt(backlogs) || 0;
  const gapNum = gap === 'None' ? 0 : parseInt(gap) || 0;
  const ieltsNum = parseFloat(ielts) || 0;
  const pctNum = parseFloat(pct) || 0;
  const gpaNum = percentToGPA(pctNum);
  const budgetMaxN = budget ? getBudgetMax(budget) : 999;
  const budgetMinN = budget ? getBudgetMin(budget) : 0;

  const matches = UNI_REQS.map(u => ({
    ...u,
    tier: scoreMatch(u, ieltsNum, gpaNum, backlogNum, gapNum, countries, budgetMaxN, budgetMinN),
  })).filter(u => u.tier !== null) as (UniReq & { tier: 'strong' | 'possible' | 'stretch' })[];

  const strong = matches.filter(m => m.tier === 'strong').sort((a, b) => a.qsRank - b.qsRank);
  const possible = matches.filter(m => m.tier === 'possible').sort((a, b) => a.qsRank - b.qsRank);
  const stretch = matches.filter(m => m.tier === 'stretch').sort((a, b) => a.qsRank - b.qsRank);

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
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
          ✅ Free · Instant Results · No Sign-up
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Check Your Study Abroad Eligibility</h1>
        <p className="text-gray-500">Answer 6 questions — get your personalised university shortlist in seconds</p>
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
            Check My Eligibility →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep(1)} className="text-sm text-brand-700 hover:underline">← Edit Profile</button>
            <p className="text-sm text-gray-500">Results for: {qual}, {pct}%, IELTS {ielts || 'not given'}</p>
          </div>

          {strong.length === 0 && possible.length === 0 && stretch.length === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
              <p className="text-amber-800 font-semibold mb-2">No automatic matches found</p>
              <p className="text-sm text-amber-700">Your profile may need adjustment or our counsellors can find manual options. Book a free session.</p>
              <Link href="/book-counselling" className="inline-block mt-3 btn-primary text-sm">Book Free Counselling →</Link>
            </div>
          )}

          {strong.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <h2 className="font-bold text-gray-900">Tier 1 — Strong Match</h2>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{strong.length} universities</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">Your profile clearly meets entry requirements for these universities.</p>
              <div className="space-y-2">
                {strong.slice(0, 5).map(u => (
                  <Link key={u.slug} href={`/universities/${u.slug}`}
                    className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{u.flag}</span>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-500">QS #{u.qsRank} · {u.country} · IELTS {u.ieltsMin}+ · ₹{u.annualINRL}L/yr</p>
                      </div>
                    </div>
                    <span className="text-green-700 text-sm font-bold">→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {possible.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                <h2 className="font-bold text-gray-900">Tier 2 — Possible Match</h2>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">{possible.length} universities</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">You may qualify with a conditional offer or by improving IELTS slightly.</p>
              <div className="space-y-2">
                {possible.slice(0, 5).map(u => (
                  <Link key={u.slug} href={`/universities/${u.slug}`}
                    className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-xl hover:bg-yellow-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{u.flag}</span>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-500">QS #{u.qsRank} · {u.country} · IELTS {u.ieltsMin}+ · ₹{u.annualINRL}L/yr</p>
                      </div>
                    </div>
                    <span className="text-yellow-700 text-sm font-bold">→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {stretch.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-orange-400 rounded-full" />
                <h2 className="font-bold text-gray-900">Tier 3 — Stretch Goals</h2>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{stretch.length} universities</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">Slightly above your current profile — achievable with a strong SOP and counsellor support.</p>
              <div className="space-y-2">
                {stretch.slice(0, 5).map(u => (
                  <Link key={u.slug} href={`/universities/${u.slug}`}
                    className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{u.flag}</span>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-500">QS #{u.qsRank} · {u.country} · IELTS {u.ieltsMin}+ · ₹{u.annualINRL}L/yr</p>
                      </div>
                    </div>
                    <span className="text-orange-700 text-sm font-bold">→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Lead capture */}
          <div className="bg-brand-700 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-bold mb-1">Want Gaurav Katyal to personally verify your eligibility?</h3>
            <p className="text-blue-200 text-sm mb-5">Our director personally reviews shortlists for students who submit their details below.</p>
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
                  Get Personal Eligibility Verification →
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
