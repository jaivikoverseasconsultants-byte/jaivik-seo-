import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';

const StudentPortalClient = dynamic(() => import('@/components/StudentPortalClient'), { ssr: false });

export const metadata: Metadata = buildMetadata({
  title: 'Student Portal – Track Your Applications | Jaivik Overseas',
  description: 'Login to your Jaivik Overseas student portal to track university applications, offer letters, visa status, payments, and deferrals.',
  path: '/student-portal',
  keywords: ['student portal', 'application tracker', 'study abroad tracker'],
});

export default function StudentPortalPage() {
  return <StudentPortalClient />;
}
