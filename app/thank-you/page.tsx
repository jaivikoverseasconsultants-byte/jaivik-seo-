'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const WA_NUMBER = '919971226347';
const WA_MSG = encodeURIComponent(
  'Hi Jaivik Overseas! I just submitted an enquiry on your website. Please help me with my study abroad plans.'
);
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

export default function ThankYouPage() {
  const [countdown, setCountdown] = useState(5);
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!redirected) {
            setRedirected(true);
            window.open(WA_URL, '_blank');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [redirected]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-700 to-brand-900 flex items-center justify-center px-4 py-16">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 text-center">
        {/* Checkmark */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Received! 🎉</h1>
        <p className="text-gray-500 mb-6 text-sm leading-relaxed">
          Thank you for reaching out to <strong>Jaivik Overseas Consultants</strong>. Our expert counsellor will contact you within <strong>24 hours</strong> to guide you through your study abroad journey.
        </p>

        {/* What happens next */}
        <div className="bg-blue-50 rounded-2xl p-4 mb-6 text-left">
          <p className="text-xs font-bold text-blue-800 mb-2 uppercase tracking-wide">What happens next?</p>
          {[
            '📞 Our counsellor calls you within 24 hrs',
            '🎯 We match you with the best universities',
            '📄 Free SOP & application review',
            '✈️ Visa guidance & pre-departure briefing',
          ].map(step => (
            <p key={step} className="text-sm text-blue-700 py-1">{step}</p>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-2xl transition-colors text-base mb-3"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Chat on WhatsApp Now
        </a>

        {countdown > 0 ? (
          <p className="text-xs text-gray-400">Opening WhatsApp automatically in {countdown}s…</p>
        ) : (
          <p className="text-xs text-gray-400">WhatsApp opened in a new tab.</p>
        )}

        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center gap-6 text-sm">
          <Link href="/" className="text-brand-700 hover:underline font-medium">← Back to Home</Link>
          <Link href="/course-finder" className="text-brand-700 hover:underline font-medium">Course Finder →</Link>
        </div>

        <p className="mt-4 text-xs text-gray-400">
          📞 +91-9971226347 &nbsp;|&nbsp; +91-9971881347 &nbsp;|&nbsp; jaivikoverseasconsultants@gmail.com
        </p>
      </div>
    </div>
  );
}
