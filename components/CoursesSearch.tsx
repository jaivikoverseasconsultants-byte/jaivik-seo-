'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { CourseCategory } from '@/data/course-categories';

interface Props {
  categories: CourseCategory[];
  groups: Record<string, string[]>;
}

export default function CoursesSearch({ categories, groups }: Props) {
  const [query, setQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  const ALL_COUNTRIES = ['USA','UK','Canada','Australia','Germany','Ireland','Singapore','New Zealand','France','Netherlands','Sweden'];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories.filter(c => {
      if (q && !c.name.toLowerCase().includes(q) && !c.keywords.some(k => k.toLowerCase().includes(q))) return false;
      if (levelFilter && c.level !== levelFilter && c.level !== 'Both') return false;
      if (countryFilter && !c.topCountries.includes(countryFilter)) return false;
      return true;
    });
  }, [categories, query, levelFilter, countryFilter]);

  const isFiltering = query.trim() || levelFilter || countryFilter;

  return (
    <div>
      {/* Search bar */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-8">
        <div className="relative mb-3">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search courses: nursing, energy, digital marketing, law…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 text-gray-900 placeholder-gray-400"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-700">
              ✕
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={levelFilter}
            onChange={e => setLevelFilter(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white"
          >
            <option value="">All Levels</option>
            <option value="UG">Undergraduate</option>
            <option value="PG">Postgraduate</option>
          </select>
          <select
            value={countryFilter}
            onChange={e => setCountryFilter(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white"
          >
            <option value="">All Countries</option>
            {ALL_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {isFiltering && (
            <button
              onClick={() => { setQuery(''); setLevelFilter(''); setCountryFilter(''); }}
              className="text-xs text-red-600 hover:text-red-800 px-3 py-1.5 border border-red-200 rounded-lg"
            >
              Clear filters
            </button>
          )}
        </div>
        {isFiltering && (
          <p className="text-xs text-gray-500 mt-2">
            {filtered.length} course{filtered.length !== 1 ? 's' : ''} found
            {query && <> for &ldquo;{query}&rdquo;</>}
          </p>
        )}
      </div>

      {/* Results when filtering */}
      {isFiltering ? (
        filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
            <p className="text-3xl mb-3">🔍</p>
            <p className="font-semibold text-gray-700 mb-1">No courses match your search</p>
            <p className="text-sm text-gray-500">Try different keywords or clear filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(c => (
              <Link key={c.slug} href={`/courses/${c.slug}`}
                className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-brand-200 hover:shadow-md transition-all group flex items-start gap-3">
                <span className="text-xl flex-shrink-0 mt-0.5">{c.emoji}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-brand-700 leading-snug">{c.name}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-brand-700 font-medium">${Math.round(c.avgFeeUSD / 1000)}K/yr</span>
                    <span className="text-xs text-gray-600">IELTS {c.ieltsTypical}+</span>
                    <span className="text-xs text-gray-600">{c.topCountries.slice(0, 2).join(', ')}</span>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded mt-1 inline-block">{c.level}</span>
                </div>
              </Link>
            ))}
          </div>
        )
      ) : (
        /* Grouped layout when not filtering */
        <div className="space-y-8">
          {Object.entries(groups).map(([group, slugs]) => {
            const cats = slugs.map(s => categories.find(c => c.slug === s)).filter(Boolean) as CourseCategory[];
            if (!cats.length) return null;
            return (
              <div key={group}>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-brand-600 rounded-full inline-block" />
                  {group}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {cats.map(c => (
                    <Link key={c.slug} href={`/courses/${c.slug}`}
                      className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-brand-200 hover:shadow-md transition-all group flex items-start gap-3">
                      <span className="text-xl flex-shrink-0 mt-0.5">{c.emoji}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-brand-700 leading-snug">{c.name}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-xs text-brand-700 font-medium">${Math.round(c.avgFeeUSD / 1000)}K/yr</span>
                          <span className="text-xs text-gray-600">IELTS {c.ieltsTypical}+</span>
                          <span className="text-xs text-gray-600">{c.topCountries.slice(0, 2).join(', ')}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
