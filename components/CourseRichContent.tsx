import { generateCourseContent, type CourseForContent } from '@/lib/courseContent';
import CurrencyConverter from '@/components/CurrencyConverter';
import JsonLd from '@/components/JsonLd';
import Link from 'next/link';
import { getCoursesBySlug } from '@/data/university-course-registry';

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

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the tuition fee for ${course.name} at ${universityName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The annual tuition fee for ${course.name} at ${universityName} is $${course.annualUSD.toLocaleString()} USD (approximately ₹${inrLakh}L INR).`,
        },
      },
      {
        '@type': 'Question',
        name: `What IELTS score is required for ${course.name} at ${universityName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `A minimum IELTS score of ${course.ieltsMin} overall is required for ${course.name} at ${universityName}. TOEFL iBT ${course.toeflMin}+ is also accepted.`,
        },
      },
      {
        '@type': 'Question',
        name: `How long is ${course.name} at ${universityName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${course.name} at ${universityName} is a ${course.duration} ${course.level} program${course.durationYears > 1 ? ` (${course.durationYears} years)` : ''}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What are the intakes for ${course.name} at ${universityName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${universityName} offers ${intakesText} intake${course.intakeMonths.length > 1 ? 's' : ''} for ${course.name}. We recommend applying at least 3–4 months before the intake deadline.`,
        },
      },
      {
        '@type': 'Question',
        name: `Can Indian students apply for ${course.name} at ${universityName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, Indian students can apply for ${course.name} at ${universityName} in ${course.country}. Jaivik Overseas Consultants provides free application assistance, SOP guidance, and visa support for Indian students.`,
        },
      },
    ],
  };

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

  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={courseSchema} />
      {/* INR Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-start gap-2">
        <span className="text-amber-500 mt-0.5 flex-shrink-0">ℹ</span>
        <p className="text-xs text-amber-800">
          <strong>Currency note:</strong> INR figures are indicative (1 USD ≈ ₹83.5). Actual amount may vary with exchange rates.
          Use the converter below for a live estimate.
        </p>
      </div>

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
          Why Study {course.level === 'Bachelors' || course.level === 'Bachelor' ? course.name : `${course.name}`} in {course.country}?
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed">{whyStudyHere}</p>
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
          <p className="text-xs text-gold-800 font-semibold mb-1">
            Not sure if you qualify?
          </p>
          <p className="text-xs text-gold-700">
            Jaivik Overseas Consultants offers a free eligibility check — we review your academic profile and English scores against current entry requirements and advise on your application strategy at no cost.
          </p>
        </div>
      </div>

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
        <p className="text-xs text-gray-500 mb-3">
          Want a side-by-side comparison of {universityName} vs other universities for {fieldLabel} in {course.country}? Our advisors provide personalised shortlists based on your profile, budget, and career goals.
        </p>
        <Link
          href="/book-counselling"
          className="text-sm text-brand-700 font-semibold hover:underline"
        >
          Compare {universityName} with other universities →
        </Link>
      </div>

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
    </>
  );
}
