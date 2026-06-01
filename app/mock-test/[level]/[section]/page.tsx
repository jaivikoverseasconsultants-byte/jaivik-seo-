import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';

const IELTSTestClient = dynamic(() => import('@/components/IELTSTestClient'), { ssr: false });

const LEVELS = ['beginner', 'intermediate', 'advanced'];
const SECTIONS = ['reading', 'listening', 'writing', 'speaking', 'full'];

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Beginner (Band 4.0–5.5)',
  intermediate: 'Intermediate (Band 5.5–7.0)',
  advanced: 'Advanced (Band 7.0–9.0)',
};
const SECTION_LABELS: Record<string, string> = {
  reading: 'Reading', listening: 'Listening',
  writing: 'Writing', speaking: 'Speaking', full: 'Full Test',
};

export async function generateStaticParams() {
  const params: { level: string; section: string }[] = [];
  for (const level of LEVELS) {
    for (const section of SECTIONS) {
      params.push({ level, section });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ level: string; section: string }>;
}): Promise<Metadata> {
  const { level, section } = await params;
  const levelLabel = LEVEL_LABELS[level] || level;
  const sectionLabel = SECTION_LABELS[section] || section;
  return buildMetadata({
    title: `IELTS ${sectionLabel} Mock Test – ${levelLabel} | Free Practice`,
    description: `Take a free IELTS ${sectionLabel} mock test at ${levelLabel}. Auto-scored with band prediction, sample answers, and expert guidance.`,
    path: `/mock-test/${level}/${section}`,
  });
}

export default async function MockTestPage({
  params,
}: {
  params: Promise<{ level: string; section: string }>;
}) {
  const { level, section } = await params;
  return <IELTSTestClient level={level} section={section} />;
}
