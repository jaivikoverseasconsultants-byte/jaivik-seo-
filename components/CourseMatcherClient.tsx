'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { courseIndex, CourseEntry } from '@/data/course-index';

// ── Constants ─────────────────────────────────────────────────────────────────

const FIELDS = ['Computer Science', 'MBA', 'Data Science', 'Nursing', 'Engineering', 'Law', 'Psychology', 'Finance', 'Other'] as const;
const COUNTRIES = ['Canada', 'UK', 'Australia', 'Germany', 'Ireland', 'Singapore', 'New Zealand', 'Netherlands', 'UAE', 'France'] as const;
const BUDGETS = ['Under 20L', '20-40L', '40-60L', '60-80L', 'Above 80L'] as const;
const IELTS_OPTIONS = ['Below 6', '6.0', '6.5', '7.0', '7.5+', 'Not given yet'] as const;
const QUALIFICATIONS = ['12th Pass', "Bachelor's", "Master's", 'Working Professional'] as const;

const COUNTRY_FLAGS: Record<string, string> = {
  Canada: '🇨🇦', UK: '🇬🇧', Australia: '🇦🇺', Germany: '🇩🇪',
  Ireland: '🇮🇪', Singapore: '🇸🇬', 'New Zealand': '🇳🇿',
  Netherlands: '🇳🇱', UAE: '🇦🇪', France: '🇫🇷', USA: '🇺🇸',
};

// ── Scoring ───────────────────────────────────────────────────────────────────

function ieltsToNumber(val: string): number {
  if (val === 'Below 6') return 5.5;
  if (val === '7.5+') return 7.5;
  if (val === 'Not given yet') return 99;
  return parseFloat(val);
}

function budgetMaxINR(val: string): number {
  switch (val) {
    case 'Under 20L': return 2_000_000;
    case '20-40L':   return 4_000_000;
    case '40-60L':   return 6_000_000;
    case '60-80L':   return 8_000_000;
    default:         return Infinity;
  }
}

function scoreCourse(
  course: CourseEntry,
  budget: string,
  countries: string[],
  ieltsVal: string,
): number {
  let score = 0;

  // Budget: 40 pts within budget, 20 pts within 20% over, 0 otherwise
  if (budget === 'Above 80L') {
    score += 40;
  } else {
    const max = budgetMaxINR(budget);
    if (course.annualINR <= max) score += 40;
    else if (course.annualINR <= max * 1.2) score += 20;
  }

  // IELTS: 15 pts not given yet, 30 pts meets requirement, 0 pts below
  const studentIelts = ieltsToNumber(ieltsVal);
  if (studentIelts === 99) score += 15;
  else if (studentIelts >= course.ieltsMin) score += 30;

  // Country: 20 pts if country in selection (or no preference)
  if (countries.length === 0 || countries.includes(course.country)) score += 20;

  // QS rank: <200 = 10 pts, <500 = 5 pts, unranked/0 = 0 pts
  if (course.qsRanking > 0 && course.qsRanking < 200) score += 10;
  else if (course.qsRanking > 0 && course.qsRanking < 500) score += 5;

  return score; // max 100
}

function matchPercent(score: number): number {
  return Math.min(99, score);
}

function badgeColor(pct: number): string {
  if (pct >= 80) return 'bg-green-100 text-green-700 border-green-200';
  if (pct >= 60) return 'bg-blue-100 text-blue-700 border-blue-200';
  if (pct >= 40) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  return 'bg-gray-100 text-gray-600 border-gray-200';
}

function formatINR(inr: number): string {
  if (inr < 100_000) return `₹${Math.round(inr / 1000)}K`;
  const lakhs = inr / 100_000;
  return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`;
}

function downloadCSV(courses: (CourseEntry & { score: number })[], studentName: string) {
  const headers = ['Rank', 'Course', 'University', 'City', 'Country', 'Annual Fee (INR)', 'IELTS Min', 'QS Ranking', 'Match %'];
  const rows = courses.map((c, i) => [
    String(i + 1),
    c.courseName,
    c.universityName,
    c.city,
    c.country,
    formatINR(c.annualINR),
    String(c.ieltsMin),
    c.qsRanking > 0 ? `#${c.qsRanking}` : 'Unranked',
    `${matchPercent(c.score)}%`,
  ]);
  const csv = [headers, ...rows]
    .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `jaivik-course-matches-${(studentName || 'student').replace(/\s+/g, '-').toLowerCase()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormState {
  field: string;
  countries: string[];
  budget: string;
  ielts: string;
  qualification: string;
}

interface LeadInfo {
  name: string;
  mobile: string;
  email: string;
}

type Phase = 'wizard' | 'lead-gate' | 'results';

// ── Component ─────────────────────────────────────────────────────────────────

export default function CourseMatcherClient() {
  const [form, setForm] = useState<FormState>({
    field: '', countries: [], budget: '', ielts: '', qualification: '',
  });
  const [phase, setPhase] = useState<Phase>('wizard');
  const [leadInfo, setLeadInfo] = useState<LeadInfo>({ name: '', mobile: '', email: '' });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // ── Scored + diversified results ─────────────────────────────────────────────
  const results = useMemo(() => {
    if (phase !== 'results' || !form.field || !form.budget || !form.ielts) return [];

    const scored = courseIndex
      .filter(c => form.field === 'Other' || c.fields.includes(form.field))
      .map(c => ({ ...c, score: scoreCourse(c, form.budget, form.countries, form.ielts) }))
      .sort((a, b) => b.score - a.score);

    // Max 2 courses per university in top 10
    const top: typeof scored = [];
    const uniCount: Record<string, number> = {};
    for (const c of scored) {
      const n = uniCount[c.uniSlug] ?? 0;
      if (n < 2) {
        top.push(c);
        uniCount[c.uniSlug] = n + 1;
      }
      if (top.length >= 10) break;
    }
    return top;
  }, [phase, form]);

  const canSearch = Boolean(form.field && form.budget && form.ielts && form.qualification);
  const selectedCourses = results.filter(r => selected.has(r.id));

  function toggleCountry(c: string) {
    setForm(prev => ({
      ...prev,
      countries: prev.countries.includes(c)
        ? prev.countries.filter(x => x !== c)
        : [...prev.countries, c],
    }));
  }

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function handleWizardSubmit() {
    if (!canSearch) return;
    if (phase === 'results') {
      // Already got lead info — just refresh results and clear selections
      setSelected(new Set());
    } else {
      setPhase('lead-gate');
    }
  }

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLeadSubmitting(true);
    try {
      await fetch('/api/course-matcher/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadInfo.name,
          mobile: leadInfo.mobile,
          email: leadInfo.email,
          field: form.field,
          countries: form.countries.join(', ') || 'Any',
          budget: form.budget,
          ielts: form.ielts,
          qualification: form.qualification,
        }),
      });
    } catch {
      // Proceed regardless
    }
    setLeadSubmitting(false);
    setPhase('results');
  }

  function handleEmailCourses() {
    if (selectedCourses.length === 0) return;
    const lines = selectedCourses
      .map((c, i) => `${i + 1}. ${c.courseName} – ${c.universityName}, ${c.country} | ${formatINR(c.annualINR)}/yr | IELTS ${c.ieltsMin}+`)
      .join('\n');
    const subject = encodeURIComponent('My Course Shortlist – Jaivik Overseas');
    const body = encodeURIComponent(
      `Hi Jaivik Overseas Team,\n\nI used your AI Course Matcher and shortlisted the following courses:\n\n${lines}\n\nPlease help me with the next steps.\n\nName: ${leadInfo.name}\nMobile: ${leadInfo.mobile}\nEmail: ${leadInfo.email}`
    );
    window.location.href = `mailto:enquiry@jaivikoverseasconsultants.com?subject=${subject}&body=${body}`;
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* ── Wizard card ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-700 rounded-xl flex items-center justify-center text-white font-bold text-lg">AI</div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Your Study Abroad Profile</h2>
            <p className="text-sm text-gray-500">Answer 5 questions — get your top course matches instantly</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Field of Interest <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {FIELDS.map(f => (
                <button key={f} type="button" onClick={() => setForm(prev => ({ ...prev, field: f }))}
                  className={`text-xs px-2 py-2 rounded-lg border transition-all font-medium text-center ${
                    form.field === f
                      ? 'bg-brand-700 text-white border-brand-700'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300 hover:text-brand-700'
                  }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Countries */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Target Country{' '}
              <span className="text-xs font-normal text-gray-500">(optional — select multiple or leave blank for all)</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {COUNTRIES.map(c => (
                <button key={c} type="button" onClick={() => toggleCountry(c)}
                  className={`text-xs px-2 py-2 rounded-lg border transition-all font-medium flex items-center justify-center gap-1 ${
                    form.countries.includes(c)
                      ? 'bg-brand-700 text-white border-brand-700'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300 hover:text-brand-700'
                  }`}>
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
              <select value={form.budget} onChange={e => setForm(prev => ({ ...prev, budget: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                <option value="">Select budget</option>
                {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                IELTS Score <span className="text-red-500">*</span>
              </label>
              <select value={form.ielts} onChange={e => setForm(prev => ({ ...prev, ielts: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                <option value="">Select IELTS</option>
                {IELTS_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Qualification <span className="text-red-500">*</span>
              </label>
              <select value={form.qualification} onChange={e => setForm(prev => ({ ...prev, qualification: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                <option value="">Select qualification</option>
                {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
          </div>

          {/* Submit */}
          <button type="button" disabled={!canSearch} onClick={handleWizardSubmit}
            className={`w-full py-3.5 rounded-xl font-bold text-base transition-all ${
              canSearch
                ? 'bg-brand-700 hover:bg-brand-800 text-white shadow-lg shadow-brand-200/50 cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}>
            {phase === 'results' ? '🔄 Update My Matches' : '🎯 Find My Best Course Matches'}
          </button>
        </div>
      </div>

      {/* ── Lead gate ────────────────────────────────────────────────────────── */}
      {phase === 'lead-gate' && (
        <div className="bg-white rounded-2xl shadow-lg border border-brand-100 p-6 md:p-10 mb-8">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🎓</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Almost there!</h2>
            <p className="text-gray-500 text-sm mb-6">
              Enter your details to unlock your personalised course matches — free, no spam.
            </p>

            <form onSubmit={handleLeadSubmit} className="space-y-3 text-left">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input type="text" required placeholder="e.g. Rahul Sharma"
                  value={leadInfo.name} onChange={e => setLeadInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input type="tel" required placeholder="e.g. 9876543210"
                  value={leadInfo.mobile} onChange={e => setLeadInfo(prev => ({ ...prev, mobile: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input type="email" required placeholder="e.g. rahul@email.com"
                  value={leadInfo.email} onChange={e => setLeadInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <button type="submit" disabled={leadSubmitting}
                className="w-full bg-brand-700 hover:bg-brand-800 text-white font-bold py-3.5 rounded-xl transition-colors text-base disabled:opacity-60">
                {leadSubmitting ? 'Please wait...' : 'Unlock Your Matches →'}
              </button>
              <p className="text-center text-xs text-gray-600 pt-1">
                Your data is secure · No spam · We contact you only if you want counselling
              </p>
            </form>
          </div>
        </div>
      )}

      {/* ── Results ──────────────────────────────────────────────────────────── */}
      {phase === 'results' && (
        <div>
          {results.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
              <p className="text-yellow-700 font-semibold mb-2">No exact matches found for your selection</p>
              <p className="text-sm text-yellow-600 mb-4">
                Try deselecting specific countries, or book a free counselling session — Gaurav will find the right fit personally.
              </p>
              <a href="https://wa.me/919971226347" target="_blank" rel="noopener noreferrer"
                className="inline-block bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors">
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
                <span className="hidden sm:inline text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                  Ranked by budget · IELTS · QS ranking
                </span>
              </div>

              <p className="text-xs text-gray-600 mb-3">Select courses below to download or email your shortlist.</p>

              <div className="space-y-3 mb-10">
                {results.map((course, idx) => {
                  const pct = matchPercent(course.score);
                  const courseUrl = `/universities/${course.uniSlug}/courses/${course.courseSlug}`;
                  const isChecked = selected.has(course.id);
                  const flag = COUNTRY_FLAGS[course.country] ?? course.flag;

                  return (
                    <div key={course.id}
                      className={`bg-white rounded-xl border p-4 hover:shadow-md transition-all course-card ${
                        isChecked ? 'border-brand-400 ring-1 ring-brand-200' : 'border-gray-100 hover:border-brand-200'
                      }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">

                        {/* Checkbox */}
                        <label className="flex-shrink-0 cursor-pointer" title="Select for download">
                          <input type="checkbox" checked={isChecked} onChange={() => toggleSelect(course.id)}
                            className="w-4 h-4 rounded border-gray-300 text-brand-700 cursor-pointer" />
                        </label>

                        {/* Rank badge */}
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
                            {flag} {course.universityName} &middot; {course.city}, {course.country}
                            {course.qsRanking > 0 && course.qsRanking <= 500 && (
                              <span className="ml-2 text-amber-600 font-semibold">QS #{course.qsRanking}</span>
                            )}
                          </p>
                        </div>

                        {/* Fee + IELTS */}
                        <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-0.5 flex-shrink-0">
                          <p className="text-sm font-bold text-brand-700">{formatINR(course.annualINR)}/yr</p>
                          <p className="text-xs text-gray-600">IELTS {course.ieltsMin}+</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 flex-shrink-0">
                          <Link href={courseUrl}
                            className="text-xs bg-brand-700 text-white px-3 py-2 rounded-lg font-semibold hover:bg-brand-800 transition-colors whitespace-nowrap">
                            View Course →
                          </Link>
                          <a href="https://wa.me/919971226347" target="_blank" rel="noopener noreferrer"
                            className="text-xs bg-green-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors whitespace-nowrap">
                            Book Counselling
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Counselling CTA */}
              <div className="bg-gradient-to-br from-brand-700 to-brand-900 rounded-2xl p-6 md:p-8 text-white mb-24">
                <div className="max-w-lg mx-auto text-center">
                  <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">👨‍💼</div>
                  <h3 className="text-xl font-bold mb-1">Want Gaurav Katyal to personally review your matches?</h3>
                  <p className="text-blue-200 text-sm mb-5">13 years experience · 500+ students placed · Completely free</p>
                  <a href="https://wa.me/919971226347" target="_blank" rel="noopener noreferrer"
                    className="inline-block bg-gold-500 hover:bg-gold-600 text-white font-bold px-8 py-3 rounded-xl transition-colors">
                    💬 Book Free Counselling with Gaurav Katyal
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Info tiles (pre-search) ──────────────────────────────────────────── */}
      {phase === 'wizard' && (
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

      {/* ── Sticky selection bar ─────────────────────────────────────────────── */}
      {selected.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
          <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm font-semibold text-gray-700">
              {selected.size} course{selected.size !== 1 ? 's' : ''} selected
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadCSV(selectedCourses, leadInfo.name)}
                className="flex items-center gap-1.5 bg-brand-700 hover:bg-brand-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
                ⬇ Download Selected (Excel)
              </button>
              <button
                onClick={handleEmailCourses}
                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
                ✉ Email My Courses
              </button>
              <button
                onClick={() => setSelected(new Set())}
                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-2">
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
