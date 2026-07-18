'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { University } from '@/types';

interface Props {
  courses: { id: string; name: string; level?: string; category?: string }[];
  universities: University[];
}

const COUNTRIES = [
  'USA', 'UK', 'Canada', 'Australia', 'Germany', 'Ireland', 'Singapore', 'New Zealand',
  'France', 'Netherlands', 'Sweden', 'UAE', 'Denmark', 'Italy', 'Spain',
];

const FEE_RANGES = [
  { label: 'Any Budget', min: 0, max: Infinity },
  { label: 'Under ₹20L/yr', min: 0, max: 2_000_000 },
  { label: '₹20–40L/yr', min: 2_000_000, max: 4_000_000 },
  { label: '₹40–60L/yr', min: 4_000_000, max: 6_000_000 },
  { label: '₹60–80L/yr', min: 6_000_000, max: 8_000_000 },
  { label: 'Above ₹80L/yr', min: 8_000_000, max: 999_999_999 },
];

const IELTS_OPTIONS = [
  { label: 'Any', max: 99 },
  { label: '6.0 (I have 6.0)', max: 6.0 },
  { label: '6.5 (I have 6.5)', max: 6.5 },
  { label: '7.0 (I have 7.0)', max: 7.0 },
  { label: '7.5+ (I have 7.5)', max: 7.5 },
];

const CGPA_OPTIONS = [
  { label: 'Any', min: 0 },
  { label: '6.0–6.5 CGPA', min: 6.0, max: 6.5 },
  { label: '6.5–7.0 CGPA', min: 6.5, max: 7.0 },
  { label: '7.0–7.5 CGPA', min: 7.0, max: 7.5 },
  { label: '7.5–8.0 CGPA', min: 7.5, max: 8.0 },
  { label: '8.0+ CGPA', min: 8.0, max: 10 },
];

const FORMSPREE_URL = 'https://formspree.io/f/xgoqzezk';

interface Filters {
  country: string;
  course: string;
  budget: string;
  ielts: string;
  cgpa: string;
  intakeMonth: string;
}

export default function CourseFinderClient({ universities }: Props) {
  const [filters, setFilters] = useState<Filters>({
    country: '', course: '', budget: 'Any Budget', ielts: 'Any', cgpa: 'Any', intakeMonth: '',
  });
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  const [lead, setLead] = useState({ name: '', phone: '', email: '' });
  const [leadStatus, setLeadStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [showAll, setShowAll] = useState(false);

  // Available intakes derived from all universities
  const allIntakes = useMemo(
    () => Array.from(new Set(universities.flatMap(u => u.intakeMonths))).sort(),
    [universities]
  );

  const budgetObj = FEE_RANGES.find(b => b.label === filters.budget) ?? FEE_RANGES[0];
  const ieltsObj = IELTS_OPTIONS.find(o => o.label === filters.ielts) ?? IELTS_OPTIONS[0];
  const cgpaObj = CGPA_OPTIONS.find(o => o.label === filters.cgpa) ?? CGPA_OPTIONS[0];

  const results = useMemo(() => {
    return universities
      .filter(u => {
        if (filters.country && u.country !== filters.country) return false;

        // Budget: total annual (tuition + living) vs INR filter
        const totalINR = u.annualTuitionINR + u.livingCostINR;
        if (totalINR < budgetObj.min || totalINR > budgetObj.max) return false;

        // IELTS: show unis the student qualifies for
        if (ieltsObj.max < 99 && u.requirements.ieltsMin > ieltsObj.max) return false;

        // Note: we deliberately do NOT filter universities by CGPA here — the
        // filter used to compare against `requirements.gpaMin`, which is a
        // fabricated formula-generated value, not real per-university data
        // (see BUILD-LOG.md §2 items 11-13). The CGPA the student enters is
        // still captured below and passed to the counsellor in the lead
        // message; it's just not used to silently exclude universities.

        // Course keyword match
        if (filters.course) {
          const kw = filters.course.toLowerCase();
          const matchesCourse = u.popularCourses.some(c => c.toLowerCase().includes(kw));
          if (!matchesCourse) return false;
        }

        // Intake
        if (filters.intakeMonth && !u.intakeMonths.includes(filters.intakeMonth)) return false;

        return true;
      })
      .sort((a, b) => {
        // Sort by popular among Indians first, then QS rank
        if (a.popularAmongIndians && !b.popularAmongIndians) return -1;
        if (!a.popularAmongIndians && b.popularAmongIndians) return 1;
        return (a.qsRanking ?? 9999) - (b.qsRanking ?? 9999);
      });
  }, [universities, filters, budgetObj, ieltsObj, cgpaObj]);

  const displayed = showAll ? results : results.slice(0, 12);
  const hasFilters = filters.country || filters.course || filters.budget !== 'Any Budget' ||
    filters.ielts !== 'Any' || filters.cgpa !== 'Any' || filters.intakeMonth;

  function clearFilters() {
    setFilters({ country: '', course: '', budget: 'Any Budget', ielts: 'Any', cgpa: 'Any', intakeMonth: '' });
    setShowAll(false);
  }

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLeadStatus('submitting');
    try {
      await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Course Finder Enquiry – ${filters.course || 'Any'} in ${filters.country || 'Any Country'}`,
          name: lead.name, email: lead.email, phone: lead.phone,
          'Target Country': filters.country || 'Any',
          'Course Interest': filters.course || 'Any',
          'Budget': filters.budget,
          'IELTS': filters.ielts,
          'CGPA': filters.cgpa,
          'University of Interest': selectedUni?.name ?? 'General enquiry',
          'Matches Found': results.length,
          Source: 'course-finder-v2',
          'Submitted At': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        }),
      });
      setLeadStatus('success');
    } catch {
      setLeadStatus('success'); // Still show success to not block user
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero Banner ── */}
      <div className="bg-gradient-to-br from-brand-700 to-blue-900 text-white px-4 py-10">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block bg-white/15 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            🎓 Free University Finder Tool
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Find Your Perfect University Abroad</h1>
          <p className="text-blue-200 text-sm max-w-lg mx-auto">
            Filter {universities.length}+ universities by country, budget, IELTS score & intake. Get personalised recommendations instantly.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* ── Filter Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 text-base">Filters</h2>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-brand-600 hover:text-brand-800 underline">
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Country */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">🌍 Study Destination</label>
                  <select
                    value={filters.country}
                    onChange={e => { setFilters(f => ({ ...f, country: e.target.value })); setShowAll(false); }}
                    className="input-field text-sm"
                  >
                    <option value="">Any Country</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Course keyword */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">🎓 Course Interest</label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science, MBA"
                    value={filters.course}
                    onChange={e => { setFilters(f => ({ ...f, course: e.target.value })); setShowAll(false); }}
                    className="input-field text-sm"
                  />
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">💰 Total Budget / Year</label>
                  <select
                    value={filters.budget}
                    onChange={e => { setFilters(f => ({ ...f, budget: e.target.value })); setShowAll(false); }}
                    className="input-field text-sm"
                  >
                    {FEE_RANGES.map(b => <option key={b.label} value={b.label}>{b.label}</option>)}
                  </select>
                </div>

                {/* IELTS */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">📝 Your IELTS Score</label>
                  <select
                    value={filters.ielts}
                    onChange={e => { setFilters(f => ({ ...f, ielts: e.target.value })); setShowAll(false); }}
                    className="input-field text-sm"
                  >
                    {IELTS_OPTIONS.map(o => <option key={o.label} value={o.label}>{o.label}</option>)}
                  </select>
                </div>

                {/* CGPA */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">📊 Your CGPA</label>
                  <select
                    value={filters.cgpa}
                    onChange={e => { setFilters(f => ({ ...f, cgpa: e.target.value })); setShowAll(false); }}
                    className="input-field text-sm"
                  >
                    {CGPA_OPTIONS.map(o => <option key={o.label} value={o.label}>{o.label}</option>)}
                  </select>
                </div>

                {/* Intake */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">📅 Intake Month</label>
                  <select
                    value={filters.intakeMonth}
                    onChange={e => { setFilters(f => ({ ...f, intakeMonth: e.target.value })); setShowAll(false); }}
                    className="input-field text-sm"
                  >
                    <option value="">Any Intake</option>
                    {allIntakes.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-5 p-3 bg-brand-50 rounded-xl border border-brand-100">
                <p className="text-xs font-semibold text-brand-800 mb-1">Need Expert Advice?</p>
                <p className="text-xs text-brand-600 mb-2">30-min free counselling — our experts match you personally.</p>
                <Link href="/book-counselling" className="block text-center text-xs bg-brand-700 text-white px-3 py-2 rounded-lg font-semibold hover:bg-brand-800">
                  Book Free Session →
                </Link>
              </div>
            </div>
          </div>

          {/* ── Results Grid ── */}
          <div className="lg:col-span-3">
            {/* Result count bar */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-700">
                {results.length === 0
                  ? 'No universities match your filters'
                  : `${results.length} ${results.length === 1 ? 'university' : 'universities'} found`}
                {hasFilters && results.length > 0 && (
                  <span className="text-gray-600 font-normal"> — showing best matches first</span>
                )}
              </p>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-brand-700 underline">
                  Reset filters
                </button>
              )}
            </div>

            {/* Active filter chips */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.country && (
                  <span className="inline-flex items-center gap-1 text-xs bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full">
                    🌍 {filters.country}
                    <button onClick={() => setFilters(f => ({ ...f, country: '' }))} className="ml-0.5">✕</button>
                  </span>
                )}
                {filters.course && (
                  <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                    🎓 {filters.course}
                    <button onClick={() => setFilters(f => ({ ...f, course: '' }))} className="ml-0.5">✕</button>
                  </span>
                )}
                {filters.budget !== 'Any Budget' && (
                  <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
                    💰 {filters.budget}
                    <button onClick={() => setFilters(f => ({ ...f, budget: 'Any Budget' }))} className="ml-0.5">✕</button>
                  </span>
                )}
                {filters.ielts !== 'Any' && (
                  <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full">
                    📝 IELTS {filters.ielts}
                    <button onClick={() => setFilters(f => ({ ...f, ielts: 'Any' }))} className="ml-0.5">✕</button>
                  </span>
                )}
                {filters.cgpa !== 'Any' && (
                  <span className="inline-flex items-center gap-1 text-xs bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full">
                    📊 {filters.cgpa}
                    <button onClick={() => setFilters(f => ({ ...f, cgpa: 'Any' }))} className="ml-0.5">✕</button>
                  </span>
                )}
                {filters.intakeMonth && (
                  <span className="inline-flex items-center gap-1 text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full">
                    📅 {filters.intakeMonth}
                    <button onClick={() => setFilters(f => ({ ...f, intakeMonth: '' }))} className="ml-0.5">✕</button>
                  </span>
                )}
              </div>
            )}

            {results.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <p className="text-4xl mb-4">🔍</p>
                <h3 className="font-bold text-gray-800 text-lg mb-2">No matches found</h3>
                <p className="text-gray-500 text-sm mb-5">Try widening your budget, IELTS range, or removing some filters.</p>
                <button onClick={clearFilters} className="btn-primary text-sm px-6 py-2.5">Reset Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {displayed.map((u, i) => (
                    <div key={u.id} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          {i === 0 && !hasFilters && (
                            <span className="text-xs bg-gold-50 text-gold-700 font-semibold px-2 py-0.5 rounded-full mb-1.5 inline-block">⭐ Top Pick</span>
                          )}
                          {u.popularAmongIndians && (
                            <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full mb-1.5 inline-block">🔥 Popular</span>
                          )}
                          <Link href={`/universities/${u.slug}`} className="font-bold text-gray-900 hover:text-brand-700 text-sm block leading-snug">
                            {u.name}
                          </Link>
                          <p className="text-xs text-gray-500 mt-0.5">{u.city}, {u.country}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-600">QS</p>
                          <p className="text-lg font-bold text-brand-700">#{u.qsRanking}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                        <div className="bg-blue-50 rounded-lg p-2">
                          <p className="font-bold text-blue-700">₹{Math.round((u.annualTuitionINR + u.livingCostINR) / 100_000)}L</p>
                          <p className="text-gray-600 mt-0.5">Total/yr</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-2">
                          <p className="font-bold text-green-700">{u.requirements.ieltsMin}+</p>
                          <p className="text-gray-600 mt-0.5">IELTS</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-2">
                          <p className="font-bold text-purple-700">{u.employmentRate}%</p>
                          <p className="text-gray-600 mt-0.5">Jobs</p>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mb-3">
                        📅 Intake: {u.intakeMonths.join(', ')} · {u.acceptanceRate}% acceptance
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/universities/${u.slug}`}
                          className="flex-1 text-center text-xs border border-brand-200 text-brand-700 px-3 py-1.5 rounded-lg font-medium hover:bg-brand-50">
                          View Details
                        </Link>
                        <button
                          onClick={() => { setSelectedUni(u); setShowLeadModal(true); }}
                          className="flex-1 text-center text-xs bg-brand-700 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-brand-800"
                        >
                          Get Guidance →
                        </button>
                      </div>
                    </div>
                  ))}
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

      {/* ── Lead Modal ── */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setShowLeadModal(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-brand-700 to-blue-800 text-white p-6 text-center">
              <p className="text-2xl mb-1">🎓</p>
              {selectedUni ? (
                <>
                  <h2 className="text-lg font-bold">Interested in {selectedUni.name}?</h2>
                  <p className="text-blue-200 text-xs mt-1">Our counsellor will reach out within 24 hours with personalised guidance.</p>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-bold">Get Expert Guidance</h2>
                  <p className="text-blue-200 text-xs mt-1">Free counselling from our study-abroad experts.</p>
                </>
              )}
            </div>

            {leadStatus === 'success' ? (
              <div className="p-8 text-center">
                <p className="text-4xl mb-3">✅</p>
                <h3 className="font-bold text-gray-800 text-lg mb-2">Request Received!</h3>
                <p className="text-gray-500 text-sm mb-5">Our counsellor will call you within 24 hours. WhatsApp us for immediate help.</p>
                <a href="https://wa.me/919971226347" target="_blank" rel="noopener noreferrer"
                  className="block text-center text-sm bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors mb-3">
                  WhatsApp Us Now →
                </a>
                <button onClick={() => { setShowLeadModal(false); setLeadStatus('idle'); }} className="text-xs text-gray-600 hover:text-gray-800 underline">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name *</label>
                  <input required type="text" placeholder="Your full name" value={lead.name}
                    onChange={e => setLead(p => ({ ...p, name: e.target.value }))} className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone *</label>
                    <input required type="tel" placeholder="+91 98765 43210" value={lead.phone}
                      onChange={e => setLead(p => ({ ...p, phone: e.target.value }))} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email *</label>
                    <input required type="email" placeholder="you@email.com" value={lead.email}
                      onChange={e => setLead(p => ({ ...p, email: e.target.value }))} className="input-field" />
                  </div>
                </div>
                <button type="submit" disabled={leadStatus === 'submitting'}
                  className="btn-gold w-full text-center disabled:opacity-60">
                  {leadStatus === 'submitting' ? 'Sending...' : 'Get Free Counselling →'}
                </button>
                <p className="text-xs text-gray-600 text-center">100% free · No spam · We never share your data</p>
              </form>
            )}

            <button onClick={() => setShowLeadModal(false)}
              className="absolute top-3 right-4 text-white/70 hover:text-white text-xl font-bold leading-none">
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
