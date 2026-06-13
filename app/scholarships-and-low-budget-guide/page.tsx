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

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Which countries allow study abroad without IELTS for Indian students?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Germany, France, and the Netherlands have English-taught programs that accept proof of English-medium schooling instead of IELTS. In Canada and the UK, Duolingo English Test (110+) and Cambridge C1 Advanced are accepted by many universities. Students from CBSE/ICSE English-medium schools can claim an IELTS waiver at select UK institutions. However, top-ranked universities like Manchester, UCL, Edinburgh, and Toronto require IELTS 6.5 minimum — pre-sessional English programs (10–20 weeks) bridge the gap if your current score is 5.5–6.0.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the cheapest country to study abroad from India under 20 lakhs per year?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Canada is currently the most affordable option for quality education under 20 lakhs. University of Waterloo master\'s programs start from ₹10.5L/year, McMaster from ₹13.6L/year, and University of Toronto from ₹16.1L/year. In the UK, University of Glasgow master\'s programs start from ₹13.9L/year. Germany offers tuition-free public university education (only ~€150/semester admin fee) but programs are often in German. These figures are tuition only — add ₹5–8L/year for living costs in Canada and ₹8–10L/year in UK cities.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I get an education loan without collateral for studying abroad in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. SBI Global Ed-Vantage, HDFC Credila, Axis Bank, and ICICI Bank offer collateral-free loans up to ₹40–75 lakhs for top universities in Canada, UK, USA, and Australia. Prodigy Finance offers up to 100% funding without collateral for select master\'s programs at ranked universities. The key eligibility factors are: admission to a recognized university, program in STEM/Business/Healthcare, and a co-applicant (parent/guardian). Canadian universities like Waterloo, McMaster, and Toronto are among the highest-approved by Indian NBFCs for collateral-free loans.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are there scholarships for middle class Indian students to study abroad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, several scholarships specifically support middle-class students (family income ₹5–25L/year): GREAT Scholarships (UK, ₹8–10L one-time for UK universities), Commonwealth Scholarships (full funding for developing countries), Glasgow University Postgraduate Merit Scholarship (£3,000–5,000), Edinburgh Global Scholarship, McMaster entrance scholarships ($5,000–15,000 CAD), and Ontario Graduate Scholarship (Canada). Most require a GPA of 3.5/4.0 equivalent (roughly 75%+ in bachelor\'s) and a strong SOP. Applying early (6+ months before intake) significantly improves scholarship success.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I study abroad with 50% in 12th grade?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For master\'s programs (MSc/MA/MBA): Yes, absolutely. Your 12th marks are rarely checked for master\'s admissions — what matters is your bachelor\'s degree percentage (typically 55–60% minimum), IELTS score, and SOP. Thousands of Indian students with 50% in 12th but 65%+ in bachelor\'s have successfully studied at top universities. For bachelor\'s programs (UG): Most UK and Canadian universities require 60–70% in 10+2. Pathway/foundation programs (1 year, ₹8–12L) accept 50–55% and guarantee university entry on completion. German public universities have different criteria based on Anabin database equivalency.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which universities accept IELTS 6.0 or lower for Indian students in 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most ranked universities (including all 9 in our database) require IELTS 6.5 overall with no band below 6.0. However, IELTS 6.0 candidates have three realistic routes: (1) Pre-sessional English programs — Glasgow, Edinburgh, Manchester, and Toronto all offer 10–20 week language programs that accept IELTS 5.5–6.0, granting conditional admission to the main degree; (2) Alternative tests — Duolingo English Test 110+ (≈ IELTS 6.5) is accepted by McMaster, Waterloo, and many others, giving more flexibility than IELTS; (3) Improvement retake — moving from 6.0 to 6.5 typically requires 4–8 weeks of targeted preparation, particularly in Writing and Reading.',
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
              The honest answer is: most top-ranked universities <em>do</em> require IELTS. But several countries — and many good universities within them — have legitimate IELTS-free pathways for Indian students.
            </p>
            <p>
              <strong>Germany:</strong> Public universities are largely tuition-free. For English-taught master's programs (about 40% of programs at TU Munich, RWTH Aachen, etc.), many do not require IELTS if you can demonstrate English proficiency through your bachelor's degree medium of instruction — a certificate from your university on official letterhead usually suffices. The catch: competition is high and German bureaucracy (visa, blocked account) takes 3–4 months.
            </p>
            <p>
              <strong>France &amp; Netherlands:</strong> Grandes écoles and institutions like Sciences Po accept proof of English-medium education for international programs. The Netherlands (Maastricht, Groningen) similarly accepts Cambridge C1 Advanced or institutional English tests for several programs.
            </p>
            <p>
              <strong>Canada &amp; UK (alternative tests):</strong> Universities including McMaster, Waterloo, Toronto, and Glasgow now accept the <strong>Duolingo English Test (DET 110+)</strong> — taken online in 45 minutes at home — in place of IELTS. This is a genuine IELTS alternative, not a workaround. The PTE Academic (58+) is another option widely accepted across UK and Canadian institutions.
            </p>
            <p>
              <strong>IELTS waiver (English-medium schools):</strong> Students who studied 10+2 in English medium (CBSE, ICSE, state boards with English as medium) can apply for an IELTS waiver at select UK universities. This is not guaranteed — each university has its own policy — but it is worth requesting during application.
            </p>
            <p>
              <strong>Pre-sessional route:</strong> If your IELTS is 5.5–6.0, all three UK universities below offer pre-sessional English programs (10–20 weeks, ₹1.5–3L). Completing a pre-sessional grants conditional direct entry to the main master's degree without needing to retake IELTS again.
            </p>
            <div className="space-y-2 mt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Real course options (accept DET / pre-sessional entry):</p>
              <CourseCard name="Management [MRes]" uniName="University of Glasgow" uniSlug="university-of-glasgow" slug="glasgow-management-mres" inrLakh="13.9" ielts={6.5} duration="1 year" />
              <CourseCard name="AI and Analytics" uniName="McMaster University" uniSlug="mcmaster-university" slug="mcmaster-ai-and-analytics" inrLakh="13.6" ielts={6.5} duration="1 year" />
              <CourseCard name="Computer Science — Master of Math (MMath)" uniName="University of Waterloo" uniSlug="university-of-waterloo" slug="waterloo-computer-science-master-of-math-mmath" inrLakh="12.4" ielts={6.5} duration="1–2 years" />
            </div>
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
              <strong>Germany (no university in our database yet):</strong> Worth mentioning honestly — public German universities charge near-zero tuition (€0–300/semester). Living costs in cities like Leipzig or Magdeburg are ₹5–6L/year. Total cost of a 2-year master's: ₹10–14L. The downsides: most programs in German, required blocked account of ~€11,000, and longer visa timelines.
            </p>
            <div className="space-y-2 mt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Real courses under ₹15L/year in tuition:</p>
              <CourseCard name="Economics — Master of Arts (MA)" uniName="University of Waterloo" uniSlug="university-of-waterloo" slug="waterloo-economics-master-of-arts-ma" inrLakh="10.5" ielts={6.5} duration="1 year" />
              <CourseCard name="Data Science — Master of Math (MMath)" uniName="University of Waterloo" uniSlug="university-of-waterloo" slug="waterloo-data-science-master-of-math-mmath" inrLakh="12.4" ielts={6.5} duration="1–2 years" />
              <CourseCard name="Biomedical Sciences [MRes]" uniName="University of Glasgow" uniSlug="university-of-glasgow" slug="glasgow-biomedical-sciences-mres" inrLakh="13.9" ielts={6.5} duration="1 year" />
            </div>
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
              Collateral-free education loans for studying abroad are available from both public banks and NBFCs in India — but with eligibility conditions that most students don't read carefully. Here's what's actually true.
            </p>
            <p>
              <strong>How much without collateral?</strong> Most banks (SBI, HDFC Credila, Axis, ICICI) offer <strong>₹7.5L–₹40L without collateral</strong> for ranked universities. Beyond ₹40L, most lenders require property or fixed deposit as security. Prodigy Finance and MPower Financing are international lenders that offer collateral-free loans up to 100% of program cost for select STEM and Business programs — repayment starts after graduation.
            </p>
            <p>
              <strong>Which countries qualify?</strong> India's banking system recognises study loans most easily for <strong>Canada, UK, USA, and Australia</strong>. Canada is the most straightforward — IRCC's recognition of institutions means lenders have clear collateral-free frameworks for programs at universities like Toronto, Waterloo, and McMaster.
            </p>
            <p>
              <strong>SBI Global Ed-Vantage scheme:</strong> Loans up to ₹1.5 crore for abroad studies (collateral required above ₹40L) at interest rates of ~10.5–11.5% p.a. Repayment starts 12 months after course completion. For Canada-bound students, the SBI scheme is frequently used for Waterloo and McMaster programs.
            </p>
            <p>
              <strong>Key eligibility checklist:</strong> (1) Admission letter from a recognised institution, (2) 10th/12th marksheets, (3) Bachelor's degree certificate, (4) Estimated fee structure from university, (5) Co-applicant with stable income (parent/guardian), (6) No existing major default on CIBIL. IELTS/TOEFL is not required for the loan — only for university admission.
            </p>
            <p>
              <strong>What banks don't tell you:</strong> Processing takes 3–6 weeks. Apply immediately after receiving your admission letter — <em>do not wait</em>. Fee payment deadlines at Canadian universities are strict (CAS/LOA deadlines), and late loan disbursement is one of the top reasons Indian students lose their admission.
            </p>
            <div className="space-y-2 mt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Top loan-eligible Canadian programs in our database:</p>
              <CourseCard name="Applied AI and Data-Driven Decision-Making" uniName="McMaster University" uniSlug="mcmaster-university" slug="mcmaster-applied-ai-and-datadriven-decisionmaking" inrLakh="13.6" ielts={6.5} duration="1 year" />
              <CourseCard name="Data Science — Master of Math (MMath)" uniName="University of Waterloo" uniSlug="university-of-waterloo" slug="waterloo-data-science-master-of-math-mmath" inrLakh="12.4" ielts={6.5} duration="1–2 years" />
              <CourseCard name="Public Health Sciences" uniName="University of Toronto" uniSlug="university-of-toronto" slug="uoft-public-health-sciences" inrLakh="16.1" ielts={6.5} duration="1–2 years" />
            </div>
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
              "Middle class" for scholarship purposes typically means household income between ₹5–25L/year. Most full-ride scholarships (Chevening, Rhodes) are designed for exceptional academic profiles. The <em>realistic</em> scholarships for solid-but-not-exceptional students are partial awards of ₹3–12L.
            </p>
            <p>
              <strong>UK — GREAT Scholarships:</strong> The British Council's GREAT Scholarship gives <strong>£10,000 (≈₹10L)</strong> to Indian students at participating UK universities including Glasgow, Edinburgh, and Manchester. Available for 1-year master's programs. Requirements: strong academic record (typically 70%+ bachelor's), a compelling personal statement, and applying by January for September intake. Applications open around October.
            </p>
            <p>
              <strong>UK — University merit scholarships:</strong> Glasgow University Postgraduate Merit Scholarship offers £3,000–5,000 automatically to strong applicants (no separate application needed if your IELTS and academic scores qualify). Edinburgh Global Scholarship gives £5,000 to select students from developing countries.
            </p>
            <p>
              <strong>Canada — Entrance and in-course awards:</strong> McMaster awards entrance scholarships of <strong>$5,000–15,000 CAD (₹3–9L)</strong> to international graduate students based on academic merit. Ontario Graduate Scholarship (OGS) is a provincial award available to enrolled students in Ontario universities (Toronto, McMaster, Waterloo) — value: $10,000 CAD, requires 3.7/4.0 GPA or equivalent 75%+ in bachelor's.
            </p>
            <p>
              <strong>What middle-class students should realistically expect:</strong> Partial scholarships covering 20–40% of total costs are achievable with a 70%+ bachelor's and a well-written SOP. Full scholarships to ranked universities are rare without exceptional research backgrounds or publications. A practical approach: apply to 2–3 partial scholarships alongside your main application, and plan financing for the remainder via education loan.
            </p>
            <p>
              <strong>Tip — apply to scholarship-rich programs early:</strong> Scholarship allocations fill in order of application. Submitting 6+ months before the intake dramatically increases your chances versus applying 3 months before.
            </p>
            <div className="space-y-2 mt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Scholarship-eligible programs at our partner universities:</p>
              <CourseCard name="Design Informatics MA" uniName="University of Edinburgh" uniSlug="university-of-edinburgh" slug="edinburgh-design-informatics-ma-eca" inrLakh="17.1" ielts={6.5} duration="1 year" />
              <CourseCard name="Economics [MRes]" uniName="University of Glasgow" uniSlug="university-of-glasgow" slug="glasgow-economics-mres" inrLakh="13.9" ielts={6.5} duration="1 year" />
              <CourseCard name="Community and Public Health" uniName="McMaster University" uniSlug="mcmaster-university" slug="mcmaster-community-and-public-health" inrLakh="13.6" ielts={6.5} duration="1 year" />
            </div>
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
              <strong>For master's degree programs (MSc, MA, MBA, MRes):</strong> Admissions offices at UK and Canadian universities look at your <em>bachelor's degree percentage</em>, not your 12th grade marks. If you have 60–65%+ in your bachelor's, a strong IELTS score (6.5+), and a clear SOP explaining your career goals, your 12th percentage is not part of the evaluation. This is not a loophole — it is standard admission policy. We have seen students with 50% in 12th routinely admitted to programs at Glasgow, Edinburgh, McMaster, and Toronto.
            </p>
            <p>
              <strong>For bachelor's degree programs (UG, BEng, BSc):</strong> This is where 12th marks matter. Most UK and Canadian universities require 60–70% in 10+2 for direct bachelor's entry. If you have 50–55%, <em>pathway/foundation programs</em> are the route — these are 1-year preparatory programs (at INTO, Kaplan, or university-run foundations) that accept lower 12th percentages and guarantee university entry on successful completion. Budget ₹8–15L for the foundation year in addition to the main degree.
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
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Accessible master's programs (bachelor's degree is what counts):</p>
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
              Let's be direct: the 9 universities in our real-data database (Glasgow, Edinburgh, Manchester, UCL, Warwick, Toronto, McMaster, UBC, Waterloo) all require <strong>IELTS 6.5 minimum</strong>. Anyone telling you these universities take 5.5 is either wrong or referring to a specific pre-sessional pathway — not direct admission.
            </p>
            <p>
              <strong>What IELTS 5.5–6.0 actually gets you:</strong> Pre-sessional English programs. Every major UK university in our database has a language centre that offers 10–20 week intensive English courses. Here's the logic: you get a conditional offer for the master's degree, enrol in the pre-sessional at a score of 5.5–6.0, pass the pre-sessional exit test (which is equivalent to IELTS 6.5), and then proceed directly to the main program without another IELTS sitting. Glasgow University Language Centre, Edinburgh English Language Teaching Centre, and Manchester Language Centre all run this structure.
            </p>
            <p>
              <strong>Alternative tests that some students find easier than IELTS:</strong> The Duolingo English Test (DET) is accepted by McMaster (DET 120+), Waterloo (DET 120+), and Toronto. It costs ₹3,500 (vs ₹17,000 for IELTS), can be taken at home, and results come in 48 hours. Some students who struggle with IELTS format do better on DET. PTE Academic is another option — accepted at all UK universities in our database — and is computer-based with scores available in 5 business days.
            </p>
            <p>
              <strong>If retaking IELTS is the plan:</strong> Moving from 6.0 to 6.5 typically requires 6–10 weeks of focused preparation. The Writing section (Task 2 academic essays) is where most Indian students lose 0.5–1 band. IELTS Writing Task 2 preparation — practicing 3–4 essays weekly with structured feedback — is the single highest-ROI use of preparation time.
            </p>
            <p>
              <strong>Universities with genuinely lower IELTS requirements (not in our current database):</strong> Several UK universities (Coventry, Northumbria, Plymouth, Huddersfield) accept 6.0 overall with 5.5 per band for select programs. These are valid, accredited institutions — lower ranked than our current 9, but with legitimate degrees and post-study work visas.
            </p>
            <div className="space-y-2 mt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Programs with pre-sessional English routes (IELTS 5.5 accepted for conditional entry):</p>
              <CourseCard name="Ecology &amp; Environmental Biology [MRes]" uniName="University of Glasgow" uniSlug="university-of-glasgow" slug="glasgow-ecology-environmental-biology-mres" inrLakh="13.9" ielts={6.5} duration="1 year" />
              <CourseCard name="AI and Analytics" uniName="McMaster University" uniSlug="mcmaster-university" slug="mcmaster-ai-and-analytics" inrLakh="13.6" ielts={6.5} duration="1 year" />
              <CourseCard name="Applied AI and Data-Driven Decision-Making" uniName="McMaster University" uniSlug="mcmaster-university" slug="mcmaster-applied-ai-and-datadriven-decisionmaking" inrLakh="13.6" ielts={6.5} duration="1 year" />
            </div>
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
