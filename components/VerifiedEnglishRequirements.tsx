import Link from 'next/link';
import { getUniversityBySlug } from '@/data/universities';
import type { EnglishReqVerified } from '@/data/english-requirements-verified';

function formatVerifiedDate(dateStr: string): string {
  const [y, m] = dateStr.split('-').map(Number);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[m - 1]} ${y}`;
}

export default function VerifiedEnglishRequirements({ rows, heading }: { rows: EnglishReqVerified[]; heading?: string }) {
  if (!rows.length) return null;
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-2">✓ {heading ?? 'Verified English Requirements'}</h2>
      <p className="text-sm text-gray-600 mb-4">
        Requirements we have manually verified against official university pages — always confirm on the
        university&apos;s own site before booking your test.
      </p>
      <div className="space-y-4">
        {rows.map(r => {
          const uni = getUniversityBySlug(r.universitySlug);
          const badge = r.scope.split('(')[0].trim();
          return (
            <div key={r.universitySlug} className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                <Link href={`/universities/${r.universitySlug}`} className="font-semibold text-brand-700 hover:underline">
                  {uni?.name ?? r.universitySlug}
                </Link>
                <span className="text-xs font-semibold bg-brand-50 text-brand-700 px-2 py-1 rounded-full whitespace-nowrap">{badge}</span>
              </div>
              <p className="text-sm text-gray-800">
                IELTS <strong>{r.ieltsOverall}</strong> overall
                {r.sectionRule ? ` — ${r.sectionRule}` : ''}
                {r.pte !== null ? ` · PTE ${r.pte}${r.pteSection !== null ? ` (min ${r.pteSection} each)` : ''}` : ''}
                {r.toefl !== null ? ` · TOEFL ${r.toefl}${r.toeflSection !== null ? ` (min ${r.toeflSection} each)` : ''}` : ''}
              </p>
              <p className="text-xs text-gray-500 mt-1">{r.scope}</p>
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2 text-xs">
                <a href={r.sourceUrl} target="_blank" rel="nofollow noopener noreferrer" className="text-brand-700 hover:underline font-medium">
                  Source: university website →
                </a>
                <span className="text-gray-400">Verified {formatVerifiedDate(r.verifiedDate)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
