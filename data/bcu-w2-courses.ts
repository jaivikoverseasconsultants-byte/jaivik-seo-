// Wave 2 integration — Birmingham City University (5 courses)
// Source: data/wave2-crawl/birmingham-city-university-courses.ts, manually reviewed and cleaned 2026-07-29 before
// integration (junk/duplicate/news-page rows dropped, implausible fee/duration values
// nulled — see DATA-AUDIT.md "Wave 2" section for the specific per-file findings).
// Fees/IELTS are 0 where not confidently extracted — do not treat 0 as a real value.

export interface BcuW2Course {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualUSD: number; annualINR: number;
  ieltsMin: number; toeflMin: number; campus: string; intakeMonths: string[];
  country: string; state: string; city: string; countryCode: string;
}

export const bcuW2Courses: BcuW2Course[] = [
  {
    "id": "bcu-w2-1",
    "name": "BA (Hons) Acting",
    "slug": "birmingham-city-university-ba-hons-acting",
    "url": "https://www.bcu.ac.uk/conservatoire/acting-and-theatre/audition/ba-acting",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "Not specified",
    "durationYears": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "Birmingham Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "Birmingham",
    "countryCode": "GB"
  },
  {
    "id": "bcu-w2-2",
    "name": "BA (Hons) Applied Theatre (Community and Education)",
    "slug": "birmingham-city-university-ba-hons-applied-theatre-community-and-education",
    "url": "https://www.bcu.ac.uk/conservatoire/acting-and-theatre/audition/ba-applied-theatre-interview",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "Not specified",
    "durationYears": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "Birmingham Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "Birmingham",
    "countryCode": "GB"
  },
  {
    "id": "bcu-w2-3",
    "name": "BA (Hons) Stage Management",
    "slug": "birmingham-city-university-ba-hons-stage-management",
    "url": "https://www.bcu.ac.uk/conservatoire/acting-and-theatre/audition/ba-stage-management",
    "level": "Bachelor",
    "studyLevel": "Undergraduate",
    "duration": "Not specified",
    "durationYears": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "Birmingham Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "Birmingham",
    "countryCode": "GB"
  },
  {
    "id": "bcu-w2-4",
    "name": "Jazz - BMus",
    "slug": "birmingham-city-university-jazz-bmus",
    "url": "https://www.bcu.ac.uk/conservatoire/courses/bmus-honours-jazz-2026-27",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "9 years",
    "durationYears": 9,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 5.5,
    "toeflMin": 0,
    "campus": "Birmingham Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "Birmingham",
    "countryCode": "GB"
  },
  {
    "id": "bcu-w2-5",
    "name": "MBA Degrees (International)",
    "slug": "birmingham-city-university-mba-degrees-international",
    "url": "https://www.bcu.ac.uk/courses/mba-degrees-international",
    "level": "MBA",
    "studyLevel": "Postgraduate",
    "duration": "Not specified",
    "durationYears": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "Birmingham Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "Birmingham",
    "countryCode": "GB"
  }
];

export function getBcuW2CourseBySlug(slug: string) {
  return bcuW2Courses.find(c => c.slug === slug) ?? null;
}
