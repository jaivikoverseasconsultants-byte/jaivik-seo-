import Link from 'next/link';
import type { GuideRelatedLink } from '@/data/fear-cluster-guides';

export default function GuideRelatedLinks({ title, links }: { title: string; links: GuideRelatedLink[] }) {
  if (links.length === 0) return null;
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-2 rounded-full hover:bg-brand-100 transition-colors"
          >
            {link.label} →
          </Link>
        ))}
      </div>
    </div>
  );
}
