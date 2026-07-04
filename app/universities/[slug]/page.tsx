import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { universities, getUniversityBySlug } from '@/data/universities';
import { universityWebsites } from '@/data/university-websites';
import { getCoursesBySlug } from '@/data/university-course-registry';
import LeadForm from '@/components/LeadForm';
import JsonLd from '@/components/JsonLd';
import { buildMetadata, formatINR, formatUSD } from '@/lib/seo';
import { fetchUnsplashImage, fetchUnsplashImages } from '@/lib/unsplash';
import { generateUniversityAbout, generateWhyIndianStudents, generateApplicationProcess, generateNotableAlumni } from '@/lib/content-gen';

const FeesChart = dynamic(() => import('@/components/charts/FeesChart'), { ssr: false });
const RankingChart = dynamic(() => import('@/components/charts/RankingChart'), { ssr: false });
const UniversityCoursesSection = dynamic(() => import('@/components/UniversityCoursesSection'), { ssr: false });
const UniversityLeadCapture = dynamic(() => import('@/components/UniversityLeadCapture'), { ssr: false });

export async function generateStaticParams() {
  return universities.map(u => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const u = getUniversityBySlug(slug);
  if (!u) return {} as Metadata;
  return buildMetadata({
    title: `${u.name} | Fees, Rankings, Courses & Admissions 2026`,
    description: `${u.name} (${u.shortName}) – QS Rank #${u.qsRanking}. Annual tuition ${formatUSD(u.annualTuitionUSD)} (${formatINR(u.annualTuitionINR)}). Visa approval rate ${u.visaApprovalRate}%. Intake: ${u.intakeMonths.join(', ')}. Get free admission guidance from Jaivik Overseas Consultants.`,
    path: `/universities/${slug}`,
    keywords: [u.name, u.shortName, u.country, 'university fees', 'study abroad', 'admissions 2026'],
  });
}

export default async function UniversityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = getUniversityBySlug(slug);
  if (!found) notFound();
  const u = found;
  const officialWebsite = u.website || universityWebsites[u.slug];
  const uniCourses = getCoursesBySlug(u.slug);

  const [campusImage, galleryImages] = await Promise.all([
    fetchUnsplashImage(`${u.shortName} university campus`),
    fetchUnsplashImages(`${u.city} university campus student life`, 5),
  ]);

  // Pre-generate rich prose content for SEO (300+ words per page)
  const aboutText = generateUniversityAbout(u);
  const whyIndianText = generateWhyIndianStudents(u);
  const appProcess = generateApplicationProcess(u);
  const alumniText = generateNotableAlumni(u);

  const collegeSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: u.name,
    url: `https://jaivikoverseasconsultants.com/universities/${u.slug}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: u.city,
      addressRegion: u.state,
      addressCountry: u.countryCode,
    },
    foundingDate: String(u.establishedYear),
    description: u.description,
    numberOfStudents: u.totalStudents,
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the tuition fee at ${u.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Annual tuition at ${u.name} is ${formatUSD(u.annualTuitionUSD)} (approximately ${formatINR(u.annualTuitionINR)}) for international students.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the QS ranking of ${u.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${u.name} is ranked #${u.qsRanking} in the QS World University Rankings 2026.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the visa approval rate for ${u.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The student visa approval rate for ${u.country} is approximately ${u.visaApprovalRate}% for Indian students with strong academic profiles.`,
        },
      },
      {
        '@type': 'Question',
        name: `What intake does ${u.name} offer?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${u.name} offers intake in ${u.intakeMonths.join(' and ')} each year.`,
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={collegeSchema} />
      <JsonLd data={faqSchema} />

      {/* Hero */}
      <section className="relative text-white py-10 px-4 overflow-hidden">
        {campusImage ? (
          <>
            <Image
              src={campusImage.url}
              alt={`${u.name} campus`}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-brand-900/80" />
            {campusImage.credit && (
              <a
                href={campusImage.credit.link}
                target="_blank"
                rel="noopener noreferrer"
                className="sr-only"
              >
                Photo by {campusImage.credit.name} on Unsplash
              </a>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-700 to-brand-900" />
        )}
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-3">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/universities" className="hover:text-white">Universities</Link> /
            <span>{u.shortName}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="badge bg-gold-500 text-white">QS #{u.qsRanking}</span>
                <span className="badge bg-white/20 text-white">{u.country}</span>
                <span className="badge bg-white/20 text-white">Est. {u.establishedYear}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{u.name}</h1>
              <p className="text-blue-200 text-lg mb-4">{u.city}, {u.state}, {u.country}</p>
              <p className="text-blue-100 leading-relaxed mb-5 max-w-2xl">{u.description}</p>
              <div className="flex flex-wrap gap-2">
                {u.highlights.map(h => (
                  <span key={h} className="text-xs bg-white/10 text-white px-3 py-1.5 rounded-full">✓ {h}</span>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {officialWebsite && (
                  <a
                    href={officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-white/40 text-white hover:bg-white/10 text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                  >
                    Official University Website →
                  </a>
                )}
                <a
                  href={`https://wa.me/919971226347?text=${encodeURIComponent(`Hi Jaivik Overseas, I want to know about studying at ${u.name}. Please help me with admission and visa process.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4 fill-white flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Ask About Admissions
                </a>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source={`university-${u.slug}`} defaultCourse={u.popularCourses[0]} defaultCountry={u.country} compact />
            </div>
          </div>
        </div>
      </section>

      {/* Lead capture for universities with few course pages */}
      {uniCourses.length < 50 && (
        <UniversityLeadCapture universityName={u.name} />
      )}

      {/* Key Stats */}
      <section className="bg-white border-b border-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="stat-card col-span-1">
              <p className="text-2xl font-bold text-brand-700">${(u.annualTuitionUSD / 1000).toFixed(0)}K</p>
              <p className="text-xs text-gray-500 mt-1">Annual Tuition</p>
              <p className="text-xs text-gray-400">{formatINR(u.annualTuitionINR)}</p>
            </div>
            <div className="stat-card">
              <p className="text-2xl font-bold text-green-600">{u.visaApprovalRate}%</p>
              <p className="text-xs text-gray-500 mt-1">Visa Success</p>
            </div>
            <div className="stat-card">
              <p className="text-2xl font-bold text-brand-700">{u.acceptanceRate}%</p>
              <p className="text-xs text-gray-500 mt-1">Acceptance Rate</p>
            </div>
            <div className="stat-card">
              <p className="text-2xl font-bold text-purple-600">#{u.qsRanking}</p>
              <p className="text-xs text-gray-500 mt-1">QS Ranking</p>
            </div>
            <div className="stat-card">
              <p className="text-2xl font-bold text-orange-500">{u.employmentRate}%</p>
              <p className="text-xs text-gray-500 mt-1">Employment Rate</p>
            </div>
            <div className="stat-card">
              <p className="text-2xl font-bold text-brand-700">${(u.avgSalaryUSD / 1000).toFixed(0)}K</p>
              <p className="text-xs text-gray-500 mt-1">Avg Grad Salary</p>
            </div>
            <div className="stat-card">
              <p className="text-sm font-bold text-gray-800">{u.intakeMonths.join(', ')}</p>
              <p className="text-xs text-gray-500 mt-1">Intake</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Main content */}
          <div className="lg:col-span-2 space-y-8">

            {/* ── ABOUT (SEO: 300+ word prose, unique per university) ── */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="section-title">About {u.name}</h2>
              <div className="prose prose-sm max-w-none text-gray-700 mt-4 space-y-4">
                {aboutText.split('\n\n').map((para, i) => (
                  <p key={i} className="leading-relaxed">{para}</p>
                ))}
              </div>
            </div>

            {/* ── WHY INDIAN STUDENTS CHOOSE ── */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="section-title">Why Indian Students Choose {u.shortName}</h2>
              <div className="mt-4 space-y-4">
                {whyIndianText.split('\n\n').map((block, i) => {
                  if (block.startsWith('**') && block.includes(':**')) {
                    const [titlePart, ...rest] = block.split(':**');
                    const title = titlePart.replace(/\*\*/g, '');
                    return (
                      <div key={i} className="flex items-start gap-3 p-4 bg-brand-50 rounded-xl">
                        <span className="text-brand-600 font-bold text-lg flex-shrink-0">✓</span>
                        <div>
                          <p className="font-bold text-brand-800 text-sm">{title}</p>
                          <p className="text-gray-600 text-sm mt-1 leading-relaxed">{rest.join(':**').replace(/\*\*/g, '')}</p>
                        </div>
                      </div>
                    );
                  }
                  return <p key={i} className="text-gray-700 text-sm leading-relaxed">{block}</p>;
                })}
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FeesChart data={u.feeHistory} />
              <RankingChart data={u.rankingHistory} />
            </div>

            {/* Fees Breakdown */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="section-title">Complete Cost Breakdown for Indian Students</h2>
              <p className="text-gray-500 text-sm mb-5">Annual cost of studying at {u.shortName} (2026–27)</p>
              <div className="space-y-3">
                {[
                  { label: 'Annual Tuition Fee', usd: u.annualTuitionUSD, inr: u.annualTuitionINR },
                  { label: 'Living Cost (Accommodation + Food)', usd: u.livingCostUSD, inr: u.livingCostINR },
                  { label: 'Application Fee (one-time)', usd: u.applicationFeeUSD, inr: u.applicationFeeUSD * 84 },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-50">
                    <span className="text-sm text-gray-700">{item.label}</span>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatUSD(item.usd)}</p>
                      <p className="text-xs text-gray-400">{formatINR(item.inr)}</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between py-3 bg-brand-50 rounded-xl px-3">
                  <span className="text-sm font-bold text-brand-900">Total Annual Cost</span>
                  <div className="text-right">
                    <p className="font-bold text-brand-700">{formatUSD(u.annualTuitionUSD + u.livingCostUSD)}</p>
                    <p className="text-xs text-brand-500">{formatINR(u.annualTuitionINR + u.livingCostINR)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="section-title">Admission Requirements</h2>
              <p className="text-gray-500 text-sm mb-5">Minimum eligibility for Indian students at {u.shortName}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'IELTS Score', value: `${u.requirements.ieltsMin}+` },
                  { label: 'TOEFL Score', value: `${u.requirements.toeflMin}+` },
                  { label: 'GRE Score', value: u.requirements.greMin ? `${u.requirements.greMin}+` : 'Not required' },
                  { label: 'GMAT Score', value: u.requirements.gmatMin ? `${u.requirements.gmatMin}+` : 'Not required' },
                  { label: 'Min GPA (10pt)', value: `${u.requirements.gpaMin}/10` },
                  { label: 'Backlogs Allowed', value: u.requirements.backlogs === 0 ? 'None (clean record)' : `Up to ${u.requirements.backlogs}` },
                ].map(req => (
                  <div key={req.label} className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-lg font-bold text-brand-700">{req.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{req.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Campus Info */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="section-title">Campus & Location</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-xs text-blue-600 font-medium mb-1">📍 Main Campus Location</p>
                  <p className="font-bold text-gray-900">{u.city}</p>
                  <p className="text-sm text-gray-600">{u.state}, {u.country}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-xs text-green-600 font-medium mb-1">🏛️ Campus Type</p>
                  <p className="font-bold text-gray-900">{u.campusType}</p>
                  <p className="text-sm text-gray-600">
                    {u.campusType === 'Urban' ? 'City-centre location, great transport links' :
                     u.campusType === 'Suburban' ? 'Residential area, quieter campus life' :
                     'Green campus with spacious grounds'}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="text-xs text-purple-600 font-medium mb-1">👥 Total Students</p>
                  <p className="font-bold text-gray-900">{u.totalStudents.toLocaleString()}+</p>
                  <p className="text-sm text-gray-600">{u.internationalStudentPercent}% international students</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl">
                  <p className="text-xs text-orange-600 font-medium mb-1">🌍 International Community</p>
                  <p className="font-bold text-gray-900">{Math.round(u.totalStudents * u.internationalStudentPercent / 100).toLocaleString()}+</p>
                  <p className="text-sm text-gray-600">international students on campus</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-800 mb-3">Campus Facilities</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    '🏠 On-campus Accommodation',
                    '📚 Research Libraries',
                    '🏋️ Sports & Recreation Centre',
                    '🖥️ Computer Labs & Co-working',
                    '🍽️ International Dining Options',
                    '🤝 International Student Office',
                    '🏥 Student Health Services',
                    '🎓 Career & Placement Centre',
                    u.campusType === 'Urban' ? '🚇 Near Public Transport' : '🚌 Campus Shuttle Service',
                  ].map((facility, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-700 bg-gray-50 rounded-lg px-2.5 py-2">
                      {facility}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Campus Life Gallery */}
            {galleryImages.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="section-title">Campus Life at {u.shortName}</h2>
                <p className="text-gray-500 text-sm mb-4">A glimpse of student life at {u.name}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {galleryImages.map((img, i) => (
                    <div key={i} className={`relative overflow-hidden rounded-xl ${i === 0 ? 'col-span-2 row-span-2 h-52' : 'h-28'}`}>
                      <Image
                        src={img.thumb}
                        alt={img.alt || `${u.name} campus`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
                      {i === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                          <p className="text-white text-xs font-medium">{u.name}</p>
                          <p className="text-white/70 text-xs">{u.city}, {u.country}</p>
                        </div>
                      )}
                      {img.credit && (
                        <a
                          href={img.credit.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-1 right-1 bg-black/40 text-white/70 text-xs px-1.5 py-0.5 rounded-full hover:text-white transition-colors"
                        >
                          📸
                        </a>
                      )}
                    </div>
                  ))}
                </div>
                {/* Google Maps Embed */}
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-800 mb-2">📍 Campus Location</p>
                  <div className="rounded-xl overflow-hidden border border-gray-100 h-48">
                    <iframe
                      title={`${u.name} campus map`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(u.name + ' ' + u.city + ' ' + u.country)}&output=embed&z=14`}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {u.name} · {u.city}, {u.state}, {u.country}
                  </p>
                </div>
              </div>
            )}

            {/* Courses Offered */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="section-title">Courses Offered at {u.shortName}</h2>
                <Link
                  href={`/universities/${u.slug}/courses`}
                  className="text-xs text-brand-700 font-semibold hover:text-brand-900 underline"
                >
                  View All Courses →
                </Link>
              </div>
              <UniversityCoursesSection
                courses={uniCourses.length > 0 ? uniCourses : undefined}
                popularCourses={u.popularCourses}
                uniSlug={u.slug}
                uniName={u.shortName}
                annualTuitionUSD={u.annualTuitionUSD}
                ieltsMin={u.requirements.ieltsMin}
              />
            </div>

            {/* Scholarships */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="section-title">Scholarships for Indian Students</h2>
              <div className="space-y-4 mt-4">
                {u.scholarships.map(s => (
                  <div key={s.name} className="p-4 border border-gold-200 bg-gold-50 rounded-xl">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{s.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{s.eligibility}</p>
                      </div>
                      <span className="text-gold-700 font-bold text-sm whitespace-nowrap">{s.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Employers */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="section-title">Top Employers of {u.shortName} Graduates</h2>
              <div className="flex flex-wrap gap-3 mt-4">
                {u.topEmployers.map(emp => (
                  <span key={emp} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">{emp}</span>
                ))}
              </div>
            </div>

            {/* ── NOTABLE ALUMNI ── */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="section-title">Alumni Network & Career Impact</h2>
              <p className="text-gray-700 text-sm leading-relaxed mt-3">{alumniText}</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { label: 'Graduate Salary', value: `$${(u.avgSalaryUSD / 1000).toFixed(0)}K/yr` },
                  { label: 'Employment Rate', value: `${u.employmentRate}%` },
                  { label: 'Top Employer', value: u.topEmployers[0] },
                ].map(stat => (
                  <div key={stat.label} className="bg-brand-50 rounded-xl p-3 text-center">
                    <p className="font-bold text-brand-700 text-sm">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── APPLICATION PROCESS ── */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="section-title">How to Apply to {u.shortName} from India</h2>
              <p className="text-gray-500 text-sm mb-5">Step-by-step application guide for Indian students</p>
              <div className="space-y-4">
                {appProcess.steps.map(step => (
                  <div key={step.step} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {step.step}
                    </div>
                    <div className="flex-1 pb-4 border-b border-gray-50 last:border-0">
                      <p className="font-semibold text-gray-900 text-sm">{step.title}</p>
                      <p className="text-gray-600 text-sm mt-0.5 leading-relaxed">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-gold-50 border border-gold-200 rounded-xl p-4">
                <p className="text-gold-800 text-sm font-medium">💡 {appProcess.note}</p>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="section-title">Frequently Asked Questions</h2>
              <div className="space-y-5 mt-4">
                {[
                  {
                    q: `What is the tuition fee at ${u.name}?`,
                    a: `Annual tuition at ${u.name} is ${formatUSD(u.annualTuitionUSD)} (approximately ${formatINR(u.annualTuitionINR)}) for international students in 2026–26. This does not include living expenses of approximately ${formatUSD(u.livingCostUSD)}/year.`,
                  },
                  {
                    q: `What is the acceptance rate at ${u.shortName}?`,
                    a: `${u.name} has an acceptance rate of approximately ${u.acceptanceRate}% for international students. Indian students with strong GRE/GMAT scores and GPA above ${u.requirements.gpaMin}/10 have a higher chance of admission.`,
                  },
                  {
                    q: `What are the IELTS requirements for ${u.shortName}?`,
                    a: `${u.name} requires a minimum IELTS score of ${u.requirements.ieltsMin} overall. TOEFL iBT minimum is ${u.requirements.toeflMin}.`,
                  },
                  {
                    q: `When is the application deadline for ${u.shortName}?`,
                    a: `${u.name} has intake in ${u.intakeMonths.join(' and ')}. Application deadlines are typically 3–6 months before the intake. Contact Jaivik Overseas Consultants for exact deadlines and application support.`,
                  },
                ].map((faq) => (
                  <div key={faq.q} className="border-b border-gray-50 pb-4">
                    <p className="font-semibold text-gray-900 text-sm mb-1">Q: {faq.q}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-20">
              <div className="bg-brand-50 rounded-2xl p-5 border border-brand-100">
                <h3 className="font-semibold text-brand-900 mb-3 text-sm">Quick Facts</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'Founded', value: u.establishedYear },
                    { label: 'Total Students', value: u.totalStudents.toLocaleString() },
                    { label: 'International %', value: `${u.internationalStudentPercent}%` },
                    { label: 'Campus Type', value: u.campusType },
                    { label: 'Avg Salary (Grad)', value: formatUSD(u.avgSalaryUSD) },
                  ].map(f => (
                    <div key={f.label} className="flex justify-between">
                      <span className="text-gray-600">{f.label}</span>
                      <span className="font-medium text-gray-900">{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Average Graduate Salary */}
      {u.avgSalaryUSD > 0 && (
        <section className="bg-white py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="section-title mb-5">Average Graduate Salary After {u.shortName}</h2>
            <div className="max-w-xl">
              <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-brand-700">${(u.avgSalaryUSD / 1000).toFixed(0)}K/year</p>
                  <p className="text-sm text-gray-600 mt-1">Average graduate salary in {u.country}</p>
                  <p className="text-xs text-gray-400 mt-1">Employment Rate: {u.employmentRate}%</p>
                </div>
                <div className="text-6xl">💼</div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
