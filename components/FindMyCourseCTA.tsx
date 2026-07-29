import Link from 'next/link';

interface FindMyCourseCTAProps {
  /** Contextual headline pulling in the page's own topic, e.g. "Not sure which UK university fits YOUR profile & budget?" */
  headline: string;
}

// Server component (no client state needed) -- a lightweight funnel into
// /find-my-course, distinct from WhatsAppLeadCTA: that one captures a
// direct lead, this one routes into the real-data matching engine.
export default function FindMyCourseCTA({ headline }: FindMyCourseCTAProps) {
  return (
    <div className="bg-white border-2 border-gold-500 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
      <div>
        <p className="font-bold text-gray-900">{headline}</p>
        <p className="text-xs text-gray-500 mt-1">Enter your profile — see real universities that actually fit. Free.</p>
      </div>
      <Link href="/find-my-course" className="btn-gold whitespace-nowrap flex-shrink-0">
        🎯 Find My Course →
      </Link>
    </div>
  );
}
