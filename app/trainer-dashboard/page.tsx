import type { Metadata } from 'next';
import TrainerDashboardClient from '@/components/TrainerDashboardClient';

export const metadata: Metadata = {
  title: 'Trainer Dashboard | Jaivik Overseas IELTS',
  description: 'Manage your IELTS batches, students, and availability on the Jaivik Overseas trainer platform.',
  robots: { index: false, follow: false },
};

export default function TrainerDashboardPage() {
  return <TrainerDashboardClient />;
}
