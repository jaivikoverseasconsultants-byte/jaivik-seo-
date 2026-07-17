import type { Metadata } from 'next';
import { getSubjectPillarBySlug } from '@/data/subject-pillars';
import { getCoursesForPillar, buildPillarMetadata } from '@/lib/subject-pillars';
import SubjectPillarPage from '@/components/SubjectPillarPage';

const SLUG = 'data-science-abroad-for-indian-students';

export async function generateMetadata(): Promise<Metadata> {
  const config = getSubjectPillarBySlug(SLUG)!;
  return buildPillarMetadata(config, getCoursesForPillar(config));
}

export default function Page() {
  const config = getSubjectPillarBySlug(SLUG)!;
  return <SubjectPillarPage config={config} />;
}
