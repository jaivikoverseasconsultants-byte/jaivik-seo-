'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { scholarships, scholarshipCountries, scholarshipLevels, scholarshipTypes } from '@/data/scholarships';

export default function ScholarshipsPage() {
  const [country, setCountry] = useState('All Countries');
  const [level, setLevel] = useState('All Levels');
  const [type, setType] = useState('All Types');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return scholarships.filter(s => {
      if (country !== 'All Countries' && s.country !== country) return false;
      if (level !== 'All Levels' && s.level !== level && s.level !== 'Any') return false;
      if (type !== 'All Types' && s.type !== type) return false;
      if (search) {
        const q = search.toLowerCase();
        return s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.provider.toLowerCase().includes(q);
      }
      return true;
    });
  }, [country, level, type, search]);

  const fullyFundedCount = filtered.filter(s => s.type === 'Fully Funded').length;
  const partialCount = filtered.filter(s => s.type === 'Partial').length;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4 justify-center">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white">Scholarships</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            🎓 Updated for 2026 Intake
          </div>
          <h1 className="text-4xl font-bold mb-3">Scholarships for Indian Students Abroad</h1>
          <p className="text-blue-200 text-lg mb-6">
            {scholarships.length}+ scholarships across Canada, UK, Australia, Germany, USA, New Zealand & more.
            Fully funded and partial awards for undergraduate, postgraduate and PhD students.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full">
              ✅ {scholarships.filter(s => s.type === 'Fully Funded').length} Fully Funded
            </span>
            <span className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full">
              💰 {scholarships.filter(s => s.type === 'Partial').length} Partial Awards
            </span>
            <span className="bg-gold-500/20 text-gold-300 px-4 py-2 rounded-full">
              🌍 {scholarshipCountries.length - 1} Countries
            </span>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-100 py-5 px-4 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search scholarships…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field flex-1 min-w-0"
            />
            <select value={country} onChange={e => setCountry(e.target.value)} className="input-field sm:w-44">
              {scholarshipCountries.map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={level} onChange={e => setLevel(e.target.value)} className="input-field sm:w-40">
              {scholarshipLevels.map(l => <option key={l}>{l}</option>)}
            </select>
            <select value={type} onChange={e => setType(e.target.value)} className="input-field sm:w-40">
              {scholarshipTypes.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900">{filtered.length}</span> scholarships
              {filtered.length !== scholarships.length && ` (${fullyFundedCount} fully funded, ${partialCount} partial)`}
            </p>
            {(country !== 'All Countries' || level !== 'All Levels' || type !== 'All Types' || search) && (
              <button
                onClick={() => { setCountry('All Countries'); setLevel('All Levels'); setType('All Types'); setSearch(''); }}
                className="text-xs text-brand-600 hover:text-brand-800 font-medium"
              >
                Clear filters ×
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-2">No scholarships match your filters</p>
              <p className="text-sm text-gray-400">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(s => (
                <ScholarshipCard key={s.id} scholarship={s} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-50 py-12 px-4 border-t border-brand-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Need Help Applying for Scholarships?</h2>
          <p className="text-gray-600 mb-6">
            Our expert counsellors guide you through the entire scholarship application process — SOP writing, recommendation letters, interview preparation, and more.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/book-counselling" className="btn-gold">
              Book Free Counselling →
            </Link>
            <Link href="/find-my-course" className="btn-primary">
              Find My Course →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function ScholarshipCard({ scholarship: s }: { scholarship: (typeof scholarships)[0] }) {
  const isFullyFunded = s.type === 'Fully Funded';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      {/* Header */}
      <div className={`px-5 pt-5 pb-4 ${isFullyFunded ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 'bg-gradient-to-br from-blue-50 to-sky-50'}`}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-3xl">{s.countryFlag}</span>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isFullyFunded ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {isFullyFunded ? '✅ Fully Funded' : '💰 Partial'}
            </span>
            <span className="text-xs bg-white/70 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
              {s.level}
            </span>
          </div>
        </div>
        <h3 className="font-bold text-gray-900 text-sm leading-snug">{s.name}</h3>
        <p className="text-xs text-gray-500 mt-1">{s.provider} · {s.country}</p>
      </div>

      {/* Body */}
      <div className="px-5 py-4 flex-1 flex flex-col gap-3">
        {/* Amount */}
        <div className="flex items-center gap-2">
          <span className="text-gold-600 font-bold text-sm">💵 {s.amount}</span>
        </div>

        {/* Deadline */}
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <span>📅</span>
          <span>Deadline: <span className="font-medium text-gray-800">{s.deadline}</span></span>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{s.description}</p>

        {/* Eligibility */}
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs font-semibold text-gray-700 mb-1">✅ Eligibility</p>
          <p className="text-xs text-gray-600 leading-relaxed">{s.eligibility}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {s.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 flex gap-2">
        <a
          href={s.applyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl text-center transition-colors"
        >
          Apply Now →
        </a>
        <Link
          href="/book-counselling"
          className="flex-1 bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold py-2.5 px-4 rounded-xl text-center transition-colors"
        >
          Get Guidance
        </Link>
      </div>
    </div>
  );
}
