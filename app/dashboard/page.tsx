import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';

const StudentDashboard = dynamic(() => import('@/components/StudentDashboard'), { ssr: false });

export const metadata: Metadata = buildMetadata({
  title: 'Student Dashboard – Applications & Visa Status | Jaivik Overseas',
  description: 'Track your university applications, offer letters, visa status, payments and deferrals from your Jaivik Overseas student dashboard.',
  path: '/dashboard',
  keywords: ['student dashboard', 'application tracker', 'visa status', 'offer letter'],
});

export default function DashboardPage() {
  return <StudentDashboard />;
}
