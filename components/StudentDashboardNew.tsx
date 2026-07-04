'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  collection, doc, addDoc, updateDoc, deleteDoc, getDocs,
  query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth, type UserProfile } from '@/lib/auth-context';
import { trackActivity } from '@/lib/activity';
import IELTSCoachingTab from '@/components/IELTSCoachingTab';

// ── Types ────────────────────────────────────────────────────────────────────

type AppStatus = 'Interested' | 'Applied' | 'Offer Received' | 'Visa Applied' | 'Visa Approved' | 'Enrolled';

interface Application {
  id: string;
  university: string;
  course: string;
  status: AppStatus;
  appliedDate: string;
  notes?: string;
}

interface SavedCourse {
  id: string;
  name: string;
  university?: string;
  fee?: string;
  ielts?: string;
}

interface IeltsScore {
  id: string;
  testDate: string;
  overall: number;
  listening: number;
  reading: number;
  writing: number;
  speaking: number;
}

interface Payment {
  id: string;
  service: string;
  amount: string;
  date?: string;
  status: string;
}

const STATUS_PIPELINE: AppStatus[] = ['Interested', 'Applied', 'Offer Received', 'Visa Applied', 'Visa Approved', 'Enrolled'];

const COUNTRIES = ['Canada', 'UK', 'Australia', 'USA', 'Germany', 'Ireland', 'New Zealand', 'Singapore'];
const BUDGETS = ['Under ₹10 Lakh/yr', '₹10–20 Lakh/yr', '₹20–35 Lakh/yr', '₹35–50 Lakh/yr', 'Above ₹50 Lakh/yr'];

// ── Status helper ──────────────────────────────────────────────────────────

function statusChip(status: string) {
  const map: Record<string, string> = {
    'Interested':     'bg-gray-500/15 text-gray-300 border-gray-500/25',
    'Applied':        'bg-blue-500/15 text-blue-400 border-blue-500/25',
    'Offer Received': 'bg-teal-500/15 text-teal-400 border-teal-500/25',
    'Visa Applied':   'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
    'Visa Approved':  'bg-green-500/15 text-green-400 border-green-500/25',
    'Enrolled':       'bg-purple-500/15 text-purple-400 border-purple-500/25',
    'Paid':           'bg-green-500/15 text-green-400 border-green-500/25',
    'Pending':        'bg-red-500/15 text-red-400 border-red-500/25',
  };
  const cls = map[status] ?? 'bg-gray-500/15 text-gray-400 border-gray-500/25';
  return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`;
}

const INPUT_CLS = 'w-full px-3.5 py-2.5 rounded-lg text-sm text-white placeholder-blue-400/40 bg-[#0B1437] border border-white/15 focus:outline-none focus:border-gold-500 transition-all';
const SELECT_CLS = INPUT_CLS + ' appearance-none cursor-pointer';

// ── IELTS Chart (pure SVG) ────────────────────────────────────────────────────

type ChartPoint = { date: string; overall: number; L: number; R: number; W: number; S: number };

function IELTSChart({ data }: { data: ChartPoint[] }) {
  const W = 480, H = 180, PAD = { top: 20, right: 20, bottom: 40, left: 40 };
  const xScale = (i: number) => PAD.left + (data.length > 1 ? (i / (data.length - 1)) * (W - PAD.left - PAD.right) : (W - PAD.left - PAD.right) / 2);
  const yScale = (v: number) => H - PAD.bottom - ((v - 4) / (9 - 4)) * (H - PAD.top - PAD.bottom);

  const lines = [
    { key: 'overall' as const, label: 'Overall', color: '#f59e0b', width: 2.5 },
    { key: 'L' as const,       label: 'Listening', color: '#60a5fa', width: 1.5 },
    { key: 'R' as const,       label: 'Reading',   color: '#34d399', width: 1.5 },
    { key: 'W' as const,       label: 'Writing',   color: '#a78bfa', width: 1.5 },
    { key: 'S' as const,       label: 'Speaking',  color: '#fb7185', width: 1.5 },
  ];

  return (
    <div className="space-y-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 200 }}>
        {[5, 6, 7, 8, 9].map(v => (
          <g key={v}>
            <line x1={PAD.left} y1={yScale(v)} x2={W - PAD.right} y2={yScale(v)}
              stroke="rgba(255,255,255,0.07)" strokeWidth={1} strokeDasharray="4 4" />
            <text x={PAD.left - 6} y={yScale(v) + 4} textAnchor="end" fontSize={10} fill="rgba(255,255,255,0.3)">{v}</text>
          </g>
        ))}

        {data.map((d, i) => (
          <text key={i} x={xScale(i)} y={H - PAD.bottom + 16} textAnchor="middle" fontSize={10} fill="rgba(255,255,255,0.4)">{d.date}</text>
        ))}

        {data.length > 1 && lines.map(line => (
          <polyline
            key={line.key}
            points={data.map((d, i) => `${xScale(i)},${yScale(d[line.key])}`).join(' ')}
            fill="none" stroke={line.color} strokeWidth={line.width}
            strokeLinejoin="round" strokeLinecap="round"
          />
        ))}

        {data.map((d, i) => (
          <circle key={i} cx={xScale(i)} cy={yScale(d.overall)} r={5} fill="#0b1437" stroke="#f59e0b" strokeWidth={2.5} />
        ))}

        {data.map((d, i) => (
          <text key={i} x={xScale(i)} y={yScale(d.overall) - 10} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#f59e0b">
            {d.overall.toFixed(1)}
          </text>
        ))}
      </svg>

      <div className="flex flex-wrap gap-4 justify-center">
        {lines.map(l => (
          <div key={l.key} className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: l.color, height: l.key === 'overall' ? 3 : 2 }} />
            <span className="text-xs text-blue-300/60">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tabs definition ───────────────────────────────────────────────────────────

type TabKey = 'ielts_coaching' | 'applications' | 'offers' | 'visa' | 'shortlisted' | 'ielts' | 'payments' | 'profile';

// ── Main component ────────────────────────────────────────────────────────────

export default function StudentDashboardNew() {
  const router = useRouter();
  const { currentUser, userProfile, loading: authLoading, signOut, refreshProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<TabKey>('ielts_coaching');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const [applications, setApplications] = useState<Application[]>([]);
  const [savedCourses, setSavedCourses] = useState<SavedCourse[]>([]);
  const [ieltsScores, setIeltsScores] = useState<IeltsScore[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    if (!authLoading && !currentUser) router.replace('/student-login');
  }, [authLoading, currentUser, router]);

  const loadData = useCallback(async (uid: string) => {
    setDataLoading(true);
    try {
      const [appsSnap, savedSnap, ieltsSnap, paySnap] = await Promise.all([
        getDocs(collection(db, 'users', uid, 'applications')),
        getDocs(collection(db, 'users', uid, 'savedCourses')),
        getDocs(query(collection(db, 'users', uid, 'ieltsScores'), orderBy('testDate', 'asc'))),
        getDocs(collection(db, 'users', uid, 'payments')),
      ]);
      setApplications(appsSnap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Application, 'id'>) })));
      setSavedCourses(savedSnap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<SavedCourse, 'id'>) })));
      setIeltsScores(ieltsSnap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<IeltsScore, 'id'>) })));
      setPayments(paySnap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<Payment, 'id'>) })));
    } catch {
      // leave whatever loaded so far
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) loadData(currentUser.uid);
  }, [currentUser, loadData]);

  async function handleLogout() {
    await signOut();
    router.push('/student-login');
  }

  if (authLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0b1437' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-blue-300/70 text-sm">Loading portal…</p>
        </div>
      </div>
    );
  }

  const studentName = userProfile?.name || currentUser.email || 'Student';
  const initials = studentName.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'S';
  const offersCount = applications.filter(a => a.status === 'Offer Received').length;
  const bestIelts = ieltsScores.length ? Math.max(...ieltsScores.map(s => s.overall)).toFixed(1) : '–';

  const TABS: { key: TabKey; label: string; icon: string; badge?: number }[] = [
    { key: 'ielts_coaching', label: 'IELTS Coaching',           icon: '🎯' },
    { key: 'applications',   label: 'My Applications',         icon: '📋', badge: applications.length },
    { key: 'offers',         label: 'Offers Received',          icon: '📩', badge: offersCount },
    { key: 'visa',           label: 'Visa Status',              icon: '🛂' },
    { key: 'shortlisted',    label: 'Shortlisted Universities', icon: '⭐', badge: savedCourses.length },
    { key: 'ielts',          label: 'My IELTS Scores',          icon: '📊' },
    { key: 'payments',       label: 'Payments',                 icon: '💳' },
    { key: 'profile',        label: 'My Profile',               icon: '👤' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #060e1f 0%, #0b1437 100%)' }}>

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header className="border-b border-white/8 bg-[#060e1f]/80 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 text-blue-300 hover:text-white" onClick={() => setMobileSidebarOpen(v => !v)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <Link href="/" className="flex items-center gap-2">
              <img src="/joc-logo-circle.jpeg" alt="Jaivik" className="h-7 w-7 rounded-full ring-2 ring-gold-500/30" />
              <span className="text-sm font-bold text-white hidden sm:block">Jaivik Overseas</span>
            </Link>
            <span className="px-2 py-0.5 text-[9px] font-bold bg-gold-500/20 text-gold-400 rounded-full border border-gold-500/30 uppercase tracking-widest">BETA</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-semibold text-white leading-tight">{studentName}</p>
              <p className="text-[11px] text-blue-400/60">{userProfile?.email || currentUser.email}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 font-bold text-sm">
              {initials}
            </div>
            <button onClick={handleLogout}
              className="text-[11px] text-blue-400/60 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-500/10">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex gap-6">

        {/* ── Sidebar (desktop) / Drawer (mobile) ─────────────────────── */}
        <>
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
          )}
          <aside className={[
            'shrink-0 w-56 space-y-0.5',
            'lg:block',
            mobileSidebarOpen
              ? 'fixed left-0 top-14 bottom-0 z-50 bg-[#0b1437] p-4 overflow-y-auto w-64 border-r border-white/8 block'
              : 'hidden lg:block',
          ].join(' ')}>
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => { setActiveTab(t.key); setMobileSidebarOpen(false); }}
                className={[
                  'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                  activeTab === t.key
                    ? 'bg-gold-500/15 text-gold-300 border border-gold-500/25'
                    : 'text-blue-300/70 hover:text-white hover:bg-white/6',
                ].join(' ')}
              >
                <span className="text-base w-5 text-center shrink-0">{t.icon}</span>
                <span className="flex-1 leading-tight">{t.label}</span>
                {t.badge !== undefined && t.badge > 0 && (
                  <span className="text-[10px] font-bold bg-gold-500/20 text-gold-400 px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {t.badge}
                  </span>
                )}
              </button>
            ))}

            <div className="mt-6 p-3.5 rounded-xl bg-white/4 border border-white/8 space-y-2">
              <p className="text-[10px] font-bold text-blue-400/50 uppercase tracking-widest mb-2">Quick Stats</p>
              {[
                { label: 'Applications', value: applications.length },
                { label: 'Offers',       value: offersCount },
                { label: 'Saved Courses',value: savedCourses.length },
                { label: 'IELTS Best',   value: bestIelts },
              ].map(s => (
                <div key={s.label} className="flex justify-between items-center">
                  <span className="text-xs text-blue-300/50">{s.label}</span>
                  <span className="text-xs font-bold text-white">{s.value}</span>
                </div>
              ))}
            </div>
          </aside>
        </>

        {/* ── Main content ─────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0">

          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">{TABS.find(t => t.key === activeTab)?.icon}</span>
            <h2 className="text-xl font-black text-white">{TABS.find(t => t.key === activeTab)?.label}</h2>
            {dataLoading && <span className="text-xs text-blue-400/40">Loading…</span>}
          </div>

          {activeTab === 'ielts_coaching' && <IELTSCoachingTab />}

          {activeTab === 'applications' && (
            <ApplicationsTab
              uid={currentUser.uid}
              applications={applications}
              loading={dataLoading}
              onChange={() => loadData(currentUser.uid)}
            />
          )}

          {activeTab === 'offers' && (
            <OffersTab applications={applications.filter(a => a.status === 'Offer Received')} loading={dataLoading} />
          )}

          {activeTab === 'visa' && (
            <VisaTab applications={applications.filter(a => a.status === 'Visa Applied' || a.status === 'Visa Approved')} loading={dataLoading} />
          )}

          {activeTab === 'shortlisted' && (
            <ShortlistedTab
              uid={currentUser.uid}
              courses={savedCourses}
              loading={dataLoading}
              onChange={() => loadData(currentUser.uid)}
            />
          )}

          {activeTab === 'ielts' && (
            <IeltsTab
              uid={currentUser.uid}
              scores={ieltsScores}
              loading={dataLoading}
              onChange={() => loadData(currentUser.uid)}
            />
          )}

          {activeTab === 'payments' && (
            <PaymentsTab payments={payments} loading={dataLoading} />
          )}

          {activeTab === 'profile' && (
            <ProfileTab uid={currentUser.uid} profile={userProfile} onSaved={refreshProfile} />
          )}

        </main>
      </div>
    </div>
  );
}

// ── My Applications ───────────────────────────────────────────────────────────

function ApplicationsTab({ uid, applications, loading, onChange }: {
  uid: string; applications: Application[]; loading: boolean; onChange: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    university: '', course: '', status: 'Interested' as AppStatus,
    appliedDate: new Date().toISOString().slice(0, 10), notes: '',
  });

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await addDoc(collection(db, 'users', uid, 'applications'), { ...form, createdAt: serverTimestamp() });
      await trackActivity(uid);
      setForm({ university: '', course: '', status: 'Interested', appliedDate: new Date().toISOString().slice(0, 10), notes: '' });
      setShowForm(false);
      onChange();
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(appId: string, status: AppStatus) {
    await updateDoc(doc(db, 'users', uid, 'applications', appId), { status });
    onChange();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(v => !v)}
          className="px-4 py-2 text-xs font-semibold bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors">
          {showForm ? 'Cancel' : '+ Add Application'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="rounded-xl border border-white/8 bg-white/3 p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input required placeholder="University name" value={form.university}
              onChange={e => setForm(f => ({ ...f, university: e.target.value }))} className={INPUT_CLS} />
            <input required placeholder="Course name" value={form.course}
              onChange={e => setForm(f => ({ ...f, course: e.target.value }))} className={INPUT_CLS} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as AppStatus }))} className={SELECT_CLS}>
              {STATUS_PIPELINE.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input type="date" value={form.appliedDate}
              onChange={e => setForm(f => ({ ...f, appliedDate: e.target.value }))} className={INPUT_CLS} />
          </div>
          <textarea placeholder="Notes (optional)" value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className={INPUT_CLS} rows={2} />
          <button type="submit" disabled={saving}
            className="px-4 py-2 text-xs font-semibold bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white rounded-lg transition-colors">
            {saving ? 'Saving…' : 'Save Application'}
          </button>
        </form>
      )}

      {!loading && applications.length === 0 && (
        <EmptyState icon="📋" title="No applications yet" desc="Add your first university application above." />
      )}

      {applications.map(app => (
        <div key={app.id} className="rounded-xl border border-white/8 bg-white/3 hover:bg-white/5 transition-colors p-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="font-bold text-white text-sm leading-tight">{app.university}</p>
              <p className="text-xs text-blue-300/70 mt-0.5">{app.course}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-[11px] text-blue-400/50">Applied: {app.appliedDate}</span>
                {app.notes && <><span className="text-[11px] text-blue-400/50">·</span><span className="text-[11px] text-blue-400/50">{app.notes}</span></>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={statusChip(app.status)}>{app.status}</span>
              <select
                value={app.status}
                onChange={e => handleStatusChange(app.id, e.target.value as AppStatus)}
                className="text-[11px] bg-[#0B1437] border border-white/15 rounded-lg px-2 py-1 text-blue-200 focus:outline-none focus:border-gold-500"
              >
                {STATUS_PIPELINE.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Offers Received ───────────────────────────────────────────────────────────

function OffersTab({ applications, loading }: { applications: Application[]; loading: boolean }) {
  if (!loading && applications.length === 0) {
    return <EmptyState icon="📩" title="No offers yet" desc="Offers you receive will show up here automatically." />;
  }
  return (
    <div className="space-y-4">
      {applications.map(app => (
        <div key={app.id} className="rounded-xl border border-white/8 bg-white/3 p-5">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <p className="font-bold text-white">{app.university}</p>
              <p className="text-sm text-blue-300/70">{app.course}</p>
            </div>
            <span className={statusChip(app.status)}>{app.status}</span>
          </div>
          {app.notes && <p className="text-xs text-blue-300/60 mt-3">{app.notes}</p>}
          <div className="mt-3 flex gap-2 flex-wrap">
            <a href="https://wa.me/919971226347" target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-semibold bg-white/6 hover:bg-white/10 text-blue-200 rounded-lg transition-colors border border-white/10">
              💬 Contact Counsellor
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Visa Status ────────────────────────────────────────────────────────────────

function VisaTab({ applications, loading }: { applications: Application[]; loading: boolean }) {
  if (!loading && applications.length === 0) {
    return <EmptyState icon="🛂" title="No visa applications yet" desc="Once your application status moves to Visa Applied, it will appear here." />;
  }
  return (
    <div className="space-y-4">
      {applications.map(app => (
        <div key={app.id} className="rounded-xl border border-white/8 bg-white/3 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-white">{app.university}</p>
            <span className={statusChip(app.status)}>{app.status}</span>
          </div>
          <p className="text-xs text-blue-300/50 mb-4">{app.course} · Applied {app.appliedDate}</p>
          <div className="relative">
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/10">
              <div className="h-full bg-gold-500 transition-all duration-700"
                style={{ width: app.status === 'Visa Approved' ? '100%' : '50%' }} />
            </div>
            <div className="relative flex justify-between">
              {['Visa Applied', 'Visa Approved'].map(stage => {
                const isDone = stage === 'Visa Applied' || app.status === 'Visa Approved';
                return (
                  <div key={stage} className="flex flex-col items-center gap-2 w-1/2">
                    <div className={[
                      'w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm z-10',
                      isDone ? 'bg-gold-500 border-gold-500' : 'bg-white/5 border-white/15',
                    ].join(' ')}>
                      {isDone ? '✓' : '○'}
                    </div>
                    <p className={`text-[11px] font-semibold text-center ${isDone ? 'text-gold-400' : 'text-blue-400/50'}`}>{stage}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Shortlisted Universities ────────────────────────────────────────────────────

function ShortlistedTab({ uid, courses, loading, onChange }: {
  uid: string; courses: SavedCourse[]; loading: boolean; onChange: () => void;
}) {
  async function handleRemove(courseId: string) {
    await deleteDoc(doc(db, 'users', uid, 'savedCourses', courseId));
    onChange();
  }

  if (!loading && courses.length === 0) {
    return <EmptyState icon="⭐" title="No saved courses yet" desc="Tap “Save Course” on any course page to shortlist it here." />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {courses.map(c => (
        <div key={c.id} className="rounded-xl border border-white/8 bg-white/3 hover:bg-white/5 transition-colors p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="font-bold text-white text-sm leading-tight">{c.name}</p>
            <button onClick={() => handleRemove(c.id)}
              className="text-[11px] text-red-400/70 hover:text-red-400 px-2 py-0.5 rounded border border-red-500/20 hover:bg-red-500/10 transition-colors shrink-0">
              Remove
            </button>
          </div>
          {c.university && <p className="text-xs text-blue-300/70 mb-3">{c.university}</p>}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-blue-400/50">Fee</span>
              <p className="text-white font-semibold">{c.fee ?? '–'}</p>
            </div>
            <div>
              <span className="text-blue-400/50">IELTS Min</span>
              <p className="text-white font-semibold">{c.ielts ?? '–'}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── My IELTS Scores ─────────────────────────────────────────────────────────────

function IeltsTab({ uid, scores, loading, onChange }: {
  uid: string; scores: IeltsScore[]; loading: boolean; onChange: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    testDate: new Date().toISOString().slice(0, 10),
    overall: '', listening: '', reading: '', writing: '', speaking: '',
  });

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await addDoc(collection(db, 'users', uid, 'ieltsScores'), {
        testDate: form.testDate,
        overall: parseFloat(form.overall),
        listening: parseFloat(form.listening),
        reading: parseFloat(form.reading),
        writing: parseFloat(form.writing),
        speaking: parseFloat(form.speaking),
        createdAt: serverTimestamp(),
      });
      await trackActivity(uid);
      setForm({ testDate: new Date().toISOString().slice(0, 10), overall: '', listening: '', reading: '', writing: '', speaking: '' });
      setShowForm(false);
      onChange();
    } finally {
      setSaving(false);
    }
  }

  const best = scores.length ? Math.max(...scores.map(s => s.overall)) : null;
  const bestScore = scores.find(s => s.overall === best);
  const chartData: ChartPoint[] = scores.map(s => ({ date: s.testDate, overall: s.overall, L: s.listening, R: s.reading, W: s.writing, S: s.speaking }));

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(v => !v)}
          className="px-4 py-2 text-xs font-semibold bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors">
          {showForm ? 'Cancel' : '+ Add Score'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="rounded-xl border border-white/8 bg-white/3 p-4 space-y-3">
          <input type="date" value={form.testDate} onChange={e => setForm(f => ({ ...f, testDate: e.target.value }))} className={INPUT_CLS} />
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {(['overall', 'listening', 'reading', 'writing', 'speaking'] as const).map(field => (
              <input key={field} required type="number" min={0} max={9} step={0.5}
                placeholder={field[0].toUpperCase() + field.slice(1)}
                value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                className={INPUT_CLS} />
            ))}
          </div>
          <button type="submit" disabled={saving}
            className="px-4 py-2 text-xs font-semibold bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white rounded-lg transition-colors">
            {saving ? 'Saving…' : 'Save Score'}
          </button>
        </form>
      )}

      {!loading && scores.length === 0 && (
        <EmptyState icon="📊" title="No IELTS scores yet" desc="Add your latest attempt above to start tracking progress." />
      )}

      {bestScore && (
        <div className="rounded-xl border border-gold-500/25 bg-gold-500/8 p-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs font-bold text-gold-400/80 uppercase tracking-widest mb-1">🏆 Best Overall Score</p>
              <p className="text-5xl font-black text-gold-400">{bestScore.overall.toFixed(1)}</p>
              <p className="text-xs text-blue-300/50 mt-1">{bestScore.testDate}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { s: 'Listening', v: bestScore.listening }, { s: 'Reading', v: bestScore.reading },
                { s: 'Writing', v: bestScore.writing }, { s: 'Speaking', v: bestScore.speaking },
              ].map(({ s, v }) => (
                <div key={s} className="text-center">
                  <p className="text-xl font-black text-white">{v.toFixed(1)}</p>
                  <p className="text-[11px] text-blue-400/60">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {scores.length >= 2 && (
        <div className="rounded-xl border border-white/8 bg-white/3 p-5">
          <p className="text-sm font-bold text-white mb-4">Score Progression</p>
          <IELTSChart data={chartData} />
        </div>
      )}

      {scores.length > 0 && (
        <div className="rounded-xl border border-white/8 bg-white/3 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {['Date', 'Overall', 'Listening', 'Reading', 'Writing', 'Speaking'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-blue-400/50 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...scores].reverse().map(d => (
                <tr key={d.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{d.testDate}</td>
                  <td className="px-4 py-3"><span className="font-bold text-gold-400">{d.overall.toFixed(1)}</span></td>
                  <td className="px-4 py-3 text-blue-200">{d.listening.toFixed(1)}</td>
                  <td className="px-4 py-3 text-blue-200">{d.reading.toFixed(1)}</td>
                  <td className="px-4 py-3 text-blue-200">{d.writing.toFixed(1)}</td>
                  <td className="px-4 py-3 text-blue-200">{d.speaking.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Payments ───────────────────────────────────────────────────────────────────

function PaymentsTab({ payments, loading }: { payments: Payment[]; loading: boolean }) {
  if (!loading && payments.length === 0) {
    return (
      <div className="rounded-xl border border-white/8 bg-white/3 p-12 text-center">
        <p className="text-5xl mb-3">💳</p>
        <p className="text-white font-bold mb-1">No payment records yet</p>
        <p className="text-sm text-blue-400/50 mb-4">Contact us for payment details.</p>
        <a href="https://wa.me/919971226347" target="_blank" rel="noopener noreferrer"
          className="inline-block px-4 py-2 text-xs font-semibold bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors">
          💬 WhatsApp Us
        </a>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {payments.map(p => (
        <div key={p.id} className="rounded-xl border border-white/8 bg-white/3 p-4 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-sm font-semibold text-white">{p.service}</p>
            {p.date
              ? <p className="text-xs text-blue-400/50 mt-0.5">{p.date}</p>
              : <p className="text-xs text-red-400/70 mt-0.5">Payment pending</p>}
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-white">{p.amount}</span>
            <span className={statusChip(p.status)}>{p.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── My Profile ──────────────────────────────────────────────────────────────────

function ProfileTab({ uid, profile, onSaved }: { uid: string; profile: UserProfile | null; onSaved: () => Promise<void> }) {
  const [form, setForm] = useState({
    name: profile?.name ?? '', phone: profile?.phone ?? '',
    targetCountry: profile?.targetCountry ?? '', budget: profile?.budget ?? '',
    interestedCourse: profile?.interestedCourse ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({
      name: profile?.name ?? '', phone: profile?.phone ?? '',
      targetCountry: profile?.targetCountry ?? '', budget: profile?.budget ?? '',
      interestedCourse: profile?.interestedCourse ?? '',
    });
  }, [profile]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await updateDoc(doc(db, 'users', uid), { ...form });
      await trackActivity(uid);
      await onSaved();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="max-w-lg rounded-xl border border-white/8 bg-white/3 p-6 space-y-4">
      <div>
        <label className="block text-xs font-semibold text-blue-300/80 mb-2 uppercase tracking-wider">Full Name</label>
        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={INPUT_CLS} required />
      </div>
      <div>
        <label className="block text-xs font-semibold text-blue-300/80 mb-2 uppercase tracking-wider">Email</label>
        <input value={profile?.email ?? ''} disabled className={INPUT_CLS + ' opacity-50 cursor-not-allowed'} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-blue-300/80 mb-2 uppercase tracking-wider">Phone</label>
        <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={INPUT_CLS} required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-blue-300/80 mb-2 uppercase tracking-wider">Target Country</label>
          <select value={form.targetCountry} onChange={e => setForm(f => ({ ...f, targetCountry: e.target.value }))} className={SELECT_CLS}>
            <option value="">Select country</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-blue-300/80 mb-2 uppercase tracking-wider">Budget Range</label>
          <select value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} className={SELECT_CLS}>
            <option value="">Select budget</option>
            {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-blue-300/80 mb-2 uppercase tracking-wider">Interested Course</label>
        <input value={form.interestedCourse} onChange={e => setForm(f => ({ ...f, interestedCourse: e.target.value }))} className={INPUT_CLS} />
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving}
          className="px-5 py-2.5 text-sm font-semibold bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white rounded-lg transition-colors">
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        {saved && <span className="text-xs text-green-400">✓ Saved</span>}
      </div>
    </form>
  );
}

// ── Shared helpers ───────────────────────────────────────────────────────────────

function EmptyState({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/3 p-12 text-center">
      <p className="text-5xl mb-3">{icon}</p>
      <p className="text-white font-bold mb-1">{title}</p>
      <p className="text-sm text-blue-400/50">{desc}</p>
    </div>
  );
}
