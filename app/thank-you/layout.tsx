import type { Metadata } from 'next';

// noIndex: post-form-submission confirmation page (WhatsApp redirect) —
// no unique content for organic search, shouldn't compete for crawl budget.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
