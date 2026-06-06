'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ── Demo trainer data ─────────────────────────────────────────────────────────

const TRAINER_PROFILE_DEFAULT = {
  name: 'Priya Sharma', city: 'Delhi', bio: 'Ex-British Council examiner. Specialized in Writing Task 2 and Speaking fluency. 95% students achieve target band.',
  experience: '6', fee: 4500, examTypes: ['IELTS Academic', 'IELTS General'],
};

const DEMO_STUDENTS = [
  { enrollNo: 'JO-IELTS-2026-3421', name: 'Rahul M.', exam: 'IELTS Academic', startDate: '15 Jun 2026', status: 'Active', from: 5.5, target: 7.0 },
  { enrollNo: 'JO-IELTS-2026-7832', name: 'Sneha K.', exam: 'IELTS General',  startDate: '20 May 2026', status: 'Active', from: 6.0, target: 7.0 },
  { enrollNo: 'JO-IELTS-2026-1205', name: 'Amit P.',  exam: 'IELTS Academic', startDate: '10 Apr 2026', status: 'Completed', from: 5.0, target: 6.5 },
  { enrollNo: 'JO-IELTS-2026-5510', name: 'Divya R.', exam: 'IELTS Academic', startDate: '01 Jun 2026', status: 'Active', from: 6.5, target: 7.5 },
];

const DEMO_BATCHES = [
  { id: 1, name: 'Morning Batch A', schedule: 'Mon · Wed · Fri · 7:00 AM', students: 4, nextClass: 'Mon 7am', level: 'IELTS Academic 7.0+' },
  { id: 2, name: 'Evening Batch B', schedule: 'Tue · Thu · 7:00 PM', students: 3, nextClass: 'Tue 7pm', level: 'IELTS General 6.5+' },
  { id: 3, name: 'Weekend Batch C', schedule: 'Sat · 10:00 AM', students: 5, nextClass: 'Sat 10am', level: 'PTE Academic' },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIMES = ['Morning 6–10am', 'Afternoon 12–4pm', 'Evening 6–10pm'];

const DEFAULT_AVAIL: Record<string, boolean> = {
  'Mon-Morning 6–10am': true, 'Wed-Morning 6–10am': true, 'Fri-Morning 6–10am': true,
  'Tue-Evening 6–10pm': true, 'Thu-Evening 6–10pm': true,
};

type TrainerTab = 'availability' | 'students' | 'batches' | 'earnings' | 'profile';

const TABS: { key: TrainerTab; label: string; icon: string }[] = [
  { key: 'availability', label: 'My Availability', icon: '📅' },
  { key: 'students',     label: 'My Students',     icon: '👥' },
  { key: 'batches',      label: 'My Batches',       icon: '🎓' },
  { key: 'earnings',     label: 'Earnings',         icon: '💰' },
  { key: 'profile',      label: 'My Profile',       icon: '👤' },
];

const INPUT = 'w-full px-4 py-3 rounded-xl text-white text-sm placeholder-blue-400/40 focus:outline-none transition-all border border-white/15 focus:border-[#F5A623] bg-[#0B1437]';

// ── Status chip ───────────────────────────────────────────────────────────────
function Chip({ label, color }: { label: string; color: string }) {
  const map: Record<string, string> = {
    Active:    'bg-green-500/15 text-green-400 border-green-500/25',
    Completed: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    Pending:   'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
  };
  return <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${map[color] ?? 'bg-gray-500/15 text-gray-400 border-gray-500/25'}`}>{label}</span>;
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function TrainerDashboardClient() {
  const router = useRouter();
  const [authed, setAuthed]   = useState<boolean | null>(null);
  const [loginEmail, setLE]   = useState('');
  const [loginPwd, setLP]     = useState('');
  const [loginErr, setLErr]   = useState('');
  const [logging, setLogging] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const [activeTab, setActiveTab]           = useState<TrainerTab>('availability');
  const [mobileSidebar, setMobileSidebar]   = useState(false);
  const [savedBanner, setSavedBanner]       = useState('');

  // Availability state
  const [avail, setAvail] = useState<Record<string, boolean>>({});

  // Profile state
  const [profile, setProfile] = useState(TRAINER_PROFILE_DEFAULT);
  const [examTypesInput, setExamTypesInput] = useState(TRAINER_PROFILE_DEFAULT.examTypes.join(', '));

  useEffect(() => {
    const raw = localStorage.getItem('joc_trainer_auth');
    if (raw) {
      setAuthed(true);
      const savedAvail = localStorage.getItem('joc_trainer_avail');
      setAvail(savedAvail ? JSON.parse(savedAvail) : DEFAULT_AVAIL);
      const savedProfile = localStorage.getItem('joc_trainer_profile');
      if (savedProfile) { const p = JSON.parse(savedProfile); setProfile(p); setExamTypesInput(p.examTypes.join(', ')); }
    } else {
      setAuthed(false);
    }
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setLErr(''); setLogging(true);
    setTimeout(() => {
      if (loginEmail === 'trainer@demo.com' && loginPwd === 'trainer123') {
        localStorage.setItem('joc_trainer_auth', JSON.stringify({ email: loginEmail, name: 'Priya Sharma', loginTime: Date.now() }));
        const savedAvail = localStorage.getItem('joc_trainer_avail');
        setAvail(savedAvail ? JSON.parse(savedAvail) : DEFAULT_AVAIL);
        setAuthed(true);
      } else {
        setLErr('Invalid credentials. Use trainer@demo.com / trainer123');
        setLogging(false);
      }
    }, 800);
  }

  function handleLogout() { localStorage.removeItem('joc_trainer_auth'); router.push('/'); }

  function saveAvail() {
    localStorage.setItem('joc_trainer_avail', JSON.stringify(avail));
    flash('✅ Availability saved!');
  }

  function saveProfile() {
    const p = { ...profile, examTypes: examTypesInput.split(',').map(s => s.trim()).filter(Boolean) };
    localStorage.setItem('joc_trainer_profile', JSON.stringify(p));
    setProfile(p);
    flash('✅ Profile saved!');
  }

  function flash(msg: string) { setSavedBanner(msg); setTimeout(() => setSavedBanner(''), 2500); }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B1437' }}>
        <div className="w-10 h-10 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── LOGIN SCREEN ───────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
        style={{ background: 'linear-gradient(135deg,#060e1f 0%,#0b1437 50%,#0d1e3a 100%)' }}>
        <div className="w-full max-w-sm mb-6 flex items-center justify-between">
          <Link href="/" className="text-sm text-blue-300 hover:text-white flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back
          </Link>
          <div className="flex items-center gap-2">
            <img src="/joc-logo-circle.jpeg" alt="Jaivik" className="h-8 w-8 rounded-full ring-2 ring-[#F5A623]/40" />
            <span className="text-sm font-semibold text-white">Trainer Portal</span>
          </div>
        </div>

        <div className="w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          style={{ background: 'rgba(11,20,55,0.9)', backdropFilter: 'blur(16px)' }}>
          <div className="px-8 pt-7 pb-5 border-b border-white/8">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black text-white">Trainer Login</h1>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-[#00C9A7]/20 text-[#00C9A7] rounded-full border border-[#00C9A7]/30 uppercase tracking-widest">BETA</span>
            </div>
            <p className="text-sm text-blue-300/60">Manage your students, batches & availability</p>
          </div>

          <form onSubmit={handleLogin} className="px-8 py-7 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-blue-300/80 mb-2 uppercase tracking-wider">Email</label>
              <input type="email" required value={loginEmail} onChange={e => setLE(e.target.value)} placeholder="trainer@demo.com" className={INPUT} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-blue-300/80 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} required value={loginPwd} onChange={e => setLP(e.target.value)} placeholder="••••••••" className={INPUT + ' pr-11'} />
                <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-400/60 hover:text-blue-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </button>
              </div>
            </div>
            {loginErr && (
              <div className="px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm">{loginErr}</div>
            )}
            <button type="submit" disabled={logging}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: '#F5A623', boxShadow: '0 4px 20px rgba(245,166,35,0.25)' }}>
              {logging ? <><Spinner /> Signing in…</> : '🎯 Sign In to Trainer Portal'}
            </button>
            <div className="p-3 rounded-xl bg-[#00C9A7]/8 border border-[#00C9A7]/20 text-[11px] text-center">
              <p className="text-[#00C9A7]/80 font-semibold mb-1">Demo Credentials</p>
              <p className="text-blue-300/60">trainer@demo.com / trainer123</p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg,#060e1f 0%,#0b1437 100%)' }}>
      {savedBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-xl font-semibold text-sm text-white shadow-xl"
          style={{ background: '#00C9A7' }}>{savedBanner}</div>
      )}

      {/* Top bar */}
      <header className="border-b border-white/8 bg-[#060e1f]/80 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 text-blue-300 hover:text-white" onClick={() => setMobileSidebar(v => !v)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <Link href="/" className="flex items-center gap-2">
              <img src="/joc-logo-circle.jpeg" alt="Jaivik" className="h-7 w-7 rounded-full ring-2 ring-[#F5A623]/30" />
              <span className="hidden sm:block text-sm font-bold text-white">Trainer Dashboard</span>
            </Link>
            <span className="px-2 py-0.5 text-[9px] font-bold bg-[#00C9A7]/20 text-[#00C9A7] rounded-full border border-[#00C9A7]/30 uppercase tracking-widest">BETA</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-semibold text-white leading-tight">{profile.name}</p>
              <p className="text-[11px] text-[#00C9A7]/70">{profile.examTypes.join(' · ')}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#00C9A7]/20 border border-[#00C9A7]/40 flex items-center justify-center text-[#00C9A7] font-bold text-sm">
              {profile.name[0]}
            </div>
            <button onClick={handleLogout} className="text-[11px] text-blue-400/60 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-500/10">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        {mobileSidebar && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileSidebar(false)} />}
        <aside className={[
          'shrink-0 w-52 space-y-0.5',
          mobileSidebar ? 'fixed left-0 top-14 bottom-0 z-50 bg-[#0b1437] p-4 overflow-y-auto w-60 border-r border-white/8 block' : 'hidden lg:block',
        ].join(' ')}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => { setActiveTab(t.key); setMobileSidebar(false); }}
              className={['w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                activeTab === t.key ? 'bg-[#00C9A7]/15 text-[#00C9A7] border border-[#00C9A7]/25' : 'text-blue-300/70 hover:text-white hover:bg-white/6',
              ].join(' ')}>
              <span className="text-base w-5 text-center shrink-0">{t.icon}</span>
              {t.label}
            </button>
          ))}

          {/* Quick stats */}
          <div className="mt-5 p-3.5 rounded-xl bg-white/4 border border-white/8 space-y-2">
            <p className="text-[10px] font-bold text-blue-400/50 uppercase tracking-widest mb-2">Quick Stats</p>
            {[{ l: 'Active Students', v: '7' }, { l: 'Batches', v: '3' }, { l: 'Rating', v: '4.9 ⭐' }, { l: 'This Month', v: '₹31,500' }].map(s => (
              <div key={s.l} className="flex justify-between">
                <span className="text-xs text-blue-300/50">{s.l}</span>
                <span className="text-xs font-bold text-white">{s.v}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">{TABS.find(t => t.key === activeTab)?.icon}</span>
            <h2 className="text-xl font-black text-white">{TABS.find(t => t.key === activeTab)?.label}</h2>
          </div>

          {/* ── AVAILABILITY ─────────────────────────────────────────────── */}
          {activeTab === 'availability' && (
            <div className="space-y-4">
              <p className="text-sm text-blue-300/60">Toggle your available slots. Students can only book times you mark as available.</p>
              <div className="rounded-xl border border-white/8 bg-white/3 overflow-hidden">
                {/* Header row */}
                <div className="grid grid-cols-8 border-b border-white/8">
                  <div className="px-3 py-3 text-[11px] font-bold text-blue-400/50 uppercase tracking-wider">Slot</div>
                  {DAYS.map(d => (
                    <div key={d} className="px-2 py-3 text-[11px] font-bold text-white/60 uppercase text-center">{d}</div>
                  ))}
                </div>
                {TIMES.map(time => (
                  <div key={time} className="grid grid-cols-8 border-b border-white/5 last:border-0">
                    <div className="px-3 py-3 text-xs font-semibold text-blue-300/70 flex items-center">{time.split(' ')[0]}<br /><span className="text-[10px] text-blue-400/40">{time.split(' ').slice(1).join(' ')}</span></div>
                    {DAYS.map(day => {
                      const key = `${day}-${time}`;
                      const on = !!avail[key];
                      return (
                        <div key={day} className="flex items-center justify-center py-3">
                          <button onClick={() => setAvail(a => ({ ...a, [key]: !on }))}
                            className={['w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all',
                              on ? 'bg-[#00C9A7]/20 border-[#00C9A7] text-[#00C9A7]' : 'bg-white/4 border-white/15 text-white/20 hover:border-white/30',
                            ].join(' ')}>
                            {on ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                              : <span className="text-xs">+</span>}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <button onClick={saveAvail}
                className="px-6 py-3 rounded-xl font-bold text-sm text-white transition-all"
                style={{ background: '#00C9A7', boxShadow: '0 4px 16px rgba(0,201,167,0.25)' }}>
                💾 Save Availability
              </button>
            </div>
          )}

          {/* ── STUDENTS ─────────────────────────────────────────────────── */}
          {activeTab === 'students' && (
            <div className="space-y-3">
              {/* Pull from localStorage enrollments too */}
              {[...DEMO_STUDENTS].map((s, i) => (
                <div key={i} className="rounded-xl border border-white/8 bg-white/3 p-4 flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 rounded-full bg-[#F5A623]/20 border border-[#F5A623]/40 flex items-center justify-center text-xs font-bold text-[#F5A623]">
                        {s.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{s.name}</p>
                        <p className="text-[11px] text-blue-400/50">{s.enrollNo}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-[11px] text-blue-300/70 bg-white/5 px-2 py-0.5 rounded">{s.exam}</span>
                      <span className="text-[11px] text-blue-300/70 bg-white/5 px-2 py-0.5 rounded">Start: {s.startDate}</span>
                      <span className="text-[11px] text-[#00C9A7] bg-[#00C9A7]/8 px-2 py-0.5 rounded">Band {s.from} → {s.target}</span>
                    </div>
                  </div>
                  <Chip label={s.status} color={s.status} />
                </div>
              ))}
            </div>
          )}

          {/* ── BATCHES ──────────────────────────────────────────────────── */}
          {activeTab === 'batches' && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {DEMO_BATCHES.map(b => (
                <div key={b.id} className="rounded-xl border border-white/8 bg-white/3 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-white">{b.name}</p>
                    <span className="text-xs bg-[#00C9A7]/10 text-[#00C9A7] border border-[#00C9A7]/25 px-2 py-0.5 rounded-full">{b.students} students</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-blue-400/50">Schedule</span>
                      <span className="text-white font-medium">{b.schedule}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-400/50">Level</span>
                      <span className="text-white font-medium">{b.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-400/50">Next Class</span>
                      <span className="text-[#F5A623] font-bold">{b.nextClass}</span>
                    </div>
                  </div>
                  <button className="mt-4 w-full py-2 text-xs font-semibold border border-white/12 text-blue-200 hover:bg-white/6 rounded-lg transition-colors">
                    View Students
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── EARNINGS ─────────────────────────────────────────────────── */}
          {activeTab === 'earnings' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'This Week', value: '₹13,500', sub: '3 active students', color: 'text-[#00C9A7]' },
                  { label: 'This Month', value: '₹31,500', sub: '7 active students', color: 'text-[#F5A623]' },
                  { label: 'Total Earned', value: '₹1,87,500', sub: 'Since joining Apr 2024', color: 'text-white' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl border border-white/8 bg-white/3 p-5 text-center">
                    <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-white font-semibold mt-1">{s.label}</p>
                    <p className="text-[11px] text-blue-400/50 mt-0.5">{s.sub}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-white/8 bg-white/3 p-5">
                <p className="text-sm font-bold text-white mb-4">Recent Transactions</p>
                <div className="space-y-3">
                  {[
                    { desc: 'Rahul M. – IELTS Academic', date: '1 Jun 2026', amount: '+₹4,500', status: 'Paid' },
                    { desc: 'Sneha K. – IELTS General', date: '1 Jun 2026', amount: '+₹4,500', status: 'Paid' },
                    { desc: 'Divya R. – IELTS Academic', date: '1 Jun 2026', amount: '+₹4,500', status: 'Paid' },
                    { desc: 'Amit P. – Completion Bonus', date: '15 May 2026', amount: '+₹2,000', status: 'Paid' },
                  ].map((t, i) => (
                    <div key={i} className="flex items-center justify-between text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="text-white font-medium">{t.desc}</p>
                        <p className="text-[11px] text-blue-400/50">{t.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold">{t.amount}</p>
                        <p className="text-[11px] text-green-400/60">{t.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#F5A623]/20 bg-[#F5A623]/6 p-4 flex items-center gap-3">
                <span className="text-2xl">💸</span>
                <div>
                  <p className="text-sm font-bold text-[#F5A623]">Weekly Payouts Every Monday</p>
                  <p className="text-xs text-blue-300/60">Next payout: Monday 9 Jun 2026 · Estimated ₹13,500</p>
                </div>
              </div>
            </div>
          )}

          {/* ── PROFILE ──────────────────────────────────────────────────── */}
          {activeTab === 'profile' && (
            <div className="max-w-xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-blue-300/80 mb-2 uppercase tracking-wider">Full Name</label>
                  <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-300/80 mb-2 uppercase tracking-wider">City</label>
                  <input value={profile.city} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))} className={INPUT} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-blue-300/80 mb-2 uppercase tracking-wider">Bio</label>
                <textarea rows={3} value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                  className={INPUT + ' resize-none'} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-blue-300/80 mb-2 uppercase tracking-wider">Experience (years)</label>
                  <input type="number" value={profile.experience} onChange={e => setProfile(p => ({ ...p, experience: e.target.value }))} className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-300/80 mb-2 uppercase tracking-wider">Monthly Fee (₹)</label>
                  <input type="number" value={profile.fee} onChange={e => setProfile(p => ({ ...p, fee: Number(e.target.value) }))} className={INPUT} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-blue-300/80 mb-2 uppercase tracking-wider">Exam Types (comma separated)</label>
                <input value={examTypesInput} onChange={e => setExamTypesInput(e.target.value)}
                  placeholder="IELTS Academic, IELTS General, PTE Academic" className={INPUT} />
              </div>

              <button onClick={saveProfile}
                className="px-6 py-3 rounded-xl font-bold text-sm text-white transition-all"
                style={{ background: '#F5A623', boxShadow: '0 4px 16px rgba(245,166,35,0.25)' }}>
                💾 Save Profile
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
