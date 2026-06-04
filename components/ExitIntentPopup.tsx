'use client';
import { useState, useEffect, useRef } from 'react';

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem('exitPopupDismissed')) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !triggered.current) {
        triggered.current = true;
        // Small delay so it doesn't flash immediately
        setTimeout(() => setShow(true), 300);
      }
    };

    // Mobile: show on back button / page hide after 45s
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !triggered.current) {
        triggered.current = true;
      }
    };

    // Show on mobile after 60s of browsing
    const mobileTimer = setTimeout(() => {
      if (!triggered.current && window.innerWidth < 1024) {
        triggered.current = true;
        setShow(true);
      }
    }, 60000);

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(mobileTimer);
    };
  }, []);

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem('exitPopupDismissed', '1');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.length < 10) return;
    setSubmitted(true);
    sessionStorage.setItem('exitPopupDismissed', '1');
    // WhatsApp redirect
    const msg = encodeURIComponent(`Hi, I'm ${name} (${phone}). I'd like free expert guidance on studying abroad.`);
    setTimeout(() => {
      window.open(`https://wa.me/919971226347?text=${msg}`, '_blank');
      setShow(false);
    }, 1200);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top bar */}
        <div className="bg-gradient-to-r from-brand-700 to-brand-900 px-6 pt-6 pb-8 text-white text-center relative">
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="text-3xl mb-2">🎓</div>
          <h2 className="text-xl font-bold mb-1">Wait! Before You Go…</h2>
          <p className="text-blue-100 text-sm">Get <span className="text-gold-400 font-semibold">free expert guidance</span> from our study abroad counsellors</p>
        </div>

        {/* Negative space curve */}
        <div className="h-4 bg-gradient-to-r from-brand-700 to-brand-900 relative">
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-white rounded-t-[2rem]" />
        </div>

        <div className="px-6 pb-6 -mt-1">
          {!submitted ? (
            <>
              <div className="flex gap-3 mb-5">
                {['🇨🇦 Canada PR', '🇬🇧 UK Visa', '🇦🇺 Australia'].map(t => (
                  <span key={t} className="flex-1 text-center text-xs bg-brand-50 text-brand-700 font-medium py-1.5 rounded-lg">{t}</span>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="WhatsApp number (+91...)"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  required
                  maxLength={12}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-green-500/30"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Get Free Guidance on WhatsApp
                </button>
              </form>

              <p className="text-center text-xs text-gray-400 mt-3">
                🔒 No spam. Our counsellors respond within 2 hours.
              </p>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-bold text-gray-900 mb-1">You're all set!</h3>
              <p className="text-sm text-gray-600">Opening WhatsApp… Our counsellor will respond within 2 hours.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
