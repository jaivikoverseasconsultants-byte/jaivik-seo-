// Wave 2 integration — University of Plymouth (1 courses)
// Source: data/wave2-crawl/university-of-plymouth-courses.ts, manually reviewed and cleaned 2026-07-29 before
// integration (junk/duplicate/news-page rows dropped, implausible fee/duration values
// nulled — see DATA-AUDIT.md "Wave 2" section for the specific per-file findings).
// Fees/IELTS are 0 where not confidently extracted — do not treat 0 as a real value.

export interface PlymouthW2Course {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualGBP: number; annualUSD: number; annualINR: number;
  ieltsMin: number; toeflMin: number; campus: string; intakeMonths: string[];
  country: string; state: string; city: string; countryCode: string;
}

export const plymouthW2Courses: PlymouthW2Course[] = [
  {
    "id": "plymouth-w2-1",
    "name": "Marine Biology and Oceanography",
    "slug": "university-of-plymouth-marine-biology-and-oceanography",
    "url": "https://www.plymouth.ac.uk/courses/undergraduate/bsc-marine-biology-and-oceanography",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "Not specified",
    "durationYears": 0,
    "annualGBP": 19200,
    "annualUSD": 24384,
    "annualINR": 2054400,
    "ieltsMin": 0,
    "toeflMin": 0,
    "campus": "Plymouth Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "Plymouth",
    "countryCode": "GB"
  }
];

export function getPlymouthW2CourseBySlug(slug: string) {
  return plymouthW2Courses.find(c => c.slug === slug) ?? null;
}
