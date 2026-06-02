import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getUniversitiesByCity } from '@/data/universities';
import { CANADA_CITIES, CANADA_CITY_SLUGS } from '@/data/canada-cities';
import { buildMetadata } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import LeadForm from '@/components/LeadForm';

export function generateStaticParams() {
  return CANADA_CITY_SLUGS.map(city => ({ city }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ city: string }> }
): Promise<Metadata> {
  const { city: slug } = await params;
  const cityData = CANADA_CITIES[slug];
  if (!cityData) return {};
  const unis = getUniversitiesByCity(cityData.cityNames);
  return buildMetadata({
    title: `Study in ${cityData.name}, ${cityData.province} – Universities, Fees & Living Cost 2026`,
    description: `${unis.length} colleges & universities in ${cityData.name} for Indian students. Living cost ~CAD $${cityData.costOfLiving.toLocaleString()}/month. PGWP eligible. Compare programs, fees & intakes. Free guidance from Jaivik Overseas Consultants.`,
    path: `/universities/city/${slug}`,
    keywords: [
      `study in ${cityData.name}`,
      `universities in ${cityData.name}`,
      `colleges in ${cityData.name} for Indian students`,
      `${cityData.name} study permit`,
      `${cityData.name} ${cityData.province} student visa`,
    ],
  });
}

export default async function CityPage(
  { params }: { params: Promise<{ city: string }> }
) {
  const { city: slug } = await params;
  const cityData = CANADA_CITIES[slug];
  if (!cityData) notFound();

  const unis = getUniversitiesByCity(cityData.cityNames);
  const avgFeeCAD = unis.length
    ? Math.round(unis.reduce((s, u) => s + u.annualTuitionUSD * 1.37, 0) / unis.length)
    : 0;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://study.jaivikoverseasconsultants.com' },
      { '@type': 'ListItem', position: 2, name: 'Universities', item: 'https://study.jaivikoverseasconsultants.com/universities' },
      { '@type': 'ListItem', position: 3, name: `Study in Canada`, item: 'https://study.jaivikoverseasconsultants.com/universities/country/canada' },
      { '@type': 'ListItem', position: 4, name: `${cityData.name} Universities`, item: `https://study.jaivikoverseasconsultants.com/universities/city/${slug}` },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <Link href="/universities/country/canada" className="hover:text-white">Canada</Link> /
            <span className="text-white">{cityData.name}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                🇨🇦 {cityData.name}, {cityData.province} · PGWP Eligible
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Study in {cityData.name} — Universities & Colleges 2026
              </h1>
              <p className="text-blue-200 text-lg mb-5">
                {unis.length > 0
                  ? `${unis.length} institution${unis.length !== 1 ? 's' : ''} · Living cost ~CAD $${cityData.costOfLiving.toLocaleString()}/month · PGWP eligible`
                  : `${cityData.province}, Canada · Living cost ~CAD $${cityData.costOfLiving.toLocaleString()}/month`}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Institutions Listed', value: unis.length || '—' },
                  { label: 'Living Cost/Month', value: `$${(cityData.costOfLiving / 1000).toFixed(1)}K CAD` },
                  { label: 'Avg Annual Tuition', value: avgFeeCAD ? `$${Math.round(avgFeeCAD / 1000)}K CAD` : '—' },
                  { label: 'Work Rights', value: '24 hrs/wk' },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source={`city-${slug}`} defaultCountry="Canada" compact />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">

          {/* City Overview */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Why Indian Students Choose {cityData.name}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-5">{cityData.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: '🏠 Cost of Living', value: `~CAD $${cityData.costOfLiving.toLocaleString()}/month (student budget)` },
                { label: '🌤 Weather', value: cityData.weather },
                { label: '🇮🇳 Indian Community', value: cityData.indianCommunity },
                { label: '✅ Work Rights', value: 'Up to 24 hrs/week during studies. Full-time during scheduled breaks.' },
                { label: '🎓 Post-Study Work', value: 'PGWP up to 3 years. Leads to Express Entry for PR.' },
                { label: '🏙 Province', value: `${cityData.province}, Canada` },
              ].map(f => (
                <div key={f.label} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-semibold text-gray-500 mb-1">{f.label}</p>
                  <p className="text-sm text-gray-900">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Key Highlights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cityData.highlights.map(h => (
                <div key={h} className="flex items-start gap-3 p-3 bg-brand-50 rounded-xl">
                  <span className="text-brand-600 font-bold text-lg mt-0.5">✓</span>
                  <p className="text-sm text-gray-800 font-medium">{h}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Universities */}
          {unis.length > 0 ? (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Universities & Colleges in {cityData.name}
              </h2>
              <div className="space-y-4">
                {unis
                  .sort((a, b) => (a.qsRanking ?? 9999) - (b.qsRanking ?? 9999))
                  .map((u, i) => (
                  <div key={u.id} className="relative bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all group cursor-pointer">
                    {/* Full-card clickable overlay → university overview */}
                    <Link href={`/universities/${u.slug}`} className="absolute inset-0 rounded-2xl z-0" aria-label={`View ${u.name}`} />
                    <div className="relative z-10 flex items-start gap-4">
                      <div className="w-8 h-8 bg-brand-50 rounded-full flex items-center justify-center text-brand-700 font-bold text-sm flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <span className="font-bold text-gray-900 group-hover:text-brand-700 text-sm leading-snug">
                              {u.name}
                            </span>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {u.city}, {u.state}
                              {u.qsRanking ? ` · QS #${u.qsRanking}` : ''}
                              {u.establishedYear ? ` · Est. ${u.establishedYear}` : ''}
                            </p>
                          </div>
                          <span className="text-brand-700 font-bold text-sm whitespace-nowrap">
                            ~${Math.round(u.annualTuitionUSD * 1.37 / 1000)}K CAD/yr
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3 text-xs">
                          <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full">
                            Visa {u.visaApprovalRate}%
                          </span>
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                            {u.intakeMonths.join(' & ')} intake
                          </span>
                          <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
                            IELTS {u.requirements.ieltsMin}+
                          </span>
                          <span className="bg-gold-50 text-gold-700 px-2 py-1 rounded-full">
                            PGWP Eligible
                          </span>
                        </div>
                        <div className="flex gap-3 mt-3 flex-wrap">
                          <Link href={`/universities/${u.slug}/courses`}
                            className="relative z-10 text-xs bg-brand-700 text-white px-3 py-1 rounded-full font-medium hover:bg-brand-800 transition-colors">
                            Browse Degree Programs →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
              <p className="text-gray-500 mb-2">We are adding universities in {cityData.name} to our portal soon.</p>
              <p className="text-sm text-gray-400 mb-5">Contact our counsellors for institutions currently available in {cityData.name}.</p>
              <Link href="/book-counselling" className="btn-primary inline-block">
                Get Free Guidance →
              </Link>
            </div>
          )}

          {/* Canada Study Facts */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Canada Study Permit — Key Facts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Visa Type', value: 'Canada Study Permit' },
                { label: 'Work Rights (Term)', value: '24 hrs/week. On-campus: unlimited.' },
                { label: 'Work Rights (Vacation)', value: 'Full-time during scheduled breaks' },
                { label: 'Post-Study Work', value: 'PGWP — up to 3 years' },
                { label: 'PR Pathway', value: 'Express Entry or Provincial Nominee Program' },
                { label: 'Spouse Work Permit', value: 'Open Work Permit for spouse/partner' },
              ].map(f => (
                <div key={f.label} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-brand-700 rounded-2xl p-6 text-white text-center">
            <h2 className="text-xl font-bold mb-2">
              Ready to Study in {cityData.name}?
            </h2>
            <p className="text-blue-200 text-sm mb-5">
              Our advisors have helped 500+ Indian students get admissions in {cityData.province}. Book a free 30-minute session today.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/book-counselling" className="btn-gold inline-block">
                Book Free Counselling →
              </Link>
              <Link href="/universities/country/canada" className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-colors">
                All Canada Universities
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="sticky top-20 space-y-5">
            <LeadForm source={`city-${slug}-sidebar`} defaultCountry="Canada" />

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Other Canadian Cities</h3>
              <div className="space-y-1.5">
                {(['toronto', 'vancouver', 'calgary', 'edmonton', 'ottawa', 'winnipeg', 'brampton', 'hamilton', 'kitchener', 'halifax'] as const)
                  .filter(c => c !== slug)
                  .slice(0, 8)
                  .map(c => (
                    <Link key={c} href={`/universities/city/${c}`}
                      className="block text-sm text-brand-700 hover:underline capitalize">
                      {CANADA_CITIES[c]?.name} →
                    </Link>
                  ))}
                <Link href="/universities/country/canada" className="block text-xs text-gray-500 hover:underline mt-2">
                  View all Canada universities →
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">{cityData.name} at a Glance</h3>
              {[
                ['Province', cityData.province],
                ['Living Cost', `~CAD $${cityData.costOfLiving.toLocaleString()}/month`],
                ['Institutions', unis.length ? `${unis.length} listed` : 'Coming soon'],
                ['PGWP', 'Eligible — up to 3 yrs'],
                ['PR Pathway', 'Express Entry / PNP'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-xs">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-semibold text-gray-900 text-right max-w-[55%]">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
