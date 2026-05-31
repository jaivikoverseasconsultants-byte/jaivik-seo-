'use client';

import { useState } from 'react';

const FORMSPREE = 'https://formspree.io/f/xgoqzezk';

const COUNTRIES_OF_EDUCATION = [
  'India','Bangladesh','Nepal','Sri Lanka','Pakistan','Nigeria','Kenya','UAE','Philippines','Vietnam','Indonesia','Other',
];
const EDUCATION_LEVELS = ['High School / 10+2','Diploma','Bachelor\'s Degree','Postgraduate / Master\'s','PhD','Other'];
const DESTINATIONS = ['USA','UK','Canada','Australia','Germany','Ireland','Singapore','New Zealand','France','Netherlands','Sweden','UAE','Denmark','Italy','Spain'];
const STUDY_AREAS = [
  'Computer Science & IT','Business & Management','Engineering','Health Sciences',
  'Law & Social Sciences','Sciences','Arts & Humanities','Architecture & Design','Education',
];
const STUDY_LEVELS = ['Undergraduate (UG)','Postgraduate / Master\'s (PG)','PhD / Doctoral','Diploma','Pathway / Foundation','Online','Hybrid'];
const PROGRAM_LABELS = ['Co-op / Work Integrated','Full Scholarship Available','No GRE Required','MOI Accepted','Fast Offer Letter','Affordable Tuition','PR-Friendly','High Employment Rate'];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'new' | 'existing';
}

export default function RequestProgramModal({ isOpen, onClose, defaultType = 'new' }: Props) {
  const [enquiryType, setEnquiryType] = useState<'new'|'existing'>(defaultType);
  const [form, setForm] = useState({
    firstName: '', middleName: '', lastName: '',
    countryOfEducation: '', educationLevel: '', studentId: '',
  });
  const [destinations, setDestinations] = useState<string[]>([]);
  const [studyAreas, setStudyAreas] = useState<string[]>([]);
  const [studyLevels, setStudyLevels] = useState<string[]>([]);
  const [programLabels, setProgramLabels] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle'|'submitting'|'done'>('idle');

  if (!isOpen) return null;

  function handle(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  }

  function toggleArr<T>(arr: T[], setArr: (v: T[]) => void, val: T, max: number) {
    if (arr.includes(val)) setArr(arr.filter(v => v !== val));
    else if (arr.length < max) setArr([...arr, val]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await fetch(FORMSPREE, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Program Options Request – ${form.firstName} ${form.lastName} | ${enquiryType === 'new' ? 'New Student' : 'Existing Student'}`,
          'Enquiry Type': enquiryType === 'new' ? 'New Student' : 'Existing Student',
          'Student ID': form.studentId || '—',
          'Name': `${form.firstName} ${form.middleName} ${form.lastName}`.trim(),
          'Country of Education': form.countryOfEducation,
          'Highest Education': form.educationLevel,
          'Destinations': destinations.join(', '),
          'Study Areas': studyAreas.join(', '),
          'Study Levels': studyLevels.join(', '),
          'Program Labels': programLabels.join(', '),
          Source: 'request-program-modal',
          'Submitted At': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        }),
      });
    } catch { /* ignore */ }
    setStatus('done');
    setTimeout(() => { window.location.href = '/thank-you'; }, 800);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-700 to-blue-800 text-white px-6 pt-5 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Request Program Options</h2>
              <p className="text-blue-200 text-xs mt-0.5">Our counsellors will match you with the best programs</p>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white text-2xl font-bold leading-none">×</button>
          </div>
        </div>

        {/* Body */}
        {status === 'done' ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
            <p className="text-4xl mb-3">🎯</p>
            <p className="font-bold text-gray-800 text-lg">Request Submitted!</p>
            <p className="text-gray-500 text-sm mt-1">Redirecting you to WhatsApp…</p>
          </div>
        ) : (
          <form onSubmit={submit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Enquiry Type */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Enquiry Type *</label>
              <div className="grid grid-cols-2 gap-3">
                {(['new','existing'] as const).map(t => (
                  <button type="button" key={t} onClick={() => setEnquiryType(t)}
                    className={`p-3 rounded-xl border text-sm font-semibold transition-all ${enquiryType === t ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300'}`}>
                    {t === 'new' ? '🆕 New Student' : '👤 Existing Student'}
                  </button>
                ))}
              </div>
            </div>

            {/* Existing student ID */}
            {enquiryType === 'existing' && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Student ID</label>
                <input name="studentId" value={form.studentId} onChange={handle} placeholder="e.g. JO-2026-001234" className="input-field" />
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name *</label>
              <div className="grid grid-cols-3 gap-2">
                <input name="firstName" required value={form.firstName} onChange={handle} placeholder="First *" className="input-field" />
                <input name="middleName" value={form.middleName} onChange={handle} placeholder="Middle" className="input-field" />
                <input name="lastName" required value={form.lastName} onChange={handle} placeholder="Last *" className="input-field" />
              </div>
            </div>

            {/* Country of Education */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Country of Education *</label>
                <select name="countryOfEducation" required value={form.countryOfEducation} onChange={handle} className="input-field">
                  <option value="">Select country</option>
                  {COUNTRIES_OF_EDUCATION.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Highest Education *</label>
                <select name="educationLevel" required value={form.educationLevel} onChange={handle} className="input-field">
                  <option value="">Select level</option>
                  {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Study Abroad Destination
                <span className="text-gray-400 font-normal ml-1">(select up to 3)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {DESTINATIONS.map(d => (
                  <button type="button" key={d} onClick={() => toggleArr(destinations, setDestinations, d, 3)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${destinations.includes(d) ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Study Area */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Preferred Study Area
                <span className="text-gray-400 font-normal ml-1">(max 3)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {STUDY_AREAS.map(a => (
                  <button type="button" key={a} onClick={() => toggleArr(studyAreas, setStudyAreas, a, 3)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${studyAreas.includes(a) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Study Level */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Preferred Study Level
                <span className="text-gray-400 font-normal ml-1">(max 3)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {STUDY_LEVELS.map(l => (
                  <button type="button" key={l} onClick={() => toggleArr(studyLevels, setStudyLevels, l, 3)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${studyLevels.includes(l) ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Program Labels */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Program Labels
                <span className="text-gray-400 font-normal ml-1">(optional, max 3)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {PROGRAM_LABELS.map(l => (
                  <button type="button" key={l} onClick={() => toggleArr(programLabels, setProgramLabels, l, 3)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${programLabels.includes(l) ? 'bg-gold-500 text-white border-gold-500' : 'bg-white text-gray-600 border-gray-200 hover:border-gold-300'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 pb-2">
              <button type="submit" disabled={status === 'submitting'}
                className="w-full btn-gold text-center py-3.5 text-base disabled:opacity-60">
                {status === 'submitting' ? 'Submitting…' : '🎯 Request Program Options →'}
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">Free consultation · No spam · Our team responds in 2 hours</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
