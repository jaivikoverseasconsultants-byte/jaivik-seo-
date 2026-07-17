'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  signOut as firebaseSignOut,
  RecaptchaVerifier,
  type ConfirmationResult,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { trackActivity } from '@/lib/activity';

// ── Types ─────────────────────────────────────────────────────────────────────
type Tab = 'password' | 'otp' | 'register';
type OtpPhase = 'phone' | 'verify';

const COUNTRIES = ['Canada', 'UK', 'Australia', 'USA', 'Germany', 'Ireland', 'New Zealand', 'Singapore'];
const BUDGETS   = [
  'Under ₹10 Lakh/yr',
  '₹10–20 Lakh/yr',
  '₹20–35 Lakh/yr',
  '₹35–50 Lakh/yr',
  'Above ₹50 Lakh/yr',
];

// Shared input class — dark navy bg, white text, gold focus ring
const INPUT_CLS =
  'w-full px-4 py-3 rounded-xl text-white text-sm placeholder-blue-400/40 ' +
  'focus:outline-none transition-all ' +
  'border border-white/15 focus:border-[#F5A623] ' +
  'bg-[#0B1437]';

const SELECT_CLS =
  'w-full px-4 py-3 rounded-xl text-white text-sm ' +
  'focus:outline-none transition-all ' +
  'border border-white/15 focus:border-[#F5A623] ' +
  'bg-[#0B1437] appearance-none cursor-pointer';

// ── Firebase error → Hindi/English message ─────────────────────────────────────
function mapAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code || '';
  switch (code) {
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return 'Galat password. Dobara try karein.';
    case 'auth/user-not-found':
      return 'Account nahi mila. Register karein.';
    case 'auth/too-many-requests':
      return 'Bahut zyada attempts ho gaye. Kuch der baad try karein.';
    case 'auth/invalid-email':
      return 'Email sahi format mein nahi hai.';
    case 'auth/email-already-in-use':
      return 'Yeh email already registered hai. Login karein.';
    case 'auth/weak-password':
      return 'Password kam se kam 6 characters ka hona chahiye.';
    case 'auth/invalid-phone-number':
      return 'Phone number sahi format mein nahi hai. Try: +91 98765 43210';
    case 'auth/invalid-verification-code':
      return 'Galat OTP. Dobara try karein.';
    case 'auth/code-expired':
      return 'OTP expire ho gaya. Naya OTP bhejein.';
    case 'auth/user-disabled':
      return 'Aapka account disabled hai. +91-9971226347 par WhatsApp karein.';
    default:
      return (err as { message?: string })?.message || 'Kuch error hua. Dobara try karein.';
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function StudentLoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/dashboard/student';
  const { currentUser, loading: authLoading, isDeactivated } = useAuth();
  const [tab, setTab] = useState<Tab>('password');

  // ── Password state
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);

  // ── OTP state
  const [otpPhase, setOtpPhase] = useState<OtpPhase>('phone');
  const [phone, setPhone] = useState('');
  const [otpVal, setOtpVal] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);
  const confirmationRef = useRef<ConfirmationResult | null>(null);

  // ── Register state
  const [reg, setReg] = useState({
    fullName: '', email: '', password: '', phone: '',
    country: '', course: '', budget: '',
  });
  const [showRegPwd, setShowRegPwd] = useState(false);
  const [checks, setChecks] = useState({ c1: false, c2: false, c3: false });
  const [regSuccess, setRegSuccess] = useState(false);

  // ── UI
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && currentUser) router.replace(returnUrl);
  }, [authLoading, currentUser, router, returnUrl]);

  // Propagate session-level deactivation to error state
  useEffect(() => {
    if (isDeactivated) {
      setError('Account deactivated due to inactivity. WhatsApp +91-9971226347 to reactivate.');
    }
  }, [isDeactivated]);

  function switchTab(t: Tab) {
    setTab(t);
    setError('');
    setOtpPhase('phone');
    setOtpVal(['', '', '', '', '', '']);
  }

  // ── Password login ─────────────────────────────────────────────────────────
  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, 'users', cred.user.uid));
      if (snap.exists() && snap.data()?.status === 'deactivated') {
        await firebaseSignOut(auth);
        setError('Account deactivated due to inactivity. WhatsApp +91-9971226347 to reactivate.');
        setLoading(false);
        return;
      }
      await trackActivity(cred.user.uid);
      router.push(returnUrl);
    } catch (err) {
      setError(mapAuthError(err));
      setLoading(false);
    }
  }

  // ── OTP: send code ────────────────────────────────────────────────────────
  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!recaptchaRef.current) {
        recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
      }
      const digits = phone.replace(/\D/g, '');
      const fullPhone = phone.trim().startsWith('+') ? phone.trim() : `+91${digits}`;
      const result = await signInWithPhoneNumber(auth, fullPhone, recaptchaRef.current);
      confirmationRef.current = result;
      setOtpPhase('verify');
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  // ── OTP: verify code ──────────────────────────────────────────────────────
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!confirmationRef.current) throw new Error('Send OTP dobara try karein.');
      const cred = await confirmationRef.current.confirm(otpVal.join(''));
      const uid = cred.user.uid;
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        if (snap.data()?.status === 'deactivated') {
          await firebaseSignOut(auth);
          setError('Account deactivated due to inactivity. WhatsApp +91-9971226347 to reactivate.');
          setLoading(false);
          return;
        }
        await trackActivity(uid);
      } else {
        await setDoc(doc(db, 'users', uid), {
          name: '', email: '', phone: cred.user.phoneNumber || phone,
          targetCountry: '', budget: '', interestedCourse: '',
          role: 'student', status: 'active',
          createdAt: serverTimestamp(), lastActivity: serverTimestamp(),
        });
      }
      router.push(returnUrl);
    } catch (err) {
      setError(mapAuthError(err));
      setLoading(false);
    }
  }

  function handleOtpInput(i: number, v: string) {
    if (v.length > 1) {
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
    if (e.key === 'Backspace' && !otpVal[i] && i > 0) otpRefs.current[i - 1]?.focus();
  }

  // ── Registration ───────────────────────────────────────────────────────────
  function setRegField(k: keyof typeof reg, v: string) {
    setReg(r => ({ ...r, [k]: v }));
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!checks.c1 || !checks.c2 || !checks.c3) {
      setError('Please accept all three declarations to continue.');
      return;
    }

    setLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(auth, reg.email, reg.password);

      await setDoc(doc(db, 'users', cred.user.uid), {
        name: reg.fullName,
        email: reg.email,
        phone: reg.phone,
        targetCountry: reg.country,
        budget: reg.budget,
        interestedCourse: reg.course,
        role: 'student',
        status: 'active',
        createdAt: serverTimestamp(),
        lastActivity: serverTimestamp(),
      });

      // Admin notification backup (Formspree) — fire and forget
      const formData = new FormData();
      formData.append('Full Name',        reg.fullName);
      formData.append('Email',            reg.email);
      formData.append('Phone/WhatsApp',   reg.phone);
      formData.append('Target Country',   reg.country);
      formData.append('Interested Course',reg.course);
      formData.append('Budget Range',     reg.budget);
      formData.append('Source',           'Student Portal Registration');
      fetch('https://formspree.io/f/xgoqzezk', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      }).catch(() => {});

      setRegSuccess(true);
      setTimeout(() => router.push(returnUrl), 1500);
    } catch (err) {
      setError(mapAuthError(err));
      setLoading(false);
    }
  }

  // ── Tab definitions ────────────────────────────────────────────────────────
  // OTP tab hidden from the UI (2026-07-17) — Firebase phone-auth SMS delivery
  // requires the Blaze plan, which isn't provisioned (see BUILD-LOG.md §2 item 3),
  // so this tab only ever produced an error. The underlying OTP state/handlers
  // (sendOtp/verifyOtp, otpPhase, etc.) are untouched — re-add
  // `{ key: 'otp', label: '📱 OTP' }` here once Blaze is enabled and SMS delivery
  // is confirmed working.
  const TABS: { key: Tab; label: string }[] = [
    { key: 'password', label: '🔑 Login' },
    { key: 'register', label: '✨ Register' },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ background: 'linear-gradient(135deg, #060e1f 0%, #0b1437 50%, #0d1e3a 100%)' }}
    >
      {/* Top bar */}
      <div className="w-full max-w-lg mb-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to site
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/trainer-dashboard"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#F5A623]/40 text-[#F5A623] hover:bg-[#F5A623]/10 transition-colors"
          >
            Trainer Login
          </Link>
          <div className="flex items-center gap-2">
            <img src="/joc-logo-circle.jpeg" alt="Jaivik Overseas" className="h-8 w-8 rounded-full ring-2 ring-[#F5A623]/40" />
            <span className="text-sm font-semibold text-white">Jaivik Overseas</span>
          </div>
        </div>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
        style={{ background: 'rgba(11,20,55,0.85)', backdropFilter: 'blur(16px)' }}
      >
        {/* Header */}
        <div className="px-8 pt-7 pb-5 border-b border-white/8">
          <div className="flex items-center gap-3 mb-1.5">
            <h1 className="text-2xl font-black text-white">Student Portal</h1>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#F5A623]/20 text-[#F5A623] rounded-full border border-[#F5A623]/30 uppercase tracking-widest">
              BETA
            </span>
          </div>
          <p className="text-sm text-blue-300/60">
            Track applications, visa status &amp; offer letters
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-white/8">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => switchTab(t.key)}
              className={[
                'flex-1 py-3.5 text-sm font-semibold transition-all',
                tab === t.key
                  ? 'text-[#F5A623] border-b-2 border-[#F5A623] bg-[#F5A623]/5'
                  : 'text-blue-300/55 hover:text-blue-200 hover:bg-white/4',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="px-8 py-7">

          {/* ── EMAIL + PASSWORD ─────────────────────────────────────────── */}
          {tab === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-5">
              <Field label="Email Address">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required className={INPUT_CLS} />
              </Field>

              <Field label="Password">
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={INPUT_CLS + ' pr-11'}
                  />
                  <button type="button" onClick={() => setShowPwd(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-400/60 hover:text-blue-200 transition-colors">
                    <EyeIcon open={showPwd} />
                  </button>
                </div>
              </Field>

              <ErrorBox msg={error} />

              <SubmitBtn loading={loading} label="🔐 Sign In to Dashboard" loadingLabel="Signing in…" />

              <p className="text-center text-xs text-blue-400/40 pt-1">
                New here?{' '}
                <button type="button" onClick={() => switchTab('register')}
                  className="text-[#F5A623] hover:underline">
                  Create an account
                </button>
              </p>
            </form>
          )}

          {/* ── OTP ──────────────────────────────────────────────────────── */}
          {tab === 'otp' && otpPhase === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <Field label="Registered Mobile Number">
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210" required className={INPUT_CLS} />
              </Field>

              <ErrorBox msg={error} />

              <SubmitBtn loading={loading} label="📲 Send OTP" loadingLabel="Sending OTP…" />
            </form>
          )}

          {tab === 'otp' && otpPhase === 'verify' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-blue-300/80 mb-3 uppercase tracking-wider">
                  Enter 6-Digit OTP
                  <span className="ml-2 text-blue-400/45 normal-case font-normal">sent to {phone}</span>
                </label>
                <div className="flex gap-2 justify-between">
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
                      style={{
                        background: '#0B1437',
                        color: '#ffffff',
                        border: v ? '2px solid #F5A623' : '1px solid rgba(255,255,255,0.2)',
                        caretColor: '#F5A623',
                      }}
                      className="
                        w-12 h-12 text-center text-xl font-bold rounded-xl
                        focus:outline-none focus:ring-2 focus:ring-[#F5A623]/60
                        transition-all
                      "
                    />
                  ))}
                </div>
              </div>

              <ErrorBox msg={error} />

              <SubmitBtn
                loading={loading}
                disabled={otpVal.some(v => !v)}
                label="✓ Verify OTP & Login"
                loadingLabel="Verifying…"
              />

              <p className="text-center text-xs text-blue-400/40 pt-1">
                <button type="button" onClick={() => { setOtpPhase('phone'); setOtpVal(['', '', '', '', '', '']); setError(''); }}
                  className="text-[#F5A623] hover:underline">
                  Change number / resend OTP
                </button>
              </p>
            </form>
          )}

          {/* ── REGISTER ─────────────────────────────────────────────────── */}
          {tab === 'register' && (
            <>
              {regSuccess ? (
                <div className="py-10 text-center space-y-3">
                  <div className="text-5xl">🎉</div>
                  <p className="text-xl font-black text-white">Registration Successful!</p>
                  <p className="text-sm text-blue-300/70">Logging you in to your dashboard…</p>
                  <div className="flex justify-center pt-2">
                    <div className="w-8 h-8 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">

                  {/* Full Name */}
                  <Field label="Full Name *">
                    <input
                      type="text" required
                      value={reg.fullName} onChange={e => setRegField('fullName', e.target.value)}
                      placeholder="Rahul Sharma"
                      className={INPUT_CLS}
                    />
                  </Field>

                  {/* Email */}
                  <Field label="Email Address *">
                    <input
                      type="email" required
                      value={reg.email} onChange={e => setRegField('email', e.target.value)}
                      placeholder="rahul@example.com"
                      className={INPUT_CLS}
                    />
                  </Field>

                  {/* Password */}
                  <Field label="Password *">
                    <div className="relative">
                      <input
                        type={showRegPwd ? 'text' : 'password'} required minLength={6}
                        value={reg.password} onChange={e => setRegField('password', e.target.value)}
                        placeholder="At least 6 characters"
                        className={INPUT_CLS + ' pr-11'}
                      />
                      <button type="button" onClick={() => setShowRegPwd(v => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-400/60 hover:text-blue-200 transition-colors">
                        <EyeIcon open={showRegPwd} />
                      </button>
                    </div>
                  </Field>

                  {/* Phone */}
                  <Field label="Phone / WhatsApp *">
                    <input
                      type="tel" required
                      value={reg.phone} onChange={e => setRegField('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      className={INPUT_CLS}
                    />
                  </Field>

                  {/* Country + Course — 2 cols on sm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Target Country *">
                      <div className="relative">
                        <select
                          required
                          value={reg.country} onChange={e => setRegField('country', e.target.value)}
                          className={SELECT_CLS}
                          style={{ background: '#0B1437', color: reg.country ? '#ffffff' : 'rgba(96,165,250,0.4)' }}
                        >
                          <option value="" disabled>Select country</option>
                          {COUNTRIES.map(c => (
                            <option key={c} value={c} style={{ background: '#0B1437', color: '#ffffff' }}>{c}</option>
                          ))}
                        </select>
                        <ChevronDown />
                      </div>
                    </Field>

                    <Field label="Budget Range *">
                      <div className="relative">
                        <select
                          required
                          value={reg.budget} onChange={e => setRegField('budget', e.target.value)}
                          className={SELECT_CLS}
                          style={{ background: '#0B1437', color: reg.budget ? '#ffffff' : 'rgba(96,165,250,0.4)' }}
                        >
                          <option value="" disabled>Select budget</option>
                          {BUDGETS.map(b => (
                            <option key={b} value={b} style={{ background: '#0B1437', color: '#ffffff' }}>{b}</option>
                          ))}
                        </select>
                        <ChevronDown />
                      </div>
                    </Field>
                  </div>

                  {/* Interested Course */}
                  <Field label="Interested Course / Field *">
                    <input
                      type="text" required
                      value={reg.course} onChange={e => setRegField('course', e.target.value)}
                      placeholder="e.g. MSc Computer Science, MBA, BEng…"
                      className={INPUT_CLS}
                    />
                  </Field>

                  {/* ── Declarations ──────────────────────────────────── */}
                  <div className="pt-1 space-y-3">
                    <p className="text-xs font-bold text-blue-300/70 uppercase tracking-wider">
                      Declarations (all required)
                    </p>

                    {[
                      {
                        key: 'c1' as const,
                        text: 'I agree that Jaivik Overseas may contact me via phone, WhatsApp & email for counselling and related services.',
                      },
                      {
                        key: 'c2' as const,
                        text: 'I understand that visa and admission decisions are made by universities and government authorities. Jaivik Overseas does not guarantee admission or visa approval.',
                      },
                      {
                        key: 'c3' as const,
                        text: 'I acknowledge that initial counselling is free. Any service fees will be communicated clearly before any payment is requested.',
                      },
                    ].map(({ key, text }) => (
                      <label key={key}
                        className={[
                          'flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all border',
                          checks[key]
                            ? 'bg-[#F5A623]/8 border-[#F5A623]/30'
                            : 'bg-white/3 border-white/8 hover:bg-white/6',
                        ].join(' ')}>
                        <div className="mt-0.5 shrink-0">
                          <input
                            type="checkbox"
                            checked={checks[key]}
                            onChange={ev => setChecks(c => ({ ...c, [key]: ev.target.checked }))}
                            className="sr-only"
                          />
                          <div className={[
                            'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all',
                            checks[key]
                              ? 'bg-[#F5A623] border-[#F5A623]'
                              : 'border-white/30 bg-[#0B1437]',
                          ].join(' ')}>
                            {checks[key] && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-blue-200/80 leading-relaxed">{text}</p>
                      </label>
                    ))}
                  </div>

                  <ErrorBox msg={error} />

                  <SubmitBtn
                    loading={loading}
                    disabled={!checks.c1 || !checks.c2 || !checks.c3}
                    label="✨ Create My Portal Account"
                    loadingLabel="Registering…"
                  />

                  <p className="text-center text-xs text-blue-400/40 pt-1">
                    Already registered?{' '}
                    <button type="button" onClick={() => switchTab('password')}
                      className="text-[#F5A623] hover:underline">
                      Sign in here
                    </button>
                  </p>
                </form>
              )}
            </>
          )}

        </div>
      </div>

      {/* Invisible reCAPTCHA container for phone auth */}
      <div id="recaptcha-container" />

      {/* Footer */}
      <p className="mt-6 text-xs text-blue-400/35 text-center max-w-sm">
        <Link href="/book-counselling" className="text-[#F5A623]/60 hover:text-[#F5A623]">
          Book free counselling
        </Link>
      </p>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-blue-300/80 mb-2 uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm">
      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
      {msg}
    </div>
  );
}

function SubmitBtn({ loading, disabled = false, label, loadingLabel }: {
  loading: boolean; disabled?: boolean; label: string; loadingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      style={{ background: loading || disabled ? '#b97a10' : '#F5A623', color: '#fff', boxShadow: '0 4px 20px rgba(245,166,35,0.25)' }}
    >
      {loading ? <><SpinnerIcon />{loadingLabel}</> : label}
    </button>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open
    ? <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
    : <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
}

function ChevronDown() {
  return (
    <svg className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
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
