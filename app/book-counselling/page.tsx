import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';

const BookCounsellingClient = dynamic(() => import('@/components/BookCounsellingClient'), { ssr: false });

export const metadata: Metadata = buildMetadata({
  title: 'Book Free Study Abroad Counselling',
  description: 'Book a free 30-minute counselling session with Jaivik Overseas Consultants. Choose your country, preferred date, and time slot. Expert guidance on university selection, admissions & visa.',
  path: '/book-counselling',
  keywords: ['book study abroad counselling', 'free counselling appointment', 'study abroad expert session India'],
});

export default function BookCounsellingPage() {
  return (
    <>
      {/* Server-rendered so the page has an h1 in its HTML — the form below loads with
          `ssr: false`, so its own heading never reaches the static output. Hidden because
          the identical wording is already the visible heading inside the client component. */}
      <h1 className="sr-only">Talk to Our Expert Counsellor</h1>
      <BookCounsellingClient />
    </>
  );
}
