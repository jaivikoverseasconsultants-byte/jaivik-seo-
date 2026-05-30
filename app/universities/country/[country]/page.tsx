import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { universities, getUniversitiesByCountry, countries } from '@/data/universities';
import { buildMetadata } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import LeadForm from '@/components/LeadForm';
import CountryUniversitiesClient from '@/components/CountryUniversitiesClient';
import { fetchUnsplashImage, COUNTRY_QUERIES } from '@/lib/unsplash';

export async function generateStaticParams() {
  return countries.map(c => ({ country: c.toLowerCase().replace(' ', '-') }));
}

// ── Rich country data ────────────────────────────────────────────────────────
interface CountryInfo {
  capital: string; currency: string; visa: string;
  workRights: string; pr: string;
  costOfLiving: { city: string; monthly: string }[];
  topCities: { name: string; known: string; emoji: string }[];
  prSteps: string[];
  workRightsDetail: string[];
  flag: string;
}

const countryData: Record<string, CountryInfo> = {
  USA: {
    flag: '🇺🇸', capital: 'Washington D.C.', currency: 'USD ($)',
    visa: 'F-1 Student Visa',
    workRights: '20 hrs/week on campus. OPT: 1–3 years post-study',
    pr: 'H-1B → Green Card pathway (5–10 years)',
    costOfLiving: [
      { city: 'New York City', monthly: '$2,500–$3,500' },
      { city: 'Boston', monthly: '$2,000–$3,000' },
      { city: 'Chicago', monthly: '$1,500–$2,200' },
      { city: 'Houston', monthly: '$1,200–$1,800' },
    ],
    topCities: [
      { name: 'Boston', known: 'MIT, Harvard, top STEM', emoji: '🎓' },
      { name: 'New York', known: 'Business, Finance, Ivy League', emoji: '🏙️' },
      { name: 'San Francisco', known: 'Tech, Silicon Valley', emoji: '🌁' },
      { name: 'Chicago', known: 'Engineering, Business', emoji: '🌆' },
    ],
    workRightsDetail: [
      '20 hrs/week on-campus during term',
      'Curricular Practical Training (CPT) during study',
      '12-month OPT after graduation (any field)',
      '24-month STEM OPT extension for STEM graduates',
      'Total up to 36 months of work authorization',
    ],
    prSteps: [
      'Graduate from a US university',
      'Work on H-1B visa (employer-sponsored)',
      'Employer files for PERM Labor Certification',
      'EB-2/EB-3 Green Card petition',
      'Permanent Resident status (5–10 years typical)',
    ],
  },
  UK: {
    flag: '🇬🇧', capital: 'London', currency: 'GBP (£)',
    visa: 'Student Visa (Tier 4)',
    workRights: '20 hrs/week during term. Graduate Route: 2 years PSW',
    pr: 'Skilled Worker Visa → ILR (5 years)',
    costOfLiving: [
      { city: 'London', monthly: '£1,400–£2,000' },
      { city: 'Manchester', monthly: '£900–£1,300' },
      { city: 'Birmingham', monthly: '£800–£1,200' },
      { city: 'Edinburgh', monthly: '£900–£1,300' },
    ],
    topCities: [
      { name: 'London', known: 'LSE, UCL, Imperial, KCL', emoji: '🏛️' },
      { name: 'Manchester', known: 'UoM, tech & business hub', emoji: '🏭' },
      { name: 'Edinburgh', known: 'UoE, law, medicine', emoji: '🏰' },
      { name: 'Birmingham', known: 'Engineering, large Indian community', emoji: '🎓' },
    ],
    workRightsDetail: [
      '20 hrs/week during term time',
      'Full-time during holidays',
      'Graduate Route visa: 2 years post-study (any job)',
      'No sponsorship needed for Graduate Route',
      'Switch to Skilled Worker visa from Graduate Route',
    ],
    prSteps: [
      'Complete degree in the UK',
      'Apply for Graduate Route visa (2 years)',
      'Get a skilled job (£26,200+ salary)',
      'Switch to Skilled Worker Visa',
      'Apply for ILR (Indefinite Leave to Remain) after 5 years',
    ],
  },
  Canada: {
    flag: '🇨🇦', capital: 'Ottawa', currency: 'CAD ($)',
    visa: 'Study Permit',
    workRights: '24 hrs/week off-campus. PGWP: 1–3 years post-study',
    pr: 'Express Entry / PNP → PR possible in 2–3 years',
    costOfLiving: [
      { city: 'Toronto', monthly: 'CAD $2,000–$2,800' },
      { city: 'Vancouver', monthly: 'CAD $2,000–$2,800' },
      { city: 'Montreal', monthly: 'CAD $1,400–$2,000' },
      { city: 'Calgary', monthly: 'CAD $1,500–$2,200' },
    ],
    topCities: [
      { name: 'Toronto', known: 'UofT, York — largest Indian community', emoji: '🏙️' },
      { name: 'Vancouver', known: 'UBC, SFU — tech & Pacific gateway', emoji: '🌊' },
      { name: 'Montreal', known: 'McGill, Concordia — affordable', emoji: '🎭' },
      { name: 'Ottawa', known: 'Carleton, uOttawa — government hub', emoji: '🏛️' },
    ],
    workRightsDetail: [
      '24 hrs/week off-campus during study (from 2024)',
      'Full-time during scheduled breaks',
      'Post-Graduation Work Permit (PGWP): 1–3 years',
      'PGWP duration = length of your study program',
      'Spouse/partner can also get an open work permit',
    ],
    prSteps: [
      'Complete 1+ year at a PGWP-eligible institution',
      'Obtain PGWP (Post-Graduation Work Permit)',
      'Gain Canadian work experience (1 year minimum)',
      'Apply via Express Entry (CRS score-based) or PNP',
      'Get PR in 6–12 months after ITA (Invitation to Apply)',
    ],
  },
  Australia: {
    flag: '🇦🇺', capital: 'Canberra', currency: 'AUD ($)',
    visa: 'Student Visa (Subclass 500)',
    workRights: '48 hrs/fortnight. Graduate Visa: 2–4 years',
    pr: 'Skilled Nomination → PR in 2–4 years',
    costOfLiving: [
      { city: 'Sydney', monthly: 'AUD $2,200–$3,000' },
      { city: 'Melbourne', monthly: 'AUD $1,800–$2,500' },
      { city: 'Brisbane', monthly: 'AUD $1,600–$2,200' },
      { city: 'Perth', monthly: 'AUD $1,500–$2,000' },
    ],
    topCities: [
      { name: 'Melbourne', known: 'UniMelb, Monash — most popular with Indians', emoji: '☕' },
      { name: 'Sydney', known: 'USYD, UNSW — finance & commerce', emoji: '🌉' },
      { name: 'Brisbane', known: 'UQ, QUT — growing tech scene', emoji: '☀️' },
      { name: 'Adelaide', known: 'UniAdelaide — affordable, welcoming', emoji: '🌿' },
    ],
    workRightsDetail: [
      '48 hrs/fortnight during term (as of 2024)',
      'Unlimited hours during semester breaks',
      'Temporary Graduate Visa (subclass 485): 2–4 years',
      'Graduate Visa duration based on study location',
      'Regional study grants extra years on grad visa',
    ],
    prSteps: [
      'Graduate from an Australian university',
      'Get Temporary Graduate Visa (485)',
      'Gain points via SkillSelect (age, English, experience)',
      'State Nomination (subclass 190) or Regional (491)',
      'Apply for PR — typically 2–4 years total process',
    ],
  },
  Germany: {
    flag: '🇩🇪', capital: 'Berlin', currency: 'EUR (€)',
    visa: 'Student Visa (National D)',
    workRights: '120 full days/year. 18-month job seeker visa post-graduation',
    pr: 'Blue Card → PR in 21–33 months',
    costOfLiving: [
      { city: 'Munich', monthly: '€1,100–€1,600' },
      { city: 'Berlin', monthly: '€900–€1,400' },
      { city: 'Frankfurt', monthly: '€1,000–€1,500' },
      { city: 'Hamburg', monthly: '€1,000–€1,400' },
    ],
    topCities: [
      { name: 'Munich', known: 'TU Munich, LMU — engineering & tech', emoji: '🍺' },
      { name: 'Berlin', known: 'TU Berlin, HU Berlin, FU Berlin — startup hub', emoji: '🎨' },
      { name: 'Heidelberg', known: 'Heidelberg Uni — one of Europe\'s oldest', emoji: '🏰' },
      { name: 'Frankfurt', known: 'Goethe Uni, finance capital', emoji: '🏦' },
    ],
    workRightsDetail: [
      '120 full working days (or 240 half-days) per year',
      'No restriction on type of work',
      '18-month Job Seeker Visa after graduation',
      'Once employed, switch to work permit',
      'EU Blue Card with salary ≥ €48,400 (MINT: €37,850)',
    ],
    prSteps: [
      'Complete degree in Germany',
      'Apply for 18-month Job Seeker Visa',
      'Get a skilled job matching your qualification',
      'Obtain EU Blue Card or Settlement Permit',
      'Apply for Niederlassungserlaubnis (PR) after 21–33 months',
    ],
  },
  Ireland: {
    flag: '🇮🇪', capital: 'Dublin', currency: 'EUR (€)',
    visa: 'Student Visa (D)',
    workRights: '20 hrs/week during term. Stay Back: 2 years',
    pr: 'Critical Skills Employment Permit → PR (5 years)',
    costOfLiving: [
      { city: 'Dublin', monthly: '€1,400–€2,000' },
      { city: 'Cork', monthly: '€1,000–€1,500' },
      { city: 'Galway', monthly: '€900–€1,300' },
      { city: 'Limerick', monthly: '€850–€1,200' },
    ],
    topCities: [
      { name: 'Dublin', known: 'UCD, TCD, DCU — tech & finance hub', emoji: '🍀' },
      { name: 'Cork', known: 'UCC — pharma, medical devices', emoji: '🏙️' },
      { name: 'Galway', known: 'NUI Galway — med tech cluster', emoji: '🌊' },
      { name: 'Limerick', known: 'UL — engineering, affordable', emoji: '🏗️' },
    ],
    workRightsDetail: [
      '20 hrs/week during term, full-time during holidays',
      'Third Level Graduate Scheme: 24-month Stay Back',
      'Masters/PhD graduates get 24 months to find work',
      'Critical Skills Employment Permit for high-demand roles',
      'General Employment Permit for other occupations',
    ],
    prSteps: [
      'Graduate from an Irish university',
      'Get Graduate (Stay Back) permission: 24 months',
      'Obtain Critical Skills Employment Permit or General EP',
      'Work legally for 2+ years',
      'Apply for Stamp 4 (PR-like) after 5 years',
    ],
  },
  'New Zealand': {
    flag: '🇳🇿', capital: 'Wellington', currency: 'NZD ($)',
    visa: 'Student Visa',
    workRights: '20 hrs/week. Post-Study Work Visa: 1–3 years',
    pr: 'Skilled Migrant Category → PR in 3–5 years',
    costOfLiving: [
      { city: 'Auckland', monthly: 'NZD $2,000–$2,800' },
      { city: 'Wellington', monthly: 'NZD $1,800–$2,400' },
      { city: 'Christchurch', monthly: 'NZD $1,500–$2,000' },
      { city: 'Dunedin', monthly: 'NZD $1,200–$1,700' },
    ],
    topCities: [
      { name: 'Auckland', known: 'UoA, AUT — largest city, diverse', emoji: '🌿' },
      { name: 'Wellington', known: 'VUW — capital, government & tech', emoji: '🏛️' },
      { name: 'Christchurch', known: 'UCanterbury — engineering hub', emoji: '🌸' },
      { name: 'Dunedin', known: 'UOtago — oldest uni, affordable', emoji: '🏔️' },
    ],
    workRightsDetail: [
      '20 hrs/week during term time',
      'Full-time during holidays',
      'Open Work Visa (Post-Study): 1–3 years',
      'Duration depends on study level and location',
      'Partner can apply for open work visa too',
    ],
    prSteps: [
      'Graduate from NZ university (1+ year program)',
      'Apply for Post-Study Open Work Visa',
      'Gain skilled work experience (2+ years)',
      'Submit Expression of Interest (SMC points-based)',
      'Receive Invitation to Apply and obtain Resident Visa',
    ],
  },
  Singapore: {
    flag: '🇸🇬', capital: 'Singapore City', currency: 'SGD (S$)',
    visa: 'Student Pass',
    workRights: '16 hrs/week. Employment Pass post-study',
    pr: 'EP → PR application possible after 2 years',
    costOfLiving: [
      { city: 'Singapore', monthly: 'SGD $1,800–$2,800' },
    ],
    topCities: [
      { name: 'Singapore', known: 'NUS, NTU — global top-50 unis', emoji: '🦁' },
    ],
    workRightsDetail: [
      '16 hrs/week during term with prior approval',
      'Full-time during vacation periods',
      'Employment Pass (EP) post-graduation: S$5,000+/month',
      'S-Pass for mid-level roles: S$3,150+/month',
      'Singapore Work Visa tied to employer sponsorship',
    ],
    prSteps: [
      'Graduate from NUS, NTU, or SMU',
      'Secure employment with an EP-eligible salary',
      'Work for 2+ years on valid EP',
      'Submit PR application (ICA — no quota, merit-based)',
      'PR typically approved in 6–12 months for strong profiles',
    ],
  },
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
    title: `Study in ${country} from India – Top Universities, Fees & Visa 2026`,
    description: `${unis.length}+ universities in ${country} for Indian students. Fees from $${(minFee / 1000).toFixed(0)}K/yr. Visa process, work rights, PR pathway, cost of living & scholarships. Free guidance from Jaivik Overseas Consultants.`,
    path: `/universities/country/${slug}`,
    keywords: [`study in ${country}`, `universities in ${country} for Indians`, `${country} student visa`, `${country} PR for Indian students`],
  });
}

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country: slug } = await params;
  const country = normalizeCountry(slug);
  const unis = getUniversitiesByCountry(country);
  if (!unis.length) notFound();

  const info = countryData[country];
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

      {/* ── Hero ── */}
      <section className="relative text-white py-12 px-4 overflow-hidden">
        {countryImage ? (
          <>
            <Image src={countryImage.url} alt={`Study in ${country}`} fill priority className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-brand-900/80" />
            <a href={countryImage.credit.link} target="_blank" rel="noopener noreferrer"
              className="absolute bottom-2 right-3 z-10 text-white/50 text-xs hover:text-white/80 transition-colors">
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
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                {info?.flag ?? ''} Study in {country} from India – 2026 Guide
              </h1>
              <p className="text-blue-200 text-lg mb-5">
                {unis.length} universities · Avg tuition ${(avgFee / 1000).toFixed(0)}K/year · {avgVisa}% visa success rate
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

          {/* ── Country Overview ── */}
          {info && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="section-title">Study in {country} – Key Facts for 2026</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {[
                  { label: '🏛️ Capital City', value: info.capital },
                  { label: '💰 Currency', value: info.currency },
                  { label: '🛂 Student Visa', value: info.visa },
                  { label: '⏱️ Work Rights', value: info.workRights },
                  { label: '🏡 PR Pathway', value: info.pr },
                ].map(f => (
                  <div key={f.label} className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 font-medium mb-1">{f.label}</p>
                    <p className="text-sm font-semibold text-gray-900">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Cost of Living ── */}
          {info?.costOfLiving && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="section-title">Cost of Living in {country}</h2>
              <p className="text-sm text-gray-500 mb-4">Monthly student living costs (accommodation + food + transport), excluding tuition.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {info.costOfLiving.map(item => (
                  <div key={item.city} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">📍 {item.city}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-brand-700 text-sm">{item.monthly}</p>
                      <p className="text-xs text-gray-400">per month</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-xs text-amber-800">
                  💡 <strong>Tip:</strong> Sharing accommodation and cooking at home can reduce costs by 30–40%. Many universities also offer on-campus housing at subsidised rates.
                </p>
              </div>
            </div>
          )}

          {/* ── Work Rights ── */}
          {info?.workRightsDetail && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="section-title">Work Rights for Students in {country}</h2>
              <ul className="mt-4 space-y-3">
                {info.workRightsDetail.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-sm text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── PR Pathway ── */}
          {info?.prSteps && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="section-title">PR Pathway from {country} for Indian Students</h2>
              <div className="mt-4 space-y-3">
                {info.prSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-brand-700 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-sm text-gray-800">{step}</p>
                      {i < info.prSteps.length - 1 && (
                        <div className="w-0.5 h-4 bg-brand-200 ml-3 mt-1" />
                      )}
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-3 bg-brand-50 rounded-xl">
                  <p className="text-xs text-brand-800">
                    🎯 <strong>Jaivik Overseas</strong> has helped 500+ Indian students navigate the PR process. Get personalised guidance from our expert counsellors — <Link href="/book-counselling" className="underline font-semibold">book a free session</Link>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Top Cities ── */}
          {info?.topCities && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="section-title">Top Student Cities in {country}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {info.topCities.map(city => (
                  <div key={city.name} className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-100">
                    <p className="text-2xl mb-1">{city.emoji}</p>
                    <p className="font-bold text-gray-900 text-sm">{city.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{city.known}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── University List with Filters ── */}
          <div>
            <h2 className="section-title mb-4">Top Universities in {country} for Indian Students</h2>
            <CountryUniversitiesClient unis={unis as any} country={country} />
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-5">
          <div className="sticky top-20 space-y-5">
            <LeadForm source={`country-${slug}-sidebar`} defaultCountry={country} />

            {/* Quick navigation */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">On This Page</h3>
              <ul className="space-y-2 text-xs text-gray-600">
                {[
                  ['Key Facts', '#'],
                  ['Cost of Living', '#'],
                  ['Work Rights', '#'],
                  ['PR Pathway', '#'],
                  ['Top Cities', '#'],
                  ['All Universities', '#'],
                ].map(([label]) => (
                  <li key={label} className="hover:text-brand-700 cursor-pointer">→ {label}</li>
                ))}
              </ul>
            </div>

            {/* Other destinations */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Compare Other Countries</h3>
              <ul className="space-y-2">
                {['UK', 'Canada', 'Australia', 'Germany', 'Ireland', 'New Zealand', 'USA']
                  .filter(c => c !== country)
                  .slice(0, 5)
                  .map(c => (
                    <li key={c}>
                      <Link href={`/universities/country/${c.toLowerCase().replace(' ', '-')}`}
                        className="text-xs text-brand-700 hover:underline">
                        → Study in {c}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
