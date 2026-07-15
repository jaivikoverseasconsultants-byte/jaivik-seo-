import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { getAllRealCourses } from '@/data/university-course-registry';
import IeltsBandHub from '@/components/IeltsBandHub';

export async function generateMetadata(): Promise<Metadata> {
  const count = getAllRealCourses().filter(c => c.ieltsMin > 0 && c.ieltsMin <= 6 && c.annualINR > 0).length;
  return buildMetadata({
    title: 'Universities Accepting IELTS 6.0 — Fees in INR for Indian Students',
    description: `${count} real courses with an IELTS 6.0 entry requirement or below, across the UK, Australia, New Zealand and more — with fees converted to INR and direct links to every course.`,
    path: '/ielts-6-0-universities',
    keywords: ['universities accepting IELTS 6.0', 'IELTS 6 band universities', 'low IELTS score universities abroad'],
  });
}

export default function Ielts60Page() {
  return <IeltsBandHub band={6} />;
}
