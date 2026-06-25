import type { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { buildMetadata } from '@/lib/seo';

const CompareClient = dynamic(() => import('@/components/CompareClient'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center py-24 text-gray-500">
      <div className="w-10 h-10 border-4 border-brand-700 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm">Loading comparison tool…</p>
    </div>
  ),
});

export const metadata: Metadata = buildMetadata({
  title: 'Study Abroad Comparison Tool – Compare Countries, Universities & Courses',
  description: 'Compare study abroad destinations side by side. See visa success rates, tuition fees, PR pathways, post-study work permits and get a personalised recommendation for Indian students.',
  path: '/compare',
  keywords: [
    'study abroad comparison tool',
    'compare countries for study abroad India',
    'which country is best for study abroad',
    'compare universities abroad for Indian students',
    'Canada vs UK vs Australia for study',
    'best country for MS from India',
  ],
});

export default function ComparePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4 justify-center">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-white">Compare</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            ⚖️ Free Comparison Tool
          </div>
          <h1 className="text-4xl font-bold mb-3">Compare Study Abroad Destinations</h1>
          <p className="text-blue-200 text-lg mb-4">
            Side-by-side comparison of countries, universities &amp; courses. See visa rates, fees, PR pathways and get a personalised recommendation.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {['🌍 10+ countries', '🎓 500+ universities', '🆓 100% free'].map(tag => (
              <span key={tag} className="bg-white/10 text-white px-3 py-1.5 rounded-full text-xs">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Tool */}
      <section className="bg-gray-50 min-h-screen">
        <CompareClient />
      </section>
    </>
  );
}
