import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

// app/cost-calculator/page.tsx is a client component ('use client'), so it
// can't export metadata itself — sibling layout.tsx, same pattern as
// app/dashboard/layout.tsx.
export const metadata: Metadata = buildMetadata({
  title: 'Study Abroad Cost Calculator 2026 — Total Cost in INR',
  description: 'Calculate the total cost of studying abroad in Indian Rupees — tuition, living expenses, visa fees, and flights — for USA, UK, Canada, Australia, Germany and more.',
  path: '/cost-calculator',
  keywords: ['study abroad cost calculator', 'total cost of study abroad in INR', 'study abroad budget planner India'],
});

export default function CostCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
