'use client';

import { useState, useEffect, useRef } from 'react';
import { SpeakingTest, SpeakingQuestion } from '@/data/ielts-speaking';

interface Props {
  test: SpeakingTest;
  onComplete: () => void;
}

function Part1Panel({ questions }: { questions: SpeakingQuestion[] }) {
  const [current, setCurrent] = useState(0);
  const [showSample, setShowSample] = useState<Record<number, boolean>>({});

  return (
    <div className="space-y-4">
      <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
        <p className="text-sm text-brand-800 font-medium">💬 Part 1: Introduction & Interview (4–5 minutes)</p>
        <p className="text-xs text-brand-600 mt-1">Read each question aloud and then speak your answer. Use the sample answers for reference after you respond.</p>
      </div>
      {questions.map((q, i) => (
        <div key={q.id} className={`bg-white border rounded-xl p-5 ${i === current ? 'border-brand-400 shadow-md' : 'border-gray-200'}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <span className="w-7 h-7 rounded-full bg-[#0a1628] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</span>
              <p className="text-gray-800 font-medium">{q.question}</p>
            </div>
            {i === current && (
              <button onClick={() => setCurrent(Math.min(current + 1, questions.length - 1))}
                className="text-xs bg-brand-500 text-white px-3 py-1.5 rounded-lg whitespace-nowrap">
                Next →
              </button>
            )}
          </div>
          {i === current && (
            <div className="ml-10 mt-3">
              {q.keyPhrases && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-500 mb-1.5">Useful phrases:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {q.keyPhrases.map(phrase => (
                      <span key={phrase} className="bg-brand-50 border border-brand-200 text-brand-700 text-xs px-2 py-0.5 rounded">{phrase}</span>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={() => setShowSample(p => ({ ...p, [q.id]: !p[q.id] }))}
                className="text-xs text-green-700 border border-green-200 px-3 py-1.5 rounded hover:bg-green-50">
                {showSample[q.id] ? 'Hide' : '👁 Show'} Sample Answer
              </button>
              {showSample[q.id] && (
                <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-gray-700 leading-relaxed italic">"{q.sampleAnswer}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Part2Panel({ cueCard }: { cueCard: NonNullable<import('@/data/ielts-speaking').SpeakingPart['cueCard']> }) {
  const [phase, setPhase] = useState<'cue' | 'prep' | 'speak' | 'done'>('cue');
  const [prepTime, setPrepTime] = useState(60);
  const [showSample, setShowSample] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startPrep = () => {
    setPhase('prep');
    timerRef.current = setInterval(() => {
      setPrepTime(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setPhase('speak');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => () => clearInterval(timerRef.current!), []);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-brand-500 text-white text-xs font-bold px-2 py-0.5 rounded">CUE CARD</span>
          <span className="text-gray-500 text-sm">1 minute preparation + 1–2 minutes speaking</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">{cueCard.topic}</h3>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <p className="text-xs font-semibold text-amber-700 mb-2">You should say:</p>
          <ul className="space-y-1.5">
            {cueCard.points.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-900">
                <span className="text-amber-400 mt-0.5">▪</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {phase === 'cue' && (
          <button onClick={startPrep}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3 rounded-xl font-bold transition-colors text-lg">
            ▶ Start 1-Minute Preparation
          </button>
        )}

        {phase === 'prep' && (
          <div className="text-center bg-brand-50 border border-brand-200 rounded-xl p-6">
            <p className="text-brand-700 font-bold text-lg mb-2">📝 Preparation Time</p>
            <p className="text-5xl font-mono font-black text-brand-600 mb-2">{prepTime}s</p>
            <p className="text-brand-600 text-sm">Make notes below while you prepare</p>
            <textarea rows={3} placeholder="Jot down your key points..." className="mt-3 w-full border border-brand-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
        )}

        {(phase === 'speak' || phase === 'done') && (
          <div className="text-center bg-green-50 border border-green-300 rounded-xl p-6">
            <p className="text-green-700 font-bold text-lg mb-2">🎤 Now Speak!</p>
            <p className="text-green-600 text-sm mb-4">Speak for 1–2 minutes about the topic above.</p>
            <p className="text-gray-500 text-xs mb-3">Follow-up: <span className="font-medium text-gray-700 italic">"{cueCard.followUp}"</span></p>
            <button onClick={() => setShowSample(s => !s)}
              className="bg-white border border-green-300 text-green-700 px-4 py-2 rounded-lg text-sm hover:bg-green-50">
              {showSample ? 'Hide' : '👁 View'} Sample Answer
            </button>
            {showSample && (
              <div className="mt-3 bg-white border border-green-200 rounded-lg p-4 text-left">
                <p className="text-xs font-bold text-green-700 mb-2">Sample Band 7+ Answer:</p>
                <p className="text-sm text-gray-700 leading-relaxed italic">"{cueCard.sampleAnswer}"</p>
                <div className="mt-3 pt-3 border-t border-green-100">
                  <p className="text-xs font-bold text-green-700 mb-2">Band Tips:</p>
                  <ul className="space-y-1">
                    {cueCard.bandTips.map((tip, i) => <li key={i} className="text-xs text-gray-600 flex gap-2"><span className="text-green-400">•</span>{tip}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Part3Panel({ questions }: { questions: SpeakingQuestion[] }) {
  const [showSample, setShowSample] = useState<Record<number, boolean>>({});
  const [expanded, setExpanded] = useState<number>(0);

  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-sm text-purple-800 font-medium">💬 Part 3: Two-Way Discussion (4–5 minutes)</p>
        <p className="text-xs text-purple-600 mt-1">These are abstract, open-ended questions. Aim for extended, well-reasoned answers (30–60 seconds each).</p>
      </div>
      {questions.map((q, i) => (
        <div key={q.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <button onClick={() => setExpanded(expanded === i ? -1 : i)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</span>
              <p className="text-gray-800 font-medium">{q.question}</p>
            </div>
            <span className="text-gray-400 text-lg ml-2">{expanded === i ? '▲' : '▼'}</span>
          </button>
          {expanded === i && (
            <div className="px-5 pb-5">
              {q.keyPhrases && (
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {q.keyPhrases.map(p => <span key={p} className="bg-purple-50 border border-purple-200 text-purple-700 text-xs px-2 py-0.5 rounded">{p}</span>)}
                </div>
              )}
              <button onClick={() => setShowSample(p => ({ ...p, [q.id]: !p[q.id] }))}
                className="text-xs text-green-700 border border-green-200 px-3 py-1.5 rounded hover:bg-green-50 mb-2">
                {showSample[q.id] ? 'Hide' : '👁 Show'} Sample Answer
              </button>
              {showSample[q.id] && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-gray-700 leading-relaxed italic">"{q.sampleAnswer}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function IELTSSpeakingClient({ test, onComplete }: Props) {
  const [activePart, setActivePart] = useState(0);
  const parts = test.parts;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0a1628] text-white shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-brand-400 font-semibold text-sm uppercase tracking-wide">IELTS Speaking</span>
            <span className="ml-3 text-gray-300 text-sm capitalize">{test.level} · Band {test.bandTarget}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-300 text-sm">{test.totalTime}</span>
            <button onClick={onComplete} className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              Finish Speaking
            </button>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 pb-2 flex gap-2">
          {parts.map((p, i) => (
            <button key={i} onClick={() => setActivePart(i)}
              className={`px-4 py-1.5 rounded-t text-sm font-medium transition-colors ${activePart === i ? 'bg-white text-[#0a1628]' : 'text-gray-300 hover:text-white'}`}>
              Part {p.partNumber}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {activePart === 0 && parts[0].questions && (
          <Part1Panel questions={parts[0].questions} />
        )}
        {activePart === 1 && parts[1].cueCard && (
          <Part2Panel cueCard={parts[1].cueCard} />
        )}
        {activePart === 2 && parts[2].discussionQuestions && (
          <Part3Panel questions={parts[2].discussionQuestions} />
        )}

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          {activePart > 0 && (
            <button onClick={() => setActivePart(activePart - 1)}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200">
              ← Part {activePart}
            </button>
          )}
          {activePart < 2 && (
            <button onClick={() => setActivePart(activePart + 1)}
              className="ml-auto bg-[#0a1628] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0d1b2e]">
              Part {activePart + 2} →
            </button>
          )}
          {activePart === 2 && (
            <button onClick={onComplete}
              className="ml-auto bg-brand-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-600">
              See Results →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
