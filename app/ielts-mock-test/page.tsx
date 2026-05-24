import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';

const IELTSMockTest = dynamic(() => import('@/components/IELTSMockTest'), { ssr: false });

export const metadata: Metadata = buildMetadata({
  title: 'Free IELTS Mock Test Online – Band Score 1-9 with AI Feedback',
  description: 'Take a free IELTS practice test online. 40 reading questions + 2 writing tasks. Get instant band score 1-9 with AI feedback and country-wise requirement comparison.',
  path: '/ielts-mock-test',
  keywords: [
    'free IELTS mock test online',
    'IELTS practice test with score',
    'IELTS band score checker free',
    'IELTS academic reading practice',
    'IELTS writing task 1 practice',
    'IELTS writing task 2 practice',
    'IELTS band score calculator',
    'IELTS test for study abroad',
  ],
});

export default function IELTSMockTestPage() {
  return <IELTSMockTest />;
}
