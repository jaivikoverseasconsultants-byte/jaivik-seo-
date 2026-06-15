'use client';

import { useState, useEffect, useRef } from 'react';
import { WritingTest, WritingTask } from '@/data/ielts-writing';
import WritingChart from '@/components/WritingChart';

interface Props {
  test: WritingTest;
  onComplete: (responses: { task1: string; task2: string }) => void;
}

function TaskPanel({ task, onSave }: { task: WritingTask; onSave: (text: string) => void }) {
  const [text, setText] = useState('');
  const [showSample, setShowSample] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const isEnough = wordCount >= task.minWords;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-[#0a1628] to-[#1a2e4a] text-white">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-brand-500 text-white text-xs font-bold px-2 py-0.5 rounded">Task {task.taskNumber}</span>
          <span className="text-brand-300 text-xs">{task.timeMinutes} minutes · {task.minWords}+ words</span>
        </div>
        <h3 className="font-bold text-lg">{task.title}</h3>
      </div>

      <div className="p-5">
        {/* Prompt */}
        {/* Task 1 chart — rendered ABOVE the amber prompt box */}
        {task.chartKey && (
          <WritingChart
            chartKey={task.chartKey}
            className="mb-4 bg-white border border-gray-200 rounded-xl p-3 shadow-sm"
          />
        )}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mb-4">
          <p className="text-sm text-gray-800 leading-relaxed">{task.prompt}</p>
        </div>

        {/* Word count and tips toggle */}
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-semibold ${isEnough ? 'text-green-600' : 'text-orange-500'}`}>
            {wordCount} words {isEnough ? '✓' : `(need ${task.minWords - wordCount} more)`}
          </span>
          <div className="flex gap-2">
            <button onClick={() => setShowTips(t => !t)} className="text-xs text-brand-600 hover:text-brand-700 border border-brand-200 px-2 py-1 rounded hover:bg-brand-50">
              💡 Band Tips
            </button>
            <button onClick={() => setShowSample(s => !s)} className="text-xs text-green-700 hover:text-green-800 border border-green-200 px-2 py-1 rounded hover:bg-green-50">
              📄 Sample Answer
            </button>
          </div>
        </div>

        {showTips && (
          <div className="mb-3 bg-brand-50 border border-brand-200 rounded-lg p-4">
            <p className="text-xs font-bold text-brand-800 mb-2">🎯 Band Tips</p>
            <ul className="space-y-1.5">
              {task.bandTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-brand-700">
                  <span className="mt-0.5 text-brand-400">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
            {task.keyVocabulary && (
              <div className="mt-3 pt-3 border-t border-brand-200">
                <p className="text-xs font-bold text-brand-800 mb-1.5">📚 Key Vocabulary</p>
                <div className="flex flex-wrap gap-1.5">
                  {task.keyVocabulary.map(v => (
                    <span key={v} className="bg-white border border-brand-200 text-brand-700 text-xs px-2 py-0.5 rounded">{v}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {showSample && (
          <div className="mb-3 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-xs font-bold text-green-800 mb-2">✍️ Sample Band 7+ Answer</p>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{task.sampleAnswer}</p>
          </div>
        )}

        {/* Writing area */}
        <textarea
          value={text}
          onChange={e => { setText(e.target.value); onSave(e.target.value); }}
          rows={12}
          placeholder={`Write your Task ${task.taskNumber} response here...`}
          className="w-full border border-gray-300 rounded-xl p-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none leading-relaxed"
        />
      </div>
    </div>
  );
}

export default function IELTSWritingClient({ test, onComplete }: Props) {
  const [task1Text, setTask1Text] = useState('');
  const [task2Text, setTask2Text] = useState('');
  const [activeTask, setActiveTask] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 min total
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); onComplete({ task1: task1Text, task2: task2Text }); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, []); // eslint-disable-line

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const handleFinish = () => {
    clearInterval(timerRef.current!);
    onComplete({ task1: task1Text, task2: task2Text });
  };

  const t1Words = task1Text.trim() === '' ? 0 : task1Text.trim().split(/\s+/).length;
  const t2Words = task2Text.trim() === '' ? 0 : task2Text.trim().split(/\s+/).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-[#0a1628] text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-brand-400 font-semibold text-sm uppercase tracking-wide">IELTS Writing</span>
            <span className="ml-3 text-gray-300 text-sm capitalize">{test.level} · Band {test.bandTarget}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-sm">T1: {t1Words}w · T2: {t2Words}w</span>
            <span className={`font-mono text-lg font-bold px-3 py-1 rounded ${timeLeft < 600 ? 'bg-red-600 animate-pulse' : 'bg-[#1a2e4a]'}`}>
              ⏱ {formatTime(timeLeft)}
            </span>
            <button onClick={handleFinish} className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              Finish Writing
            </button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 pb-2 flex gap-2">
          {['Task 1 (20 min)', 'Task 2 (40 min)'].map((label, i) => (
            <button key={i} onClick={() => setActiveTask(i)}
              className={`px-4 py-1.5 rounded-t text-sm font-medium transition-colors ${activeTask === i ? 'bg-white text-[#0a1628]' : 'text-gray-300 hover:text-white'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3">
          <span className="text-blue-500 text-xl">ℹ️</span>
          <div className="text-sm text-blue-800">
            <strong>Writing Test Tips:</strong> Spend ~20 minutes on Task 1 and ~40 minutes on Task 2. Task 2 carries more weight.
            Use the Sample Answer and Band Tips buttons for guidance.
          </div>
        </div>

        {activeTask === 0 ? (
          <TaskPanel task={test.tasks[0]} onSave={setTask1Text} />
        ) : (
          <TaskPanel task={test.tasks[1]} onSave={setTask2Text} />
        )}

        <div className="mt-6 flex justify-between items-center">
          {activeTask === 0 ? (
            <button onClick={() => setActiveTask(1)} className="ml-auto bg-[#0a1628] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0d1b2e] transition-colors">
              Go to Task 2 →
            </button>
          ) : (
            <button onClick={() => setActiveTask(0)} className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">
              ← Back to Task 1
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
