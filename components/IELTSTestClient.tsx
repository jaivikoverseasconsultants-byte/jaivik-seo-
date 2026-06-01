'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { readingTests } from '@/data/ielts-reading';
import { listeningTests } from '@/data/ielts-listening';
import { writingTests } from '@/data/ielts-writing';
import { speakingTests } from '@/data/ielts-speaking';

const IELTSReadingClient = dynamic(() => import('@/components/IELTSReadingClient'), { ssr: false });
const IELTSListeningClient = dynamic(() => import('@/components/IELTSListeningClient'), { ssr: false });
const IELTSWritingClient = dynamic(() => import('@/components/IELTSWritingClient'), { ssr: false });
const IELTSSpeakingClient = dynamic(() => import('@/components/IELTSSpeakingClient'), { ssr: false });
const IELTSResultsClient = dynamic(() => import('@/components/IELTSResultsClient'), { ssr: false });

interface Props {
  level: string;
  section: string;
}

interface ResultState {
  name: string;
  score?: number;
  total?: number;
  band: string;
  completed: boolean;
}

export default function IELTSTestClient({ level, section }: Props) {
  const [phase, setPhase] = useState<'test' | 'results'>('test');
  const [results, setResults] = useState<ResultState[]>([]);
  const [overallBand, setOverallBand] = useState('');

  const finishReading = useCallback((score: number, band: string) => {
    const r: ResultState[] = [{ name: 'Reading', score, total: 40, band, completed: true }];
    setResults(r);
    setOverallBand(band);
    setPhase('results');
  }, []);

  const finishListening = useCallback((score: number, band: string) => {
    const r: ResultState[] = [{ name: 'Listening', score, total: 40, band, completed: true }];
    setResults(r);
    setOverallBand(band);
    setPhase('results');
  }, []);

  const finishWriting = useCallback(() => {
    const r: ResultState[] = [{ name: 'Writing', band: 'N/A', completed: true }];
    setResults(r);
    setOverallBand('N/A');
    setPhase('results');
  }, []);

  const finishSpeaking = useCallback(() => {
    const r: ResultState[] = [{ name: 'Speaking', band: 'N/A', completed: true }];
    setResults(r);
    setOverallBand('N/A');
    setPhase('results');
  }, []);

  const handleRetake = () => {
    setPhase('test');
    setResults([]);
    setOverallBand('');
  };

  if (phase === 'results') {
    return (
      <IELTSResultsClient
        level={level}
        section={section}
        results={results}
        overallBand={overallBand}
        onRetake={handleRetake}
      />
    );
  }

  if (section === 'reading') {
    const test = readingTests[level];
    if (!test) return <ErrorState level={level} section={section} />;
    return <IELTSReadingClient test={test} onComplete={finishReading} />;
  }

  if (section === 'listening') {
    const test = listeningTests[level];
    if (!test) return <ErrorState level={level} section={section} />;
    return <IELTSListeningClient test={test} onComplete={finishListening} />;
  }

  if (section === 'writing') {
    const test = writingTests[level];
    if (!test) return <ErrorState level={level} section={section} />;
    return <IELTSWritingClient test={test} onComplete={finishWriting} />;
  }

  if (section === 'speaking') {
    const test = speakingTests[level];
    if (!test) return <ErrorState level={level} section={section} />;
    return <IELTSSpeakingClient test={test} onComplete={finishSpeaking} />;
  }

  // Full test: all 4 sections sequentially
  if (section === 'full') {
    return <FullTestClient level={level} onComplete={(band, r) => { setOverallBand(band); setResults(r); setPhase('results'); }} />;
  }

  return <ErrorState level={level} section={section} />;
}

function ErrorState({ level, section }: { level: string; section: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <p className="text-6xl mb-4">🚧</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Test Not Found</h2>
        <p className="text-gray-500">Level: {level} · Section: {section}</p>
        <a href="/mock-test" className="mt-4 inline-block bg-brand-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-600">
          ← Back to Tests
        </a>
      </div>
    </div>
  );
}

interface FullTestState {
  currentSection: 'listening' | 'reading' | 'writing' | 'speaking' | 'done';
  sectionResults: ResultState[];
}

function FullTestClient({ level, onComplete }: { level: string; onComplete: (band: string, results: ResultState[]) => void }) {
  const [state, setState] = useState<FullTestState>({ currentSection: 'listening', sectionResults: [] });

  const addResult = (result: ResultState, next: FullTestState['currentSection']) => {
    const newResults = [...state.sectionResults, result];
    if (next === 'done') {
      const bandsWithScores = newResults.filter(r => r.band !== 'N/A').map(r => parseFloat(r.band));
      const overall = bandsWithScores.length > 0
        ? Math.round(bandsWithScores.reduce((a, b) => a + b, 0) / bandsWithScores.length * 2) / 2
        : 0;
      onComplete(overall.toFixed(1), newResults);
    } else {
      setState({ currentSection: next, sectionResults: newResults });
    }
  };

  if (state.currentSection === 'listening') {
    const test = listeningTests[level];
    return test ? <IELTSListeningClient test={test} onComplete={(score, band) => addResult({ name: 'Listening', score, total: 40, band, completed: true }, 'reading')} /> : null;
  }
  if (state.currentSection === 'reading') {
    const test = readingTests[level];
    return test ? <IELTSReadingClient test={test} onComplete={(score, band) => addResult({ name: 'Reading', score, total: 40, band, completed: true }, 'writing')} /> : null;
  }
  if (state.currentSection === 'writing') {
    const test = writingTests[level];
    return test ? <IELTSWritingClient test={test} onComplete={() => addResult({ name: 'Writing', band: 'N/A', completed: true }, 'speaking')} /> : null;
  }
  if (state.currentSection === 'speaking') {
    const test = speakingTests[level];
    return test ? <IELTSSpeakingClient test={test} onComplete={() => addResult({ name: 'Speaking', band: 'N/A', completed: true }, 'done')} /> : null;
  }
  return null;
}
