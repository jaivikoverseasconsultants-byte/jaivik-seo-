import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { courses } from '@/data/courses';
import { universities } from '@/data/universities';
import { buildMetadata } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

const CourseFinderClient = dynamic(() => import('@/components/CourseFinderClient'), { ssr: false });

export const metadata: Metadata = buildMetadata({
  title: 'Course Finder – Find Best Courses Abroad by Budget, Country & Score',
  description: 'Use Jaivik Overseas Course Finder to filter 100+ courses abroad by country, budget, IELTS score, and course level. Get personalized recommendations from our expert counsellors in Ghaziabad.',
  path: '/course-finder',
  keywords: ['course finder study abroad', 'best course abroad for Indian students', 'which course to study abroad'],
});

const toolSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Jaivik Overseas Course Finder',
  description: 'Interactive tool to find the best courses to study abroad based on budget, country, IELTS score, and course level',
  url: 'https://jaivikoverseasconsultants.com/course-finder',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
  },
};

export default function CourseFinderPage() {
  return (
    <>
      <JsonLd data={toolSchema} />
      <CourseFinderClient courses={courses} universities={universities} />
    </>
  );
}
