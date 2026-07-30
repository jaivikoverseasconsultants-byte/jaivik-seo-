// Wave 2 integration — University of Central Lancashire (11 courses)
// Source: data/wave2-crawl/university-of-central-lancashire-courses.ts, manually reviewed and cleaned 2026-07-29 before
// integration (junk/duplicate/news-page rows dropped, implausible fee/duration values
// nulled — see DATA-AUDIT.md "Wave 2" section for the specific per-file findings).
// Fees/IELTS are 0 where not confidently extracted — do not treat 0 as a real value.

export interface UclanCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualGBP: number; annualUSD: number; annualINR: number;
  ieltsMin: number; toeflMin: number; campus: string; intakeMonths: string[];
  country: string; state: string; city: string; countryCode: string;
}

export const uclanCourses: UclanCourse[] = [
  {
    "id": "uclan-1",
    "name": "Astrophysics",
    "slug": "university-of-central-lancashire-astrophysics",
    "url": "https://www.uclan.ac.uk/postgraduate-research/courses/msc-by-research-astrophysics",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 6.5,
    "toeflMin": 0,
    "campus": "Preston Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "Preston",
    "countryCode": "GB"
  },
  {
    "id": "uclan-2",
    "name": "Chemistry",
    "slug": "university-of-central-lancashire-chemistry",
    "url": "https://www.uclan.ac.uk/postgraduate-research/courses/msc-by-research-chemistry",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 6.5,
    "toeflMin": 0,
    "campus": "Preston Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "Preston",
    "countryCode": "GB"
  },
  {
    "id": "uclan-3",
    "name": "Physics",
    "slug": "university-of-central-lancashire-physics",
    "url": "https://www.uclan.ac.uk/postgraduate-research/courses/msc-by-research-physics",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 6.5,
    "toeflMin": 0,
    "campus": "Preston Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "Preston",
    "countryCode": "GB"
  },
  {
    "id": "uclan-4",
    "name": "Transdisciplinary",
    "slug": "university-of-central-lancashire-transdisciplinary",
    "url": "https://www.uclan.ac.uk/postgraduate-research/courses/transdisciplinary-msc-by-research",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "Not specified",
    "durationYears": 0,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 6.5,
    "toeflMin": 0,
    "campus": "Preston Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "Preston",
    "countryCode": "GB"
  },
  {
    "id": "uclan-5",
    "name": "Adolescent Sports Medicine",
    "slug": "university-of-central-lancashire-adolescent-sports-medicine",
    "url": "https://www.uclan.ac.uk/postgraduate/courses/adolescent-sports-medicine-pgcert",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 6,
    "toeflMin": 0,
    "campus": "Preston Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "Preston",
    "countryCode": "GB"
  },
  {
    "id": "uclan-6",
    "name": "Advanced Community Nurse Specialist Practitioner",
    "slug": "university-of-central-lancashire-advanced-community-nurse-specialist-practitioner",
    "url": "https://www.uclan.ac.uk/postgraduate/courses/advanced-community-nurse-pgdip",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 6,
    "toeflMin": 0,
    "campus": "Preston Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "Preston",
    "countryCode": "GB"
  },
  {
    "id": "uclan-7",
    "name": "Advanced Pharmacy Practice",
    "slug": "university-of-central-lancashire-advanced-pharmacy-practice",
    "url": "https://www.uclan.ac.uk/postgraduate/courses/advanced-pharmacy-practice-msc",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 7,
    "toeflMin": 0,
    "campus": "Preston Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "Preston",
    "countryCode": "GB"
  },
  {
    "id": "uclan-8",
    "name": "Aerospace Engineering",
    "slug": "university-of-central-lancashire-aerospace-engineering",
    "url": "https://www.uclan.ac.uk/postgraduate/courses/aerospace-engineering-msc",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 6.5,
    "toeflMin": 0,
    "campus": "Preston Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "Preston",
    "countryCode": "GB"
  },
  {
    "id": "uclan-9",
    "name": "Applied Clinical Psychology",
    "slug": "university-of-central-lancashire-applied-clinical-psychology",
    "url": "https://www.uclan.ac.uk/postgraduate/courses/applied-clinical-psychology-msc",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 11500,
    "annualUSD": 14605,
    "annualINR": 1230500,
    "ieltsMin": 6,
    "toeflMin": 0,
    "campus": "Preston Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "Preston",
    "countryCode": "GB"
  },
  {
    "id": "uclan-10",
    "name": "Applied Public Health",
    "slug": "university-of-central-lancashire-applied-public-health",
    "url": "https://www.uclan.ac.uk/postgraduate/courses/applied-public-health-msc",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "Not specified",
    "durationYears": 0,
    "annualGBP": 9450,
    "annualUSD": 12002,
    "annualINR": 1011150,
    "ieltsMin": 6.5,
    "toeflMin": 0,
    "campus": "Preston Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "Preston",
    "countryCode": "GB"
  },
  {
    "id": "uclan-11",
    "name": "Architecture (Part II)",
    "slug": "university-of-central-lancashire-architecture-part-ii",
    "url": "https://www.uclan.ac.uk/postgraduate/courses/architecture-part-ii-march",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "2 years",
    "durationYears": 2,
    "annualGBP": 9535,
    "annualUSD": 12109,
    "annualINR": 1020245,
    "ieltsMin": 6,
    "toeflMin": 0,
    "campus": "Preston Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "Preston",
    "countryCode": "GB"
  }
];

export function getUclanCourseBySlug(slug: string) {
  return uclanCourses.find(c => c.slug === slug) ?? null;
}
