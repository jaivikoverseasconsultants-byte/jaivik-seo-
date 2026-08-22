// Postgraduate courses for University of Roehampton — 33 programs
// URL pattern: https://www.roehampton.ac.uk/postgraduate-courses/[slug]
// CDX-CONFIRMED: 52+ real URLs from Wayback Machine archive

export interface RoehamCourse {
  id: string; name: string; slug: string; url: string; officialUrlKind?: 'course' | 'course-listing'; withdrawn?: boolean; alternatives?: { name: string; slug: string }[];
  level: string; studyLevel: string; duration: string; durationYears: number;
  annualGBP: number; annualUSD: number; annualINR: number; totalGBP: number;
  livingCostGBP: number; livingCostUSD: number; livingCostINR: number;
  ieltsMin: number; toeflMin: number; pteMin: number;
  intakeMonths: string[]; campus: string;
  country: string; state: string; city: string; countryCode: string;
}

export const roehamCourses: RoehamCourse[] = [
  {
    "id": "roeham-1",
    "name": "MBA Business Administration",
    "slug": "roeham-mba-business-administration",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/",
    "level": "MBA",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Applied Cognitive Neuroscience",
        "slug": "roeham-applied-cognitive-neuroscience"
      },
      {
        "name": "MSc Banking, Finance and Risk Management",
        "slug": "roeham-banking-finance-and-risk-management"
      },
      {
        "name": "MSc Cell Biomedicine",
        "slug": "roeham-cell-biomedicine"
      }
    ]
  },
  {
    "id": "roeham-2",
    "name": "MSc Accounting and Finance",
    "slug": "roeham-accounting-and-finance",
    "url": "https://www.roehampton.ac.uk/study/academic-areas/business-and-law/accounting-and-finance/",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "roeham-3",
    "name": "MSc Animal Ecology",
    "slug": "roeham-animal-ecology",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Applied Cognitive Neuroscience",
        "slug": "roeham-applied-cognitive-neuroscience"
      },
      {
        "name": "MSc Banking, Finance and Risk Management",
        "slug": "roeham-banking-finance-and-risk-management"
      },
      {
        "name": "MSc Cell Biomedicine",
        "slug": "roeham-cell-biomedicine"
      }
    ]
  },
  {
    "id": "roeham-4",
    "name": "MSc Anthropology of Health",
    "slug": "roeham-anthropology-of-health",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Applied Cognitive Neuroscience",
        "slug": "roeham-applied-cognitive-neuroscience"
      },
      {
        "name": "MSc Banking, Finance and Risk Management",
        "slug": "roeham-banking-finance-and-risk-management"
      },
      {
        "name": "MSc Cell Biomedicine",
        "slug": "roeham-cell-biomedicine"
      }
    ]
  },
  {
    "id": "roeham-5",
    "name": "MSc Applied Cognitive Neuroscience",
    "slug": "roeham-applied-cognitive-neuroscience",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/applied-cognitive-neuroscience",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "roeham-6",
    "name": "MSc Applied Music Psychology",
    "slug": "roeham-applied-music-psychology",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Applied Cognitive Neuroscience",
        "slug": "roeham-applied-cognitive-neuroscience"
      },
      {
        "name": "MSc Banking, Finance and Risk Management",
        "slug": "roeham-banking-finance-and-risk-management"
      },
      {
        "name": "MSc Cell Biomedicine",
        "slug": "roeham-cell-biomedicine"
      }
    ]
  },
  {
    "id": "roeham-7",
    "name": "MSc Applied Psychology in Education",
    "slug": "roeham-applied-psychology-in-education",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Applied Cognitive Neuroscience",
        "slug": "roeham-applied-cognitive-neuroscience"
      },
      {
        "name": "MSc Banking, Finance and Risk Management",
        "slug": "roeham-banking-finance-and-risk-management"
      },
      {
        "name": "MSc Cell Biomedicine",
        "slug": "roeham-cell-biomedicine"
      }
    ]
  },
  {
    "id": "roeham-8",
    "name": "MSc Attachment Theory, Research and Practice",
    "slug": "roeham-attachment-theory-research-and-practice",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Applied Cognitive Neuroscience",
        "slug": "roeham-applied-cognitive-neuroscience"
      },
      {
        "name": "MSc Banking, Finance and Risk Management",
        "slug": "roeham-banking-finance-and-risk-management"
      },
      {
        "name": "MSc Cell Biomedicine",
        "slug": "roeham-cell-biomedicine"
      }
    ]
  },
  {
    "id": "roeham-9",
    "name": "MSc Banking, Finance and Risk Management",
    "slug": "roeham-banking-finance-and-risk-management",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/banking-finance-and-risk-management",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "roeham-10",
    "name": "MSc Biodiversity and Conservation",
    "slug": "roeham-biodiversity-and-conservation",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Applied Cognitive Neuroscience",
        "slug": "roeham-applied-cognitive-neuroscience"
      },
      {
        "name": "MSc Banking, Finance and Risk Management",
        "slug": "roeham-banking-finance-and-risk-management"
      },
      {
        "name": "MSc Cell Biomedicine",
        "slug": "roeham-cell-biomedicine"
      }
    ]
  },
  {
    "id": "roeham-11",
    "name": "MSc Bioentrepreneurship",
    "slug": "roeham-bioentrepreneurship",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Applied Cognitive Neuroscience",
        "slug": "roeham-applied-cognitive-neuroscience"
      },
      {
        "name": "MSc Banking, Finance and Risk Management",
        "slug": "roeham-banking-finance-and-risk-management"
      },
      {
        "name": "MSc Cell Biomedicine",
        "slug": "roeham-cell-biomedicine"
      }
    ]
  },
  {
    "id": "roeham-12",
    "name": "MSc Biomechanics",
    "slug": "roeham-biomechanics",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Applied Cognitive Neuroscience",
        "slug": "roeham-applied-cognitive-neuroscience"
      },
      {
        "name": "MSc Banking, Finance and Risk Management",
        "slug": "roeham-banking-finance-and-risk-management"
      },
      {
        "name": "MSc Cell Biomedicine",
        "slug": "roeham-cell-biomedicine"
      }
    ]
  },
  {
    "id": "roeham-13",
    "name": "MSc Cell Biomedicine",
    "slug": "roeham-cell-biomedicine",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/cell-biomedicine",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "roeham-14",
    "name": "MSc Data Science",
    "slug": "roeham-msc-data-science",
    "url": "https://www.roehampton.ac.uk/study/postgraduate-taught-courses/data-science/",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "roeham-15",
    "name": "MSc Education Management and Leadership",
    "slug": "roeham-msc-education-management",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Applied Cognitive Neuroscience",
        "slug": "roeham-applied-cognitive-neuroscience"
      },
      {
        "name": "MSc Banking, Finance and Risk Management",
        "slug": "roeham-banking-finance-and-risk-management"
      },
      {
        "name": "MSc Cell Biomedicine",
        "slug": "roeham-cell-biomedicine"
      }
    ]
  },
  {
    "id": "roeham-16",
    "name": "MSc Sport Coaching",
    "slug": "roeham-msc-sport-coaching",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Applied Cognitive Neuroscience",
        "slug": "roeham-applied-cognitive-neuroscience"
      },
      {
        "name": "MSc Banking, Finance and Risk Management",
        "slug": "roeham-banking-finance-and-risk-management"
      },
      {
        "name": "MSc Cell Biomedicine",
        "slug": "roeham-cell-biomedicine"
      }
    ]
  },
  {
    "id": "roeham-17",
    "name": "MRes Choreography and Performance",
    "slug": "roeham-choreography-and-performance-mres",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/choreography-and-performance-mres",
    "level": "MRes",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "roeham-18",
    "name": "MA Accessibility and Filmmaking",
    "slug": "roeham-accessibility-and-filmmaking",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Applied Cognitive Neuroscience",
        "slug": "roeham-applied-cognitive-neuroscience"
      },
      {
        "name": "MSc Banking, Finance and Risk Management",
        "slug": "roeham-banking-finance-and-risk-management"
      },
      {
        "name": "MSc Cell Biomedicine",
        "slug": "roeham-cell-biomedicine"
      }
    ]
  },
  {
    "id": "roeham-19",
    "name": "MA Applied Linguistics and TESOL",
    "slug": "roeham-applied-linguistics-and-tesol",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Applied Cognitive Neuroscience",
        "slug": "roeham-applied-cognitive-neuroscience"
      },
      {
        "name": "MSc Banking, Finance and Risk Management",
        "slug": "roeham-banking-finance-and-risk-management"
      },
      {
        "name": "MSc Cell Biomedicine",
        "slug": "roeham-cell-biomedicine"
      }
    ]
  },
  {
    "id": "roeham-20",
    "name": "MA Applied Music Education",
    "slug": "roeham-applied-music-education",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Applied Cognitive Neuroscience",
        "slug": "roeham-applied-cognitive-neuroscience"
      },
      {
        "name": "MSc Banking, Finance and Risk Management",
        "slug": "roeham-banking-finance-and-risk-management"
      },
      {
        "name": "MSc Cell Biomedicine",
        "slug": "roeham-cell-biomedicine"
      }
    ]
  },
  {
    "id": "roeham-21",
    "name": "MA Art, Craft and Design Education",
    "slug": "roeham-art-craft-and-design-education",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Applied Cognitive Neuroscience",
        "slug": "roeham-applied-cognitive-neuroscience"
      },
      {
        "name": "MSc Banking, Finance and Risk Management",
        "slug": "roeham-banking-finance-and-risk-management"
      },
      {
        "name": "MSc Cell Biomedicine",
        "slug": "roeham-cell-biomedicine"
      }
    ]
  },
  {
    "id": "roeham-22",
    "name": "MA Art Psychotherapy",
    "slug": "roeham-art-psychotherapy",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/art-psychotherapy",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "roeham-23",
    "name": "MA Art Therapy",
    "slug": "roeham-art-therapy",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Applied Cognitive Neuroscience",
        "slug": "roeham-applied-cognitive-neuroscience"
      },
      {
        "name": "MSc Banking, Finance and Risk Management",
        "slug": "roeham-banking-finance-and-risk-management"
      },
      {
        "name": "MSc Cell Biomedicine",
        "slug": "roeham-cell-biomedicine"
      }
    ]
  },
  {
    "id": "roeham-24",
    "name": "MA Attachment Studies",
    "slug": "roeham-attachment-studies",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Applied Cognitive Neuroscience",
        "slug": "roeham-applied-cognitive-neuroscience"
      },
      {
        "name": "MSc Banking, Finance and Risk Management",
        "slug": "roeham-banking-finance-and-risk-management"
      },
      {
        "name": "MSc Cell Biomedicine",
        "slug": "roeham-cell-biomedicine"
      }
    ]
  },
  {
    "id": "roeham-25",
    "name": "MA Audiovisual Translation",
    "slug": "roeham-audiovisual-translation",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Applied Cognitive Neuroscience",
        "slug": "roeham-applied-cognitive-neuroscience"
      },
      {
        "name": "MSc Banking, Finance and Risk Management",
        "slug": "roeham-banking-finance-and-risk-management"
      },
      {
        "name": "MSc Cell Biomedicine",
        "slug": "roeham-cell-biomedicine"
      }
    ]
  },
  {
    "id": "roeham-26",
    "name": "MA Ballet Studies",
    "slug": "roeham-ballet-studies",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Applied Cognitive Neuroscience",
        "slug": "roeham-applied-cognitive-neuroscience"
      },
      {
        "name": "MSc Banking, Finance and Risk Management",
        "slug": "roeham-banking-finance-and-risk-management"
      },
      {
        "name": "MSc Cell Biomedicine",
        "slug": "roeham-cell-biomedicine"
      }
    ]
  },
  {
    "id": "roeham-27",
    "name": "MA Children's Literature",
    "slug": "roeham-childrens-literature",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Applied Cognitive Neuroscience",
        "slug": "roeham-applied-cognitive-neuroscience"
      },
      {
        "name": "MSc Banking, Finance and Risk Management",
        "slug": "roeham-banking-finance-and-risk-management"
      },
      {
        "name": "MSc Cell Biomedicine",
        "slug": "roeham-cell-biomedicine"
      }
    ]
  },
  {
    "id": "roeham-28",
    "name": "MA Children's Literature (Distance Learning)",
    "slug": "roeham-childrens-literature-distance-learning",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/childrens-literature-distance-learning",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "roeham-29",
    "name": "MA Choreography",
    "slug": "roeham-choreography",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/choreography",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "roeham-30",
    "name": "MA Choreomundus (International Dance Cultures)",
    "slug": "roeham-choreomundus",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/choreomundus",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "roeham-31",
    "name": "MA Christian Ministry",
    "slug": "roeham-christian-ministry",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Applied Cognitive Neuroscience",
        "slug": "roeham-applied-cognitive-neuroscience"
      },
      {
        "name": "MSc Banking, Finance and Risk Management",
        "slug": "roeham-banking-finance-and-risk-management"
      },
      {
        "name": "MSc Cell Biomedicine",
        "slug": "roeham-cell-biomedicine"
      }
    ]
  },
  {
    "id": "roeham-32",
    "name": "MA Classical Research",
    "slug": "roeham-classical-research",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Applied Cognitive Neuroscience",
        "slug": "roeham-applied-cognitive-neuroscience"
      },
      {
        "name": "MSc Banking, Finance and Risk Management",
        "slug": "roeham-banking-finance-and-risk-management"
      },
      {
        "name": "MSc Cell Biomedicine",
        "slug": "roeham-cell-biomedicine"
      }
    ]
  },
  {
    "id": "roeham-33",
    "name": "MA Classics and Ancient History",
    "slug": "roeham-classics-and-ancient-history",
    "url": "https://www.roehampton.ac.uk/postgraduate-courses/",
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
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course-listing",
    "withdrawn": true,
    "alternatives": [
      {
        "name": "MSc Applied Cognitive Neuroscience",
        "slug": "roeham-applied-cognitive-neuroscience"
      },
      {
        "name": "MSc Banking, Finance and Risk Management",
        "slug": "roeham-banking-finance-and-risk-management"
      },
      {
        "name": "MSc Cell Biomedicine",
        "slug": "roeham-cell-biomedicine"
      }
    ]
  },
  {
    "id": "roeham-34",
    "name": "LLB (Hons) Law with Criminal Justice",
    "slug": "roeham-ug-llb-hons-law-with-criminal-justice",
    "url": "https://www.roehampton.ac.uk/study/undergraduate-courses/law-with-criminal-justice/",
    "level": "LLB",
    "studyLevel": "Undergraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 5.5,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "roeham-35",
    "name": "Early Childhood Studies (BA)",
    "slug": "roeham-ug-early-childhood-studies-ba",
    "url": "https://www.roehampton.ac.uk/study/undergraduate-courses/early-childhood-studies/",
    "level": "BA",
    "studyLevel": "Undergraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 5.5,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  },
  {
    "id": "roeham-36",
    "name": "LLB (Hons) Law with Politics",
    "slug": "roeham-ug-llb-hons-law-with-politics",
    "url": "https://www.roehampton.ac.uk/study/undergraduate-courses/llb-law-with-politics/",
    "level": "LLB",
    "studyLevel": "Undergraduate",
    "duration": "1 year",
    "durationYears": 1,
    "annualGBP": 0,
    "annualUSD": 0,
    "annualINR": 0,
    "totalGBP": 0,
    "livingCostGBP": 0,
    "livingCostUSD": 0,
    "livingCostINR": 0,
    "ieltsMin": 5.5,
    "toeflMin": 0,
    "pteMin": 0,
    "intakeMonths": [
      "September"
    ],
    "campus": "Roehampton Campus",
    "country": "United Kingdom",
    "state": "England",
    "city": "London",
    "countryCode": "GB",
    "officialUrlKind": "course"
  }
];

export function getRoehamCourseBySlug(slug: string): RoehamCourse | undefined {
  return roehamCourses.find(c => c.slug === slug);
}
