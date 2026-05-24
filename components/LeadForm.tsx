'use client';

import { useState } from 'react';

const FORMSPREE_URL = 'https://formspree.io/f/xgoqzezk';

interface LeadFormProps {
  source?: string;
  defaultCourse?: string;
  defaultCountry?: string;
  compact?: boolean;
}

const countries = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Ireland', 'Singapore', 'New Zealand', 'France', 'Netherlands'];
const budgets = ['Under ₹20 Lakhs', '₹20–40 Lakhs', '₹40–60 Lakhs', '₹60–80 Lakhs', 'Above ₹80 Lakhs'];

export default function LeadForm({ source = 'website', defaultCourse = '', defaultCountry = '', compact = false }: LeadFormProps) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    targetCountry: defaultCountry,
    interestedCourse: defaultCourse,
    budget: '', ieltsScore: '', greScore: '', message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `New Enquiry – ${form.interestedCourse || 'Study Abroad'} in ${form.targetCountry || 'Unknown'} | ${source}`,
          name: form.name,
          email: form.email,
          phone: form.phone,
          'Target Country': form.targetCountry,
          'Interested Course': form.interestedCourse,
          'Budget': form.budget,
          'IELTS Score': form.ieltsScore,
          'GRE/GMAT Score': form.greScore,
          'Message': form.message,
          'Source Page': source,
          'Submitted At': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="text-xl font-bold text-green-800 mb-2">Application Received!</h3>
        <p className="text-green-700 text-sm">Our counsellor will contact you within 24 hours. WhatsApp us at +91-9971226347 for immediate assistance.</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 ${compact ? 'p-6' : 'p-8'}`}>
      {!compact && (
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900">Get Free Counselling</h3>
          <p className="text-gray-500 text-sm mt-1">Our expert will call you within 24 hours</p>
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
            <input name="name" required value={form.name} onChange={handle}
              placeholder="Your full name" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Phone *</label>
            <input name="phone" required value={form.phone} onChange={handle}
              placeholder="+91 98765 43210" type="tel" className="input-field" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
          <input name="email" required value={form.email} onChange={handle}
            placeholder="you@email.com" type="email" className="input-field" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Target Country *</label>
            <select name="targetCountry" required value={form.targetCountry} onChange={handle} className="input-field">
              <option value="">Select country</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Interested Course *</label>
            <input name="interestedCourse" required value={form.interestedCourse} onChange={handle}
              placeholder="e.g. MS Computer Science" className="input-field" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Budget (Total including living)</label>
          <select name="budget" value={form.budget} onChange={handle} className="input-field">
            <option value="">Select budget</option>
            {budgets.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {!compact && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">IELTS Score (if given)</label>
              <input name="ieltsScore" value={form.ieltsScore} onChange={handle}
                placeholder="e.g. 7.0" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">GRE/GMAT Score (if given)</label>
              <input name="greScore" value={form.greScore} onChange={handle}
                placeholder="e.g. GRE 315" className="input-field" />
            </div>
          </div>
        )}

        {!compact && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Message / Query</label>
            <textarea name="message" value={form.message} onChange={handle}
              placeholder="Tell us about your background, questions, or specific requirements..."
              rows={3} className="input-field resize-none" />
          </div>
        )}

        <button type="submit" disabled={status === 'submitting'} className="btn-gold w-full text-center">
          {status === 'submitting' ? 'Sending...' : 'Get Free Counselling →'}
        </button>

        {status === 'error' && (
          <p className="text-red-600 text-sm text-center">Something went wrong. Please WhatsApp us at +91-9971226347.</p>
        )}

        <p className="text-xs text-gray-400 text-center">
          Your data is safe. We will never share your information.
        </p>
      </form>
    </div>
  );
}
