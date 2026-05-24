import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { universities, getUniversitiesByCountry, countries } from '@/data/universities';
import { buildMetadata, formatINR } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import LeadForm from '@/components/LeadForm';
import { fetchUnsplashImage, COUNTRY_QUERIES } from '@/lib/unsplash';

export async function generateStaticParams() {
  return countries.map(c => ({ country: c.toLowerCase().replace(' ', '-') }));
}

const countryMeta: Record<string, { capital: string; currency: string; visa: string; workRights: string; pr: string }> = {
  USA: { capital: 'Washington D.C.', currency: 'USD ($)', visa: 'F-1 Student Visa', workRights: '20 hrs/week on campus. OPT: 1–3 years post-study', pr: 'H-1B → Green Card pathway (5–10 years)' },
  UK: { capital: 'London', currency: 'GBP (£)', visa: 'Student Visa (Tier 4)', workRights: '20 hrs/week during term. Graduate Route: 2 years PSW', pr: 'Skilled Worker Visa → ILR (5 years)' },
  Canada: { capital: 'Ottawa', currency: 'CAD ($)', visa: 'Study Permit', workRights: '24 hrs/week. PGWP: 1–3 years post-study', pr: 'Express Entry → PR possible in 2–3 years' },
  Australia: { capital: 'Canberra', currency: 'AUD ($)', visa: 'Student Visa (Subclass 500)', workRights: '48 hrs/fortnight. Graduate Visa: 2–4 years', pr: 'Skilled Nomination → PR in 2–4 years' },
  Germany: { capital: 'Berlin', currency: 'EUR (€)', visa: 'Student Visa (National D)', workRights: '120 full days/year. 18-month job seeker visa', pr: 'Blue Card → PR in 21–33 months' },
  Ireland: { capital: 'Dublin', currency: 'EUR (€)', visa: 'Student Visa (D)', workRights: '20 hrs/week. Stay Back: 2 years', pr: 'Critical Skills Employment Permit → PR' },
  Singapore: { capital: 'Singapore City', currency: 'SGD (S$)', visa: 'Student Pass', workRights: '16 hrs/week. Employment Pass post-study', pr: 'EP → PR application possible after 2 years' },
  'New Zealand': { capital: 'Wellington', currency: 'NZD ($)', visa: 'Student Visa', workRights: '20 hrs/week. Post-study: 1–3 years', pr: 'Skilled Migrant Category → PR in 3–5 years' },
};

function normalizeCountry(slug: string): string {
  const map: Record<string, string> = {
    usa: 'USA', uk: 'UK', canada: 'Canada', australia: 'Australia',
    germany: 'Germany', ireland: 'Ireland', singapore: 'Singapore',
    'new-zealand': 'New Zealand', france: 'France', netherlands: 'Netherlands', sweden: 'Sweden',
  };
  return map[slug.toLowerCase()] || slug.charAt(0).toUpperCase() + slug.slice(1);
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country: slug } = await params;
  const country = normalizeCountry(slug);
  const unis = getUniversitiesByCountry(country);
  if (!unis.length) return {};
  const minFee = Math.min(...unis.map(u => u.annualTuitionUSD));
  return buildMetadata({
    title: `Study in ${country} from India – Top Universities, Fees & Visa 2025`,
    description: `Best universities in ${country} for Indian students. Fees start from $${(minFee / 1000).toFixed(0)}K/year. Compare ${unis.length} universities, visa process, scholarships & PR pathways. Free guidance from Jaivik Overseas Consultants, Ghaziabad.`,
    path: `/universities/country/${slug}`,
    keywords: [`study in ${country}`, `universities in ${country} for Indians`, `${country} student visa`],
  });
}

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country: slug } = await params;
  const country = normalizeCountry(slug);
  const unis = getUniversitiesByCountry(country);
  if (!unis.length) notFound();

  const meta = countryMeta[country];
  const avgFee = Math.round(unis.reduce((s, u) => s + u.annualTuitionUSD, 0) / unis.length);
  const avgVisa = Math.round(unis.reduce((s, u) => s + u.visaApprovalRate, 0) / unis.length);

  const countryImage = await fetchUnsplashImage(COUNTRY_QUERIES[country] ?? `${country} university campus`);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaivikoverseasconsultants.com' },
      { '@type': 'ListItem', position: 2, name: 'Universities', item: 'https://jaivikoverseasconsultants.com/universities' },
      { '@type': 'ListItem', position: 3, name: `Study in ${country}`, item: `https://jaivikoverseasconsultants.com/universities/country/${slug}` },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <section className="relative text-white py-12 px-4 overflow-hidden">
        {countryImage ? (
          <>
            <Image
              src={countryImage.url}
              alt={`Study in ${country}`}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-brand-900/80" />
            <a
              href={countryImage.credit.link}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-3 z-10 text-white/50 text-xs hover:text-white/80 transition-colors"
            >
              📸 {countryImage.credit.name} / Unsplash
            </a>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-700 to-brand-900" />
        )}
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-3">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <span>Study in {country}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Study in {country} from India – 2025 Guide</h1>
              <p className="text-blue-200 text-lg mb-5">
                {unis.length} top universities · Avg tuition ${(avgFee / 1000).toFixed(0)}K/year · {avgVisa}% visa success rate
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                  { label: 'Universities Listed', value: unis.length },
                  { label: 'Avg Visa Success', value: `${avgVisa}%` },
                  { label: 'Avg Annual Fee', value: `$${(avgFee / 1000).toFixed(0)}K` },
                  { label: 'Min Fee Found', value: `$${(Math.min(...unis.map(u => u.annualTuitionUSD)) / 1000).toFixed(0)}K` },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source={`country-${slug}`} defaultCountry={country} compact />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">

          {/* Country Overview */}
          {meta && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="section-title">Study in {country} – Key Facts for Indian Students</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {[
                  { label: 'Capital City', value: meta.capital },
                  { label: 'Currency', value: meta.currency },
                  { label: 'Student Visa', value: meta.visa },
                  { label: 'Work Rights (Study)', value: meta.workRights },
                  { label: 'PR Pathway', value: meta.pr },
                ].map(f => (
                  <div key={f.label} className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 font-medium mb-1">{f.label}</p>
                    <p className="text-sm font-semibold text-gray-900">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* University List */}
          <div>
            <h2 className="section-title mb-4">Top Universities in {country} for Indian Students</h2>
            <div className="space-y-4">
              {unis.sort((a, b) => (a.qsRanking ?? 9999) - (b.qsRanking ?? 9999)).map((u, i) => (
                <div key={u.id} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-brand-50 rounded-full flex items-center justify-center text-brand-700 font-bold text-sm flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link href={`/universities/${u.slug}`} className="font-bold text-gray-900 hover:text-brand-700">{u.name}</Link>
                          <p className="text-xs text-gray-500">{u.city} · QS #{u.qsRanking} · Est. {u.establishedYear}</p>
                        </div>
                        <span className="text-brand-700 font-semibold text-sm whitespace-nowrap">${(u.annualTuitionUSD / 1000).toFixed(0)}K/yr</span>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-3 text-xs">
                        <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full">Visa {u.visaApprovalRate}%</span>
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full">Intake: {u.intakeMonths.join(', ')}</span>
                        <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full">IELTS {u.requirements.ieltsMin}+</span>
                      </div>
                      <div className="flex gap-3 mt-3">
                        <Link href={`/universities/${u.slug}`}
                          className="text-xs text-brand-700 font-medium hover:underline">
                          University Overview →
                        </Link>
                        <Link href={`/universities/${u.slug}/courses`}
                          className="text-xs bg-brand-700 text-white px-3 py-1 rounded-full font-medium hover:bg-brand-800">
                          Browse Courses →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="sticky top-20">
            <LeadForm source={`country-${slug}-sidebar`} defaultCountry={country} />
          </div>
        </div>
      </div>
    </>
  );
}
