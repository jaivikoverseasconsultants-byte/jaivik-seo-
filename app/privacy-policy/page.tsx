import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Jaivik Overseas Consultants',
  description: 'How Jaivik Overseas Consultants collects, uses, and protects your personal data on the study abroad portal.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://study.jaivikoverseasconsultants.com/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: July 2026</p>

      <div className="prose prose-gray max-w-none space-y-10 text-gray-700 text-sm leading-relaxed">

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
          <p>
            Jaivik Overseas Consultants (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates
            the website at <span className="font-medium">study.jaivikoverseasconsultants.com</span> (the
            &ldquo;Portal&rdquo;). This Privacy Policy explains what personal data we collect when you use
            the Portal, why we collect it, how it is stored, and the choices you have. By using the Portal,
            you agree to the practices described here.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
          <p className="mb-3">We collect the following categories of personal data:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Enquiry/lead form details</strong> — name, email address, and phone number, when you
              submit a counselling request, course match quiz, eligibility check, or any other form on
              the Portal.
            </li>
            <li>
              <strong>Account details</strong> — email address and password (or phone number, where phone
              login is enabled) if you register for a student portal account. Authentication is handled by
              Firebase Authentication (Google).
            </li>
            <li>
              <strong>Student portal data</strong> — any additional profile or application-tracking
              information you enter into your student dashboard, stored in Firestore (Google Cloud).
            </li>
            <li>
              <strong>Usage data</strong> — pages visited, general location (country/city level), device
              and browser type, collected automatically via Google Analytics.
            </li>
            <li>
              <strong>WhatsApp messages</strong> — if you tap a &ldquo;WhatsApp Us&rdquo; button, you are
              taken to WhatsApp with a pre-filled message; anything you then send becomes a normal WhatsApp
              conversation with our WhatsApp Business number, subject to WhatsApp&apos;s own privacy terms.
            </li>
          </ul>
          <p className="mt-3">
            We do not knowingly collect payment card details, government ID numbers, or other sensitive
            documents through the Portal itself — those are only ever exchanged directly with your
            counsellor once a service engagement begins.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To respond to your enquiry and provide study-abroad counselling services.</li>
            <li>To create and manage your student portal account, if you register for one.</li>
            <li>To contact you by phone, email, or WhatsApp about your enquiry or application.</li>
            <li>To understand how the Portal is used, so we can improve content and navigation (via Google Analytics, in aggregate/anonymised form where possible).</li>
            <li>To meet legal, accounting, or regulatory obligations.</li>
          </ul>
          <p className="mt-3">We do not sell your personal data to third parties.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Third-Party Services We Use</h2>
          <p className="mb-3">
            The Portal relies on the following third-party services, each of which processes data under
            its own privacy policy:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Formspree</strong> — most enquiry/lead forms on the Portal submit directly to
              Formspree, a third-party form-processing service, which then forwards the details to us.
            </li>
            <li>
              <strong>Firebase (Google)</strong> — Firebase Authentication for student login/registration,
              and Firestore for storing student portal data.
            </li>
            <li>
              <strong>Google Analytics</strong> — website usage analytics.
            </li>
            <li>
              <strong>WhatsApp Business (Meta)</strong> — for enquiries made via our WhatsApp contact
              buttons.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Storage &amp; Security</h2>
          <p>
            Data collected through the student portal is stored on Google Firebase/Firestore
            infrastructure. Lead form submissions are processed by Formspree. We take reasonable
            technical and organisational measures to protect personal data, but no method of electronic
            storage or transmission is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data Retention</h2>
          <p>
            We retain enquiry and account data for as long as reasonably necessary to provide our
            services, respond to your enquiry, and meet legal or accounting requirements. You may request
            deletion of your data at any time (see Section 8).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Cookies &amp; Analytics</h2>
          <p>
            The Portal uses Google Analytics, which sets cookies and similar technologies to understand
            how visitors use the site. You can disable cookies in your browser settings or use
            browser/extension-level tools (e.g. Google&apos;s Analytics Opt-out Browser Add-on) to opt out
            of Google Analytics tracking. Disabling cookies may affect some Portal functionality.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Your Rights</h2>
          <p className="mb-3">Subject to applicable law, you may ask us to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Confirm what personal data we hold about you.</li>
            <li>Correct inaccurate personal data.</li>
            <li>Delete your personal data (including your student portal account), except where we are legally required to keep it.</li>
            <li>Stop contacting you for marketing/counselling follow-ups.</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, contact us using the details in Section 11 — we will respond
            as soon as reasonably possible.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Children&apos;s Privacy</h2>
          <p>
            The Portal is intended for prospective students aged 16 and above, consistent with our{' '}
            <Link href="/terms" className="text-brand-700 underline">Terms of Use</Link>. We do not
            knowingly collect personal data from children under 16.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or
            for legal reasons. The &ldquo;Last updated&rdquo; date at the top of this page will change
            whenever we do.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Governing Law</h2>
          <p>
            This Privacy Policy is governed by the laws of India, including the Digital Personal Data
            Protection Act, 2023, to the extent applicable. Any disputes shall be subject to the exclusive
            jurisdiction of courts in Ghaziabad, Uttar Pradesh.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Contact</h2>
          <p>
            For any questions about this Privacy Policy, or to exercise your data rights, write to us at{' '}
            <a href="mailto:info@jaivikoverseasconsultants.com" className="text-brand-700 underline">
              info@jaivikoverseasconsultants.com
            </a>{' '}
            or call{' '}
            <a href="tel:+919971226347" className="text-brand-700 underline">+91 99712 26347</a>.
          </p>
          <p className="mt-3">
            Jaivik Overseas Consultants<br />
            333 Orbit Plaza, Crossing Republik,<br />
            Ghaziabad, Uttar Pradesh 201016, India
          </p>
        </section>

      </div>

      <div className="mt-12 pt-8 border-t border-gray-200 flex gap-4 text-sm">
        <Link href="/" className="text-brand-700 hover:underline">← Home</Link>
        <Link href="/terms" className="text-brand-700 hover:underline">Terms of Use</Link>
        <Link href="/book-counselling" className="text-brand-700 hover:underline">Book Free Counselling</Link>
      </div>
    </div>
  );
}
