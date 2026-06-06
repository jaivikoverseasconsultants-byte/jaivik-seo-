import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const TrainerDashboardClient = dynamic(
  () => import('@/components/TrainerDashboardClient'),
  { ssr: false }
);

export const metadata: Metadata = {
  title: 'Trainer Dashboard – IELTS Coaching | Jaivik Overseas',
  description: 'Manage your IELTS coaching batches, students, availability and earnings on the Jaivik Overseas trainer portal.',
  robots: { index: false, follow: false },
};

export default function TrainerDashboardPage() {
  return <TrainerDashboardClient />;
}
