// Wave 2 integration — Brunel University London (2 courses)
// Source: data/wave2-crawl/brunel-university-london-courses.ts, manually reviewed and cleaned 2026-07-29 before
// integration (junk/duplicate/news-page rows dropped, implausible fee/duration values
// nulled — see DATA-AUDIT.md "Wave 2" section for the specific per-file findings).
// Fees/IELTS are 0 where not confidently extracted — do not treat 0 as a real value.

export interface BrunelW2Course {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualGBP: number; annualUSD: number; annualINR: number;
  ieltsMin: number; toeflMin: number; campus: string; intakeMonths: string[];
  country: string; state: string; city: string; countryCode: string;
}

export const brunelW2Courses: BrunelW2Course[] = [
  {
    "id": "brunel-w2-1",
    "name": "Intellectual Property Law Postgraduate Certificate",
    "slug": "brunel-university-london-intellectual-property-law-postgraduate-certificate",
    "url": "https://www.brunel.ac.uk/study/courses/intellectual-property-law-postgraduate-certificate",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "8 months",
    "durationYears": 0.67,
    "annualGBP": 6000,
    "annualUSD": 7620,
    "annualINR": 642000,
    "ieltsMin": 6.5,
    "toeflMin": 0,
    "campus": "Uxbridge Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "Uxbridge",
    "countryCode": "GB"
  },
  {
    "id": "brunel-w2-2",
    "name": "Data Science and Analytics MSc by Research",
    "slug": "brunel-university-london-data-science-and-analytics-msc-by-research",
    "url": "https://www.brunel.ac.uk/study/courses/msc-by-research-in-data-science-and-analytics",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "Not specified",
    "durationYears": 0,
    "annualGBP": 14435,
    "annualUSD": 18332,
    "annualINR": 1544545,
    "ieltsMin": 6.5,
    "toeflMin": 0,
    "campus": "Uxbridge Campus",
    "intakeMonths": [
      "September"
    ],
    "country": "UK",
    "state": "England",
    "city": "Uxbridge",
    "countryCode": "GB"
  }
];

export function getBrunelW2CourseBySlug(slug: string) {
  return brunelW2Courses.find(c => c.slug === slug) ?? null;
}
