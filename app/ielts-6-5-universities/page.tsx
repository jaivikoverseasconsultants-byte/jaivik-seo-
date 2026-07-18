import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { getIeltsBandGuideBySlug } from '@/data/ielts-band-guides';
import IeltsBandHub from '@/components/IeltsBandHub';

const SLUG = 'ielts-6-5-universities';

export async function generateMetadata(): Promise<Metadata> {
  const guide = getIeltsBandGuideBySlug(SLUG)!;
  return buildMetadata({
    title: `${guide.title} — Honest Guide for Indian Students`,
    description: 'What an IELTS 6.5 overall score realistically opens up for studying abroad — general, honest guidance, not a per-university list, plus real university, fee, and budget resources.',
    path: `/${SLUG}`,
    keywords: ['ielts 6.5 for study abroad', 'ielts 6.5 band meaning', 'ielts 6.5 for masters abroad'],
  });
}

export default function Ielts65Page() {
  const guide = getIeltsBandGuideBySlug(SLUG)!;
  return <IeltsBandHub guide={guide} />;
}
