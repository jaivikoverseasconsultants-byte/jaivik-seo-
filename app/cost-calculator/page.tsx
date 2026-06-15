'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';

const COUNTRIES = [
  { name: 'UK',          flag: '🇬🇧', living: 1200000, visa: 35000,  currency: 'GBP', avgTuition: 2200000 },
  { name: 'Canada',      flag: '🇨🇦', living: 1000000, visa: 25000,  currency: 'CAD', avgTuition: 1800000 },
  { name: 'Australia',   flag: '🇦🇺', living: 1100000, visa: 45000,  currency: 'AUD', avgTuition: 2500000 },
  { name: 'Germany',     flag: '🇩🇪', living: 700000,  visa: 8000,   currency: 'EUR', avgTuition: 50000   },
  { name: 'Ireland',     flag: '🇮🇪', living: 1100000, visa: 22000,  currency: 'EUR', avgTuition: 1700000 },
  { name: 'Singapore',   flag: '🇸🇬', living: 1400000, visa: 15000,  currency: 'SGD', avgTuition: 3000000 },
  { name: 'New Zealand', flag: '🇳🇿', living: 900000,  visa: 20000,  currency: 'NZD', avgTuition: 1600000 },
  { name: 'Netherlands', flag: '🇳🇱', living: 800000,  visa: 12000,  currency: 'EUR', avgTuition: 1200000 },
  { name: 'UAE',         flag: '🇦🇪', living: 1000000, visa: 0,      currency: 'AED', avgTuition: 1800000 },
  { name: 'France',      flag: '🇫🇷', living: 800000,  visa: 10000,  currency: 'EUR', avgTuition: 300000  },
  { name: 'USA',         flag: '🇺🇸', living: 1500000, visa: 18000,  currency: 'USD', avgTuition: 3500000 },
  { name: 'Sweden',      flag: '🇸🇪', living: 900000,  visa: 12000,  currency: 'SEK', avgTuition: 1200000 },
  { name: 'Denmark',     flag: '🇩🇰', living: 1000000, visa: 12000,  currency: 'DKK', avgTuition: 1000000 },
  { name: 'Italy',       flag: '🇮🇹', living: 700000,  visa: 10000,  currency: 'EUR', avgTuition: 400000  },
  { name: 'Spain',       flag: '🇪🇸', living: 700000,  visa: 10000,  currency: 'EUR', avgTuition: 600000  },
];

const UNIS: Record<string, { name: string; tuitionINR: number }[]> = {
  UK: [
    { name: 'University of Manchester',   tuitionINR: 2500000 },
    { name: 'University of Edinburgh',    tuitionINR: 2800000 },
    { name: 'University of Warwick',      tuitionINR: 3000000 },
    { name: 'University of Bath',         tuitionINR: 2400000 },
    { name: 'University of Glasgow',      tuitionINR: 2200000 },
    { name: 'University of Sheffield',    tuitionINR: 2200000 },
    { name: 'University of Leeds',        tuitionINR: 2300000 },
    { name: 'University of Birmingham',   tuitionINR: 2400000 },
    { name: 'University of Bristol',      tuitionINR: 2600000 },
    { name: 'King\'s College London',     tuitionINR: 3200000 },
    { name: 'University College London',  tuitionINR: 3500000 },
    { name: 'London School of Economics', tuitionINR: 3800000 },
  ],
  Canada: [
    { name: 'University of British Columbia', tuitionINR: 2800000 },
    { name: 'University of Toronto',          tuitionINR: 3200000 },
    { name: 'University of Waterloo',         tuitionINR: 2500000 },
    { name: 'McMaster University',            tuitionINR: 2000000 },
    { name: 'McGill University',              tuitionINR: 2200000 },
    { name: 'University of Alberta',          tuitionINR: 1800000 },
    { name: 'York University',                tuitionINR: 1700000 },
    { name: 'Dalhousie University',           tuitionINR: 1600000 },
  ],
  Australia: [
    { name: 'University of Melbourne',        tuitionINR: 3200000 },
    { name: 'University of Sydney',           tuitionINR: 3000000 },
    { name: 'Monash University',              tuitionINR: 2800000 },
    { name: 'UNSW Sydney',                    tuitionINR: 3100000 },
    { name: 'University of Queensland',       tuitionINR: 2700000 },
    { name: 'RMIT University',                tuitionINR: 2200000 },
    { name: 'University of Adelaide',         tuitionINR: 2500000 },
    { name: 'Macquarie University',           tuitionINR: 2200000 },
    { name: 'La Trobe University',            tuitionINR: 1900000 },
    { name: 'Griffith University',            tuitionINR: 1800000 },
  ],
  Germany: [
    { name: 'TU Munich',                      tuitionINR: 25000  },
    { name: 'RWTH Aachen University',         tuitionINR: 25000  },
    { name: 'Karlsruhe Institute of Tech',    tuitionINR: 25000  },
    { name: 'LMU Munich',                     tuitionINR: 25000  },
    { name: 'Free University of Berlin',      tuitionINR: 25000  },
  ],
  Ireland: [
    { name: 'Trinity College Dublin',         tuitionINR: 2000000 },
    { name: 'University College Dublin',      tuitionINR: 1900000 },
    { name: 'University of Galway',           tuitionINR: 1600000 },
    { name: 'University College Cork',        tuitionINR: 1500000 },
  ],
  Singapore: [
    { name: 'National University of Singapore', tuitionINR: 3500000 },
    { name: 'Nanyang Technological University', tuitionINR: 3200000 },
  ],
};

const FLIGHT_INR = 60000;

const ACCOMM_ADJUST: Record<string, number> = {
  'On-campus': 0,
  'Off-campus': -50000,
  'Homestay': -100000,
};

function formatINR(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${n.toLocaleString('en-IN')}`;
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does it cost to study in the UK for Indian students?',
      acceptedAnswer: { '@type': 'Answer', text: 'Studying in the UK costs approximately ₹35–55 lakh per year for Indian students, including tuition (₹22–38L) and living costs (₹12L/year). The student visa fee is around ₹35,000.' },
    },
    {
      '@type': 'Question',
      name: 'What is the total cost of studying in Canada from India?',
      acceptedAnswer: { '@type': 'Answer', text: 'Total cost of studying in Canada for a 2-year Master\'s program is approximately ₹65–80 lakh, including tuition (₹18–32L/year) and living expenses (₹10L/year). The study permit fee is around ₹25,000.' },
    },
    {
      '@type': 'Question',
      name: 'Is Germany free for Indian students?',
      acceptedAnswer: { '@type': 'Answer', text: 'Most public universities in Germany charge very low or no tuition fees (₹25,000–50,000/semester for admin fees). However, living costs are around ₹7L/year, making it one of the most affordable study destinations for Indian students.' },
    },
    {
      '@type': 'Question',
      name: 'How much does it cost to study in Australia for Indian students?',
      acceptedAnswer: { '@type': 'Answer', text: 'Studying in Australia costs ₹28–35L/year in tuition plus ₹11L/year in living costs. A 2-year master\'s program totals approximately ₹78–90 lakh including all expenses.' },
    },
    {
      '@type': 'Question',
      name: 'How accurate is this study abroad cost calculator?',
      acceptedAnswer: { '@type': 'Answer', text: 'This calculator provides indicative estimates based on average tuition fees and government living cost guidelines. Actual costs vary by university, city, lifestyle, and exchange rates. Contact Jaivik Overseas Consultants for a personalised cost estimate.' },
    },
  ],
};

export default function CostCalculatorPage() {
  const [country, setCountry] = useState('');
  const [uniName, setUniName] = useState('');
  const [duration, setDuration] = useState(2);
  const [accomm, setAccomm] = useState('On-campus');
  const [customTuition, setCustomTuition] = useState('');
  const [scholarship, setScholarship] = useState('');

  const selected = COUNTRIES.find(c => c.name === country);
  const unis = country ? (UNIS[country] ?? []) : [];
  const selectedUni = unis.find(u => u.name === uniName);

  const result = useMemo(() => {
    if (!selected) return null;
    const tuitionPerYear = selectedUni
      ? selectedUni.tuitionINR
      : customTuition
      ? parseInt(customTuition.replace(/,/g, '')) * 100000
      : selected.avgTuition;
    const livingPerYear = selected.living + (ACCOMM_ADJUST[accomm] ?? 0);
    const totalTuition = tuitionPerYear * duration;
    const totalLiving = livingPerYear * duration;
    const visaFee = selected.visa;
    const flight = FLIGHT_INR;
    const total = totalTuition + totalLiving + visaFee + flight;
    const scholarshipAmt = Math.min(parseFloat(scholarship || '0') * 100000, total);
    const netTotal = total - scholarshipAmt;
    const monthly = Math.round(livingPerYear / 12);
    return { tuitionPerYear, livingPerYear, totalTuition, totalLiving, visaFee, flight, total, scholarshipAmt, netTotal, monthly };
  }, [selected, selectedUni, customTuition, duration, accomm, scholarship]);

  return (
    <>
      <JsonLd data={faqSchema} />

      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            💰 Free Tool · No Sign-up Required
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Study Abroad Cost Calculator 2026
          </h1>
          <p className="text-blue-200 text-lg">
            Total Cost in INR — Tuition + Living + Visa + Flight
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Inputs */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Select Your Study Plan</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Country</label>
                  <select
                    value={country}
                    onChange={e => { setCountry(e.target.value); setUniName(''); setCustomTuition(''); }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-brand-500"
                  >
                    <option value="">— Select Country —</option>
                    {COUNTRIES.map(c => (
                      <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                </div>

                {country && unis.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">University (optional)</label>
                    <select
                      value={uniName}
                      onChange={e => setUniName(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-brand-500"
                    >
                      <option value="">— Use country average —</option>
                      {unis.map(u => (
                        <option key={u.name} value={u.name}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {country && !uniName && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Custom Tuition Fee (₹ Lakh/year)</label>
                    <input
                      type="number"
                      placeholder={`e.g. ${selected ? (selected.avgTuition / 100000).toFixed(0) : '20'}`}
                      value={customTuition}
                      onChange={e => setCustomTuition(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">Leave blank to use country average</p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Course Duration</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map(d => (
                      <button
                        key={d}
                        onClick={() => setDuration(d)}
                        className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                          duration === d
                            ? 'bg-brand-700 text-white border-brand-700'
                            : 'border-gray-200 text-gray-700 hover:border-brand-300'
                        }`}
                      >
                        {d} year{d > 1 ? 's' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Accommodation</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['On-campus', 'Off-campus', 'Homestay'].map(a => (
                      <button
                        key={a}
                        onClick={() => setAccomm(a)}
                        className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                          accomm === a
                            ? 'bg-brand-700 text-white border-brand-700'
                            : 'border-gray-200 text-gray-700 hover:border-brand-300'
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Scholarship / Grant (₹ Lakh)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 5 (leave blank if none)"
                    value={scholarship}
                    onChange={e => setScholarship(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Enter total scholarship amount in lakhs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Output */}
          <div>
            {result ? (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-gray-900">Cost Breakdown</h2>
                    <span className="text-sm font-semibold text-gray-500">{duration} year{duration > 1 ? 's' : ''} total</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: `Tuition (${formatINR(result.tuitionPerYear)}/yr × ${duration})`, value: result.totalTuition, hi: false },
                      { label: `Living Cost (${formatINR(result.livingPerYear)}/yr × ${duration})`, value: result.totalLiving, hi: false },
                      { label: 'Visa Fee (one-time)', value: result.visaFee, hi: false },
                      { label: 'Flight (one-way estimate)', value: result.flight, hi: false },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-sm text-gray-600">{row.label}</span>
                        <span className="text-sm font-semibold text-gray-900">{formatINR(row.value)}</span>
                      </div>
                    ))}
                    {result.scholarshipAmt > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-sm text-green-600">Scholarship / Grant</span>
                        <span className="text-sm font-semibold text-green-600">− {formatINR(result.scholarshipAmt)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 mt-1">
                      <span className="font-bold text-gray-900">TOTAL ESTIMATED COST</span>
                      <span className="text-2xl font-black text-brand-700">{formatINR(result.total)}</span>
                    </div>
                    {result.scholarshipAmt > 0 && (
                      <div className="flex justify-between items-center pt-2 bg-green-50 -mx-2 px-2 py-2 rounded-xl mt-1">
                        <span className="font-bold text-green-800">AFTER SCHOLARSHIP</span>
                        <span className="text-2xl font-black text-green-700">{formatINR(result.netTotal)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-brand-50 rounded-2xl p-5 border border-brand-100">
                  <h3 className="font-bold text-brand-900 mb-3 text-sm">Monthly Budget Breakdown</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Monthly Living', value: result.monthly },
                      { label: 'Monthly Tuition', value: Math.round(result.tuitionPerYear / 12) },
                    ].map(b => (
                      <div key={b.label} className="bg-white rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-brand-700">{formatINR(b.value)}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{b.label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    * Estimates only. Exchange rates, lifestyle, and city of study affect actual costs.
                    <Link href="/book-counselling" className="text-brand-700 underline ml-1">Get exact figures →</Link>
                  </p>
                </div>

                <div className="bg-gold-50 border border-gold-200 rounded-2xl p-5 text-center">
                  <p className="font-bold text-gold-900 mb-1">Want help funding this?</p>
                  <p className="text-xs text-gold-700 mb-3">Our counsellors identify scholarships that can reduce your cost by ₹5–20L</p>
                  <Link href="/find-my-course" className="inline-block bg-gold-500 hover:bg-gold-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
                    Get a Free Consultation →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-10 border border-gray-100 text-center">
                <p className="text-4xl mb-3">💰</p>
                <p className="text-gray-700 font-semibold mb-1">Select a country to see costs</p>
                <p className="text-sm text-gray-500">Your total cost estimate will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions — Study Abroad Costs</h2>
          <div className="space-y-5">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="border-b border-gray-50 pb-4 last:border-0">
                <p className="font-semibold text-gray-900 text-sm mb-1">{faq.name}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
