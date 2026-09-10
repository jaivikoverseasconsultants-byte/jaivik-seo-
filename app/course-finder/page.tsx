import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { universities } from '@/data/universities';
import { buildMetadata } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

const AdvancedCourseFinderClient = dynamic(() => import('@/components/AdvancedCourseFinderClient'), { ssr: false });

export const metadata: Metadata = buildMetadata({
  title: 'Course & University Finder — Fees & IELTS',
  description: 'Find the right university abroad using 20+ smart filters — country, province, fees, IELTS, co-op, scholarships, Russell Group, 48hr offer letter, and more. 300+ universities.',
  path: '/course-finder',
  keywords: [
    'course finder study abroad', 'best university abroad for Indian students',
    'filter universities by IELTS', 'affordable universities abroad',
    'co-op programs Canada', 'Russell Group universities UK',
  ],
});

const toolSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Jaivik Overseas Advanced Course Finder',
  description: 'Advanced university search tool with 20+ filters including fees, IELTS, co-op programs, scholarships, and more.',
  url: 'https://study.jaivikoverseasconsultants.com/course-finder',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
};

export default function CourseFinderPage() {
  return (
    <>
      <JsonLd data={toolSchema} />
      {/* Server-rendered so the page has an h1 in its HTML — the finder below loads with
          `ssr: false`, so its own heading never reaches the static output. Hidden because
          the identical wording is already the visible heading inside the client component. */}
      <h1 className="sr-only">Find Your Perfect Program Abroad</h1>
      <AdvancedCourseFinderClient universities={universities} />
    </>
  );
}
