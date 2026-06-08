import { generateCourseContent, type CourseForContent } from '@/lib/courseContent';

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

  return (
    <>
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
    </>
  );
}
