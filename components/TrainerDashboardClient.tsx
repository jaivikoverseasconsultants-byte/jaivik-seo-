'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
} from 'firebase/auth';
import {
  doc, getDoc, setDoc, updateDoc, addDoc, getDocs,
  collection, query, where, serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';

// ── Types ─────────────────────────────────────────────────────────────────────

interface TrainerProfile {
  name: string; email: string; phone: string; specialization: string;
  bandScore: string; experience: string; rate: string; bio: string;
  rating?: number; availability?: Record<string, boolean>;
}

interface Booking {
  id: string;
  studentName: string;
  studentPhone?: string;
  examType: string;
  startDate: string;
  status: string;
}

interface EarningEntry {
  id: string;
  desc: string;
  amount: number;
  date: string;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIMES = ['Morning 6–10am', 'Afternoon 12–4pm', 'Evening 6–10pm'];

type TrainerTab = 'availability' | 'students' | 'earnings' | 'profile';

const TABS: { key: TrainerTab; label: string; icon: string }[] = [
  { key: 'availability', label: 'My Availability', icon: '📅' },
  { key: 'students',     label: 'My Students',     icon: '👥' },
  { key: 'earnings',     label: 'Earnings',         icon: '💰' },
  { key: 'profile',      label: 'My Profile',       icon: '👤' },
];

const INPUT = 'w-full px-4 py-3 rounded-xl text-white text-sm placeholder-blue-400/40 focus:outline-none transition-all border border-white/15 focus:border-[#F5A623] bg-[#0B1437]';

function mapAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code || '';
  switch (code) {
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return 'Galat password. Dobara try karein.';
    case 'auth/user-not-found':
      return 'Account nahi mila. Register karein.';
    case 'auth/email-already-in-use':
      return 'Yeh email already registered hai. Login karein.';
    case 'auth/weak-password':
      return 'Password kam se kam 6 characters ka hona chahiye.';
    case 'auth/invalid-email':
      return 'Email sahi format mein nahi hai.';
    case 'auth/too-many-requests':
      return 'Bahut zyada attempts ho gaye. Kuch der baad try karein.';
    default:
      return (err as { message?: string })?.message || 'Kuch error hua. Dobara try karein.';
  }
}

function Chip({ label }: { label: string }) {
  const map: Record<string, string> = {
    Confirmed: 'bg-green-500/15 text-green-400 border-green-500/25',
    Completed: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    Pending:   'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
  };
  return <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${map[label] ?? 'bg-gray-500/15 text-gray-400 border-gray-500/25'}`}>{label}</span>;
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function TrainerDashboardClient() {
  const router = useRouter();
  const { currentUser, userProfile, loading: authLoading, signOut, refreshProfile } = useAuth();

  // Auth form state
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPwd, setLoginPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authErr, setAuthErr] = useState('');

  const [reg, setReg] = useState({
    name: '', email: '', password: '', phone: '',
    specialization: '', bandScore: '', experience: '', rate: '', bio: '',
  });

  // Dashboard state
  const [activeTab, setActiveTab] = useState<TrainerTab>('availability');
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [savedBanner, setSavedBanner] = useState('');
  const [dataLoading, setDataLoading] = useState(true);

  const [avail, setAvail] = useState<Record<string, boolean>>({});
  const [profile, setProfile] = useState<TrainerProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [earnings, setEarnings] = useState<EarningEntry[]>([]);

  function flash(msg: string) { setSavedBanner(msg); setTimeout(() => setSavedBanner(''), 2500); }

  // Redirect away if logged in but not a trainer
  useEffect(() => {
    if (!authLoading && currentUser && userProfile && userProfile.role !== 'trainer') {
      router.replace('/student-login');
    }
  }, [authLoading, currentUser, userProfile, router]);

  const loadDashboardData = useCallback(async (uid: string) => {
    setDataLoading(true);
    try {
      const [trainerSnap, bookingsSnap, earningsSnap] = await Promise.all([
        getDoc(doc(db, 'trainers', uid)),
        getDocs(query(collection(db, 'bookings'), where('trainerId', '==', uid))),
        getDocs(collection(db, 'trainers', uid, 'earnings')),
      ]);
      if (trainerSnap.exists()) setProfile(trainerSnap.data() as TrainerProfile);
      setAvail((trainerSnap.data()?.availability as Record<string, boolean>) ?? {});
      setBookings(bookingsSnap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Booking, 'id'>) })));
      setEarnings(earningsSnap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<EarningEntry, 'id'>) })));
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser && userProfile?.role === 'trainer') loadDashboardData(currentUser.uid);
  }, [currentUser, userProfile, loadDashboardData]);

  // ── Auth handlers ────────────────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthErr('');
    setAuthBusy(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPwd);
    } catch (err) {
      setAuthErr(mapAuthError(err));
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setAuthErr('');
    setAuthBusy(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, reg.email, reg.password);
      await setDoc(doc(db, 'trainers', cred.user.uid), {
        name: reg.name, email: reg.email, phone: reg.phone,
        specialization: reg.specialization, bandScore: reg.bandScore,
        experience: reg.experience, rate: reg.rate, bio: reg.bio,
        rating: 5.0, availability: {}, createdAt: serverTimestamp(),
      });
    } catch (err) {
      setAuthErr(mapAuthError(err));
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleLogout() {
    await signOut();
    router.push('/');
  }

  async function saveAvail() {
    if (!currentUser) return;
    await updateDoc(doc(db, 'trainers', currentUser.uid), { availability: avail });
    flash('✅ Availability saved!');
  }

  async function saveProfile() {
    if (!currentUser || !profile) return;
    await updateDoc(doc(db, 'trainers', currentUser.uid), { ...profile });
    await refreshProfile();
    flash('✅ Profile saved!');
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B1437' }}>
        <div className="w-10 h-10 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── LOGIN / REGISTER SCREEN ──────────────────────────────────────────────
  if (!currentUser || userProfile?.role !== 'trainer') {
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
              <h1 className="text-2xl font-black text-white">Trainer Portal</h1>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-[#00C9A7]/20 text-[#00C9A7] rounded-full border border-[#00C9A7]/30 uppercase tracking-widest">BETA</span>
            </div>
            <p className="text-sm text-blue-300/60">Manage your students, batches &amp; availability</p>
          </div>

          <div className="flex border-b border-white/8">
            {(['login', 'register'] as const).map(t => (
              <button key={t} onClick={() => { setAuthTab(t); setAuthErr(''); }}
                className={[
                  'flex-1 py-3 text-sm font-semibold transition-all',
                  authTab === t ? 'text-[#00C9A7] border-b-2 border-[#00C9A7] bg-[#00C9A7]/5' : 'text-blue-300/55 hover:text-blue-200',
                ].join(' ')}>
                {t === 'login' ? '🔑 Sign In' : '✨ Register'}
              </button>
            ))}
          </div>

          {authTab === 'login' ? (
            <form onSubmit={handleLogin} className="px-8 py-7 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-blue-300/80 mb-2 uppercase tracking-wider">Email</label>
                <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="you@example.com" className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-300/80 mb-2 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'} required value={loginPwd} onChange={e => setLoginPwd(e.target.value)} placeholder="••••••••" className={INPUT + ' pr-11'} />
                  <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-400/60 hover:text-blue-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                </div>
              </div>
              {authErr && <div className="px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm">{authErr}</div>}
              <button type="submit" disabled={authBusy}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: '#F5A623', boxShadow: '0 4px 20px rgba(245,166,35,0.25)' }}>
                {authBusy ? <><Spinner /> Signing in…</> : '🎯 Sign In to Trainer Portal'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="px-8 py-7 space-y-4">
              <input required placeholder="Full Name" value={reg.name} onChange={e => setReg(r => ({ ...r, name: e.target.value }))} className={INPUT} />
              <input required type="email" placeholder="Email" value={reg.email} onChange={e => setReg(r => ({ ...r, email: e.target.value }))} className={INPUT} />
              <input required type="password" minLength={6} placeholder="Password (min 6 characters)" value={reg.password} onChange={e => setReg(r => ({ ...r, password: e.target.value }))} className={INPUT} />
              <input required placeholder="Phone / WhatsApp" value={reg.phone} onChange={e => setReg(r => ({ ...r, phone: e.target.value }))} className={INPUT} />
              <input required placeholder="Specialization (e.g. IELTS Academic, Writing Task 2)" value={reg.specialization} onChange={e => setReg(r => ({ ...r, specialization: e.target.value }))} className={INPUT} />
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="Your Band Score" value={reg.bandScore} onChange={e => setReg(r => ({ ...r, bandScore: e.target.value }))} className={INPUT} />
                <input required placeholder="Experience (yrs)" value={reg.experience} onChange={e => setReg(r => ({ ...r, experience: e.target.value }))} className={INPUT} />
              </div>
              <input required placeholder="Rate (₹/month)" value={reg.rate} onChange={e => setReg(r => ({ ...r, rate: e.target.value }))} className={INPUT} />
              <textarea placeholder="Short bio" rows={2} value={reg.bio} onChange={e => setReg(r => ({ ...r, bio: e.target.value }))} className={INPUT + ' resize-none'} />
              {authErr && <div className="px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm">{authErr}</div>}
              <button type="submit" disabled={authBusy}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: '#00C9A7', boxShadow: '0 4px 20px rgba(0,201,167,0.25)' }}>
                {authBusy ? <><Spinner /> Creating account…</> : '✨ Create Trainer Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  const p = profile ?? { name: userProfile?.name ?? 'Trainer', email: userProfile?.email ?? '', phone: '', specialization: '', bandScore: '', experience: '', rate: '', bio: '', rating: 5.0 };
  const totalEarned = earnings.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg,#060e1f 0%,#0b1437 100%)' }}>
      {savedBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-xl font-semibold text-sm text-white shadow-xl"
          style={{ background: '#00C9A7' }}>{savedBanner}</div>
      )}

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
              <p className="text-sm font-semibold text-white leading-tight">{p.name}</p>
              <p className="text-[11px] text-[#00C9A7]/70">{p.specialization}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#00C9A7]/20 border border-[#00C9A7]/40 flex items-center justify-center text-[#00C9A7] font-bold text-sm">
              {p.name[0]?.toUpperCase() ?? 'T'}
            </div>
            <button onClick={handleLogout} className="text-[11px] text-blue-400/60 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-500/10">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
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

          <div className="mt-5 p-3.5 rounded-xl bg-white/4 border border-white/8 space-y-2">
            <p className="text-[10px] font-bold text-blue-400/50 uppercase tracking-widest mb-2">Quick Stats</p>
            {[
              { l: 'Active Students', v: String(bookings.length) },
              { l: 'Rating', v: `${(p.rating ?? 5.0).toFixed(1)} ⭐` },
              { l: 'Total Earned', v: `₹${totalEarned.toLocaleString('en-IN')}` },
            ].map(s => (
              <div key={s.l} className="flex justify-between">
                <span className="text-xs text-blue-300/50">{s.l}</span>
                <span className="text-xs font-bold text-white">{s.v}</span>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">{TABS.find(t => t.key === activeTab)?.icon}</span>
            <h2 className="text-xl font-black text-white">{TABS.find(t => t.key === activeTab)?.label}</h2>
            {dataLoading && <span className="text-xs text-blue-400/40">Loading…</span>}
          </div>

          {/* ── AVAILABILITY ─────────────────────────────────────────────── */}
          {activeTab === 'availability' && (
            <div className="space-y-4">
              <p className="text-sm text-blue-300/60">Toggle your available slots. Students can only book times you mark as available.</p>
              <div className="rounded-xl border border-white/8 bg-white/3 overflow-hidden">
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
              {!dataLoading && bookings.length === 0 && (
                <div className="rounded-xl border border-white/8 bg-white/3 p-12 text-center">
                  <p className="text-5xl mb-3">👥</p>
                  <p className="text-white font-bold mb-1">No students yet</p>
                  <p className="text-sm text-blue-400/50">Students who book a demo class with you will appear here.</p>
                </div>
              )}
              {bookings.map(b => (
                <div key={b.id} className="rounded-xl border border-white/8 bg-white/3 p-4 flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 rounded-full bg-[#F5A623]/20 border border-[#F5A623]/40 flex items-center justify-center text-xs font-bold text-[#F5A623]">
                        {b.studentName?.[0]?.toUpperCase() ?? 'S'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{b.studentName}</p>
                        {b.studentPhone && <p className="text-[11px] text-blue-400/50">{b.studentPhone}</p>}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-[11px] text-blue-300/70 bg-white/5 px-2 py-0.5 rounded">{b.examType}</span>
                      <span className="text-[11px] text-blue-300/70 bg-white/5 px-2 py-0.5 rounded">Start: {b.startDate}</span>
                    </div>
                  </div>
                  <Chip label={b.status} />
                </div>
              ))}
            </div>
          )}

          {/* ── EARNINGS ─────────────────────────────────────────────────── */}
          {activeTab === 'earnings' && (
            <EarningsTab uid={currentUser.uid} earnings={earnings} totalEarned={totalEarned} loading={dataLoading}
              onChange={() => loadDashboardData(currentUser.uid)} />
          )}

          {/* ── PROFILE ──────────────────────────────────────────────────── */}
          {activeTab === 'profile' && (
            <div className="max-w-xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-blue-300/80 mb-2 uppercase tracking-wider">Full Name</label>
                  <input value={p.name} onChange={e => setProfile({ ...p, name: e.target.value })} className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-300/80 mb-2 uppercase tracking-wider">Phone</label>
                  <input value={p.phone} onChange={e => setProfile({ ...p, phone: e.target.value })} className={INPUT} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-blue-300/80 mb-2 uppercase tracking-wider">Bio</label>
                <textarea rows={3} value={p.bio} onChange={e => setProfile({ ...p, bio: e.target.value })}
                  className={INPUT + ' resize-none'} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-blue-300/80 mb-2 uppercase tracking-wider">Experience (years)</label>
                  <input value={p.experience} onChange={e => setProfile({ ...p, experience: e.target.value })} className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-300/80 mb-2 uppercase tracking-wider">Rate (₹/month)</label>
                  <input value={p.rate} onChange={e => setProfile({ ...p, rate: e.target.value })} className={INPUT} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-blue-300/80 mb-2 uppercase tracking-wider">Specialization</label>
                <input value={p.specialization} onChange={e => setProfile({ ...p, specialization: e.target.value })} className={INPUT} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-blue-300/80 mb-2 uppercase tracking-wider">Band Score</label>
                <input value={p.bandScore} onChange={e => setProfile({ ...p, bandScore: e.target.value })} className={INPUT} />
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

// ── Earnings (manual entry) ───────────────────────────────────────────────────

function EarningsTab({ uid, earnings, totalEarned, loading, onChange }: {
  uid: string; earnings: EarningEntry[]; totalEarned: number; loading: boolean; onChange: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ desc: '', amount: '', date: new Date().toISOString().slice(0, 10) });

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await addDoc(collection(db, 'trainers', uid, 'earnings'), {
        desc: form.desc, amount: parseFloat(form.amount) || 0, date: form.date, createdAt: serverTimestamp(),
      });
      setForm({ desc: '', amount: '', date: new Date().toISOString().slice(0, 10) });
      setShowForm(false);
      onChange();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-white/8 bg-white/3 p-5 text-center max-w-xs">
        <p className="text-2xl font-black text-white">₹{totalEarned.toLocaleString('en-IN')}</p>
        <p className="text-xs text-blue-400/50 mt-1">Total Earned (manual entries)</p>
      </div>

      <div className="flex justify-end">
        <button onClick={() => setShowForm(v => !v)}
          className="px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors"
          style={{ background: '#00C9A7' }}>
          {showForm ? 'Cancel' : '+ Add Earning Entry'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="rounded-xl border border-white/8 bg-white/3 p-4 space-y-3">
          <input required placeholder="Description (e.g. Rahul M. — IELTS Academic)" value={form.desc}
            onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} className={INPUT} />
          <div className="grid grid-cols-2 gap-3">
            <input required type="number" placeholder="Amount (₹)" value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} className={INPUT} />
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className={INPUT} />
          </div>
          <button type="submit" disabled={saving}
            className="px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors disabled:opacity-50"
            style={{ background: '#00C9A7' }}>
            {saving ? 'Saving…' : 'Save Entry'}
          </button>
        </form>
      )}

      {!loading && earnings.length === 0 && (
        <div className="rounded-xl border border-white/8 bg-white/3 p-12 text-center">
          <p className="text-5xl mb-3">💰</p>
          <p className="text-white font-bold mb-1">No earnings recorded yet</p>
          <p className="text-sm text-blue-400/50">Add your first entry above.</p>
        </div>
      )}

      {earnings.length > 0 && (
        <div className="rounded-xl border border-white/8 bg-white/3 p-5">
          <p className="text-sm font-bold text-white mb-4">Entries</p>
          <div className="space-y-3">
            {[...earnings].reverse().map(e => (
              <div key={e.id} className="flex items-center justify-between text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="text-white font-medium">{e.desc}</p>
                  <p className="text-[11px] text-blue-400/50">{e.date}</p>
                </div>
                <p className="text-green-400 font-bold">+₹{Number(e.amount).toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
