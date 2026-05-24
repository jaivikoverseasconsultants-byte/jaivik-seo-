'use client';

import { useState } from 'react';
import {
  COUNTRIES, COMPARE_UNIVERSITIES, COMPARE_COURSES,
  calcCountryMatch,
  type CountryData, type CompareUniversity, type CompareCourse,
} from '@/data/compare';

// ── Types ─────────────────────────────────────────────────────────────────────

type Phase = 'profile' | 'countries' | 'universities' | 'courses' | 'report' | 'unlocked';

interface Profile {
  name: string;
  marks10: string;
  marks12: string;
  gradMarks: string;
  gapYears: number;
  ielts: string;
  pte: string;
  budgetINR: string;
  level: string;
  workExp: string;
  courseInterest: string;
}

const COURSE_OPTIONS = [
  'MS Computer Science', 'MS Data Science', 'MS Artificial Intelligence',
  'MS Electrical Engineering', 'MS Mechanical Engineering', 'MBA',
  'MS Finance', 'LLM', 'MS Public Health', 'Bachelor of Computer Science',
  'Other',
];

const LEVEL_OPTIONS = ['Undergraduate', 'Postgraduate', 'PhD'];

// ── Helpers ──────────────────────────────────────────────────────────────────

function usdToInr(usd: number) { return Math.round(usd * 84); }
function inrLabel(inr: number) {
  if (inr >= 10_000_000) return `₹${(inr / 10_000_000).toFixed(1)}Cr`;
  if (inr >= 100_000) return `₹${(inr / 100_000).toFixed(1)}L`;
  return `₹${inr.toLocaleString('en-IN')}`;
}
function usdLabel(usd: number) { return `$${usd.toLocaleString()}`; }

function matchColor(pct: number) {
  if (pct >= 85) return 'text-green-600 bg-green-50';
  if (pct >= 70) return 'text-blue-600 bg-blue-50';
  return 'text-amber-600 bg-amber-50';
}

function ScoreBadge({ score, max = 10 }: { score: number; max?: number }) {
  const pct = (score / max) * 100;
  const color = pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-blue-500' : 'bg-amber-500';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs font-bold ${color}`}>
      {score}/{max}
    </span>
  );
}

// ── Step 1: Profile ──────────────────────────────────────────────────────────

function ProfileStep({ onNext }: { onNext: (p: Profile) => void }) {
  const [form, setForm] = useState<Profile>({
    name: '', marks10: '', marks12: '', gradMarks: '',
    gapYears: 0, ielts: '', pte: '', budgetINR: '',
    level: 'Postgraduate', workExp: '0', courseInterest: 'MS Computer Science',
  });

  const set = (k: keyof Profile, v: string | number) =>
    setForm(f => ({ ...f, [k]: v }));

  const valid = form.name && form.marks10 && form.marks12 && form.budgetINR;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-brand-700 mb-1">Step 1 of 5 — Your Profile</h2>
      <p className="text-gray-500 text-sm mb-6">Fill in your details to get personalised country, university & course matches.</p>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="Your name" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">10th Marks (%) *</label>
            <input type="number" min={40} max={100} value={form.marks10} onChange={e => set('marks10', e.target.value)}
              placeholder="e.g. 85" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">12th Marks (%) *</label>
            <input type="number" min={40} max={100} value={form.marks12} onChange={e => set('marks12', e.target.value)}
              placeholder="e.g. 80" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Graduation % <span className="font-normal text-gray-400">(optional)</span></label>
            <input type="number" min={40} max={100} value={form.gradMarks} onChange={e => set('gradMarks', e.target.value)}
              placeholder="e.g. 75" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Gap Years</label>
            <select value={form.gapYears} onChange={e => set('gapYears', Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700">
              {[0, 1, 2, 3].map(n => <option key={n} value={n}>{n === 3 ? '3+' : n} {n === 0 ? '(None)' : n === 1 ? 'year' : 'years'}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">IELTS Score</label>
            <select value={form.ielts} onChange={e => set('ielts', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700">
              <option value="">Not given yet</option>
              {['5.0','5.5','6.0','6.5','7.0','7.5','8.0','8.5','9.0'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">PTE Score</label>
            <select value={form.pte} onChange={e => set('pte', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700">
              <option value="">Not given yet</option>
              {['42','50','58','65','72','79','86','90'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Total Budget (incl. living) *</label>
          <select value={form.budgetINR} onChange={e => set('budgetINR', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700">
            <option value="">Select budget range</option>
            <option value="1500000">Under ₹15 Lakhs/yr</option>
            <option value="2000000">₹15–20 Lakhs/yr</option>
            <option value="3000000">₹20–30 Lakhs/yr</option>
            <option value="4000000">₹30–40 Lakhs/yr</option>
            <option value="5000000">₹40–50 Lakhs/yr</option>
            <option value="7000000">₹50–70 Lakhs/yr</option>
            <option value="10000000">₹70 Lakhs+ /yr</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Study Level *</label>
            <select value={form.level} onChange={e => set('level', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700">
              {LEVEL_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Work Experience</label>
            <select value={form.workExp} onChange={e => set('workExp', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700">
              <option value="0">Fresher (0 yrs)</option>
              <option value="1">1 year</option>
              <option value="2">2 years</option>
              <option value="3">3 years</option>
              <option value="5">4–5 years</option>
              <option value="6">6+ years</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Course *</label>
          <select value={form.courseInterest} onChange={e => set('courseInterest', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700">
            {COURSE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button
          disabled={!valid}
          onClick={() => onNext(form)}
          className="w-full bg-brand-700 hover:bg-brand-800 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition-colors text-sm">
          Find Best Options →
        </button>
      </div>
    </div>
  );
}

// ── Step 2: Country Comparison ────────────────────────────────────────────────

function CountryStep({ profile, onNext }: { profile: Profile; onNext: (c: CountryData[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);

  const budgetUSD = Number(profile.budgetINR) / 84;
  const ielts = profile.ielts ? Number(profile.ielts) : null;
  const keyword = profile.courseInterest.toLowerCase();

  const ranked = [...COUNTRIES]
    .map(c => ({ ...c, match: calcCountryMatch(c, { ielts, budgetUSD, courseKeyword: keyword, level: profile.level, gapYears: profile.gapYears }) }))
    .sort((a, b) => b.match - a.match);

  const toggle = (name: string) => {
    setSelected(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : prev.length < 3 ? [...prev, name] : prev
    );
  };

  const selectedData = ranked.filter(c => selected.includes(c.name));

  const TABLE_ROWS: { label: string; render: (c: typeof ranked[0]) => React.ReactNode }[] = [
    { label: 'Visa Success Rate', render: c => <span className="font-semibold">{c.visaSuccessRate}%</span> },
    { label: 'Avg Tuition/yr', render: c => <>{usdLabel(c.avgTuitionUSD)}<br /><span className="text-xs text-gray-400">{inrLabel(usdToInr(c.avgTuitionUSD))}</span></> },
    { label: 'Avg Living Cost/yr', render: c => <>{usdLabel(c.avgLivingCostUSD)}<br /><span className="text-xs text-gray-400">{inrLabel(usdToInr(c.avgLivingCostUSD))}</span></> },
    { label: 'Post-Study Work', render: c => `${c.postStudyWorkYears} years` },
    { label: 'PR Pathway', render: c => c.prPathway ? <span className="text-green-600 font-semibold">✓ Yes<br /><span className="text-xs font-normal text-gray-500">{c.prTimeline}</span></span> : <span className="text-red-500">✗ No</span> },
    { label: 'Part-Time Hours/wk', render: c => `${c.partTimeHours} hrs` },
    { label: 'IELTS Required', render: c => `${c.ieltsRequirement}+` },
    { label: 'Intakes', render: c => c.intakeMonths.join(', ') },
    { label: 'Job Market', render: c => { const k = Object.entries(c.jobMarket).find(([key]) => keyword.includes(key)); return k ? <span className={k[1] === 'Excellent' ? 'text-green-600 font-semibold' : k[1] === 'Good' ? 'text-blue-600' : 'text-amber-600'}>{k[1]}</span> : '—'; } },
    { label: 'JOC Score', render: c => <ScoreBadge score={c.jocScore} /> },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-brand-700 mb-1">Step 2 of 5 — Country Comparison</h2>
      <p className="text-gray-500 text-sm mb-6">Select up to 3 countries to compare side-by-side.</p>

      {/* Country Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {ranked.map(c => {
          const isSelected = selected.includes(c.name);
          const disabled = !isSelected && selected.length >= 3;
          return (
            <button key={c.name} onClick={() => !disabled && toggle(c.name)}
              className={`relative p-4 rounded-xl border-2 text-left transition-all ${isSelected ? 'border-brand-700 bg-brand-50 shadow-md' : disabled ? 'border-gray-100 opacity-40 cursor-not-allowed' : 'border-gray-100 hover:border-brand-300 bg-white'}`}>
              {isSelected && <span className="absolute top-2 right-2 w-5 h-5 bg-brand-700 text-white rounded-full text-xs flex items-center justify-center">✓</span>}
              <div className="text-2xl mb-1">{c.flag}</div>
              <p className="font-bold text-sm text-gray-800">{c.name}</p>
              <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${matchColor(c.match)}`}>
                {c.match}% match
              </span>
            </button>
          );
        })}
      </div>

      {selected.length >= 2 && !comparing && (
        <button onClick={() => setComparing(true)}
          className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-3 rounded-xl transition-colors text-sm mb-6">
          Compare {selected.length} Countries →
        </button>
      )}

      {/* Comparison Table */}
      {comparing && selectedData.length >= 2 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-700 text-white">
                <th className="p-3 text-left font-semibold w-40">Feature</th>
                {selectedData.map(c => (
                  <th key={c.name} className="p-3 text-center font-semibold">
                    {c.flag} {c.name}<br />
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${matchColor(c.match)}`}>{c.match}% match</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-3 font-medium text-gray-600 text-xs">{row.label}</td>
                  {selectedData.map(c => (
                    <td key={c.name} className="p-3 text-center text-xs">{row.render(c)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex gap-3">
        {comparing && (
          <button onClick={() => { setComparing(false); setSelected([]); }}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            ← Reset
          </button>
        )}
        {selected.length >= 1 && (
          <button onClick={() => onNext(selectedData)}
            className="flex-1 bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 rounded-xl transition-colors text-sm">
            Compare Universities in {selected.join(' + ')} →
          </button>
        )}
      </div>
    </div>
  );
}

// ── Step 3: University Comparison ─────────────────────────────────────────────

function UniversityStep({ profile, countries, onNext }: { profile: Profile; countries: CountryData[]; onNext: (u: CompareUniversity[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);

  const countryNames = countries.map(c => c.name);
  const eligible = COMPARE_UNIVERSITIES.filter(u => countryNames.includes(u.country));

  const toggle = (name: string) =>
    setSelected(prev => prev.includes(name) ? prev.filter(n => n !== name) : prev.length < 3 ? [...prev, name] : prev);

  const selectedData = COMPARE_UNIVERSITIES.filter(u => selected.includes(u.name));

  const TABLE_ROWS: { label: string; render: (u: CompareUniversity) => React.ReactNode }[] = [
    { label: 'QS Ranking', render: u => `#${u.qsRanking}` },
    { label: 'Fees/yr', render: u => <>{usdLabel(u.feesPerYearUSD)}<br /><span className="text-xs text-gray-400">{inrLabel(usdToInr(u.feesPerYearUSD))}</span></> },
    { label: 'Scholarship', render: u => u.scholarship },
    { label: 'IELTS Min', render: u => `${u.ieltsMin}` },
    { label: 'Acceptance Rate', render: u => `${u.acceptanceRate}%` },
    { label: 'Intakes', render: u => u.intakeMonths.join(', ') },
    { label: 'Location', render: u => `${u.city}, ${u.country}` },
    { label: 'Campus Size', render: u => u.campusSize },
    { label: 'Notable Alumni', render: u => u.notableAlumni.slice(0, 2).join(', ') },
    { label: 'JOC Partner', render: u => u.jocPartner ? <span className="text-green-600 font-semibold">✓ Yes</span> : <span className="text-gray-400">No</span> },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-brand-700 mb-1">Step 3 of 5 — University Comparison</h2>
      <p className="text-gray-500 text-sm mb-6">Select up to 3 universities to compare.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {eligible.map(u => {
          const isSelected = selected.includes(u.name);
          const disabled = !isSelected && selected.length >= 3;
          return (
            <button key={u.name} onClick={() => !disabled && toggle(u.name)}
              className={`relative p-4 rounded-xl border-2 text-left transition-all ${isSelected ? 'border-brand-700 bg-brand-50 shadow-md' : disabled ? 'border-gray-100 opacity-40 cursor-not-allowed' : 'border-gray-100 hover:border-brand-300 bg-white'}`}>
              {isSelected && <span className="absolute top-2 right-2 w-5 h-5 bg-brand-700 text-white rounded-full text-xs flex items-center justify-center">✓</span>}
              <p className="font-bold text-sm text-gray-800 pr-6">{u.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{u.city}, {u.country}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-semibold">QS #{u.qsRanking}</span>
                {u.jocPartner && <span className="text-xs bg-gold-50 text-gold-700 px-2 py-0.5 rounded-full font-semibold">JOC Partner</span>}
              </div>
            </button>
          );
        })}
      </div>

      {selected.length >= 2 && !comparing && (
        <button onClick={() => setComparing(true)}
          className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-3 rounded-xl transition-colors text-sm mb-6">
          Compare {selected.length} Universities →
        </button>
      )}

      {comparing && selectedData.length >= 2 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-700 text-white">
                <th className="p-3 text-left font-semibold w-40">Feature</th>
                {selectedData.map(u => (
                  <th key={u.name} className="p-3 text-center font-semibold text-xs">
                    {u.name}<br /><span className="font-normal text-blue-200">{u.city}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-3 font-medium text-gray-600 text-xs">{row.label}</td>
                  {selectedData.map(u => (
                    <td key={u.name} className="p-3 text-center text-xs">{row.render(u)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex gap-3">
        {comparing && (
          <button onClick={() => { setComparing(false); setSelected([]); }}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            ← Reset
          </button>
        )}
        {selected.length >= 1 && (
          <button onClick={() => onNext(selectedData)}
            className="flex-1 bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 rounded-xl transition-colors text-sm">
            Compare Courses →
          </button>
        )}
      </div>
    </div>
  );
}

// ── Step 4: Course Comparison ─────────────────────────────────────────────────

function CourseStep({ profile, onNext }: { profile: Profile; onNext: (c: CompareCourse[]) => void }) {
  const [selected, setSelected] = useState<string[]>([profile.courseInterest].filter(c => COMPARE_COURSES.find(x => x.name === c)));
  const [comparing, setComparing] = useState(false);

  const toggle = (name: string) =>
    setSelected(prev => prev.includes(name) ? prev.filter(n => n !== name) : prev.length < 3 ? [...prev, name] : prev);

  const selectedData = COMPARE_COURSES.filter(c => selected.includes(c.name));

  const TABLE_ROWS: { label: string; render: (c: CompareCourse) => React.ReactNode }[] = [
    { label: 'Avg Fees', render: c => <>{usdLabel(c.avgFeesUSD)}<br /><span className="text-xs text-gray-400">{inrLabel(usdToInr(c.avgFeesUSD))}</span></> },
    { label: 'Duration', render: c => `${c.durationYears} ${c.durationYears === 1 ? 'year' : 'years'}` },
    { label: 'Job Growth', render: c => <span className={c.jobGrowthPct >= 25 ? 'text-green-600 font-bold' : 'text-gray-700'}>{c.jobGrowthPct}%</span> },
    { label: 'Avg Salary After', render: c => <>{usdLabel(c.avgSalaryAfterUSD)}/yr<br /><span className="text-xs text-gray-400">{inrLabel(usdToInr(c.avgSalaryAfterUSD))}</span></> },
    { label: 'Top Companies', render: c => c.topCompanies.slice(0, 3).join(', ') },
    { label: 'PR Eligible', render: c => c.prEligible ? <span className="text-green-600 font-semibold">✓ Yes</span> : <span className="text-red-500">✗ No</span> },
    { label: 'IELTS Min', render: c => `${c.ieltsMin}` },
    { label: 'ROI Score', render: c => <ScoreBadge score={c.roiScore} /> },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-brand-700 mb-1">Step 4 of 5 — Course Comparison</h2>
      <p className="text-gray-500 text-sm mb-6">Select up to 3 courses to compare.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {COMPARE_COURSES.map(c => {
          const isSelected = selected.includes(c.name);
          const disabled = !isSelected && selected.length >= 3;
          return (
            <button key={c.name} onClick={() => !disabled && toggle(c.name)}
              className={`relative p-3 rounded-xl border-2 text-left transition-all ${isSelected ? 'border-brand-700 bg-brand-50 shadow-md' : disabled ? 'border-gray-100 opacity-40 cursor-not-allowed' : 'border-gray-100 hover:border-brand-300 bg-white'}`}>
              {isSelected && <span className="absolute top-2 right-2 w-4 h-4 bg-brand-700 text-white rounded-full text-xs flex items-center justify-center">✓</span>}
              <p className="font-semibold text-xs text-gray-800 pr-5">{c.name}</p>
              <p className="text-xs text-gray-400 mt-1">{c.level}</p>
              <ScoreBadge score={c.roiScore} />
            </button>
          );
        })}
      </div>

      {selected.length >= 2 && !comparing && (
        <button onClick={() => setComparing(true)}
          className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-3 rounded-xl transition-colors text-sm mb-6">
          Compare {selected.length} Courses →
        </button>
      )}

      {comparing && selectedData.length >= 2 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-700 text-white">
                <th className="p-3 text-left font-semibold w-36">Feature</th>
                {selectedData.map(c => (
                  <th key={c.name} className="p-3 text-center font-semibold text-xs">{c.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-3 font-medium text-gray-600 text-xs">{row.label}</td>
                  {selectedData.map(c => (
                    <td key={c.name} className="p-3 text-center text-xs">{row.render(c)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex gap-3">
        {comparing && (
          <button onClick={() => { setComparing(false); setSelected([]); }}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            ← Reset
          </button>
        )}
        {selected.length >= 1 && (
          <button onClick={() => onNext(selectedData)}
            className="flex-1 bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 rounded-xl transition-colors text-sm">
            See My Final Report →
          </button>
        )}
      </div>
    </div>
  );
}

// ── Step 5: Final Report ──────────────────────────────────────────────────────

function ReportStep({
  profile, countries, universities, courses, phase, setPhase,
}: {
  profile: Profile;
  countries: CountryData[];
  universities: CompareUniversity[];
  courses: CompareCourse[];
  phase: Phase;
  setPhase: (p: Phase) => void;
}) {
  const [unlockForm, setUnlockForm] = useState({ name: profile.name, whatsapp: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const bestCountry = countries[0];
  const bestUni = universities[0];
  const bestCourse = courses[0];

  const reasoning = [
    bestCountry && `${bestCountry.name} offers ${bestCountry.postStudyWorkYears}-year post-study work rights and a clear PR pathway via ${bestCountry.prTimeline}.`,
    bestUni && `${bestUni.name} (QS #${bestUni.qsRanking}) has a ${bestUni.acceptanceRate}% acceptance rate and offers scholarships up to ${bestUni.scholarship}.`,
    bestCourse && `${bestCourse.name} has ${bestCourse.jobGrowthPct}% job growth and an average starting salary of ${usdLabel(bestCourse.avgSalaryAfterUSD)}/yr.`,
  ].filter(Boolean) as string[];

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('https://formspree.io/f/xgoqzezk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: unlockForm.name,
          whatsapp: unlockForm.whatsapp,
          email: unlockForm.email,
          form_type: 'compare_report_unlock',
          profile_course: profile.courseInterest,
          profile_budget: profile.budgetINR,
          profile_ielts: profile.ielts || 'Not given',
          top_country: bestCountry?.name,
          top_university: bestUni?.name,
          top_course: bestCourse?.name,
        }),
      });
      if (res.ok) { setSubmitted(true); setPhase('unlocked'); }
      else setError('Something went wrong. Please try again.');
    } catch { setError('Network error. Please try again.'); }
  };

  const isUnlocked = phase === 'unlocked';

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-brand-700 mb-1">Step 5 of 5 — Your Personalised Report</h2>
      <p className="text-gray-500 text-sm mb-6">Based on your profile, here are our top recommendations.</p>

      {/* Best Match Banner */}
      <div className="bg-gradient-to-r from-brand-700 to-brand-800 text-white rounded-2xl p-6 mb-6 shadow-lg">
        <p className="text-blue-200 text-xs font-semibold uppercase tracking-wide mb-2">JOC Best Match for {profile.name}</p>
        <p className="text-2xl font-bold mb-1">
          {bestCountry?.flag} {bestCountry?.name}
          {bestUni && <> + {bestUni.name}</>}
          {bestCourse && <> + {bestCourse.name}</>}
        </p>
        <div className="mt-4 space-y-1.5">
          {reasoning.map((r, i) => (
            <p key={i} className="text-sm text-blue-100 flex gap-2"><span className="text-gold-400 mt-0.5">✦</span>{r}</p>
          ))}
        </div>
      </div>

      {/* Blurred Report */}
      <div className="relative mb-6">
        <div className={`space-y-4 ${!isUnlocked ? 'blur-sm select-none pointer-events-none' : ''}`}>
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Best Country', value: `${bestCountry?.flag} ${bestCountry?.name}`, sub: `${bestCountry?.match}% match` },
              { label: 'Best University', value: bestUni?.name ?? '—', sub: `QS #${bestUni?.qsRanking}` },
              { label: 'Best Course', value: bestCourse?.name ?? '—', sub: `ROI ${bestCourse?.roiScore}/10` },
            ].map(card => (
              <div key={card.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">{card.label}</p>
                <p className="font-bold text-sm text-brand-700">{card.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{card.sub}</p>
              </div>
            ))}
          </div>

          {/* Detailed Sections */}
          {[
            { title: 'Country Analysis', items: countries.map(c => ({ k: c.name + ' ' + c.flag, v: `${c.match}% match • PR via ${c.prTimeline} • ${c.postStudyWorkYears}yr work visa` })) },
            { title: 'University Analysis', items: universities.map(u => ({ k: u.name, v: `QS #${u.qsRanking} • ${usdLabel(u.feesPerYearUSD)}/yr • ${u.acceptanceRate}% acceptance` })) },
            { title: 'Course Analysis', items: courses.map(c => ({ k: c.name, v: `${c.jobGrowthPct}% growth • ${usdLabel(c.avgSalaryAfterUSD)}/yr avg salary • ROI ${c.roiScore}/10` })) },
          ].map(section => (
            <div key={section.title} className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-sm text-brand-700 mb-3">{section.title}</h3>
              <div className="space-y-2">
                {section.items.map(item => (
                  <div key={item.k} className="flex justify-between items-start gap-4 py-1.5 border-b border-gray-50 last:border-0">
                    <p className="font-semibold text-xs text-gray-700">{item.k}</p>
                    <p className="text-xs text-gray-500 text-right">{item.v}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* JOC Recommendation */}
          <div className="bg-gold-50 border border-gold-200 rounded-xl p-5">
            <h3 className="font-bold text-sm text-gold-700 mb-2">JOC Expert Recommendation</h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              Based on your budget of {inrLabel(Number(profile.budgetINR))}/yr, {profile.ielts ? `IELTS ${profile.ielts}` : 'no IELTS yet'}, and interest in {profile.courseInterest},
              our counsellors recommend {bestCountry?.name} as your primary destination.
              {bestCountry && ` With a ${bestCountry.visaSuccessRate}% visa success rate and ${bestCountry.postStudyWorkYears}-year PGWP, it offers the best ROI for Indian students in ${new Date().getFullYear()}.`}
            </p>
          </div>
        </div>

        {/* Lock Overlay */}
        {!isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 w-full max-w-md mx-4">
              <div className="text-center mb-5">
                <div className="w-12 h-12 bg-brand-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-brand-700">Unlock Full Report</h3>
                <p className="text-sm text-gray-500 mt-1">Get your complete comparison report with expert notes, scholarship alerts & next steps — free.</p>
              </div>
              {!submitted ? (
                <form onSubmit={handleUnlock} className="space-y-3">
                  <input required value={unlockForm.name} onChange={e => setUnlockForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Full Name" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700" />
                  <input required type="tel" value={unlockForm.whatsapp} onChange={e => setUnlockForm(f => ({ ...f, whatsapp: e.target.value }))}
                    placeholder="WhatsApp Number" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700" />
                  <input required type="email" value={unlockForm.email} onChange={e => setUnlockForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="Email Address" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700" />
                  {error && <p className="text-red-500 text-xs">{error}</p>}
                  <button type="submit" className="w-full bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 rounded-xl text-sm transition-colors">
                    Unlock My Free Report 🔓
                  </button>
                  <p className="text-center text-xs text-gray-400">No spam. Our counsellor will contact you within 2 hours.</p>
                </form>
              ) : (
                <p className="text-center text-green-600 font-semibold text-sm">✓ Report unlocked!</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CTA after unlock */}
      {isUnlocked && (
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="/book-counselling"
            className="flex-1 bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 rounded-xl text-sm text-center transition-colors">
            Book Free Counselling Session →
          </a>
          <a href="https://wa.me/919971226347" target="_blank" rel="noopener noreferrer"
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl text-sm text-center transition-colors">
            WhatsApp Us Now
          </a>
        </div>
      )}
    </div>
  );
}

// ── Progress Bar ──────────────────────────────────────────────────────────────

const STEPS: Phase[] = ['profile', 'countries', 'universities', 'courses', 'report'];
const STEP_LABELS = ['Profile', 'Countries', 'Universities', 'Courses', 'Report'];

function ProgressBar({ phase }: { phase: Phase }) {
  const idx = STEPS.indexOf(phase === 'unlocked' ? 'report' : phase);
  return (
    <div className="flex items-center gap-1 mb-8">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center flex-1">
          <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 transition-colors ${i <= idx ? 'bg-brand-700 text-white' : 'bg-gray-100 text-gray-400'}`}>
            {i < idx ? '✓' : i + 1}
          </div>
          <span className={`ml-1 text-xs hidden sm:block whitespace-nowrap ${i <= idx ? 'text-brand-700 font-semibold' : 'text-gray-400'}`}>{STEP_LABELS[i]}</span>
          {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 mx-2 ${i < idx ? 'bg-brand-700' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  );
}

// ── Root Component ────────────────────────────────────────────────────────────

export default function CompareClient() {
  const [phase, setPhase] = useState<Phase>('profile');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<CountryData[]>([]);
  const [selectedUniversities, setSelectedUniversities] = useState<CompareUniversity[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<CompareCourse[]>([]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-700 mb-2">Study Abroad Comparison Tool</h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Compare countries, universities & courses side-by-side. Get a personalised recommendation in 5 minutes — free.
          </p>
        </div>

        <ProgressBar phase={phase} />

        {phase === 'profile' && (
          <ProfileStep onNext={p => { setProfile(p); setPhase('countries'); }} />
        )}
        {phase === 'countries' && profile && (
          <CountryStep profile={profile} onNext={c => { setSelectedCountries(c); setPhase('universities'); }} />
        )}
        {phase === 'universities' && profile && (
          <UniversityStep profile={profile} countries={selectedCountries} onNext={u => { setSelectedUniversities(u); setPhase('courses'); }} />
        )}
        {phase === 'courses' && profile && (
          <CourseStep profile={profile} onNext={c => { setSelectedCourses(c); setPhase('report'); }} />
        )}
        {(phase === 'report' || phase === 'unlocked') && profile && (
          <ReportStep
            profile={profile}
            countries={selectedCountries}
            universities={selectedUniversities}
            courses={selectedCourses}
            phase={phase}
            setPhase={setPhase}
          />
        )}
      </div>
    </div>
  );
}
