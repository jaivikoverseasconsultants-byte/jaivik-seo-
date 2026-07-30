// Wave 2 integration — University of Greenwich (20 courses)
// Source: data/wave2-crawl/university-of-greenwich-courses.ts, manually reviewed and cleaned 2026-07-29 before
// integration (junk/duplicate/news-page rows dropped, implausible fee/duration values
// nulled — see DATA-AUDIT.md "Wave 2" section for the specific per-file findings).
// Fees/IELTS are 0 where not confidently extracted — do not treat 0 as a real value.

export interface GreenwichCourse {
  id: string; name: string; slug: string; url: string;
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualGBP: number; annualUSD: number; annualINR: number;
  ieltsMin: number; toeflMin: number; campus: string; intakeMonths: string[];
  country: string; state: string; city: string; countryCode: string;
}

export const greenwichCourses: GreenwichCourse[] = [
  {
    "id": "greenwich-1",
    "name": "Architectural Practice, PGDip (ARB/RIBA Part 3 Exemption)",
    "slug": "university-of-greenwich-architectural-practice-pgdip-arbriba-part-3-exemption",
    "url": "https://www.gre.ac.uk/postgraduate-courses/ach/architectural-practice-pgdip-arb-riba-part-3-exemption",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 3950,
    "annualUSD": 5017,
    "annualINR": 422650,
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
    "id": "greenwich-2",
    "name": "Architecture Part 2, MArch",
    "slug": "university-of-greenwich-architecture-part-2-march",
    "url": "https://www.gre.ac.uk/postgraduate-courses/ach/architecture-part-2-march",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "2 years",
    "durationYears": 2,
    "annualGBP": 9790,
    "annualUSD": 12433,
    "annualINR": 1047530,
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
    "id": "greenwich-3",
    "name": "Criminology and Criminal Psychology, MSc",
    "slug": "university-of-greenwich-criminology-and-criminal-psychology-msc",
    "url": "https://www.gre.ac.uk/postgraduate-courses/ach/criminology-and-criminal-psychology-msc",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 11800,
    "annualUSD": 14986,
    "annualINR": 1262600,
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
    "id": "greenwich-4",
    "name": "Fintech and Finance, MSc",
    "slug": "university-of-greenwich-fintech-and-finance-msc",
    "url": "https://www.gre.ac.uk/postgraduate-courses/bus/fintech-and-finance-msc",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16300,
    "annualUSD": 20701,
    "annualINR": 1744100,
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
    "id": "greenwich-5",
    "name": "Child and Adolescent Psychology, MSc",
    "slug": "university-of-greenwich-child-and-adolescent-psychology-msc",
    "url": "https://www.gre.ac.uk/postgraduate-courses/eduhea/childadolpsych",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 11800,
    "annualUSD": 14986,
    "annualINR": 1262600,
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
    "id": "greenwich-6",
    "name": "Enhanced Clinical Practice, PGDip",
    "slug": "university-of-greenwich-enhanced-clinical-practice-pgdip",
    "url": "https://www.gre.ac.uk/postgraduate-courses/eduhea/enhanced-professional-practice-pgdip",
    "level": "Master",
    "studyLevel": "Postgraduate",
    "duration": "2 years",
    "durationYears": 2,
    "annualGBP": 3000,
    "annualUSD": 3810,
    "annualINR": 321000,
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
    "id": "greenwich-7",
    "name": "Forensic Psychology, MSc",
    "slug": "university-of-greenwich-forensic-psychology-msc",
    "url": "https://www.gre.ac.uk/postgraduate-courses/eduhea/forensic-psychology-msc",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 11800,
    "annualUSD": 14986,
    "annualINR": 1262600,
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
    "id": "greenwich-8",
    "name": "Global Health Management, MSc",
    "slug": "university-of-greenwich-global-health-management-msc",
    "url": "https://www.gre.ac.uk/postgraduate-courses/eduhea/global-health-management-msc",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 11800,
    "annualUSD": 14986,
    "annualINR": 1262600,
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
    "id": "greenwich-9",
    "name": "Global Public Health MSc",
    "slug": "university-of-greenwich-global-public-health-msc",
    "url": "https://www.gre.ac.uk/postgraduate-courses/eduhea/msc-global-public-health",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 11800,
    "annualUSD": 14986,
    "annualINR": 1262600,
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
    "id": "greenwich-10",
    "name": "International PGCE (Online)",
    "slug": "university-of-greenwich-international-pgce-online",
    "url": "https://www.gre.ac.uk/postgraduate-courses/eduhea/international-postgraduate-certificate-in-education",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 3000,
    "annualUSD": 3810,
    "annualINR": 321000,
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
    "id": "greenwich-11",
    "name": "Nursing (Adult Nursing), MSc",
    "slug": "university-of-greenwich-nursing-adult-nursing-msc",
    "url": "https://www.gre.ac.uk/postgraduate-courses/eduhea/nursing-adult-nursing",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "2 years",
    "durationYears": 2,
    "annualGBP": 0,
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
    "id": "greenwich-12",
    "name": "Nursing (Mental Health Nursing), MSc",
    "slug": "university-of-greenwich-nursing-mental-health-nursing-msc",
    "url": "https://www.gre.ac.uk/postgraduate-courses/eduhea/nursing-mental-health-nursing-msc",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "2 years",
    "durationYears": 2,
    "annualGBP": 0,
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
    "id": "greenwich-13",
    "name": "Occupational Psychology, MSc",
    "slug": "university-of-greenwich-occupational-psychology-msc",
    "url": "https://www.gre.ac.uk/postgraduate-courses/eduhea/occupational-psychology-msc",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 11800,
    "annualUSD": 14986,
    "annualINR": 1262600,
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
    "id": "greenwich-14",
    "name": "Sport and Exercise Psychology, MSc",
    "slug": "university-of-greenwich-sport-and-exercise-psychology-msc",
    "url": "https://www.gre.ac.uk/postgraduate-courses/eduhea/sport-and-exercise-psychology",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 11800,
    "annualUSD": 14986,
    "annualINR": 1262600,
    "ieltsMin": 6.5,
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
    "id": "greenwich-15",
    "name": "Advanced Chemical Engineering, MSc",
    "slug": "university-of-greenwich-advanced-chemical-engineering-msc",
    "url": "https://www.gre.ac.uk/postgraduate-courses/engsci/advanced-chemical-engineering-msc",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 11800,
    "annualUSD": 14986,
    "annualINR": 1262600,
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
    "id": "greenwich-16",
    "name": "Applied Food Safety and Quality Management with Industrial Practice, MSc",
    "slug": "university-of-greenwich-applied-food-safety-and-quality-management-with-industrial-practice-msc",
    "url": "https://www.gre.ac.uk/postgraduate-courses/engsci/applied-food-safety-and-quality-management-with-industrial-practice-msc",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "2 years",
    "durationYears": 2,
    "annualGBP": 14950,
    "annualUSD": 18987,
    "annualINR": 1599650,
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
    "id": "greenwich-17",
    "name": "Big Data and Business Intelligence, MSc",
    "slug": "university-of-greenwich-big-data-and-business-intelligence-msc",
    "url": "https://www.gre.ac.uk/postgraduate-courses/engsci/big-data-and-business-intelligence-msc",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 11800,
    "annualUSD": 14986,
    "annualINR": 1262600,
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
    "id": "greenwich-18",
    "name": "Civil Engineering with Industrial Practice, MSc",
    "slug": "university-of-greenwich-civil-engineering-with-industrial-practice-msc",
    "url": "https://www.gre.ac.uk/postgraduate-courses/engsci/civil-engineering-with-industrial-practice-msc",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "2 years",
    "durationYears": 2,
    "annualGBP": 14950,
    "annualUSD": 18987,
    "annualINR": 1599650,
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
    "id": "greenwich-19",
    "name": "Computer Forensics and Cyber Security, MSc",
    "slug": "university-of-greenwich-computer-forensics-and-cyber-security-msc",
    "url": "https://www.gre.ac.uk/postgraduate-courses/engsci/computer-forensics-and-cyber-security-msc",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 11800,
    "annualUSD": 14986,
    "annualINR": 1262600,
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
    "id": "greenwich-20",
    "name": "Computer Science, MSc",
    "slug": "university-of-greenwich-computer-science-msc",
    "url": "https://www.gre.ac.uk/postgraduate-courses/engsci/computer-science-msc",
    "level": "Postgraduate",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 11800,
    "annualUSD": 14986,
    "annualINR": 1262600,
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

export function getGreenwichCourseBySlug(slug: string) {
  return greenwichCourses.find(c => c.slug === slug) ?? null;
}
