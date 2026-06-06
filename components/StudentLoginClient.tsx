'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function StudentLoginClient() {
  const router = useRouter();
  const [tab, setTab] = useState<'password' | 'otp'>('password');

  // Password login state
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);

  // OTP state
  const [otpVal, setOtpVal]     = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('joc_student_auth');
      if (auth) router.replace('/dashboard/student');
    }
  }, [router]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (email === 'student@demo.com' && password === 'demo123') {
        localStorage.setItem('joc_student_auth', JSON.stringify({
          email, name: 'Rahul Sharma', loginTime: Date.now(),
        }));
        router.push('/dashboard/student');
      } else {
        setError('Invalid credentials. Try student@demo.com / demo123');
        setLoading(false);
      }
    }, 800);
  }

  function handleOTPLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const otp = otpVal.join('');
    setLoading(true);
    setTimeout(() => {
      if (otp === '123456') {
        localStorage.setItem('joc_student_auth', JSON.stringify({
          email: 'student@demo.com', name: 'Rahul Sharma', loginTime: Date.now(),
        }));
        router.push('/dashboard/student');
      } else {
        setError('Invalid OTP. Demo OTP is 123456');
        setLoading(false);
      }
    }, 800);
  }

  function handleOtpInput(i: number, v: string) {
    if (v.length > 1) {
      // handle paste
      const digits = v.replace(/\D/g, '').slice(0, 6).split('');
      const next = [...otpVal];
      digits.forEach((d, idx) => { if (idx < 6) next[idx] = d; });
      setOtpVal(next);
      otpRefs.current[Math.min(digits.length, 5)]?.focus();
      return;
    }
    const next = [...otpVal];
    next[i] = v.replace(/\D/g, '');
    setOtpVal(next);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
  }

  function handleOtpKey(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otpVal[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #060e1f 0%, #0b1437 50%, #0d1e3a 100%)' }}
    >
      {/* Logo + Back */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to site
        </Link>
        <div className="flex items-center gap-2">
          <img src="/joc-logo-circle.jpeg" alt="Jaivik Overseas" className="h-8 w-8 rounded-full ring-2 ring-gold-500/40" />
          <span className="text-sm font-semibold text-white">Jaivik Overseas</span>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}>

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-white/8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-black text-white">Student Portal</h1>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-gold-500/20 text-gold-400 rounded-full border border-gold-500/30 uppercase tracking-widest">
              BETA
            </span>
          </div>
          <p className="text-sm text-blue-300/70">
            Track applications, visa status & offer letters
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-white/8">
          {[
            { key: 'password', label: '🔑 Email & Password' },
            { key: 'otp',      label: '📱 OTP Login' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key as 'password' | 'otp'); setError(''); }}
              className={[
                'flex-1 py-3.5 text-sm font-semibold transition-all',
                tab === t.key
                  ? 'text-gold-400 border-b-2 border-gold-500'
                  : 'text-blue-300/60 hover:text-blue-200',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="px-8 py-7">

          {/* ── Password form ──────────────────────────────────────────── */}
          {tab === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-blue-300/80 mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="student@demo.com"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/6 border border-white/10 text-white placeholder-blue-400/40 text-sm focus:outline-none focus:border-gold-500/60 focus:bg-white/8 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-300/80 mb-2 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/6 border border-white/10 text-white placeholder-blue-400/40 text-sm focus:outline-none focus:border-gold-500/60 focus:bg-white/8 transition-all pr-11"
                  />
                  <button type="button" onClick={() => setShowPwd(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-400/60 hover:text-blue-200 transition-colors">
                    {showPwd
                      ? <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      : <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    }
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm">
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-sm transition-all shadow-lg shadow-gold-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><SpinnerIcon /> Signing in…</>
                ) : (
                  '🔐 Sign In to Dashboard'
                )}
              </button>
            </form>
          )}

          {/* ── OTP form ───────────────────────────────────────────────── */}
          {tab === 'otp' && (
            <form onSubmit={handleOTPLogin} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-blue-300/80 mb-2 uppercase tracking-wider">
                  Registered Mobile / Email
                </label>
                <input
                  type="text"
                  placeholder="+91 98765 43210 or email"
                  className="w-full px-4 py-3 rounded-xl bg-white/6 border border-white/10 text-white placeholder-blue-400/40 text-sm focus:outline-none focus:border-gold-500/60 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-300/80 mb-3 uppercase tracking-wider">
                  Enter 6-Digit OTP
                  <span className="ml-2 text-blue-400/50 normal-case font-normal">(Demo: 123456)</span>
                </label>
                <div className="flex gap-2.5 justify-between">
                  {otpVal.map((v, i) => (
                    <input
                      key={i}
                      ref={el => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={v}
                      onChange={e => handleOtpInput(i, e.target.value)}
                      onKeyDown={e => handleOtpKey(i, e)}
                      className="w-12 h-12 text-center text-xl font-bold rounded-xl bg-white/6 border border-white/10 text-white focus:outline-none focus:border-gold-500/60 focus:bg-white/10 transition-all"
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm">
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otpVal.some(v => !v)}
                className="w-full py-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-sm transition-all shadow-lg shadow-gold-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><SpinnerIcon /> Verifying…</>
                ) : (
                  '✓ Verify OTP & Login'
                )}
              </button>
            </form>
          )}

          {/* Demo hint */}
          <div className="mt-6 p-3.5 rounded-xl bg-gold-500/8 border border-gold-500/20">
            <p className="text-[11px] text-gold-300/80 font-semibold mb-1">📌 Demo Credentials</p>
            <div className="grid grid-cols-2 gap-1 text-[11px] text-blue-300/70">
              <span>Email:</span><span className="text-gold-300 font-mono">student@demo.com</span>
              <span>Password:</span><span className="text-gold-300 font-mono">demo123</span>
              <span>OTP:</span><span className="text-gold-300 font-mono">123456</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="mt-6 text-xs text-blue-400/40 text-center max-w-sm">
        This is a demo portal. Your data is stored locally in this browser.
        For live portal access, contact your Jaivik Overseas counsellor.
      </p>
    </div>
  );
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
