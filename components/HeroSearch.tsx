'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CourseAtUni {
  courseName: string;
  universityName: string;
  universitySlug: string;
  country: string;
  ielts: number;
  fee: number;
}

interface SearchResult {
  courseAtUni: CourseAtUni[];
  categories: { name: string; slug: string; emoji: string }[];
  unis: { name: string; slug: string; country: string; city: string }[];
  countries: string[];
}

const COUNTRY_FLAGS: Record<string, string> = {
  USA: '🇺🇸', UK: '🇬🇧', Canada: '🇨🇦', Australia: '🇦🇺',
  Germany: '🇩🇪', Ireland: '🇮🇪', Singapore: '🇸🇬', 'New Zealand': '🇳🇿',
  France: '🇫🇷', Netherlands: '🇳🇱', Sweden: '🇸🇪', UAE: '🇦🇪',
  Denmark: '🇩🇰', Italy: '🇮🇹', Spain: '🇪🇸',
};

export default function HeroSearch() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 2) { setResults(null); setOpen(false); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
        const data: SearchResult = await res.json();
        setResults(data);
        const hasAny = data.courseAtUni.length > 0 || data.categories.length > 0 || data.unis.length > 0 || data.countries.length > 0;
        setOpen(hasAny);
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    }, 220);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [q]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    if (q.trim()) {
      router.push(`/universities?q=${encodeURIComponent(q.trim())}`);
    } else {
      router.push('/universities');
    }
  };

  const quickSearches = ['MS Computer Science USA', 'MBA Canada', 'Nursing UK', 'Energy Engineering Germany', 'Digital Marketing'];

  const total = results
    ? results.courseAtUni.length + results.categories.length + results.unis.length + results.countries.length
    : 0;

  const divider = 'border-t border-gray-100';

  return (
    <div className="w-full relative">
      <form onSubmit={handleSearch} className="relative flex items-center">
        <div className="absolute left-4 text-gray-400">
          {loading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={q}
          onChange={e => setQ(e.target.value)}
          onFocus={() => { if (results && total > 0) setOpen(true); }}
          placeholder="Search course, university or country…"
          className="w-full pl-12 pr-32 py-4 rounded-2xl text-gray-900 text-base placeholder-gray-400 bg-white shadow-xl border-2 border-transparent focus:border-gold-400 focus:outline-none transition-all"
          autoComplete="off"
        />
        <button
          type="submit"
          className="absolute right-2 bg-brand-700 hover:bg-brand-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          Search →
        </button>
      </form>

      {/* Live dropdown */}
      {open && results && total > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden max-h-[480px] overflow-y-auto"
        >
          {/* 1st: Courses at specific universities */}
          {results.courseAtUni.length > 0 && (
            <div>
              <div className="px-4 pt-3 pb-1 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Courses ({results.courseAtUni.length})
                </span>
              </div>
              {results.courseAtUni.map((c, i) => (
                <Link
                  key={`${c.universitySlug}-${c.courseName}-${i}`}
                  href={`/universities/${c.universitySlug}/courses`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand-50 transition-colors"
                >
                  <span className="text-xl flex-shrink-0">🎓</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{c.courseName}</p>
                    <p className="text-xs text-gray-500">
                      {c.universityName} · {COUNTRY_FLAGS[c.country] ?? ''} {c.country} · ${(c.fee / 1000).toFixed(0)}K/yr · IELTS {c.ielts}+
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* 2nd: Course streams/categories */}
          {results.categories.length > 0 && (
            <div className={results.courseAtUni.length > 0 ? divider : ''}>
              <div className="px-4 pt-3 pb-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Course Streams ({results.categories.length})
                </span>
              </div>
              {results.categories.map(c => (
                <Link
                  key={c.slug}
                  href={`/courses/${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand-50 transition-colors"
                >
                  <span className="text-xl flex-shrink-0">{c.emoji}</span>
                  <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                </Link>
              ))}
            </div>
          )}

          {/* 3rd: Universities (name/city match) */}
          {results.unis.length > 0 && (
            <div className={(results.courseAtUni.length > 0 || results.categories.length > 0) ? divider : ''}>
              <div className="px-4 pt-3 pb-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Universities ({results.unis.length})
                </span>
              </div>
              {results.unis.map(u => (
                <Link
                  key={u.slug}
                  href={`/universities/${u.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand-50 transition-colors"
                >
                  <span className="text-xl">{COUNTRY_FLAGS[u.country] ?? '🏫'}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.city}, {u.country}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* 4th: Countries */}
          {results.countries.length > 0 && (
            <div className={(results.courseAtUni.length > 0 || results.categories.length > 0 || results.unis.length > 0) ? divider : ''}>
              <div className="px-4 pt-3 pb-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Countries ({results.countries.length})
                </span>
              </div>
              {results.countries.map(c => (
                <Link
                  key={c}
                  href={`/universities/country/${c.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand-50 transition-colors"
                >
                  <span className="text-xl">{COUNTRY_FLAGS[c] ?? '🌍'}</span>
                  <p className="text-sm font-semibold text-gray-900">Study in {c}</p>
                </Link>
              ))}
            </div>
          )}

          {/* See all */}
          <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
            <Link
              href={`/universities?q=${encodeURIComponent(q.trim())}`}
              onClick={() => setOpen(false)}
              className="text-sm text-brand-700 font-semibold hover:text-brand-900"
            >
              See all results for &ldquo;{q}&rdquo; →
            </Link>
          </div>
        </div>
      )}

      {/* Quick searches */}
      <div className="flex flex-wrap gap-2 mt-3">
        <span className="text-blue-300 text-xs">Popular:</span>
        {quickSearches.map(s => (
          <button
            key={s}
            onClick={() => { setQ(s); router.push(`/universities?q=${encodeURIComponent(s)}`); }}
            className="text-xs text-blue-200 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
