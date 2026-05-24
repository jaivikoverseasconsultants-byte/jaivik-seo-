'use client';

import { useState } from 'react';
import { courses } from '@/data/courses';

const FORMSPREE_URL = 'https://formspree.io/f/xgoqzezk';

const COUNTRIES = [
  { name: 'Canada', flag: '🇨🇦', highlights: ['Post-grad Work Permit (PGWP)', 'PR pathway in 2–3 years', 'Affordable fees & scholarships'] },
  { name: 'UK', flag: '🇬🇧', highlights: ['2-year Graduate Route Visa', '1-year MBA programs', 'World top-10 universities'] },
  { name: 'Australia', flag: '🇦🇺', highlights: ['2–4 year stay-back visa', 'STEM OPT equivalent', 'High quality of life'] },
  { name: 'USA', flag: '🇺🇸', highlights: ['3-year OPT for STEM grads', 'Highest salaries globally', 'Top FAANG employers'] },
  { name: 'Germany', flag: '🇩🇪', highlights: ['Free/low tuition fees', 'PR in 2 years possible', 'Strong engineering programs'] },
  { name: 'Ireland', flag: '🇮🇪', highlights: ['2-year stay-back permit', 'English-speaking EU country', "Europe's tech hub"] },
  { name: 'New Zealand', flag: '🇳🇿', highlights: ['3-year post-study visa', 'Safe & welcoming for students', 'PR opportunity'] },
  { name: 'Singapore', flag: '🇸🇬', highlights: ["Asia's #1 education hub", 'High salaries, close to India', 'NUS & NTU top 20 globally'] },
];

const TIME_GROUPS = [
  { period: '🌅 Morning', slots: ['10:00 AM', '11:00 AM', '12:00 PM'] },
  { period: '☀️ Afternoon', slots: ['2:00 PM', '3:00 PM', '4:00 PM'] },
  { period: '🌆 Evening', slots: ['5:00 PM', '6:00 PM', '7:00 PM'] },
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const STEP_LABELS = ['Your Details', 'Choose Country', 'Choose Date', 'Choose Time', 'Confirm Booking'];

function getBookedSlots(date: Date): Set<string> {
  const d = date.getDate();
  const m = date.getMonth();
  const booked = new Set<string>();
  const all = ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
  all.forEach((slot, i) => {
    if ((d * 13 + m * 7 + i * 11) % 10 < 3) booked.add(slot);
  });
  return booked;
}

function getNext14Days(): Date[] {
  const days: Date[] = [];
  const now = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push(d);
  }
  return days;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

type Step = 1 | 2 | 3 | 4 | 5;

interface Booking {
  name: string;
  phone: string;
  email: string;
  course: string;
  country: string;
  date: Date | null;
  time: string;
}

export default function BookCounsellingClient() {
  const [step, setStep] = useState<Step>(1);
  const [booking, setBooking] = useState<Booking>({ name: '', phone: '', email: '', course: '', country: '', date: null, time: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const days = getNext14Days();
  const bookedSlots = booking.date ? getBookedSlots(booking.date) : new Set<string>();

  const next = () => setStep(s => (s < 5 ? (s + 1) as Step : s));
  const back = () => setStep(s => (s > 1 ? (s - 1) as Step : s));

  const canGo1 = booking.name.trim() && booking.phone.trim() && booking.email.trim() && booking.course;
  const canGo2 = !!booking.country;
  const canGo3 = !!booking.date;
  const canGo4 = !!booking.time;

  async function submit() {
    setStatus('submitting');
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `Appointment Booking – ${booking.course} in ${booking.country} | ${booking.date ? formatDate(booking.date) : ''} @ ${booking.time}`,
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          'Interested Course': booking.course,
          'Target Country': booking.country,
          'Appointment Date': booking.date ? formatDate(booking.date) : '',
          'Appointment Time': booking.time,
          'Source Page': 'book-counselling',
          'Submitted At': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 text-sm mb-5">
            We will call you to confirm your appointment.
          </p>
          <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-2.5 mb-5">
            {[
              ['Name', booking.name],
              ['Country', booking.country],
              ['Course', booking.course],
              ['Date', booking.date ? formatDate(booking.date) : ''],
              ['Time', booking.time],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="font-semibold text-gray-900">{val}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mb-4">Need immediate help? WhatsApp us at +91-9971226347</p>
          <a
            href="https://wa.me/919971226347"
            target="_blank" rel="noopener noreferrer"
            className="btn-gold w-full block text-center"
          >
            WhatsApp Us →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-700 via-blue-900 to-brand-900">
      <div className="text-center pt-12 pb-8 px-4">
        <span className="inline-block bg-white/15 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          📅 Book a Free Counselling Session
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Talk to Our Expert Counsellor</h1>
        <p className="text-blue-200 text-sm">Free 30-minute personalised session · No obligation · 500+ students guided</p>
      </div>

      <div className="max-w-xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-brand-700">Step {step} of 5: {STEP_LABELS[step - 1]}</p>
              <p className="text-xs text-gray-400">{Math.round((step / 5) * 100)}% complete</p>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-700 rounded-full transition-all duration-500" style={{ width: `${(step / 5) * 100}%` }} />
            </div>
          </div>

          {/* ── Step 1: Basic Info ──────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-bold text-gray-900 text-base mb-4">Tell us about yourself</h2>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name *</label>
                <input type="text" placeholder="Your full name" className="input-field"
                  value={booking.name} onChange={e => setBooking(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone Number *</label>
                <input type="tel" placeholder="+91 99712 26347" className="input-field"
                  value={booking.phone} onChange={e => setBooking(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address *</label>
                <input type="email" placeholder="you@email.com" className="input-field"
                  value={booking.email} onChange={e => setBooking(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Course Interest *</label>
                <select className="input-field" value={booking.course}
                  onChange={e => setBooking(p => ({ ...p, course: e.target.value }))}>
                  <option value="">Select a course</option>
                  {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <button onClick={next} disabled={!canGo1}
                className="btn-gold w-full text-center mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                Continue →
              </button>
            </div>
          )}

          {/* ── Step 2: Country ─────────────────────────────────────── */}
          {step === 2 && (
            <div>
              <h2 className="font-bold text-gray-900 text-base mb-4">Choose your target country</h2>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {COUNTRIES.map(c => (
                  <button key={c.name} onClick={() => setBooking(p => ({ ...p, country: c.name }))}
                    className={`text-left border-2 rounded-2xl p-3.5 transition-all ${
                      booking.country === c.name
                        ? 'border-brand-700 bg-brand-50'
                        : 'border-gray-200 hover:border-brand-300'
                    }`}>
                    <p className="text-2xl mb-1.5">{c.flag}</p>
                    <p className="font-bold text-sm text-gray-900">{c.name}</p>
                    <ul className="mt-1.5 space-y-0.5">
                      {c.highlights.map(h => (
                        <li key={h} className="text-xs text-gray-500 leading-tight">· {h}</li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={back} className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                  ← Back
                </button>
                <button onClick={next} disabled={!canGo2}
                  className="flex-[2] btn-gold text-center disabled:opacity-50 disabled:cursor-not-allowed">
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Date ────────────────────────────────────────── */}
          {step === 3 && (
            <div>
              <h2 className="font-bold text-gray-900 text-base mb-1">Choose your preferred date</h2>
              <p className="text-xs text-gray-400 mb-4">Next 14 days · Sundays are holidays</p>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-4">
                {days.map((d, i) => {
                  const isSun = d.getDay() === 0;
                  const isSel = booking.date?.toDateString() === d.toDateString();
                  return (
                    <button key={i} disabled={isSun}
                      onClick={() => setBooking(p => ({ ...p, date: d, time: '' }))}
                      className={`rounded-xl py-2.5 px-1 text-center text-xs transition-all ${
                        isSun
                          ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                          : isSel
                          ? 'bg-brand-700 text-white font-bold shadow-md'
                          : 'bg-gray-50 border border-gray-200 hover:border-brand-400 hover:bg-brand-50 text-gray-700'
                      }`}>
                      <p className={`font-medium ${isSun ? 'text-gray-300' : isSel ? 'text-blue-200' : 'text-gray-400'}`}>
                        {DAY_NAMES[d.getDay()]}
                      </p>
                      <p className="font-bold text-sm mt-0.5">{d.getDate()}</p>
                      <p className={`text-xs ${isSun ? 'text-gray-300' : isSel ? 'text-blue-200' : 'text-gray-400'}`}>
                        {MONTH_NAMES[d.getMonth()]}
                      </p>
                    </button>
                  );
                })}
              </div>
              {booking.date && (
                <p className="text-xs text-green-600 font-semibold bg-green-50 rounded-lg px-3 py-2 mb-4">
                  ✓ Selected: {formatDate(booking.date)}
                </p>
              )}
              <div className="flex gap-3">
                <button onClick={back} className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                  ← Back
                </button>
                <button onClick={next} disabled={!canGo3}
                  className="flex-[2] btn-gold text-center disabled:opacity-50 disabled:cursor-not-allowed">
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 4: Time Slot ───────────────────────────────────── */}
          {step === 4 && (
            <div>
              <h2 className="font-bold text-gray-900 text-base mb-1">Choose your time slot</h2>
              {booking.date && (
                <p className="text-xs text-gray-400 mb-4">{formatDate(booking.date)}</p>
              )}
              <div className="space-y-5 mb-5">
                {TIME_GROUPS.map(group => (
                  <div key={group.period}>
                    <p className="text-xs font-semibold text-gray-500 mb-2">{group.period}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {group.slots.map(slot => {
                        const isBooked = bookedSlots.has(slot);
                        const isSel = booking.time === slot;
                        return (
                          <button key={slot} disabled={isBooked}
                            onClick={() => setBooking(p => ({ ...p, time: slot }))}
                            className={`py-2.5 px-2 rounded-xl text-xs font-semibold transition-all ${
                              isBooked
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                : isSel
                                ? 'bg-brand-700 text-white shadow-md border border-brand-700'
                                : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-brand-400 hover:bg-brand-50'
                            }`}>
                            {slot}
                            <span className={`block text-xs font-normal mt-0.5 ${
                              isBooked ? 'text-red-400' : isSel ? 'text-blue-200' : 'text-green-500'
                            }`}>
                              {isBooked ? 'Booked' : isSel ? 'Selected ✓' : 'Available'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={back} className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                  ← Back
                </button>
                <button onClick={next} disabled={!canGo4}
                  className="flex-[2] btn-gold text-center disabled:opacity-50 disabled:cursor-not-allowed">
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 5: Confirmation ────────────────────────────────── */}
          {step === 5 && (
            <div>
              <h2 className="font-bold text-gray-900 text-base mb-4">Confirm your booking</h2>
              <div className="bg-gray-50 rounded-2xl p-5 mb-4 space-y-3">
                {[
                  ['Name', booking.name],
                  ['Phone', booking.phone],
                  ['Email', booking.email],
                  ['Course Interest', booking.course],
                  ['Country', booking.country],
                  ['Date', booking.date ? formatDate(booking.date) : ''],
                  ['Time', booking.time],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between items-start gap-3 text-sm">
                    <span className="text-gray-400 flex-shrink-0">{label}</span>
                    <span className="font-semibold text-gray-900 text-right">{val}</span>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-5 text-xs text-blue-700 text-center">
                📞 We will call you to confirm your appointment
              </div>
              <button onClick={submit} disabled={status === 'submitting'}
                className="btn-gold w-full text-center mb-3 disabled:opacity-60 disabled:cursor-not-allowed">
                {status === 'submitting' ? 'Booking...' : 'Book My Free Session →'}
              </button>
              {status === 'error' && (
                <p className="text-red-500 text-xs text-center mb-3">
                  Something went wrong. WhatsApp us at +91-9971226347.
                </p>
              )}
              <button onClick={back} className="w-full text-center text-sm text-gray-400 hover:text-gray-600 py-2 transition-colors">
                ← Go Back
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-5 mt-8 text-white/60 text-xs">
          <span>✓ 500+ students counselled</span>
          <span>✓ Expert advisors</span>
          <span>✓ 100% free session</span>
          <span>✓ No obligation</span>
        </div>
      </div>
    </div>
  );
}
