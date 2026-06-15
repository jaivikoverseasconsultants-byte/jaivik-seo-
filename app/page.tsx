import Link from 'next/link';
import Image from 'next/image';
import { universities } from '@/data/universities';
import { courses } from '@/data/courses';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';
import HeroSearch from '@/components/HeroSearch';
import SuccessStories from '@/components/SuccessStories';
import { fetchUnsplashImage, COUNTRY_QUERIES, type UnsplashImage } from '@/lib/unsplash';

const countryFlags: Record<string, string> = {
  USA: '🇺🇸', UK: '🇬🇧', Canada: '🇨🇦', Australia: '🇦🇺',
  Germany: '🇩🇪', Ireland: '🇮🇪', Singapore: '🇸🇬', 'New Zealand': '🇳🇿',
  France: '🇫🇷', Netherlands: '🇳🇱', Sweden: '🇸🇪', UAE: '🇦🇪',
  Denmark: '🇩🇰', Italy: '🇮🇹', Spain: '🇪🇸',
};

const destinations = [
  'USA', 'UK', 'Canada', 'Australia', 'Germany', 'Ireland', 'Singapore', 'New Zealand',
  'France', 'Netherlands', 'Sweden', 'UAE', 'Denmark', 'Italy', 'Spain',
];

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Jaivik Overseas Consultants',
  description: 'Trusted study abroad consultancy helping Indian students get admissions in top universities globally.',
  url: 'https://study.jaivikoverseasconsultants.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '333 Orbit Plaza, Crossing Republik',
    addressLocality: 'Ghaziabad',
    addressRegion: 'Uttar Pradesh',
    postalCode: '201016',
    addressCountry: 'IN',
  },
  telephone: ['+91-9971226347', '+91-9971881347', '+91-7428222100', '0120-4115882'],
  email: 'info@jaivikoverseasconsultants.com',
  areaServed: 'IN',
};

export default async function HomePage() {
  const featuredUniversities = universities.filter(u => u.popularAmongIndians).slice(0, 6);
  const featuredCourses = courses.slice(0, 6);

  // Fetch destination + university images in parallel at build time
  const [destinationImages, universityImages] = await Promise.all([
    Promise.all(
      destinations.map(c => fetchUnsplashImage(COUNTRY_QUERIES[c] ?? `${c} university campus`))
    ),
    Promise.all(
      featuredUniversities.map(u => fetchUnsplashImage(`${u.shortName} university campus`))
    ),
  ]);
  const destImgMap: Record<string, UnsplashImage | null> = Object.fromEntries(
    destinations.map((c, i) => [c, destinationImages[i]])
  );
  const uniImgMap: Record<string, UnsplashImage | null> = Object.fromEntries(
    featuredUniversities.map((u, i) => [u.id, universityImages[i]])
  );

  return (
    <>
      <JsonLd data={orgSchema} />

      {/* Hero */}
      <section className="relative bg-brand-900 text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-700/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-24 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left: Copy + Search */}
            <div>
              <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                ⭐ India&apos;s Trusted Study Abroad Consultancy · Since 2012
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Study Abroad from India —{' '}
                <span className="text-gold-400">Your Dream University</span>{' '}
                is One Step Away
              </h1>
              <p className="text-blue-200 text-lg mb-7 leading-relaxed">
                Jaivik Overseas Consultants has helped <span className="text-white font-semibold">500+ students</span> from across India get admissions in top universities in USA, UK, Canada, Australia, Germany &amp; Singapore.
              </p>

              {/* Search bar */}
              <div className="mb-7">
                <HeroSearch />
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Link href="/find-my-course" className="btn-gold">
                  🎯 Find My Course →
                </Link>
                <Link href="/book-counselling" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-colors border border-white/20">
                  Book Free Counselling
                </Link>
              </div>
            </div>

            {/* Right: 5 feature cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '📅', stat: '13+', label: 'Years Experience', color: 'from-blue-600/30 to-blue-700/20' },
                { icon: '🎓', stat: '500+', label: 'Students Placed', color: 'from-purple-600/30 to-purple-700/20' },
                { icon: '✅', stat: '99%', label: 'Visa Success Rate', color: 'from-green-600/30 to-green-700/20' },
                { icon: '📚', stat: '5,400+', label: 'Courses Listed', color: 'from-orange-500/30 to-orange-600/20' },
              ].map(card => (
                <div key={card.label} className={`bg-gradient-to-br ${card.color} border border-white/10 rounded-2xl p-5 backdrop-blur-sm`}>
                  <div className="text-3xl mb-2">{card.icon}</div>
                  <p className="text-2xl font-bold text-white">{card.stat}</p>
                  <p className="text-blue-200 text-sm mt-0.5">{card.label}</p>
                </div>
              ))}
              {/* Wide card: Free Counselling */}
              <div className="col-span-2 bg-gradient-to-r from-gold-500/25 to-gold-600/15 border border-gold-500/30 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-lg">🆓 Free Counselling</p>
                  <p className="text-blue-200 text-sm">30-min 1-on-1 expert session — no cost, no obligation</p>
                </div>
                <Link href="/book-counselling" className="bg-gold-500 hover:bg-gold-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors whitespace-nowrap ml-4">
                  Book Now →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { stat: '13+', label: 'Years Experience' },
              { stat: '500+', label: 'Students Placed' },
              { stat: '99%', label: 'Visa Success Rate' },
              { stat: '5,400+', label: 'Courses Listed' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-brand-700">{s.stat}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <SuccessStories />

      {/* Destinations */}
      <section className="py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Study Abroad Destinations</h2>
            <p className="text-gray-500">Explore top study destinations from India</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {destinations.map(country => {
              const img = destImgMap[country];
              return (
                <Link key={country} href={`/universities/country/${country.toLowerCase().replace(' ', '-')}`}
                  className="relative overflow-hidden rounded-2xl h-40 shadow-sm hover:shadow-lg transition-all group">
                  {img ? (
                    <Image
                      src={img.url}
                      alt={`Study in ${country}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-700 to-brand-900" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span className="text-xl">{countryFlags[country] || '🌍'}</span>
                    <p className="text-white font-semibold text-sm leading-tight">Study in {country}</p>
                    <p className="text-white/70 text-xs mt-0.5">
                      {universities.filter(u => u.country === country).length} universities
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Universities */}
      <section className="bg-white py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Top Universities for Indian Students</h2>
              <p className="text-gray-500 mt-1">Most popular among students from India</p>
            </div>
            <Link href="/universities" className="text-brand-700 font-semibold text-sm hover:underline hidden md:block">
              View All Universities →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredUniversities.map(u => {
              const img = uniImgMap[u.id];
              return (
                <Link key={u.id} href={`/universities/${u.slug}`}
                  className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all group">
                  {/* Campus thumbnail */}
                  <div className="relative h-36 overflow-hidden">
                    {img ? (
                      <Image
                        src={img.thumb}
                        alt={`${u.name} campus`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-700 to-brand-800 flex items-center justify-center">
                        <span className="text-white/40 text-4xl font-bold">{u.shortName.slice(0, 2)}</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className="badge bg-gold-500 text-white text-xs">#{u.qsRanking} QS</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-gray-900 group-hover:text-brand-700 mb-0.5">{u.shortName}</p>
                    <p className="text-xs text-gray-500 mb-3">{u.city}, {u.country}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white rounded-lg p-2 text-center">
                        <p className="font-bold text-brand-700">${(u.annualTuitionUSD / 1000).toFixed(0)}K/yr</p>
                        <p className="text-gray-400">Tuition</p>
                      </div>
                      <div className="bg-white rounded-lg p-2 text-center">
                        <p className="font-bold text-green-600">{u.visaApprovalRate}%</p>
                        <p className="text-gray-400">Visa Success</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {u.intakeMonths.map(m => (
                        <span key={m} className="text-xs bg-gold-50 text-gold-700 px-2 py-0.5 rounded-full">{m}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <Link href="/universities" className="btn-primary w-full text-center block mt-6 md:hidden">
            View All Universities
          </Link>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Popular Courses Abroad</h2>
              <p className="text-gray-500 mt-1">Highest ROI programs for Indian students</p>
            </div>
            <Link href="/courses" className="text-brand-700 font-semibold text-sm hover:underline hidden md:block">
              View All Courses →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredCourses.map(c => (
              <Link key={c.id} href={`/courses/${c.slug}`}
                className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 group-hover:text-brand-700 text-sm">{c.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{c.category}</p>
                  </div>
                  <span className={`badge text-xs ml-2 ${c.demandLevel === 'Very High' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {c.demandLevel} Demand
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="font-bold text-brand-700">${(c.avgFeesUSD / 1000).toFixed(0)}K</p>
                    <p className="text-gray-400">Avg Fees</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="font-bold text-green-600">{c.roi.jobGrowthRate}%</p>
                    <p className="text-gray-400">Job Growth</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{c.duration} · {c.level}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-700 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">Ready to Study Abroad?</h2>
          <p className="text-blue-200 mb-6">Book a free 30-minute counselling session with our expert advisors. We&apos;ll help you choose the right university, course, and visa pathway.</p>
          <Link href="/book-counselling" className="btn-gold inline-block">
            Book Free Counselling →
          </Link>
        </div>
      </section>
    </>
  );
}
