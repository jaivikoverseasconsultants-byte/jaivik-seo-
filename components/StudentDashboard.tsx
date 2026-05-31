'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { StudentData, ApplicationRecord } from './StudentPortalClient';

function dailyCode(studentId: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const str = studentId + today;
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
  return (Math.abs(h) % 1_000_000).toString().padStart(6, '0');
}

const STATUS_COLORS: Record<string, string> = {
  'Applied':            'bg-blue-50 text-blue-700',
  'Under Review':       'bg-yellow-50 text-yellow-700',
  'Conditional Offer':  'bg-orange-50 text-orange-700',
  'Unconditional Offer':'bg-teal-50 text-teal-700',
  'Accepted':           'bg-green-50 text-green-700',
  'Rejected':           'bg-red-50 text-red-700',
  'Deferred':           'bg-purple-50 text-purple-700',
  'Not Enrolled':       'bg-gray-100 text-gray-600',
};

const VISA_COLORS: Record<string, string> = {
  'Not Filed': 'bg-gray-100 text-gray-500',
  'Filed':     'bg-blue-50 text-blue-700',
  'Awaited':   'bg-yellow-50 text-yellow-700',
  'Received':  'bg-green-50 text-green-700',
  'Rejected':  'bg-red-50 text-red-700',
};

const PAY_COLORS: Record<string, string> = {
  'Pending': 'bg-red-50 text-red-600',
  'Partial': 'bg-yellow-50 text-yellow-700',
  'Paid':    'bg-green-50 text-green-700',
};

type Tab = 'all'|'offers'|'payments'|'visa'|'non_enrolled'|'deferrals';

interface TabDef { key: Tab; label: string; icon: string }
const TABS: TabDef[] = [
  { key: 'all',         label: 'All Applications', icon: '📋' },
  { key: 'offers',      label: 'Offers',           icon: '📩' },
  { key: 'payments',    label: 'Payments',         icon: '💳' },
  { key: 'visa',        label: 'Visa',             icon: '🛂' },
  { key: 'non_enrolled',label: 'Non-Enrollments',  icon: '🚫' },
  { key: 'deferrals',   label: 'Deferrals',        icon: '⏩' },
];

function filterApps(apps: ApplicationRecord[], tab: Tab): ApplicationRecord[] {
  switch (tab) {
    case 'offers':       return apps.filter(a => a.status.includes('Offer') || a.status === 'Accepted');
    case 'payments':     return apps.filter(a => a.paymentStatus !== undefined);
    case 'visa':         return apps.filter(a => a.visaStatus !== undefined);
    case 'non_enrolled': return apps.filter(a => a.status === 'Not Enrolled');
    case 'deferrals':    return apps.filter(a => a.status === 'Deferred');
    default:             return apps;
  }
}

/* ─── Application Card ───────────────────────────────────────────── */
function AppCard({ app, tab }: { app: ApplicationRecord; tab: Tab }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm leading-snug">{app.universityName}</p>
          <p className="text-xs text-gray-500 mt-0.5">{app.country} · {app.intake}</p>
          <p className="text-xs text-brand-700 font-medium mt-0.5">{app.program}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0 ${STATUS_COLORS[app.status] ?? 'bg-gray-100 text-gray-600'}`}>
          {app.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        {app.tuitionFee && (
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="font-bold text-gray-800">${(app.tuitionFee/1000).toFixed(0)}K</p>
            <p className="text-gray-400">Tuition/yr</p>
          </div>
        )}
        {app.paymentStatus && (tab === 'all' || tab === 'payments') && (
          <div className={`rounded-lg p-2 text-center ${PAY_COLORS[app.paymentStatus]}`}>
            <p className="font-bold">{app.paymentAmount ? `$${(app.paymentAmount/1000).toFixed(0)}K` : app.paymentStatus}</p>
            <p className="text-gray-400">Payment</p>
          </div>
        )}
        {app.visaStatus && (tab === 'all' || tab === 'visa') && (
          <div className={`rounded-lg p-2 text-center ${VISA_COLORS[app.visaStatus]}`}>
            <p className="font-bold text-xs">{app.visaStatus}</p>
            <p className="text-gray-400">Visa</p>
          </div>
        )}
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="font-bold text-gray-700">{new Date(app.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
          <p className="text-gray-400">Applied</p>
        </div>
      </div>

      {app.deferralIntake && (
        <p className="mt-2 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-lg">
          ⏩ Deferred to: {app.deferralIntake}
        </p>
      )}
      {app.notes && <p className="mt-2 text-xs text-gray-500 italic">{app.notes}</p>}
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────────── */
export default function StudentDashboard() {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    try {
      const s = sessionStorage.getItem('jo_student');
      if (s) setStudent(JSON.parse(s));
    } catch { /* ignore */ }
  }, []);

  function logout() {
    sessionStorage.removeItem('jo_student');
    window.location.href = '/student-portal';
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-4xl mb-4">🔐</p>
          <h2 className="font-bold text-gray-800 mb-2">Please log in</h2>
          <Link href="/student-portal" className="btn-primary">Go to Login →</Link>
        </div>
      </div>
    );
  }

  const apps = student.applications;
  const offers = apps.filter(a => a.status.includes('Offer') || a.status === 'Accepted');
  const visas  = apps.filter(a => a.visaStatus && a.visaStatus !== 'Not Filed');
  const paid   = apps.filter(a => a.paymentStatus === 'Paid');
  const tabApps = filterApps(apps, activeTab);
  const code = dailyCode(student.id);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://study.jaivikoverseasconsultants.com/student-portal/verify?id=${student.id}`)}&bgcolor=ffffff&color=1e3a5f&qzone=1&format=png`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-700 to-blue-800 text-white px-4 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-xl font-bold flex-shrink-0">
              {student.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-lg leading-tight truncate">{student.name}</h1>
              <p className="text-blue-200 text-xs">{student.id} · Registered {new Date(student.registeredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => setShowQR(p => !p)}
              className="text-xs bg-white/15 hover:bg-white/25 text-white px-3 py-2 rounded-xl font-medium">
              📱 QR Card
            </button>
            <button onClick={logout} className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl">
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* QR Card modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50" onClick={() => setShowQR(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-xs w-full p-6 text-center" onClick={e => e.stopPropagation()}>
            <h2 className="font-bold text-gray-900 mb-1">Your Student ID Card</h2>
            <p className="text-xs text-gray-500 mb-4">Scan this QR code to get your daily login code</p>
            {/* QR Code */}
            <div className="bg-white border-2 border-brand-200 rounded-2xl p-4 inline-block mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt="Student QR Code" width={160} height={160} className="rounded-lg" />
            </div>
            <p className="font-mono font-bold text-brand-700 text-lg mb-1">{student.id}</p>
            <p className="text-xs text-gray-500 mb-3">{student.name}</p>
            <div className="bg-brand-50 rounded-xl p-3 mb-4">
              <p className="text-xs text-gray-500">Today&apos;s 6-digit code</p>
              <p className="text-2xl font-mono font-bold text-brand-700 tracking-widest">{code}</p>
            </div>
            <p className="text-xs text-gray-400">Scan QR → enter code + PIN to login from any device</p>
            <button onClick={() => setShowQR(false)} className="mt-4 text-xs text-gray-500 underline">Close</button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Applications',  value: apps.length,    icon: '📋', color: 'bg-blue-50 text-blue-700' },
            { label: 'Offers',        value: offers.length,  icon: '📩', color: 'bg-green-50 text-green-700' },
            { label: 'Visas Filed',   value: visas.length,   icon: '🛂', color: 'bg-purple-50 text-purple-700' },
            { label: 'Fees Paid',     value: paid.length,    icon: '💳', color: 'bg-gold-50 text-gold-700' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className={`text-2xl font-bold ${s.color.split(' ')[1]}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex overflow-x-auto border-b border-gray-100">
            {TABS.map(t => {
              const count = filterApps(apps, t.key).length;
              return (
                <button key={t.key} onClick={() => setActiveTab(t.key)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold transition-colors whitespace-nowrap border-b-2 ${
                    activeTab === t.key
                      ? 'text-brand-700 border-brand-700 bg-brand-50/50'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
                  }`}>
                  {t.icon} {t.label}
                  {count > 0 && (
                    <span className={`text-xs rounded-full w-5 h-5 flex items-center justify-center ${activeTab === t.key ? 'bg-brand-700 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-5">
            {tabApps.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-3xl mb-3">📂</p>
                <p className="font-semibold text-gray-700 mb-1">No records yet</p>
                <p className="text-xs text-gray-400">Your counsellor will update this section.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tabApps.map(app => <AppCard key={app.id} app={app} tab={activeTab} />)}
              </div>
            )}
          </div>
        </div>

        {/* Help CTA */}
        <div className="bg-brand-700 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold">Need help with your applications?</p>
            <p className="text-blue-200 text-sm">WhatsApp your counsellor for immediate support.</p>
          </div>
          <a href="https://wa.me/919971226347" target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            WhatsApp Now
          </a>
        </div>
      </div>
    </div>
  );
}
