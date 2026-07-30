// Wave 2 integration — Imperial College London (8 courses)
// Source: data/wave2-crawl/imperial-college-london-courses.ts, manually reviewed and cleaned 2026-07-29 before
// integration (junk/duplicate/news-page rows dropped, implausible fee/duration values
// nulled — see DATA-AUDIT.md "Wave 2" section for the specific per-file findings).
// Fees/IELTS are 0 where not confidently extracted — do not treat 0 as a real value.

export interface ImperialCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualUSD: number; annualINR: number;
  ieltsMin: number; toeflMin: number; campus: string; intakeMonths: string[];
  country: string; state: string; city: string; countryCode: string;
}

export const imperialCourses: ImperialCourse[] = [
  {
    "id": "imperial-1",
    "name": "Postgraduate Certificate in Clinical Education",
    "slug": "imperial-college-london-postgraduate-certificate-in-clinical-education",
    "url": "https://www.imperial.ac.uk/staff/educational-development/programmes/postgraduate-certificate-in-clinical-education-/",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "Not specified",
    "durationYears": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "imperial-2",
    "name": "MSc in Quantum Fields and Fundamental Forces",
    "slug": "imperial-college-london-msc-in-quantum-fields-and-fundamental-forces",
    "url": "https://www.imperial.ac.uk/a-z-research/theoretical-physics/postgraduate-study/msc-in-quantum-fields-and-fundamental-forces/",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "Not specified",
    "durationYears": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "imperial-3",
    "name": "MSc Environmental Technology",
    "slug": "imperial-college-london-msc-environmental-technology",
    "url": "https://www.imperial.ac.uk/a-z-research/anglian-water/education/msc-environmental-technology/",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "Not specified",
    "durationYears": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "imperial-4",
    "name": "Computing (Artificial Intelligence and Machine Learning) (MEng)",
    "slug": "imperial-college-london-computing-artificial-intelligence-and-machine-learning-meng",
    "url": "https://www.imperial.ac.uk/engineering/departments/computing/prospective-students/courses/ug/beng-meng-computing/meng-comp-ai/",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "Not specified",
    "durationYears": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "imperial-5",
    "name": "Environmental Engineering MSc Courses",
    "slug": "imperial-college-london-environmental-engineering-msc-courses",
    "url": "https://www.imperial.ac.uk/engineering/departments/civil-engineering/prospective-students/postgraduate-taught-admissions/environmental-engineering-msc-courses/",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "imperial-6",
    "name": "MSc Engineering Fluid Mechanics for the Offshore, Coastal and Built environments",
    "slug": "imperial-college-london-msc-engineering-fluid-mechanics-for-the-offshore-coastal-and-built-environments",
    "url": "https://www.imperial.ac.uk/engineering/departments/civil-engineering/prospective-students/postgraduate-taught-admissions/msc-engineering-fluid-mechanics/",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "imperial-7",
    "name": "Geotechnical Engineering MSc Courses",
    "slug": "imperial-college-london-geotechnical-engineering-msc-courses",
    "url": "https://www.imperial.ac.uk/engineering/departments/civil-engineering/prospective-students/postgraduate-taught-admissions/msc-geotechnical-engineering/",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  },
  {
    "id": "imperial-8",
    "name": "MSc Advanced Materials for Sustainable Infrastructure",
    "slug": "imperial-college-london-msc-advanced-materials-for-sustainable-infrastructure",
    "url": "https://www.imperial.ac.uk/engineering/departments/civil-engineering/prospective-students/postgraduate-taught-admissions/msc-advanced-materials-sustainable-infrastructure/",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "London Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "London",
    "countryCode": "GB"
  }
];

export function getImperialCourseBySlug(slug: string) {
  return imperialCourses.find(c => c.slug === slug) ?? null;
}
