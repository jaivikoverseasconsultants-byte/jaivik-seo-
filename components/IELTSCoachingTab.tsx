'use client';

import { useState, useEffect } from 'react';

// ── Data ──────────────────────────────────────────────────────────────────────

const TRAINERS = [
  { id: 1, name: 'Priya Sharma', city: 'Delhi', experience: '6 years', examTypes: ['IELTS Academic', 'IELTS General'], timing: ['Morning 6–10am', 'Evening 6–10pm'], avgImprovement: '1.5 bands in 60 days', fee: 4500, rating: 4.9, reviews: 127, students: 340, demoAvailable: true, bio: 'Ex-British Council examiner. Specialized in Writing Task 2 and Speaking fluency. 95% students achieve target band.', slots: ['Mon 7am', 'Wed 7am', 'Fri 7am', 'Tue 7pm', 'Thu 7pm'], results: [{ student: 'Rahul M', from: 5.5, to: 7.0, days: 60 }, { student: 'Sneha K', from: 6.0, to: 7.5, days: 45 }, { student: 'Amit P', from: 5.0, to: 6.5, days: 75 }] },
  { id: 2, name: 'Rajesh Kumar', city: 'Noida', experience: '4 years', examTypes: ['IELTS Academic', 'PTE Academic'], timing: ['Afternoon 12–4pm', 'Evening 6–10pm'], avgImprovement: '1.0 band in 45 days', fee: 3500, rating: 4.7, reviews: 89, students: 210, demoAvailable: true, bio: 'PTE and IELTS specialist. Focus on exam strategy and time management. Flexible batch sizes.', slots: ['Mon 2pm', 'Wed 2pm', 'Sat 2pm', 'Tue 7pm', 'Sun 7pm'], results: [{ student: 'Pooja S', from: 5.0, to: 6.0, days: 45 }, { student: 'Karan T', from: 6.0, to: 7.0, days: 60 }] },
  { id: 3, name: 'Anita Verma', city: 'Ghaziabad', experience: '8 years', examTypes: ['IELTS Academic', 'IELTS General', 'TOEFL'], timing: ['Morning 6–10am', 'Afternoon 12–4pm'], avgImprovement: '2.0 bands in 90 days', fee: 6000, rating: 5.0, reviews: 203, students: 520, demoAvailable: true, bio: 'Senior IELTS trainer with 8 years experience. Expert in all 4 modules. Personalized study plans for every student.', slots: ['Mon 8am', 'Tue 8am', 'Wed 8am', 'Thu 8am', 'Fri 8am', 'Mon 1pm', 'Wed 1pm'], results: [{ student: 'Divya R', from: 5.5, to: 7.5, days: 90 }, { student: 'Rohit M', from: 6.0, to: 8.0, days: 75 }, { student: 'Priya K', from: 5.0, to: 7.0, days: 60 }] },
  { id: 4, name: 'Mohammed Irfan', city: 'Delhi', experience: '3 years', examTypes: ['IELTS General', 'PTE Academic'], timing: ['Evening 6–10pm', 'Flexible'], avgImprovement: '1.0 band in 30 days', fee: 2800, rating: 4.6, reviews: 54, students: 98, demoAvailable: false, bio: 'Affordable and result-oriented coaching. Specializes in IELTS General for Canada PR pathway students.', slots: ['Mon 7pm', 'Tue 7pm', 'Wed 7pm', 'Thu 7pm', 'Fri 7pm'], results: [{ student: 'Salman K', from: 5.5, to: 6.5, days: 30 }] },
  { id: 5, name: 'Sunita Rawat', city: 'Noida', experience: '5 years', examTypes: ['IELTS Academic', 'IELTS General'], timing: ['Morning 6–10am', 'Flexible'], avgImprovement: '1.5 bands in 60 days', fee: 4000, rating: 4.8, reviews: 112, students: 280, demoAvailable: true, bio: 'Dedicated IELTS coach with focus on Reading and Listening strategies. Small batch sizes for personalized attention.', slots: ['Mon 6am', 'Wed 6am', 'Fri 6am', 'Sat 9am', 'Sun 9am'], results: [{ student: 'Neha G', from: 6.0, to: 7.5, days: 60 }, { student: 'Vikram S', from: 5.5, to: 7.0, days: 75 }] },
];

type Trainer = typeof TRAINERS[0];

const WIZARD = [
  { q: 'Which exam are you preparing for?', key: 'exam', options: ['IELTS Academic', 'IELTS General', 'PTE Academic', 'TOEFL'] },
  { q: 'What is your current band/score?', key: 'band', options: ['Below 5.0', '5.0–5.5', '6.0–6.5', '7.0+'] },
  { q: 'What is your target band/score?', key: 'target', options: ['6.0', '6.5', '7.0', '7.5', '8.0+'] },
  { q: 'Which timing do you prefer for classes?', key: 'timing', options: ['Morning 6–10am', 'Afternoon 12–4pm', 'Evening 6–10pm', 'Flexible'] },
  { q: 'What type of coaching do you need?', key: 'classType', options: ['Full Course (all 4 modules)', 'Speaking only', 'Writing only', 'Reading + Listening'] },
  { q: 'What is your monthly budget?', key: 'budget', options: ['Under ₹3,000', '₹3,000–5,000', '₹5,000–8,000', '₹8,000+'] },
];

const DUMMY_REVIEWS = [
  { name: 'Meera S.', rating: 5, date: 'Mar 2026', text: 'Excellent coaching! My band improved from 6.0 to 7.5 in just 45 days. The mock tests were very similar to the actual exam.' },
  { name: 'Arjun P.', rating: 5, date: 'Feb 2026', text: 'Very professional and dedicated trainer. Writing Task 2 strategies were a game changer for me. Highly recommended!' },
  { name: 'Kavya R.', rating: 4, date: 'Jan 2026', text: 'Good classes, very punctual and organized. Speaking modules especially helped me gain confidence. Would enroll again.' },
];

type Phase = 'wizard' | 'results' | 'profile' | 'enroll' | 'success';

function budgetMax(b: string): number {
  if (b === 'Under ₹3,000') return 3000;
  if (b === '₹3,000–5,000') return 5000;
  if (b === '₹5,000–8,000') return 8000;
  return Infinity;
}

function filterTrainers(answers: Record<string, string>): Trainer[] {
  return TRAINERS.filter(t => {
    const examOk = !answers.exam || t.examTypes.includes(answers.exam);
    const timingOk = !answers.timing || answers.timing === 'Flexible' || t.timing.includes(answers.timing) || t.timing.includes('Flexible');
    const budgetOk = !answers.budget || t.fee <= budgetMax(answers.budget);
    return examOk && timingOk && budgetOk;
  });
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'text-[#F5A623]' : 'text-white/20'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function IELTSCoachingTab() {
  const [phase, setPhase] = useState<Phase>('wizard');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [animKey, setAnimKey] = useState(0);

  const [matched, setMatched] = useState<Trainer[]>([]);
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [enrollNum, setEnrollNum] = useState('');

  function pickAnswer(key: string, val: string) {
    const next = { ...answers, [key]: val };
    setAnswers(next);
    if (step < WIZARD.length - 1) {
      setAnimKey(k => k + 1);
      setStep(s => s + 1);
    } else {
      // Last step — go to results
      setMatched(filterTrainers(next));
      setPhase('results');
    }
  }

  function goBack() {
    if (step > 0) { setAnimKey(k => k + 1); setStep(s => s - 1); }
  }

  function openEnroll(t: Trainer) {
    setTrainer(t);
    setSelectedSlots(t.slots.slice(0, 2));
    setEnrollNum(`JO-IELTS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setPhase('enroll');
  }

  function confirmEnroll() {
    if (!trainer) return;
    const data = {
      enrollmentNumber: enrollNum,
      trainer: trainer.name,
      slots: selectedSlots,
      startDate: new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      enrolledAt: new Date().toISOString(),
    };
    const prev = JSON.parse(localStorage.getItem('joc_ielts_enrollments') || '[]');
    localStorage.setItem('joc_ielts_enrollments', JSON.stringify([...prev, data]));
    setPhase('success');
  }

  function resetWizard() {
    setStep(0); setAnswers({}); setAnimKey(k => k + 1);
    setPhase('wizard'); setTrainer(null); setSelectedSlots([]);
  }

  // ── WIZARD ─────────────────────────────────────────────────────────────────
  if (phase === 'wizard') {
    const q = WIZARD[step];
    const pct = Math.round(((step) / WIZARD.length) * 100);
    return (
      <div className="max-w-xl mx-auto">
        <style>{`
          @keyframes slideQ { from { opacity:0; transform:translateX(28px) } to { opacity:1; transform:translateX(0) } }
          .slide-q { animation: slideQ 0.28s cubic-bezier(.4,0,.2,1) forwards; }
        `}</style>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-[#00C9A7] uppercase tracking-widest">Find Your Ideal Trainer</p>
            <p className="text-xs text-blue-400/60">Step {step + 1} of {WIZARD.length}</p>
          </div>
          <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#00C9A7] to-[#F5A623] rounded-full transition-all duration-500"
              style={{ width: `${pct + (100 / WIZARD.length)}%` }} />
          </div>
        </div>

        {/* Question */}
        <div key={animKey} className="slide-q">
          <h2 className="text-xl font-black text-white mb-6 leading-snug">{q.q}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {q.options.map(opt => (
              <button key={opt} onClick={() => pickAnswer(q.key, opt)}
                className="group px-5 py-4 rounded-2xl border border-white/10 bg-white/3 hover:bg-[#F5A623]/10 hover:border-[#F5A623]/50 text-left text-sm font-semibold text-blue-100 hover:text-white transition-all">
                <span className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full border border-white/20 group-hover:border-[#F5A623] flex items-center justify-center shrink-0 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-transparent group-hover:bg-[#F5A623] transition-colors" />
                  </span>
                  {opt}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Back */}
        {step > 0 && (
          <button onClick={goBack}
            className="mt-6 flex items-center gap-1.5 text-sm text-blue-400/60 hover:text-blue-200 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous question
          </button>
        )}
      </div>
    );
  }

  // ── RESULTS ────────────────────────────────────────────────────────────────
  if (phase === 'results') {
    return (
      <div>
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-black text-white">
              {matched.length} Trainers Matched
            </h2>
            <p className="text-sm text-blue-300/60 mt-0.5">
              {answers.exam} · {answers.timing} · {answers.budget}
            </p>
          </div>
          <button onClick={resetWizard}
            className="text-sm text-[#00C9A7] hover:text-white border border-[#00C9A7]/40 hover:border-[#00C9A7] px-4 py-2 rounded-xl transition-all">
            ↺ Retake Quiz
          </button>
        </div>

        {matched.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-white font-bold mb-1">No exact matches</p>
            <p className="text-sm text-blue-400/50 mb-4">Try adjusting your timing or budget preferences.</p>
            <button onClick={resetWizard}
              className="px-6 py-2.5 bg-[#F5A623] text-white rounded-xl font-semibold text-sm">
              Retake Quiz
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {matched.map(t => (
              <TrainerCard key={t.id} trainer={t}
                onView={() => { setTrainer(t); setPhase('profile'); }}
                onEnroll={() => openEnroll(t)} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── PROFILE MODAL ──────────────────────────────────────────────────────────
  if (phase === 'profile' && trainer) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: 'rgba(6,14,31,0.97)' }}>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <div className="sticky top-0 z-10 border-b border-white/8 px-4 sm:px-8 py-4 flex items-center gap-3"
            style={{ background: '#0B1437' }}>
            <button onClick={() => setPhase('results')}
              className="flex items-center gap-1.5 text-sm text-blue-300 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <span className="text-white font-bold">{trainer.name}</span>
          </div>

          <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 pb-28">
            {/* Avatar + basic info */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#F5A623]/30 to-[#00C9A7]/30 border-2 border-[#F5A623]/60 flex items-center justify-center text-2xl font-black text-white shrink-0">
                {initials(trainer.name)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-black text-white">{trainer.name}</h1>
                  {trainer.demoAvailable && (
                    <span className="px-2 py-0.5 text-[11px] font-bold bg-green-500/15 text-green-400 border border-green-500/30 rounded-full">
                      Demo Available
                    </span>
                  )}
                </div>
                <p className="text-sm text-blue-300/70 mt-0.5">{trainer.city} · {trainer.experience} experience</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Stars rating={trainer.rating} />
                  <span className="text-sm font-bold text-[#F5A623]">{trainer.rating}</span>
                  <span className="text-xs text-blue-400/50">({trainer.reviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Students', value: trainer.students },
                { label: 'Rating', value: trainer.rating },
                { label: 'Reviews', value: trainer.reviews },
                { label: 'Experience', value: trainer.experience.replace(' years', 'y') },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-white/8 bg-white/3 p-3 text-center">
                  <p className="text-lg font-black text-[#F5A623]">{s.value}</p>
                  <p className="text-[10px] text-blue-400/50 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Exam types + avg improvement */}
            <div className="flex flex-wrap gap-2 mb-4">
              {trainer.examTypes.map(e => (
                <span key={e} className="px-3 py-1 text-xs font-semibold bg-[#F5A623]/10 text-[#F5A623] border border-[#F5A623]/25 rounded-full">
                  {e}
                </span>
              ))}
              <span className="px-3 py-1 text-xs font-semibold bg-[#00C9A7]/10 text-[#00C9A7] border border-[#00C9A7]/25 rounded-full">
                📈 {trainer.avgImprovement}
              </span>
            </div>

            {/* Bio */}
            <div className="rounded-xl border border-white/8 bg-white/3 p-4 mb-4">
              <p className="text-sm font-bold text-white mb-2">About</p>
              <p className="text-sm text-blue-200/70 leading-relaxed">{trainer.bio}</p>
            </div>

            {/* Past Results */}
            <div className="rounded-xl border border-white/8 bg-white/3 overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-white/8">
                <p className="text-sm font-bold text-white">Past Student Results</p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Student', 'From', 'To', 'Days'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-[11px] font-bold text-blue-400/50 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {trainer.results.map((r, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{r.student}</td>
                      <td className="px-4 py-3 text-blue-300/70">{r.from}</td>
                      <td className="px-4 py-3"><span className="text-[#00C9A7] font-bold">{r.to}</span></td>
                      <td className="px-4 py-3 text-blue-300/70">{r.days}d</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Available Slots */}
            <div className="rounded-xl border border-white/8 bg-white/3 p-4 mb-4">
              <p className="text-sm font-bold text-white mb-3">Available Slots</p>
              <div className="flex flex-wrap gap-2">
                {trainer.slots.map(s => (
                  <span key={s} className="px-3 py-1.5 text-xs font-semibold bg-[#00C9A7]/10 text-[#00C9A7] border border-[#00C9A7]/25 rounded-lg">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Demo Class */}
            {trainer.demoAvailable && (
              <div className="rounded-xl border border-white/8 bg-white/3 p-4 mb-4">
                <p className="text-sm font-bold text-white mb-3">Demo Class Preview</p>
                <div className="relative rounded-xl overflow-hidden bg-black/40 aspect-video flex items-center justify-center border border-white/8">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-full bg-[#F5A623]/20 border-2 border-[#F5A623]/60 flex items-center justify-center mx-auto mb-2 cursor-pointer hover:bg-[#F5A623]/30 transition-colors">
                      <svg className="w-6 h-6 text-[#F5A623] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-white">Watch Demo Class (Sample)</p>
                    <p className="text-xs text-blue-400/50 mt-1">Full demo available on enrollment</p>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="rounded-xl border border-white/8 bg-white/3 p-4 mb-4">
              <p className="text-sm font-bold text-white mb-4">Student Reviews</p>
              <div className="space-y-4">
                {DUMMY_REVIEWS.map((r, i) => (
                  <div key={i} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#F5A623]/20 flex items-center justify-center text-xs font-bold text-[#F5A623]">
                          {r.name[0]}
                        </div>
                        <span className="text-sm font-semibold text-white">{r.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Stars rating={r.rating} />
                        <span className="text-xs text-blue-400/50">{r.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-blue-200/70 leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky bottom bar */}
          <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 px-4 py-3 flex items-center justify-between gap-4"
            style={{ background: '#0B1437' }}>
            <div>
              <p className="text-[11px] text-blue-400/50">Monthly Fee</p>
              <p className="text-xl font-black text-[#F5A623]">₹{trainer.fee.toLocaleString()}</p>
            </div>
            <button onClick={() => openEnroll(trainer)}
              className="flex-1 max-w-xs py-3 rounded-xl font-bold text-sm text-white transition-all"
              style={{ background: '#F5A623', boxShadow: '0 4px 20px rgba(245,166,35,0.3)' }}>
              Enroll Now →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── ENROLL MODAL ───────────────────────────────────────────────────────────
  if (phase === 'enroll' && trainer) {
    const startDate = new Date(Date.now() + 7 * 86400000)
      .toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(6,14,31,0.95)' }}>
        <div className="w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          style={{ background: '#0B1437' }}>
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-white/8 flex items-center justify-between">
            <h2 className="text-lg font-black text-white">Confirm Enrollment</h2>
            <button onClick={() => setPhase(trainer ? 'profile' : 'results')}
              className="text-blue-400/60 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-6 py-5 space-y-4">
            {/* Enrollment number */}
            <div className="rounded-xl bg-[#F5A623]/8 border border-[#F5A623]/25 p-4 text-center">
              <p className="text-xs text-[#F5A623]/70 font-semibold uppercase tracking-widest mb-1">Enrollment Number</p>
              <p className="text-xl font-black text-[#F5A623] tracking-wider">{enrollNum}</p>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <DetailRow label="Trainer" value={`${trainer.name} · ${trainer.city}`} />
              <DetailRow label="Exam" value={answers.exam || trainer.examTypes[0]} />
              <DetailRow label="Start Date" value={startDate} highlight />
              <DetailRow label="Monthly Fee" value={`₹${trainer.fee.toLocaleString()}`} highlight />
            </div>

            {/* Slot selection */}
            <div>
              <p className="text-xs font-bold text-blue-300/70 uppercase tracking-wider mb-2">Select Your Slots</p>
              <div className="flex flex-wrap gap-2">
                {trainer.slots.map(s => {
                  const sel = selectedSlots.includes(s);
                  return (
                    <button key={s} type="button"
                      onClick={() => setSelectedSlots(prev =>
                        sel ? prev.filter(x => x !== s) : [...prev, s]
                      )}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${sel
                        ? 'bg-[#00C9A7]/20 border-[#00C9A7]/60 text-[#00C9A7]'
                        : 'bg-white/4 border-white/10 text-blue-300/70 hover:border-white/25'
                        }`}>
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Razorpay placeholder */}
            <div className="rounded-xl border border-white/8 bg-white/3 p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-xs font-black text-blue-400">₹</div>
              <div>
                <p className="text-xs font-semibold text-white">Payment Integration Coming Soon</p>
                <p className="text-[11px] text-blue-400/50">Razorpay · UPI · Cards · Net Banking</p>
              </div>
            </div>

            <button onClick={confirmEnroll}
              disabled={selectedSlots.length === 0}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: '#F5A623', boxShadow: '0 4px 20px rgba(245,166,35,0.25)' }}>
              ✓ Confirm Enrollment (Demo)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── SUCCESS ────────────────────────────────────────────────────────────────
  if (phase === 'success') {
    return (
      <>
        <Confetti />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(6,14,31,0.97)' }}>
          <div className="w-full max-w-sm text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-2xl font-black text-white mb-2">Enrolled Successfully!</h2>
            <p className="text-sm text-blue-300/70 mb-6">
              Your counsellor will contact you within 24 hours to confirm your batch.
            </p>
            <div className="rounded-xl border border-[#F5A623]/30 bg-[#F5A623]/8 p-4 mb-6">
              <p className="text-xs text-[#F5A623]/70 font-semibold uppercase tracking-widest mb-1">Your Enrollment Number</p>
              <p className="text-xl font-black text-[#F5A623] tracking-wider">{enrollNum}</p>
              <p className="text-xs text-blue-400/50 mt-1.5">Trainer: {trainer?.name}</p>
            </div>
            <div className="space-y-2">
              <button onClick={() => setPhase('results')}
                className="w-full py-3 rounded-xl font-bold text-sm text-white"
                style={{ background: '#F5A623' }}>
                Browse More Trainers
              </button>
              <button onClick={resetWizard}
                className="w-full py-3 rounded-xl font-semibold text-sm text-blue-300 border border-white/10 hover:bg-white/6 transition-colors">
                Start New Search
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
}

// ── TrainerCard ───────────────────────────────────────────────────────────────

function TrainerCard({ trainer, onView, onEnroll }: { trainer: Trainer; onView: () => void; onEnroll: () => void }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-5 hover:border-[#F5A623]/40 hover:bg-[#F5A623]/4 transition-all group">
      {/* Top row */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F5A623]/25 to-[#00C9A7]/25 border-2 border-[#F5A623]/50 flex items-center justify-center text-sm font-black text-white shrink-0 group-hover:border-[#F5A623] transition-colors">
          {initials(trainer.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-bold text-white leading-tight">{trainer.name}</p>
              <p className="text-xs text-blue-300/60">{trainer.city} · {trainer.experience}</p>
            </div>
            {trainer.demoAvailable && (
              <span className="text-[10px] font-bold bg-green-500/15 text-green-400 border border-green-500/25 px-2 py-0.5 rounded-full shrink-0">
                Demo ✓
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Stars rating={trainer.rating} />
            <span className="text-xs font-bold text-[#F5A623]">{trainer.rating}</span>
            <span className="text-xs text-blue-400/50">({trainer.reviews})</span>
          </div>
        </div>
      </div>

      {/* Exam types */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {trainer.examTypes.map(e => (
          <span key={e} className="px-2 py-0.5 text-[11px] font-semibold bg-white/6 text-blue-300/80 border border-white/10 rounded-md">
            {e}
          </span>
        ))}
      </div>

      {/* Slots */}
      <div className="flex flex-wrap gap-1 mb-3">
        {trainer.slots.slice(0, 4).map(s => (
          <span key={s} className="px-2 py-0.5 text-[11px] bg-[#00C9A7]/8 text-[#00C9A7] border border-[#00C9A7]/20 rounded-md">
            {s}
          </span>
        ))}
        {trainer.slots.length > 4 && (
          <span className="px-2 py-0.5 text-[11px] text-blue-400/50">+{trainer.slots.length - 4}</span>
        )}
      </div>

      {/* Improvement + fee */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <span className="text-[#00C9A7] text-sm">📈</span>
          <span className="text-xs font-semibold text-[#00C9A7]">{trainer.avgImprovement}</span>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-blue-400/50">Monthly</p>
          <p className="text-lg font-black text-[#F5A623]">₹{trainer.fee.toLocaleString()}</p>
        </div>
      </div>

      {/* Students count */}
      <p className="text-[11px] text-blue-400/50 mb-4">👥 {trainer.students} students trained</p>

      {/* Buttons */}
      <div className="flex gap-2">
        <button onClick={onView}
          className="flex-1 py-2.5 text-xs font-bold border border-white/15 text-blue-200 hover:border-white/30 hover:text-white rounded-xl transition-all">
          View Profile
        </button>
        <button onClick={onEnroll}
          className="flex-1 py-2.5 text-xs font-bold text-white rounded-xl transition-all"
          style={{ background: '#F5A623' }}>
          Enroll Now
        </button>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function DetailRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-blue-400/60">{label}</span>
      <span className={`font-semibold ${highlight ? 'text-[#F5A623]' : 'text-white'}`}>{value}</span>
    </div>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2.5,
    size: 6 + Math.random() * 8,
    color: ['#F5A623', '#00C9A7', '#ffffff', '#a78bfa', '#fb7185', '#60a5fa'][Math.floor(Math.random() * 6)],
    duration: 2.5 + Math.random() * 1.5,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <style>{`
        @keyframes fall { 0%{transform:translateY(-20px) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(540deg);opacity:0} }
      `}</style>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: `${p.left}%`, top: 0,
          width: p.size, height: p.size * (Math.random() > 0.5 ? 1 : 2.5),
          backgroundColor: p.color, borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          animation: `fall ${p.duration}s ease-in ${p.delay}s forwards`,
        }} />
      ))}
    </div>
  );
}
