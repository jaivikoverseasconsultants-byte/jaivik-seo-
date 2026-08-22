// Postgraduate courses for University of Derby — 48 programs
// URL pattern: https://www.derby.ac.uk/study/postgraduate-courses/[slug]/
// CDX returned 0 (Cloudflare WAF); URL pattern from live site

export interface DerbyCourse {
  id: string; name: string; slug: string; url: string; officialUrlKind?: 'course' | 'course-listing'; withdrawn?: boolean; alternatives?: { name: string; slug: string }[];
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualGBP: number; annualUSD: number; annualINR: number; totalGBP: number;
  livingCostGBP: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
}

export const derbyCourses: DerbyCourse[] = [
  {
    "id": "derby-1",
    "name": "MBA Business Administration",
    "slug": "derby-mba",
    "url": "https://www.derby.ac.uk/postgraduate/business-courses/mba/",
    "level": "MBA",
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
    "toeflMin": 85,
    "pteMin": 60,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-2",
    "name": "MBA International Business",
    "slug": "derby-mba-international-business",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MBA",
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
    "toeflMin": 85,
    "pteMin": 60,
    "intakeMonths": [
      "September"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-3",
    "name": "MSc Data Science",
    "slug": "derby-msc-data-science",
    "url": "https://www.derby.ac.uk/research/themes/data-science/",
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
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-4",
    "name": "MSc Artificial Intelligence",
    "slug": "derby-msc-artificial-intelligence",
    "url": "https://www.derby.ac.uk/postgraduate/",
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
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-5",
    "name": "MSc Cyber Security",
    "slug": "derby-msc-cyber-security",
    "url": "https://www.derby.ac.uk/about/data-governance/cyber-security/",
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
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-6",
    "name": "MSc Computer Science",
    "slug": "derby-msc-computer-science",
    "url": "https://www.derby.ac.uk/postgraduate/",
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
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-7",
    "name": "MSc Software Engineering",
    "slug": "derby-msc-software-engineering",
    "url": "https://www.derby.ac.uk/postgraduate/",
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
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-8",
    "name": "MSc Accounting and Finance",
    "slug": "derby-msc-accounting-finance",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MSc",
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
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-9",
    "name": "MSc International Finance",
    "slug": "derby-msc-international-finance",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MSc",
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
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-10",
    "name": "MSc Marketing Management",
    "slug": "derby-msc-marketing-management",
    "url": "https://www.derby.ac.uk/postgraduate/marketing-courses/marketing-management-msc/",
    "level": "MSc",
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
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-11",
    "name": "MSc Digital Marketing",
    "slug": "derby-msc-digital-marketing",
    "url": "https://www.derby.ac.uk/postgraduate/marketing-courses/digital-marketing-msc/",
    "level": "MSc",
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
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-12",
    "name": "MSc International Business Management",
    "slug": "derby-msc-international-business-management",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MSc",
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
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-13",
    "name": "MSc Human Resource Management",
    "slug": "derby-msc-human-resource-management",
    "url": "https://www.derby.ac.uk/postgraduate/human-resource-management-courses/human-resource-management-msc/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 15000,
    "annualUSD": 19050,
    "annualINR": 1605000,
    "totalGBP": 15000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-14",
    "name": "MSc Project Management",
    "slug": "derby-msc-project-management",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 15000,
    "annualUSD": 19050,
    "annualINR": 1605000,
    "totalGBP": 15000,
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
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-15",
    "name": "MSc Supply Chain Management",
    "slug": "derby-msc-supply-chain-management",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MSc",
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
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-16",
    "name": "MSc Logistics and Supply Chain Management",
    "slug": "derby-msc-logistics-supply-chain",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MSc",
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
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-17",
    "name": "MSc Healthcare Management",
    "slug": "derby-msc-healthcare-management",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 15000,
    "annualUSD": 19050,
    "annualINR": 1605000,
    "totalGBP": 15000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-18",
    "name": "MSc Nursing Studies",
    "slug": "derby-msc-nursing-studies",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 15000,
    "annualUSD": 19050,
    "annualINR": 1605000,
    "totalGBP": 15000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 7,
    "toeflMin": 95,
    "pteMin": 65,
    "intakeMonths": [
      "September"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-19",
    "name": "MSc Clinical Psychology",
    "slug": "derby-msc-clinical-psychology",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MSc",
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
    "ieltsMin": 6.5,
    "toeflMin": 87,
    "pteMin": 62,
    "intakeMonths": [
      "September"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-20",
    "name": "MSc Forensic Psychology",
    "slug": "derby-msc-forensic-psychology",
    "url": "https://www.derby.ac.uk/postgraduate/psychology-courses/forensic-psychology-msc/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 15000,
    "annualUSD": 19050,
    "annualINR": 1605000,
    "totalGBP": 15000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6.5,
    "toeflMin": 87,
    "pteMin": 62,
    "intakeMonths": [
      "September"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-21",
    "name": "MSc Sport Psychology",
    "slug": "derby-msc-sport-psychology",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 15000,
    "annualUSD": 19050,
    "annualINR": 1605000,
    "totalGBP": 15000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-22",
    "name": "MSc Sport and Exercise Science",
    "slug": "derby-msc-sport-exercise-science",
    "url": "https://www.derby.ac.uk/short-courses-cpd/sport-and-exercise-science/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 15000,
    "annualUSD": 19050,
    "annualINR": 1605000,
    "totalGBP": 15000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-23",
    "name": "MSc Environmental Management",
    "slug": "derby-msc-environmental-management",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 15000,
    "annualUSD": 19050,
    "annualINR": 1605000,
    "totalGBP": 15000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-24",
    "name": "MSc Tourism and Hospitality Management",
    "slug": "derby-msc-tourism-hospitality",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 14500,
    "annualUSD": 18415,
    "annualINR": 1551500,
    "totalGBP": 14500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-25",
    "name": "MSc Events Management",
    "slug": "derby-msc-events-management",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 14500,
    "annualUSD": 18415,
    "annualINR": 1551500,
    "totalGBP": 14500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-26",
    "name": "MSc Construction Project Management",
    "slug": "derby-msc-construction-project-management",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MSc",
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
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-27",
    "name": "MSc Civil Engineering Management",
    "slug": "derby-msc-civil-engineering-management",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MSc",
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
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-28",
    "name": "MSc Mechanical Engineering",
    "slug": "derby-msc-mechanical-engineering",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MSc",
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
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-29",
    "name": "MSc Electrical and Electronic Engineering",
    "slug": "derby-msc-electrical-electronic-engineering",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MSc",
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
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-30",
    "name": "MA Education",
    "slug": "derby-ma-education",
    "url": "https://www.derby.ac.uk/short-courses-cpd/education/",
    "level": "MA",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 14000,
    "annualUSD": 17780,
    "annualINR": 1498000,
    "totalGBP": 14000,
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
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-31",
    "name": "MA Creative Writing",
    "slug": "derby-ma-creative-writing",
    "url": "https://www.derby.ac.uk/postgraduate/english-creative-writing-publishing-courses/creative-writing-ma/",
    "level": "MA",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 13500,
    "annualUSD": 17145,
    "annualINR": 1444500,
    "totalGBP": 13500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-32",
    "name": "MA Fine Art",
    "slug": "derby-ma-fine-art",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MA",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 13500,
    "annualUSD": 17145,
    "annualINR": 1444500,
    "totalGBP": 13500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-33",
    "name": "MA Graphic Design",
    "slug": "derby-ma-graphic-design",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MA",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 13500,
    "annualUSD": 17145,
    "annualINR": 1444500,
    "totalGBP": 13500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-34",
    "name": "MA Photography",
    "slug": "derby-ma-photography",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MA",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 13500,
    "annualUSD": 17145,
    "annualINR": 1444500,
    "totalGBP": 13500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-35",
    "name": "MSc Criminology",
    "slug": "derby-msc-criminology",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 14000,
    "annualUSD": 17780,
    "annualINR": 1498000,
    "totalGBP": 14000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-36",
    "name": "MSc Social Work",
    "slug": "derby-msc-social-work",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "2 years",
    "durationYears": 2,
    "annualGBP": 14500,
    "annualUSD": 18415,
    "annualINR": 1551500,
    "totalGBP": 29000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 7,
    "toeflMin": 95,
    "pteMin": 65,
    "intakeMonths": [
      "September"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-37",
    "name": "MSc Public Health",
    "slug": "derby-msc-public-health",
    "url": "https://www.derby.ac.uk/research/centres-groups/health-and-social-care-research-centre/public-health/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 15000,
    "annualUSD": 19050,
    "annualINR": 1605000,
    "totalGBP": 15000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-38",
    "name": "MSc Occupational Therapy",
    "slug": "derby-msc-occupational-therapy",
    "url": "https://www.derby.ac.uk/postgraduate/",
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
    "ieltsMin": 7,
    "toeflMin": 95,
    "pteMin": 65,
    "intakeMonths": [
      "September"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-39",
    "name": "MSc Physiotherapy",
    "slug": "derby-msc-physiotherapy",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "2 years",
    "durationYears": 2,
    "annualGBP": 15500,
    "annualUSD": 19685,
    "annualINR": 1658500,
    "totalGBP": 31000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 7,
    "toeflMin": 95,
    "pteMin": 65,
    "intakeMonths": [
      "September"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-40",
    "name": "MSc Architecture",
    "slug": "derby-msc-architecture",
    "url": "https://www.derby.ac.uk/postgraduate/",
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
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-41",
    "name": "MSc Interior Design",
    "slug": "derby-msc-interior-design",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 14500,
    "annualUSD": 18415,
    "annualINR": 1551500,
    "totalGBP": 14500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-42",
    "name": "MSc Fashion Management",
    "slug": "derby-msc-fashion-management",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 14500,
    "annualUSD": 18415,
    "annualINR": 1551500,
    "totalGBP": 14500,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-43",
    "name": "MSc Aviation Management",
    "slug": "derby-msc-aviation-management",
    "url": "https://www.derby.ac.uk/postgraduate/",
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
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-44",
    "name": "MSc Automotive Engineering",
    "slug": "derby-msc-automotive-engineering",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MSc",
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
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-45",
    "name": "MSc Biomedical Science",
    "slug": "derby-msc-biomedical-science",
    "url": "https://www.derby.ac.uk/postgraduate/biomedical-science-courses/biomedical-science-msc/",
    "level": "MSc",
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
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-46",
    "name": "MSc Wildlife Conservation",
    "slug": "derby-msc-wildlife-conservation",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 15000,
    "annualUSD": 19050,
    "annualINR": 1605000,
    "totalGBP": 15000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-47",
    "name": "MSc Counselling and Psychotherapy",
    "slug": "derby-msc-counselling-psychotherapy",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "2 years",
    "durationYears": 2,
    "annualGBP": 14500,
    "annualUSD": 18415,
    "annualINR": 1551500,
    "totalGBP": 29000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6.5,
    "toeflMin": 87,
    "pteMin": 62,
    "intakeMonths": [
      "September"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-48",
    "name": "MSc Special Educational Needs",
    "slug": "derby-msc-special-educational-needs",
    "url": "https://www.derby.ac.uk/postgraduate/",
    "level": "MSc",
    "studyLevel": "Postgraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 14000,
    "annualUSD": 17780,
    "annualINR": 1498000,
    "totalGBP": 14000,
    "livingCostGBP": 9500,
    "livingCostUSD": 12065,
    "livingCostINR": 1016500,
    "ieltsMin": 6,
    "toeflMin": 80,
    "pteMin": 58,
    "intakeMonths": [
      "September"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "Accounting and Finance",
        "slug": "derby-ug-accounting-and-finance"
      },
      {
        "name": "Accounting and Finance with Foundation Year",
        "slug": "derby-ug-accounting-and-finance-with-foundation-year"
      },
      {
        "name": "Business Accounting and Finance",
        "slug": "derby-ug-business-accounting-and-finance"
      }
    ]
  },
  {
    "id": "derby-49",
    "name": "Accounting and Finance",
    "slug": "derby-ug-accounting-and-finance",
    "url": "https://www.derby.ac.uk/undergraduate/accounting-economics-finance-courses/accounting-and-finance-bsc-hons/",
    "level": "Bachelor's",
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
    "ieltsMin": 6,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-50",
    "name": "Accounting and Finance with Foundation Year",
    "slug": "derby-ug-accounting-and-finance-with-foundation-year",
    "url": "https://www.derby.ac.uk/undergraduate/accounting-economics-finance-courses/accounting-and-finance-bsc-hons-foundation/",
    "level": "Bachelor's",
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
    "ieltsMin": 6,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-51",
    "name": "Business Accounting and Finance",
    "slug": "derby-ug-business-accounting-and-finance",
    "url": "https://www.derby.ac.uk/undergraduate/accounting-economics-finance-courses/business-accounting-and-finance-ba-hons/",
    "level": "Bachelor's",
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
    "ieltsMin": 6,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-52",
    "name": "Business Accounting and Finance with Foundation Year",
    "slug": "derby-ug-business-accounting-and-finance-with-foundation-year",
    "url": "https://www.derby.ac.uk/undergraduate/accounting-economics-finance-courses/business-accounting-and-finance-ba-hons-foundation/",
    "level": "Bachelor's",
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
    "ieltsMin": 6,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-53",
    "name": "Accounting and Finance with Placement Year",
    "slug": "derby-ug-accounting-and-finance-with-placement-year",
    "url": "https://www.derby.ac.uk/undergraduate/accounting-economics-finance-courses/accounting-and-finance-bsc-hons-with-placement-year/",
    "level": "Bachelor's",
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
    "ieltsMin": 6,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-54",
    "name": "Business Accounting and Finance with Placement Year",
    "slug": "derby-ug-business-accounting-and-finance-with-placement-year",
    "url": "https://www.derby.ac.uk/undergraduate/accounting-economics-finance-courses/business-accounting-and-finance-ba-hons-with-placement-year/",
    "level": "Bachelor's",
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
    "ieltsMin": 6,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-55",
    "name": "Economics and Finance with Placement Year",
    "slug": "derby-ug-economics-and-finance-with-placement-year",
    "url": "https://www.derby.ac.uk/undergraduate/accounting-economics-finance-courses/economics-finance-bsc-hons-with-placement-year/",
    "level": "Bachelor's",
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
    "ieltsMin": 6,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-56",
    "name": "Economics and Finance with Foundation Year",
    "slug": "derby-ug-economics-and-finance-with-foundation-year",
    "url": "https://www.derby.ac.uk/undergraduate/accounting-economics-finance-courses/economics-and-finance-bsc-hons-foundation/",
    "level": "Bachelor's",
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
    "ieltsMin": 6,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-57",
    "name": "Economics",
    "slug": "derby-ug-economics",
    "url": "https://www.derby.ac.uk/undergraduate/accounting-economics-finance-courses/economics-ba-hons/",
    "level": "Bachelor's",
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
    "ieltsMin": 6,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-58",
    "name": "Economics with Placement Year",
    "slug": "derby-ug-economics-with-placement-year",
    "url": "https://www.derby.ac.uk/undergraduate/accounting-economics-finance-courses/economics-ba-hons-with-placement-year/",
    "level": "Bachelor's",
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
    "ieltsMin": 6,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-59",
    "name": "Economics with Foundation Year",
    "slug": "derby-ug-economics-with-foundation-year",
    "url": "https://www.derby.ac.uk/undergraduate/accounting-economics-finance-courses/economics-ba-hons-foundation/",
    "level": "Bachelor's",
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
    "ieltsMin": 6,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-60",
    "name": "Economics and Finance",
    "slug": "derby-ug-economics-and-finance",
    "url": "https://www.derby.ac.uk/undergraduate/accounting-economics-finance-courses/economics-and-finance-bsc-hons/",
    "level": "Bachelor's",
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
    "ieltsMin": 6,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-61",
    "name": "Architecture",
    "slug": "derby-ug-architecture",
    "url": "https://www.derby.ac.uk/undergraduate/architecture-architectural-technology-courses/architecture-ba-hons/",
    "level": "Bachelor's",
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
    "ieltsMin": 6,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-62",
    "name": "Architecture with Foundation Year",
    "slug": "derby-ug-architecture-with-foundation-year",
    "url": "https://www.derby.ac.uk/undergraduate/architecture-architectural-technology-courses/architecture-ba-hons-foundation/",
    "level": "Bachelor's",
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
    "ieltsMin": 6,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-63",
    "name": "Architectural Technology and Practice",
    "slug": "derby-ug-architectural-technology-and-practice",
    "url": "https://www.derby.ac.uk/undergraduate/architecture-architectural-technology-courses/architectural-technology-and-practice-bsc-hons/",
    "level": "Bachelor's",
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
    "ieltsMin": 6,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-64",
    "name": "Architectural Technology and Practice with Foundation Year",
    "slug": "derby-ug-architectural-technology-and-practice-with-foundation-year",
    "url": "https://www.derby.ac.uk/undergraduate/architecture-architectural-technology-courses/architectural-technology-and-practice-bsc-hons-foundation/",
    "level": "Bachelor's",
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
    "ieltsMin": 6,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-65",
    "name": "Animation",
    "slug": "derby-ug-animation",
    "url": "https://www.derby.ac.uk/undergraduate/art-design-courses/animation-ba-hons/",
    "level": "Bachelor's",
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
    "ieltsMin": 6,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-66",
    "name": "Animation with Foundation Year",
    "slug": "derby-ug-animation-with-foundation-year",
    "url": "https://www.derby.ac.uk/undergraduate/art-design-courses/animation-ba-hons-foundation/",
    "level": "Bachelor's",
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
    "ieltsMin": 6,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-67",
    "name": "Fine Art",
    "slug": "derby-ug-fine-art",
    "url": "https://www.derby.ac.uk/undergraduate/art-design-courses/fine-art-ba-hons/",
    "level": "Bachelor's",
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
    "ieltsMin": 6,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-68",
    "name": "Fine Art with Foundation Year",
    "slug": "derby-ug-fine-art-with-foundation-year",
    "url": "https://www.derby.ac.uk/undergraduate/art-design-courses/fine-art-ba-hons-foundation/",
    "level": "Bachelor's",
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
    "ieltsMin": 6,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-69",
    "name": "Graphic Design",
    "slug": "derby-ug-graphic-design",
    "url": "https://www.derby.ac.uk/undergraduate/art-design-courses/graphic-design-ba-hons/",
    "level": "Bachelor's",
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
    "ieltsMin": 6,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-70",
    "name": "Graphic Design with Foundation Year",
    "slug": "derby-ug-graphic-design-with-foundation-year",
    "url": "https://www.derby.ac.uk/undergraduate/art-design-courses/graphic-design-ba-hons-foundation/",
    "level": "Bachelor's",
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
    "ieltsMin": 6,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-71",
    "name": "Illustration",
    "slug": "derby-ug-illustration",
    "url": "https://www.derby.ac.uk/undergraduate/art-design-courses/illustration-ba-hons/",
    "level": "Bachelor's",
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
    "ieltsMin": 6,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-72",
    "name": "Illustration with Foundation Year",
    "slug": "derby-ug-illustration-with-foundation-year",
    "url": "https://www.derby.ac.uk/undergraduate/art-design-courses/illustration-ba-hons-foundation/",
    "level": "Bachelor's",
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
    "ieltsMin": 6,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-73",
    "name": "Interior Design",
    "slug": "derby-ug-interior-design",
    "url": "https://www.derby.ac.uk/undergraduate/art-design-courses/interior-design-ba-hons/",
    "level": "Bachelor's",
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
    "ieltsMin": 6,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-74",
    "name": "Interior Design with Foundation Year",
    "slug": "derby-ug-interior-design-with-foundation-year",
    "url": "https://www.derby.ac.uk/undergraduate/art-design-courses/interior-design-ba-hons-foundation/",
    "level": "Bachelor's",
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
    "ieltsMin": 6,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "derby-75",
    "name": "Artificial Intelligence in Criminology",
    "slug": "derby-ug-artificial-intelligence-in-criminology",
    "url": "https://www.derby.ac.uk/undergraduate/artificial-intelligence-courses/artificial-intelligence-criminology-bsc-hons/",
    "level": "Bachelor's",
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
      "September",
      "January"
    ],
    "campus": "Derby Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "Derby",
    "countryCode": "GB",
    "officialUrlKind": "course"
  }
];

export function getDerbyCourseBySlug(slug: string): DerbyCourse | undefined {
  return derbyCourses.find(c => c.slug === slug);
}
