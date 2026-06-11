'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { courseIndex, CourseEntry } from '@/data/course-index';

const FIELDS = ['Computer Science', 'MBA', 'Data Science', 'Nursing', 'Engineering', 'Law', 'Psychology', 'Finance', 'Other'] as const;
const COUNTRIES = ['Canada', 'UK', 'Australia', 'Germany', 'Ireland', 'Singapore', 'New Zealand', 'Netherlands', 'UAE', 'France'] as const;
const BUDGETS = ['Under 20L', '20-40L', '40-60L', '60-80L', 'Above 80L'] as const;
const IELTS_OPTIONS = ['Below 6', '6.0', '6.5', '7.0', '7.5+', 'Not given yet'] as const;
const QUALIFICATIONS = ['12th Pass', "Bachelor's", "Master's", 'Working Professional'] as const;

const COUNTRY_FLAGS: Record<string, string> = {
  Canada: '🇨🇦', UK: '🇬🇧', Australia: '🇦🇺', Germany: '🇩🇪',
  Ireland: '🇮🇪', Singapore: '🇸🇬', 'New Zealand': '🇳🇿',
  Netherlands: '🇳🇱', UAE: '🇦🇪', France: '🇫🇷',
};

function ieltsToNumber(val: string): number {
  if (val === 'Below 6') return 5.5;
  if (val === '7.5+') return 7.5;
  if (val === 'Not given yet') return 99;
  return parseFloat(val);
}

function budgetMaxINR(val: string): number {
  switch (val) {
    case 'Under 20L': return 2000000;
    case '20-40L': return 4000000;
    case '40-60L': return 6000000;
    case '60-80L': return 8000000;
    default: return Infinity;
  }
}

function budgetMinINR(val: string): number {
  switch (val) {
    case '20-40L': return 2000000;
    case '40-60L': return 4000000;
    case '60-80L': return 6000000;
    case 'Above 80L': return 8000000;
    default: return 0;
  }
}

function scoreCourse(course: CourseEntry, budget: string, countries: string[], ieltsVal: string): number {
  let score = 0;

  // Budget: 40 pts
  const maxBudget = budgetMaxINR(budget);
  const minBudget = budgetMinINR(budget);
  const inRange = course.annualINR <= maxBudget && course.annualINR >= minBudget;
  const nearRange = course.annualINR <= maxBudget * 1.3 && course.annualINR >= minBudget * 0.7;
  if (budget === 'Above 80L' && course.annualINR >= minBudget) {
    score += 40;
  } else if (inRange) {
    score += 40;
  } else if (nearRange) {
    score += 20;
  }

  // IELTS: 30 pts
  const studentIelts = ieltsToNumber(ieltsVal);
  if (studentIelts === 99) {
    score += 15;
  } else if (studentIelts >= course.ieltsMin) {
    score += 30;
  } else if (studentIelts >= course.ieltsMin - 0.5) {
    score += 15;
  }

  // Country: 20 pts
  if (countries.length === 0 || countries.includes(course.country)) {
    score += 20;
  }

  // QS Ranking: 10 pts
  const qs = course.qsRanking;
  if (qs <= 10) score += 10;
  else if (qs <= 50) score += 8;
  else if (qs <= 100) score += 6;
  else if (qs <= 200) score += 4;
  else score += 2;

  return score;
}

function matchPercent(score: number): number {
  return Math.min(99, Math.round((score / 100) * 100));
}

function badgeColor(pct: number): string {
  if (pct >= 80) return 'bg-green-100 text-green-700 border-green-200';
  if (pct >= 60) return 'bg-blue-100 text-blue-700 border-blue-200';
  if (pct >= 40) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  return 'bg-gray-100 text-gray-600 border-gray-200';
}

function formatINR(inr: number): string {
  if (inr < 100000) return `₹${Math.round(inr / 1000)}K`;
  const lakhs = inr / 100000;
  return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`;
}

interface FormState {
  field: string;
  countries: string[];
  budget: string;
  ielts: string;
  qualification: string;
}

interface LeadState {
  name: string;
  phone: string;
  submitted: boolean;
  submitting: boolean;
}

export default function CourseMatcherClient() {
  const [form, setForm] = useState<FormState>({
    field: '',
    countries: [],
    budget: '',
    ielts: '',
    qualification: '',
  });
  const [searched, setSearched] = useState(false);
  const [lead, setLead] = useState<LeadState>({ name: '', phone: '', submitted: false, submitting: false });

  const results = useMemo(() => {
    if (!searched || !form.field || !form.budget || !form.ielts) return [];

    const filtered = courseIndex.filter(c =>
      c.fields.includes(form.field) &&
      (form.countries.length === 0 || form.countries.includes(c.country))
    );

    return filtered
      .map(c => ({ ...c, score: scoreCourse(c, form.budget, form.countries, form.ielts) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [searched, form]);

  const canSearch = Boolean(form.field && form.budget && form.ielts && form.qualification);

  function toggleCountry(c: string) {
    setForm(prev => ({
      ...prev,
      countries: prev.countries.includes(c)
        ? prev.countries.filter(x => x !== c)
        : [...prev.countries, c],
    }));
  }

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!lead.name || !lead.phone) return;
    setLead(prev => ({ ...prev, submitting: true }));

    const topMatches = results.slice(0, 3)
      .map(r => `${r.courseName} at ${r.universityName} (${matchPercent(r.score)}% match)`)
      .join('; ');

    try {
      await fetch('https://formspree.io/f/xgoqzezk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: lead.name,
          phone: lead.phone,
          field: form.field,
          countries: form.countries.join(', ') || 'Any',
          budget: form.budget,
          ielts: form.ielts,
          qualification: form.qualification,
          topMatches,
          source: 'AI Course Matcher',
        }),
      });
      setLead(prev => ({ ...prev, submitted: true, submitting: false }));
      const msg = encodeURIComponent(
        `Hi Gaurav! I used the AI Course Matcher on Jaivik Overseas. My top match is ${results[0]?.courseName} at ${results[0]?.universityName}. I'd love a free counselling session. My name is ${lead.name}.`
      );
      window.open(`https://wa.me/919971226347?text=${msg}`, '_blank');
    } catch {
      setLead(prev => ({ ...prev, submitting: false }));
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* Profile Form Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-700 rounded-xl flex items-center justify-center text-white font-bold text-lg">AI</div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Your Study Abroad Profile</h2>
            <p className="text-sm text-gray-500">Answer 5 questions — get your top course matches instantly</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Field of Interest */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Field of Interest <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {FIELDS.map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, field: f }))}
                  className={`text-xs px-2 py-2 rounded-lg border transition-all font-medium text-center ${
                    form.field === f
                      ? 'bg-brand-700 text-white border-brand-700'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300 hover:text-brand-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Target Countries */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Target Country{' '}
              <span className="text-xs font-normal text-gray-400">(optional — select multiple or leave blank for all)</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {COUNTRIES.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCountry(c)}
                  className={`text-xs px-2 py-2 rounded-lg border transition-all font-medium flex items-center justify-center gap-1 ${
                    form.countries.includes(c)
                      ? 'bg-brand-700 text-white border-brand-700'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300 hover:text-brand-700'
                  }`}
                >
                  <span>{COUNTRY_FLAGS[c]}</span>
                  <span>{c === 'New Zealand' ? 'NZ' : c}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Budget / IELTS / Qualification */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Budget / Year (INR) <span className="text-red-500">*</span>
              </label>
              <select
                value={form.budget}
                onChange={e => setForm(prev => ({ ...prev, budget: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="">Select budget</option>
                {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                IELTS Score <span className="text-red-500">*</span>
              </label>
              <select
                value={form.ielts}
                onChange={e => setForm(prev => ({ ...prev, ielts: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="">Select IELTS</option>
                {IELTS_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Qualification <span className="text-red-500">*</span>
              </label>
              <select
                value={form.qualification}
                onChange={e => setForm(prev => ({ ...prev, qualification: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="">Select qualification</option>
                {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
          </div>

          {/* CTA Button */}
          <button
            type="button"
            disabled={!canSearch}
            onClick={() => setSearched(true)}
            className={`w-full py-3.5 rounded-xl font-bold text-base transition-all ${
              canSearch
                ? 'bg-brand-700 hover:bg-brand-800 text-white shadow-lg shadow-brand-200/50 cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {searched ? '🔄 Update My Matches' : '🎯 Find My Best Course Matches'}
          </button>
        </div>
      </div>

      {/* Results */}
      {searched && (
        <div>
          {results.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
              <p className="text-yellow-700 font-semibold mb-2">No exact matches found for your selection</p>
              <p className="text-sm text-yellow-600 mb-4">
                Try deselecting specific countries, or book a free counselling session — Gaurav will find the right fit personally.
              </p>
              <a
                href="https://wa.me/919971226347"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors"
              >
                💬 WhatsApp Gaurav Now
              </a>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Your Top {results.length} Matches
                  <span className="ml-2 text-sm font-normal text-gray-500">for {form.field}</span>
                </h2>
                <span className="hidden sm:inline text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                  Ranked by budget · IELTS · QS ranking
                </span>
              </div>

              <div className="space-y-3 mb-10">
                {results.map((course, idx) => {
                  const pct = matchPercent(course.score);
                  const courseUrl = `/universities/${course.uniSlug}/courses/${course.courseSlug}`;

                  return (
                    <div
                      key={course.id}
                      className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-brand-200 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        {/* Rank */}
                        <div className="flex-shrink-0 w-8 h-8 bg-brand-50 rounded-full flex items-center justify-center text-brand-700 font-bold text-sm">
                          {idx + 1}
                        </div>

                        {/* Course info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 text-sm leading-snug">{course.courseName}</h3>
                            <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full border ${badgeColor(pct)}`}>
                              {pct}% match
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {course.flag} {course.universityName} &middot; {course.city}, {course.country}
                            {course.qsRanking <= 200 && (
                              <span className="ml-2 text-amber-600 font-semibold">QS #{course.qsRanking}</span>
                            )}
                          </p>
                        </div>

                        {/* Fee + IELTS */}
                        <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-0.5 flex-shrink-0">
                          <p className="text-sm font-bold text-brand-700">{formatINR(course.annualINR)}/yr</p>
                          <p className="text-xs text-gray-400">IELTS {course.ieltsMin}+</p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 flex-shrink-0">
                          <Link
                            href={courseUrl}
                            className="text-xs bg-brand-700 text-white px-3 py-2 rounded-lg font-semibold hover:bg-brand-800 transition-colors whitespace-nowrap"
                          >
                            View Course →
                          </Link>
                          <a
                            href="https://wa.me/919971226347"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-green-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors whitespace-nowrap"
                          >
                            Book Counselling
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Lead Capture Banner */}
              <div className="bg-gradient-to-br from-brand-700 to-brand-900 rounded-2xl p-6 md:p-8 text-white">
                <div className="max-w-lg mx-auto text-center">
                  <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">👨‍💼</div>
                  <h3 className="text-xl font-bold mb-1">
                    Want Gaurav Katyal to personally review your matches?
                  </h3>
                  <p className="text-blue-200 text-sm mb-5">
                    13 years experience · 500+ students placed · Completely free
                  </p>

                  {lead.submitted ? (
                    <div className="bg-white/10 rounded-xl p-5 text-center">
                      <p className="text-xl font-bold mb-1">🎉 Thanks, {lead.name}!</p>
                      <p className="text-blue-200 text-sm">
                        WhatsApp opened — Gaurav will reply within a few hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleLeadSubmit} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Your Name"
                          required
                          value={lead.name}
                          onChange={e => setLead(prev => ({ ...prev, name: e.target.value }))}
                          className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
                        />
                        <input
                          type="tel"
                          placeholder="Phone / WhatsApp Number"
                          required
                          value={lead.phone}
                          onChange={e => setLead(prev => ({ ...prev, phone: e.target.value }))}
                          className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={lead.submitting}
                        className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60"
                      >
                        {lead.submitting ? 'Sending...' : '💬 Book Free Counselling with Gaurav Katyal'}
                      </button>
                      <p className="text-xs text-blue-300">
                        Zero spam · WhatsApp only · 100% free
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Info tiles shown before search */}
      {!searched && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          {[
            { icon: '🎯', title: '170+ Courses', desc: 'Curated across 12 top universities' },
            { icon: '⚡', title: 'Instant Matches', desc: 'Scored by budget, IELTS & QS rank' },
            { icon: '🆓', title: '100% Free', desc: 'No signup required to see results' },
          ].map(item => (
            <div key={item.title} className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
