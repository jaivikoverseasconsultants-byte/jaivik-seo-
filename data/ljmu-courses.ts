// Postgraduate courses for Liverpool John Moores University — 50 programs
// URL pattern: https://www.ljmu.ac.uk/study/courses/[slug]
// CDX returned 0 for postgraduate-specific pattern. Real URL structure from live site.

export interface LjmuCourse {
  id: string; name: string; slug: string; url: string; officialUrlKind?: 'course' | 'course-listing'; withdrawn?: boolean; alternatives?: { name: string; slug: string }[];
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualGBP: number; annualUSD: number; annualINR: number; totalGBP: number;
  livingCostGBP: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
}

export const ljmuCourses: LjmuCourse[] = [
  {
    "id": "ljmu-1",
    "name": "MBA Business Administration",
    "slug": "ljmu-mba",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MBA",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 20000,
    "annualUSD": 25400,
    "annualINR": 2140000,
    "totalGBP": 20000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6.5,
    "toeflMin": 90,
    "pteMin": 65,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-2",
    "name": "MSc Data Science",
    "slug": "ljmu-msc-data-science",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates/2027/35895-data-science-msc/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 19000,
    "annualUSD": 24130,
    "annualINR": 2033000,
    "totalGBP": 19000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-3",
    "name": "MSc Accounting and Finance",
    "slug": "ljmu-msc-accounting-finance",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 18500,
    "annualUSD": 23495,
    "annualINR": 1979500,
    "totalGBP": 18500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6.5,
    "toeflMin": 87,
    "pteMin": 62,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-4",
    "name": "MSc Artificial Intelligence",
    "slug": "ljmu-msc-artificial-intelligence",
    "url": "https://www.ljmu.ac.uk/edtech/staff-guides/artificial-intelligence/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 19500,
    "annualUSD": 24765,
    "annualINR": 2086500,
    "totalGBP": 19500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-5",
    "name": "MSc Cyber Security",
    "slug": "ljmu-msc-cyber-security",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates/2027/35574-cyber-security-msc/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 18500,
    "annualUSD": 23495,
    "annualINR": 1979500,
    "totalGBP": 18500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-6",
    "name": "MSc Computer Science",
    "slug": "ljmu-msc-computer-science",
    "url": "https://www.ljmu.ac.uk/campaigns/computer-science/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 18500,
    "annualUSD": 23495,
    "annualINR": 1979500,
    "totalGBP": 18500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-7",
    "name": "MSc Project Management",
    "slug": "ljmu-msc-project-management",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates/2027/35442-project-management-msc/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 17500,
    "annualUSD": 22225,
    "annualINR": 1872500,
    "totalGBP": 17500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-8",
    "name": "MSc Digital Marketing",
    "slug": "ljmu-msc-digital-marketing",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates/2027/35371-digital-marketing-msc/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 18000,
    "annualUSD": 22860,
    "annualINR": 1926000,
    "totalGBP": 18000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-9",
    "name": "MSc International Business",
    "slug": "ljmu-msc-international-business",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 18500,
    "annualUSD": 23495,
    "annualINR": 1979500,
    "totalGBP": 18500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-10",
    "name": "MSc Human Resource Management",
    "slug": "ljmu-msc-human-resource-management",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 17000,
    "annualUSD": 21590,
    "annualINR": 1819000,
    "totalGBP": 17000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-11",
    "name": "MSc Finance",
    "slug": "ljmu-msc-finance",
    "url": "https://www.ljmu.ac.uk/about-us/structure/professional-services/finance/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 19000,
    "annualUSD": 24130,
    "annualINR": 2033000,
    "totalGBP": 19000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6.5,
    "toeflMin": 87,
    "pteMin": 62,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-12",
    "name": "MSc Marketing",
    "slug": "ljmu-msc-marketing",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 18000,
    "annualUSD": 22860,
    "annualINR": 1926000,
    "totalGBP": 18000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-13",
    "name": "MSc Supply Chain and Logistics",
    "slug": "ljmu-msc-supply-chain-logistics",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 17500,
    "annualUSD": 22225,
    "annualINR": 1872500,
    "totalGBP": 17500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-14",
    "name": "MSc Sport and Exercise Sciences",
    "slug": "ljmu-msc-sport-exercise-sciences",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 17000,
    "annualUSD": 21590,
    "annualINR": 1819000,
    "totalGBP": 17000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-15",
    "name": "MSc Sport Psychology",
    "slug": "ljmu-msc-sport-psychology",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates/2027/30905-sport-psychology-msc/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 17000,
    "annualUSD": 21590,
    "annualINR": 1819000,
    "totalGBP": 17000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6.5,
    "toeflMin": 87,
    "pteMin": 62,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-16",
    "name": "MSc Public Health",
    "slug": "ljmu-msc-public-health",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates/2027/36863-public-health-msc/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 17000,
    "annualUSD": 21590,
    "annualINR": 1819000,
    "totalGBP": 17000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6.5,
    "toeflMin": 87,
    "pteMin": 62,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-17",
    "name": "MSc Advanced Nursing Practice",
    "slug": "ljmu-msc-nursing-advanced-practice",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "2 years",
    "durationYears": 2,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 32000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6.5,
    "toeflMin": 87,
    "pteMin": 62,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-18",
    "name": "MSc Biomedical Science",
    "slug": "ljmu-msc-biomedical-science",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 18000,
    "annualUSD": 22860,
    "annualINR": 1926000,
    "totalGBP": 18000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-19",
    "name": "MSc Pharmacy",
    "slug": "ljmu-msc-pharmacy",
    "url": "https://www.ljmu.ac.uk/study/cpd/pharmacy/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 18000,
    "annualUSD": 22860,
    "annualINR": 1926000,
    "totalGBP": 18000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6.5,
    "toeflMin": 87,
    "pteMin": 62,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-20",
    "name": "MSc Health Informatics",
    "slug": "ljmu-msc-health-informatics",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 17500,
    "annualUSD": 22225,
    "annualINR": 1872500,
    "totalGBP": 17500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6.5,
    "toeflMin": 87,
    "pteMin": 62,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-21",
    "name": "MSc Environmental Management",
    "slug": "ljmu-msc-environmental-management",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 17000,
    "annualUSD": 21590,
    "annualINR": 1819000,
    "totalGBP": 17000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-22",
    "name": "MA Education",
    "slug": "ljmu-ma-education",
    "url": "https://www.ljmu.ac.uk/study/subjects/education/",
    "level": "MA",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 15500,
    "annualUSD": 19685,
    "annualINR": 1658500,
    "totalGBP": 15500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-23",
    "name": "MA Journalism",
    "slug": "ljmu-ma-journalism",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates/2027/36101-journalism-ma/",
    "level": "MA",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-24",
    "name": "MA Creative Writing",
    "slug": "ljmu-ma-creative-writing",
    "url": "https://www.ljmu.ac.uk/research/centres-and-institutes/research-institute-for-literature-and-cultural-history/expertise/creative-writing/",
    "level": "MA",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 15500,
    "annualUSD": 19685,
    "annualINR": 1658500,
    "totalGBP": 15500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-25",
    "name": "LLM International Law",
    "slug": "ljmu-llm-international-law",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "LLM",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 17000,
    "annualUSD": 21590,
    "annualINR": 1819000,
    "totalGBP": 17000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6.5,
    "toeflMin": 87,
    "pteMin": 62,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-26",
    "name": "MSc Architecture",
    "slug": "ljmu-msc-architecture",
    "url": "https://www.ljmu.ac.uk/study/subjects/architecture/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 18500,
    "annualUSD": 23495,
    "annualINR": 1979500,
    "totalGBP": 18500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6.5,
    "toeflMin": 87,
    "pteMin": 62,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-27",
    "name": "MSc Construction Management",
    "slug": "ljmu-msc-construction-management",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 17500,
    "annualUSD": 22225,
    "annualINR": 1872500,
    "totalGBP": 17500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-28",
    "name": "MSc Civil Engineering",
    "slug": "ljmu-msc-civil-engineering",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates/2027/35346-civil-engineering-msc/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 18500,
    "annualUSD": 23495,
    "annualINR": 1979500,
    "totalGBP": 18500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-29",
    "name": "MSc Electrical and Electronic Engineering",
    "slug": "ljmu-msc-electrical-engineering",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 18500,
    "annualUSD": 23495,
    "annualINR": 1979500,
    "totalGBP": 18500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-30",
    "name": "MSc Mechanical Engineering",
    "slug": "ljmu-msc-mechanical-engineering",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 18500,
    "annualUSD": 23495,
    "annualINR": 1979500,
    "totalGBP": 18500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-31",
    "name": "MSc Software Engineering",
    "slug": "ljmu-msc-software-engineering",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 18500,
    "annualUSD": 23495,
    "annualINR": 1979500,
    "totalGBP": 18500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-32",
    "name": "MSc Financial Management",
    "slug": "ljmu-msc-financial-management",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 18500,
    "annualUSD": 23495,
    "annualINR": 1979500,
    "totalGBP": 18500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6.5,
    "toeflMin": 87,
    "pteMin": 62,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-33",
    "name": "MSc Business Management",
    "slug": "ljmu-msc-business-management",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 18000,
    "annualUSD": 22860,
    "annualINR": 1926000,
    "totalGBP": 18000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-34",
    "name": "MSc Social Work",
    "slug": "ljmu-msc-social-work",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "2 years",
    "durationYears": 2,
    "annualGBP": 15000,
    "annualUSD": 19050,
    "annualINR": 1605000,
    "totalGBP": 30000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6.5,
    "toeflMin": 87,
    "pteMin": 62,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-35",
    "name": "MSc Applied Psychology",
    "slug": "ljmu-msc-applied-psychology",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 17500,
    "annualUSD": 22225,
    "annualINR": 1872500,
    "totalGBP": 17500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6.5,
    "toeflMin": 87,
    "pteMin": 62,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-36",
    "name": "MSc Events and Hospitality Management",
    "slug": "ljmu-msc-events-hospitality-management",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 17000,
    "annualUSD": 21590,
    "annualINR": 1819000,
    "totalGBP": 17000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-37",
    "name": "MSc Tourism Management",
    "slug": "ljmu-msc-tourism-management",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 17000,
    "annualUSD": 21590,
    "annualINR": 1819000,
    "totalGBP": 17000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-38",
    "name": "MSc Quantity Surveying",
    "slug": "ljmu-msc-quantity-surveying",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 17000,
    "annualUSD": 21590,
    "annualINR": 1819000,
    "totalGBP": 17000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-39",
    "name": "MSc Biopharmaceutical Science",
    "slug": "ljmu-msc-biopharmaceutical-science",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 18000,
    "annualUSD": 22860,
    "annualINR": 1926000,
    "totalGBP": 18000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-40",
    "name": "MSc Forensic Psychology",
    "slug": "ljmu-msc-forensic-psychology",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 17500,
    "annualUSD": 22225,
    "annualINR": 1872500,
    "totalGBP": 17500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6.5,
    "toeflMin": 87,
    "pteMin": 62,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-41",
    "name": "MSc Criminology",
    "slug": "ljmu-msc-criminology",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16500,
    "annualUSD": 20955,
    "annualINR": 1765500,
    "totalGBP": 16500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-42",
    "name": "MSc Nutrition",
    "slug": "ljmu-msc-nutrition",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 17000,
    "annualUSD": 21590,
    "annualINR": 1819000,
    "totalGBP": 17000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6.5,
    "toeflMin": 87,
    "pteMin": 62,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-43",
    "name": "MSc Physiotherapy (Pre-Registration)",
    "slug": "ljmu-msc-physiotherapy",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "2 years",
    "durationYears": 2,
    "annualGBP": 16500,
    "annualUSD": 20955,
    "annualINR": 1765500,
    "totalGBP": 33000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6.5,
    "toeflMin": 87,
    "pteMin": 62,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-44",
    "name": "MSc Occupational Therapy (Pre-Registration)",
    "slug": "ljmu-msc-occupational-therapy",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "2 years",
    "durationYears": 2,
    "annualGBP": 16500,
    "annualUSD": 20955,
    "annualINR": 1765500,
    "totalGBP": 33000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6.5,
    "toeflMin": 87,
    "pteMin": 62,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-45",
    "name": "MSc Diagnostic Imaging",
    "slug": "ljmu-msc-diagnostic-imaging",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 17000,
    "annualUSD": 21590,
    "annualINR": 1819000,
    "totalGBP": 17000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6.5,
    "toeflMin": 87,
    "pteMin": 62,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-46",
    "name": "MSc Data Analytics and Management",
    "slug": "ljmu-msc-data-analytics-management",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 18500,
    "annualUSD": 23495,
    "annualINR": 1979500,
    "totalGBP": 18500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-47",
    "name": "MSc Photonics and Related Technologies",
    "slug": "ljmu-msc-photonics",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 18000,
    "annualUSD": 22860,
    "annualINR": 1926000,
    "totalGBP": 18000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-48",
    "name": "MA Film and Media",
    "slug": "ljmu-ma-film-media",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MA",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 16000,
    "annualUSD": 20320,
    "annualINR": 1712000,
    "totalGBP": 16000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-49",
    "name": "MSc Geographic Information Systems",
    "slug": "ljmu-msc-geographic-information-systems",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 17000,
    "annualUSD": 21590,
    "annualINR": 1819000,
    "totalGBP": 17000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-50",
    "name": "MSc Psychology (Conversion)",
    "slug": "ljmu-msc-psychology",
    "url": "https://www.ljmu.ac.uk/study/courses/postgraduates",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 17500,
    "annualUSD": 22225,
    "annualINR": 1872500,
    "totalGBP": 17500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "BSc (Hons) Accounting and Finance",
        "slug": "ljmu-ug-bsc-hons-accounting-and-finance"
      },
      {
        "name": "BA (Hons) Architecture",
        "slug": "ljmu-ug-ba-hons-architecture"
      },
      {
        "name": "BSc (Hons) Physics with Astronomy",
        "slug": "ljmu-ug-bsc-hons-physics-with-astronomy"
      }
    ]
  },
  {
    "id": "ljmu-51",
    "name": "BSc (Hons) Accounting and Finance",
    "slug": "ljmu-ug-bsc-hons-accounting-and-finance",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/30089-accounting-and-finance-bsc-hons",
    "level": "BSc",
    "studyLevel": "Undergraduate",
    "duration": "4 years",
    "durationYears": 4,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-52",
    "name": "BA (Hons) Architecture",
    "slug": "ljmu-ug-ba-hons-architecture",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/30132-architecture-ba-hons",
    "level": "BA",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-53",
    "name": "BSc (Hons) Physics with Astronomy",
    "slug": "ljmu-ug-bsc-hons-physics-with-astronomy",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/30150-physics-with-astronomy-bsc-hons",
    "level": "BSc",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-54",
    "name": "BSc (Hons) Biology",
    "slug": "ljmu-ug-bsc-hons-biology",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/30159-biology-bsc-hons",
    "level": "BSc",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-55",
    "name": "BSc (Hons) Building Surveying",
    "slug": "ljmu-ug-bsc-hons-building-surveying",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/30176-building-surveying-bsc-hons",
    "level": "BSc",
    "studyLevel": "Undergraduate",
    "duration": "4 years",
    "durationYears": 4,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-56",
    "name": "BSc (Hons) Mathematics",
    "slug": "ljmu-ug-bsc-hons-mathematics",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/30197-mathematics-bsc-hons",
    "level": "BSc",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-57",
    "name": "BSc (Hons) Construction Management",
    "slug": "ljmu-ug-bsc-hons-construction-management",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/30277-construction-management-bsc-hons",
    "level": "BSc",
    "studyLevel": "Undergraduate",
    "duration": "4 years",
    "durationYears": 4,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-58",
    "name": "BA (Hons) Criminal Justice",
    "slug": "ljmu-ug-ba-hons-criminal-justice",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/30293-criminal-justice-ba-hons",
    "level": "BA",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-59",
    "name": "BA (Hons) Fine Art",
    "slug": "ljmu-ug-ba-hons-fine-art",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/30450-fine-art-ba-hons",
    "level": "BA",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-60",
    "name": "BA (Hons) History",
    "slug": "ljmu-ug-ba-hons-history",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/30495-history-ba-hons",
    "level": "BA",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-61",
    "name": "BA (Hons) Journalism",
    "slug": "ljmu-ug-ba-hons-journalism",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/30574-journalism-ba-hons",
    "level": "BA",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-62",
    "name": "LLB (Hons) Law",
    "slug": "ljmu-ug-llb-hons-law",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/30578-law-llb-hons",
    "level": "LLB",
    "studyLevel": "Undergraduate",
    "duration": "4 years",
    "durationYears": 4,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-63",
    "name": "BSc (Hons) Geography",
    "slug": "ljmu-ug-bsc-hons-geography",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/30773-geography-bsc-hons",
    "level": "BSc",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-64",
    "name": "BSc (Hons) Quantity Surveying",
    "slug": "ljmu-ug-bsc-hons-quantity-surveying",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/30847-quantity-surveying-bsc-hons",
    "level": "BSc",
    "studyLevel": "Undergraduate",
    "duration": "4 years",
    "durationYears": 4,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-65",
    "name": "BA (Hons) Sociology",
    "slug": "ljmu-ug-ba-hons-sociology",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/30881-sociology-ba-hons",
    "level": "BA",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-66",
    "name": "BSc (Hons) Sport and Exercise Science",
    "slug": "ljmu-ug-bsc-hons-sport-and-exercise-science",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/30911-sport-and-exercise-science-bsc-hons",
    "level": "BSc",
    "studyLevel": "Undergraduate",
    "duration": "4 years",
    "durationYears": 4,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-67",
    "name": "BSc (Hons) Wildlife Conservation",
    "slug": "ljmu-ug-bsc-hons-wildlife-conservation",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/30970-wildlife-conservation-bsc-hons",
    "level": "BSc",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-68",
    "name": "BSc (Hons) Zoology",
    "slug": "ljmu-ug-bsc-hons-zoology",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/30990-zoology-bsc-hons",
    "level": "BSc",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-69",
    "name": "BSc (Hons) Animal Behaviour",
    "slug": "ljmu-ug-bsc-hons-animal-behaviour",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/31243-animal-behaviour-bsc-hons",
    "level": "BSc",
    "studyLevel": "Undergraduate",
    "duration": "4 years",
    "durationYears": 4,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-70",
    "name": "BSc (Hons) Forensic Science",
    "slug": "ljmu-ug-bsc-hons-forensic-science",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/31440-forensic-science-bsc-hons",
    "level": "BSc",
    "studyLevel": "Undergraduate",
    "duration": "4 years",
    "durationYears": 4,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-71",
    "name": "BA (Hons) Criminology",
    "slug": "ljmu-ug-ba-hons-criminology",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/31520-criminology-ba-hons",
    "level": "BA",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-72",
    "name": "BA (Hons) Criminology and Sociology",
    "slug": "ljmu-ug-ba-hons-criminology-and-sociology",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/31529-criminology-and-sociology-ba-hons",
    "level": "BA",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-73",
    "name": "BSc (Hons) Forensic Psychology and Criminal Justice",
    "slug": "ljmu-ug-bsc-hons-forensic-psychology-and-criminal-justice",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/31599-forensic-psychology-and-criminal-justice-bsc-hons",
    "level": "BSc",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-74",
    "name": "BA (Hons) Human Resource Management",
    "slug": "ljmu-ug-ba-hons-human-resource-management",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/31780-human-resource-management-ba-hons",
    "level": "BA",
    "studyLevel": "Undergraduate",
    "duration": "4 years",
    "durationYears": 4,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-75",
    "name": "BA (Hons) Marketing",
    "slug": "ljmu-ug-ba-hons-marketing",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/31781-marketing-ba-hons",
    "level": "BA",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-76",
    "name": "BSc (Hons) Biochemistry",
    "slug": "ljmu-ug-bsc-hons-biochemistry",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/31900-biochemistry-bsc-hons",
    "level": "BSc",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-77",
    "name": "BA (Hons) Learning Development and Support",
    "slug": "ljmu-ug-ba-hons-learning-development-and-support",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/32048-learning-development-and-support-lawp-ba-hons",
    "level": "BA",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-78",
    "name": "BEng (Hons) Electrical and Electronic Engineering",
    "slug": "ljmu-ug-beng-hons-electrical-and-electronic-engineering",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/32118bgh-electrical-and-electronic-engineering-beng-hons",
    "level": "BEng",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-79",
    "name": "BEng (Hons) Mechanical Engineering",
    "slug": "ljmu-ug-beng-hons-mechanical-engineering",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/32120bgh-mechanical-engineering-beng-hons",
    "level": "BEng",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-80",
    "name": "BSc (Hons) Forensic Anthropology",
    "slug": "ljmu-ug-bsc-hons-forensic-anthropology",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/32330-forensic-anthropology-bsc-hons",
    "level": "BSc",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-81",
    "name": "BA (Hons) Early Childhood Studies",
    "slug": "ljmu-ug-ba-hons-early-childhood-studies",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/32491-early-childhood-studies-ba-hons",
    "level": "BA",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-82",
    "name": "BSc (Hons) Audio and Music Production",
    "slug": "ljmu-ug-bsc-hons-audio-and-music-production",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/32551-audio-and-music-production-bsc-hons",
    "level": "BSc",
    "studyLevel": "Undergraduate",
    "duration": "4 years",
    "durationYears": 4,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-83",
    "name": "BA (Hons) Events Management",
    "slug": "ljmu-ug-ba-hons-events-management",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/32564-events-management-ba-hons",
    "level": "BA",
    "studyLevel": "Undergraduate",
    "duration": "4 years",
    "durationYears": 4,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-84",
    "name": "BSc (Hons) Biomedical Science",
    "slug": "ljmu-ug-bsc-hons-biomedical-science",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/32805-biomedical-science-bsc-hons",
    "level": "BSc",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-85",
    "name": "BSc (Hons) Architectural Technology",
    "slug": "ljmu-ug-bsc-hons-architectural-technology",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/32811-architectural-technology-bsc-hons",
    "level": "BSc",
    "studyLevel": "Undergraduate",
    "duration": "4 years",
    "durationYears": 4,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-86",
    "name": "BSc (Hons) Criminology and Psychology",
    "slug": "ljmu-ug-bsc-hons-criminology-and-psychology",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/32838-criminology-and-psychology-bsc-hons",
    "level": "BSc",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-87",
    "name": "BA (Hons) Creative Writing",
    "slug": "ljmu-ug-ba-hons-creative-writing",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/32840-creative-writing-ba-hons",
    "level": "BA",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-88",
    "name": "BA (Hons) Film Studies",
    "slug": "ljmu-ug-ba-hons-film-studies",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/33010-film-studies-ba-hons",
    "level": "BA",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-89",
    "name": "BA (Hons) Creative Writing and Film Studies",
    "slug": "ljmu-ug-ba-hons-creative-writing-and-film-studies",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/33014-creative-writing-and-film-studies-ba-hons",
    "level": "BA",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-90",
    "name": "BA (Hons) Media, Culture, Communication",
    "slug": "ljmu-ug-ba-hons-media-culture-communication",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/33183-media-culture-communication-ba-hons",
    "level": "BA",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-91",
    "name": "BSc (Hons) Environmental Health",
    "slug": "ljmu-ug-bsc-hons-environmental-health",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/33261-environmental-health-bsc-hons",
    "level": "BSc",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-92",
    "name": "BA (Hons) Graphic Design and Illustration",
    "slug": "ljmu-ug-ba-hons-graphic-design-and-illustration",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/33376-graphic-design-and-illustration-ba-hons",
    "level": "BA",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-93",
    "name": "BEng (Hons) Civil Engineering",
    "slug": "ljmu-ug-beng-hons-civil-engineering",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/35019bgh-civil-engineering-beng-hons",
    "level": "BEng",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-94",
    "name": "BA (Hons) (QTS) Primary Education with Qualified Teacher Status QTS",
    "slug": "ljmu-ug-ba-hons-qts-primary-education-with-qualified-teacher-status-qts",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/35094-primary-education-ba-hons-qts-primary",
    "level": "BA",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-95",
    "name": "BSc (Hons) Product Design Engineering",
    "slug": "ljmu-ug-bsc-hons-product-design-engineering",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/35334-product-design-engineering-bsc-hons",
    "level": "BSc",
    "studyLevel": "Undergraduate",
    "duration": "4 years",
    "durationYears": 4,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-96",
    "name": "BA (Hons) Media Production",
    "slug": "ljmu-ug-ba-hons-media-production",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/35408-media-production-ba-hons",
    "level": "BA",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-97",
    "name": "BEng (Hons) Architectural Engineering",
    "slug": "ljmu-ug-beng-hons-architectural-engineering",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/35424bgh-architectural-engineering-beng-hons",
    "level": "BEng",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-98",
    "name": "BA (Hons) Sport Business",
    "slug": "ljmu-ug-ba-hons-sport-business",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/35534-sport-business-ba-hons",
    "level": "BA",
    "studyLevel": "Undergraduate",
    "duration": "4 years",
    "durationYears": 4,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-99",
    "name": "BSc (Hons) Computer Science",
    "slug": "ljmu-ug-bsc-hons-computer-science",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/35579-computer-science-bsc-hons",
    "level": "BSc",
    "studyLevel": "Undergraduate",
    "duration": "3 years",
    "durationYears": 3,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "ljmu-100",
    "name": "BSc (Hons) Computer Games Development",
    "slug": "ljmu-ug-bsc-hons-computer-games-development",
    "url": "https://www.ljmu.ac.uk/study/courses/undergraduates/2026/35584-computer-games-development-bsc-hons",
    "level": "BSc",
    "studyLevel": "Undergraduate",
    "duration": "4 years",
    "durationYears": 4,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 0,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Liverpool Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Liverpool",
    "countryCode": "GB",
    "officialUrlKind": "course"
  }
];

export function getLjmuCourseBySlug(slug: string): LjmuCourse | undefined {
  return ljmuCourses.find(c => c.slug === slug);
}
