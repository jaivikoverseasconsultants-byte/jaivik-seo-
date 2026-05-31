import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

const MockTestClient = dynamic(() => import('@/components/MockTestClient'), { ssr: false });

export const metadata: Metadata = buildMetadata({
  title: 'Free IELTS Mock Test 2026 – 20 Questions with Band Score | Jaivik Overseas',
  description: 'Take a free IELTS practice test with 20 questions covering Reading, Grammar, Vocabulary & Academic English. Get your estimated band score instantly. Prepared by Jaivik Overseas Consultants.',
  path: '/mock-test',
  keywords: [
    'IELTS mock test 2026',
    'free IELTS practice test',
    'IELTS sample questions',
    'IELTS band score calculator',
    'IELTS preparation India',
    'study abroad test',
  ],
});

const testSchema = {
  '@context': 'https://schema.org',
  '@type': 'Quiz',
  name: 'Free IELTS Mock Test 2026',
  description: '20 questions covering Reading, Grammar, Vocabulary & Academic English with instant band score estimation',
  url: 'https://study.jaivikoverseasconsultants.com/mock-test',
  educationalLevel: 'University',
  about: { '@type': 'Thing', name: 'IELTS Preparation' },
  provider: {
    '@type': 'EducationalOrganization',
    name: 'Jaivik Overseas Consultants',
    url: 'https://study.jaivikoverseasconsultants.com',
  },
};

export default function MockTestPage() {
  return (
    <>
      <JsonLd data={testSchema} />
      <MockTestClient />
    </>
  );
}
