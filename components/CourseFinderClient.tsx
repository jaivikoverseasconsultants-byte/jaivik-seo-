'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Course, University } from '@/types';

interface Props {
  courses: Course[];
  universities: University[];
}

const BUDGET_TIERS = [
  { label: 'Under ₹20 Lakhs/yr', min: 0, max: 2_000_000 },
  { label: '₹20–40 Lakhs/yr', min: 2_000_000, max: 4_000_000 },
  { label: '₹40–60 Lakhs/yr', min: 4_000_000, max: 6_000_000 },
  { label: '₹60–80 Lakhs/yr', min: 6_000_000, max: 8_000_000 },
  { label: 'Above ₹80 Lakhs/yr', min: 8_000_000, max: 999_999_999 },
];

const COUNTRIES = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Ireland', 'Singapore', 'New Zealand', 'France', 'Netherlands'];

const IELTS_OPTIONS = [
  { label: 'Not given yet', value: 0 },
  { label: '5.5', value: 5.5 },
  { label: '6.0', value: 6.0 },
  { label: '6.5', value: 6.5 },
  { label: '7.0', value: 7.0 },
  { label: '7.5', value: 7.5 },
  { label: '8.0+', value: 8.0 },
];

const CGPA_OPTIONS = [
  { label: 'Less than 6.0', value: 5.5 },
  { label: '6.0–6.5', value: 6.25 },
  { label: '6.5–7.0', value: 6.75 },
  { label: '7.0–7.5', value: 7.25 },
  { label: '7.5–8.0', value: 7.75 },
  { label: '8.0–8.5', value: 8.25 },
  { label: '8.5–9.0', value: 8.75 },
  { label: '9.0+', value: 9.5 },
];

const FORMSPREE_URL = 'https://formspree.io/f/xgoqzezk';

type Step = 'profile' | 'results' | 'unlocked';

interface Profile {
  country: string;
  course: string;
  budget: string;
  cgpa: string;
  ielts: string;
}

function matchUniversities(universities: University[], profile: Profile): University[] {
  const cgpaVal = CGPA_OPTIONS.find(o => o.label === profile.cgpa)?.value ?? 0;
  const ieltsVal = IELTS_OPTIONS.find(o => o.label === profile.ielts)?.value ?? 0;
  const budgetTier = BUDGET_TIERS.find(b => b.label === profile.budget);
  const courseLower = profile.course.toLowerCase();
  const courseKeywords = courseLower.split(' ').filter(w => w.length > 2);

  function passes(u: University, strict: boolean): boolean {
    if (profile.country && u.country !== profile.country) return false;

    if (budgetTier) {
      const yearlyINR = u.annualTuitionINR + u.livingCostINR;
      const slack = strict ? 1.0 : 1.3;
      if (yearlyINR > budgetTier.max * slack) return false;
      if (yearlyINR < budgetTier.min * (strict ? 1.0 : 0.7)) return false;
    }

    if (cgpaVal > 0) {
      const tolerance = strict ? 0.3 : 1.5;
      if (u.requirements.gpaMin > cgpaVal + tolerance) return false;
    }

    if (ieltsVal > 0) {
      const tolerance = strict ? 0.3 : 1.0;
      if (u.requirements.ieltsMin > ieltsVal + tolerance) return false;
    }

    if (profile.course && strict) {
      const hasMatch = u.popularCourses.some(pc => {
        const pcLower = pc.toLowerCase();
        return courseKeywords.some(kw => pcLower.includes(kw));
      });
      if (!hasMatch) return false;
    }

    return true;
  }

  let matched = universities.filter(u => passes(u, true));
  if (matched.length < 5) matched = universities.filter(u => passes(u, false));
  if (matched.length < 3) matched = universities.filter(u => profile.country ? u.country === profile.country : true);

  matched.sort((a, b) => {
    let sA = 0, sB = 0;
    if (cgpaVal > 0 && cgpaVal >= a.requirements.gpaMin) sA += 2;
    if (ieltsVal > 0 && ieltsVal >= a.requirements.ieltsMin) sA += 2;
    if (a.popularAmongIndians) sA += 1;
    if (cgpaVal > 0 && cgpaVal >= b.requirements.gpaMin) sB += 2;
    if (ieltsVal > 0 && ieltsVal >= b.requirements.ieltsMin) sB += 2;
    if (b.popularAmongIndians) sB += 1;
    return sB - sA;
  });

  return matched;
}

function LockIcon() {
  return (
    <svg className="w-5 h-5 text-brand-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

export default function CourseFinderClient({ courses, universities }: Props) {
  const [step, setStep] = useState<Step>('profile');
  const [profile, setProfile] = useState<Profile>({ country: '', course: '', budget: '', cgpa: '', ielts: '' });
  const [matched, setMatched] = useState<University[]>([]);
  const [lead, setLead] = useState({ name: '', phone: '', email: '' });
  const [leadStatus, setLeadStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  function handleProfileChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleFind() {
    const results = matchUniversities(universities, profile);
    setMatched(results);
    setStep('results');
  }

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLeadStatus('submitting');
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `Course Finder Unlock – ${profile.course} in ${profile.country} | course-finder`,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          'Interested Course': profile.course,
          'Target Country': profile.country,
          'Budget': profile.budget,
          'CGPA': profile.cgpa,
          'IELTS Score': profile.ielts,
          'Universities Matched': matched.length,
          'Source Page': 'course-finder-unlock',
          'Submitted At': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setLeadStatus('success');
      setStep('unlocked');
    } catch {
      setLeadStatus('error');
    }
  }

  const profileSummary = [
    profile.country,
    profile.course,
    profile.budget,
    profile.cgpa && `${profile.cgpa} CGPA`,
    profile.ielts && profile.ielts !== 'Not given yet' ? `IELTS ${profile.ielts}` : null,
  ].filter(Boolean).join(' · ');

  const canFind = profile.country && profile.course && profile.budget && profile.cgpa;

  // ── STEP 1: Profile Form ──────────────────────────────────────────────────
  if (step === 'profile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-700 via-blue-900 to-brand-900">
        <div className="max-w-xl mx-auto px-4 py-14">
          <div className="text-center mb-10">
            <span className="inline-block bg-white/15 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
              🎓 Free University Matching Tool
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
              Find Your Perfect<br />University Abroad
            </h1>
            <p className="text-blue-200 text-sm">
              Answer 5 quick questions — we'll match you with universities that fit your profile.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl">
            <p className="font-bold text-gray-800 text-base mb-5">Tell us about yourself</p>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Target Country *</label>
                  <select name="country" value={profile.country} onChange={handleProfileChange} className="input-field">
                    <option value="">Select country</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Interested Course *</label>
                  <select name="course" value={profile.course} onChange={handleProfileChange} className="input-field">
                    <option value="">Select course</option>
                    {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Total Budget (per year, including living) *</label>
                <select name="budget" value={profile.budget} onChange={handleProfileChange} className="input-field">
                  <option value="">Select budget</option>
                  {BUDGET_TIERS.map(b => <option key={b.label} value={b.label}>{b.label}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Your CGPA *</label>
                  <select name="cgpa" value={profile.cgpa} onChange={handleProfileChange} className="input-field">
                    <option value="">Select CGPA</option>
                    {CGPA_OPTIONS.map(o => <option key={o.label} value={o.label}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">IELTS Score</label>
                  <select name="ielts" value={profile.ielts} onChange={handleProfileChange} className="input-field">
                    <option value="">Select score</option>
                    {IELTS_OPTIONS.map(o => <option key={o.label} value={o.label}>{o.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleFind}
              disabled={!canFind}
              className="btn-gold w-full mt-6 text-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Find My Universities →
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              Free service · 500+ students helped · Results in seconds
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-5 mt-8 text-white/60 text-xs">
            <span>✓ 500+ students placed</span>
            <span>✓ 30+ partner universities</span>
            <span>✓ Expert counsellors</span>
            <span>✓ 100% free</span>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 2 & 3: Results ───────────────────────────────────────────────────
  const topCard = matched[0];
  const lockedCards = matched.slice(1);
  const isUnlocked = step === 'unlocked';
  const count = matched.length;

  if (count === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-10 text-center max-w-md shadow-md">
          <p className="text-4xl mb-4">🔍</p>
          <h2 className="font-bold text-gray-800 text-lg mb-2">No exact matches found</h2>
          <p className="text-gray-500 text-sm mb-6">Try a different country or budget, or speak with our counsellor for personalised options.</p>
          <button onClick={() => setStep('profile')} className="btn-primary text-sm px-6 py-2.5">
            Edit My Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-brand-700 text-white px-4 py-7">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setStep('profile')}
            className="text-blue-300 hover:text-white text-xs flex items-center gap-1 mb-3 transition-colors"
          >
            ← Edit Profile
          </button>
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-3xl">🎓</span>
            <h1 className="text-xl sm:text-2xl font-bold">
              {count} {count === 1 ? 'university matches' : 'universities match'} your profile!
            </h1>
          </div>
          <p className="text-blue-200 text-xs leading-relaxed">{profileSummary}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        {/* ── First visible card ─────────────────────────────────────── */}
        {topCard && (
          <div className="bg-white rounded-2xl p-5 border border-brand-200 shadow-md">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-0.5 rounded-full mb-2 inline-block">
                  Best Match
                </span>
                <h2 className="text-base font-bold text-gray-900 leading-snug">{topCard.name}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{topCard.city}, {topCard.country}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-gray-400">QS Rank</p>
                <p className="text-2xl font-bold text-brand-700">#{topCard.qsRanking}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
              <div className="bg-blue-50 rounded-xl p-2.5">
                <p className="font-bold text-blue-700 text-sm">
                  ₹{Math.round((topCard.annualTuitionINR + topCard.livingCostINR) / 100_000)}L/yr
                </p>
                <p className="text-gray-400 mt-0.5">Annual Cost</p>
              </div>
              <div className="bg-green-50 rounded-xl p-2.5">
                <p className="font-bold text-green-700 text-sm">{topCard.requirements.ieltsMin}+</p>
                <p className="text-gray-400 mt-0.5">Min IELTS</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-2.5">
                <p className="font-bold text-purple-700 text-sm">{topCard.employmentRate}%</p>
                <p className="text-gray-400 mt-0.5">Employment</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {topCard.popularCourses.slice(0, 3).map(c => (
                <span key={c} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">{c}</span>
              ))}
            </div>

            <Link
              href={`/universities/${topCard.slug}`}
              className="block text-center text-sm bg-brand-700 hover:bg-brand-800 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors"
            >
              View Full Profile →
            </Link>
          </div>
        )}

        {/* ── Locked cards ───────────────────────────────────────────── */}
        {lockedCards.length > 0 && !isUnlocked && (
          <>
            {lockedCards.map((u, i) => (
              <div key={u.id} className="relative rounded-2xl overflow-hidden shadow-sm">
                {/* Blurred background card */}
                <div
                  className="bg-white border border-gray-200 px-5 py-4 select-none pointer-events-none"
                  style={{ filter: 'blur(3px)' }}
                  aria-hidden
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Match #{i + 2}</p>
                      <p className="font-bold text-gray-900 text-sm">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.city}, {u.country}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">QS Rank</p>
                      <p className="text-xl font-bold text-brand-700">#{u.qsRanking}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
                    <div className="bg-blue-50 rounded-lg p-2">
                      <p className="font-bold text-blue-700">₹{Math.round((u.annualTuitionINR + u.livingCostINR) / 100_000)}L/yr</p>
                      <p className="text-gray-400">Cost</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2">
                      <p className="font-bold text-green-700">{u.requirements.ieltsMin}+</p>
                      <p className="text-gray-400">IELTS</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2">
                      <p className="font-bold text-purple-700">{u.employmentRate}%</p>
                      <p className="text-gray-400">Jobs</p>
                    </div>
                  </div>
                </div>

                {/* Lock overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[1px]">
                  <div className="bg-white rounded-full p-2.5 shadow-md mb-1.5">
                    <LockIcon />
                  </div>
                  <p className="text-xs font-semibold text-gray-700">Unlock to view</p>
                </div>
              </div>
            ))}

            {/* ── Unlock form ─────────────────────────────────────────── */}
            <div className="bg-white rounded-3xl border-2 border-brand-200 shadow-xl overflow-hidden mt-6">
              <div className="bg-gradient-to-r from-brand-700 to-blue-800 text-white px-6 py-6 text-center">
                <p className="text-3xl mb-2">🔓</p>
                <h2 className="text-xl font-bold mb-1">Unlock All {count} Results</h2>
                <p className="text-blue-200 text-sm">
                  Get Free Counselling — our expert will contact you within 24 hours
                </p>
              </div>

              <form onSubmit={handleLeadSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name *</label>
                    <input
                      required type="text" placeholder="Your full name"
                      value={lead.name}
                      onChange={e => setLead(p => ({ ...p, name: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone Number *</label>
                    <input
                      required type="tel" placeholder="+91 98765 43210"
                      value={lead.phone}
                      onChange={e => setLead(p => ({ ...p, phone: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address *</label>
                  <input
                    required type="email" placeholder="you@email.com"
                    value={lead.email}
                    onChange={e => setLead(p => ({ ...p, email: e.target.value }))}
                    className="input-field"
                  />
                </div>

                <button
                  type="submit"
                  disabled={leadStatus === 'submitting'}
                  className="btn-gold w-full text-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {leadStatus === 'submitting'
                    ? 'Sending...'
                    : `Unlock All ${count} Universities →`}
                </button>

                {leadStatus === 'error' && (
                  <p className="text-red-500 text-xs text-center">
                    Something went wrong. WhatsApp us at +91-9876543210.
                  </p>
                )}

                <p className="text-xs text-gray-400 text-center">
                  Your data is safe. We never share your information.
                </p>
              </form>
            </div>
          </>
        )}

        {/* ── Unlocked: show remaining cards ─────────────────────────── */}
        {isUnlocked && (
          <>
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
              <p className="text-green-800 font-semibold text-sm">
                ✓ All {count} results unlocked! Our counsellor will call you within 24 hours.
              </p>
              <p className="text-green-600 text-xs mt-0.5">
                WhatsApp +91-9876543210 for immediate help.
              </p>
            </div>

            {lockedCards.map((u, i) => (
              <div key={u.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2.5 py-0.5 rounded-full mb-2 inline-block">
                      Match #{i + 2}
                    </span>
                    <h2 className="text-base font-bold text-gray-900 leading-snug">{u.name}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{u.city}, {u.country}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-400">QS Rank</p>
                    <p className="text-2xl font-bold text-brand-700">#{u.qsRanking}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                  <div className="bg-blue-50 rounded-xl p-2.5">
                    <p className="font-bold text-blue-700 text-sm">
                      ₹{Math.round((u.annualTuitionINR + u.livingCostINR) / 100_000)}L/yr
                    </p>
                    <p className="text-gray-400 mt-0.5">Annual Cost</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-2.5">
                    <p className="font-bold text-green-700 text-sm">{u.requirements.ieltsMin}+</p>
                    <p className="text-gray-400 mt-0.5">Min IELTS</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-2.5">
                    <p className="font-bold text-purple-700 text-sm">{u.employmentRate}%</p>
                    <p className="text-gray-400 mt-0.5">Employment</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {u.popularCourses.slice(0, 3).map(c => (
                    <span key={c} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">{c}</span>
                  ))}
                </div>

                <Link
                  href={`/universities/${u.slug}`}
                  className="block text-center text-sm bg-brand-700 hover:bg-brand-800 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors"
                >
                  View Full Profile →
                </Link>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
