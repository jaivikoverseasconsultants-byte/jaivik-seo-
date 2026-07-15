import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

// app/eligibility-checker/page.tsx is a client component ('use client'), so
// it can't export metadata itself — sibling layout.tsx, same pattern as
// app/dashboard/layout.tsx.
export const metadata: Metadata = buildMetadata({
  title: 'University Eligibility Checker 2026 — Free for Indian Students',
  description: 'Check your eligibility for top universities abroad based on your IELTS score, GPA, and academic backlogs. Instant results for USA, UK, Canada, Australia, Germany and more.',
  path: '/eligibility-checker',
  keywords: ['university eligibility checker', 'am I eligible to study abroad', 'IELTS GPA eligibility calculator'],
});

export default function EligibilityCheckerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
