import type { Metadata } from 'next';
import Link from 'next/link';
import { visaGuides } from '@/data/visa-guides';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Student Visa Guides 2026 for Indian Students | Jaivik Overseas',
  description: 'Complete student visa guides for Indian students in 2026. Canada, UK, Australia, Germany, and USA — step-by-step process, documents, timelines, and expert tips.',
  path: '/visa-guide',
  keywords: ['student visa guide', 'study abroad visa 2026', 'canada student visa', 'uk student visa', 'australia student visa', 'germany student visa'],
});

export default function VisaGuideIndexPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Visa Guides 2026
          </span>
          <h1 className="text-3xl font-bold mb-3">Student Visa Guides for Indian Students</h1>
          <p className="text-blue-200 text-sm leading-relaxed">
            Step-by-step visa guides for every major study destination — documents, timelines, rejection reasons, and expert tips from our counsellors who have processed 500+ applications.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visaGuides.map(guide => (
            <Link
              key={guide.slug}
              href={`/visa-guide/${guide.slug}`}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-200 transition-all group"
            >
              <div className="text-4xl mb-3">{guide.flagEmoji}</div>
              <h2 className="text-base font-bold text-gray-900 group-hover:text-brand-700 mb-1">
                {guide.country} Student Visa
              </h2>
              <p className="text-xs text-gray-500 mb-4">{guide.visaName}</p>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Processing</span>
                  <span className="font-medium text-gray-800">{guide.processingTime.split('/')[0].trim()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Fee</span>
                  <span className="font-medium text-gray-800">{guide.visaFee.split('(')[0].trim()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Post-study work</span>
                  <span className="font-medium text-gray-800">{guide.postStudyWork.split(':')[0]}</span>
                </div>
              </div>

              <div className="mt-4 text-xs font-semibold text-brand-700 group-hover:text-brand-900">
                Read Full Guide →
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-brand-50 rounded-2xl p-8 text-center border border-brand-100">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Not Sure Which Visa You Need?</h2>
          <p className="text-sm text-gray-600 mb-5 max-w-xl mx-auto">
            Our counsellors have helped 500+ Indian students navigate visa applications for Canada, UK, Australia, Germany and USA. Get a free 30-minute consultation.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/book-counselling"
              className="bg-brand-700 hover:bg-brand-800 text-white text-sm font-bold py-3 px-8 rounded-xl transition-colors">
              Book Free Counselling
            </Link>
            <a href="https://wa.me/919971226347" target="_blank" rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-3 px-8 rounded-xl transition-colors">
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
