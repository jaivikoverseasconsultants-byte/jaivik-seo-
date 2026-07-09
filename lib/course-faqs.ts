import { getUniversityBySlug } from '@/data/universities';
import { costOfLivingGuides } from '@/data/cost-of-living';
import type { CourseForContent } from '@/lib/courseContent';

export interface Faq {
  question: string;
  answer: string;
}

// ─── Currency lookup ────────────────────────────────────────────────────────

const COUNTRY_CURRENCY: Record<string, string> = {
  Australia: 'AUD',
  Canada: 'CAD',
  'United Kingdom': 'GBP',
  UK: 'GBP',
  'New Zealand': 'NZD',
  Germany: 'EUR',
  Ireland: 'EUR',
  Netherlands: 'EUR',
  France: 'EUR',
  Italy: 'EUR',
  Spain: 'EUR',
  Finland: 'EUR',
  Denmark: 'DKK',
  Sweden: 'SEK',
  Singapore: 'SGD',
  UAE: 'AED',
  'United Arab Emirates': 'AED',
  USA: 'USD',
  'United States': 'USD',
};

function nativeFee(course: CourseForContent): { amount: number; code: string } | null {
  const code = COUNTRY_CURRENCY[course.country];
  if (!code) return null;
  const amount = (course as Record<string, unknown>)[`annual${code}`];
  return typeof amount === 'number' && amount > 0 ? { amount, code } : null;
}

// ─── Degree-level classification (for visa logic) ──────────────────────────

type Level = 'bachelor' | 'master' | 'phd' | null;

function classifyLevel(course: CourseForContent): Level {
  const text = `${course.level} ${course.name}`.toLowerCase();
  // Certificate/diploma awards have distinct (often less generous) post-study
  // work rights that aren't safe to generalise from Bachelor's/Master's rules —
  // skip rather than guess.
  if (/certificate|diploma/.test(text)) return null;
  if (/\bphd\b|doctor/.test(text)) return 'phd';
  if (/master|msc|mba|meng|llm|mres|mphil|\bma\b/.test(text)) return 'master';
  if (/bachelor|bsc|beng|bcom|llb|\bba\b/.test(text)) return 'bachelor';
  if (course.studyLevel === 'Postgraduate') return 'master';
  if (course.studyLevel === 'Undergraduate') return 'bachelor';
  return null;
}

// ─── Q1 — Tuition fee ───────────────────────────────────────────────────────

function tuitionFeeFaq(course: CourseForContent, universityName: string): Faq | null {
  if (typeof course.annualINR !== 'number' || course.annualINR <= 0) return null;
  const inrLakh = (course.annualINR / 100000).toFixed(1);
  const native = nativeFee(course);
  const answer = native
    ? `The annual tuition fee for ${course.name} at ${universityName} is ${native.code} ${native.amount.toLocaleString()}, which is approximately ₹${inrLakh} lakh in INR for Indian students. This covers tuition only — living costs, visa fees, and health insurance are additional.`
    : `The annual tuition fee for ${course.name} at ${universityName} is approximately ₹${inrLakh} lakh in INR for Indian students (around USD ${course.annualUSD.toLocaleString()}). This covers tuition only — living costs, visa fees, and health insurance are additional.`;
  return {
    question: `What is the tuition fee for ${course.name} at ${universityName} for Indian students?`,
    answer,
  };
}

// ─── Q2 — IELTS ─────────────────────────────────────────────────────────────

function ieltsFaq(course: CourseForContent, universityName: string): Faq | null {
  if (typeof course.ieltsMin !== 'number' || course.ieltsMin <= 0) return null;
  let answer = `${universityName}'s standard IELTS requirement for ${course.name} is an overall band of ${course.ieltsMin}+`;
  if (typeof course.toeflMin === 'number' && course.toeflMin > 0) {
    answer += `. TOEFL iBT ${course.toeflMin}+ is accepted as an alternative`;
  }
  if (typeof course.pteMin === 'number' && course.pteMin > 0) {
    answer += `, and PTE Academic ${course.pteMin}+ is also accepted`;
  }
  answer += `. This is the university's published standard requirement — it is not broken down by section (listening/reading/writing/speaking) in our data, so confirm section-wise minimums with the admissions office before applying.`;
  return {
    question: `What is the IELTS requirement for ${course.name} at ${universityName}?`,
    answer,
  };
}

// ─── Q3 — Post-study work rights ────────────────────────────────────────────

function pswFaq(course: CourseForContent, universityName: string): Faq | null {
  const country = course.country;
  const dY = course.durationYears;
  if (typeof dY !== 'number' || dY <= 0) return null;

  if (country === 'Canada') {
    if (dY < 8 / 12) return null; // programs under 8 months are not PGWP-eligible
    const pgwp = dY >= 2 ? 'up to 3 years (the maximum PGWP duration)' : `approximately ${Math.round(dY * 12)} months, matching your program length`;
    return {
      question: `Can I work in Canada after completing ${course.name} at ${universityName}?`,
      answer: `Graduates of ${course.name} (a ${course.duration} program) are typically eligible for a Post-Graduation Work Permit (PGWP) of ${pgwp}. PGWP length is generally tied to program length, up to a maximum of 3 years for programs of 2 years or more. This Canadian work experience can also count toward Canadian Experience Class points under the Express Entry (CRS) system for permanent residency. Confirm exact eligibility with IRCC, as rules can change — Jaivik Overseas can guide you through the current requirements.`,
    };
  }

  if (country === 'Australia') {
    const level = classifyLevel(course);
    if (!level) return null;
    const yrs = level === 'phd' ? 3 : 2;
    return {
      question: `Can I work in Australia after completing ${course.name} at ${universityName}?`,
      answer: `Graduates of ${course.name} (${course.level}) are typically eligible for the Temporary Graduate visa (subclass 485), Post-Higher Education Work stream, for around ${yrs} years, allowing full work rights in Australia. Exact eligibility and duration depend on Department of Home Affairs rules current at the time of your application — confirm with a registered migration agent or your Jaivik Overseas counsellor.`,
    };
  }

  if (country === 'United Kingdom' || country === 'UK') {
    const level = classifyLevel(course);
    if (!level) return null;
    const yrs = level === 'phd' ? 3 : 2;
    return {
      question: `Can I work in the UK after completing ${course.name} at ${universityName}?`,
      answer: `Graduates of ${course.name} are eligible for the UK Graduate Route visa, which allows ${yrs} years of full work rights in the UK after graduation (${level === 'phd' ? 'PhD graduates get 3 years' : "2 years for Bachelor's and Master's graduates"}). No job offer is required to apply for the Graduate Route.`,
    };
  }

  if (country === 'Ireland') {
    const level = classifyLevel(course);
    if (!level) return null;
    const months = level === 'bachelor' ? 12 : 24;
    return {
      question: `Can I work in Ireland after completing ${course.name} at ${universityName}?`,
      answer: `Graduates of ${course.name} are typically eligible for the Stamp 1G Third Level Graduate Scheme, allowing ${months} months to stay and seek work in Ireland (${level === 'bachelor' ? "Bachelor's" : "Master's/PhD"} graduates). During this period you can work full-time while seeking a job that qualifies for a longer-term employment permit.`,
    };
  }

  if (country === 'Germany') {
    return {
      question: `Can I work in Germany after completing ${course.name} at ${universityName}?`,
      answer: `Graduates of ${course.name} are eligible for Germany's 18-month job-seeker residence permit (Aufenthaltserlaubnis zur Arbeitsplatzsuche), which allows you to remain in Germany to search for employment related to your qualification. Once you secure a qualifying job offer, you can switch to an EU Blue Card or work permit.`,
    };
  }

  if (country === 'New Zealand') {
    const yrsText = dY >= 2 ? 'up to 3 years' : dY >= 1 ? '1 year' : null;
    if (!yrsText) return null;
    return {
      question: `Can I work in New Zealand after completing ${course.name} at ${universityName}?`,
      answer: `Graduates of ${course.name} (a ${course.duration} program) are typically eligible for a Post-Study Work Visa of ${yrsText}, allowing full work rights in New Zealand. Exact eligibility depends on Immigration New Zealand's current settings at the time you apply — confirm with your Jaivik Overseas counsellor.`,
    };
  }

  // Country not in our supported PSW mapping — skip rather than guess.
  return null;
}

// ─── Q4 — Cost of living ────────────────────────────────────────────────────

function costOfLivingFaq(course: CourseForContent): Faq | null {
  const detailed = costOfLivingGuides.find(g => g.country === course.country);
  if (detailed && detailed.cities.length > 0) {
    const city =
      detailed.cities.find(c => course.city && c.city.toLowerCase() === course.city!.toLowerCase()) ||
      detailed.cities[0];
    return {
      question: `How much does it cost to live in ${city.city}, ${course.country} as a student?`,
      answer: `Student living costs in ${city.city} typically range from ${detailed.currencySymbol} ${city.totalMonthly.min.toLocaleString()}–${city.totalMonthly.max.toLocaleString()} per month (approximately ₹${city.totalMonthlyINR.min.toLocaleString()}–₹${city.totalMonthlyINR.max.toLocaleString()}), covering rent, groceries, transport, and utilities. See our full ${course.country} cost of living guide for a category-by-category breakdown.`,
    };
  }

  if (typeof course.livingCostUSD === 'number' && course.livingCostUSD > 0) {
    const livingCostINR = (course as Record<string, unknown>).livingCostINR;
    const inrLakh = typeof livingCostINR === 'number' ? (livingCostINR / 100000).toFixed(1) : null;
    return {
      question: `How much does it cost to live in ${course.city || course.country} as a student?`,
      answer: `Estimated annual living costs for a student at ${course.city ? course.city + ', ' : ''}${course.country} are approximately USD ${course.livingCostUSD.toLocaleString()}${inrLakh ? ` (around ₹${inrLakh} lakh)` : ''}, covering accommodation, food, transport, and personal expenses. Actual costs vary by lifestyle and city.`,
    };
  }

  return null;
}

// ─── Q5 — Worth it (fee vs graduate salary) ─────────────────────────────────

function worthItFaq(course: CourseForContent, universityName: string, universitySlug: string): Faq | null {
  const uni = getUniversityBySlug(universitySlug);
  if (!uni || !uni.avgSalaryINR || !uni.avgSalaryUSD) return null;
  if (typeof course.annualINR !== 'number' || course.annualINR <= 0) return null;
  if (typeof course.durationYears !== 'number' || course.durationYears <= 0) return null;

  const totalFeeINR = course.annualINR * course.durationYears;
  const totalFeeLakh = (totalFeeINR / 100000).toFixed(1);
  const salaryLakh = (uni.avgSalaryINR / 100000).toFixed(1);
  const paybackYears = (totalFeeINR / uni.avgSalaryINR).toFixed(1);

  return {
    question: `Is ${course.name} at ${universityName} worth it for Indian students?`,
    answer: `The total tuition cost for ${course.name} (${course.duration}) is approximately ₹${totalFeeLakh} lakh. ${universityName}'s graduates report an average salary of around ₹${salaryLakh} lakh per year (USD ${uni.avgSalaryUSD.toLocaleString()}) with a ${uni.employmentRate}% graduate employment rate — an approximate fee payback period of ${paybackYears} years from the first year's salary alone, before accounting for salary growth. This is a university-wide average, not specific to this exact program, so actual outcomes vary by specialisation and individual profile.`,
  };
}

// ─── Main export ────────────────────────────────────────────────────────────

export function generateFaqs(
  course: CourseForContent,
  universityName: string,
  universitySlug: string
): Faq[] {
  const faqs: Faq[] = [];

  const q1 = tuitionFeeFaq(course, universityName);
  if (q1) faqs.push(q1);

  const q2 = ieltsFaq(course, universityName);
  if (q2) faqs.push(q2);

  const q3 = pswFaq(course, universityName);
  if (q3) faqs.push(q3);

  const q4 = costOfLivingFaq(course);
  if (q4) faqs.push(q4);

  const q5 = worthItFaq(course, universityName, universitySlug);
  if (q5) faqs.push(q5);

  return faqs;
}
