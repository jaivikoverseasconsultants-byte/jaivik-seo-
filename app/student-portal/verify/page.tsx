'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const StudentPortalClient = dynamic(() => import('@/components/StudentPortalClient'), { ssr: false });

function VerifyContent() {
  const params = useSearchParams();
  const id = params.get('id') ?? undefined;
  return <StudentPortalClient verifyId={id} />;
}

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyContent />
    </Suspense>
  );
}
