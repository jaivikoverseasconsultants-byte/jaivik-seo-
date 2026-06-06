import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const StudentLoginClient = dynamic(() => import('@/components/StudentLoginClient'), { ssr: false });

export const metadata: Metadata = {
  title: 'Student Login – Jaivik Overseas Portal (BETA)',
  description: 'Login to your Jaivik Overseas student portal to track applications, visa status and offer letters.',
  robots: { index: false, follow: false },
};

export default function StudentLoginPage() {
  return <StudentLoginClient />;
}
