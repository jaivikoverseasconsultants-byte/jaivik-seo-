'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSearch() {
  const [q, setQ] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/universities?q=${encodeURIComponent(q.trim())}`);
    } else {
      router.push('/universities');
    }
  };

  const quickSearches = ['MS Computer Science USA', 'MBA Canada', 'MS Data Science UK', 'Study in Germany free'];

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative flex items-center">
        <div className="absolute left-4 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search university, course or country…"
          className="w-full pl-12 pr-32 py-4 rounded-2xl text-gray-900 text-base placeholder-gray-400 bg-white shadow-xl border-2 border-transparent focus:border-gold-400 focus:outline-none transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 bg-brand-700 hover:bg-brand-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          Search →
        </button>
      </form>
      {/* Quick searches */}
      <div className="flex flex-wrap gap-2 mt-3">
        <span className="text-blue-300 text-xs">Popular:</span>
        {quickSearches.map(s => (
          <button
            key={s}
            onClick={() => router.push(`/universities?q=${encodeURIComponent(s)}`)}
            className="text-xs text-blue-200 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
