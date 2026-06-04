import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { visaGuides, getVisaGuideBySlug } from '@/data/visa-guides';
import { buildMetadata } from '@/lib/seo';
import LeadForm from '@/components/LeadForm';

export function generateStaticParams() {
  return visaGuides.map(g => ({ country: g.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ country: string }> }
): Promise<Metadata> {
  const { country } = await params;
  const guide = getVisaGuideBySlug(country);
  if (!guide) return {};
  return buildMetadata({
    title: guide.metaTitle,
    description: guide.metaDescription,
    path: `/visa-guide/${country}`,
    keywords: [guide.country, 'student visa', 'study abroad', 'Indian students', 'visa guide 2026'],
  });
}

export default async function VisaGuidePage(
  { params }: { params: Promise<{ country: string }> }
) {
  const { country } = await params;
  const guide = getVisaGuideBySlug(country);
  if (!guide) notFound();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-xs mb-4 flex-wrap">
            <Link href="/" className="hover:text-white">Home</Link> /
            <Link href="/visa-guide" className="hover:text-white">Visa Guides</Link> /
            <span className="text-white">{guide.country} Student Visa</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <span className="inline-block bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                Visa Guide 2026
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-3">
                {guide.flagEmoji} {guide.country} Student Visa Guide 2026
              </h1>
              <p className="text-blue-200 text-sm leading-relaxed mb-5">{guide.intro}</p>

              {/* Quick facts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Processing Time', value: guide.processingTime },
                  { label: 'Visa Fee', value: guide.visaFee },
                  { label: 'Work Rights', value: guide.workRights },
                  { label: 'Post-Study Work', value: guide.postStudyWork },
                ].map(f => (
                  <div key={f.label} className="bg-white/10 rounded-xl p-3">
                    <p className="text-blue-300 text-xs mb-1">{f.label}</p>
                    <p className="text-white text-xs font-semibold leading-snug">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lead form in hero */}
            <div className="bg-white rounded-2xl p-5">
              <LeadForm source={`visa-guide-${country}`} compact defaultCountry={guide.country} />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">

          {/* Highlights */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">✅ Key Highlights — {guide.visaName}</h2>
            <ul className="space-y-2">
              {guide.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Step by step */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-5">Step-by-Step Application Process</h2>
            <div className="space-y-4">
              {guide.steps.map(s => (
                <div key={s.step} className="flex gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-700 text-white font-bold flex items-center justify-center text-sm">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{s.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Documents Checklist</h2>
            <div className="divide-y divide-gray-50">
              {guide.documents.map((doc, i) => (
                <div key={i} className="flex items-start gap-3 py-3 first:pt-0">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-5 h-5 border-2 border-brand-400 rounded flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-brand-500 rounded-sm" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{doc.name}</p>
                    {doc.notes && <p className="text-xs text-gray-500 mt-0.5">{doc.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-5">📅 Application Timeline</h2>
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-brand-200" />
              <div className="space-y-4">
                {guide.timeline.map((t, i) => (
                  <div key={i} className="flex gap-4 ml-1">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs font-bold z-10">
                      {i + 1}
                    </div>
                    <div className="bg-white rounded-xl p-4 flex-1 border border-gray-100 shadow-sm">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-gray-900">{t.phase}</span>
                        <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium">{t.duration}</span>
                      </div>
                      <p className="text-xs text-gray-600">{t.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rejection reasons */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">⚠️ Common Rejection Reasons & How to Avoid Them</h2>
            <div className="space-y-4">
              {guide.rejectionReasons.map((r, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-red-100">
                  <p className="text-sm font-bold text-red-700 mb-1">❌ {r.reason}</p>
                  <p className="text-xs text-gray-700">✅ <span className="font-medium">How to avoid:</span> {r.howToAvoid}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gold-50 border border-gold-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🎯 Expert Tips from Jaivik Overseas Counsellors</h2>
            <ul className="space-y-3">
              {guide.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="flex-shrink-0 text-gold-600 font-bold">{i + 1}.</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful links */}
          <div className="bg-brand-50 rounded-2xl p-5 border border-brand-100">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">🔗 Useful Links</h3>
            <div className="flex flex-wrap gap-2">
              {guide.relatedLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm bg-white border border-brand-200 text-brand-700 px-4 py-2 rounded-xl hover:bg-brand-700 hover:text-white transition-all font-medium"
                >
                  {link.label} →
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="sticky top-20 space-y-5">
            <LeadForm source={`visa-sidebar-${country}`} defaultCountry={guide.country} />

            <div className="bg-brand-700 text-white rounded-2xl p-5">
              <p className="font-bold mb-2 text-sm">📞 Get Visa Help Now</p>
              <p className="text-blue-200 text-xs mb-4">Our visa experts have processed 500+ {guide.country} applications. Book a free 30-min review of your documents.</p>
              <Link href="/book-counselling" className="block text-center bg-gold-500 hover:bg-gold-600 text-white text-sm font-bold py-2.5 px-4 rounded-xl transition-colors">
                Book Free Session →
              </Link>
              <a href="https://wa.me/919971226347" target="_blank" rel="noopener noreferrer"
                className="block text-center mt-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2.5 px-4 rounded-xl transition-colors">
                💬 WhatsApp Us
              </a>
              <a href="tel:+919971226347" className="block text-center mt-2 text-blue-200 hover:text-white text-xs font-medium transition-colors">
                📞 +91 99712 26347
              </a>
            </div>

            {/* Other visa guides */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Other Visa Guides</h3>
              {visaGuides.filter(g => g.slug !== country).map(g => (
                <Link key={g.slug} href={`/visa-guide/${g.slug}`}
                  className="flex items-center gap-2 py-2.5 border-b border-gray-50 last:border-0 group">
                  <span className="text-lg">{g.flagEmoji}</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 group-hover:text-brand-700">{g.country} Student Visa</p>
                    <p className="text-xs text-gray-400">{g.processingTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
