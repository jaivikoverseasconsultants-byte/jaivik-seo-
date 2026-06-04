export interface CityBreakdown {
  city: string;
  currency: string;
  rent: { min: number; max: number; note?: string };
  groceries: { min: number; max: number; note?: string };
  transport: { min: number; max: number; note?: string };
  utilities: { min: number; max: number; note?: string };
  misc: { min: number; max: number; note?: string };
  totalMonthly: { min: number; max: number };
  totalMonthlyINR: { min: number; max: number };
  highlights: string[];
}

export interface CostOfLivingGuide {
  country: string;
  slug: string;
  flagEmoji: string;
  currencyCode: string;
  currencySymbol: string;
  inrRate: number; // 1 unit = X INR
  metaTitle: string;
  metaDescription: string;
  intro: string;
  annualTuitionRange: { min: number; max: number; currency: string; minINR: number; maxINR: number };
  cities: CityBreakdown[];
  savingTips: string[];
  workRights: string;
  averagePartTimeEarnings: string;
  relatedLinks: { href: string; label: string }[];
}

export const costOfLivingGuides: CostOfLivingGuide[] = [
  {
    country: 'Canada',
    slug: 'canada',
    flagEmoji: '🇨🇦',
    currencyCode: 'CAD',
    currencySymbol: 'CAD',
    inrRate: 61,
    metaTitle: 'Cost of Living in Canada 2026 for Indian Students: Toronto, Vancouver & Montreal',
    metaDescription: 'Monthly cost of living in Canada for Indian students 2026. Rent, groceries, transport in Toronto, Vancouver, and Montreal with INR conversions. Part-time work and money-saving tips.',
    intro: 'Canada is the most popular study destination for Indian students, but costs vary dramatically by city. Toronto and Vancouver are the most expensive; Montreal and smaller cities like Halifax or Saskatoon can be 30–40% cheaper while offering the same or better quality of life. This guide breaks down every cost category across Canada\'s three most popular student cities.',
    annualTuitionRange: { min: 15000, max: 55000, currency: 'CAD', minINR: 915000, maxINR: 3355000 },
    cities: [
      {
        city: 'Toronto',
        currency: 'CAD',
        rent: { min: 900, max: 1200, note: 'Shared room near university (Annex, Scarborough, North York)' },
        groceries: { min: 250, max: 350 },
        transport: { min: 156, max: 156, note: 'TTC monthly Presto pass' },
        utilities: { min: 0, max: 100, note: 'Often included in rent; check before signing' },
        misc: { min: 150, max: 200 },
        totalMonthly: { min: 1456, max: 2006 },
        totalMonthlyINR: { min: 88816, max: 122366 },
        highlights: [
          'Largest Indian community in Canada — Brampton, Mississauga, Scarborough',
          'Most universities: U of T, TMU, York, Centennial, Seneca, George Brown',
          'TTC monthly pass: CAD 156; includes subway, bus, streetcar',
          'Indian groceries cheaper at Patel Brothers (Scarborough) vs mainstream supermarkets',
          'Part-time work: Ontario minimum wage CAD 17.20/hr (2026)',
        ],
      },
      {
        city: 'Vancouver',
        currency: 'CAD',
        rent: { min: 950, max: 1400, note: 'Shared room near UBC/SFU; Point Grey, Burnaby, Surrey cheaper' },
        groceries: { min: 250, max: 350 },
        transport: { min: 112, max: 140, note: 'TransLink monthly pass (2–3 zones)' },
        utilities: { min: 0, max: 100, note: 'Often included; hydro/electricity extra in houses' },
        misc: { min: 150, max: 200 },
        totalMonthly: { min: 1462, max: 2190 },
        totalMonthlyINR: { min: 89182, max: 133590 },
        highlights: [
          'UBC (Point Grey campus) + SFU (Burnaby) are main universities',
          'Highest rent in Canada — consider Surrey or Burnaby for 20–30% savings',
          'TransLink SkyTrain connects all suburbs to UBC/downtown efficiently',
          'Mild climate — lower heating bills than Toronto or Edmonton',
          'BC minimum wage: CAD 17.40/hr; strong hospitality and tech job market',
        ],
      },
      {
        city: 'Montreal',
        currency: 'CAD',
        rent: { min: 650, max: 950, note: 'Shared room in Plateau, NDG, Côte-des-Neiges near McGill/Concordia' },
        groceries: { min: 200, max: 300 },
        transport: { min: 94, max: 94, note: 'STM monthly pass (student rate)' },
        utilities: { min: 0, max: 80, note: 'Included in most student rentals' },
        misc: { min: 120, max: 180 },
        totalMonthly: { min: 1064, max: 1604 },
        totalMonthlyINR: { min: 64904, max: 97844 },
        highlights: [
          'Cheapest major city in Canada — 35% lower rent than Toronto',
          'McGill (ranked #30 world) charges same fees as other Canadian universities',
          'Bilingual city — French and English; knowing basic French is helpful',
          'Concordia, UQAM also strong universities with lower fees',
          'Quebec minimum wage: CAD 15.75/hr; but plenty of English-language jobs in tech/research',
        ],
      },
    ],
    savingTips: [
      'Cook Indian food at home — ingredients from South Asian grocery stores (Nations Fresh Foods, Patel Brothers) cost 40–50% less than packaged Western food',
      'Use Facebook groups to find sublets from graduating students in April/May — 20–30% below market rate',
      'Get a Presto card (Toronto) or Compass card (Vancouver) — cheaper than single fares; monthly cap saves money for frequent travellers',
      'NoFrills, FoodBasics, Walmart Supercenter — shop here for all non-specialty items; save CAD 80–120/month vs Loblaws',
      'Use university campus food banks (available at all major Canadian universities) during tight months — no stigma, widely used',
      'Phone plans: Koodo, Public Mobile, or Freedom Mobile — CAD 25–35/month vs CAD 60+ for big 3 carriers (Bell/Rogers/Telus)',
      'Work on-campus during semester and increase to full-time during 4-month summer breaks — can save CAD 8,000–12,000',
    ],
    workRights: '20 hours/week off-campus during semester; unlimited during scheduled breaks. Study permit allows unrestricted work since November 2022.',
    averagePartTimeEarnings: 'CAD 17.20/hr × 15 hrs/week = CAD 1,000/month (after tax) — covers most living expenses',
    relatedLinks: [
      { href: '/universities/country/canada', label: 'Browse Canada Universities' },
      { href: '/visa-guide/canada', label: 'Canada Visa Guide' },
      { href: '/blog/cost-of-living-toronto-indian-students', label: 'Toronto Cost Guide' },
      { href: '/blog/canada-pr-after-masters-2026-guide', label: 'Canada PR Guide' },
      { href: '/book-counselling', label: 'Free Counselling' },
    ],
  },

  {
    country: 'United Kingdom',
    slug: 'uk',
    flagEmoji: '🇬🇧',
    currencyCode: 'GBP',
    currencySymbol: '£',
    inrRate: 106.5,
    metaTitle: 'Cost of Living in UK 2026 for Indian Students: London, Manchester & Birmingham',
    metaDescription: 'Monthly cost of living in UK for Indian students 2026. Rent, groceries, Oyster card in London, Manchester, and Birmingham with INR conversions. Student discounts and money-saving tips.',
    intro: 'The UK is home to some of the world\'s most prestigious universities — but also some of the most expensive cities. London consistently ranks in the top 5 most expensive student cities globally. However, Manchester and Birmingham offer significantly lower costs while hosting world-ranked universities like University of Manchester (#32) and Aston University.',
    annualTuitionRange: { min: 10000, max: 32000, currency: 'GBP', minINR: 1065000, maxINR: 3408000 },
    cities: [
      {
        city: 'London',
        currency: 'GBP',
        rent: { min: 700, max: 1100, note: 'Shared room in Zone 2–3 (Brixton, Hackney, Stratford, Tooting)' },
        groceries: { min: 150, max: 220 },
        transport: { min: 180, max: 180, note: 'Zone 1–3 monthly Travelcard (Oyster)' },
        utilities: { min: 0, max: 70, note: 'Usually included in student halls; extra in private HMOs' },
        misc: { min: 100, max: 160 },
        totalMonthly: { min: 1130, max: 1730 },
        totalMonthlyINR: { min: 120345, max: 184245 },
        highlights: [
          'UCL, King\'s College, Imperial, LSE, Goldsmiths, Queen Mary — all world-ranked',
          'Southall (Zone 4) has largest Indian community in UK with cheap Indian groceries',
          'Oyster/contactless caps: daily £8.10 (Zone 1–2); Sunday cap £2.80 all day',
          'Student discounts via TOTUM/NUS: Spotify, ASOS, Vue cinema, restaurants',
          'London minimum wage (21+): £12.21/hr (2026)',
        ],
      },
      {
        city: 'Manchester',
        currency: 'GBP',
        rent: { min: 450, max: 700, note: 'Shared house near University of Manchester/MMU (Fallowfield, Withington, Rusholme)' },
        groceries: { min: 120, max: 180 },
        transport: { min: 65, max: 90, note: 'Metrolink tram monthly pass; or bus pass' },
        utilities: { min: 30, max: 80, note: 'Often shared equally among housemates' },
        misc: { min: 80, max: 120 },
        totalMonthly: { min: 745, max: 1170 },
        totalMonthlyINR: { min: 79343, max: 124605 },
        highlights: [
          'University of Manchester (#32 world) + Manchester Metropolitan University',
          'Rusholme area ("Curry Mile") has the largest concentration of South Asian restaurants in UK outside London',
          'Rent 35–40% cheaper than London for similar quality rooms',
          'Strong tech and media industry (MediaCityUK — BBC, ITV, Channel 4)',
          'Manchester Airport: direct flights to India (Air India, Jet2) — cheaper than flying from London',
        ],
      },
      {
        city: 'Birmingham',
        currency: 'GBP',
        rent: { min: 400, max: 650, note: 'Shared house near Aston/UoB/BCU (Selly Oak, Edgbaston, Handsworth)' },
        groceries: { min: 110, max: 170 },
        transport: { min: 55, max: 80, note: 'West Midlands Network bus/metro monthly pass' },
        utilities: { min: 30, max: 70, note: 'Shared among 3–5 housemates typically' },
        misc: { min: 70, max: 110 },
        totalMonthly: { min: 665, max: 1080 },
        totalMonthlyINR: { min: 70823, max: 115020 },
        highlights: [
          'University of Birmingham (Russell Group), Aston University, Birmingham City University',
          'Second largest Indian community in UK (Handsworth, Sparkhill, Soho Road area)',
          'UK\'s second city — strong job market in manufacturing, services, NHS',
          'Cheapest major UK city for students — 45% less rent than London',
          'Huge South Asian supermarkets and restaurants near all campuses',
        ],
      },
    ],
    savingTips: [
      'Live in Zone 3–4 in London (Tooting, Ilford, Walthamstow) and use Oyster — saves £200–400/month vs Zone 1–2 rent',
      'Southall (London) for Indian groceries: rice, dal, spices at prices 60% cheaper than mainstream supermarkets',
      'Lidl and Aldi for everyday shopping — 25–35% cheaper than Tesco or Sainsbury\'s for staples',
      'University canteens often have £3–5 meals — eating there for lunch saves £80–120/month vs cafés',
      'NHS prescription prepayment certificate: £31.25/year for unlimited NHS prescriptions — worth it for regular medication',
      'Apply for Council Tax exemption — full-time students in the UK are completely exempt from Council Tax (save £80–200/month)',
      'Energy tariff: if bills are not included, compare rates on Uswitch.com; could save £30–50/month',
    ],
    workRights: '20 hours/week during term time; unlimited during official vacation periods. Graduate Route visa (2 years) after graduation.',
    averagePartTimeEarnings: '£12.21/hr × 15 hrs/week = £700/month — covers rent in Birmingham/Manchester; half of London rent',
    relatedLinks: [
      { href: '/universities/country/uk', label: 'Browse UK Universities' },
      { href: '/visa-guide/uk', label: 'UK Visa Guide' },
      { href: '/blog/cost-of-living-london-indian-students', label: 'London Cost Guide' },
      { href: '/blog/scholarships-india-students-uk-2026', label: 'UK Scholarships' },
      { href: '/book-counselling', label: 'Free Counselling' },
    ],
  },

  {
    country: 'Australia',
    slug: 'australia',
    flagEmoji: '🇦🇺',
    currencyCode: 'AUD',
    currencySymbol: 'AUD',
    inrRate: 55.7,
    metaTitle: 'Cost of Living in Australia 2026 for Indian Students: Sydney, Melbourne & Brisbane',
    metaDescription: 'Monthly cost of living in Australia for Indian students 2026. Rent, groceries, Opal/Myki card in Sydney, Melbourne, and Brisbane with INR conversions. Work rights and money-saving tips.',
    intro: 'Australia is well-known for its high quality of life — and high cost of living. Sydney and Melbourne are among the world\'s most expensive cities. However, Australia also pays the world\'s highest minimum wages (AUD 24.10/hr in 2026), meaning students who work part-time can cover most of their living expenses. Brisbane is increasingly popular as a lower-cost alternative with world-class universities.',
    annualTuitionRange: { min: 22000, max: 55000, currency: 'AUD', minINR: 1225400, maxINR: 3063500 },
    cities: [
      {
        city: 'Sydney',
        currency: 'AUD',
        rent: { min: 950, max: 1300, note: 'Shared room near USYD/UNSW (Newtown, Kingsford, Randwick)' },
        groceries: { min: 300, max: 420 },
        transport: { min: 150, max: 200, note: 'Opal card; weekly cap AUD 50; Sunday cap AUD 2.80' },
        utilities: { min: 0, max: 120, note: 'Most shared rentals include water; electricity extra' },
        misc: { min: 150, max: 200 },
        totalMonthly: { min: 1550, max: 2240 },
        totalMonthlyINR: { min: 86335, max: 124768 },
        highlights: [
          'University of Sydney, UNSW, UTS, Macquarie — all in metro Sydney',
          'Harris Park (Parramatta) = "Little India" of Sydney; cheap Indian food and community',
          'Opal card Sunday cap: AUD 2.80 unlimited travel — great for exploring the city',
          'Beach access (Bondi, Manly) free — best stress-buster during exams',
          'Australia minimum wage AUD 24.10/hr (2026) — highest in the world',
        ],
      },
      {
        city: 'Melbourne',
        currency: 'AUD',
        rent: { min: 800, max: 1200, note: 'Shared room near Monash/RMIT/Melbourne Uni (Carlton, Footscray, Clayton)' },
        groceries: { min: 280, max: 380 },
        transport: { min: 115, max: 150, note: 'Myki monthly pass; Zone 1 or Zone 1+2' },
        utilities: { min: 0, max: 100, note: 'Shared utilities among 3–4 housemates' },
        misc: { min: 130, max: 180 },
        totalMonthly: { min: 1325, max: 2010 },
        totalMonthlyINR: { min: 73803, max: 111957 },
        highlights: [
          'University of Melbourne (#33 world), Monash, RMIT, La Trobe, Deakin',
          'Footscray area has large Vietnamese and Indian community with cheap international groceries',
          'Tram network is excellent and free in CBD zone — saves AUD 50–80/month for inner-city students',
          'Melbourne\'s café culture means plentiful hospitality jobs at premium wages (AUD 28–35/hr weekend penalty rates)',
          'Most liveable city in the world — ranked #10 by EIU 2025',
        ],
      },
      {
        city: 'Brisbane',
        currency: 'AUD',
        rent: { min: 700, max: 1000, note: 'Shared room near UQ/QUT/Griffith (St Lucia, South Bank, Nathan)' },
        groceries: { min: 250, max: 350 },
        transport: { min: 110, max: 140, note: 'Translink Go Card; zone-based monthly pass' },
        utilities: { min: 0, max: 90, note: 'Queensland electricity cheaper than NSW/VIC' },
        misc: { min: 120, max: 170 },
        totalMonthly: { min: 1180, max: 1750 },
        totalMonthlyINR: { min: 65726, max: 97475 },
        highlights: [
          'University of Queensland (#40 world), QUT, Griffith University',
          'Lowest cost of major Australian cities — 25–30% cheaper than Sydney',
          'Growing tech sector post-2032 Olympics preparation — more jobs',
          'Sunny subtropical climate year-round — lower clothing/heating costs',
          'Gold Coast (45 min by train) for beach lifestyle and hospitality jobs',
        ],
      },
    ],
    savingTips: [
      'Harris Park (Sydney) or Footscray (Melbourne) for Indian groceries: rice, dal, frozen parathas at near-India prices',
      'Woolworths/Coles "Everyday Rewards" / "Flybuys" loyalty programs give 5–10% cash back on groceries',
      'Aldi stores available in all major cities — 20–30% cheaper than Woolworths/Coles for basics',
      'Use university gym facilities instead of commercial gym membership — saves AUD 50–80/month',
      'Australia\'s Opal card Sunday cap (AUD 2.80 all-day) — plan weekly Indian grocery runs on Sundays to save transport costs',
      'Cook bulk on Sundays — dal, rice, sabzi for the week in 2 hours; saves 80% vs eating out',
      'Student ID unlocks discounts at restaurants, cinemas (Hoyts, Event), and retail chains — always ask before paying full price',
    ],
    workRights: '48 hours per fortnight (24 hrs/week effectively) during semester; unlimited during semester breaks. Subclass 485 post-study: up to 6 years work right.',
    averagePartTimeEarnings: 'AUD 24.10/hr × 24 hrs/fortnight = AUD 1,160/month — covers rent in Brisbane; majority of rent in Sydney',
    relatedLinks: [
      { href: '/universities/country/australia', label: 'Browse Australia Universities' },
      { href: '/visa-guide/australia', label: 'Australia Visa Guide' },
      { href: '/blog/cost-of-living-sydney-indian-students', label: 'Sydney Cost Guide' },
      { href: '/blog/australia-nursing-course-indians-2026', label: 'Australia Nursing Guide' },
      { href: '/book-counselling', label: 'Free Counselling' },
    ],
  },
];

export function getCostGuideBySlug(slug: string): CostOfLivingGuide | undefined {
  return costOfLivingGuides.find(g => g.slug === slug);
}
