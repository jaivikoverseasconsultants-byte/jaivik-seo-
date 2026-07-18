import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import LeadForm from '@/components/LeadForm';

export const metadata: Metadata = {
  title: 'Study Abroad Without IELTS, Low Budget & Scholarships — Honest Guide for Indian Students 2026',
  description: 'Honest answers: study abroad without IELTS, under 20 lakhs, education loans without collateral, scholarships for middle class, 50% in 12th, IELTS 6.0 universities. Real data, no fluff.',
  keywords: [
    'study abroad without ielts india',
    'low budget study abroad under 20 lakhs',
    'education loan without collateral abroad',
    'scholarships for middle class indian students',
    'study abroad with 50 percent in 12th',
    'ielts 6 universities abroad',
    'study abroad india 2026',
  ],
  alternates: { canonical: '/scholarships-and-low-budget-guide' },
  openGraph: {
    title: 'Study Abroad Without IELTS, Low Budget & Scholarships — Honest Guide 2026',
    description: 'Real answers to the questions Indian students actually search for — no brand fluff.',
    url: 'https://study.jaivikoverseasconsultants.com/scholarships-and-low-budget-guide',
  },
};

// Rewritten 2026-07-18 (BUILD-LOG.md §2 item 13) — the previous version of
// this schema made specific, unsourced claims: named per-university fee
// figures that happened to be accurate (verified against the real course
// registry, kept in the visible copy below where correct), but also named
// banks/loan amounts/rates, named scholarships with specific amounts that
// didn't even match this site's own (separately unverified) scholarship
// data, and named-university English-test-acceptance claims with no backing
// data anywhere in the codebase. Replaced with honest, general answers —
// specifics belong on pages backed by real per-university data, not here.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Which countries allow study abroad without IELTS for Indian students?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Some universities accept an MOI (Medium of Instruction) letter in place of IELTS for students whose entire prior education was in English, and many accept alternative English tests (PTE Academic, TOEFL iBT, Duolingo) instead. Exactly which universities and courses accept this varies and changes over time — we don\'t maintain a verified per-university list of this on our own data, so confirm current policy directly with your shortlisted universities or with a counsellor. See our dedicated guide on studying abroad without IELTS for real, lower-IELTS-threshold course options we do track.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the cheapest way to study abroad from India under 20 lakhs per year?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tuition fees for a given course and university are the real, verifiable part of this — browse our real course data by country and by budget to see current tuition in INR sorted cheapest first. Living costs vary significantly by city, not just by country, so total budget depends on where you\'ll actually live. See our cost-of-studying guides for real tuition-plus-living combined ranges in the countries we cover.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I get an education loan without collateral for studying abroad in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Collateral-free education loans are offered by several Indian banks and NBFCs, generally up to a threshold amount, with larger loans typically requiring collateral. Exact amounts, interest rates, and eligibility criteria change frequently and vary by lender — we don\'t maintain this data ourselves, so confirm current terms directly with the bank/NBFC or ask your counsellor, who can point you to current options for your specific university and course.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are there scholarships for middle class Indian students to study abroad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Many universities offer merit-based and need-based scholarships to international students, and each university\'s own profile page on this site lists the specific scholarships and amounts we have on record for it. Government and third-party scholarship schemes also exist but change year to year — confirm current eligibility and amounts directly with the scholarship provider or with a counsellor before relying on any figure.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I study abroad with 50% in 12th grade?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Often yes for master\'s programmes — admissions generally weigh your bachelor\'s degree result far more heavily than your 12th-grade marks, alongside your IELTS score and SOP. For bachelor\'s (undergraduate) admission, 12th-grade marks matter more directly, though pathway/foundation-year programmes exist as a real route for students below a university\'s direct-entry bar. Exact minimum requirements vary by university and course — confirm current policy with your shortlisted universities or a counsellor rather than assuming from a general rule.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which universities accept a lower IELTS score for Indian students?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'See our real, data-backed lists of universities with a published course-entry IELTS requirement of 6.0 or 6.5 — every course listed links to its own page with the exact current requirement. Pre-sessional English programmes and alternative tests (PTE, TOEFL, Duolingo) are also real options at many universities, but which specific university/course accepts which isn\'t something we track centrally — confirm with the university or a counsellor.',
      },
    },
  ],
};

// Course card component (inline for this static page)
function CourseCard({ name, uniName, uniSlug, slug, inrLakh, ielts, duration }: {
  name: string; uniName: string; uniSlug: string; slug: string;
  inrLakh: string; ielts: number; duration: string;
}) {
  return (
    <Link
      href={`/universities/${uniSlug}/courses/${slug}`}
      className="flex items-start justify-between p-4 bg-gray-50 hover:bg-brand-50 border border-transparent hover:border-brand-200 rounded-xl transition-colors group"
    >
      <div className="flex-1 min-w-0 mr-3">
        <p className="text-sm font-semibold text-gray-900 group-hover:text-brand-700 leading-tight">{name}</p>
        <p className="text-xs text-gray-500 mt-0.5">{uniName} · {duration} · IELTS {ielts}+</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-brand-700">₹{inrLakh}L/yr</p>
        <p className="text-xs text-gray-500 mt-0.5 group-hover:text-brand-600">View →</p>
      </div>
    </Link>
  );
}

function SectionCTA() {
  return (
    <div className="mt-5 flex items-center justify-between p-4 bg-brand-50 border border-brand-200 rounded-xl">
      <p className="text-sm text-brand-800 font-medium">Not sure which option fits your profile?</p>
      <Link
        href="/find-my-course"
        className="ml-4 flex-shrink-0 bg-brand-700 hover:bg-brand-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        Get a personalised assessment →
      </Link>
    </div>
  );
}

export default function ScholarshipsAndLowBudgetGuide() {
  return (
    <>
      <JsonLd data={faqSchema} />

      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">

        {/* Hero */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            ✅ Honest guide — real data, no brand fluff
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
            Study Abroad Without IELTS, Low Budget &amp; Scholarships
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Answers to the questions Indian students actually search for — written honestly, with real university data. If an option has genuine downsides, we say so.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            {[
              'Without IELTS', 'Under 20 Lakhs', 'Collateral-Free Loan',
              'Middle Class Scholarships', '50% in 12th', 'IELTS 6.0',
            ].map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        </div>

        {/* Table of contents */}
        <nav className="bg-white border border-gray-200 rounded-2xl p-5 mb-10 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Contents</p>
          <ol className="space-y-1.5 text-sm">
            {[
              ['#without-ielts', 'Study Abroad Without IELTS — Which Countries Allow This?'],
              ['#low-budget', 'Low Budget Study Abroad Under 20 Lakhs — Real Options'],
              ['#education-loan', 'Education Loan Without Collateral — Eligible Countries'],
              ['#scholarships', 'Scholarships for Middle Class Students — Country-wise'],
              ['#50-percent', 'Can I Study Abroad with 50% in 12th? — Honest Answer'],
              ['#ielts-60', 'IELTS 5.5–6.0 Universities — Realistic Options'],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="text-brand-700 hover:underline">{label}</a>
              </li>
            ))}
          </ol>
        </nav>

        {/* ── Section 1: Without IELTS ─────────────────────────────────────── */}
        <section id="without-ielts" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Study Abroad Without IELTS — Which Countries Allow This?
          </h2>
          <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
            <p>
              The honest answer is: most universities <em>do</em> require an English proficiency test or proof of English-medium education. A full IELTS waiver is a real option at some universities, but it&apos;s course- and university-specific and changes over time — we don&apos;t maintain a verified list of exactly which universities offer it, so treat the general routes below as things to ask about, not guarantees.
            </p>
            <p>
              <strong>MOI (Medium of Instruction) waiver:</strong> Students whose entire prior education was taught in English (CBSE/ICSE/state-board English medium through to an English-medium degree) can sometimes get IELTS waived with a letter from their school/college/university confirming this. Whether a specific course accepts it needs to be confirmed directly with that university.
            </p>
            <p>
              <strong>Alternative English tests:</strong> Many universities accept the Duolingo English Test, PTE Academic, or TOEFL iBT instead of IELTS — each with its own required score, set by that university and course. This is a genuine, real option, but which specific course accepts which test needs confirming on that course&apos;s own current requirements page (or with us) rather than assuming.
            </p>
            <p>
              <strong>Pre-sessional English programmes:</strong> If your IELTS is 5.5–6.0, many universities run their own pre-sessional English course (typically 10–20 weeks) that leads into the main degree without a fresh IELTS attempt, ending in an internal test instead.
            </p>
            <p>
              <strong>A lower IELTS threshold:</strong> Rather than avoiding IELTS entirely, one option is a course with a lower published requirement — see the real course examples below (real fee and course data; confirm the current exact IELTS requirement on the course&apos;s own page, since published requirements can change).
            </p>
            <div className="space-y-2 mt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Real course examples (current fee &amp; IELTS requirement):</p>
              <CourseCard name="Management [MRes]" uniName="University of Glasgow" uniSlug="university-of-glasgow" slug="glasgow-management-mres" inrLakh="13.9" ielts={6.5} duration="1 year" />
              <CourseCard name="AI and Analytics" uniName="McMaster University" uniSlug="mcmaster-university" slug="mcmaster-ai-and-analytics" inrLakh="13.6" ielts={6.5} duration="1 year" />
              <CourseCard name="Computer Science — Master of Math (MMath)" uniName="University of Waterloo" uniSlug="university-of-waterloo" slug="waterloo-computer-science-master-of-math-mmath" inrLakh="12.4" ielts={6.5} duration="1–2 years" />
            </div>
            <p className="text-xs text-gray-500 mt-3">
              For a fuller honest guide on this exact topic — including the distinction between &ldquo;lower IELTS score&rdquo; and &ldquo;no IELTS at all&rdquo; — see{' '}
              <Link href="/study-abroad-without-ielts" className="text-brand-700 underline">Study Abroad Without IELTS</Link>.
            </p>
          </div>
          <SectionCTA />
        </section>

        {/* ── Section 2: Low Budget ────────────────────────────────────────── */}
        <section id="low-budget" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Low Budget Study Abroad Under 20 Lakhs — Real Options
          </h2>
          <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
            <p>
              "Under 20 lakhs" is achievable — but not everywhere. Here are honest numbers from our real-data course database (not brochure estimates).
            </p>
            <p>
              <strong>University of Waterloo, Canada:</strong> The most affordable option in our database. Arts and social science master's programs (MA in Economics, English, Psychology) cost approximately <strong>₹10.5L/year in tuition</strong>. STEM programs (Computer Science MMath, Data Science) are ₹12.4L/year. Add ₹6–7L/year for living in Waterloo (significantly cheaper than Toronto or Vancouver). Total cost for a 1-year master's: ₹17–20L. Waterloo also offers Co-op options that generate paid work terms, potentially offsetting costs.
            </p>
            <p>
              <strong>University of Glasgow, UK:</strong> Glasgow is one of the UK's most affordable Russell Group cities. Master's programs (MRes, MPhil) start from <strong>₹13.9L/year</strong>. Living costs in Glasgow are roughly ₹7–8L/year — notably lower than London (₹12–15L) or Edinburgh (₹9–10L). A 1-year taught master's total budget: ₹21–23L, stretchable to under 20L for self-catering accommodation and part-time work.
            </p>
            <p>
              <strong>McMaster University, Canada:</strong> Hamilton (McMaster's city) is far cheaper to live in than Toronto. Tuition is approximately <strong>₹13.6L/year</strong> with living costs around ₹6–7L/year — making a 1-year master's achievable in ₹20–22L total. McMaster's strong industry connections also mean better part-time work opportunities during study.
            </p>
            <p>
              <strong>Germany:</strong> Public German universities charge little to no tuition (typically a small per-semester admin fee), which is a genuinely low-cost route worth considering — but most programmes are taught in German, and the visa process requires a blocked account and takes longer than for English-speaking destinations. We don&apos;t yet have real per-city living-cost data for Germany on this site, so budget conservatively and confirm current costs directly.
            </p>
            <div className="space-y-2 mt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Real courses under ₹15L/year in tuition:</p>
              <CourseCard name="Economics — Master of Arts (MA)" uniName="University of Waterloo" uniSlug="university-of-waterloo" slug="waterloo-economics-master-of-arts-ma" inrLakh="10.5" ielts={6.5} duration="1 year" />
              <CourseCard name="Data Science — Master of Math (MMath)" uniName="University of Waterloo" uniSlug="university-of-waterloo" slug="waterloo-data-science-master-of-math-mmath" inrLakh="12.4" ielts={6.5} duration="1–2 years" />
              <CourseCard name="Biomedical Sciences [MRes]" uniName="University of Glasgow" uniSlug="university-of-glasgow" slug="glasgow-biomedical-sciences-mres" inrLakh="13.9" ielts={6.5} duration="1 year" />
            </div>
            <p className="text-xs text-gray-500 mt-3">
              For real tuition-plus-living combined budgets by country, see our{' '}
              <Link href="/cost-of-studying-in-uk" className="text-brand-700 underline">UK</Link>,{' '}
              <Link href="/cost-of-studying-in-canada" className="text-brand-700 underline">Canada</Link>, and{' '}
              <Link href="/cost-of-studying-in-australia" className="text-brand-700 underline">Australia</Link> cost guides.
            </p>
          </div>
          <SectionCTA />
        </section>

        {/* ── Section 3: Education Loan ────────────────────────────────────── */}
        <section id="education-loan" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Education Loan Without Collateral — Eligible Countries
          </h2>
          <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
            <p>
              Collateral-free education loans for studying abroad are available from both public banks and NBFCs in India — but exact amounts, interest rates, and eligibility conditions vary by lender and change over time. We don&apos;t maintain loan-product data ourselves, so treat the general shape below as a starting point for questions to ask, not fixed figures to plan around.
            </p>
            <p>
              <strong>Collateral-free amounts generally exist up to a threshold.</strong> Indian banks and NBFCs commonly offer collateral-free loans up to a certain amount for admissions at recognised, ranked universities, with larger amounts typically requiring property or fixed-deposit security. Some international lenders offer collateral-free funding based on future earning potential rather than existing assets, for select STEM/business programmes. Confirm current thresholds directly with the lender.
            </p>
            <p>
              <strong>Typical eligibility checklist:</strong> (1) Admission letter from a recognised institution, (2) academic transcripts, (3) an estimated fee structure from the university, (4) a co-applicant with stable income (usually a parent/guardian), (5) no existing major credit default. IELTS/TOEFL scores are generally relevant to university admission, not the loan itself.
            </p>
            <p>
              <strong>Apply early.</strong> Loan processing takes time, and university fee-payment deadlines are often strict — applying for your loan as soon as you have an admission letter, rather than waiting, avoids a common cause of last-minute problems. Confirm current processing timelines with your chosen lender.
            </p>
            <p>
              A counsellor can point you to lenders and current terms relevant to your specific university and course — this is exactly the kind of detail that changes too often for us to publish reliably here.
            </p>
          </div>
          <SectionCTA />
        </section>

        {/* ── Section 4: Scholarships ──────────────────────────────────────── */}
        <section id="scholarships" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Scholarships for Middle Class Students — Country-wise
          </h2>
          <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
            <p>
              &ldquo;Middle class&rdquo; students generally aren&apos;t the target of the largest, most competitive full-ride scholarships (which tend to prioritise exceptional academic or leadership profiles) — but partial, merit-based scholarships from individual universities are a real and realistic option for a solid academic record.
            </p>
            <p>
              <strong>University-specific scholarships are the most reliable starting point.</strong> Every university profile page on this site lists the specific scholarships (name, amount, eligibility) we have on record for that institution — check your shortlisted universities&apos; own pages rather than relying on a general list here, since scholarship names, amounts, and eligibility criteria change by intake and we don&apos;t want to publish a figure that&apos;s gone stale.
            </p>
            <p>
              <strong>Government and third-party scholarships also exist</strong> (e.g. bilateral scholarship schemes between India and the destination country, or awards from professional bodies), but eligibility and funding levels vary year to year — search for current schemes specific to your target country, or ask a counsellor who tracks current options.
            </p>
            <p>
              <strong>What&apos;s generally realistic:</strong> Partial scholarships covering a portion of tuition are achievable for a solid (not necessarily top) academic record combined with a well-written SOP — full scholarships to highly-ranked universities are genuinely rare and usually require an exceptional profile. A practical approach is to apply for scholarships alongside your main application and plan to fund the remainder through savings or an education loan.
            </p>
            <p>
              <strong>Apply early.</strong> Many scholarship pools are allocated in the order applications are received, so applying well before the intake deadline (rather than close to it) generally improves your chances.
            </p>
          </div>
          <SectionCTA />
        </section>

        {/* ── Section 5: 50% in 12th ───────────────────────────────────────── */}
        <section id="50-percent" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Can I Study Abroad with 50% in 12th? — Honest Answer
          </h2>
          <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
            <p>
              This is one of the most anxious questions Indian students ask — and the honest answer is: <strong>for master's programs, your 12th marks almost certainly don't matter</strong>.
            </p>
            <p>
              <strong>For master's degree programs (MSc, MA, MBA, MRes):</strong> Admissions offices generally look at your <em>bachelor's degree percentage</em>, not your 12th grade marks. If you have a solid bachelor's result, a strong IELTS score, and a clear SOP explaining your career goals, your 12th percentage is typically not part of the evaluation. This is standard admission policy at most universities, not a loophole — but exact minimum bachelor's percentage requirements vary by university and course, so confirm current policy for your specific shortlist.
            </p>
            <p>
              <strong>For bachelor's degree programs (UG, BEng, BSc):</strong> This is where 12th marks matter more directly, and many universities set a minimum 10+2 percentage for direct entry. If your percentage is below that bar, <em>pathway/foundation programmes</em> are a real route — typically a 1-year preparatory programme, run by the university itself or an affiliated provider, that accepts a lower 12th percentage and leads into the main degree on successful completion. Confirm current entry percentages and foundation-year costs directly with your shortlisted universities, since both vary significantly.
            </p>
            <p>
              <strong>For competitive programs (Medicine, Law, Architecture):</strong> These are exceptions. Medical programs abroad (MBBS) and Oxbridge admissions do sometimes factor in 12th performance as part of a holistic profile. This guide is primarily relevant for postgraduate study.
            </p>
            <p>
              <strong>Germany &amp; European public universities:</strong> The German ANABIN database converts Indian 10+2 results differently across states. Some German university application portals do require 12th marks for equivalency calculation. Check the specific university's DAAD entry requirements.
            </p>
            <p>
              <strong>The bigger picture:</strong> Don't let a lower 12th percentage stop you from applying. What universities want to see is a consistent upward trajectory — if your bachelor's improved over your 12th, that actually tells a good story in your SOP.
            </p>
            <div className="space-y-2 mt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Real master's programme examples (current fee &amp; IELTS requirement):</p>
              <CourseCard name="Public Health — Master of Public Health (MPH) Online" uniName="University of Waterloo" uniSlug="university-of-waterloo" slug="waterloo-public-health-master-of-public-health-mph-online" inrLakh="11.8" ielts={6.5} duration="1–2 years" />
              <CourseCard name="Management [MRes]" uniName="University of Glasgow" uniSlug="university-of-glasgow" slug="glasgow-management-mres" inrLakh="13.9" ielts={6.5} duration="1 year" />
              <CourseCard name="Anthropology" uniName="McMaster University" uniSlug="mcmaster-university" slug="mcmaster-anthropology" inrLakh="13.6" ielts={6.5} duration="2 years" />
            </div>
          </div>
          <SectionCTA />
        </section>

        {/* ── Section 6: IELTS 5.5-6.0 ────────────────────────────────────── */}
        <section id="ielts-60" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            IELTS 5.5–6.0 Universities — Realistic Options
          </h2>
          <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
            <p>
              Many highly-ranked universities publish a course-entry IELTS requirement of 6.5 or higher. If your score is currently 5.5–6.0, there are real routes forward — but be wary of anyone claiming a specific top-ranked university accepts 5.5 for direct entry without checking; it&apos;s usually a conditional pathway, not direct admission.
            </p>
            <p>
              <strong>Pre-sessional English programmes</strong> are the most common real route: many universities run their own language centre offering a 10–20 week intensive English course. You get a conditional offer for the main degree, enrol in the pre-sessional at your current score, pass its exit test, and proceed to the main programme without retaking IELTS. Availability and structure are university-specific — confirm with your shortlisted universities.
            </p>
            <p>
              <strong>Alternative tests</strong> (Duolingo English Test, PTE Academic, TOEFL iBT) are accepted instead of IELTS by many universities, each with a course-specific required score — genuinely useful for students who find the IELTS format harder than other test formats, but confirm acceptance for your specific target course rather than assuming.
            </p>
            <p>
              <strong>If retaking IELTS is the plan:</strong> Moving from 6.0 to 6.5 typically takes several weeks of focused preparation, and the Writing section is commonly where Indian test-takers lose the most band score — targeted Writing Task 2 practice is usually the highest-value use of preparation time.
            </p>
            <p>
              <strong>Universities with lower published IELTS requirements exist</strong> beyond the most highly-ranked institutions — see the course lists below, and always confirm the exact current requirement on that course&apos;s own page before applying, since requirements change.
            </p>
            <div className="space-y-2 mt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Real course examples (current fee &amp; IELTS requirement):</p>
              <CourseCard name="Ecology &amp; Environmental Biology [MRes]" uniName="University of Glasgow" uniSlug="university-of-glasgow" slug="glasgow-ecology-environmental-biology-mres" inrLakh="13.9" ielts={6.5} duration="1 year" />
              <CourseCard name="AI and Analytics" uniName="McMaster University" uniSlug="mcmaster-university" slug="mcmaster-ai-and-analytics" inrLakh="13.6" ielts={6.5} duration="1 year" />
              <CourseCard name="Applied AI and Data-Driven Decision-Making" uniName="McMaster University" uniSlug="mcmaster-university" slug="mcmaster-applied-ai-and-datadriven-decisionmaking" inrLakh="13.6" ielts={6.5} duration="1 year" />
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Browse real courses with a lower published IELTS requirement:{' '}
              <Link href="/ielts-6-0-universities" className="text-brand-700 underline">IELTS 6.0</Link> ·{' '}
              <Link href="/ielts-6-5-universities" className="text-brand-700 underline">IELTS 6.5</Link>.
            </p>
          </div>
          <SectionCTA />
        </section>

        {/* Bottom CTA */}
        <div className="bg-brand-900 text-white rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold mb-3">Get a Free Personalised Assessment</h2>
          <p className="text-blue-200 text-sm mb-6 max-w-md mx-auto">
            Tell us your bachelor's percentage, IELTS score, and budget. We'll match you to the best options across our real-course database — no pressure, no upsell.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/find-my-course" className="btn-gold">
              🎯 Find My Course →
            </Link>
            <Link href="/book-counselling" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-colors border border-white/20 text-sm">
              Book Free Counselling
            </Link>
          </div>
        </div>

        {/* Lead form */}
        <div className="mt-10">
          <LeadForm />
        </div>
      </div>
    </>
  );
}
