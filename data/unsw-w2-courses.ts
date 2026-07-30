// Wave 2 integration — UNSW Sydney (3 courses)
// Source: data/wave2-crawl/unsw-sydney-courses.ts, manually reviewed and cleaned 2026-07-29 before
// integration (junk/duplicate/news-page rows dropped, implausible fee/duration values
// nulled — see DATA-AUDIT.md "Wave 2" section for the specific per-file findings).
// Fees/IELTS are 0 where not confidently extracted — do not treat 0 as a real value.

export interface UnswW2Course {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualAUD: number; annualUSD: number; annualINR: number;
  ieltsMin: number; toeflMin: number; campus: string; intakeMonths: string[];
  country: string; state: string; city: string; countryCode: string;
}

export const unswW2Courses: UnswW2Course[] = [
  {
    "id": "unsw-w2-1",
    "name": "Master of Philosophy",
    "slug": "unsw-sydney-master-of-philosophy",
    "url": "https://www.unsw.edu.au/arts-design-architecture/study-with-us/postgraduate-research/master-of-philosophy",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "1.5 years",
    "durationYears": 1.5,
    "annualAUD": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "Sydney Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "Australia",
    "state": "New South Wales",
    "city": "Sydney",
    "countryCode": "AU"
  },
  {
    "id": "unsw-w2-2",
    "name": "Master of Laws / Master of Business Administration (Law)",
    "slug": "unsw-sydney-master-of-laws-master-of-business-administration-law",
    "url": "https://www.unsw.edu.au/business/our-schools/agsm/learn-with-us/agsm-programs/llm-mba-law",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "5 years",
    "durationYears": 5,
    "annualAUD": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "Sydney Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "Australia",
    "state": "New South Wales",
    "city": "Sydney",
    "countryCode": "AU"
  },
  {
    "id": "unsw-w2-3",
    "name": "AGSM Master of Business Administration Extension",
    "slug": "unsw-sydney-agsm-master-of-business-administration-extension",
    "url": "https://www.unsw.edu.au/business/our-schools/agsm/learn-with-us/agsm-programs/mba-extension",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "2 years",
    "durationYears": 2,
    "annualAUD": 87500,
    "annualUSD": 57750,
    "annualINR": 4812500,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "Sydney Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "Australia",
    "state": "New South Wales",
    "city": "Sydney",
    "countryCode": "AU"
  }
];

export function getUnswW2CourseBySlug(slug: string) {
  return unswW2Courses.find(c => c.slug === slug) ?? null;
}
