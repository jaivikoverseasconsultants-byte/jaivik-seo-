import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { universities } from '@/data/universities';
import { buildMetadata } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

const AdvancedCourseFinderClient = dynamic(() => import('@/components/AdvancedCourseFinderClient'), { ssr: false });

export const metadata: Metadata = buildMetadata({
  title: 'Advanced Course & University Finder 2026 – Filter by Fees, IELTS, Country | Jaivik Overseas',
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
      <AdvancedCourseFinderClient universities={universities} />
    </>
  );
}
