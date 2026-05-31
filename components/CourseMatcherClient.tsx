'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { universities } from '@/data/universities';

// ─── Step data ───────────────────────────────────────────────────────────────

const LEVELS = [
  { value: 'Undergraduate', label: '🎓 Undergraduate', desc: 'Bachelor\'s degree (3–4 years)', color: 'from-blue-50 to-sky-50 border-blue-200' },
  { value: 'Postgraduate', label: '🎓 Postgraduate', desc: 'Master\'s / PG Diploma (1–2 years)', color: 'from-purple-50 to-violet-50 border-purple-200' },
  { value: 'PhD', label: '🔬 PhD / Doctoral', desc: 'Research doctorate (3–5 years)', color: 'from-green-50 to-emerald-50 border-green-200' },
  { value: 'Diploma', label: '📋 Diploma / Certificate', desc: 'Short professional programs (1 year)', color: 'from-orange-50 to-amber-50 border-orange-200' },
];

const SUBJECTS = [
  { value: 'Computer Science', icon: '💻', keywords: ['Computer Science', 'CS', 'Software', 'Computing'] },
  { value: 'Data Science & AI', icon: '🤖', keywords: ['Data Science', 'AI', 'Machine Learning', 'Artificial Intelligence'] },
  { value: 'Business & MBA', icon: '💼', keywords: ['MBA', 'Business', 'Management', 'Marketing', 'Finance'] },
  { value: 'Engineering', icon: '⚙️', keywords: ['Engineering', 'Mechanical', 'Electrical', 'Civil', 'Chemical'] },
  { value: 'Information Technology', icon: '🖥️', keywords: ['Information Technology', 'IT', 'Cybersecurity', 'Networking'] },
  { value: 'Law & LLM', icon: '⚖️', keywords: ['Law', 'LLM', 'Legal'] },
  { value: 'Health & Medicine', icon: '🏥', keywords: ['Medicine', 'Nursing', 'Health', 'Public Health', 'Pharmacy'] },
  { value: 'Accounting & Finance', icon: '📊', keywords: ['Accounting', 'Finance', 'CPA', 'CFA', 'Economics'] },
  { value: 'Media & Communications', icon: '📡', keywords: ['Media', 'Communications', 'Journalism', 'PR', 'Marketing'] },
  { value: 'Architecture & Design', icon: '🏗️', keywords: ['Architecture', 'Design', 'Urban Planning', 'Interior Design'] },
  { value: 'Education', icon: '📚', keywords: ['Education', 'Teaching', 'MEd', 'Curriculum'] },
  { value: 'Social Sciences', icon: '🌍', keywords: ['Social', 'Psychology', 'Sociology', 'Political', 'International Relations'] },
];

const COUNTRIES = [
  { value: 'No Preference', flag: '🌍', color: 'bg-gray-50' },
  { value: 'Canada', flag: '🇨🇦', color: 'bg-red-50' },
  { value: 'UK', flag: '🇬🇧', color: 'bg-blue-50' },
  { value: 'Australia', flag: '🇦🇺', color: 'bg-yellow-50' },
  { value: 'USA', flag: '🇺🇸', color: 'bg-red-50' },
  { value: 'Germany', flag: '🇩🇪', color: 'bg-gray-50' },
  { value: 'Ireland', flag: '🇮🇪', color: 'bg-green-50' },
  { value: 'Singapore', flag: '🇸🇬', color: 'bg-red-50' },
  { value: 'New Zealand', flag: '🇳🇿', color: 'bg-sky-50' },
  { value: 'France', flag: '🇫🇷', color: 'bg-blue-50' },
  { value: 'Netherlands', flag: '🇳🇱', color: 'bg-orange-50' },
  { value: 'Sweden', flag: '🇸🇪', color: 'bg-yellow-50' },
  { value: 'UAE', flag: '🇦🇪', color: 'bg-green-50' },
];

const IELTS_OPTIONS = [
  { value: 5.0, label: '5.0', desc: 'Preparing for IELTS' },
  { value: 5.5, label: '5.5', desc: 'Modest user' },
  { value: 6.0, label: '6.0', desc: 'Competent user' },
  { value: 6.5, label: '6.5', desc: 'Good user' },
  { value: 7.0, label: '7.0', desc: 'Good user' },
  { value: 7.5, label: '7.5', desc: 'Very good user' },
  { value: 8.0, label: '8.0+', desc: 'Expert user' },
];

// ─── Matching logic ───────────────────────────────────────────────────────────

interface Preferences {
  level: string;
  subject: string;
  country: string;
  budgetMax: number;
  ielts: number;
}

function matchScore(u: (typeof universities)[0], prefs: Preferences): number {
  let score = 0;

  // Country match
  if (prefs.country !== 'No Preference') {
    if (u.country !== prefs.country) return 0; // hard filter
  }

  // Budget filter (hard)
  if (u.annualTuitionUSD > prefs.budgetMax) return 0;

  // IELTS filter (hard)
  if (u.requirements.ieltsMin > prefs.ielts + 0.5) return 0;

  // Subject match (soft)
  const subjectDef = SUBJECTS.find(s => s.value === prefs.subject);
  if (subjectDef) {
    const coursesStr = u.popularCourses.join(' ').toLowerCase();
    const matches = subjectDef.keywords.filter(k => coursesStr.includes(k.toLowerCase())).length;
    score += matches * 20;
  }

  // Level match (soft)
  const levelMap: Record<string, string[]> = {
    Undergraduate: ['Bachelor', 'BEng', 'BSc', 'BA'],
    Postgraduate: ['MS ', 'MA ', 'MSc', 'MBA', 'Master', 'PG', 'MEng', 'LLM', 'MPH'],
    PhD: ['PhD', 'Doctoral', 'Research'],
    Diploma: ['Diploma', 'Certificate', 'Graduate Certificate'],
  };
  const levelKeywords = levelMap[prefs.level] || [];
  const coursesStr2 = u.popularCourses.join(' ');
  if (levelKeywords.some(k => coursesStr2.includes(k))) score += 15;

  // Popularity + ranking bonus
  if (u.popularAmongIndians) score += 10;
  score += Math.max(0, 30 - (u.qsRanking ?? 999) / 30);

  // Acceptance rate (higher = more accessible)
  score += u.acceptanceRate / 5;

  return score;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CourseMatcherClient() {
  const [step, setStep] = useState(1);
  const [level, setLevel] = useState('');
  const [subject, setSubject] = useState('');
  const [country, setCountry] = useState('No Preference');
  const [budget, setBudget] = useState(50000);
  const [ielts, setIelts] = useState(6.5);

  const prefs: Preferences = { level, subject, country, budgetMax: budget, ielts };

  const results = useMemo(() => {
    if (step < 6) return [];
    return universities
      .map(u => ({ u, score: matchScore(u, prefs) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map(x => x.u);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const canProceed = () => {
    if (step === 1) return !!level;
    if (step === 2) return !!subject;
    if (step === 3) return !!country;
    if (step === 4) return true;
    if (step === 5) return true;
    return false;
  };

  const next = () => { if (canProceed()) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);
  const restart = () => { setStep(1); setLevel(''); setSubject(''); setCountry('No Preference'); setBudget(50000); setIelts(6.5); };

  const totalSteps = 5;
  const progressPercent = ((step - 1) / totalSteps) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {step <= totalSteps && (
        <>
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-brand-700">Step {step} of {totalSteps}</p>
              <p className="text-sm text-gray-500">{Math.round(progressPercent)}% complete</p>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-2 bg-gradient-to-r from-brand-600 to-gold-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {['Level', 'Subject', 'Country', 'Budget', 'IELTS'].map((label, i) => (
                <div key={label} className={`text-xs font-medium ${i + 1 <= step ? 'text-brand-700' : 'text-gray-300'}`}>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Step 1: Study Level ─────────────────────────────────────────────── */}
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">What level are you planning to study?</h2>
          <p className="text-gray-500 mb-6">This helps us show you the most relevant programs and universities.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {LEVELS.map(l => (
              <button
                key={l.value}
                onClick={() => setLevel(l.value)}
                className={`text-left p-5 rounded-2xl border-2 transition-all ${
                  level === l.value
                    ? 'border-brand-600 bg-brand-50 shadow-md'
                    : 'border-gray-100 bg-white hover:border-brand-200 hover:shadow-sm'
                }`}
              >
                <p className="font-bold text-gray-900 text-base">{l.label}</p>
                <p className="text-sm text-gray-500 mt-1">{l.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 2: Subject ─────────────────────────────────────────────────── */}
      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">What subject do you want to study?</h2>
          <p className="text-gray-500 mb-6">Choose the field that best matches your interests and career goals.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SUBJECTS.map(s => (
              <button
                key={s.value}
                onClick={() => setSubject(s.value)}
                className={`text-left p-4 rounded-2xl border-2 transition-all ${
                  subject === s.value
                    ? 'border-brand-600 bg-brand-50 shadow-md'
                    : 'border-gray-100 bg-white hover:border-brand-200 hover:shadow-sm'
                }`}
              >
                <span className="text-2xl">{s.icon}</span>
                <p className="font-semibold text-gray-800 text-xs mt-2">{s.value}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 3: Country ─────────────────────────────────────────────────── */}
      {step === 3 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Which country do you prefer?</h2>
          <p className="text-gray-500 mb-6">Select your preferred destination, or choose "No Preference" to see options from all countries.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {COUNTRIES.map(c => (
              <button
                key={c.value}
                onClick={() => setCountry(c.value)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                  country === c.value
                    ? 'border-brand-600 bg-brand-50 shadow-md'
                    : 'border-gray-100 bg-white hover:border-brand-200 hover:shadow-sm'
                }`}
              >
                <span className="text-3xl">{c.flag}</span>
                <p className="font-semibold text-gray-800 text-xs mt-2 text-center">{c.value}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 4: Budget ──────────────────────────────────────────────────── */}
      {step === 4 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">What is your annual tuition budget?</h2>
          <p className="text-gray-500 mb-6">Drag the slider to set your maximum annual tuition fee (USD). Note: Germany has free tuition!</p>

          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <div className="text-center mb-8">
              <p className="text-4xl font-bold text-brand-700">${budget.toLocaleString()}</p>
              <p className="text-gray-500 text-sm mt-1">per year (USD)</p>
              <p className="text-gray-400 text-xs mt-1">≈ ₹{(budget * 84 / 100000).toFixed(1)} lakh/year</p>
            </div>

            <input
              type="range"
              min={5000}
              max={80000}
              step={2500}
              value={budget}
              onChange={e => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-brand-700"
            />

            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>$5,000</span>
              <span>$20K</span>
              <span>$40K</span>
              <span>$60K</span>
              <span>$80,000</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-8">
              {[
                { label: 'Budget-friendly', range: '$5K–$20K', examples: 'Germany, East Europe', btn: 15000 },
                { label: 'Mid-range', range: '$20K–$40K', examples: 'Canada, Australia', btn: 35000 },
                { label: 'Premium', range: '$40K–$80K', examples: 'USA, UK, Singapore', btn: 65000 },
              ].map(preset => (
                <button
                  key={preset.label}
                  onClick={() => setBudget(preset.btn)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    budget === preset.btn ? 'border-brand-500 bg-brand-50' : 'border-gray-100 hover:border-brand-200'
                  }`}
                >
                  <p className="font-semibold text-xs text-gray-800">{preset.label}</p>
                  <p className="text-xs text-brand-600">{preset.range}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{preset.examples}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Step 5: IELTS ───────────────────────────────────────────────────── */}
      {step === 5 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">What is your IELTS score?</h2>
          <p className="text-gray-500 mb-6">This helps us match you with universities that accept your English proficiency level.</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {IELTS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setIelts(opt.value)}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${
                  ielts === opt.value
                    ? 'border-brand-600 bg-brand-50 shadow-md'
                    : 'border-gray-100 bg-white hover:border-brand-200'
                }`}
              >
                <p className={`text-2xl font-bold ${ielts === opt.value ? 'text-brand-700' : 'text-gray-700'}`}>{opt.label}</p>
                <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
              </button>
            ))}
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <p className="text-sm font-semibold text-blue-800 mb-1">💡 Don&apos;t have IELTS yet?</p>
            <p className="text-xs text-blue-600 mb-2">
              Select your target score. You can also try our free IELTS Mock Test to assess your current level.
            </p>
            <Link href="/mock-test" className="text-xs text-blue-700 font-semibold underline">
              Take Free IELTS Mock Test →
            </Link>
          </div>
        </div>
      )}

      {/* ── Results ─────────────────────────────────────────────────────────── */}
      {step === 6 && (
        <div>
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {results.length > 0 ? `${results.length} Universities Match Your Profile!` : 'No exact matches found'}
            </h2>
            {results.length > 0 ? (
              <p className="text-gray-500">
                Based on your preferences: <span className="font-medium text-gray-700">{level}</span> in{' '}
                <span className="font-medium text-gray-700">{subject}</span>,{' '}
                {country !== 'No Preference' && <><span className="font-medium text-gray-700">{country}</span>, </>}
                budget{' '}
                <span className="font-medium text-gray-700">${budget.toLocaleString()}/yr</span>, IELTS{' '}
                <span className="font-medium text-gray-700">{ielts}+</span>
              </p>
            ) : (
              <p className="text-gray-500">Try relaxing your budget or IELTS requirements to see more options.</p>
            )}
          </div>

          {results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {results.map(u => (
                <Link
                  key={u.id}
                  href={`/universities/${u.slug}`}
                  className="bg-white rounded-2xl border border-gray-100 hover:border-brand-300 hover:shadow-md transition-all p-4 flex gap-4 items-start group"
                >
                  <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center text-brand-700 font-bold text-sm shrink-0">
                    {u.shortName.slice(0, 3)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm group-hover:text-brand-700 truncate">{u.shortName}</p>
                    <p className="text-xs text-gray-500">{u.city}, {u.country}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-xs bg-gold-50 text-gold-700 px-2 py-0.5 rounded-full">#{u.qsRanking} QS</span>
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">${(u.annualTuitionUSD / 1000).toFixed(0)}K/yr</span>
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">IELTS {u.requirements.ieltsMin}+</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {u.popularCourses.slice(0, 2).map(c => (
                        <span key={c} className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full truncate max-w-32">{c}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="bg-gradient-to-br from-brand-700 to-brand-900 rounded-2xl p-6 text-white text-center">
            <p className="font-bold text-lg mb-2">Want personalised guidance?</p>
            <p className="text-blue-200 text-sm mb-4">
              Our counsellors will shortlist the best universities, help with SOP, and guide you through the entire visa process — for free.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/book-counselling" className="bg-gold-500 hover:bg-gold-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
                Book Free Counselling →
              </Link>
              <button onClick={restart} className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
                Start Over
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      {step <= totalSteps && (
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={back}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              step === 1 ? 'invisible' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            ← Back
          </button>
          <button
            onClick={step === totalSteps ? () => setStep(6) : next}
            disabled={!canProceed()}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              canProceed()
                ? 'bg-brand-700 hover:bg-brand-800 text-white shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {step === totalSteps ? '🔍 Find My Universities →' : 'Continue →'}
          </button>
        </div>
      )}
    </div>
  );
}
