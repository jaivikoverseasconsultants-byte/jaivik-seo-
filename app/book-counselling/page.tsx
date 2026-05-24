import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';

const BookCounsellingClient = dynamic(() => import('@/components/BookCounsellingClient'), { ssr: false });

export const metadata: Metadata = buildMetadata({
  title: 'Book Free Counselling – Study Abroad Expert Session',
  description: 'Book a free 30-minute counselling session with Jaivik Overseas Consultants. Choose your country, preferred date, and time slot. Expert guidance on university selection, admissions & visa.',
  path: '/book-counselling',
  keywords: ['book study abroad counselling', 'free counselling appointment', 'study abroad expert session India'],
});

export default function BookCounsellingPage() {
  return <BookCounsellingClient />;
}
