import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';

const CompareClient = dynamic(() => import('@/components/CompareClient'), { ssr: false });

export const metadata: Metadata = buildMetadata({
  title: 'Study Abroad Comparison Tool – Compare Countries, Universities & Courses',
  description: 'Compare study abroad destinations side by side. See visa success rates, tuition fees, PR pathways, post-study work permits and get a personalised recommendation for Indian students.',
  path: '/compare',
  keywords: [
    'study abroad comparison tool',
    'compare countries for study abroad India',
    'which country is best for study abroad',
    'compare universities abroad for Indian students',
    'Canada vs UK vs Australia for study',
    'best country for MS from India',
  ],
});

export default function ComparePage() {
  return <CompareClient />;
}
