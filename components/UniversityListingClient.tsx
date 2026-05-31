'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { University } from '@/types';

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

const FEE_MIN = 0;
const FEE_MAX = 100000;

type SortKey = 'rank' | 'fee_asc' | 'fee_desc' | 'accept' | 'popular';

interface Props {
  universities: University[];
  countries: string[];
  initialCountry?: string;
}

export default function UniversityListingClient({ universities, countries, initialCountry = '' }: Props) {
  const [country, setCountry]   = useState(initialCountry);
  const [province, setProvince] = useState('');
  const [search, setSearch]     = useState('');
  const [minFee, setMinFee]     = useState(FEE_MIN);
  const [maxFee, setMaxFee]     = useState(FEE_MAX);
  const [sortBy, setSortBy]     = useState<SortKey>('popular');
  const [show48hr, setShow48hr] = useState(false);
  const [showSchol, setShowSchol] = useState(false);
  const [showAll, setShowAll]   = useState(false);

  const provinces = useMemo(() => {
    if (!country) return [];
    return Array.from(new Set(universities.filter(u => u.country === country).map(u => u.state).filter(Boolean))).sort();
  }, [country, universities]);

  const results = useMemo(() => {
    let list = universities.filter(u => {
      if (country && u.country !== country) return false;
      if (province && u.state !== province) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!u.name.toLowerCase().includes(q) && !u.city.toLowerCase().includes(q)) return false;
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
      // popular
      if (a.popularAmongIndians && !b.popularAmongIndians) return -1;
      if (!a.popularAmongIndians && b.popularAmongIndians) return 1;
      return (a.qsRanking ?? 9999) - (b.qsRanking ?? 9999);
    });
    return list;
  }, [universities, country, province, search, minFee, maxFee, sortBy, show48hr, showSchol]);

  const displayed = showAll ? results : results.slice(0, 24);
  const feePct = (v: number) => (v / FEE_MAX) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2">Top Universities Abroad 2026</h1>
          <p className="text-blue-200 text-sm">{universities.length} universities · {countries.length} countries · Filter, compare & apply</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filter bar */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6">
          {/* Row 1: Search + Country + Province + Sort */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mb-3">
            <div className="sm:col-span-2">
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search university or city…" className="input-field text-sm" />
            </div>
            <select value={country} onChange={e => { setCountry(e.target.value); setProvince(''); }} className="input-field text-sm">
              <option value="">All Countries</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {provinces.length > 0 ? (
              <select value={province} onChange={e => setProvince(e.target.value)} className="input-field text-sm">
                <option value="">All Provinces</option>
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
          </div>

          {/* Row 2: Fee slider + quick toggles */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                <span>💰 Tuition:</span>
                <span className="font-semibold">${(minFee/1000).toFixed(0)}K – ${maxFee >= FEE_MAX ? '100K+' : `${(maxFee/1000).toFixed(0)}K`}</span>
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

            <label className="flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap">
              <input type="checkbox" checked={show48hr} onChange={e => setShow48hr(e.target.checked)} className="w-4 h-4 accent-brand-700 rounded cursor-pointer" />
              <span className="text-gray-700 font-medium">⏱ 48hr Offer Letter</span>
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap">
              <input type="checkbox" checked={showSchol} onChange={e => setShowSchol(e.target.checked)} className="w-4 h-4 accent-brand-700 rounded cursor-pointer" />
              <span className="text-gray-700 font-medium">🎓 Scholarship Available</span>
            </label>
          </div>
        </div>

        {/* Country tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          <button onClick={() => { setCountry(''); setProvince(''); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!country ? 'bg-brand-700 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-brand-300'}`}>
            All ({universities.length})
          </button>
          {countries.map(c => {
            const cnt = universities.filter(u => u.country === c).length;
            return (
              <button key={c} onClick={() => { setCountry(c); setProvince(''); }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${country === c ? 'bg-brand-700 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-brand-300'}`}>
                {c} ({cnt})
              </button>
            );
          })}
        </div>

        {/* Result count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-gray-700">
            {results.length === 0 ? 'No universities found' : `${results.length} ${results.length === 1 ? 'university' : 'universities'} found`}
          </p>
          {(country || province || search || minFee > 0 || maxFee < FEE_MAX || show48hr || showSchol) && (
            <button onClick={() => { setCountry(''); setProvince(''); setSearch(''); setMinFee(0); setMaxFee(FEE_MAX); setShow48hr(false); setShowSchol(false); }}
              className="text-xs text-brand-600 underline">Clear filters</button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <p className="text-3xl mb-3">🔍</p>
            <p className="font-bold text-gray-700">No universities match</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your fee range or removing filters.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayed.map(u => {
                const has48hr = u.acceptanceRate > 65 && ['Canada','Ireland','UK'].includes(u.country);
                const isRussell = RUSSELL_GROUP.has(u.name);
                const hasSchol = u.scholarships.length > 0;

                return (
                  <Link key={u.id} href={`/universities/${u.slug}`}
                    className="group bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all flex flex-col">
                    {/* Badges */}
                    {(has48hr || isRussell || hasSchol || u.popularAmongIndians) && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {u.popularAmongIndians && <span className="text-xs bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded-full">🔥 Popular</span>}
                        {has48hr && <span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full">⏱ 48hr Offer</span>}
                        {isRussell && <span className="text-xs bg-gold-50 text-gold-700 px-1.5 py-0.5 rounded-full">🏛 Russell Group</span>}
                        {hasSchol && <span className="text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full">🎓 Scholarship</span>}
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 group-hover:text-brand-700 text-sm leading-snug">{u.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{u.city}{u.state ? `, ${u.state}` : ''} · {u.country}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-xs text-gray-400">QS</p>
                        <p className="text-base font-bold text-brand-700">#{u.qsRanking ?? '—'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="font-bold text-brand-700">${(u.annualTuitionUSD/1000).toFixed(0)}K</p>
                        <p className="text-gray-400">Tuition/yr</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-2 text-center">
                        <p className="font-bold text-green-700">{u.visaApprovalRate}%</p>
                        <p className="text-gray-400">Visa Rate</p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-2 text-center">
                        <p className="font-bold text-orange-600">{u.acceptanceRate}%</p>
                        <p className="text-gray-400">Accept</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-wrap gap-1">
                        {u.intakeMonths.slice(0, 2).map(m => (
                          <span key={m} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{m}</span>
                        ))}
                      </div>
                      <span className="text-xs text-brand-700 font-semibold group-hover:underline">View →</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {!showAll && results.length > 24 && (
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
  );
}
