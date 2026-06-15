'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ListeningTest, ListeningQuestion } from '@/data/ielts-listening';
import { calcListeningBand } from '@/data/ielts-listening';

// ─── Types ────────────────────────────────────────────────────────────────────

type PlayerState = 'idle' | 'playing' | 'paused' | 'done';

interface OuterProps {
  test: ListeningTest;
  onComplete: (score: number, band: string, answers: Record<number, string>) => void;
}

interface SectionProps {
  section: ListeningTest['sections'][0];
  sectionIndex: number;
  totalSections: number;
  answers: Record<number, string>;
  onAnswer: (id: number, value: string) => void;
  submitted: boolean;
  isCorrect: (q: ListeningQuestion) => boolean | null;
  showExplanation: Record<number, boolean>;
  onToggleExplanation: (id: number) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseTranscript(raw: string): { speaker: string; text: string }[] {
  return raw
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(l => {
      const m = l.match(/^([A-Za-z][A-Za-z ]{1,24}):\s*(.+)$/);
      return m ? { speaker: m[1].trim(), text: m[2].trim() } : { speaker: '', text: l };
    });
}

function fmtTime(s: number) {
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

function estimateDuration(lines: { text: string }[]) {
  const words = lines.reduce((sum, l) => sum + l.text.split(/\s+/).length, 0);
  return Math.max(45, Math.ceil((words / 128) * 60)); // 128 wpm at rate 0.85
}

// ─── Section View (audio player + questions) ──────────────────────────────────

function SectionView({
  section, sectionIndex, totalSections,
  answers, onAnswer, submitted, isCorrect,
  showExplanation, onToggleExplanation,
}: SectionProps) {
  const [playerState, setPlayerState]   = useState<PlayerState>('idle');
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [currentLineIdx, setCurrentLineIdx] = useState(-1);
  const [elapsedSec, setElapsedSec]     = useState(0);
  const [notes, setNotes]               = useState('');
  const [showTranscript, setShowTranscript] = useState(false);
  const [ttsUnsupported, setTtsUnsupported] = useState(false);

  const voicesRef      = useRef<SpeechSynthesisVoice[]>([]);
  const generationRef  = useRef(0);
  const timerRef       = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerStartRef  = useRef(0);
  const timerOffsetRef = useRef(0);
  const speakerMapRef  = useRef<Map<string, number>>(new Map());
  const activeLineRef  = useRef<HTMLParagraphElement | null>(null);

  const lines           = useMemo(() => parseTranscript(section.transcript), [section.transcript]);
  const estimatedDurSec = useMemo(() => estimateDuration(lines), [lines]);

  // ── Load voices ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setTtsUnsupported(true);
      return;
    }
    const load = () => { voicesRef.current = window.speechSynthesis.getVoices(); };
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', load);
      window.speechSynthesis.cancel();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ── Scroll active transcript line into view ───────────────────────────────
  useEffect(() => {
    if (showTranscript && activeLineRef.current) {
      activeLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentLineIdx, showTranscript]);

  // ── Timer helpers ─────────────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerStartRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = timerOffsetRef.current + (Date.now() - timerStartRef.current) / 1000;
      setElapsedSec(Math.min(elapsed, estimatedDurSec));
    }, 300);
  }, [estimatedDurSec]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  // ── Voice / pitch resolver ────────────────────────────────────────────────
  const resolveVoice = useCallback((speaker: string): { voice: SpeechSynthesisVoice | null; pitch: number } => {
    const all = voicesRef.current;
    const gb  = all.filter(v => v.lang === 'en-GB');
    const en  = all.filter(v => v.lang.startsWith('en'));
    const pool = gb.length > 0 ? gb : en.length > 0 ? en : all;

    if (!speaker) return { voice: pool[0] ?? null, pitch: 1.0 };

    if (!speakerMapRef.current.has(speaker)) {
      speakerMapRef.current.set(speaker, speakerMapRef.current.size);
    }
    const idx   = speakerMapRef.current.get(speaker)!;
    const voice = pool.length > 1 ? (pool[idx % pool.length] ?? null) : (pool[0] ?? null);
    const pitch = idx % 2 === 0 ? 1.0 : 1.12; // subtle pitch difference for second speaker
    return { voice, pitch };
  }, []);

  // ── Core playback ─────────────────────────────────────────────────────────
  const startPlayback = useCallback((fromLine: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const gen = ++generationRef.current;
    speakerMapRef.current.clear();

    function speakLine(idx: number) {
      if (generationRef.current !== gen) return;

      if (idx >= lines.length) {
        stopTimer();
        setPlayerState('done');
        setHasPlayedOnce(true);
        setCurrentLineIdx(-1);
        timerOffsetRef.current = 0;
        return;
      }

      const { speaker, text } = lines[idx];
      const utt = new SpeechSynthesisUtterance(text);
      utt.rate = 0.85;
      utt.lang = 'en-GB';
      const { voice, pitch } = resolveVoice(speaker);
      if (voice) utt.voice = voice;
      utt.pitch = pitch;

      utt.onstart = () => {
        if (generationRef.current !== gen) return;
        setCurrentLineIdx(idx);
      };
      utt.onend = () => {
        if (generationRef.current !== gen) return;
        speakLine(idx + 1);
      };
      utt.onerror = (e) => {
        if (generationRef.current !== gen) return;
        const err = (e as SpeechSynthesisErrorEvent).error;
        if (err === 'interrupted' || err === 'canceled') return;
        speakLine(idx + 1); // skip errored utterance, continue
      };

      window.speechSynthesis.speak(utt);
    }

    speakLine(fromLine);
  }, [lines, resolveVoice, stopTimer]);

  // ── Controls ──────────────────────────────────────────────────────────────
  const handlePlay = useCallback(() => {
    timerOffsetRef.current = 0;
    setElapsedSec(0);
    setCurrentLineIdx(-1);
    setPlayerState('playing');
    startTimer();
    startPlayback(0);
  }, [startPlayback, startTimer]);

  const handlePause = useCallback(() => {
    window.speechSynthesis.pause();
    stopTimer();
    timerOffsetRef.current = elapsedSec;
    setPlayerState('paused');
  }, [stopTimer, elapsedSec]);

  const handleResume = useCallback(() => {
    window.speechSynthesis.resume();
    startTimer();
    setPlayerState('playing');
  }, [startTimer]);

  const handleReplay = useCallback(() => {
    timerOffsetRef.current = 0;
    setCurrentLineIdx(-1);
    setElapsedSec(0);
    setPlayerState('playing');
    setTimeout(() => { startTimer(); startPlayback(0); }, 150);
  }, [startPlayback, startTimer]);

  // ── Derived state ─────────────────────────────────────────────────────────
  const progress    = estimatedDurSec > 0 ? Math.min(100, Math.round((elapsedSec / estimatedDurSec) * 100)) : 0;
  const currentLine = currentLineIdx >= 0 && currentLineIdx < lines.length ? lines[currentLineIdx] : null;
  const isPlaying   = playerState === 'playing';
  const isPaused    = playerState === 'paused';
  const isDone      = playerState === 'done';
  const isIdle      = playerState === 'idle';
  // Show questions once listened at least once, or if already submitted
  const showQuestions = hasPlayedOnce || submitted;

  return (
    <div className="grid lg:grid-cols-2 gap-6">

      {/* ── LEFT: Audio player ──────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-[#0a1628] to-[#1a2e4a] text-white">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-brand-300 uppercase tracking-widest">
              Recording {sectionIndex + 1} of {totalSections}
            </span>
            <span className="text-[11px] text-gray-400 flex items-center gap-1">🎧 IELTS Listening</span>
          </div>
          <h2 className="text-lg font-bold leading-tight">{section.title}</h2>
          <p className="text-sm text-blue-200 mt-0.5">{section.scenario}</p>
        </div>

        <div className="p-5 space-y-4">

          {/* ── Fallback: TTS not supported ─────────────────────────────── */}
          {ttsUnsupported && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-amber-500 text-lg flex-shrink-0 mt-0.5">⚠️</span>
                <div>
                  <p className="text-sm font-semibold text-amber-800">Audio not supported in this browser</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Your browser doesn&apos;t support audio playback. Please read the transcript below to answer the questions.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTranscript(t => !t)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-amber-300 hover:bg-amber-50 text-amber-800 rounded-lg text-sm font-semibold transition-colors"
              >
                <span>📄 {showTranscript ? 'Hide' : 'Read'} Transcript</span>
                <span className="text-amber-500">{showTranscript ? '▲' : '▼'}</span>
              </button>
              {showTranscript && (
                <div className="bg-white border border-amber-100 rounded-xl p-4 max-h-80 overflow-y-auto text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {section.transcript}
                </div>
              )}
            </div>
          )}

          {!ttsUnsupported && (
            <>

              {/* ── IDLE: Pre-play ──────────────────────────────────────── */}
              {isIdle && (
                <div className="flex flex-col items-center text-center py-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 border-4 border-brand-300 flex items-center justify-center mb-5 shadow-inner">
                    <span className="text-5xl">🎧</span>
                  </div>
                  <p className="text-gray-800 font-semibold text-sm mb-1">Ready to play Recording {sectionIndex + 1}</p>
                  <p className="text-gray-500 text-xs mb-5 max-w-64 leading-relaxed">
                    Click Play to begin. You will hear the recording once.<br />
                    Take notes as you listen — questions appear when it ends.
                  </p>
                  <button
                    onClick={handlePlay}
                    className="inline-flex items-center gap-2.5 bg-[#0a1628] hover:bg-[#0d1b2e] text-white font-bold px-8 py-4 rounded-2xl transition-colors shadow-lg text-base"
                  >
                    <span className="text-lg">▶</span>
                    Play Recording
                  </button>
                  <p className="text-xs text-gray-400 mt-3">Estimated: ~{fmtTime(estimatedDurSec)}</p>
                </div>
              )}

              {/* ── PLAYING / PAUSED: Progress + notes ─────────────────── */}
              {(isPlaying || isPaused) && (
                <div className="space-y-4">

                  {/* Progress bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-mono text-gray-600">{fmtTime(Math.round(elapsedSec))}</span>
                      <span className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${isPlaying ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {isPlaying ? '🔊 Playing' : '⏸ Paused'}
                      </span>
                      <span className="font-mono text-gray-400">~{fmtTime(estimatedDurSec)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${isPlaying ? 'bg-gradient-to-r from-brand-500 to-brand-600' : 'bg-amber-400'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-[11px] text-gray-400">
                      <span>Line {Math.max(1, currentLineIdx + 1)} of {lines.length}</span>
                      <span>{progress}% complete</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2">
                    {isPlaying ? (
                      <button
                        onClick={handlePause}
                        className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors border border-gray-200"
                      >
                        ⏸ Pause
                      </button>
                    ) : (
                      <button
                        onClick={handleResume}
                        className="flex items-center gap-1.5 bg-[#0a1628] hover:bg-[#0d1b2e] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
                      >
                        ▶ Resume
                      </button>
                    )}
                    <span className="text-xs text-gray-400 ml-1">
                      {isPlaying ? 'Listening… take notes below' : 'Paused — press Resume to continue'}
                    </span>
                  </div>

                  {/* Currently speaking */}
                  {currentLine && (
                    <div className="bg-brand-50 border border-brand-200 rounded-xl px-4 py-3">
                      <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-1">
                        Now speaking{currentLine.speaker ? ` — ${currentLine.speaker}` : ''}
                      </p>
                      <p className="text-sm text-brand-900 italic leading-relaxed">
                        &ldquo;{currentLine.text}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Notes area */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      📝 Take Notes <span className="font-normal text-gray-400">(names, numbers, keywords)</span>
                    </label>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      rows={5}
                      placeholder="Jot rough notes while listening…&#10;e.g. Room: double sea view · £95/night · Checkout 1pm £20 extra"
                      className="w-full border border-gray-200 rounded-xl p-3 text-xs text-gray-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none bg-gray-50"
                    />
                  </div>
                </div>
              )}

              {/* ── DONE: Recording complete ─────────────────────────────── */}
              {isDone && (
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <p className="text-green-700 font-bold text-base mb-0.5">✅ Recording Complete</p>
                    <p className="text-green-600 text-sm">Questions are now visible on the right. Answer them now.</p>
                  </div>
                  <button
                    onClick={handleReplay}
                    className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:border-brand-400 hover:text-brand-700 text-gray-600 font-semibold py-2.5 rounded-xl text-sm transition-colors"
                  >
                    ↺ Replay Recording
                  </button>
                  {notes.trim() && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                      <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide mb-1.5">📝 Your notes</p>
                      <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">{notes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Transcript toggle — locked until first play ──────────── */}
              {!isIdle && (
                <div className="pt-2 border-t border-gray-100">
                  {hasPlayedOnce ? (
                    <>
                      <button
                        onClick={() => setShowTranscript(t => !t)}
                        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                      >
                        <span>📄 {showTranscript ? 'Hide' : 'Show'} Transcript</span>
                        <span className="text-xs text-gray-400">for reference after listening</span>
                      </button>
                      {showTranscript && (
                        <div className="mt-2 max-h-72 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-0.5">
                          {lines.map((l, i) => (
                            <p
                              key={i}
                              ref={i === currentLineIdx ? activeLineRef : null}
                              className={`text-sm leading-relaxed px-2 py-0.5 rounded transition-colors ${i === currentLineIdx ? 'bg-brand-100 text-brand-900 font-semibold' : 'text-gray-700'}`}
                            >
                              {l.speaker && <strong className="text-gray-900 mr-0.5">{l.speaker}:</strong>}
                              {' '}{l.text}
                            </p>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-1">
                      🔒 Transcript available after the recording finishes
                    </p>
                  )}
                </div>
              )}

            </>
          )}

        </div>
      </div>

      {/* ── RIGHT: Questions or placeholder ─────────────────────────────── */}
      <div>
        {!showQuestions ? (
          /* Placeholder while listening */
          <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-300 p-8 flex flex-col items-center justify-center min-h-64 text-center">
            {isIdle ? (
              <>
                <span className="text-5xl mb-3">❓</span>
                <p className="text-gray-500 font-medium text-sm">Questions appear after you play the recording</p>
              </>
            ) : (
              <>
                <span className="text-5xl mb-3 animate-pulse">👂</span>
                <p className="text-gray-700 font-semibold text-sm mb-1">Listen carefully</p>
                <p className="text-gray-400 text-xs max-w-52 leading-relaxed">
                  Questions will appear automatically when the recording ends
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {section.questions.map(q => {
              const correct = isCorrect(q);
              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-xl shadow-sm border p-5 ${submitted ? correct ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${submitted ? correct ? 'bg-green-500 text-white' : 'bg-red-500 text-white' : 'bg-[#0a1628] text-white'}`}>
                      {q.id}
                    </span>
                    <p className="text-gray-800 font-medium leading-snug">{q.question}</p>
                  </div>

                  {(q.type === 'mcq' || q.type === 'matching') && q.options && (
                    <div className="space-y-2 ml-10">
                      {q.options.map(opt => (
                        <label
                          key={opt}
                          className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${answers[q.id] === opt ? 'bg-brand-50 border border-brand-300' : 'hover:bg-gray-50'} ${submitted && opt === q.answer ? 'bg-green-100 border border-green-400' : ''}`}
                        >
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            value={opt}
                            checked={answers[q.id] === opt}
                            onChange={() => !submitted && onAnswer(q.id, opt)}
                            disabled={submitted}
                            className="text-brand-500"
                          />
                          <span className="text-sm text-gray-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'fill' && (
                    <div className="ml-10">
                      <input
                        type="text"
                        value={answers[q.id] || ''}
                        onChange={e => !submitted && onAnswer(q.id, e.target.value)}
                        disabled={submitted}
                        placeholder="Type your answer…"
                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 ${submitted ? correct ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                      />
                    </div>
                  )}

                  {submitted && (
                    <div className="ml-10 mt-3">
                      {!correct && (
                        <p className="text-sm text-green-700 font-medium">
                          ✓ Correct answer: <span className="font-bold">{q.answer}</span>
                        </p>
                      )}
                      {q.explanation && (
                        <>
                          <button
                            onClick={() => onToggleExplanation(q.id)}
                            className="text-xs text-brand-600 hover:text-brand-700 mt-1 underline"
                          >
                            {showExplanation[q.id] ? 'Hide' : 'Show'} explanation
                          </button>
                          {showExplanation[q.id] && (
                            <p className="text-xs text-gray-600 mt-1 bg-white p-2 rounded border border-gray-200">{q.explanation}</p>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Mini question navigator */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-2 font-medium">
                Questions {section.questions[0]?.id}–{section.questions[section.questions.length - 1]?.id}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {section.questions.map(q => (
                  <div
                    key={q.id}
                    className={`w-8 h-8 rounded text-xs font-medium flex items-center justify-center transition-colors ${answers[q.id] ? submitted ? isCorrect(q) ? 'bg-green-500 text-white' : 'bg-red-500 text-white' : 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {q.id}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function IELTSListeningClient({ test, onComplete }: OuterProps) {
  const [answers, setAnswers]             = useState<Record<number, string>>({});
  const [activeSection, setActiveSection] = useState(0);
  const [submitted, setSubmitted]         = useState(false);
  const [timeLeft, setTimeLeft]           = useState(test.timeMinutes * 60);
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

  const allQuestions  = test.sections.flatMap(s => s.questions);
  const answeredCount = Object.keys(answers).length;

  const isCorrect = (q: ListeningQuestion): boolean | null => {
    if (!submitted) return null;
    return (answers[q.id] || '').trim().toLowerCase() === q.answer.trim().toLowerCase();
  };

  const toggleExplanation = (id: number) => setShowExplanation(p => ({ ...p, [id]: !p[id] }));

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Sticky header ──────────────────────────────────────────────── */}
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
              <button
                onClick={handleSubmit}
                className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Submit Test
              </button>
            )}
          </div>
        </div>

        {/* Section tabs */}
        <div className="max-w-7xl mx-auto px-4 pb-2 flex gap-2 overflow-x-auto">
          {test.sections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(i)}
              className={`px-4 py-1.5 rounded-t text-sm font-medium whitespace-nowrap transition-colors ${activeSection === i ? 'bg-white text-[#0a1628]' : 'text-gray-300 hover:text-white'}`}
            >
              Section {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center gap-3">
          <span className="text-blue-500 text-lg flex-shrink-0">ℹ️</span>
          <p className="text-sm text-blue-800">
            <strong>Listening Test:</strong> Press Play in each section to hear the recording (via your browser&apos;s built-in TTS).
            Questions appear automatically once each recording ends. You have {test.timeMinutes} minutes total.
          </p>
        </div>

        {/* Render all sections but only show the active one — preserves audio state across tab switches */}
        {test.sections.map((s, i) => (
          <div key={s.id} className={activeSection !== i ? 'hidden' : ''}>
            <SectionView
              section={s}
              sectionIndex={i}
              totalSections={test.sections.length}
              answers={answers}
              onAnswer={handleAnswer}
              submitted={submitted}
              isCorrect={isCorrect}
              showExplanation={showExplanation}
              onToggleExplanation={toggleExplanation}
            />
          </div>
        ))}
      </div>

    </div>
  );
}
