'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function RecommendContent() {
  const params = useSearchParams();
  const recommend = params.get('recommend');
  if (!recommend) return null;
  return (
    <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6">
      <p className="text-brand-700 font-bold text-lg mb-1">🎯 Recommended for you</p>
      <p className="text-brand-600 text-sm mb-4">Based on your profile, we recommend starting here:</p>
      <Link
        href={`/mock-test/${recommend}/full`}
        className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-bold transition-colors"
      >
        Take {recommend.charAt(0).toUpperCase() + recommend.slice(1)} Full Test →
      </Link>
    </div>
  );
}

export default function MockTestRecommend() {
  return (
    <Suspense fallback={null}>
      <RecommendContent />
    </Suspense>
  );
}
