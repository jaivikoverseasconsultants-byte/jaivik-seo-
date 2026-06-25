import type { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';

const StudentPortalClient = dynamic(() => import('@/components/StudentPortalClient'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center py-24 text-gray-500">
      <div className="w-10 h-10 border-4 border-brand-700 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm">Loading student portal…</p>
    </div>
  ),
});

export const metadata: Metadata = buildMetadata({
  title: 'Student Portal – Track Your Applications | Jaivik Overseas',
  description: 'Login to your Jaivik Overseas student portal to track university applications, offer letters, visa status, payments, and deferrals.',
  path: '/student-portal',
  keywords: ['student portal', 'application tracker', 'study abroad tracker'],
});

export default function StudentPortalPage() {
  return (
    <>
      <div className="bg-brand-900 text-white px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-blue-200 text-xs">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-white">Student Portal</span>
        </div>
      </div>
      <StudentPortalClient />
    </>
  );
}
