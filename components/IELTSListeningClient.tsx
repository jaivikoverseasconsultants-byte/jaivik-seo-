'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ListeningTest, ListeningQuestion } from '@/data/ielts-listening';
import { calcListeningBand } from '@/data/ielts-listening';

interface Props {
  test: ListeningTest;
  onComplete: (score: number, band: string, answers: Record<number, string>) => void;
}

export default function IELTSListeningClient({ test, onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [activeSection, setActiveSection] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(test.timeMinutes * 60);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, []); // eslint-disable-line

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const handleAnswer = (qId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = useCallback(() => {
    if (submitted) return;
    clearInterval(timerRef.current!);
    setSubmitted(true);
    let score = 0;
    test.sections.forEach(s => {
      s.questions.forEach(q => {
        if ((answers[q.id] || '').trim().toLowerCase() === q.answer.trim().toLowerCase()) score++;
      });
    });
    const band = calcListeningBand(score);
    onComplete(score, band, answers);
  }, [submitted, answers, test, onComplete]);

  const allQuestions = test.sections.flatMap(s => s.questions);
  const answeredCount = Object.keys(answers).length;

  const isCorrect = (q: ListeningQuestion) => {
    if (!submitted) return null;
    return (answers[q.id] || '').trim().toLowerCase() === q.answer.trim().toLowerCase();
  };

  const section = test.sections[activeSection];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-[#0a1628] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-brand-400 font-semibold text-sm uppercase tracking-wide">IELTS Listening</span>
            <span className="ml-3 text-gray-300 text-sm capitalize">{test.level} · Band {test.bandTarget}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-sm">{answeredCount}/{allQuestions.length} answered</span>
            <span className={`font-mono text-lg font-bold px-3 py-1 rounded ${timeLeft < 180 ? 'bg-red-600 animate-pulse' : 'bg-[#1a2e4a]'}`}>
              ⏱ {formatTime(timeLeft)}
            </span>
            {!submitted && (
              <button onClick={handleSubmit} className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                Submit Test
              </button>
            )}
          </div>
        </div>
        {/* Section tabs */}
        <div className="max-w-7xl mx-auto px-4 pb-2 flex gap-2 overflow-x-auto">
          {test.sections.map((s, i) => (
            <button key={s.id} onClick={() => setActiveSection(i)}
              className={`px-4 py-1.5 rounded-t text-sm font-medium whitespace-nowrap transition-colors ${activeSection === i ? 'bg-white text-[#0a1628]' : 'text-gray-300 hover:text-white'}`}>
              Section {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Transcript */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{section.scenario}</p>
            </div>
            {/* Audio simulation notice */}
            <div className="mx-5 mt-4 bg-brand-50 border border-brand-200 rounded-lg p-4 flex items-start gap-3">
              <span className="text-2xl">🎧</span>
              <div>
                <p className="text-sm font-semibold text-brand-800">Simulated Listening Test</p>
                <p className="text-xs text-brand-600 mt-0.5">In the real IELTS test, you would listen to a recording. Here, read the transcript carefully to answer the questions.</p>
              </div>
            </div>
            <div className="p-5">
              <button
                onClick={() => setShowTranscript(t => !t)}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#0a1628] text-white rounded-lg hover:bg-[#0d1b2e] transition-colors text-sm font-semibold"
              >
                <span>{showTranscript ? '▼ Hide Transcript' : '▶ Show Transcript'}</span>
                <span className="text-gray-300 text-xs">Click to {showTranscript ? 'hide' : 'read'}</span>
              </button>
              {showTranscript && (
                <div className="mt-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-96 overflow-y-auto">
                  {section.transcript}
                </div>
              )}
            </div>
          </div>

          {/* Right: Questions */}
          <div className="space-y-4">
            {section.questions.map(q => {
              const correct = isCorrect(q);
              return (
                <div key={q.id}
                  className={`bg-white rounded-xl shadow-sm border p-5 ${submitted ? correct ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${submitted ? correct ? 'bg-green-500 text-white' : 'bg-red-500 text-white' : 'bg-[#0a1628] text-white'}`}>{q.id}</span>
                    <p className="text-gray-800 font-medium leading-snug">{q.question}</p>
                  </div>

                  {(q.type === 'mcq' || q.type === 'matching') && q.options && (
                    <div className="space-y-2 ml-10">
                      {q.options.map(opt => (
                        <label key={opt} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${answers[q.id] === opt ? 'bg-brand-50 border border-brand-300' : 'hover:bg-gray-50'} ${submitted && opt === q.answer ? 'bg-green-100 border border-green-400' : ''}`}>
                          <input type="radio" name={`q-${q.id}`} value={opt} checked={answers[q.id] === opt}
                            onChange={() => !submitted && handleAnswer(q.id, opt)} disabled={submitted} className="text-brand-500" />
                          <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'fill' && (
                    <div className="ml-10">
                      <input type="text" value={answers[q.id] || ''} onChange={e => !submitted && handleAnswer(q.id, e.target.value)}
                        disabled={submitted} placeholder="Type your answer..."
                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 ${submitted ? correct ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
                    </div>
                  )}

                  {submitted && (
                    <div className="ml-10 mt-3">
                      {!correct && <p className="text-sm text-green-700 font-medium">✓ Correct answer: <span className="font-bold">{q.answer}</span></p>}
                      {q.explanation && (
                        <>
                          <button onClick={() => setShowExplanation(p => ({ ...p, [q.id]: !p[q.id] }))} className="text-xs text-brand-600 hover:text-brand-700 mt-1 underline">
                            {showExplanation[q.id] ? 'Hide' : 'Show'} explanation
                          </button>
                          {showExplanation[q.id] && <p className="text-xs text-gray-600 mt-1 bg-white p-2 rounded border border-gray-200">{q.explanation}</p>}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Navigator */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-2 font-medium">All questions</p>
              <div className="flex flex-wrap gap-1.5">
                {allQuestions.map(q => (
                  <button key={q.id}
                    onClick={() => { const si = test.sections.findIndex(s => s.questions.some(sq => sq.id === q.id)); setActiveSection(si); }}
                    className={`w-8 h-8 rounded text-xs font-medium transition-colors ${answers[q.id] ? submitted ? isCorrect(q) ? 'bg-green-500 text-white' : 'bg-red-500 text-white' : 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {q.id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
