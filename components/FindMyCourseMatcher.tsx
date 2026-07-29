'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  matchCourses, uniqueUniversityCount, formatStudyGap,
  SUBJECT_OPTIONS, BUDGET_BANDS, IELTS_OPTIONS, COUNTRY_OPTIONS,
  type MatchProfile, type MatchedCourse, type DegreeLevel,
} from '@/lib/find-my-course';
import { trackEvent } from '@/lib/analytics';
import { generateShortlistPdf, type ProfileSummaryForPdf } from '@/lib/generate-shortlist-pdf';

const FREE_RESULTS_COUNT = 3;
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xgoqzezk';

type Phase = 'form' | 'results';

const DEFAULT_PROFILE: MatchProfile = {
  countries: [], level: '', subject: 'any', budget: '20l', ielts: '',
  percentage: '', backlogs: 'no', studyGapYears: '', studyGapMonths: '',
};

function courseKey(c: { universitySlug: string; slug: string }): string {
  return `${c.universitySlug}::${c.slug}`;
}

function formatFee(inr: number): string {
  return `₹${(inr / 100000).toFixed(1)}L`;
}

export default function FindMyCourseMatcher() {
  const [phase, setPhase] = useState<Phase>('form');
  const [profile, setProfile] = useState<MatchProfile>(DEFAULT_PROFILE);
  const [unlocked, setUnlocked] = useState(false);
  const [unlockForm, setUnlockForm] = useState({ name: '', phone: '', email: '' });
  const [unlockStatus, setUnlockStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  const matches = useMemo(() => (phase === 'results' ? matchCourses(profile) : []), [phase, profile]);
  const uniCount = useMemo(() => uniqueUniversityCount(matches), [matches]);
  const freeResults = matches.slice(0, FREE_RESULTS_COUNT);
  const lockedResults = matches.slice(FREE_RESULTS_COUNT);
  const hasLocked = lockedResults.length > 0;

  const subjectLabel = SUBJECT_OPTIONS.find(s => s.value === profile.subject)?.label ?? profile.subject;
  const budgetLabel = BUDGET_BANDS.find(b => b.value === profile.budget)?.label ?? profile.budget;
  const gapLabel = formatStudyGap(profile.studyGapYears, profile.studyGapMonths);

  const canSearch = Boolean(profile.level && profile.subject);

  function toggleCountry(c: string) {
    setProfile(prev => ({
      ...prev,
      countries: prev.countries.includes(c) ? prev.countries.filter(x => x !== c) : [...prev.countries, c],
    }));
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!canSearch) return;
    setUnlocked(false);
    setSelected(new Set());
    setPhase('results');
  }

  function toggleSelected(key: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
    setPdfError(false);
  }

  function selectAll() {
    setSelected(new Set(matches.map(courseKey)));
    setPdfError(false);
  }

  function clearSelection() {
    setSelected(new Set());
  }

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (!unlockForm.name.trim() || unlockForm.phone.replace(/\D/g, '').length < 10) return;
    setUnlockStatus('submitting');

    const matchedUniversityNames = Array.from(new Set(matches.map(m => m.universityName)));

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Find My Course unlock — ${matches.length} matches (${subjectLabel})`,
          _replyto: unlockForm.email || 'find-my-course-lead@jaivikoverseasconsultants.com',
          name: unlockForm.name,
          phone: unlockForm.phone,
          email: unlockForm.email || 'Not given',
          'Target Countries': profile.countries.join(', ') || 'Any',
          'Degree Level': profile.level === 'bachelor' ? "Bachelor's" : profile.level === 'master' ? "Master's" : 'Not given',
          Subject: subjectLabel,
          Budget: budgetLabel,
          'IELTS Band': profile.ielts || 'Not given',
          'Academic % / GPA': profile.percentage || 'Not given',
          Backlogs: profile.backlogs,
          'Study Gap': gapLabel,
          'Match Count': matches.length,
          'University Count': uniCount,
          'Matched Universities': matchedUniversityNames.slice(0, 25).join(', '),
          'Source Page': 'find-my-course',
          'Page Path': typeof window !== 'undefined' ? window.location.pathname : '',
        }),
      });

      if (!res.ok) {
        setUnlockStatus('error');
        return;
      }

      trackEvent('find_my_course_unlock', {
        country: profile.countries.join(',') || 'Any',
        level: profile.level,
        subject: profile.subject,
        budget: profile.budget,
        ielts: profile.ielts || 'Not given',
        study_gap: gapLabel,
        match_count: String(matches.length),
        university_count: String(uniCount),
      });

      setUnlockStatus('idle');
      setUnlocked(true);
    } catch {
      setUnlockStatus('error');
    }
  }

  async function handleDownloadPdf() {
    const selectedCourses = matches.filter(c => selected.has(courseKey(c)));
    if (selectedCourses.length === 0) {
      setPdfError(true);
      return;
    }
    setPdfError(false);
    setPdfGenerating(true);

    const summary: ProfileSummaryForPdf = {
      countries: profile.countries.join(', ') || 'Any',
      level: profile.level === 'bachelor' ? "Bachelor's" : profile.level === 'master' ? "Master's" : 'Not given',
      subject: subjectLabel,
      budget: budgetLabel,
      ielts: profile.ielts || 'Not given',
      percentage: profile.percentage || 'Not given',
      backlogs: profile.backlogs === 'no' ? 'None' : profile.backlogs,
      studyGap: gapLabel,
    };

    try {
      await generateShortlistPdf(selectedCourses, unlockForm.name || 'student', summary);

      const selectedUniversityNames = Array.from(new Set(selectedCourses.map(c => c.universityName)));
      const selectedCourseNames = selectedCourses.map(c => `${c.name} (${c.universityName})`);

      trackEvent('shortlist_pdf_download', {
        selected_count: String(selectedCourses.length),
        selected_universities: selectedUniversityNames.join(', ').slice(0, 400),
      });

      fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Shortlist PDF downloaded — ${selectedCourses.length} courses selected`,
          _replyto: unlockForm.email || 'find-my-course-lead@jaivikoverseasconsultants.com',
          name: unlockForm.name || 'Not given',
          phone: unlockForm.phone || 'Not given',
          email: unlockForm.email || 'Not given',
          'Selected Course Count': selectedCourses.length,
          'Selected Universities': selectedUniversityNames.join(', '),
          'Selected Courses': selectedCourseNames.slice(0, 25).join(' | '),
          'Source Page': 'find-my-course',
          'Page Path': typeof window !== 'undefined' ? window.location.pathname : '',
          form_type: 'shortlist_pdf_download',
        }),
      }).catch(() => {});
    } finally {
      setPdfGenerating(false);
    }
  }

  // ── Form phase ──────────────────────────────────────────────────────────
  if (phase === 'form') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-10 h-10 bg-brand-700 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">🎯</div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Your Study Abroad Profile</h2>
              <p className="text-sm text-gray-500">Matched against our real, crawled course database — not estimates</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Target Country <span className="text-xs font-normal text-gray-500">(optional — leave blank for all)</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {COUNTRY_OPTIONS.map(c => (
                  <button key={c} type="button" onClick={() => toggleCountry(c)}
                    className={`text-xs px-2 py-2 rounded-lg border transition-all font-medium ${
                      profile.countries.includes(c)
                        ? 'bg-brand-700 text-white border-brand-700'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300 hover:text-brand-700'
                    }`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Degree Level <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['bachelor', 'master'] as DegreeLevel[]).map(l => (
                    <button key={l} type="button" onClick={() => setProfile(prev => ({ ...prev, level: l }))}
                      className={`text-sm px-3 py-2.5 rounded-lg border transition-all font-medium ${
                        profile.level === l
                          ? 'bg-brand-700 text-white border-brand-700'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300 hover:text-brand-700'
                      }`}>
                      {l === 'bachelor' ? "Bachelor's" : "Master's"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject / Field <span className="text-red-500">*</span>
                </label>
                <select value={profile.subject} onChange={e => setProfile(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                  {SUBJECT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Budget / Year (Tuition, INR)</label>
                <select value={profile.budget} onChange={e => setProfile(prev => ({ ...prev, budget: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                  {BUDGET_BANDS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">IELTS Band</label>
                <select value={profile.ielts} onChange={e => setProfile(prev => ({ ...prev, ielts: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                  <option value="">Select IELTS</option>
                  {IELTS_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Academic % / GPA</label>
                <input type="text" placeholder="e.g. 72% or 7.2 CGPA" value={profile.percentage}
                  onChange={e => setProfile(prev => ({ ...prev, percentage: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Backlogs</label>
                <select value={profile.backlogs} onChange={e => setProfile(prev => ({ ...prev, backlogs: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                  {['no', '1-2', '3-5', '5+'].map(b => <option key={b} value={b}>{b === 'no' ? 'None' : b}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Study Gap (if any)</label>
              <div className="grid grid-cols-2 gap-4 max-w-sm">
                <div>
                  <input type="number" min="0" max="20" placeholder="0" value={profile.studyGapYears}
                    onChange={e => setProfile(prev => ({ ...prev, studyGapYears: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  <p className="text-xs text-gray-400 mt-1">Years</p>
                </div>
                <div>
                  <input type="number" min="0" max="11" placeholder="0" value={profile.studyGapMonths}
                    onChange={e => setProfile(prev => ({ ...prev, studyGapMonths: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                  <p className="text-xs text-gray-400 mt-1">Months</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              Your % / GPA / backlogs / study gap help our counsellor review your final eligibility — they aren&apos;t used to
              filter results, since final admission decisions vary by university and aren&apos;t something we can honestly
              predict from this data alone.
            </p>

            <button type="submit" disabled={!canSearch}
              className={`w-full py-3.5 rounded-xl font-bold text-base transition-all ${
                canSearch
                  ? 'bg-brand-700 hover:bg-brand-800 text-white shadow-lg shadow-brand-200/50 cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}>
              🎯 Find My Course Matches
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Results phase ───────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => setPhase('form')} className="text-brand-700 text-sm font-medium hover:underline">← Edit my search</button>
      </div>

      {matches.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <p className="text-yellow-700 font-semibold mb-2">No exact matches found for your selection</p>
          <p className="text-sm text-yellow-600 mb-4">
            Try widening your country selection or budget, or ask a counsellor directly — Gaurav can check options this
            tool doesn&apos;t have real data for yet.
          </p>
          <a href="https://wa.me/919971226347" target="_blank" rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors">
            💬 WhatsApp Gaurav Now
          </a>
        </div>
      ) : (
        <>
          <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5 mb-7 text-center">
            <p className="text-2xl font-bold text-brand-700">{matches.length} course{matches.length !== 1 ? 's' : ''}</p>
            <p className="text-sm text-gray-600 mt-1">across {uniCount} real universit{uniCount !== 1 ? 'ies' : 'y'} match your profile</p>
            <div className="flex flex-wrap justify-center gap-1.5 mt-3">
              {[
                profile.countries.length > 0 ? profile.countries.join(', ') : 'Any country',
                profile.level === 'bachelor' ? "Bachelor's" : "Master's",
                subjectLabel,
                budgetLabel,
              ].map(tag => (
                <span key={tag} className="text-[11px] bg-white text-brand-700 border border-brand-200 px-2.5 py-1 rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {unlocked && matches.length > 0 && (
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="text-xs text-gray-500">{selected.size} selected · tick courses to include in your PDF</p>
              <div className="flex items-center gap-3">
                <button onClick={selectAll} className="text-xs font-semibold text-brand-700 hover:underline">Select all</button>
                <button onClick={clearSelection} className="text-xs font-semibold text-gray-500 hover:underline">Clear</button>
              </div>
            </div>
          )}

          <div className="space-y-3 mb-6">
            {freeResults.map((c, i) => (
              <MatchCard key={courseKey(c)} course={c} rank={i + 1}
                selectable={unlocked} selected={selected.has(courseKey(c))} onToggle={() => toggleSelected(courseKey(c))} />
            ))}
          </div>

          {hasLocked && (
            <div className="relative mb-8">
              <div className={`space-y-3 ${!unlocked ? 'blur-sm select-none pointer-events-none' : ''}`}>
                {lockedResults.map((c, i) => (
                  <MatchCard key={courseKey(c)} course={c} rank={FREE_RESULTS_COUNT + i + 1}
                    selectable={unlocked} selected={selected.has(courseKey(c))} onToggle={() => toggleSelected(courseKey(c))} />
                ))}
              </div>

              {!unlocked && (
                <div className="absolute inset-0 flex items-start justify-center pt-10">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8 w-full max-w-md mx-4">
                    <div className="text-center mb-5">
                      <div className="w-12 h-12 bg-brand-700 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">🔒</div>
                      <h3 className="font-bold text-lg text-brand-700">
                        Unlock All {matches.length} Matches
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Free — get your personalised shortlist, no spam.</p>
                    </div>
                    <form onSubmit={handleUnlock} className="space-y-3">
                      <input required placeholder="Full Name" value={unlockForm.name}
                        onChange={e => setUnlockForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700" />
                      <input required type="tel" placeholder="Phone / WhatsApp Number" value={unlockForm.phone}
                        onChange={e => setUnlockForm(f => ({ ...f, phone: e.target.value.replace(/[^\d+]/g, '') }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700" />
                      <input type="email" placeholder="Email (optional)" value={unlockForm.email}
                        onChange={e => setUnlockForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-700" />
                      {unlockStatus === 'error' && (
                        <p className="text-red-500 text-xs text-center">Something went wrong. Please try again, or WhatsApp us at +91-9971226347.</p>
                      )}
                      <button type="submit" disabled={unlockStatus === 'submitting'}
                        className="w-full bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-60">
                        {unlockStatus === 'submitting' ? 'Unlocking…' : `Unlock All ${matches.length} Matches →`}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {unlocked && (
            <div className="mb-8">
              {pdfError && (
                <p className="text-red-500 text-sm font-medium mb-2 text-center sm:text-left">
                  Please select at least one course before downloading.
                </p>
              )}
              <button onClick={handleDownloadPdf} disabled={pdfGenerating}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border-2 border-brand-700 text-brand-700 hover:bg-brand-50 font-bold px-6 py-3 rounded-xl transition-colors text-sm disabled:opacity-60">
                {pdfGenerating ? 'Generating…' : `📄 Download Shortlist as PDF (${selected.size} selected)`}
              </button>
            </div>
          )}

          <div className="bg-gradient-to-br from-brand-700 to-brand-900 rounded-2xl p-6 md:p-8 text-white text-center">
            <h3 className="text-xl font-bold mb-1">Want Gaurav to personally review your matches?</h3>
            <p className="text-blue-200 text-sm mb-5">13+ years experience · 1,400+ students placed · Completely free</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/book-counselling" className="btn-gold inline-block">Book Free Counselling →</Link>
              <a href="https://wa.me/919971226347" target="_blank" rel="noopener noreferrer"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors">
                💬 WhatsApp Gaurav
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MatchCard({ course, rank, selectable, selected, onToggle }: {
  course: MatchedCourse; rank: number; selectable: boolean; selected: boolean; onToggle: () => void;
}) {
  const courseUrl = `/universities/${course.universitySlug}/courses/${course.slug}`;
  return (
    <div className={`bg-white rounded-xl border p-4 transition-all ${
      selected ? 'border-brand-400 ring-1 ring-brand-200 shadow-sm' : 'border-gray-100 hover:border-brand-200 hover:shadow-sm'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {selectable && (
          <label className="flex-shrink-0 cursor-pointer" title="Select for PDF shortlist">
            <input type="checkbox" checked={selected} onChange={onToggle}
              className="w-4 h-4 rounded border-gray-300 text-brand-700 cursor-pointer" />
          </label>
        )}
        <div className="flex-shrink-0 w-8 h-8 bg-brand-50 rounded-full flex items-center justify-center text-brand-700 font-bold text-sm">
          {rank}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug">{course.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{course.universityName} · {course.country}</p>
        </div>
        <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-0.5 flex-shrink-0">
          <p className="text-sm font-bold text-brand-700">{formatFee(course.annualINR)}/yr</p>
          <p className={`text-xs ${course.ieltsVerified ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
            IELTS: {course.ieltsDisplay}
          </p>
        </div>
        <Link href={courseUrl}
          className="text-xs bg-brand-700 text-white px-3 py-2 rounded-lg font-semibold hover:bg-brand-800 transition-colors whitespace-nowrap flex-shrink-0">
          View Course →
        </Link>
      </div>
      {course.duration && (
        <p className="text-xs text-gray-400 mt-2.5 pt-2.5 border-t border-gray-50">Duration: {course.duration}</p>
      )}
    </div>
  );
}
