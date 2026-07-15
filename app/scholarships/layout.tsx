import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

// app/scholarships/page.tsx is a client component ('use client'), so it
// can't export metadata itself — sibling layout.tsx, same pattern as
// app/dashboard/layout.tsx.
export const metadata: Metadata = buildMetadata({
  title: 'Scholarships for Indian Students Abroad — 2026 Guide',
  description: 'Explore scholarships for Indian students studying abroad — merit-based, need-based, and government-sponsored awards for USA, UK, Canada, Australia, Germany and more.',
  path: '/scholarships',
  keywords: ['scholarships for Indian students abroad', 'study abroad scholarships India', 'merit scholarships overseas education'],
});

export default function ScholarshipsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
