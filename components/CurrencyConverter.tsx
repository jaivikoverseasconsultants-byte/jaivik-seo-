'use client';

import { useState, useEffect } from 'react';

const CURRENCIES = [
  { code: 'USD', symbol: '$',    name: 'US Dollar',          flag: '🇺🇸' },
  { code: 'CAD', symbol: 'C$',   name: 'Canadian Dollar',    flag: '🇨🇦' },
  { code: 'GBP', symbol: '£',    name: 'British Pound',      flag: '🇬🇧' },
  { code: 'AUD', symbol: 'A$',   name: 'Australian Dollar',  flag: '🇦🇺' },
  { code: 'EUR', symbol: '€',    name: 'Euro',               flag: '🇪🇺' },
  { code: 'SGD', symbol: 'S$',   name: 'Singapore Dollar',   flag: '🇸🇬' },
  { code: 'NZD', symbol: 'NZ$',  name: 'NZ Dollar',          flag: '🇳🇿' },
  { code: 'AED', symbol: 'AED',  name: 'UAE Dirham',         flag: '🇦🇪' },
  { code: 'DKK', symbol: 'kr',   name: 'Danish Krone',       flag: '🇩🇰' },
  { code: 'SEK', symbol: 'kr',   name: 'Swedish Krona',      flag: '🇸🇪' },
];

const CACHE_KEY = 'jaivik_fx_v1';
const CACHE_TTL = 24 * 60 * 60 * 1000;

interface RateData { rates: Record<string, number>; timestamp: number; }

function formatINR(n: number): string {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(2)} L`;
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

const FALLBACK: Record<string, number> = {
  INR: 83.5, USD: 1, CAD: 1.36, GBP: 0.79, AUD: 1.53,
  EUR: 0.92, SGD: 1.34, NZD: 1.63, AED: 3.67, DKK: 6.88, SEK: 10.42,
};

export default function CurrencyConverter() {
  const [rates, setRates]       = useState<Record<string, number> | null>(null);
  const [updatedAt, setUpdatedAt] = useState('');
  const [amount, setAmount]     = useState('10000');
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading]   = useState(true);
  const [isEst, setIsEst]       = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const d: RateData = JSON.parse(raw);
          if (Date.now() - d.timestamp < CACHE_TTL) {
            setRates(d.rates);
            setUpdatedAt(new Date(d.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }));
            setLoading(false);
            return;
          }
        }
      } catch {}

      try {
        const res  = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const json = await res.json();
        const d: RateData = { rates: json.rates as Record<string, number>, timestamp: Date.now() };
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(d)); } catch {}
        setRates(d.rates);
        setUpdatedAt(new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }));
      } catch {
        setRates(FALLBACK);
        setUpdatedAt('est.');
        setIsEst(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fromRate = rates ? (rates[currency] ?? 1) : 1;
  const inrRate  = rates ? (rates['INR'] ?? 83.5) : 83.5;
  const parsed   = parseFloat(amount);
  const inrAmount = !isNaN(parsed) && parsed > 0 ? parsed * inrRate / fromRate : null;
  const sel = CURRENCIES.find(c => c.code === currency);
  const usdInr = rates ? (rates['INR'] ?? 83.5).toFixed(2) : '83.50';

  return (
    <div className="bg-brand-900 rounded-2xl p-5 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base">Currency → INR</h3>
        <span className="text-xs bg-gold-500/20 text-gold-400 px-2 py-0.5 rounded-full font-semibold">
          {isEst ? 'EST' : 'LIVE'}
        </span>
      </div>

      {/* Live rate strip */}
      <div className="bg-white/10 rounded-xl px-3 py-2 mb-4 text-xs text-blue-100">
        {loading
          ? <span className="animate-pulse">Loading live rates…</span>
          : <>1 USD = ₹{usdInr} <span className="text-white/50 ml-1">· {updatedAt}</span></>
        }
      </div>

      {/* Amount */}
      <div className="mb-3">
        <label className="text-xs text-blue-300 block mb-1.5">Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-400 font-bold text-sm select-none">
            {sel?.symbol ?? '$'}
          </span>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl pl-8 pr-3 py-2.5 text-white text-sm focus:outline-none focus:border-gold-400 transition-colors placeholder-white/40"
            placeholder="Enter amount"
            min="0"
          />
        </div>
      </div>

      {/* Currency selector */}
      <div className="mb-4">
        <label className="text-xs text-blue-300 block mb-1.5">From Currency</label>
        <select
          value={currency}
          onChange={e => setCurrency(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-gold-400 transition-colors cursor-pointer"
          style={{ colorScheme: 'dark' }}
        >
          {CURRENCIES.map(c => (
            <option key={c.code} value={c.code} className="bg-brand-900">
              {c.flag} {c.code} – {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Result */}
      <div className="bg-gold-500/20 border border-gold-400/30 rounded-xl p-4 text-center min-h-[72px] flex flex-col items-center justify-center">
        {loading ? (
          <p className="text-gold-400 text-sm animate-pulse">Fetching rates…</p>
        ) : inrAmount !== null ? (
          <>
            <p className="text-2xl font-bold text-gold-400">{formatINR(inrAmount)}</p>
            <p className="text-xs text-blue-200 mt-1">
              {sel?.symbol}{parsed.toLocaleString()} {currency} in Indian Rupees
            </p>
          </>
        ) : (
          <p className="text-blue-300 text-sm">Enter an amount above</p>
        )}
      </div>

      {/* Quick amounts */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {[1000, 5000, 10000, 25000, 50000].map(v => (
          <button
            key={v}
            onClick={() => setAmount(String(v))}
            className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
              amount === String(v)
                ? 'bg-gold-500 border-gold-500 text-brand-900 font-semibold'
                : 'border-white/20 text-blue-300 hover:border-gold-400 hover:text-gold-400'
            }`}
          >
            {v >= 1000 ? `${v / 1000}K` : v}
          </button>
        ))}
      </div>

      <p className="text-xs text-white/40 mt-3 text-center">
        *Indicative only. Actual bank rates vary.
      </p>
    </div>
  );
}
