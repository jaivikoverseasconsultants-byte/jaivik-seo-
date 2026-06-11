'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import type { University } from '@/types';

/* ─── Constants ─────────────────────────────────────────────────── */

const COUNTRIES = ['USA','UK','Canada','Australia','Germany','Ireland','Singapore','New Zealand','France','Netherlands','Sweden','UAE','Denmark','Italy','Spain'];

const RUSSELL_GROUP = new Set([
  'University of Birmingham','University of Bristol','University of Cambridge',
  'Cardiff University','Durham University','University of Edinburgh',
  'University of Exeter','University of Glasgow','Imperial College London',
  "King's College London",'University of Leeds','University of Liverpool',
  'London School of Economics and Political Science','University of Manchester',
  'Newcastle University','University of Nottingham','University of Oxford',
  'Queen Mary University of London',"Queen's University Belfast",
  'University of Sheffield','University of Southampton',
  'University College London','University of Warwick','University of York',
]);

const STUDY_AREAS: Record<string, string[]> = {
  'Computer Science & IT': ['Computer Science','Software Engineering','AI','Machine Learning','Data Science','Cybersecurity','Information Technology'],
  'Business & Management': ['MBA','Business','Management','Finance','Accounting','Marketing','Economics','Commerce'],
  'Engineering': ['Engineering','Mechanical','Civil','Electrical','Chemical','Aerospace','Robotics'],
  'Health Sciences': ['Medicine','Nursing','Public Health','Pharmacy','Biomedical','Healthcare'],
  'Law & Social Sciences': ['Law','LLM','LLB','Political Science','International Relations','Sociology'],
  'Sciences': ['Physics','Chemistry','Mathematics','Biology','Statistics','Environmental'],
  'Arts & Humanities': ['Arts','Humanities','History','Philosophy','Literature','Media','Communication'],
  'Architecture & Design': ['Architecture','Design','Urban Planning','Interior'],
  'Education': ['Education','Teaching','PGCE'],
};

const QUICK_CHIPS = [
  { key: 'fast_offer',   label: '⚡ Faster Offer TAT' },
  { key: 'scholarship',  label: '🎓 Scholarship Available' },
  { key: 'high_accept',  label: '✅ High Acceptance Rate' },
  { key: 'affordable',   label: '💸 Affordable' },
  { key: 'coop',         label: '🏢 Co-op & Internships' },
  { key: 'no_deposit',   label: '🚫 No Tuition Deposit' },
  { key: 'major_city',   label: '🌆 Major City' },
  { key: 'backlog',      label: '📋 Higher Backlog Acceptance' },
  { key: 'no_interview', label: '🗣 No Interview Required' },
  { key: 'mba',          label: '💼 MBA Programs' },
  { key: 'russell',      label: '🏛 Russell Group (UK)' },
  { key: 'moi',          label: '📄 MOI Acceptable' },
  { key: 'offer_48',     label: '⏱ 48hr Offer Letter' },
  { key: 'free_edu',     label: '🇩🇪 Free Education (Germany)' },
];

const PROGRAM_LEVELS = ['UG','PG','PhD','Diploma','Pathway','Online','Hybrid'];

const REQUIREMENT_FILTERS = [
  { key: 'ielts',   label: 'IELTS' },
  { key: 'pte',     label: 'PTE' },
  { key: 'toefl',   label: 'TOEFL' },
  { key: 'gre',     label: 'GRE' },
  { key: 'gmat',    label: 'GMAT' },
  { key: 'no_eng',  label: 'Without English Proficiency' },
  { key: 'no_gre',  label: 'Without GRE' },
];

const DURATIONS = ['Any Duration','1 year','1.5 years','2 years','3 years','4 years','4+ years'];
const INTAKES   = ['Any Intake','January','February','March','April','May','June','July','August','September','October','November','December'];
const INTAKE_YEARS = ['Any Year','2026','2027'];

const FEE_MIN = 5000;
const FEE_MAX = 80000;
const FORMSPREE = 'https://formspree.io/f/xgoqzezk';

/* ─── Helpers ────────────────────────────────────────────────────── */

function chipMatch(chip: string, u: University): boolean {
  switch (chip) {
    case 'fast_offer':   return u.acceptanceRate > 65 && ['Canada','Ireland','UK'].includes(u.country);
    case 'scholarship':  return u.scholarships.length > 0;
    case 'high_accept':  return u.acceptanceRate > 60;
    case 'affordable':   return u.annualTuitionUSD < 18000;
    case 'coop':         return u.country === 'Canada' || u.popularCourses.some(c => /co.?op|intern/i.test(c));
    case 'no_deposit':   return ['Ireland','Germany','France'].includes(u.country) || (u.country === 'UK' && u.acceptanceRate > 70);
    case 'major_city':   return u.campusType === 'Urban';
    case 'backlog':      return (u.requirements.backlogs ?? 0) >= 5;
    case 'no_interview': return u.acceptanceRate > 40;
    case 'mba':          return u.popularCourses.some(c => /mba|business|management/i.test(c));
    case 'russell':      return RUSSELL_GROUP.has(u.name);
    case 'moi':          return u.requirements.ieltsMin <= 6.0;
    case 'offer_48':     return u.acceptanceRate > 65 && ['Canada','Ireland'].includes(u.country);
    case 'free_edu':     return u.country === 'Germany' && u.annualTuitionUSD < 1500;
    default:             return false;
  }
}

function matchesStudyArea(u: University, area: string): boolean {
  if (!area) return true;
  const terms = STUDY_AREAS[area] ?? [];
  return u.popularCourses.some(c => terms.some(t => c.toLowerCase().includes(t.toLowerCase())));
}

function matchesRequirement(req: string, u: University): boolean {
  switch (req) {
    case 'ielts':   return true; // All have IELTS
    case 'pte':     return true;
    case 'toefl':   return u.requirements.toeflMin > 0;
    case 'gre':     return (u.requirements.greMin ?? 0) > 0;
    case 'gmat':    return (u.requirements.gmatMin ?? 0) > 0;
    case 'no_eng':  return u.requirements.ieltsMin <= 5.5;
    case 'no_gre':  return (u.requirements.greMin ?? 0) === 0;
    default:        return true;
  }
}

/* ─── Dual Range Slider ──────────────────────────────────────────── */
function FeeSlider({ min, max, onMin, onMax }: { min: number; max: number; onMin: (v:number)=>void; onMax: (v:number)=>void }) {
  const pct = (v: number) => ((v - FEE_MIN) / (FEE_MAX - FEE_MIN)) * 100;
  return (
    <div className="px-1 pt-3 pb-1">
      <div className="flex justify-between text-xs text-gray-600 mb-2 font-semibold">
        <span>${(min/1000).toFixed(0)}K/yr</span>
        <span>${(max/1000).toFixed(0)}K/yr</span>
      </div>
      <div className="relative h-6 flex items-center">
        {/* Track */}
        <div className="absolute w-full h-1.5 bg-gray-200 rounded-full">
          <div className="absolute h-full bg-brand-600 rounded-full"
            style={{ left: `${pct(min)}%`, width: `${pct(max) - pct(min)}%` }} />
        </div>
        {/* Min handle */}
        <input type="range" min={FEE_MIN} max={FEE_MAX} step={1000} value={min}
          onChange={e => onMin(Math.min(+e.target.value, max - 1000))}
          className="absolute w-full h-0 appearance-none pointer-events-none
            [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-brand-700 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer"
          style={{ zIndex: min > 70000 ? 5 : 3 }} />
        {/* Max handle */}
        <input type="range" min={FEE_MIN} max={FEE_MAX} step={1000} value={max}
          onChange={e => onMax(Math.max(+e.target.value, min + 1000))}
          className="absolute w-full h-0 appearance-none pointer-events-none
            [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-brand-700 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer"
          style={{ zIndex: 4 }} />
      </div>
      <div className="flex justify-between text-xs text-gray-600 mt-1">
        <span>$5K</span><span>$80K</span>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function AdvancedCourseFinderClient({ universities }: { universities: University[] }) {
  // Search
  const [search, setSearch] = useState('');
  // Quick chips (multi-select)
  const [activeChips, setActiveChips] = useState<Set<string>>(new Set());
  // Program levels (multi-select)
  const [levels, setLevels] = useState<Set<string>>(new Set());
  // Requirement filters (multi-select)
  const [reqs, setReqs] = useState<Set<string>>(new Set());
  // Dropdowns
  const [intake, setIntake]       = useState('Any Intake');
  const [year, setYear]           = useState('Any Year');
  const [country, setCountry]     = useState('');
  const [province, setProvince]   = useState('');
  const [studyArea, setStudyArea] = useState('');
  const [duration, setDuration]   = useState('Any Duration');
  // Fee range
  const [minFee, setMinFee] = useState(FEE_MIN);
  const [maxFee, setMaxFee] = useState(FEE_MAX);
  // UI
  const [showAll, setShowAll]           = useState(false);
  const [showFilters, setShowFilters]   = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [selectedUni, setSelectedUni]  = useState<University | null>(null);
  const [lead, setLead] = useState({ name: '', phone: '', email: '' });
  const [leadSt, setLeadSt] = useState<'idle'|'submitting'|'done'>('idle');
  const [sortBy, setSortBy] = useState<'match'|'fee_asc'|'fee_desc'|'rank'|'accept'>('match');

  // Provinces from selected country
  const provinces = useMemo(() => {
    if (!country) return [];
    const set = new Set(universities.filter(u => u.country === country).map(u => u.state).filter(Boolean));
    return Array.from(set).sort();
  }, [country, universities]);

  const toggleChip  = useCallback((k: string) => setActiveChips(s => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; }), []);
  const toggleLevel = useCallback((l: string) => setLevels(s => { const n = new Set(s); n.has(l) ? n.delete(l) : n.add(l); return n; }), []);
  const toggleReq   = useCallback((r: string) => setReqs(s => { const n = new Set(s); n.has(r) ? n.delete(r) : n.add(r); return n; }), []);

  const results = useMemo(() => {
    let list = universities.filter(u => {
      // Search
      if (search) {
        const q = search.toLowerCase();
        if (!u.name.toLowerCase().includes(q) && !u.popularCourses.some(c => c.toLowerCase().includes(q)) && !u.city.toLowerCase().includes(q)) return false;
      }
      // Country
      if (country && u.country !== country) return false;
      // Province
      if (province && u.state !== province) return false;
      // Study area
      if (studyArea && !matchesStudyArea(u, studyArea)) return false;
      // Fee range
      if (u.annualTuitionUSD < minFee || u.annualTuitionUSD > maxFee) return false;
      // Intake
      if (intake !== 'Any Intake' && !u.intakeMonths.includes(intake)) return false;
      // Quick chips
      for (const chip of Array.from(activeChips)) { if (!chipMatch(chip, u)) return false; }
      // Requirement filters (match ANY selected)
      if (reqs.size > 0 && !Array.from(reqs).some(r => matchesRequirement(r, u))) return false;
      return true;
    });

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'fee_asc')  return a.annualTuitionUSD - b.annualTuitionUSD;
      if (sortBy === 'fee_desc') return b.annualTuitionUSD - a.annualTuitionUSD;
      if (sortBy === 'rank')     return (a.qsRanking ?? 9999) - (b.qsRanking ?? 9999);
      if (sortBy === 'accept')   return b.acceptanceRate - a.acceptanceRate;
      // match: popular first then rank
      if (a.popularAmongIndians && !b.popularAmongIndians) return -1;
      if (!a.popularAmongIndians && b.popularAmongIndians) return 1;
      return (a.qsRanking ?? 9999) - (b.qsRanking ?? 9999);
    });
    return list;
  }, [universities, search, country, province, studyArea, minFee, maxFee, intake, activeChips, reqs, sortBy]);

  const displayed = showAll ? results : results.slice(0, 12);

  const hasFilters = search || country || province || studyArea || intake !== 'Any Intake' ||
    activeChips.size > 0 || reqs.size > 0 || levels.size > 0 || minFee !== FEE_MIN || maxFee !== FEE_MAX;

  function clearAll() {
    setSearch(''); setCountry(''); setProvince(''); setStudyArea('');
    setIntake('Any Intake'); setYear('Any Year'); setDuration('Any Duration');
    setMinFee(FEE_MIN); setMaxFee(FEE_MAX);
    setActiveChips(new Set()); setLevels(new Set()); setReqs(new Set());
    setShowAll(false);
  }

  async function submitLead(e: React.FormEvent) {
    e.preventDefault(); setLeadSt('submitting');
    try {
      await fetch(FORMSPREE, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Course Finder Enquiry – ${selectedUni?.name ?? 'General'} | ${lead.name}`,
          name: lead.name, phone: lead.phone, email: lead.email,
          'University': selectedUni?.name ?? 'General', 'Country': country || 'Any',
          'Study Area': studyArea || 'Any', 'Budget': `$${(minFee/1000).toFixed(0)}K–$${(maxFee/1000).toFixed(0)}K`,
          Source: 'advanced-course-finder',
          'Submitted At': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        }),
      });
    } catch { /* ignore */ }
    setLeadSt('done');
    setTimeout(() => { window.location.href = '/thank-you'; }, 800);
  }

  /* ── Sidebar Filter Panel ── */
  const FilterPanel = () => (
    <div className="space-y-5">
      {/* Sort */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">Sort By</label>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} className="input-field text-sm">
          <option value="match">Best Match</option>
          <option value="rank">QS Rank</option>
          <option value="fee_asc">Fee: Low → High</option>
          <option value="fee_desc">Fee: High → Low</option>
          <option value="accept">Acceptance Rate</option>
        </select>
      </div>

      {/* Country */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">🌍 Country</label>
        <select value={country} onChange={e => { setCountry(e.target.value); setProvince(''); }} className="input-field text-sm">
          <option value="">Any Country</option>
          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Province/State */}
      {provinces.length > 0 && (
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">🗺 Province / State</label>
          <select value={province} onChange={e => setProvince(e.target.value)} className="input-field text-sm">
            <option value="">Any {country === 'Canada' ? 'Province' : 'State'}</option>
            {provinces.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      )}

      {/* Study Area */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">🎓 Study Area</label>
        <select value={studyArea} onChange={e => setStudyArea(e.target.value)} className="input-field text-sm">
          <option value="">Any Study Area</option>
          {Object.keys(STUDY_AREAS).map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {/* Intake */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">📅 Intake</label>
        <div className="grid grid-cols-2 gap-2">
          <select value={intake} onChange={e => setIntake(e.target.value)} className="input-field text-sm">
            {INTAKES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          <select value={year} onChange={e => setYear(e.target.value)} className="input-field text-sm">
            {INTAKE_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">⏳ Duration</label>
        <select value={duration} onChange={e => setDuration(e.target.value)} className="input-field text-sm">
          {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Fee Range Slider */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">💰 Tuition Fee / Year</label>
        <FeeSlider min={minFee} max={maxFee} onMin={setMinFee} onMax={setMaxFee} />
      </div>

      {/* Program Levels */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-2">📚 Program Level</label>
        <div className="flex flex-wrap gap-1.5">
          {PROGRAM_LEVELS.map(l => (
            <button key={l} onClick={() => toggleLevel(l)}
              className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-all ${levels.has(l) ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-2">📋 Requirements</label>
        <div className="space-y-1.5">
          {REQUIREMENT_FILTERS.map(r => (
            <label key={r.key} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={reqs.has(r.key)} onChange={() => toggleReq(r.key)}
                className="w-4 h-4 rounded accent-brand-700 cursor-pointer" />
              <span className="text-xs text-gray-700">{r.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear */}
      {hasFilters && (
        <button onClick={clearAll} className="w-full text-xs text-red-600 border border-red-200 py-2 rounded-xl hover:bg-red-50 font-semibold">
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-700 to-blue-900 text-white px-4 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <span className="inline-block bg-white/15 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-3">
              🔍 Advanced University & Program Finder
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Find Your Perfect Program Abroad</h1>
            <p className="text-blue-200 text-sm max-w-lg mx-auto">
              {universities.length}+ universities · 15 countries · Filter by intake, fees, IELTS, and more
            </p>
          </div>

          {/* Search bar */}
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text" value={search} onChange={e => { setSearch(e.target.value); setShowAll(false); }}
              placeholder="Search program (e.g. Computer Science, MBA) or university name…"
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 shadow-lg"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-700 text-xl">
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick filter chips */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {QUICK_CHIPS.map(chip => (
              <button key={chip.key} onClick={() => toggleChip(chip.key)}
                className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border font-medium transition-all whitespace-nowrap ${
                  activeChips.has(chip.key)
                    ? 'bg-brand-700 text-white border-brand-700 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300 hover:text-brand-700'
                }`}>
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Filters</h2>
                {hasFilters && <button onClick={clearAll} className="text-xs text-brand-600 underline">Clear all</button>}
              </div>
              <FilterPanel />
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Mobile filter toggle + result count */}
            <div className="flex items-center justify-between mb-4 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <button onClick={() => setShowFilters(p => !p)}
                  className="lg:hidden flex items-center gap-2 text-sm font-semibold border border-gray-200 bg-white px-4 py-2 rounded-xl">
                  ⚙️ Filters {hasFilters ? `(${[country,province,studyArea,intake!=='Any Intake'?intake:''].filter(Boolean).length + activeChips.size + reqs.size})` : ''}
                </button>
                <p className="text-sm text-gray-700 font-semibold truncate">
                  {results.length === 0 ? 'No results' : `${results.length} ${results.length === 1 ? 'university' : 'universities'}`}
                  {hasFilters && results.length > 0 && <span className="text-gray-400 font-normal"> found</span>}
                </p>
              </div>
              <button onClick={() => { setSelectedUni(null); setShowLeadModal(true); }}
                className="flex-shrink-0 text-xs bg-gold-500 hover:bg-gold-600 text-white font-bold px-4 py-2 rounded-xl">
                🎯 Request Program Options
              </button>
            </div>

            {/* Mobile filter drawer */}
            {showFilters && (
              <div className="lg:hidden bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-5">
                <FilterPanel />
              </div>
            )}

            {/* Active chips display */}
            {activeChips.size > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.from(activeChips).map(k => {
                  const chip = QUICK_CHIPS.find(c => c.key === k);
                  return chip ? (
                    <span key={k} className="inline-flex items-center gap-1 text-xs bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full border border-brand-200">
                      {chip.label}
                      <button onClick={() => toggleChip(k)} className="ml-0.5 font-bold">×</button>
                    </span>
                  ) : null;
                })}
              </div>
            )}

            {results.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <p className="text-4xl mb-4">🔍</p>
                <h3 className="font-bold text-gray-800 text-lg mb-2">No universities match</h3>
                <p className="text-gray-500 text-sm mb-5">Try removing some filters or widening the fee range.</p>
                <button onClick={clearAll} className="btn-primary text-sm px-6 py-2.5">Reset Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {displayed.map(u => {
                    const badges: string[] = [];
                    if (chipMatch('offer_48', u)) badges.push('⏱ 48hr Offer');
                    if (chipMatch('scholarship', u)) badges.push('🎓 Scholarship');
                    if (chipMatch('russell', u)) badges.push('🏛 Russell Group');
                    if (chipMatch('free_edu', u)) badges.push('🆓 Free Tuition');
                    if (chipMatch('high_accept', u)) badges.push('✅ High Accept Rate');

                    return (
                      <div key={u.id} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all flex flex-col">
                        {/* Badges */}
                        {badges.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {badges.slice(0, 3).map(b => (
                              <span key={b} className="text-xs bg-gold-50 text-gold-700 border border-gold-200 px-1.5 py-0.5 rounded-full font-medium">{b}</span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex-1 min-w-0">
                            {u.popularAmongIndians && (
                              <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full mr-1">🔥 Popular</span>
                            )}
                            <Link href={`/universities/${u.slug}`} className="font-bold text-gray-900 hover:text-brand-700 text-sm block leading-snug mt-1">
                              {u.name}
                            </Link>
                            <p className="text-xs text-gray-500 mt-0.5">{u.city}, {u.country}{u.state ? ` · ${u.state}` : ''}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs text-gray-600">QS</p>
                            <p className="text-base font-bold text-brand-700">#{u.qsRanking ?? '—'}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                          <div className="bg-blue-50 rounded-lg p-2">
                            <p className="font-bold text-blue-700">${(u.annualTuitionUSD/1000).toFixed(0)}K</p>
                            <p className="text-gray-600 mt-0.5">Tuition/yr</p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-2">
                            <p className="font-bold text-green-700">{u.requirements.ieltsMin}+</p>
                            <p className="text-gray-600 mt-0.5">IELTS</p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-2">
                            <p className="font-bold text-purple-700">{u.acceptanceRate}%</p>
                            <p className="text-gray-600 mt-0.5">Accept</p>
                          </div>
                        </div>

                        {/* Popular courses */}
                        <div className="flex flex-wrap gap-1 mb-3 flex-1">
                          {u.popularCourses.slice(0, 3).map(c => (
                            <span key={c} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full truncate max-w-[120px]">{c}</span>
                          ))}
                        </div>

                        <p className="text-xs text-gray-600 mb-3">📅 {u.intakeMonths.join(' · ')} · {u.acceptanceRate}% accept</p>

                        <div className="flex gap-2 mt-auto">
                          <Link href={`/universities/${u.slug}`}
                            className="flex-1 text-center text-xs border border-brand-200 text-brand-700 px-3 py-1.5 rounded-lg font-medium hover:bg-brand-50">
                            View Details
                          </Link>
                          <button onClick={() => { setSelectedUni(u); setShowLeadModal(true); }}
                            className="flex-1 text-center text-xs bg-brand-700 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-brand-800">
                            Get Guidance →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!showAll && results.length > 12 && (
                  <div className="text-center mt-6">
                    <button onClick={() => setShowAll(true)} className="btn-primary px-8 py-2.5 text-sm">
                      Show all {results.length} universities ↓
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Lead Modal */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setShowLeadModal(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-brand-700 to-blue-800 text-white p-5 text-center">
              <p className="text-2xl mb-1">🎯</p>
              <h2 className="text-base font-bold">{selectedUni ? `Interested in ${selectedUni.shortName}?` : 'Request Program Options'}</h2>
              <p className="text-blue-200 text-xs mt-0.5">Our counsellor will match you with the best programs.</p>
            </div>
            {leadSt === 'done' ? (
              <div className="p-8 text-center">
                <p className="text-3xl mb-2">✅</p>
                <p className="font-bold text-gray-800">Redirecting…</p>
              </div>
            ) : (
              <form onSubmit={submitLead} className="p-5 space-y-3">
                <input required type="text" placeholder="Full Name *" value={lead.name} onChange={e => setLead(p => ({...p,name:e.target.value}))} className="input-field" />
                <div className="grid grid-cols-2 gap-3">
                  <input required type="tel" placeholder="Phone *" value={lead.phone} onChange={e => setLead(p => ({...p,phone:e.target.value}))} className="input-field" />
                  <input required type="email" placeholder="Email *" value={lead.email} onChange={e => setLead(p => ({...p,email:e.target.value}))} className="input-field" />
                </div>
                <button type="submit" disabled={leadSt === 'submitting'} className="btn-gold w-full text-center">
                  {leadSt === 'submitting' ? 'Sending…' : 'Get Free Guidance →'}
                </button>
                <p className="text-xs text-gray-600 text-center">Free · No spam</p>
              </form>
            )}
            <button onClick={() => setShowLeadModal(false)} className="absolute top-3 right-4 text-white/70 hover:text-white text-xl font-bold">×</button>
          </div>
        </div>
      )}
    </div>
  );
}
