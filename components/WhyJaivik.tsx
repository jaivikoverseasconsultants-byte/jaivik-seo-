import Link from 'next/link';

/**
 * The counsellor credentials + office pitch, in ONE site-wide place.
 *
 * This copy used to be inlined into `CourseRichContent`, so every course page
 * repeated the same "13 years experience / 99% visa success" paragraph, the
 * Ghaziabad office address, and the CAS-management line. Measured across a
 * 1,321-page sample it accounted for ~5.3% of all course-page body text and was
 * byte-identical on every one of them — pure duplicate content, and the footer
 * already carried the same address site-wide.
 *
 * Rendered once from the root layout (inside the footer), so it still reaches
 * every page without being counted as page content on any of them.
 */
export default function WhyJaivik() {
  return (
    <div className="border-t border-blue-800 pt-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <p className="text-white font-semibold text-sm">Why Jaivik Overseas Consultants</p>
          <p className="text-blue-200 text-xs mt-1 leading-relaxed">
            13 years guiding Indian students · 99% visa success rate · end-to-end support with
            admissions, CAS/LOA management, visa compliance and pre-departure orientation.
          </p>
        </div>
        <Link
          href="/book-counselling"
          className="flex-shrink-0 text-xs font-semibold text-white bg-brand-700 hover:bg-brand-600 px-4 py-2 rounded-full transition-colors"
        >
          Book Free Counselling →
        </Link>
      </div>
    </div>
  );
}
