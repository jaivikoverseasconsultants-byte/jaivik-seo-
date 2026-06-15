'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SectionResult {
  name: string;
  score?: number;
  total?: number;
  band: string;
  completed: boolean;
}

interface Props {
  level: string;
  section: string;
  results: SectionResult[];
  overallBand: string;
  onRetake: () => void;
}

const BAND_COLORS: Record<string, string> = {
  '9.0': 'text-purple-600', '8.5': 'text-purple-500', '8.0': 'text-blue-600',
  '7.5': 'text-blue-500', '7.0': 'text-green-600', '6.5': 'text-green-500',
  '6.0': 'text-yellow-600', '5.5': 'text-yellow-500', '5.0': 'text-orange-500',
  '4.5': 'text-red-500', '4.0': 'text-red-600',
};

const BAND_LABELS: Record<string, string> = {
  '9.0': 'Expert User', '8.5': 'Very Good User', '8.0': 'Very Good User',
  '7.5': 'Good User', '7.0': 'Good User', '6.5': 'Competent User',
  '6.0': 'Competent User', '5.5': 'Modest User', '5.0': 'Modest User',
  '4.5': 'Limited User', '4.0': 'Limited User',
};

export default function IELTSResultsClient({ level, section, results, overallBand, onRetake }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const bandNum = parseFloat(overallBand);
  const weakAreas = results.filter(r => r.completed && parseFloat(r.band) < 6.0);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('https://formspree.io/f/xgoqzezk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone,
          subject: `IELTS Mock Test Result — ${level} ${section} — Band ${overallBand}`,
          message: `Student completed IELTS Mock Test.\nLevel: ${level}\nSection: ${section}\nBand: ${overallBand}`,
        }),
      });
    } catch (_) { /* silent */ }
    setSubmitted(true);
  };

  const bandColor = BAND_COLORS[overallBand] || 'text-gray-600';
  const bandLabel = BAND_LABELS[overallBand] || 'User';

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        {/* Hero Result Card */}
        <div className="bg-gradient-to-br from-[#0a1628] to-[#1a2e4a] text-white rounded-2xl p-8 text-center shadow-xl">
          <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-2">Your IELTS Result</p>
          <p className="text-white text-lg font-medium mb-4 capitalize">{level} Level · {section} Test</p>
          <div className={`text-7xl font-black mb-2 ${bandNum >= 7 ? 'text-green-400' : bandNum >= 5.5 ? 'text-brand-400' : 'text-orange-400'}`}>
            {overallBand}
          </div>
          <p className="text-gray-300 text-xl font-semibold">{bandLabel}</p>

          {/* Score breakdown (for objective tests) */}
          {results.some(r => r.score !== undefined) && (
            <div className="mt-6 grid grid-cols-2 gap-3">
              {results.filter(r => r.score !== undefined).map(r => (
                <div key={r.name} className="bg-white/10 rounded-xl p-4">
                  <p className="text-gray-300 text-xs mb-1 capitalize">{r.name}</p>
                  <p className="text-2xl font-bold text-white">{r.band}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{r.score}/{r.total} correct</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weak Areas */}
        {weakAreas.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
            <h3 className="text-orange-700 font-bold text-lg mb-3">⚠️ Areas to Improve</h3>
            <div className="space-y-2">
              {weakAreas.map(area => (
                <div key={area.name} className="flex items-center justify-between bg-white border border-orange-200 rounded-xl px-4 py-3">
                  <span className="capitalize font-medium text-gray-800">{area.name}</span>
                  <span className="text-orange-600 font-bold">Band {area.band}</span>
                </div>
              ))}
            </div>
            <p className="text-orange-600 text-sm mt-3">Our expert counsellors can help you improve these sections with personalised guidance.</p>
          </div>
        )}

        {/* Band guidance */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-gray-900 font-bold text-lg mb-4">📊 What your band means</h3>
          <div className="space-y-3 text-sm text-gray-700">
            {bandNum >= 7 && <p>🎉 <strong>Excellent!</strong> A Band {overallBand} qualifies you for most top universities in the UK, USA, Canada, and Australia.</p>}
            {bandNum >= 6 && bandNum < 7 && <p>✅ <strong>Good progress!</strong> Band {overallBand} meets requirements for many universities. Targeted practice in your weak areas could push you above 7.0.</p>}
            {bandNum < 6 && <p>📈 <strong>Keep working!</strong> Band {overallBand} is a solid starting point. With focused preparation, reaching 6.5+ is very achievable. Our counsellors can create a personalised study plan.</p>}
          </div>
        </div>

        {/* Lead Capture */}
        {!submitted ? (
          <div className="bg-gradient-to-br from-brand-600 to-brand-700 text-white rounded-2xl p-6">
            <h3 className="font-bold text-xl mb-1">📞 Get Your FREE Score Analysis</h3>
            <p className="text-brand-200 text-sm mb-4">Our IELTS experts will review your test and create a personalised improvement plan — completely free.</p>
            <form onSubmit={handleLeadSubmit} className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  required value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your Name"
                  className="bg-white/20 placeholder-brand-200 text-white border border-brand-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white"
                />
                <input
                  required value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="Phone Number"
                  type="tel"
                  className="bg-white/20 placeholder-brand-200 text-white border border-brand-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              <button type="submit"
                className="w-full bg-white text-brand-700 font-bold py-3 rounded-xl hover:bg-brand-50 transition-colors text-base">
                Get Free Analysis →
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <p className="text-4xl mb-3">✅</p>
            <h3 className="text-green-800 font-bold text-xl">We'll be in touch!</h3>
            <p className="text-green-600 text-sm mt-2">Our IELTS counsellor will call you within 24 hours with your personalised improvement plan.</p>
          </div>
        )}

        {/* WhatsApp CTA */}
        <div className="flex gap-3">
          <a
            href={`https://wa.me/919971226347?text=Hi!%20I%20just%20completed%20the%20IELTS%20Mock%20Test%20(${encodeURIComponent(level + ' ' + section)})%20and%20got%20Band%20${overallBand}.%20I'd%20like%20to%20discuss%20my%20score.`}
            target="_blank" rel="noopener noreferrer"
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-xl text-center transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp Us
          </a>
          <button onClick={onRetake}
            className="flex-1 bg-[#0a1628] hover:bg-[#0d1b2e] text-white font-bold py-3.5 rounded-xl transition-colors">
            🔄 Practice Again
          </button>
        </div>

        <div className="text-center">
          <Link href="/mock-test" className="text-brand-600 hover:text-brand-700 text-sm underline">
            ← Back to All Tests
          </Link>
        </div>
      </div>
    </div>
  );
}
