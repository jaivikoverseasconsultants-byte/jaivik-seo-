'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/* ─── Types ──────────────────────────────────────────────────────── */
export interface ApplicationRecord {
  id: string;
  universityName: string;
  country: string;
  program: string;
  intake: string;
  appliedDate: string;
  status: 'Applied'|'Under Review'|'Conditional Offer'|'Unconditional Offer'|'Accepted'|'Rejected'|'Deferred'|'Not Enrolled';
  tuitionFee?: number;
  paymentStatus?: 'Pending'|'Partial'|'Paid';
  paymentAmount?: number;
  visaStatus?: 'Not Filed'|'Filed'|'Awaited'|'Received'|'Rejected';
  deferralIntake?: string;
  notes?: string;
}

export interface StudentData {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredAt: string;
  pin: string; // 4-digit
  applications: ApplicationRecord[];
}

/* ─── Hash helper for daily 6-digit code ─────────────────────────── */
function dailyCode(studentId: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const str = studentId + today;
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
  return (Math.abs(h) % 1_000_000).toString().padStart(6, '0');
}

function genStudentId(): string {
  return 'JO-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
}

/* ─── Sample mock applications (used on first registration) ──────── */
const MOCK_APPS: ApplicationRecord[] = [
  {
    id: 'app-001', universityName: 'University of Toronto', country: 'Canada', program: 'MS Computer Science',
    intake: 'September 2026', appliedDate: '2026-01-10', status: 'Conditional Offer',
    tuitionFee: 42000, paymentStatus: 'Pending', visaStatus: 'Not Filed',
  },
  {
    id: 'app-002', universityName: 'University of Melbourne', country: 'Australia', program: 'Master of Data Science',
    intake: 'February 2026', appliedDate: '2026-01-15', status: 'Under Review',
    tuitionFee: 38000, paymentStatus: 'Pending', visaStatus: 'Not Filed',
  },
  {
    id: 'app-003', universityName: 'University of Birmingham', country: 'UK', program: 'MSc Artificial Intelligence',
    intake: 'September 2026', appliedDate: '2026-02-01', status: 'Accepted',
    tuitionFee: 24000, paymentStatus: 'Partial', paymentAmount: 12000, visaStatus: 'Filed',
  },
];

/* ─── Main Component ─────────────────────────────────────────────── */
export default function StudentPortalClient({ verifyId }: { verifyId?: string }) {
  const [view, setView] = useState<'login'|'register'|'verify'>('login');
  const [loginId, setLoginId] = useState(verifyId ?? '');
  const [loginPin, setLoginPin] = useState('');
  const [loginError, setLoginError] = useState('');
  const [student, setStudent] = useState<StudentData | null>(null);
  const [regForm, setRegForm] = useState({ name: '', email: '', phone: '', pin: '', pin2: '' });
  const [regError, setRegError] = useState('');

  // Load session
  useEffect(() => {
    try {
      const s = sessionStorage.getItem('jo_student');
      if (s) setStudent(JSON.parse(s));
    } catch { /* ignore */ }
  }, []);

  // If verifyId passed (from QR scan), show daily code
  useEffect(() => {
    if (verifyId) setView('verify');
  }, [verifyId]);

  function getStudentById(id: string): StudentData | null {
    try {
      const raw = localStorage.getItem('jo_student_' + id);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  function saveStudent(s: StudentData) {
    localStorage.setItem('jo_student_' + s.id, JSON.stringify(s));
    sessionStorage.setItem('jo_student', JSON.stringify(s));
    setStudent(s);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    const s = getStudentById(loginId.trim().toUpperCase());
    if (!s) { setLoginError('Student ID not found. Please check or register first.'); return; }
    if (s.pin !== loginPin) { setLoginError('Incorrect PIN. Try again.'); return; }
    sessionStorage.setItem('jo_student', JSON.stringify(s));
    setStudent(s);
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegError('');
    if (regForm.pin !== regForm.pin2) { setRegError('PINs do not match.'); return; }
    if (regForm.pin.length !== 4 || !/^\d{4}$/.test(regForm.pin)) { setRegError('PIN must be exactly 4 digits.'); return; }
    const newStudent: StudentData = {
      id: genStudentId(),
      name: regForm.name, email: regForm.email, phone: regForm.phone,
      pin: regForm.pin,
      registeredAt: new Date().toISOString(),
      applications: MOCK_APPS,
    };
    saveStudent(newStudent);
  }

  function logout() {
    sessionStorage.removeItem('jo_student');
    setStudent(null);
    setLoginId(''); setLoginPin('');
  }

  // Logged in → redirect to dashboard
  if (student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl max-w-sm w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👋</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome, {student.name.split(' ')[0]}!</h2>
          <p className="text-gray-500 text-sm mb-2">{student.id}</p>
          <p className="text-xs text-gray-400 mb-6">{student.applications.length} applications tracked</p>
          <Link href="/student-portal/dashboard" className="btn-gold w-full block text-center mb-3">
            Go to Dashboard →
          </Link>
          <button onClick={logout} className="text-xs text-gray-400 hover:text-gray-700 underline">Sign out</button>
        </div>
      </div>
    );
  }

  // Verify view (QR scan landing)
  if (view === 'verify' && loginId) {
    const s = getStudentById(loginId.trim().toUpperCase());
    const code = dailyCode(loginId.trim().toUpperCase());
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-700 to-brand-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center">
          <span className="text-4xl block mb-3">📱</span>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Your Login Code</h1>
          {s ? (
            <p className="text-gray-500 text-sm mb-4">Hello, <strong>{s.name}</strong></p>
          ) : (
            <p className="text-red-500 text-sm mb-4">Student ID not found.</p>
          )}
          <div className="bg-brand-50 border-2 border-brand-200 rounded-2xl p-5 mb-4">
            <p className="text-xs text-gray-500 mb-1">Today&apos;s 6-digit code</p>
            <p className="text-4xl font-mono font-bold text-brand-700 tracking-widest">{code}</p>
            <p className="text-xs text-gray-400 mt-2">Valid for today only</p>
          </div>
          <p className="text-xs text-gray-500">Enter this code + your 4-digit PIN on the login page.</p>
          <button onClick={() => setView('login')} className="mt-4 text-xs text-brand-700 underline">Back to login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-700 to-brand-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-700 to-blue-800 text-white p-6 text-center">
          <span className="text-3xl block mb-2">🎓</span>
          <h1 className="text-lg font-bold">Jaivik Overseas Student Portal</h1>
          <p className="text-blue-200 text-xs mt-1">Track your applications, offers & visa status</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {(['login','register'] as const).map(t => (
            <button key={t} onClick={() => { setView(t); setLoginError(''); setRegError(''); }}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${view === t ? 'text-brand-700 border-b-2 border-brand-700' : 'text-gray-500 hover:text-gray-700'}`}>
              {t === 'login' ? '🔑 Login' : '✨ Register'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {view === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Student ID</label>
                <input required value={loginId} onChange={e => setLoginId(e.target.value)} placeholder="e.g. JO-2026-123456"
                  className="input-field font-mono" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">4-Digit PIN</label>
                <input required type="password" maxLength={4} value={loginPin} onChange={e => setLoginPin(e.target.value)}
                  placeholder="••••" className="input-field font-mono tracking-widest text-center text-xl" />
              </div>
              {loginError && <p className="text-red-600 text-xs bg-red-50 p-2 rounded-lg">{loginError}</p>}
              <button type="submit" className="btn-gold w-full text-center">Login to Dashboard →</button>

              <div className="border-t border-gray-100 pt-4 text-center">
                <p className="text-xs text-gray-500 mb-2">Have a QR code? Scan it with your phone camera</p>
                <p className="text-xs text-gray-400">or <button type="button" onClick={() => setView('verify')} className="text-brand-700 underline">enter verification code</button></p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name *</label>
                <input required value={regForm.name} onChange={e => setRegForm(p => ({...p,name:e.target.value}))} placeholder="Your full name" className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Email *</label>
                  <input required type="email" value={regForm.email} onChange={e => setRegForm(p => ({...p,email:e.target.value}))} placeholder="you@email.com" className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone *</label>
                  <input required type="tel" value={regForm.phone} onChange={e => setRegForm(p => ({...p,phone:e.target.value}))} placeholder="+91 98765…" className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Set 4-digit PIN *</label>
                  <input required type="password" maxLength={4} value={regForm.pin} onChange={e => setRegForm(p => ({...p,pin:e.target.value}))} placeholder="••••" className="input-field font-mono text-center tracking-widest text-xl" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Confirm PIN *</label>
                  <input required type="password" maxLength={4} value={regForm.pin2} onChange={e => setRegForm(p => ({...p,pin2:e.target.value}))} placeholder="••••" className="input-field font-mono text-center tracking-widest text-xl" />
                </div>
              </div>
              {regError && <p className="text-red-600 text-xs bg-red-50 p-2 rounded-lg">{regError}</p>}
              <button type="submit" className="btn-gold w-full text-center">Create Account & Get Student ID →</button>
              <p className="text-xs text-gray-400 text-center">You&apos;ll get a unique Student ID and QR code after registration.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
