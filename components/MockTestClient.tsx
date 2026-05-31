'use client';

import { useState, useEffect, useCallback } from 'react';

const FORMSPREE_URL = 'https://formspree.io/f/xgoqzezk';
const TOTAL_TIME = 60 * 60; // 60 minutes in seconds

const READING_PASSAGE = `International student mobility has grown significantly over the past two decades. Students increasingly seek higher education abroad to access better academic resources, broaden their career prospects, and experience different cultures. India has emerged as one of the world's largest sources of international students, with hundreds of thousands pursuing degrees in countries such as the United States, United Kingdom, Canada, and Australia each year. Research suggests that graduates with international education experience often command higher starting salaries and demonstrate greater cross-cultural competency, making them more attractive to multinational employers.`;

interface Question {
  id: number;
  section: string;
  text: string;
  options: string[];
  correct: number; // 0-indexed
  explanation: string;
}

const QUESTIONS: Question[] = [
  // ── READING ──────────────────────────────────────────────────────────────
  {
    id: 1, section: 'Reading',
    text: 'According to the passage, what has happened to international student mobility?',
    options: ['It has declined sharply', 'It has remained stable', 'It has grown significantly', 'It has fluctuated unpredictably'],
    correct: 2,
    explanation: 'The passage opens with "International student mobility has grown significantly over the past two decades."',
  },
  {
    id: 2, section: 'Reading',
    text: 'Which is NOT mentioned as a reason students study abroad?',
    options: ['Access to better academic resources', 'Broadening career prospects', 'Avoiding domestic competition', 'Experiencing different cultures'],
    correct: 2,
    explanation: 'The passage mentions academic resources, career prospects, and culture — but never avoiding domestic competition.',
  },
  {
    id: 3, section: 'Reading',
    text: 'The word "command" in "command higher starting salaries" most nearly means:',
    options: ['Order', 'Earn / Attract', 'Request politely', 'Refuse'],
    correct: 1,
    explanation: '"Command" here means to achieve or attract — as in "command a premium price."',
  },
  {
    id: 4, section: 'Reading',
    text: 'What does the passage state about India?',
    options: ['India is the single largest source of international students', 'India is one of the world\'s largest sources of international students', 'Most Indian students choose Canada', 'Indian graduates struggle to find employment abroad'],
    correct: 1,
    explanation: 'The passage says India "has emerged as one of the world\'s largest sources" — not the single largest.',
  },
  {
    id: 5, section: 'Reading',
    text: 'The word "competency" is closest in meaning to:',
    options: ['Competition', 'Competitiveness', 'Skill / Ability', 'Cooperation'],
    correct: 2,
    explanation: '"Competency" means a specific skill or the ability to do something well.',
  },

  // ── GRAMMAR ──────────────────────────────────────────────────────────────
  {
    id: 6, section: 'Grammar',
    text: 'By the time she graduates, she _____ in this city for four years.',
    options: ['will live', 'will have lived', 'has lived', 'was living'],
    correct: 1,
    explanation: 'Future Perfect ("will have lived") is used for an action that will be completed before a future point in time.',
  },
  {
    id: 7, section: 'Grammar',
    text: 'The number of students applying for scholarships _____ increased dramatically.',
    options: ['have', 'has', 'are', 'were'],
    correct: 1,
    explanation: '"The number of" takes a singular verb. So it is "The number… has increased."',
  },
  {
    id: 8, section: 'Grammar',
    text: 'Choose the correct sentence:',
    options: [
      'Despite of the bad weather, the event continued.',
      'Although the bad weather, the event continued.',
      'Despite the bad weather, the event continued.',
      'Even the bad weather, the event continued.',
    ],
    correct: 2,
    explanation: '"Despite" is followed directly by a noun/noun phrase — NOT "Despite of." "Although" requires a full clause.',
  },
  {
    id: 9, section: 'Grammar',
    text: 'She is not only intelligent _____ hardworking.',
    options: ['but also', 'and also', 'but as well', 'or also'],
    correct: 0,
    explanation: 'The fixed correlative conjunction pair is "not only… but also."',
  },
  {
    id: 10, section: 'Grammar',
    text: 'The report must be submitted _____ Friday.',
    options: ['on', 'at', 'by', 'until'],
    correct: 2,
    explanation: '"By Friday" means no later than Friday — a deadline. "Until Friday" implies a continuous action ending on Friday.',
  },

  // ── VOCABULARY ────────────────────────────────────────────────────────────
  {
    id: 11, section: 'Vocabulary',
    text: 'The professor\'s explanation was so _____ that even beginners understood the complex theory.',
    options: ['convoluted', 'ambiguous', 'lucid', 'verbose'],
    correct: 2,
    explanation: '"Lucid" means clear and easy to understand. "Convoluted" = overly complex; "verbose" = wordy.',
  },
  {
    id: 12, section: 'Vocabulary',
    text: 'The new research findings completely contradicted the old theory, effectively _____ years of prior work.',
    options: ['validating', 'corroborating', 'undermining', 'replicating'],
    correct: 2,
    explanation: '"Undermining" means weakening or eroding the foundation of something — fitting here.',
  },
  {
    id: 13, section: 'Vocabulary',
    text: 'Students are advised to _____ their ideas clearly in academic essays.',
    options: ['articulate', 'exaggerate', 'fabricate', 'exacerbate'],
    correct: 0,
    explanation: '"Articulate" means to express thoughts clearly and fluently.',
  },
  {
    id: 14, section: 'Vocabulary',
    text: 'The government plans to _____ the education budget by 20% next year.',
    options: ['diminish', 'curtail', 'augment', 'restrict'],
    correct: 2,
    explanation: '"Augment" means to increase or make larger. The others mean to reduce.',
  },
  {
    id: 15, section: 'Vocabulary',
    text: 'Her thesis was widely praised for its _____ analysis of the historical data.',
    options: ['superficial', 'rigorous', 'ambiguous', 'cursory'],
    correct: 1,
    explanation: '"Rigorous" means thorough and precise. "Superficial" and "cursory" mean shallow.',
  },

  // ── ACADEMIC ENGLISH ─────────────────────────────────────────────────────
  {
    id: 16, section: 'Academic English',
    text: 'Which sentence is grammatically correct?',
    options: [
      'There is less students in the class today.',
      'There are fewer students in the class today.',
      'There are less students in the class today.',
      'There is fewer students in the class today.',
    ],
    correct: 1,
    explanation: 'Use "fewer" for countable nouns (students). "Less" is for uncountable nouns (water, time). "There are" agrees with the plural noun.',
  },
  {
    id: 17, section: 'Academic English',
    text: 'Which word does NOT show addition (unlike the others)?',
    options: ['Furthermore', 'However', 'Moreover', 'Additionally'],
    correct: 1,
    explanation: '"However" shows contrast, while "Furthermore," "Moreover," and "Additionally" all add supporting points.',
  },
  {
    id: 18, section: 'Academic English',
    text: 'Identify the error in: "The data shows that majority of respondents prefers online learning."',
    options: [
      '"data shows" should be "data show"',
      '"majority of respondents" should be "respondents majority"',
      '"prefers" should be "prefer"',
      'Both A and C are errors',
    ],
    correct: 3,
    explanation: '"Data" is plural so takes "show." "Majority of respondents" is plural, so "prefer" is correct — not "prefers."',
  },
  {
    id: 19, section: 'Academic English',
    text: 'The prefix "ante-" (as in "antecedent") means:',
    options: ['Against', 'Before', 'After', 'Between'],
    correct: 1,
    explanation: '"Ante-" means before (antenatal = before birth). Do not confuse with "anti-" which means against.',
  },
  {
    id: 20, section: 'Academic English',
    text: 'Which word is a synonym for "ubiquitous"?',
    options: ['Rare', 'Omnipresent / Everywhere', 'Temporary', 'Significant'],
    correct: 1,
    explanation: '"Ubiquitous" means present everywhere at the same time — synonymous with "omnipresent."',
  },
];

const SECTIONS = Array.from(new Set(QUESTIONS.map(q => q.section)));

function getBand(score: number): { band: string; label: string; color: string } {
  if (score >= 18) return { band: '8.0 – 9.0', label: 'Expert', color: 'text-green-700 bg-green-50' };
  if (score >= 15) return { band: '7.0 – 7.5', label: 'Good', color: 'text-blue-700 bg-blue-50' };
  if (score >= 12) return { band: '6.5', label: 'Competent', color: 'text-brand-700 bg-brand-50' };
  if (score >= 9) return { band: '6.0', label: 'Modest', color: 'text-yellow-700 bg-yellow-50' };
  if (score >= 6) return { band: '5.5', label: 'Limited', color: 'text-orange-700 bg-orange-50' };
  return { band: '≤ 5.0', label: 'Needs Work', color: 'text-red-700 bg-red-50' };
}

function formatTime(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

type Stage = 'intro' | 'test' | 'score' | 'submitted';

export default function MockTestClient() {
  const [stage, setStage] = useState<Stage>('intro');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [timedOut, setTimedOut] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);
  const [lead, setLead] = useState({ name: '', phone: '', email: '' });
  const [leadStatus, setLeadStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [activeSection, setActiveSection] = useState(SECTIONS[0]);

  const score = QUESTIONS.filter(q => answers[q.id] === q.correct).length;
  const band = getBand(score);

  // Timer
  useEffect(() => {
    if (stage !== 'test') return;
    if (timeLeft <= 0) { setTimedOut(true); setStage('score'); return; }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [stage, timeLeft]);

  const submitTest = useCallback(() => {
    setStage('score');
  }, []);

  const answered = Object.keys(answers).length;
  const sectionQuestions = (sec: string) => QUESTIONS.filter(q => q.section === sec);
  const sectionAnswered = (sec: string) => sectionQuestions(sec).filter(q => answers[q.id] !== undefined).length;

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLeadStatus('submitting');
    try {
      await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `IELTS Mock Test Result – Score ${score}/20 (Band ${band.band}) | ${lead.name}`,
          name: lead.name, phone: lead.phone, email: lead.email,
          'Mock Test Score': `${score}/20`,
          'Estimated Band': band.band,
          'Band Label': band.label,
          Source: 'ielts-mock-test',
          'Submitted At': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        }),
      });
    } catch { /* ignore */ }
    setLeadStatus('success');
    setStage('submitted');
    setTimeout(() => { window.location.href = '/thank-you'; }, 1500);
  }

  // ── INTRO ────────────────────────────────────────────────────────────────
  if (stage === 'intro') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block bg-white/15 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
              📝 Free IELTS Practice Test
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">IELTS Mock Test 2026</h1>
            <p className="text-blue-200 text-sm max-w-xl mx-auto">
              20 questions · 60 minutes · Reading, Grammar, Vocabulary & Academic English. Get your estimated band score instantly.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { icon: '📖', label: 'Reading', count: 5 },
              { icon: '✍️', label: 'Grammar', count: 5 },
              { icon: '📚', label: 'Vocabulary', count: 5 },
              { icon: '🎓', label: 'Academic English', count: 5 },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className="font-bold text-gray-900 text-sm">{s.label}</p>
                <p className="text-xs text-gray-500">{s.count} questions</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
            <h2 className="font-bold text-gray-900 mb-3">Instructions</h2>
            <ul className="text-sm text-gray-600 space-y-1.5 list-disc list-inside">
              <li>You have <strong>60 minutes</strong> to complete 20 questions</li>
              <li>Choose the best answer for each multiple-choice question</li>
              <li>Questions 1–5 are based on a reading passage shown during the test</li>
              <li>Timer starts when you click "Start Test"</li>
              <li>Submit before time runs out to get your band score</li>
              <li>Detailed explanations are shown after submission</li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-2xl p-4 mb-8 text-sm text-blue-800">
            <strong>💡 Tip:</strong> This test gives an <em>estimated</em> band score for practice purposes. For official IELTS, register at <strong>ielts.org</strong>.
          </div>

          <button
            onClick={() => { setStage('test'); setTimeLeft(TOTAL_TIME); }}
            className="w-full btn-gold text-center text-lg py-4"
          >
            Start Test — 60 minutes →
          </button>
        </div>
      </div>
    );
  }

  // ── TEST ─────────────────────────────────────────────────────────────────
  if (stage === 'test') {
    const currentSectionQs = sectionQuestions(activeSection);
    const pct = (answered / QUESTIONS.length) * 100;
    const isLowTime = timeLeft < 300;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Sticky header */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-sm font-semibold text-gray-700 hidden sm:block">IELTS Mock Test</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 w-32 sm:w-48 hidden sm:block">
                <div className="bg-brand-600 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs text-gray-500">{answered}/{QUESTIONS.length} answered</span>
            </div>

            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg ${isLowTime ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-brand-50 text-brand-700'}`}>
              ⏱ {formatTime(timeLeft)}
            </div>

            <button onClick={submitTest} className="btn-gold text-sm px-4 py-2 whitespace-nowrap">
              Submit Test
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Section tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-6">
            {SECTIONS.map(sec => {
              const sq = sectionQuestions(sec);
              const sa = sq.filter(q => answers[q.id] !== undefined).length;
              return (
                <button
                  key={sec}
                  onClick={() => setActiveSection(sec)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${activeSection === sec ? 'bg-brand-700 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:border-brand-300'}`}
                >
                  {sec}
                  <span className={`text-xs rounded-full px-1.5 py-0.5 ${activeSection === sec ? 'bg-white/20 text-white' : sa === sq.length ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {sa}/{sq.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Reading passage (only for Reading section) */}
          {activeSection === 'Reading' && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">Reading Passage</p>
              <p className="text-sm text-gray-800 leading-relaxed">{READING_PASSAGE}</p>
            </div>
          )}

          {/* Questions */}
          <div className="space-y-5">
            {currentSectionQs.map((q, qi) => {
              const selected = answers[q.id];
              return (
                <div key={q.id} className={`bg-white rounded-2xl p-5 border transition-all ${selected !== undefined ? 'border-brand-200 shadow-sm' : 'border-gray-100'}`}>
                  <div className="flex items-start gap-3 mb-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">
                      {q.id}
                    </span>
                    <p className="text-gray-900 font-medium text-sm leading-snug">{q.text}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, oi) => (
                      <button
                        key={oi}
                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: oi }))}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border ${
                          selected === oi
                            ? 'bg-brand-700 text-white border-brand-700 font-semibold'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-brand-300 hover:bg-brand-50'
                        }`}
                      >
                        <span className="font-bold mr-2">{String.fromCharCode(65 + oi)}.</span>{opt}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section nav */}
          <div className="flex justify-between mt-6">
            {SECTIONS.indexOf(activeSection) > 0 ? (
              <button onClick={() => setActiveSection(SECTIONS[SECTIONS.indexOf(activeSection) - 1])} className="btn-primary px-6 py-2.5 text-sm">
                ← Previous Section
              </button>
            ) : <div />}
            {SECTIONS.indexOf(activeSection) < SECTIONS.length - 1 ? (
              <button onClick={() => setActiveSection(SECTIONS[SECTIONS.indexOf(activeSection) + 1])} className="btn-gold px-6 py-2.5 text-sm">
                Next Section →
              </button>
            ) : (
              <button onClick={submitTest} className="btn-gold px-6 py-2.5 text-sm">
                Submit Test ✓
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── SCORE ─────────────────────────────────────────────────────────────────
  if (stage === 'score' || stage === 'submitted') {
    const pct = Math.round((score / QUESTIONS.length) * 100);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-10 px-4">
          <div className="max-w-3xl mx-auto text-center">
            {timedOut && <p className="bg-red-500/20 text-red-200 text-xs font-semibold px-3 py-1.5 rounded-full inline-block mb-4">⏰ Time&apos;s up — auto-submitted</p>}
            <h1 className="text-3xl font-bold mb-2">Your Results</h1>
            <p className="text-blue-200 text-sm">IELTS Mock Test 2026</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
          {/* Score card */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-brand-50 border-4 border-brand-200 mb-4">
              <span className="text-3xl font-bold text-brand-700">{score}</span>
            </div>
            <p className="text-gray-500 text-sm mb-4">out of {QUESTIONS.length} correct ({pct}%)</p>

            <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-lg mb-2 ${band.color}`}>
              Estimated Band: {band.band}
            </div>
            <p className="text-gray-500 text-sm">{band.label} level — based on {score}/20 correct answers</p>

            {/* Section breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {SECTIONS.map(sec => {
                const sq = sectionQuestions(sec);
                const correct = sq.filter(q => answers[q.id] === q.correct).length;
                return (
                  <div key={sec} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-brand-700">{correct}/{sq.length}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{sec}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lead capture */}
          {stage === 'score' && (
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-brand-700 to-blue-800 text-white p-6 text-center">
                <p className="text-2xl mb-1">🎯</p>
                <h2 className="text-lg font-bold">Want to Improve Your IELTS Score?</h2>
                <p className="text-blue-200 text-sm mt-1">Get a free consultation with our IELTS & study abroad experts.</p>
              </div>
              <form onSubmit={handleLeadSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                  <input required type="text" placeholder="Your full name" value={lead.name}
                    onChange={e => setLead(p => ({ ...p, name: e.target.value }))} className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Phone *</label>
                    <input required type="tel" placeholder="+91 98765 43210" value={lead.phone}
                      onChange={e => setLead(p => ({ ...p, phone: e.target.value }))} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
                    <input required type="email" placeholder="you@email.com" value={lead.email}
                      onChange={e => setLead(p => ({ ...p, email: e.target.value }))} className="input-field" />
                  </div>
                </div>
                <button type="submit" disabled={leadStatus === 'submitting'} className="btn-gold w-full text-center disabled:opacity-60">
                  {leadStatus === 'submitting' ? 'Sending…' : 'Get Free Counselling & Score Analysis →'}
                </button>
                <p className="text-xs text-gray-400 text-center">Free · No spam · We never share your data</p>
              </form>
            </div>
          )}

          {stage === 'submitted' && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
              <p className="text-3xl mb-2">✅</p>
              <p className="font-bold text-green-800">Redirecting to WhatsApp…</p>
            </div>
          )}

          {/* Explanations toggle */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button
              onClick={() => setShowExplanations(p => !p)}
              className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-900 hover:bg-gray-50"
            >
              <span>📖 View Answers & Explanations</span>
              <span className="text-gray-400">{showExplanations ? '▲' : '▼'}</span>
            </button>
            {showExplanations && (
              <div className="border-t border-gray-100 divide-y divide-gray-50">
                {QUESTIONS.map(q => {
                  const userAns = answers[q.id];
                  const isCorrect = userAns === q.correct;
                  return (
                    <div key={q.id} className={`p-5 ${isCorrect ? 'bg-green-50/40' : 'bg-red-50/40'}`}>
                      <div className="flex items-start gap-2 mb-2">
                        <span className={`flex-shrink-0 text-xs font-bold px-1.5 py-0.5 rounded ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {isCorrect ? '✓' : '✗'} Q{q.id}
                        </span>
                        <p className="text-sm font-medium text-gray-900">{q.text}</p>
                      </div>
                      <p className="text-sm ml-8">
                        <span className="text-gray-500">Correct: </span>
                        <span className="font-semibold text-green-700">{q.options[q.correct]}</span>
                        {userAns !== undefined && userAns !== q.correct && (
                          <span className="text-gray-400"> · Your answer: <span className="text-red-600">{q.options[userAns]}</span></span>
                        )}
                        {userAns === undefined && <span className="text-gray-400"> · Not answered</span>}
                      </p>
                      <p className="text-xs text-gray-500 mt-1.5 ml-8 italic">{q.explanation}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Retake */}
          <div className="text-center pb-6">
            <button
              onClick={() => { setStage('intro'); setAnswers({}); setTimeLeft(TOTAL_TIME); setTimedOut(false); setShowExplanations(false); setLead({ name: '', phone: '', email: '' }); setLeadStatus('idle'); }}
              className="btn-primary px-8 py-3"
            >
              Retake Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
