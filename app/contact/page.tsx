'use client';

import { useState } from 'react';

const WA_NUMBER = '919971226347';
const WA_LINK = `https://wa.me/${WA_NUMBER}`;

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', city: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://formspree.io/f/xgoqzezk', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, _subject: 'Contact Form — Jaivik Overseas Portal' }),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', phone: '', email: '', city: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
          📍 Ghaziabad, Uttar Pradesh, India
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Jaivik Overseas</h1>
        <p className="text-gray-500">Reach us for free counselling, visa queries, or application support. We respond within 2 hours on WhatsApp.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Left — Info */}
        <div className="space-y-6">

          {/* WhatsApp CTA */}
          <a
            href={`${WA_LINK}?text=${encodeURIComponent('Hi Jaivik Overseas, I want to inquire about studying abroad. Please help me.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl p-5 transition-colors group"
          >
            <div className="bg-white/20 rounded-xl p-3 flex-shrink-0">
              <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-lg leading-tight">WhatsApp Us Now</p>
              <p className="text-green-100 text-sm">+91 99712 26347 · Fastest response</p>
            </div>
            <svg className="w-5 h-5 ml-auto opacity-60 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>

          {/* Contact Details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0 mt-0.5">📍</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Office Address</p>
                <p className="text-gray-600 text-sm mt-0.5">
                  333 Orbit Plaza, Crossing Republik<br />
                  Ghaziabad, Uttar Pradesh 201016
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0 mt-0.5">📞</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Phone</p>
                <div className="text-sm text-gray-600 mt-0.5 space-y-0.5">
                  <a href="tel:+919971226347" className="block hover:text-brand-700">+91 99712 26347</a>
                  <a href="tel:+919971881347" className="block hover:text-brand-700">+91 99718 81347</a>
                  <a href="tel:+917428222100" className="block hover:text-brand-700">+91 74282 22100</a>
                  <a href="tel:01204115882" className="block hover:text-brand-700">0120-4115882</a>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0 mt-0.5">✉️</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Email</p>
                <a href="mailto:info@jaivikoverseasconsultants.com" className="text-sm text-brand-700 hover:underline mt-0.5 block">
                  info@jaivikoverseasconsultants.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0 mt-0.5">🕐</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Office Hours</p>
                <p className="text-gray-600 text-sm mt-0.5">Monday – Saturday: 9:00 AM – 7:00 PM IST</p>
                <p className="text-gray-400 text-xs mt-0.5">WhatsApp queries answered till 10 PM</p>
              </div>
            </div>
          </div>

          {/* Google Maps embed */}
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3499.2!2d77.4350!3d28.6359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf1b0e4d5c3a7%3A0x8f2e3b4c1d6a9e5f!2s333%20Orbit%20Plaza%2C%20Crossing%20Republik%2C%20Ghaziabad%2C%20Uttar%20Pradesh%20201016!5e0!3m2!1sen!2sin!4v1234567890!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Jaivik Overseas Consultants office location"
            />
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap gap-2">
            <a href="/book-counselling" className="text-xs bg-brand-700 text-white px-3 py-2 rounded-lg font-semibold hover:bg-brand-800 transition-colors">
              Book Free Counselling
            </a>
            <a href="/find-my-course" className="text-xs bg-gold-500 text-white px-3 py-2 rounded-lg font-semibold hover:bg-gold-600 transition-colors">
              Find My Course
            </a>
            <a href="/eligibility-checker" className="text-xs bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Eligibility Checker
            </a>
          </div>

          {/* Social media */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="font-semibold text-gray-900 text-sm mb-3">Follow Us</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { href: 'https://facebook.com/jaivikoverseasconsultants', label: 'Facebook', icon: '📘', hover: 'hover:bg-blue-50 hover:border-blue-200' },
                { href: 'https://instagram.com/jaivikoverseasconsultants', label: 'Instagram', icon: '📸', hover: 'hover:bg-pink-50 hover:border-pink-200' },
                { href: 'https://linkedin.com/company/jaivik-overseas-consultants', label: 'LinkedIn', icon: '💼', hover: 'hover:bg-blue-50 hover:border-blue-200' },
                { href: 'https://youtube.com/@jaivikoverseasconsultants', label: 'YouTube', icon: '▶️', hover: 'hover:bg-red-50 hover:border-red-200' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-2 p-2.5 border border-gray-100 rounded-xl transition-colors ${s.hover}`}>
                  <span className="text-xl">{s.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{s.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Contact Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Send Us a Message</h2>
          <p className="text-sm text-gray-500 mb-6">Fill in the form — our counsellor will call you back within 2 hours.</p>

          {status === 'sent' ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">✅</div>
              <p className="font-bold text-gray-900 text-lg mb-1">Message Received!</p>
              <p className="text-gray-500 text-sm">We&apos;ll call you back within 2 business hours. You can also reach us instantly on WhatsApp.</p>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
                Open WhatsApp →
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="Rahul Kumar"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone / WhatsApp *</label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="rahul@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Your City</label>
                <input
                  type="text"
                  placeholder="Ghaziabad / Noida / Delhi"
                  value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Your Query</label>
                <textarea
                  rows={4}
                  placeholder="I want to study in UK / Canada / Australia. My IELTS is 6.5. Please guide me..."
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
                />
              </div>
              {status === 'error' && (
                <p className="text-red-600 text-xs">Something went wrong. Please WhatsApp us directly instead.</p>
              )}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-brand-700 hover:bg-brand-800 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
              >
                {status === 'sending' ? 'Sending...' : 'Send Message →'}
              </button>
              <p className="text-xs text-gray-400 text-center">
                Or reach us instantly on{' '}
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="text-green-600 font-semibold">WhatsApp</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
