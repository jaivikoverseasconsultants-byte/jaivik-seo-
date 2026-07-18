import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { UNIVERSITY_COMPARISONS, getUniversityComparisonBySlug } from '@/data/university-comparisons';
import { getUniversityComparisonData } from '@/lib/university-comparisons';
import UniversityComparisonPage from '@/components/UniversityComparisonPage';

export async function generateStaticParams() {
  return UNIVERSITY_COMPARISONS
    .filter(pair => getUniversityComparisonData(pair) !== null)
    .map(pair => ({ slug: pair.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pair = getUniversityComparisonBySlug(slug);
  const data = pair ? getUniversityComparisonData(pair) : null;
  if (!data) return {};

  const nameA = data.sideA.university.name;
  const nameB = data.sideB.university.name;

  return buildMetadata({
    title: `${nameA} vs ${nameB} — Fees, Courses & PSW Compared for Indian Students`,
    description: `Real course data comparison: ${nameA} (${data.sideA.count} real courses) vs ${nameB} (${data.sideB.count} real courses) — tuition fees in INR, course counts by level, and post-study work rights for Indian students.`,
    path: `/compare/${slug}`,
    keywords: [`${nameA} vs ${nameB}`, `${nameA} or ${nameB}`, `${nameA} vs ${nameB} for indian students`],
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pair = getUniversityComparisonBySlug(slug);
  if (!pair) notFound();
  const data = getUniversityComparisonData(pair);
  if (!data) notFound();
  return <UniversityComparisonPage data={data} />;
}
