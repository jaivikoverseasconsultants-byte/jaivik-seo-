import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

// app/contact/page.tsx is a client component ('use client'), so it can't
// export metadata itself — a sibling layout.tsx is the standard Next.js
// App Router fix (same pattern as app/dashboard/layout.tsx).
export const metadata: Metadata = buildMetadata({
  title: 'Contact Jaivik Overseas Consultants — Ghaziabad, Delhi NCR',
  description: 'Get in touch with Jaivik Overseas Consultants for free study abroad counselling. Office in Ghaziabad, serving Delhi NCR, Noida, Meerut, Haryana. Call, WhatsApp, or book an appointment.',
  path: '/contact',
  keywords: ['contact Jaivik Overseas', 'study abroad consultants Ghaziabad', 'overseas education office Delhi NCR'],
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
