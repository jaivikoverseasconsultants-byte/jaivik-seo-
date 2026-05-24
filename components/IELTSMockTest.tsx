'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { passages, rawToReadingBand, calcWritingBand, calcOverallBand, estimateBandFromText } from '@/data/ielts-test';
import type { Question } from '@/data/ielts-test';

const FORMSPREE = 'https://formspree.io/f/xgoqzezk';

const CHART_DATA = [
  { year: '2018', Canada: 182, USA: 202, UK: 55, Australia: 73, Germany: 17 },
  { year: '2019', Canada: 226, USA: 233, UK: 70, Australia: 92, Germany: 21 },
  { year: '2020', Canada: 138, USA: 171, UK: 43, Australia: 48, Germany: 14 },
  { year: '2021', Canada: 273, USA: 179, UK: 89, Australia: 68, Germany: 29 },
  { year: '2022', Canada: 319, USA: 208, UK: 113, Australia: 98, Germany: 37 },
];
const BAR_COLORS = ['#1e3a5f', '#f59e0b', '#16a34a', '#7c3aed', '#dc2626'];

const COUNTRY_REQ = [
  { country: 'Canada', flag: '🇨🇦', min: 6.0 },
  { country: 'UK', flag: '🇬🇧', min: 6.5 },
  { country: 'Australia', flag: '🇦🇺', min: 6.0 },
  { country: 'Germany', flag: '🇩🇪', min: 6.0 },
];

type Phase = 'intro' | 'reading' | 'writing1' | 'writing2' | 'scoring' | 'blurred' | 'unlocked';

interface Scores {
  readingRaw: number;
  readingBand: number;
  task1Band: number;
  task2Band: number;
  writingBand: number;
  overallBand: number;
  task1Feedback: string;
  task2Feedback: string;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}
function wordCount(t: string) { return t.trim().split(/\s+/).filter(w => w).length; }

function BandBadge({ band, label }: { band: number; label: string }) {
  const color = band >= 7 ? 'text-green-700 bg-green-50 border-green-200'
    : band >= 6 ? 'text-blue-700 bg-blue-50 border-blue-200'
    : band >= 5 ? 'text-yellow-700 bg-yellow-50 border-yellow-200'
    : 'text-red-700 bg-red-50 border-red-200';
  return (
    <div className={`border rounded-2xl p-4 text-center ${color}`}>
      <p className="text-3xl font-bold">{band.toFixed(1)}</p>
      <p className="text-xs font-semibold mt-1">{label}</p>
    </div>
  );
}

export default function IELTSMockTest() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [passageIdx, setPassageIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [task1, setTask1] = useState('');
  const [task2, setTask2] = useState('');
  const [scores, setScores] = useState<Scores | null>(null);
  const [lead, setLead] = useState({ name: '', phone: '', email: '' });
  const [leadStatus, setLeadStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (['reading', 'writing1', 'writing2'].includes(phase)) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  function setAnswer(id: number, val: string) {
    setAnswers(prev => ({ ...prev, [id]: val }));
  }

  function answeredInPassage(pIdx: number) {
    return passages[pIdx].questions.filter(q => answers[q.id]?.trim()).length;
  }

  async function submitTest() {
    setPhase('scoring');
    const readingRaw = passages.reduce((total, p) => {
      return total + p.questions.filter(q => {
        const user = (answers[q.id] ?? '').trim().toUpperCase();
        if (q.type === 'mcq') return user === q.answer.toUpperCase();
        if (q.type === 'tfng') return user === q.answer;
        if (q.type === 'fill') {
          const u = (answers[q.id] ?? '').toLowerCase().replace(/[$%]/g, '').trim();
          const a = q.answer.toLowerCase().replace(/[$%]/g, '').trim();
          return u === a || u.includes(a) || a.includes(u);
        }
        return false;
      }).length;
    }, 0);

    const readingBand = rawToReadingBand(readingRaw);

    try {
      const res = await fetch('/api/ielts-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task1Text: task1, task2Text: task2 }),
      });
      const data = await res.json();
      const writingBand = calcWritingBand(data.task1Band || 6, data.task2Band || 6);
      setScores({
        readingRaw, readingBand,
        task1Band: data.task1Band || 6,
        task2Band: data.task2Band || 6,
        writingBand,
        overallBand: calcOverallBand(readingBand, writingBand),
        task1Feedback: data.task1Feedback || '',
        task2Feedback: data.task2Feedback || '',
      });
    } catch {
      const t1b = estimateBandFromText(task1, 150);
      const t2b = estimateBandFromText(task2, 250);
      const writingBand = calcWritingBand(t1b, t2b);
      setScores({
        readingRaw, readingBand, task1Band: t1b, task2Band: t2b,
        writingBand, overallBand: calcOverallBand(readingBand, writingBand),
        task1Feedback: 'AI scoring unavailable. Please contact us for detailed writing feedback.',
        task2Feedback: 'AI scoring unavailable. Please contact us for detailed writing feedback.',
      });
    }
    setPhase('blurred');
  }

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    setLeadStatus('submitting');
    await fetch(FORMSPREE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: `IELTS Mock Test Result – Band ${scores?.overallBand} | ielts-mock-test`,
        name: lead.name, email: lead.email, phone: lead.phone,
        'Overall Band': scores?.overallBand,
        'Reading Band': scores?.readingBand,
        'Writing Band': scores?.writingBand,
        'Source Page': 'ielts-mock-test',
        'Submitted At': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      }),
    }).catch(() => {});
    setLeadStatus('success');
    setPhase('unlocked');
  }

  function printReport() { window.print(); }

  // ─── INTRO ───────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-700 via-blue-900 to-brand-900 py-14 px-4">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <span className="inline-block bg-white/15 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            📝 Free IELTS Mock Test
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">IELTS Practice Test with AI Scoring</h1>
          <p className="text-blue-200 text-sm">Reading (40 Q) + Writing (2 Tasks) · AI band score 1–9 · Free instant results</p>
        </div>
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-7 shadow-2xl">
          <h2 className="font-bold text-gray-900 text-lg mb-5">What to expect</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              { icon: '📖', title: 'Section 1 – Reading', desc: '3 academic passages · 40 questions · MCQ, True/False/NG, Fill in blanks · Auto-scored' },
              { icon: '✍️', title: 'Section 2 – Writing', desc: 'Task 1: Describe a bar chart (150+ words) · Task 2: Opinion essay (250+ words) · AI-scored' },
              { icon: '📊', title: 'Instant Results', desc: 'Band score 1–9 for each section with AI feedback and country-wise requirement comparison' },
              { icon: '🔓', title: 'Unlock Full Report', desc: 'Enter name, WhatsApp & email to unlock section-wise scores, feedback, and PDF report' },
            ].map(item => (
              <div key={item.title} className="bg-gray-50 rounded-2xl p-4">
                <p className="text-2xl mb-2">{item.icon}</p>
                <p className="font-semibold text-sm text-gray-900 mb-1">{item.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-5 text-xs text-blue-700">
            ⏱ Reading: ~60 min &nbsp;·&nbsp; Writing: ~60 min &nbsp;·&nbsp; Work at your own pace
          </div>
          <button onClick={() => { setPhase('reading'); setElapsed(0); }}
            className="btn-gold w-full text-center text-base">
            Start IELTS Mock Test →
          </button>
        </div>
      </div>
    );
  }

  // ─── READING ─────────────────────────────────────────────────────────────
  if (phase === 'reading') {
    const p = passages[passageIdx];
    const answered = answeredInPassage(passageIdx);
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Top bar */}
        <div className="bg-brand-700 text-white px-4 py-3 sticky top-0 z-30">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-sm">Reading Test · Passage {passageIdx + 1} of 3</p>
              <p className="text-blue-200 text-xs">Q{p.questions[0].id}–{p.questions[p.questions.length - 1].id} · {answered}/{p.questions.length} answered</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-blue-200 text-xs">⏱ {formatTime(elapsed)}</span>
              <button onClick={submitTest}
                className="bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                Submit Reading →
              </button>
            </div>
          </div>
        </div>

        {/* Passage tabs */}
        <div className="bg-white border-b border-gray-200 px-4">
          <div className="max-w-6xl mx-auto flex gap-1 py-2">
            {passages.map((pp, i) => (
              <button key={i} onClick={() => setPassageIdx(i)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${i === passageIdx ? 'bg-brand-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                Passage {i + 1}
                <span className={`ml-1 ${i === passageIdx ? 'text-blue-200' : 'text-gray-400'}`}>
                  ({answeredInPassage(i)}/{pp.questions.length})
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Passage text */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:max-h-[calc(100vh-180px)] lg:overflow-y-auto">
            <h2 className="font-bold text-gray-900 text-base mb-4">{p.title}</h2>
            {p.paragraphs.map((para, i) => (
              <p key={i} className="text-sm text-gray-700 leading-relaxed mb-4">{para}</p>
            ))}
          </div>

          {/* Questions */}
          <div className="space-y-5 lg:max-h-[calc(100vh-180px)] lg:overflow-y-auto">
            {/* MCQ group */}
            {p.questions.filter(q => q.type === 'mcq').length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-xs font-bold text-brand-700 uppercase tracking-wide mb-4">
                  Multiple Choice — Questions {p.questions.filter(q => q.type === 'mcq').map(q => q.id).join(', ')}
                </p>
                {p.questions.filter(q => q.type === 'mcq').map(q => {
                  if (q.type !== 'mcq') return null;
                  return (
                    <div key={q.id} className="mb-5">
                      <p className="text-sm font-semibold text-gray-800 mb-2">
                        <span className="text-brand-700 mr-1">Q{q.id}.</span>{q.text}
                      </p>
                      <div className="space-y-1.5">
                        {q.options.map(opt => (
                          <label key={opt.key} className={`flex items-start gap-2 p-2.5 rounded-lg cursor-pointer border transition-colors ${answers[q.id] === opt.key ? 'bg-brand-50 border-brand-300' : 'border-gray-100 hover:bg-gray-50'}`}>
                            <input type="radio" name={`q${q.id}`} value={opt.key}
                              checked={answers[q.id] === opt.key}
                              onChange={() => setAnswer(q.id, opt.key)}
                              className="mt-0.5 accent-brand-700" />
                            <span className="text-sm text-gray-700"><strong>{opt.key}.</strong> {opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TFNG group */}
            {p.questions.filter(q => q.type === 'tfng').length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-xs font-bold text-brand-700 uppercase tracking-wide mb-1">
                  True / False / Not Given — Questions {p.questions.filter(q => q.type === 'tfng').map(q => q.id).join(', ')}
                </p>
                <p className="text-xs text-gray-400 mb-4">TRUE = confirmed in passage · FALSE = contradicted · NOT GIVEN = not mentioned</p>
                {p.questions.filter(q => q.type === 'tfng').map(q => {
                  if (q.type !== 'tfng') return null;
                  return (
                    <div key={q.id} className="mb-4">
                      <p className="text-sm text-gray-800 mb-2">
                        <span className="font-semibold text-brand-700 mr-1">Q{q.id}.</span>{q.statement}
                      </p>
                      <div className="flex gap-2">
                        {(['TRUE', 'FALSE', 'NOT GIVEN'] as const).map(opt => (
                          <button key={opt} onClick={() => setAnswer(q.id, opt)}
                            className={`flex-1 text-xs font-semibold py-2 rounded-lg border transition-colors ${answers[q.id] === opt ? 'bg-brand-700 text-white border-brand-700' : 'border-gray-200 text-gray-600 hover:border-brand-300'}`}>
                            {opt === 'NOT GIVEN' ? 'NOT GIVEN' : opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Fill group */}
            {p.questions.filter(q => q.type === 'fill').length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-xs font-bold text-brand-700 uppercase tracking-wide mb-1">
                  Fill in the Blanks — Questions {p.questions.filter(q => q.type === 'fill').map(q => q.id).join(', ')}
                </p>
                <p className="text-xs text-gray-400 mb-4">Use words from the passage. No more than three words per answer.</p>
                {p.questions.filter(q => q.type === 'fill').map(q => {
                  if (q.type !== 'fill') return null;
                  const parts = q.prompt.split('___');
                  return (
                    <div key={q.id} className="mb-4">
                      <p className="text-sm text-gray-800 mb-1.5">
                        <span className="font-semibold text-brand-700 mr-1">Q{q.id}.</span>
                        {parts[0]}
                        <input
                          type="text"
                          value={answers[q.id] || ''}
                          onChange={e => setAnswer(q.id, e.target.value)}
                          placeholder="your answer"
                          className="inline-block border-b-2 border-brand-700 bg-transparent px-1 py-0.5 text-sm text-brand-700 font-semibold w-28 focus:outline-none text-center mx-1"
                        />
                        {parts[1]}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3">
              {passageIdx > 0 && (
                <button onClick={() => setPassageIdx(p => p - 1)}
                  className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50">
                  ← Passage {passageIdx}
                </button>
              )}
              {passageIdx < 2 ? (
                <button onClick={() => setPassageIdx(p => p + 1)}
                  className="flex-1 btn-gold text-center">
                  Passage {passageIdx + 2} →
                </button>
              ) : (
                <button onClick={submitTest}
                  className="flex-1 btn-gold text-center">
                  Submit Reading Test →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── WRITING TASK 1 ───────────────────────────────────────────────────────
  if (phase === 'writing1') {
    const wc = wordCount(task1);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-brand-700 text-white px-4 py-3 sticky top-0 z-30">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div>
              <p className="font-bold text-sm">Writing – Task 1</p>
              <p className="text-blue-200 text-xs">Describe the bar chart below · Min. 150 words</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-blue-200 text-xs">⏱ {formatTime(elapsed)}</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${wc >= 150 ? 'bg-green-500' : 'bg-white/20'}`}>
                {wc} words
              </span>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart + Task */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs font-bold text-gray-500 uppercase mb-3">Writing Task 1</p>
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
              The bar chart below shows the number of Indian students (in thousands) studying in five countries from 2018 to 2022.
              <strong> Summarise the information by selecting and reporting the main features, and make comparisons where relevant.</strong> Write at least 150 words.
            </p>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 text-center mb-2 font-semibold">Indian Students Studying Abroad (thousands)</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={CHART_DATA} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  {['Canada', 'USA', 'UK', 'Australia', 'Germany'].map((c, i) => (
                    <Bar key={c} dataKey={c} fill={BAR_COLORS[i]} radius={[2, 2, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Answer */}
          <div className="flex flex-col">
            <textarea
              value={task1}
              onChange={e => setTask1(e.target.value)}
              placeholder="Begin your response here. Remember to describe the overall trend, compare countries, and highlight key data points..."
              className="flex-1 w-full border border-gray-300 rounded-2xl p-4 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-700 resize-none min-h-[300px]"
            />
            <div className="mt-4 flex gap-3">
              <button onClick={() => setPhase('reading')}
                className="border border-gray-300 text-gray-600 py-3 px-5 rounded-xl text-sm font-semibold hover:bg-gray-50">
                ← Back
              </button>
              <button onClick={() => setPhase('writing2')}
                className="flex-1 btn-gold text-center">
                Next: Task 2 →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── WRITING TASK 2 ───────────────────────────────────────────────────────
  if (phase === 'writing2') {
    const wc = wordCount(task2);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-brand-700 text-white px-4 py-3 sticky top-0 z-30">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div>
              <p className="font-bold text-sm">Writing – Task 2</p>
              <p className="text-blue-200 text-xs">Opinion essay · Min. 250 words</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-blue-200 text-xs">⏱ {formatTime(elapsed)}</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${wc >= 250 ? 'bg-green-500' : 'bg-white/20'}`}>
                {wc} words
              </span>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs font-bold text-gray-500 uppercase mb-3">Writing Task 2</p>
            <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-800 leading-relaxed font-medium">
                "Some people believe that universities should focus primarily on developing students' employability skills rather than academic knowledge. To what extent do you agree or disagree?"
              </p>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.
            </p>
            <div className="mt-4 space-y-2 text-xs text-gray-500">
              <p className="font-semibold">Scoring criteria:</p>
              <p>· Task Response · Coherence & Cohesion</p>
              <p>· Lexical Resource · Grammatical Range & Accuracy</p>
            </div>
          </div>
          <div className="flex flex-col">
            <textarea
              value={task2}
              onChange={e => setTask2(e.target.value)}
              placeholder="Write your essay here. Include an introduction, body paragraphs with supporting arguments and examples, and a conclusion..."
              className="flex-1 w-full border border-gray-300 rounded-2xl p-4 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-700 resize-none min-h-[340px]"
            />
            <div className="mt-4 flex gap-3">
              <button onClick={() => setPhase('writing1')}
                className="border border-gray-300 text-gray-600 py-3 px-5 rounded-xl text-sm font-semibold hover:bg-gray-50">
                ← Back
              </button>
              <button onClick={submitTest}
                className="flex-1 btn-gold text-center">
                Submit & Get Score →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── SCORING ─────────────────────────────────────────────────────────────
  if (phase === 'scoring') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-700 to-blue-900 flex items-center justify-center px-4">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-bold mb-2">Scoring Your Test…</h2>
          <p className="text-blue-200 text-sm">AI is evaluating your writing. This takes 10–20 seconds.</p>
        </div>
      </div>
    );
  }

  // ─── RESULTS (blurred / unlocked) ────────────────────────────────────────
  if ((phase === 'blurred' || phase === 'unlocked') && scores) {
    const unlocked = phase === 'unlocked';

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Print-only header */}
        <div className="hidden print:block p-8">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <div className="w-12 h-12 bg-brand-700 rounded-xl flex items-center justify-center font-bold text-white text-lg">JO</div>
            <div>
              <p className="font-bold text-gray-900 text-lg">Jaivik Overseas Consultants</p>
              <p className="text-sm text-gray-500">IELTS Practice Test Score Report · {new Date().toLocaleDateString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Result header */}
        <div className="bg-brand-700 text-white px-4 py-7 print:hidden">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-blue-200 text-sm mb-2">Test Complete · {formatTime(elapsed)} taken</p>
            <h1 className="text-2xl font-bold">Your IELTS Mock Test Results</h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
          {/* Overall band (blurred or shown) */}
          <div className={`bg-white rounded-3xl p-6 text-center border shadow-md relative overflow-hidden ${!unlocked ? 'border-brand-200' : 'border-gray-100'}`}>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Overall Estimated Band</p>
            <div className={`transition-all ${unlocked ? '' : 'blur-md select-none pointer-events-none'}`}>
              <p className="text-7xl font-bold text-brand-700 mb-1">{scores.overallBand.toFixed(1)}</p>
              <p className="text-sm text-gray-500">out of 9.0</p>
            </div>
            {!unlocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-700 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <p className="font-semibold text-sm text-gray-800">Unlock to see your score</p>
                </div>
              </div>
            )}
          </div>

          {/* Section scores */}
          <div className={`transition-all ${unlocked ? '' : 'blur-sm pointer-events-none select-none'}`}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <BandBadge band={scores.readingBand} label={`Reading\n(${scores.readingRaw}/40)`} />
              <BandBadge band={scores.task1Band} label="Writing Task 1" />
              <BandBadge band={scores.task2Band} label="Writing Task 2" />
              <BandBadge band={scores.writingBand} label="Writing Overall" />
            </div>
          </div>

          {/* AI Writing Feedback */}
          {unlocked && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-3">AI Writing Feedback</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-blue-700 mb-1">Task 1 (Band {scores.task1Band})</p>
                  <p className="text-xs text-gray-700 leading-relaxed">{scores.task1Feedback}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-purple-700 mb-1">Task 2 (Band {scores.task2Band})</p>
                  <p className="text-xs text-gray-700 leading-relaxed">{scores.task2Feedback}</p>
                </div>
              </div>
            </div>
          )}

          {/* Country requirements */}
          {unlocked && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-3">Country-wise Requirement Comparison</h3>
              <div className="space-y-3">
                {COUNTRY_REQ.map(cr => {
                  const meets = scores.overallBand >= cr.min;
                  return (
                    <div key={cr.country} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${meets ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{cr.flag}</span>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{cr.country}</p>
                          <p className="text-xs text-gray-500">Min. IELTS {cr.min}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-sm ${meets ? 'text-green-700' : 'text-red-600'}`}>
                          {meets ? '✓ Eligible' : `Need +${(cr.min - scores.overallBand).toFixed(1)}`}
                        </p>
                        <p className={`text-xs ${meets ? 'text-green-600' : 'text-red-500'}`}>
                          Your band: {scores.overallBand}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Unlock form */}
          {!unlocked && (
            <div className="bg-white rounded-3xl border-2 border-brand-200 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-brand-700 to-blue-800 text-white px-6 py-5 text-center">
                <p className="text-2xl mb-2">🔓</p>
                <h2 className="text-lg font-bold mb-1">Unlock Your Full Results</h2>
                <p className="text-blue-200 text-sm">Section scores · AI feedback · Country comparison · PDF report</p>
              </div>
              <form onSubmit={submitLead} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name *</label>
                    <input required type="text" placeholder="Your full name" className="input-field"
                      value={lead.name} onChange={e => setLead(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">WhatsApp Number *</label>
                    <input required type="tel" placeholder="+91 99712 26347" className="input-field"
                      value={lead.phone} onChange={e => setLead(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address *</label>
                  <input required type="email" placeholder="you@email.com" className="input-field"
                    value={lead.email} onChange={e => setLead(p => ({ ...p, email: e.target.value }))} />
                </div>
                <button type="submit" disabled={leadStatus === 'submitting'}
                  className="btn-gold w-full text-center disabled:opacity-60">
                  {leadStatus === 'submitting' ? 'Unlocking…' : 'Unlock My Results →'}
                </button>
                <p className="text-xs text-gray-400 text-center">Your data is safe. We will share your results + study tips.</p>
              </form>
            </div>
          )}

          {/* Unlocked CTAs */}
          {unlocked && (
            <>
              <div className="bg-brand-700 text-white rounded-2xl p-5 text-center">
                <p className="font-bold text-base mb-2">Want to Improve Your IELTS Band?</p>
                <p className="text-blue-200 text-sm mb-4">Our counsellors can guide you on IELTS preparation + university selection based on your current score.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/book-counselling" className="flex-1 btn-gold text-center">
                    Book Free Counselling →
                  </Link>
                  <button onClick={printReport}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold text-sm transition-colors">
                    📄 Download PDF Report
                  </button>
                </div>
              </div>

              {/* Print-only results */}
              <div className="hidden print:block bg-white p-6 rounded-2xl border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Score Summary</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {[
                    ['Reading Band', `${scores.readingBand} (${scores.readingRaw}/40 correct)`],
                    ['Writing Task 1', scores.task1Band],
                    ['Writing Task 2', scores.task2Band],
                    ['Writing Band', scores.writingBand],
                    ['Overall Band', scores.overallBand],
                  ].map(([k, v]) => (
                    <div key={String(k)} className="border-b pb-2">
                      <p className="text-xs text-gray-500">{k}</p>
                      <p className="font-bold text-gray-900">{v}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-4">This is a practice test result. For official IELTS, register at ielts.org.</p>
                <p className="text-xs text-gray-500">For expert guidance: +91-9971226347 | info@jaivikoverseasconsultants.com</p>
                <p className="text-xs text-gray-500">333 Orbit Plaza, Crossing Republik, Ghaziabad, UP</p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
}
