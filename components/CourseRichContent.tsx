import { generateCourseContent, type CourseForContent } from '@/lib/courseContent';
import { generateFaqs } from '@/lib/course-faqs';
import CurrencyConverter from '@/components/CurrencyConverter';
import JsonLd from '@/components/JsonLd';
import CourseFaqSection from '@/components/CourseFaqSection';
import Link from 'next/link';
import { getCoursesBySlug, findAlternativeCourses } from '@/data/university-course-registry';
import { getTrendingContext, getLocalGuidance } from '@/lib/trending-context';
import DeadlineCountdown from '@/components/DeadlineCountdown';

interface Props {
  course: CourseForContent;
  universityName: string;
  universitySlug: string;
}

function detectFieldLabel(name: string): string {
  const n = name.toLowerCase();
  if (/\b(artificial intelligence|machine learning|deep learning)\b/.test(n)) return 'AI & Machine Learning';
  if (/\b(data science|data analytics|big data)\b/.test(n)) return 'Data Science';
  if (/\b(computer science|software engineering|computing|cyber)\b/.test(n)) return 'Computer Science';
  if (/\b(mechanical|electrical|civil|chemical|aerospace) engineering\b/.test(n)) return 'Engineering';
  if (/\b(mba|business administration|business management)\b/.test(n)) return 'Business & Management';
  if (/\b(finance|accounting|economics|banking|actuarial)\b/.test(n)) return 'Finance';
  if (/\b(public health|nursing|biomedical|clinical|pharmacy)\b/.test(n)) return 'Health Sciences';
  if (/\b(law|legal|llm)\b/.test(n)) return 'Law';
  if (/\b(education|teaching|pedagogy)\b/.test(n)) return 'Education';
  if (/\b(psychology|social work|mental health)\b/.test(n)) return 'Psychology';
  if (/\b(architecture|urban design|interior design)\b/.test(n)) return 'Architecture & Design';
  if (/\b(marketing|communications|journalism|digital marketing)\b/.test(n)) return 'Marketing & Communications';
  if (/\b(biology|chemistry|physics|mathematics|statistics|biotechnology)\b/.test(n)) return 'Sciences';
  return 'Postgraduate Studies';
}

function getFieldKeywords(fieldLabel: string): string[] {
  const map: Record<string, string[]> = {
    'AI & Machine Learning': ['artificial intelligence', 'machine learning', 'deep learning'],
    'Data Science': ['data science', 'data analytics', 'big data'],
    'Computer Science': ['computer science', 'software engineering', 'computing'],
    'Engineering': ['mechanical engineering', 'electrical engineering', 'civil engineering', 'chemical engineering', 'aerospace'],
    'Business & Management': ['mba', 'business administration', 'business management', 'management'],
    'Finance': ['finance', 'accounting', 'economics', 'banking'],
    'Health Sciences': ['public health', 'nursing', 'biomedical', 'clinical'],
    'Law': ['law', 'llm', 'legal'],
    'Education': ['education', 'teaching'],
    'Psychology': ['psychology', 'social work'],
    'Architecture & Design': ['architecture', 'urban design'],
    'Marketing & Communications': ['marketing', 'communications', 'journalism'],
    'Sciences': ['biology', 'chemistry', 'physics', 'mathematics', 'statistics'],
  };
  return map[fieldLabel] ?? [];
}

function slugToUniName(slug: string): string {
  const NAMES: Record<string, string> = {
    'university-college-london': 'UCL',
    'unsw-sydney': 'UNSW Sydney',
    'uts-sydney': 'UTS Sydney',
    'national-university-of-singapore': 'NUS',
    'nanyang-technological-university': 'NTU',
    'mcmaster-university': 'McMaster',
    'university-of-manchester': 'Manchester',
    'university-of-edinburgh': 'Edinburgh',
    'university-of-warwick': 'Warwick',
    'university-of-british-columbia': 'UBC',
    'university-of-toronto': 'U of Toronto',
    'university-of-glasgow': 'Glasgow',
    'university-of-waterloo': 'Waterloo',
    'london-school-of-economics': 'LSE',
    'university-of-sheffield': 'Sheffield',
    'university-of-bristol': 'Bristol',
    'university-of-leeds': 'Leeds',
    'university-of-birmingham': 'Birmingham',
    'kings-college-london': "King's College London",
    'university-of-auckland': 'Auckland',
    'university-of-queensland': 'UQ',
    'monash-university': 'Monash',
  };
  return NAMES[slug] || slug.split('-').map(w => w[0]?.toUpperCase() + w.slice(1)).join(' ');
}

const MONTH_MAP: Record<string, number> = {
  January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
  July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
};
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const REF_MONTH = 6;
const REF_YEAR = 2026;

function computeIntakeStatus(month: string) {
  const mNum = MONTH_MAP[month] ?? 9;
  let diff = mNum - REF_MONTH;
  let year = REF_YEAR;
  if (diff <= 0) { diff += 12; year += 1; }

  const status: 'open' | 'soon' | 'upcoming' = diff <= 3 ? 'open' : diff <= 6 ? 'soon' : 'upcoming';

  let deadlineMNum = mNum - 3;
  let deadlineYear = year;
  if (deadlineMNum <= 0) { deadlineMNum += 12; deadlineYear -= 1; }
  const deadlineStr = `${MONTH_NAMES[deadlineMNum - 1]} ${deadlineYear}`;

  return { month, year, monthsAway: diff, deadlineStr, status };
}

export default function CourseRichContent({ course, universityName, universitySlug }: Props) {
  const { about, careerOutcomes, whyStudyHere, requirements } = generateCourseContent(
    course,
    universityName,
    universitySlug,
  );

  const countrySlug = course.country.toLowerCase().replace(/\s+/g, '-');
  const inrLakh = (course.annualINR / 100000).toFixed(1);
  const intakesText = course.intakeMonths.join(' and ');
  const fieldLabel = detectFieldLabel(course.name);
  const currentSlug = (course as any).slug as string | undefined;

  const relatedCourses = getCoursesBySlug(universitySlug)
    .filter(c => c.slug !== currentSlug)
    .slice(0, 3);

  const trendingContext = getTrendingContext(course.country);
  const localGuidance = getLocalGuidance(course.country);

  const intakeStatuses = course.intakeMonths.slice(0, 2).map(computeIntakeStatus);

  const fieldKeywords = getFieldKeywords(fieldLabel);
  const ieltsAlternatives = findAlternativeCourses(fieldKeywords, universitySlug, course.ieltsMin - 1, 2);
  const similarPrograms = findAlternativeCourses(fieldKeywords, universitySlug, undefined, 2);

  const faqs = generateFaqs(course, universityName, universitySlug);

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${course.name} at ${universityName}`,
    description: `${course.level} program in ${course.name} at ${universityName}, ${course.country}. Duration: ${course.duration}. Annual fee: $${course.annualUSD.toLocaleString()} USD.`,
    provider: {
      '@type': 'CollegeOrUniversity',
      name: universityName,
      sameAs: `https://study.jaivikoverseasconsultants.com/universities/${universitySlug}`,
    },
    offers: {
      '@type': 'Offer',
      price: course.annualUSD,
      priceCurrency: 'USD',
      description: `Annual tuition fee for ${course.name}`,
    },
    educationalLevel: course.level,
    timeToComplete: `P${course.durationYears}Y`,
    inLanguage: 'en',
    hasCourseInstance: course.intakeMonths.map(month => ({
      '@type': 'CourseInstance',
      courseMode: 'full-time',
      startDate: month,
      location: {
        '@type': 'Place',
        address: { '@type': 'PostalAddress', addressCountry: course.country },
      },
    })),
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: `Study Abroad Counselling for ${course.name}`,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'Jaivik Overseas Consultants',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '333 Orbit Plaza, Crossing Republik',
        addressLocality: 'Ghaziabad',
        addressRegion: 'Uttar Pradesh',
        postalCode: '201016',
        addressCountry: 'IN',
      },
    },
    areaServed: [
      'Ghaziabad', 'Noida', 'Delhi', 'Karnal', 'Kaithal',
      'Ambala', 'Panipat', 'Meerut', 'Gurgaon', 'Faridabad',
    ].map(city => ({ '@type': 'City', name: city })),
  };

  return (
    <>
      <JsonLd data={courseSchema} />
      <JsonLd data={serviceSchema} />

      {/* INR Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-start gap-2">
        <span className="text-amber-500 mt-0.5 flex-shrink-0">ℹ</span>
        <p className="text-xs text-amber-800">
          <strong>Currency note:</strong> INR figures are indicative (1 USD ≈ ₹83.5). Actual amount may vary with exchange rates.
          Use the converter below for a live estimate.
        </p>
      </div>

      {/* WhatsApp CTA — pre-filled with course + university */}
      <a
        href={`https://wa.me/919971226347?text=${encodeURIComponent(`Hi Jaivik Overseas, I'm interested in ${course.name} at ${universityName}. Please help me with admission, fees, and visa process.`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl px-5 py-4 transition-colors group"
      >
        <svg className="w-6 h-6 fill-white flex-shrink-0" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <div>
          <p className="font-bold text-sm leading-tight">Ask About {course.name} at {universityName}</p>
          <p className="text-green-100 text-xs mt-0.5">Tap to open WhatsApp — fees, visa, scholarships, deadlines</p>
        </div>
        <svg className="w-4 h-4 ml-auto opacity-60 group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </a>

      {/* Live Currency Converter */}
      <CurrencyConverter />

      {/* About This Program */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">About {course.name}</h2>
        <div className="space-y-3">
          {about.split('\n\n').map((para, i) => (
            <p key={i} className="text-gray-700 text-sm leading-relaxed">{para}</p>
          ))}
        </div>
      </div>

      {/* Career Outcomes */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Career Outcomes After {course.name}</h2>
        <p className="text-gray-700 text-sm leading-relaxed">{careerOutcomes}</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-green-700">
              ${Math.round((course.annualUSD || 0) * 4.5 / 1000)}K–${Math.round((course.annualUSD || 0) * 6.5 / 1000)}K
            </p>
            <p className="text-xs text-gray-500 mt-1">Typical Graduate Salary (USD/yr)</p>
          </div>
          <div className="bg-brand-50 rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-brand-700">{course.country}</p>
            <p className="text-xs text-gray-500 mt-1">Primary Job Market</p>
          </div>
        </div>
      </div>

      {/* Why Study Here */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Why Study {course.name} in {course.country}?
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed">{whyStudyHere}</p>
        {trendingContext && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-xs text-blue-800">
              <strong>📰 2026 Update:</strong> {trendingContext} — ask our counsellors how this affects your application.
            </p>
          </div>
        )}
        <div className="mt-4">
          <a
            href={`/universities/country/${countrySlug}`}
            className="text-sm text-brand-700 font-semibold hover:underline"
          >
            Full Study in {course.country} Guide →
          </a>
        </div>
      </div>

      {/* Entry Requirements */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Entry Requirements Summary</h2>
        <p className="text-xs text-gray-500 mb-4">
          Minimum eligibility for Indian students applying to {course.name} at {universityName}.
          Requirements vary by department — contact Jaivik Overseas for personalised eligibility assessment.
        </p>
        <ul className="space-y-2">
          {requirements.map((req, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
              <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              <span className="leading-relaxed">{req}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 p-4 bg-gold-50 border border-gold-200 rounded-xl">
          <p className="text-xs text-gold-800 font-semibold mb-1">Not sure if you qualify?</p>
          <p className="text-xs text-gold-700">
            Jaivik Overseas Consultants offers a free eligibility check — we review your academic profile and English scores against current entry requirements and advise on your application strategy at no cost.
          </p>
        </div>
      </div>

      {/* Section A — Live Intake Status */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Live Intake Status — 2026/27</h2>
        <div className="space-y-3">
          {intakeStatuses.map((intake, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 p-4 rounded-xl border ${
                intake.status === 'open'
                  ? 'bg-green-50 border-green-200'
                  : intake.status === 'soon'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <span className="text-lg flex-shrink-0 mt-0.5">
                {intake.status === 'open' ? '🟢' : intake.status === 'soon' ? '🟡' : '🔵'}
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {intake.month} {intake.year} —{' '}
                  {intake.status === 'open'
                    ? 'Applications OPEN'
                    : intake.status === 'soon'
                    ? `Opens in ~${intake.monthsAway} months`
                    : 'Next cycle upcoming'}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {intake.status === 'open'
                    ? `Apply now — intake in ${intake.monthsAway} month${intake.monthsAway !== 1 ? 's' : ''}. Estimated deadline: ${intake.deadlineStr}`
                    : `Estimated application deadline: ${intake.deadlineStr}. Apply early — strong profiles fill fast.`}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Link href="/book-counselling" className="block text-sm text-center text-brand-700 font-semibold mt-4 hover:underline">
          Confirm Your Application Deadline →
        </Link>
      </div>

      {/* Application Deadline Countdown */}
      <DeadlineCountdown intakeMonths={course.intakeMonths} />

      {/* Indian Students: Fees, Eligibility & Application */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {course.name} for Indian Students: Fees, Eligibility &amp; Application
        </h2>
        <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <p>
            The <strong>tuition fee for Indian students</strong> pursuing {course.name} at {universityName} is approximately ₹{inrLakh}L per year (USD ${course.annualUSD.toLocaleString()}). Total programme costs vary depending on duration — Indian students should also budget for living expenses, health insurance, and one-time application fees when planning finances.
          </p>
          <p>
            The <strong>IELTS requirement for Indian students</strong> applying to {course.name} at {universityName} is a minimum overall band of {course.ieltsMin}. Most universities require no individual sub-band below 6.0. TOEFL iBT {course.toeflMin}+ is typically accepted as an alternative, and PTE Academic scores may also be considered.
          </p>
          <p>
            For the <strong>intake for Indian students</strong>, {universityName} accepts applications for the {intakesText} intake{course.intakeMonths.length > 1 ? 's' : ''}. Starting your application 4–6 months before the deadline is strongly recommended to allow adequate time for document preparation, statement of purpose drafting, reference letters, and student visa processing.
          </p>
          <p>
            There are several <strong>scholarship for Indian students at {universityName}</strong> worth exploring — including merit-based university awards, government-sponsored scholarships (such as Commonwealth Scholarships and GREAT Scholarships for UK universities), and country-specific funding for students from India. Jaivik Overseas can help you identify and apply for scholarships you qualify for at no extra cost.
          </p>
        </div>
        <div className="mt-4 p-4 bg-brand-50 border border-brand-200 rounded-xl">
          <p className="text-xs text-brand-800 font-semibold mb-1">Free Scholarship &amp; Application Guidance</p>
          <p className="text-xs text-brand-700">
            Our counsellors have 13 years of experience and 99% visa success helping Indian students secure admissions and scholarships at {universityName}. Book a free session today.
          </p>
          <Link href="/book-counselling" className="inline-block mt-2 text-xs font-semibold text-brand-700 underline">
            Book Free Counselling →
          </Link>
        </div>
      </div>

      {/* Section B — IELTS Score Match */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Does Your IELTS Score Qualify?</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
            <span className="text-green-600 text-lg flex-shrink-0 mt-0.5">✅</span>
            <div>
              <p className="text-sm font-semibold text-green-800">IELTS {course.ieltsMin}+ — You qualify directly</p>
              <p className="text-xs text-green-700 mt-0.5">
                Your score meets the minimum requirement for {course.name} at {universityName}. Proceed with your application — contact us for SOP and document guidance.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <span className="text-yellow-600 text-lg flex-shrink-0 mt-0.5">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-yellow-800">
                IELTS {(course.ieltsMin - 0.5).toFixed(1)} — Pathway or pre-sessional programs may apply
              </p>
              <p className="text-xs text-yellow-700 mt-0.5">
                You may be eligible for a pre-sessional English course or conditional offer leading to direct entry. Ask us about {universityName}&apos;s pathway options.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <span className="text-red-500 text-lg flex-shrink-0 mt-0.5">❌</span>
            <div>
              <p className="text-sm font-semibold text-red-800">
                Below IELTS {(course.ieltsMin - 1).toFixed(1)} — Consider lower-threshold alternatives
              </p>
              <p className="text-xs text-red-700 mt-0.5 mb-2">
                Your score may not yet meet the requirement. Consider improving your IELTS or exploring similar {fieldLabel} programs with lower requirements:
              </p>
              {ieltsAlternatives.length > 0 ? (
                <div className="space-y-1.5">
                  {ieltsAlternatives.map(alt => (
                    <Link
                      key={alt.slug}
                      href={`/universities/${alt.universitySlug}/courses/${alt.slug}`}
                      className="block text-xs text-red-700 underline hover:text-red-900 font-medium"
                    >
                      {alt.name} at {slugToUniName(alt.universitySlug)} — IELTS {alt.ieltsMin}+ →
                    </Link>
                  ))}
                </div>
              ) : (
                <Link href="/book-counselling" className="text-xs text-red-700 underline font-medium">
                  Ask us about suitable alternatives →
                </Link>
              )}
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          PTE Academic {course.pteMin ?? Math.round(course.ieltsMin * 10 - 2)}+ and TOEFL iBT {course.toeflMin}+ are also accepted as IELTS equivalents at most institutions.
        </p>
      </div>

      {/* How Does This University Compare */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          How Does {universityName} Compare for {fieldLabel}?
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          {universityName} charges USD ${course.annualUSD.toLocaleString()} per year for {course.name}, with an IELTS minimum of {course.ieltsMin} and {intakesText} intake{course.intakeMonths.length > 1 ? 's' : ''}. For Indian students evaluating options in {course.country}, this places {universityName} among the universities offering competitive {fieldLabel} programmes with strong graduate outcomes and post-study work rights.
        </p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-base font-bold text-gray-900">${course.annualUSD.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-0.5">Annual Tuition (USD)</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-base font-bold text-gray-900">{course.ieltsMin}+</p>
            <p className="text-xs text-gray-500 mt-0.5">IELTS Required</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-base font-bold text-gray-900">₹{inrLakh}L</p>
            <p className="text-xs text-gray-500 mt-0.5">Approx. in INR/yr</p>
          </div>
        </div>
        <Link href="/book-counselling" className="text-sm text-brand-700 font-semibold hover:underline">
          Compare {universityName} with other universities →
        </Link>
      </div>

      {/* Section D — Compare Similar Programs */}
      {similarPrograms.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Compare Similar {fieldLabel} Programs
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            How {universityName}&apos;s {course.name} compares to similar programs at other top universities:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-3 font-semibold text-gray-700">University</th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-700">Fee/yr (INR)</th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-700">IELTS</th>
                  <th className="text-right py-2 px-2 font-semibold text-gray-700">Duration</th>
                  <th className="text-right py-2 pl-2 font-semibold text-gray-700">Intake</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-brand-100 bg-brand-50">
                  <td className="py-2.5 pr-3 font-semibold text-brand-800">{universityName} ★</td>
                  <td className="text-right py-2.5 px-2 text-brand-700">₹{inrLakh}L</td>
                  <td className="text-right py-2.5 px-2 text-brand-700">{course.ieltsMin}+</td>
                  <td className="text-right py-2.5 px-2 text-brand-700">{course.duration}</td>
                  <td className="text-right py-2.5 pl-2 text-brand-700">{course.intakeMonths[0]}</td>
                </tr>
                {similarPrograms.map(prog => (
                  <tr key={prog.slug} className="border-b border-gray-100">
                    <td className="py-2.5 pr-3">
                      <Link
                        href={`/universities/${prog.universitySlug}/courses/${prog.slug}`}
                        className="text-brand-700 hover:underline font-medium"
                      >
                        {slugToUniName(prog.universitySlug)}
                      </Link>
                    </td>
                    <td className="text-right py-2.5 px-2 text-gray-700">
                      ₹{(prog.annualINR / 100000).toFixed(1)}L
                    </td>
                    <td className="text-right py-2.5 px-2 text-gray-700">{prog.ieltsMin}+</td>
                    <td className="text-right py-2.5 px-2 text-gray-700">{prog.duration}</td>
                    <td className="text-right py-2.5 pl-2 text-gray-700">{prog.intakeMonths[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            ★ Currently viewing. Fees are indicative. <Link href="/book-counselling" className="text-brand-700 underline">Ask Jaivik Overseas</Link> for exact current fees and personalised shortlists.
          </p>
        </div>
      )}

      {/* Application Details & Official Links */}
      {((course as any).url || (course as any).applicationFee || (course as any).englishWaiver || (course as any).applicationMode) && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Application Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(course as any).applicationFee && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 font-medium mb-1">Application Fee</p>
                <p className="text-sm font-semibold text-gray-900">{(course as any).applicationFee}</p>
              </div>
            )}
            {(course as any).applicationMode && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 font-medium mb-1">Application Mode</p>
                <p className="text-sm font-semibold text-gray-900">{(course as any).applicationMode}</p>
              </div>
            )}
            {(course as any).englishWaiver === true && (
              <div className="p-4 bg-green-50 rounded-xl flex items-center gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <div>
                  <p className="text-xs text-green-700 font-medium mb-0.5">English Waiver Available</p>
                  <p className="text-xs text-green-600">Students from English-medium schools may be exempt from IELTS/TOEFL</p>
                </div>
              </div>
            )}
          </div>
          {(course as any).url && (
            <div className="mt-4">
              <a
                href={(course as any).url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-brand-700 text-brand-700 hover:bg-brand-50 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                View Official Course Page →
              </a>
              <p className="text-xs text-gray-500 mt-2">Opens the university&apos;s official course page in a new tab</p>
            </div>
          )}
        </div>
      )}

      {/* Section C — For Students from Delhi NCR / Ghaziabad */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          For Students from Delhi NCR &amp; Ghaziabad — Local Visa Guidance
        </h2>
        <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
          {localGuidance.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-3 p-4 bg-brand-50 border border-brand-200 rounded-xl">
          <span className="text-brand-700 text-2xl flex-shrink-0">📍</span>
          <div>
            <p className="text-sm font-semibold text-brand-800">Jaivik Overseas Consultants — Ghaziabad</p>
            <p className="text-xs text-brand-700 mt-0.5">333 Orbit Plaza, Crossing Republik, Ghaziabad · 13 years experience · 99% visa success rate</p>
            <Link href="/book-counselling" className="text-xs font-semibold text-brand-700 underline mt-1.5 block">
              Book a Free Counselling Session →
            </Link>
          </div>
        </div>
      </div>

      {/* Related Courses from Same University */}
      {relatedCourses.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Other Courses at {universityName}</h2>
          <div className="space-y-3">
            {relatedCourses.map(rc => (
              <Link
                key={rc.slug}
                href={`/universities/${universitySlug}/courses/${rc.slug}`}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-brand-50 hover:border-brand-200 border border-transparent transition-colors group"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-brand-700">{rc.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{rc.level} · {rc.duration} · IELTS {rc.ieltsMin}+</p>
                </div>
                <span className="text-brand-700 text-sm font-bold ml-4 flex-shrink-0">→</span>
              </Link>
            ))}
          </div>
          <Link
            href={`/universities/${universitySlug}/courses`}
            className="block text-sm text-center text-brand-700 font-semibold mt-4 hover:underline"
          >
            View All {universityName} Courses →
          </Link>
        </div>
      )}

      {/* Global currency disclaimer footer */}
      <div className="text-xs text-gray-600 border-t border-gray-100 pt-3 px-1">
        Currency conversions are indicative only. Rates updated periodically. Contact us for current fee estimates in INR.
      </div>

      {/* Programmatic FAQ — computed from existing course/university data only */}
      <CourseFaqSection faqs={faqs} courseName={course.name} />
    </>
  );
}
