import dynamic from 'next/dynamic';

const StudentPortalClient = dynamic(() => import('@/components/StudentPortalClient'), { ssr: false });

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  return <StudentPortalClient verifyId={id} />;
}
