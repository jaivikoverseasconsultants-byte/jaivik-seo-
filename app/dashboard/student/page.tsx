import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const StudentDashboardNew = dynamic(
  () => import('@/components/StudentDashboardNew'),
  { ssr: false }
);

export const metadata: Metadata = {
  title: 'Student Dashboard – Applications, Visa & IELTS | Jaivik Overseas',
  description: 'Track your university applications, offer letters, visa status, payments and IELTS scores in your Jaivik Overseas student portal.',
  robots: { index: false, follow: false },
};

export default function StudentDashboardPage() {
  return <StudentDashboardNew />;
}
