import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Use | Jaivik Overseas Consultants',
  description: 'Terms of use, data policy, and intellectual property notice for Jaivik Overseas Consultants study abroad portal.',
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Use</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: June 2026</p>

      <div className="prose prose-gray max-w-none space-y-10 text-gray-700 text-sm leading-relaxed">

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the website at{' '}
            <span className="font-medium">study.jaivikoverseasconsultants.com</span> (the
            &ldquo;Portal&rdquo;), you agree to be bound by these Terms of Use. If you do not
            agree, please discontinue use immediately.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. About Jaivik Overseas Consultants</h2>
          <p>
            Jaivik Overseas Consultants (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is
            a registered study abroad consultancy based in Ghaziabad, Uttar Pradesh, India. We help
            Indian students with university shortlisting, application support, visa guidance, and
            pre-departure orientation.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Intellectual Property &amp; Data Ownership</h2>
          <p>
            All course listings, university profiles, fee data, intake calendars, and ranking
            information published on this Portal have been <strong>independently curated in-house</strong> by
            Jaivik Overseas Consultants through proprietary research, public disclosures from
            institutions, and verified third-party sources.
          </p>
          <p className="mt-3">
            This content is protected under applicable Indian and international copyright law. You
            may not copy, reproduce, redistribute, scrape, or commercially exploit any part of this
            Portal without our prior written permission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Accuracy of Information</h2>
          <p>
            We strive to keep all fee, intake, and eligibility data current; however, university
            policies change frequently. All information on this Portal is provided for general
            guidance only and does <strong>not</strong> constitute a guarantee of admission,
            scholarship, or visa approval. Always verify critical details directly with the
            institution before applying.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Use of the Portal</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>You must be at least 16 years old to submit any enquiry form.</li>
            <li>You agree not to use automated tools, bots, or scrapers to extract data from this Portal.</li>
            <li>You agree not to impersonate any person or misrepresent your affiliation.</li>
            <li>We reserve the right to block access to any user or IP that violates these terms.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Counselling &amp; Advisory Services</h2>
          <p>
            Enquiries submitted via any form on this Portal constitute a request for advisory
            services. Our counsellors will contact you using the details provided. Jaivik Overseas
            Consultants is not responsible for outcomes arising from decisions made without
            completing the full counselling process.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6A. Visa Outcome Disclaimer</h2>
          <p>
            Jaivik Overseas Consultants assists students in preparing student visa applications
            but does <strong>not guarantee visa approval</strong>. Visa decisions are made exclusively
            by the immigration authorities of the destination country. Our stated visa success rate
            reflects historical outcomes for students we have assisted and is not a guarantee of
            future results. Students with prior visa refusals, complex immigration histories, or
            incomplete documentation may have different outcomes. We are not liable for visa
            refusals, delays, or additional requirements imposed by immigration authorities.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6B. Service Fees — Non-Refundable Policy</h2>
          <p>
            Service fees charged by Jaivik Overseas Consultants for counselling, application
            assistance, SOP writing, visa documentation support, and pre-departure orientation
            are <strong>non-refundable</strong> once the respective service has been delivered. Specific
            fee structures are communicated in writing and must be agreed upon before commencement
            of services. University application fees, visa application fees, exam fees, and other
            third-party charges are separate and borne directly by the student.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6C. Third-Party University Policies</h2>
          <p>
            Universities listed on this Portal are independent institutions with their own
            admission policies, fee structures, scholarship criteria, and intake schedules. These
            may change without notice. Jaivik Overseas Consultants is not affiliated with, endorsed
            by, or acting as an official agent of any university unless expressly stated in writing.
            Students must verify all admission and fee details directly with the institution before
            making any financial commitment.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Privacy</h2>
          <p>
            Personal data collected through forms is used solely to provide counselling services
            and improve the Portal. We do not sell your data to third parties. By submitting a
            form, you consent to being contacted by our team via phone, email, or WhatsApp.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Third-Party Links</h2>
          <p>
            The Portal may link to external university websites. We are not responsible for the
            content, accuracy, or privacy practices of those sites.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Jaivik Overseas Consultants shall not be
            liable for any direct, indirect, incidental, or consequential loss arising from your
            use of this Portal or reliance on any information contained herein.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Governing Law</h2>
          <p>
            These terms are governed by the laws of India. Any disputes shall be subject to the
            exclusive jurisdiction of courts in Ghaziabad, Uttar Pradesh.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact</h2>
          <p>
            For any questions regarding these terms, write to us at{' '}
            <a href="mailto:info@jaivikoverseasconsultants.com" className="text-brand-700 underline">
              info@jaivikoverseasconsultants.com
            </a>{' '}
            or call <a href="tel:+919971226347" className="text-brand-700 underline">+91-9971226347</a>.
          </p>
        </section>

      </div>

      <div className="mt-12 pt-8 border-t border-gray-200 flex gap-4 text-sm">
        <Link href="/" className="text-brand-700 hover:underline">← Home</Link>
        <Link href="/book-counselling" className="text-brand-700 hover:underline">Book Free Counselling</Link>
      </div>
    </div>
  );
}
