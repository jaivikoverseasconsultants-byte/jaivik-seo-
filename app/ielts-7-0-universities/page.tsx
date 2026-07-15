import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { getAllRealCourses } from '@/data/university-course-registry';
import IeltsBandHub from '@/components/IeltsBandHub';

export async function generateMetadata(): Promise<Metadata> {
  const count = getAllRealCourses().filter(c => c.ieltsMin > 0 && c.ieltsMin <= 7 && c.annualINR > 0).length;
  return buildMetadata({
    title: 'Universities Accepting IELTS 7.0 — Fees in INR for Indian Students',
    description: `${count} real courses with an IELTS 7.0 entry requirement or below, across 14 countries — with fees converted to INR and direct links to every course.`,
    path: '/ielts-7-0-universities',
    keywords: ['universities accepting IELTS 7.0', 'IELTS 7 band universities', 'IELTS 7.0 for masters abroad'],
  });
}

export default function Ielts70Page() {
  return <IeltsBandHub band={7} />;
}
