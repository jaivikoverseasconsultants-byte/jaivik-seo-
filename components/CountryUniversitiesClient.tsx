'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface University {
  id: string; name: string; slug: string; city: string; state: string; country: string;
  qsRanking: number; annualTuitionUSD: number; visaApprovalRate: number;
  intakeMonths: string[]; requirements: { ieltsMin: number };
  popularAmongIndians: boolean;
  popularCourses: string[];
}

const STUDY_AREAS: Record<string, string[]> = {
  'Computer Science & IT': ['Computer Science','Software Engineering','AI','Machine Learning','Data Science','Cybersecurity','Information Technology','Computing'],
  'Business & Management': ['MBA','Business','Management','Finance','Accounting','Marketing','Economics','Commerce','Analytics'],
  'Engineering': ['Engineering','Mechanical','Civil','Electrical','Chemical','Aerospace','Robotics','Energy','Renewable','Petroleum','Mining'],
  'Health Sciences': ['Medicine','Nursing','Public Health','Pharmacy','Biomedical','Healthcare','Dentistry','Physiotherapy','Medical','Health','Anatomy','Physiology'],
  'Law & Social Sciences': ['Law','LLM','LLB','Political Science','International Relations','Sociology','Criminology','Psychology'],
  'Sciences': ['Physics','Chemistry','Mathematics','Biology','Statistics','Environmental','Genetics','Biotechnology'],
  'Arts & Humanities': ['Arts','Humanities','History','Philosophy','Literature','Media','Communication','Journalism','Design','Architecture'],
  'Education': ['Education','Teaching','PGCE'],
};

interface Props {
  unis: University[];
  country: string;
}

const FEE_RANGES = [
  { label: 'All Fees', min: 0, max: Infinity },
  { label: 'Under $15K/yr', min: 0, max: 15000 },
  { label: '$15K–$25K/yr', min: 15000, max: 25000 },
  { label: '$25K+/yr', min: 25000, max: Infinity },
];

const IELTS_OPTIONS = [
  { label: 'Any IELTS', max: Infinity },
  { label: '6.0+ (you have 6.0)', max: 6.0 },
  { label: '6.5+ (you have 6.5)', max: 6.5 },
  { label: '7.0+ (you have 7.0)', max: 7.0 },
];

export default function CountryUniversitiesClient({ unis, country }: Props) {
  const router = useRouter();
  const [cityFilter, setCityFilter] = useState('');
  const [feeRange, setFeeRange] = useState('All Fees');
  const [ieltsFilter, setIeltsFilter] = useState('Any IELTS');
  const [intakeFilter, setIntakeFilter] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  const [studyArea, setStudyArea] = useState('');
  const [showAll, setShowAll] = useState(false);

  // Derive unique cities and intakes
  const cities = useMemo(
    () => Array.from(new Set(unis.map(u => u.city))).sort(),
    [unis]
  );
  const intakes = useMemo(
    () => Array.from(new Set(unis.flatMap(u => u.intakeMonths))).sort(),
    [unis]
  );

  const feeRangeObj = FEE_RANGES.find(r => r.label === feeRange) ?? FEE_RANGES[0];
  const ieltsObj = IELTS_OPTIONS.find(o => o.label === ieltsFilter) ?? IELTS_OPTIONS[0];

  const filtered = useMemo(() => {
    return unis
      .filter(u => {
        if (cityFilter && u.city !== cityFilter) return false;
        if (u.annualTuitionUSD < feeRangeObj.min || u.annualTuitionUSD > feeRangeObj.max) return false;
        if (u.requirements.ieltsMin > ieltsObj.max) return false;
        if (intakeFilter && !u.intakeMonths.includes(intakeFilter)) return false;
        if (courseSearch.trim()) {
          const q = courseSearch.trim().toLowerCase();
          const match = u.popularCourses.some(c => c.toLowerCase().includes(q)) || u.name.toLowerCase().includes(q);
          if (!match) return false;
        }
        if (studyArea) {
          const terms = STUDY_AREAS[studyArea] ?? [];
          const match = u.popularCourses.some(c => terms.some(t => c.toLowerCase().includes(t.toLowerCase())));
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => (a.qsRanking ?? 9999) - (b.qsRanking ?? 9999));
  }, [unis, cityFilter, feeRangeObj, ieltsObj, intakeFilter, courseSearch, studyArea]);

  const hasFilters = cityFilter || feeRange !== 'All Fees' || ieltsFilter !== 'Any IELTS' || intakeFilter || courseSearch || studyArea;
  const displayed = showAll ? filtered : filtered.slice(0, 20);

  function clearFilters() {
    setCityFilter('');
    setFeeRange('All Fees');
    setIeltsFilter('Any IELTS');
    setIntakeFilter('');
    setCourseSearch('');
    setStudyArea('');
    setShowAll(false);
  }

  return (
    <div>
      {/* ── Filter bar ── */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-800">Filter Universities</p>
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-brand-600 hover:text-brand-800 underline">
              Clear all filters
            </button>
          )}
        </div>
        {/* Course search */}
        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-1">Search by Course</label>
          <input
            type="text"
            value={courseSearch}
            onChange={e => { setCourseSearch(e.target.value); setShowAll(false); }}
            placeholder="e.g. Nursing, Energy Engineering, Digital Marketing…"
            className="input-field text-sm py-2 w-full"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          {/* Study Area */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs text-gray-500 mb-1">Study Area</label>
            <select
              value={studyArea}
              onChange={e => { setStudyArea(e.target.value); setShowAll(false); }}
              className="input-field text-sm py-2"
            >
              <option value="">All Areas</option>
              {Object.keys(STUDY_AREAS).map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">City</label>
            <select
              value={cityFilter}
              onChange={e => { setCityFilter(e.target.value); setShowAll(false); }}
              className="input-field text-sm py-2"
            >
              <option value="">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Fee range */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Annual Fee (USD)</label>
            <select
              value={feeRange}
              onChange={e => { setFeeRange(e.target.value); setShowAll(false); }}
              className="input-field text-sm py-2"
            >
              {FEE_RANGES.map(r => <option key={r.label} value={r.label}>{r.label}</option>)}
            </select>
          </div>

          {/* IELTS */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Your IELTS Score</label>
            <select
              value={ieltsFilter}
              onChange={e => { setIeltsFilter(e.target.value); setShowAll(false); }}
              className="input-field text-sm py-2"
            >
              {IELTS_OPTIONS.map(o => <option key={o.label} value={o.label}>{o.label}</option>)}
            </select>
          </div>

          {/* Intake */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Intake Month</label>
            <select
              value={intakeFilter}
              onChange={e => { setIntakeFilter(e.target.value); setShowAll(false); }}
              className="input-field text-sm py-2"
            >
              <option value="">All Intakes</option>
              {intakes.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mt-3">
            {cityFilter && (
              <span className="inline-flex items-center gap-1 text-xs bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full">
                📍 {cityFilter}
                <button onClick={() => setCityFilter('')} className="ml-0.5 hover:text-brand-900">✕</button>
              </span>
            )}
            {feeRange !== 'All Fees' && (
              <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
                💰 {feeRange}
                <button onClick={() => setFeeRange('All Fees')} className="ml-0.5 hover:text-green-900">✕</button>
              </span>
            )}
            {ieltsFilter !== 'Any IELTS' && (
              <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full">
                📝 {ieltsFilter}
                <button onClick={() => setIeltsFilter('Any IELTS')} className="ml-0.5 hover:text-purple-900">✕</button>
              </span>
            )}
            {intakeFilter && (
              <span className="inline-flex items-center gap-1 text-xs bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full">
                🗓 {intakeFilter}
                <button onClick={() => setIntakeFilter('')} className="ml-0.5 hover:text-orange-900">✕</button>
              </span>
            )}
            {courseSearch && (
              <span className="inline-flex items-center gap-1 text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full">
                🎓 Course: {courseSearch}
                <button onClick={() => setCourseSearch('')} className="ml-0.5 hover:text-teal-900">✕</button>
              </span>
            )}
            {studyArea && (
              <span className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">
                📚 {studyArea}
                <button onClick={() => setStudyArea('')} className="ml-0.5 hover:text-indigo-900">✕</button>
              </span>
            )}
          </div>
        )}

        <p className="text-xs text-gray-600 mt-2">
          {filtered.length} {filtered.length === 1 ? 'university' : 'universities'} found
          {hasFilters ? ` (filtered from ${unis.length})` : ''}
        </p>
      </div>

      {/* ── University cards ── */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
          <p className="text-3xl mb-3">🔍</p>
          <p className="font-semibold text-gray-700 mb-2">No universities match your filters</p>
          <p className="text-sm text-gray-500 mb-4">Try widening your criteria or clearing some filters.</p>
          <button onClick={clearFilters} className="btn-primary text-sm px-5 py-2">Clear Filters</button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map((u, i) => (
            <div
              key={u.id}
              className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all group cursor-pointer"
              onClick={() => router.push(`/universities/${u.slug}`)}
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-brand-50 rounded-full flex items-center justify-center text-brand-700 font-bold text-sm flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-900 group-hover:text-brand-700">{u.name}</span>
                        {u.popularAmongIndians && (
                          <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-medium">🔥 Popular with Indians</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{u.city}, {u.state} · QS #{u.qsRanking ?? 'N/A'}</p>
                    </div>
                    <span className="text-brand-700 font-semibold text-sm whitespace-nowrap">${(u.annualTuitionUSD / 1000).toFixed(0)}K/yr</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3 text-xs">
                    <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full">✓ Visa {u.visaApprovalRate}%</span>
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full">📅 {u.intakeMonths.join(', ')}</span>
                    <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full">IELTS {u.requirements.ieltsMin}+</span>
                  </div>
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); router.push(`/universities/${u.slug}/courses`); }}
                      className="text-xs bg-brand-700 text-white px-3 py-1 rounded-full font-medium hover:bg-brand-800 transition-colors"
                    >
                      Browse Courses →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Show more */}
          {!showAll && filtered.length > 20 && (
            <div className="text-center pt-4">
              <button
                onClick={() => setShowAll(true)}
                className="btn-primary px-8 py-2.5 text-sm"
              >
                Show all {filtered.length} universities ↓
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
