'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ReadingTest, IELTSQuestion } from '@/data/ielts-reading';
import { calcReadingBand } from '@/data/ielts-reading';

interface Props {
  test: ReadingTest;
  onComplete: (score: number, band: string, answers: Record<number, string>) => void;
}

export default function IELTSReadingClient({ test, onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [activePassage, setActivePassage] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(test.timeMinutes * 60);
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, []); // eslint-disable-line

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (qId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = useCallback(() => {
    if (submitted) return;
    clearInterval(timerRef.current!);
    setSubmitted(true);
    // Calculate score
    let score = 0;
    test.passages.forEach(p => {
      p.questions.forEach(q => {
        const userAnswer = (answers[q.id] || '').trim().toLowerCase();
        const correctAnswer = q.answer.trim().toLowerCase();
        const alts = (q.alternatives || []).map(a => a.trim().toLowerCase());
        if (userAnswer === correctAnswer || alts.includes(userAnswer)) score++;
      });
    });
    const band = calcReadingBand(score);
    onComplete(score, band, answers);
  }, [submitted, answers, test, onComplete]);

  const allQuestions = test.passages.flatMap(p => p.questions);
  const answeredCount = Object.keys(answers).length;

  const isCorrect = (q: IELTSQuestion) => {
    if (!submitted) return null;
    const userAns = (answers[q.id] || '').trim().toLowerCase();
    const alts = (q.alternatives || []).map(a => a.trim().toLowerCase());
    return userAns === q.answer.trim().toLowerCase() || alts.includes(userAns);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-[#0a1628] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-brand-400 font-semibold text-sm uppercase tracking-wide">IELTS Reading</span>
            <span className="ml-3 text-gray-300 text-sm capitalize">{test.level} · Band {test.bandTarget}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-sm">{answeredCount}/{allQuestions.length} answered</span>
            <span className={`font-mono text-lg font-bold px-3 py-1 rounded ${timeLeft < 300 ? 'bg-red-600 animate-pulse' : 'bg-[#1a2e4a]'}`}>
              ⏱ {formatTime(timeLeft)}
            </span>
            {!submitted && (
              <button
                onClick={handleSubmit}
                className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Submit Test
              </button>
            )}
          </div>
        </div>
        {/* Passage tabs */}
        <div className="max-w-7xl mx-auto px-4 pb-2 flex gap-2">
          {test.passages.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActivePassage(i)}
              className={`px-4 py-1.5 rounded-t text-sm font-medium transition-colors ${activePassage === i ? 'bg-white text-[#0a1628]' : 'text-gray-300 hover:text-white'}`}
            >
              Passage {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Passage */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:sticky lg:top-32 lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{test.passages[activePassage].title}</h2>
            <p className="text-xs text-gray-500 mb-4">Questions {test.passages[activePassage].questions[0].id}–{test.passages[activePassage].questions[test.passages[activePassage].questions.length - 1].id}</p>
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {test.passages[activePassage].text}
            </div>
          </div>

          {/* Right: Questions */}
          <div className="space-y-4">
            {test.passages[activePassage].questions.map(q => {
              const correct = isCorrect(q);
              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-xl shadow-sm border p-5 transition-all ${
                    submitted
                      ? correct
                        ? 'border-green-400 bg-green-50'
                        : 'border-red-400 bg-red-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      submitted ? (correct ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-[#0a1628] text-white'
                    }`}>{q.id}</span>
                    <p className="text-gray-800 font-medium leading-snug">{q.question}</p>
                  </div>

                  {q.type === 'mcq' && q.options && (
                    <div className="space-y-2 ml-10">
                      {q.options.map(opt => (
                        <label key={opt} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                          answers[q.id] === opt ? 'bg-brand-50 border border-brand-300' : 'hover:bg-gray-50'
                        } ${submitted && opt === q.answer ? 'bg-green-100 border border-green-400' : ''}`}>
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            value={opt}
                            checked={answers[q.id] === opt}
                            onChange={() => !submitted && handleAnswer(q.id, opt)}
                            disabled={submitted}
                            className="text-brand-500"
                          />
                          <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'tfng' && (
                    <div className="flex gap-3 ml-10">
                      {['TRUE', 'FALSE', 'NOT GIVEN'].map(opt => (
                        <label key={opt} className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer border transition-colors text-sm font-medium ${
                          answers[q.id] === opt ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-300 hover:border-brand-400'
                        } ${submitted && opt === q.answer ? 'bg-green-500 text-white border-green-500' : ''}`}>
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            value={opt}
                            checked={answers[q.id] === opt}
                            onChange={() => !submitted && handleAnswer(q.id, opt)}
                            disabled={submitted}
                            className="hidden"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'fill' && (
                    <div className="ml-10">
                      <input
                        type="text"
                        value={answers[q.id] || ''}
                        onChange={e => !submitted && handleAnswer(q.id, e.target.value)}
                        disabled={submitted}
                        placeholder="Type your answer..."
                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 ${
                          submitted ? (correct ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50') : 'border-gray-300'
                        }`}
                      />
                    </div>
                  )}

                  {submitted && (
                    <div className="ml-10 mt-3">
                      {!correct && (
                        <p className="text-sm text-green-700 font-medium">✓ Correct answer: <span className="font-bold">{q.answer}</span></p>
                      )}
                      {q.explanation && (
                        <button
                          onClick={() => setShowExplanation(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                          className="text-xs text-brand-600 hover:text-brand-700 mt-1 underline"
                        >
                          {showExplanation[q.id] ? 'Hide' : 'Show'} explanation
                        </button>
                      )}
                      {showExplanation[q.id] && q.explanation && (
                        <p className="text-xs text-gray-600 mt-1 bg-white p-2 rounded border border-gray-200">{q.explanation}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Question navigator */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-2 font-medium">Quick navigation</p>
              <div className="flex flex-wrap gap-1.5">
                {allQuestions.map(q => (
                  <button
                    key={q.id}
                    onClick={() => {
                      const passageIndex = test.passages.findIndex(p => p.questions.some(pq => pq.id === q.id));
                      setActivePassage(passageIndex);
                    }}
                    className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                      answers[q.id]
                        ? submitted
                          ? isCorrect(q) ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                          : 'bg-brand-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
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
