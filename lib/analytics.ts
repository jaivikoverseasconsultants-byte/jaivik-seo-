// Thin wrapper around GA4's gtag.js (loaded in app/layout.tsx, measurement ID
// G-6NKH1JP37G). Safe to call even if gtag hasn't loaded yet (ad blockers,
// slow connections, or CSP misconfiguration) -- it's a no-op, not a throw.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params: Record<string, string>): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, params);
}
