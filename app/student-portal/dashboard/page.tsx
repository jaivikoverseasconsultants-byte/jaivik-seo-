import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';

const StudentDashboard = dynamic(() => import('@/components/StudentDashboard'), { ssr: false });

// noIndex: legacy portal, superseded by /dashboard/student — see app/student-portal/page.tsx.
export const metadata: Metadata = buildMetadata({
  title: 'My Dashboard – Applications & Visa Status | Jaivik Overseas',
  description: 'Track your university applications, offer letters, visa status and payments from your Jaivik Overseas student dashboard.',
  path: '/student-portal/dashboard',
  keywords: ['student dashboard', 'application status', 'visa tracker'],
  noIndex: true,
});

export default function DashboardPage() {
  return <StudentDashboard />;
}
