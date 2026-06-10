import { generateCourseContent, type CourseForContent } from '@/lib/courseContent';
import CurrencyConverter from '@/components/CurrencyConverter';
import JsonLd from '@/components/JsonLd';

interface Props {
  course: CourseForContent;
  universityName: string;
  universitySlug: string;
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

      {/* Global currency disclaimer footer */}
      <div className="text-xs text-gray-400 border-t border-gray-100 pt-3 px-1">
        Currency conversions are indicative only. Rates updated periodically. Contact us for current fee estimates in INR.
      </div>
    </>
  );
}
