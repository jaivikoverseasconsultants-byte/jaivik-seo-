import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { universities, countries } from '@/data/universities';
import { buildMetadata } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

const UniversityListingClient = dynamic(() => import('@/components/UniversityListingClient'), { ssr: false });

export const metadata: Metadata = buildMetadata({
  title: 'Top 300+ Universities Abroad for Indian Students 2026 – Filter by Fees, Rank & Country',
  description: 'Browse 300+ top universities in USA, UK, Canada, Australia, Germany, Ireland, Singapore & more. Filter by fees, QS rank, acceptance rate, 48hr offer letter, and scholarships.',
  path: '/universities',
  keywords: [
    'top universities abroad 2026',
    'best universities for Indian students',
    'universities with 48hr offer letter',
    'universities with scholarship for Indians',
    'study abroad university list',
  ],
});

const schema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Top Universities Abroad for Indian Students 2026',
  numberOfItems: universities.length,
  itemListElement: universities.slice(0, 10).map((u, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'CollegeOrUniversity',
      name: u.name,
      url: `https://study.jaivikoverseasconsultants.com/universities/${u.slug}`,
      address: { '@type': 'PostalAddress', addressLocality: u.city, addressCountry: u.countryCode },
    },
  })),
};

export default function UniversitiesPage() {
  return (
    <>
      <JsonLd data={schema} />
      <UniversityListingClient universities={universities} countries={countries} />
    </>
  );
}
