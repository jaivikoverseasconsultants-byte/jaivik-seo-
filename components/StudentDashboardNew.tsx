'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import IELTSCoachingTab from '@/components/IELTSCoachingTab';

// ── Demo data ────────────────────────────────────────────────────────────────

const DEMO = {
  student: { name: 'Rahul Sharma', email: 'student@demo.com', phone: '+91 98765 43210', counsellor: 'Priya Joshi', initials: 'RS' },
  applications: [
    { id: 1, university: 'University of Toronto',            flag: '🇨🇦', course: 'MSc Computer Science',       intake: 'Sep 2026', status: 'Accepted',          fee: 'CAD 45,000/yr', date: '10 Dec 2025', offerType: 'Unconditional', offerDeadline: '30 May 2026' },
    { id: 2, university: 'University of Warwick',            flag: '🇬🇧', course: 'MSc Data Science',           intake: 'Sep 2026', status: 'Under Review',      fee: 'GBP 28,000/yr', date: '05 Jan 2026', offerType: null, offerDeadline: null },
    { id: 3, university: 'University of British Columbia',   flag: '🇨🇦', course: 'MSc AI & Machine Learning', intake: 'Jan 2027', status: 'Conditional Offer', fee: 'CAD 42,000/yr', date: '28 Dec 2025', offerType: 'Conditional', offerDeadline: '15 Apr 2026' },
    { id: 4, university: 'TU Munich',                       flag: '🇩🇪', course: 'MSc Electrical Engineering',intake: 'Oct 2026', status: 'Submitted',         fee: 'EUR 1,500/yr',  date: '15 Jan 2026', offerType: null, offerDeadline: null },
    { id: 5, university: 'University of Melbourne',          flag: '🇦🇺', course: 'MBA',                       intake: 'Feb 2027', status: 'Rejected',          fee: 'AUD 48,000/yr', date: '20 Nov 2025', offerType: null, offerDeadline: null },
    { id: 6, university: 'McGill University',                flag: '🇨🇦', course: 'MSc Statistics',            intake: 'Sep 2026', status: 'Not Enrolled',      fee: 'CAD 22,000/yr', date: '01 Oct 2025', offerType: 'Unconditional', offerDeadline: '01 Mar 2026' },
    { id: 7, university: 'University of Edinburgh',          flag: '🇬🇧', course: 'MSc Data Analytics',       intake: 'Sep 2026', status: 'Deferred',          fee: 'GBP 24,000/yr', date: '15 Sep 2025', deferredTo: 'Sep 2027', deferReason: 'Visa delay' },
  ],
  payments: [
    { id: 1, desc: 'Counselling & Processing Fee', amount: '₹25,000', status: 'Paid',    date: '15 Oct 2025', method: 'UPI' },
    { id: 2, desc: 'University of Toronto – Application',  amount: '₹12,500', status: 'Paid',    date: '05 Dec 2025', method: 'Net Banking' },
    { id: 3, desc: 'University of British Columbia – App', amount: '₹10,000', status: 'Paid',    date: '20 Dec 2025', method: 'UPI' },
    { id: 4, desc: 'Visa Filing & Documentation',          amount: '₹8,500',  status: 'Pending', date: null, method: null },
    { id: 5, desc: 'IELTS Score Sending (3 Unis)',          amount: '₹2,100',  status: 'Pending', date: null, method: null },
  ],
  ielts: [
    { attempt: 1, date: 'Aug 2025', overall: 6.0, L: 6.5, R: 5.5, W: 6.0, S: 6.0 },
    { attempt: 2, date: 'Nov 2025', overall: 6.5, L: 7.0, R: 6.0, W: 6.0, S: 6.5 },
    { attempt: 3, date: 'Feb 2026', overall: 7.0, L: 7.5, R: 7.0, W: 6.5, S: 7.0 },
  ],
  shortlisted: [
    { name: 'University of Toronto',          flag: '🇨🇦', qs: '#18',  course: 'MSc CS',             fee: 'CAD 45K',  ielts: '7.0', pgwp: true  },
    { name: 'University of Warwick',          flag: '🇬🇧', qs: '#69',  course: 'MSc Data Science',   fee: 'GBP 28K',  ielts: '6.5', pgwp: false },
    { name: 'NUS Singapore',                  flag: '🇸🇬', qs: '#8',   course: 'MSc CS',             fee: 'SGD 42K',  ielts: '6.5', pgwp: false },
    { name: 'University of Melbourne',        flag: '🇦🇺', qs: '#14',  course: 'MBA',                fee: 'AUD 48K',  ielts: '6.5', pgwp: false },
    { name: 'TU Munich',                      flag: '🇩🇪', qs: '#37',  course: 'MSc Engineering',    fee: 'EUR 1.5K', ielts: '6.5', pgwp: false },
    { name: 'University of British Columbia', flag: '🇨🇦', qs: '#34',  course: 'MSc AI',             fee: 'CAD 42K',  ielts: '6.5', pgwp: true  },
  ],
};

const VISA_STAGES = [
  { label: 'Yet to File', icon: '📋', done: true  },
  { label: 'Filed',       icon: '📤', done: true  },
  { label: 'Under Review',icon: '🔍', done: true  },
  { label: 'Received',    icon: '✅', done: false },
];
const VISA_CURRENT_STAGE = 2; // 0-indexed, currently "Under Review"

// ── Status helpers ────────────────────────────────────────────────────────────

function statusChip(status: string) {
  const map: Record<string, string> = {
    'Accepted':         'bg-green-500/15 text-green-400 border-green-500/25',
    'Conditional Offer':'bg-orange-500/15 text-orange-400 border-orange-500/25',
    'Unconditional Offer':'bg-teal-500/15 text-teal-400 border-teal-500/25',
    'Under Review':     'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
    'Submitted':        'bg-blue-500/15 text-blue-400 border-blue-500/25',
    'Rejected':         'bg-red-500/15 text-red-400 border-red-500/25',
    'Not Enrolled':     'bg-gray-500/15 text-gray-400 border-gray-500/25',
    'Deferred':         'bg-purple-500/15 text-purple-400 border-purple-500/25',
    'Paid':             'bg-green-500/15 text-green-400 border-green-500/25',
    'Pending':          'bg-red-500/15 text-red-400 border-red-500/25',
  };
  const cls = map[status] ?? 'bg-gray-500/15 text-gray-400 border-gray-500/25';
  return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`;
}

// ── IELTS Chart (pure SVG) ────────────────────────────────────────────────────

function IELTSChart({ data }: { data: typeof DEMO.ielts }) {
  const W = 480, H = 180, PAD = { top: 20, right: 20, bottom: 40, left: 40 };
  const xScale = (i: number) => PAD.left + (i / (data.length - 1)) * (W - PAD.left - PAD.right);
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
        {/* Grid lines */}
        {[5, 6, 7, 8, 9].map(v => (
          <g key={v}>
            <line x1={PAD.left} y1={yScale(v)} x2={W - PAD.right} y2={yScale(v)}
              stroke="rgba(255,255,255,0.07)" strokeWidth={1} strokeDasharray="4 4" />
            <text x={PAD.left - 6} y={yScale(v) + 4} textAnchor="end" fontSize={10} fill="rgba(255,255,255,0.3)">{v}</text>
          </g>
        ))}

        {/* X labels */}
        {data.map((d, i) => (
          <text key={i} x={xScale(i)} y={H - PAD.bottom + 16} textAnchor="middle" fontSize={10} fill="rgba(255,255,255,0.4)">{d.date}</text>
        ))}

        {/* Lines */}
        {lines.map(line => (
          <polyline
            key={line.key}
            points={data.map((d, i) => `${xScale(i)},${yScale(d[line.key])}`).join(' ')}
            fill="none"
            stroke={line.color}
            strokeWidth={line.width}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        {/* Dots for overall */}
        {data.map((d, i) => (
          <circle key={i} cx={xScale(i)} cy={yScale(d.overall)} r={5}
            fill="#0b1437" stroke="#f59e0b" strokeWidth={2.5} />
        ))}

        {/* Overall score labels */}
        {data.map((d, i) => (
          <text key={i} x={xScale(i)} y={yScale(d.overall) - 10}
            textAnchor="middle" fontSize={11} fontWeight="bold" fill="#f59e0b">
            {d.overall.toFixed(1)}
          </text>
        ))}
      </svg>

      {/* Legend */}
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

type TabKey = 'ielts_coaching'|'applications'|'offers'|'visa'|'payments'|'non_enrolled'|'deferrals'|'ielts'|'shortlisted';

const TABS: { key: TabKey; label: string; icon: string; badge?: number }[] = [
  { key: 'ielts_coaching', label: 'IELTS Coaching',         icon: '🎯' },
  { key: 'applications', label: 'My Applications',       icon: '📋', badge: DEMO.applications.length },
  { key: 'offers',       label: 'Offers Received',        icon: '📩', badge: DEMO.applications.filter(a => a.offerType).length },
  { key: 'visa',         label: 'Visa Status',            icon: '🛂' },
  { key: 'payments',     label: 'Payments',               icon: '💳' },
  { key: 'non_enrolled', label: 'Non-Enrollments',        icon: '🚫' },
  { key: 'deferrals',    label: 'Deferrals',              icon: '⏩' },
  { key: 'ielts',        label: 'My IELTS Scores',        icon: '📊' },
  { key: 'shortlisted',  label: 'Shortlisted Universities',icon: '⭐' },
];

// ── Main component ────────────────────────────────────────────────────────────

export default function StudentDashboardNew() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [student, setStudent] = useState<{ name: string; email: string } | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('ielts_coaching');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem('joc_student_auth');
    if (!raw) { router.replace('/student-login'); return; }
    try {
      const auth = JSON.parse(raw);
      setStudent(auth);
    } catch {
      router.replace('/student-login');
      return;
    }
    setAuthChecked(true);
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('joc_student_auth');
    router.push('/student-login');
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0b1437' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-blue-300/70 text-sm">Loading portal…</p>
        </div>
      </div>
    );
  }

  const initials = (student?.name ?? 'RS').split(' ').map(n => n[0]).join('').toUpperCase();

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
              <p className="text-sm font-semibold text-white leading-tight">{student?.name ?? DEMO.student.name}</p>
              <p className="text-[11px] text-blue-400/60">Counsellor: {DEMO.student.counsellor}</p>
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
          {/* Mobile backdrop */}
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

            {/* Stats summary */}
            <div className="mt-6 p-3.5 rounded-xl bg-white/4 border border-white/8 space-y-2">
              <p className="text-[10px] font-bold text-blue-400/50 uppercase tracking-widest mb-2">Quick Stats</p>
              {[
                { label: 'Applications', value: DEMO.applications.length },
                { label: 'Offers', value: DEMO.applications.filter(a => a.offerType).length },
                { label: 'Paid', value: `₹${DEMO.payments.filter(p => p.status === 'Paid').length > 0 ? '47,500' : '0'}` },
                { label: 'IELTS Best', value: '7.0' },
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

          {/* Tab header */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">{TABS.find(t => t.key === activeTab)?.icon}</span>
            <h2 className="text-xl font-black text-white">{TABS.find(t => t.key === activeTab)?.label}</h2>
          </div>

          {/* ── IELTS COACHING ──────────────────────────────────────────── */}
          {activeTab === 'ielts_coaching' && <IELTSCoachingTab />}

          {/* ── MY APPLICATIONS ─────────────────────────────────────────── */}
          {activeTab === 'applications' && (
            <div className="space-y-3">
              {DEMO.applications.map(app => (
                <div key={app.id} className="rounded-xl border border-white/8 bg-white/3 hover:bg-white/5 transition-colors p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5">{app.flag}</span>
                      <div>
                        <p className="font-bold text-white text-sm leading-tight">{app.university}</p>
                        <p className="text-xs text-blue-300/70 mt-0.5">{app.course}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-[11px] text-blue-400/50">Intake: {app.intake}</span>
                          <span className="text-[11px] text-blue-400/50">·</span>
                          <span className="text-[11px] text-blue-400/50">{app.fee}</span>
                          <span className="text-[11px] text-blue-400/50">·</span>
                          <span className="text-[11px] text-blue-400/50">Applied: {app.date}</span>
                        </div>
                      </div>
                    </div>
                    <span className={statusChip(app.status)}>{app.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── OFFERS RECEIVED ────────────────────────────────────────── */}
          {activeTab === 'offers' && (
            <div className="space-y-4">
              {DEMO.applications.filter(a => a.offerType).map(app => (
                <div key={app.id} className="rounded-xl border border-white/8 bg-white/3 p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-2xl">{app.flag}</span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <p className="font-bold text-white">{app.university}</p>
                          <p className="text-sm text-blue-300/70">{app.course}</p>
                        </div>
                        <span className={statusChip(app.offerType === 'Unconditional' ? 'Accepted' : 'Conditional Offer')}>
                          {app.offerType} Offer
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <InfoCell label="Intake" value={app.intake} />
                    <InfoCell label="Annual Fee" value={app.fee} />
                    <InfoCell label="Respond By" value={app.offerDeadline ?? '–'} highlight />
                  </div>
                  {app.offerType === 'Conditional' && (
                    <div className="mt-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <p className="text-xs font-bold text-orange-400 mb-1.5">📋 Conditions to fulfil:</p>
                      <ul className="space-y-1">
                        {['IELTS 7.0 overall (current: 6.5)', 'Final semester transcripts', 'Statement of Purpose revision'].map(c => (
                          <li key={c} className="text-xs text-orange-300/80 flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-orange-400 shrink-0" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-3 flex gap-2 flex-wrap">
                    <button className="px-4 py-2 text-xs font-semibold bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors">
                      📥 Download Offer Letter
                    </button>
                    <button className="px-4 py-2 text-xs font-semibold bg-white/6 hover:bg-white/10 text-blue-200 rounded-lg transition-colors border border-white/10">
                      💬 Contact Counsellor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── VISA STATUS ─────────────────────────────────────────────── */}
          {activeTab === 'visa' && (
            <div className="space-y-6">
              {/* Progress track */}
              <div className="rounded-xl border border-white/8 bg-white/3 p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-white">Canada Student Visa (SDS)</p>
                  <span className={statusChip('Under Review')}>Under Review</span>
                </div>
                <p className="text-xs text-blue-300/50 mb-6">University of Toronto · MSc Computer Science · Sep 2026</p>

                {/* Stage tracker */}
                <div className="relative">
                  {/* Connecting line */}
                  <div className="absolute top-5 left-5 right-5 h-0.5 bg-white/10">
                    <div className="h-full bg-gold-500 transition-all duration-700"
                      style={{ width: `${(VISA_CURRENT_STAGE / (VISA_STAGES.length - 1)) * 100}%` }} />
                  </div>

                  <div className="relative flex justify-between">
                    {VISA_STAGES.map((stage, i) => {
                      const isDone = i < VISA_CURRENT_STAGE;
                      const isCurrent = i === VISA_CURRENT_STAGE;
                      return (
                        <div key={stage.label} className="flex flex-col items-center gap-2 w-1/4">
                          <div className={[
                            'w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg z-10 transition-all',
                            isDone    ? 'bg-gold-500 border-gold-500' :
                            isCurrent ? 'bg-gold-500/20 border-gold-500 animate-pulse' :
                                        'bg-white/5 border-white/15',
                          ].join(' ')}>
                            {isDone ? '✓' : stage.icon}
                          </div>
                          <p className={`text-[11px] font-semibold text-center leading-tight ${isCurrent ? 'text-gold-400' : isDone ? 'text-green-400' : 'text-blue-400/50'}`}>
                            {stage.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Rejected case info */}
              <div className="rounded-xl border border-white/8 bg-white/3 p-5">
                <p className="font-bold text-white text-sm mb-3">📎 Visa Documents Checklist</p>
                <div className="space-y-2">
                  {[
                    { doc: 'Offer Letter',              status: 'Submitted' },
                    { doc: 'Bank Statement (₹25L+)',    status: 'Submitted' },
                    { doc: 'Passport (valid 10 yrs)',   status: 'Submitted' },
                    { doc: 'IELTS Score Card (7.0)',    status: 'Pending'   },
                    { doc: 'GIC Receipt',                status: 'Pending'   },
                    { doc: 'SOP & LOR (2 letters)',      status: 'Submitted' },
                  ].map(d => (
                    <div key={d.doc} className="flex items-center justify-between text-sm">
                      <span className="text-blue-200/80">{d.doc}</span>
                      <span className={statusChip(d.status)}>{d.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── PAYMENTS ────────────────────────────────────────────────── */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-2">
                {[
                  { label: 'Total Paid', value: '₹47,500', color: 'text-green-400' },
                  { label: 'Pending',    value: '₹10,600', color: 'text-red-400'   },
                  { label: 'Total',      value: '₹58,100', color: 'text-white'     },
                ].map(s => (
                  <div key={s.label} className="rounded-xl border border-white/8 bg-white/3 p-4 text-center">
                    <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-blue-400/50 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Payment rows */}
              {DEMO.payments.map(p => (
                <div key={p.id} className="rounded-xl border border-white/8 bg-white/3 p-4 flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-sm font-semibold text-white">{p.desc}</p>
                    {p.date
                      ? <p className="text-xs text-blue-400/50 mt-0.5">Paid on {p.date} via {p.method}</p>
                      : <p className="text-xs text-red-400/70 mt-0.5">Payment pending</p>
                    }
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white">{p.amount}</span>
                    <span className={statusChip(p.status)}>{p.status}</span>
                    {p.status === 'Pending' && (
                      <button className="px-3 py-1.5 text-xs bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-semibold transition-colors">
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── NON-ENROLLMENTS ─────────────────────────────────────────── */}
          {activeTab === 'non_enrolled' && (
            <div className="space-y-3">
              <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4 text-sm text-orange-300/80">
                ℹ️ Non-enrollments are universities where you received an offer but chose not to enrol. Your counsellor has notified these universities.
              </div>
              {DEMO.applications.filter(a => a.status === 'Not Enrolled').map(app => (
                <div key={app.id} className="rounded-xl border border-white/8 bg-white/3 p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{app.flag}</span>
                      <div>
                        <p className="font-bold text-white text-sm">{app.university}</p>
                        <p className="text-xs text-blue-300/70">{app.course} · {app.intake}</p>
                        <p className="text-xs text-blue-400/50 mt-1">Offer received · Non-enrollment submitted</p>
                      </div>
                    </div>
                    <span className={statusChip('Not Enrolled')}>Not Enrolled</span>
                  </div>
                </div>
              ))}
              {DEMO.applications.filter(a => a.status === 'Not Enrolled').length === 0 && (
                <EmptyState icon="🎓" title="No non-enrollments" desc="You haven't declined any offers yet." />
              )}
            </div>
          )}

          {/* ── DEFERRALS ───────────────────────────────────────────────── */}
          {activeTab === 'deferrals' && (
            <div className="space-y-3">
              {DEMO.applications.filter(a => a.status === 'Deferred').map(app => (
                <div key={app.id} className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{app.flag}</span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 flex-wrap mb-3">
                        <div>
                          <p className="font-bold text-white">{app.university}</p>
                          <p className="text-sm text-blue-300/70">{app.course}</p>
                        </div>
                        <span className={statusChip('Deferred')}>Deferred</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <InfoCell label="Original Intake" value={app.intake} />
                        <InfoCell label="Deferred To" value={(app as any).deferredTo ?? '–'} highlight />
                        <InfoCell label="Reason" value={(app as any).deferReason ?? '–'} />
                        <InfoCell label="Fee" value={app.fee} />
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button className="px-4 py-2 text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/25 rounded-lg font-semibold transition-colors">
                          📄 View Deferral Letter
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {DEMO.applications.filter(a => a.status === 'Deferred').length === 0 && (
                <EmptyState icon="⏩" title="No deferrals" desc="You have no deferred applications." />
              )}
            </div>
          )}

          {/* ── MY IELTS SCORES ─────────────────────────────────────────── */}
          {activeTab === 'ielts' && (
            <div className="space-y-5">
              {/* Best score banner */}
              <div className="rounded-xl border border-gold-500/25 bg-gold-500/8 p-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-xs font-bold text-gold-400/80 uppercase tracking-widest mb-1">🏆 Best Overall Score</p>
                    <p className="text-5xl font-black text-gold-400">7.0</p>
                    <p className="text-xs text-blue-300/50 mt-1">Feb 2026 · Attempt 3</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { s: 'L', v: 7.5 }, { s: 'R', v: 7.0 },
                      { s: 'W', v: 6.5 }, { s: 'S', v: 7.0 },
                    ].map(({ s, v }) => (
                      <div key={s} className="text-center">
                        <p className="text-xl font-black text-white">{v.toFixed(1)}</p>
                        <p className="text-[11px] text-blue-400/60">{s === 'L' ? 'Listening' : s === 'R' ? 'Reading' : s === 'W' ? 'Writing' : 'Speaking'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="rounded-xl border border-white/8 bg-white/3 p-5">
                <p className="text-sm font-bold text-white mb-4">Score Progression</p>
                <IELTSChart data={DEMO.ielts} />
              </div>

              {/* Attempt table */}
              <div className="rounded-xl border border-white/8 bg-white/3 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8">
                      {['Attempt', 'Date', 'Overall', 'Listening', 'Reading', 'Writing', 'Speaking'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-blue-400/50 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...DEMO.ielts].reverse().map(d => (
                      <tr key={d.attempt} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                        <td className="px-4 py-3 text-blue-300/70">#{d.attempt}</td>
                        <td className="px-4 py-3 text-white font-medium">{d.date}</td>
                        <td className="px-4 py-3"><span className="font-bold text-gold-400">{d.overall.toFixed(1)}</span></td>
                        <td className="px-4 py-3 text-blue-200">{d.L.toFixed(1)}</td>
                        <td className="px-4 py-3 text-blue-200">{d.R.toFixed(1)}</td>
                        <td className="px-4 py-3 text-blue-200">{d.W.toFixed(1)}</td>
                        <td className="px-4 py-3 text-blue-200">{d.S.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── SHORTLISTED UNIVERSITIES ────────────────────────────────── */}
          {activeTab === 'shortlisted' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DEMO.shortlisted.map(u => (
                <div key={u.name} className="rounded-xl border border-white/8 bg-white/3 hover:bg-white/5 transition-colors p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{u.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-bold text-white text-sm leading-tight">{u.name}</p>
                        <span className="text-[11px] font-bold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20 whitespace-nowrap">
                          QS {u.qs}
                        </span>
                      </div>
                      <p className="text-xs text-blue-300/70 mb-3">{u.course}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-blue-400/50">Tuition</span>
                          <p className="text-white font-semibold">{u.fee}/yr</p>
                        </div>
                        <div>
                          <span className="text-blue-400/50">IELTS Min</span>
                          <p className="text-white font-semibold">{u.ielts}+</p>
                        </div>
                      </div>
                      {u.pgwp && (
                        <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-green-400 bg-green-500/10 border border-green-500/20 rounded px-2 py-0.5">
                          ✓ PGWP Eligible
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function InfoCell({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-white/4 rounded-lg px-3 py-2">
      <p className="text-[10px] text-blue-400/50 uppercase tracking-wide mb-0.5">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? 'text-gold-400' : 'text-white'}`}>{value}</p>
    </div>
  );
}

function EmptyState({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/3 p-12 text-center">
      <p className="text-5xl mb-3">{icon}</p>
      <p className="text-white font-bold mb-1">{title}</p>
      <p className="text-sm text-blue-400/50">{desc}</p>
    </div>
  );
}
