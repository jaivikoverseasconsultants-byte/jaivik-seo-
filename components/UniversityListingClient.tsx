'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { University } from '@/types';
import CurrencyConverter from '@/components/CurrencyConverter';

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

const COUNTRY_FLAGS: Record<string, string> = {
  USA: '🇺🇸', UK: '🇬🇧', Canada: '🇨🇦', Australia: '🇦🇺',
  Germany: '🇩🇪', Ireland: '🇮🇪', Singapore: '🇸🇬', 'New Zealand': '🇳🇿',
  France: '🇫🇷', Netherlands: '🇳🇱', Sweden: '🇸🇪', UAE: '🇦🇪',
  Denmark: '🇩🇰', Italy: '🇮🇹', Spain: '🇪🇸',
};

const COUNTRY_GRADIENTS: Record<string, string> = {
  USA: 'from-red-600 to-blue-700',
  UK: 'from-blue-700 to-red-600',
  Canada: 'from-red-600 to-red-700',
  Australia: 'from-blue-600 to-yellow-500',
  Germany: 'from-gray-800 to-red-600',
  Ireland: 'from-green-600 to-orange-500',
  Singapore: 'from-red-600 to-gray-700',
  'New Zealand': 'from-blue-700 to-red-600',
  France: 'from-blue-700 to-red-600',
  Netherlands: 'from-red-600 to-blue-700',
  Sweden: 'from-blue-600 to-yellow-500',
  UAE: 'from-green-700 to-red-600',
  Denmark: 'from-red-600 to-gray-100',
  Italy: 'from-green-600 to-red-600',
  Spain: 'from-red-600 to-yellow-500',
};

const FEE_MIN = 0;
const FEE_MAX = 100000;

type SortKey = 'rank' | 'fee_asc' | 'fee_desc' | 'accept' | 'popular';

interface Props {
  universities: University[];
  countries: string[];
  initialCountry?: string;
  initialSearch?: string;
}

export default function UniversityListingClient({ universities, countries, initialCountry = '', initialSearch = '' }: Props) {
  const [country, setCountry]   = useState(initialCountry);
  const [province, setProvince] = useState('');
  const [search, setSearch]     = useState(initialSearch);
  const [minFee, setMinFee]     = useState(FEE_MIN);
  const [maxFee, setMaxFee]     = useState(FEE_MAX);
  const [sortBy, setSortBy]     = useState<SortKey>('popular');
  const [show48hr, setShow48hr] = useState(false);
  const [showSchol, setShowSchol] = useState(false);
  const [showAll, setShowAll]   = useState(false);

  const provinces = useMemo(() => {
    if (!country) return [];
    return Array.from(new Set(
      universities.filter(u => u.country === country).map(u => u.state).filter(Boolean)
    )).sort() as string[];
  }, [country, universities]);

  const results = useMemo(() => {
    let list = universities.filter(u => {
      if (country && u.country !== country) return false;
      if (province && u.state !== province) return false;
      if (search) {
        const q = search.toLowerCase();
        const nameMatch = u.name.toLowerCase().includes(q) || u.shortName.toLowerCase().includes(q);
        const cityMatch = u.city.toLowerCase().includes(q);
        const countryMatch = u.country.toLowerCase().includes(q);
        const courseMatch = u.popularCourses.some(c => c.toLowerCase().includes(q));
        const descMatch = u.description.toLowerCase().includes(q);
        const highlightMatch = u.highlights.some(h => h.toLowerCase().includes(q));
        if (!nameMatch && !cityMatch && !countryMatch && !courseMatch && !descMatch && !highlightMatch) return false;
      }
      if (u.annualTuitionUSD < minFee || u.annualTuitionUSD > maxFee) return false;
      if (show48hr && !(u.acceptanceRate > 65 && ['Canada','Ireland','UK'].includes(u.country))) return false;
      if (showSchol && !(u.scholarships.length > 0)) return false;
      return true;
    });

    list.sort((a, b) => {
      if (sortBy === 'rank')     return (a.qsRanking ?? 9999) - (b.qsRanking ?? 9999);
      if (sortBy === 'fee_asc')  return a.annualTuitionUSD - b.annualTuitionUSD;
      if (sortBy === 'fee_desc') return b.annualTuitionUSD - a.annualTuitionUSD;
      if (sortBy === 'accept')   return b.acceptanceRate - a.acceptanceRate;
      if (a.popularAmongIndians && !b.popularAmongIndians) return -1;
      if (!a.popularAmongIndians && b.popularAmongIndians) return 1;
      return (a.qsRanking ?? 9999) - (b.qsRanking ?? 9999);
    });
    return list;
  }, [universities, country, province, search, minFee, maxFee, sortBy, show48hr, showSchol]);

  const displayed = showAll ? results : results.slice(0, 24);
  const feePct = (v: number) => (v / FEE_MAX) * 100;
  const hasFilters = !!(country || province || search || minFee > 0 || maxFee < FEE_MAX || show48hr || showSchol);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-800 to-brand-900 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">Top Universities Abroad 2026</h1>
            <p className="text-blue-200 text-sm">{universities.length} universities · {countries.length} countries · Filter by fees, rank, acceptance rate & more</p>
          </div>
          {/* Hero search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <svg className="absolute left-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search university, city, country or course…"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-900 text-sm placeholder-gray-400 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filter bar */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            <select value={country} onChange={e => { setCountry(e.target.value); setProvince(''); }} className="input-field text-sm">
              <option value="">🌍 All Countries</option>
              {countries.map(c => <option key={c} value={c}>{COUNTRY_FLAGS[c] ?? ''} {c}</option>)}
            </select>
            {provinces.length > 0 ? (
              <select value={province} onChange={e => setProvince(e.target.value)} className="input-field text-sm">
                <option value="">All Provinces/States</option>
                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            ) : <div />}
            <select value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)} className="input-field text-sm">
              <option value="popular">🔥 Popular First</option>
              <option value="rank">🏆 QS Rank</option>
              <option value="fee_asc">💸 Fee: Low→High</option>
              <option value="fee_desc">💰 Fee: High→Low</option>
              <option value="accept">✅ Acceptance Rate</option>
            </select>
            <div className="flex gap-3 items-center">
              <label className="flex items-center gap-1.5 text-xs cursor-pointer whitespace-nowrap">
                <input type="checkbox" checked={show48hr} onChange={e => setShow48hr(e.target.checked)} className="w-3.5 h-3.5 accent-brand-700 rounded cursor-pointer" />
                <span className="text-gray-700">⏱ 48hr Offer</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs cursor-pointer whitespace-nowrap">
                <input type="checkbox" checked={showSchol} onChange={e => setShowSchol(e.target.checked)} className="w-3.5 h-3.5 accent-brand-700 rounded cursor-pointer" />
                <span className="text-gray-700">🎓 Scholarship</span>
              </label>
            </div>
          </div>

          {/* Fee range slider */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600 whitespace-nowrap">💰 Tuition:</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-1.5">
                <span className="font-semibold text-brand-700">${(minFee/1000).toFixed(0)}K – ${maxFee >= FEE_MAX ? '100K+' : `${(maxFee/1000).toFixed(0)}K`}/year</span>
              </div>
              <div className="relative h-5 flex items-center">
                <div className="absolute w-full h-1.5 bg-gray-200 rounded-full">
                  <div className="absolute h-full bg-brand-600 rounded-full" style={{ left: `${feePct(minFee)}%`, width: `${feePct(maxFee)-feePct(minFee)}%` }} />
                </div>
                <input type="range" min={0} max={FEE_MAX} step={2000} value={minFee}
                  onChange={e => setMinFee(Math.min(+e.target.value, maxFee - 2000))}
                  className="absolute w-full h-0 appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-700 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow"
                  style={{ zIndex: minFee > 90000 ? 5 : 3 }} />
                <input type="range" min={0} max={FEE_MAX} step={2000} value={maxFee}
                  onChange={e => setMaxFee(Math.max(+e.target.value, minFee + 2000))}
                  className="absolute w-full h-0 appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-700 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow"
                  style={{ zIndex: 4 }} />
              </div>
            </div>
            {hasFilters && (
              <button onClick={() => { setCountry(''); setProvince(''); setSearch(''); setMinFee(0); setMaxFee(FEE_MAX); setShow48hr(false); setShowSchol(false); }}
                className="text-xs text-brand-600 font-medium hover:text-brand-800 whitespace-nowrap border border-brand-200 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors">
                Clear all ×
              </button>
            )}
          </div>
        </div>

        {/* Country tabs */}
        <div className="flex flex-wrap gap-2 mb-5 overflow-x-auto pb-1">
          <button onClick={() => { setCountry(''); setProvince(''); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${!country ? 'bg-brand-700 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-700 hover:border-brand-300'}`}>
            All ({universities.length})
          </button>
          {countries.map(c => (
            <button key={c} onClick={() => { setCountry(c); setProvince(''); }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1 ${country === c ? 'bg-brand-700 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-700 hover:border-brand-300'}`}>
              {COUNTRY_FLAGS[c] ?? ''} {c} ({universities.filter(u => u.country === c).length})
            </button>
          ))}
        </div>

        {/* Result count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-gray-700">
            {results.length === 0 ? 'No universities found' : `${results.length} ${results.length === 1 ? 'university' : 'universities'} found`}
            {search && <span className="text-gray-400 font-normal"> for &ldquo;{search}&rdquo;</span>}
          </p>
          <div className="flex gap-3 items-center text-xs text-gray-500">
            <span>{displayed.length} of {results.length} shown</span>
          </div>
        </div>

        <div className="lg:flex lg:gap-6 lg:items-start">
        <div className="flex-1 min-w-0">
        {results.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-bold text-gray-700 text-lg">No universities match your filters</p>
            <p className="text-gray-400 text-sm mt-1 mb-4">Try adjusting your fee range or removing some filters.</p>
            <button onClick={() => { setCountry(''); setProvince(''); setSearch(''); setMinFee(0); setMaxFee(FEE_MAX); setShow48hr(false); setShowSchol(false); }}
              className="btn-primary text-sm px-6">
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            {/* University cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayed.map(u => {
                const has48hr = u.acceptanceRate > 65 && ['Canada','Ireland','UK'].includes(u.country);
                const isRussell = RUSSELL_GROUP.has(u.name);
                const hasSchol = u.scholarships.length > 0;
                const gradient = COUNTRY_GRADIENTS[u.country] ?? 'from-brand-700 to-brand-900';

                return (
                  <Link key={u.id} href={`/universities/${u.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-brand-200 transition-all flex flex-col">

                    {/* Colour header strip */}
                    <div className={`bg-gradient-to-r ${gradient} h-16 relative flex items-center justify-between px-4`}>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{COUNTRY_FLAGS[u.country] ?? '🌍'}</span>
                        <div>
                          <p className="text-white/90 text-xs font-medium">{u.country}</p>
                          <p className="text-white/70 text-xs">{u.city}</p>
                        </div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2.5 py-1 text-right">
                        <p className="text-white font-bold text-sm">#{u.qsRanking ?? '—'}</p>
                        <p className="text-white/70 text-xs">QS</p>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-4 flex-1 flex flex-col">
                      {/* Badges */}
                      {(has48hr || isRussell || hasSchol || u.popularAmongIndians) && (
                        <div className="flex flex-wrap gap-1 mb-2.5">
                          {u.popularAmongIndians && <span className="text-xs bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded-full border border-orange-100">🔥 Popular</span>}
                          {has48hr && <span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full border border-blue-100">⏱ 48hr Offer</span>}
                          {isRussell && <span className="text-xs bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded-full border border-yellow-100">🏛 Russell</span>}
                          {hasSchol && <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full border border-green-100">🎓 Scholarship</span>}
                        </div>
                      )}

                      <p className="font-bold text-gray-900 group-hover:text-brand-700 text-sm leading-snug mb-1 line-clamp-2">{u.name}</p>
                      <p className="text-xs text-gray-400 mb-3">{u.campusType} campus · Est. {u.establishedYear}</p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-1.5 text-xs mb-3">
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                          <p className="font-bold text-brand-700">${(u.annualTuitionUSD/1000).toFixed(0)}K</p>
                          <p className="text-gray-400 text-xs">Tuition/yr</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-2 text-center">
                          <p className="font-bold text-green-700">{u.visaApprovalRate}%</p>
                          <p className="text-gray-400 text-xs">Visa</p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-2 text-center">
                          <p className="font-bold text-orange-600">{u.acceptanceRate}%</p>
                          <p className="text-gray-400 text-xs">Accept</p>
                        </div>
                      </div>

                      {/* Intake tags */}
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {u.intakeMonths.slice(0, 2).map(m => (
                          <span key={m} className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">{m}</span>
                        ))}
                        <span className="ml-auto text-xs text-brand-700 font-semibold group-hover:underline">View →</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {!showAll && results.length > 24 && (
              <div className="text-center mt-8">
                <button onClick={() => setShowAll(true)} className="btn-primary px-8 py-3 text-sm">
                  Show all {results.length} universities ↓
                </button>
              </div>
            )}
          </>
        )}
        </div>
        <div className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-20">
            <CurrencyConverter />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
