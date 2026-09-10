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
// Short form for the <title>, where the band range pushed it past the truncation point.
// The full label still appears in the description and the on-page h1.
const LEVEL_SHORT: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
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
    title: `IELTS ${sectionLabel} Mock Test – ${LEVEL_SHORT[level] || level}`,
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
  const levelLabel = LEVEL_LABELS[level] || level;
  const sectionLabel = SECTION_LABELS[section] || section;
  return (
    <>
      {/* Server-rendered so each of these 15 pages has an h1 in its HTML. The test client
          below loads with `ssr: false` and renders no heading of its own at any phase, so
          without this the static output carries only the site header and footer. */}
      <h1 className="sr-only">{`IELTS ${sectionLabel} Mock Test — ${levelLabel}`}</h1>
      <IELTSTestClient level={level} section={section} />
    </>
  );
}
