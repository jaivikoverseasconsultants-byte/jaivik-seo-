import type { University } from '@/types';

/** Returns concise country-specific context for study abroad text */
const countryContext: Record<string, string> = {
  USA: 'the world\'s largest higher-education market, home to eight Ivy League institutions and Silicon Valley',
  UK: 'one of the oldest university systems in the world, with Oxford and Cambridge setting global standards since the 12th century',
  Canada: 'consistently ranked among the most immigrant-friendly countries, with clear PR pathways through Express Entry and Provincial Nominee Programs',
  Australia: 'a country that welcomes over 700,000 international students annually and offers a 2–4 year post-study work visa',
  Germany: 'Europe\'s largest economy, where most public universities charge zero tuition for international students',
  France: 'a country with world-class Grandes Écoles and a strong research tradition, offering APS stay-back options for graduates',
  Netherlands: 'a highly English-friendly country where over 2,000 degree programmes are taught entirely in English',
  Singapore: 'Asia\'s education hub, home to NUS and NTU which rank among the top 20 universities globally',
  Ireland: 'the only English-speaking EU country post-Brexit, offering two-year Third Level Graduate Programme stay-back rights',
  'New Zealand': 'a student-friendly country offering up to three years of post-study work rights in a safe, high-quality environment',
  Sweden: 'a country renowned for innovation and research, home to globally leading programmes in engineering and life sciences',
  UAE: 'the Gulf\'s education hub, with campuses of top Western universities and a rapidly expanding job market',
  Denmark: 'a Scandinavian nation with world-class universities, a strong focus on sustainability and design, and a high standard of living',
  Italy: 'a country with ancient universities — Bologna, founded in 1088, is the world\'s oldest — and outstanding programmes in design and architecture',
  Spain: 'a vibrant study destination with affordable tuition, a warm climate, and strong programmes in business and humanities',
};

const workRights: Record<string, string> = {
  USA: 'OPT (Optional Practical Training) for 12 months (36 months for STEM graduates)',
  UK: 'Graduate Route visa for 2 years (3 years for PhD graduates)',
  Canada: 'Post-Graduation Work Permit (PGWP) for up to 3 years',
  Australia: 'Temporary Graduate Visa (subclass 485) for 2–4 years',
  Germany: '18-month job-seeker visa after graduation',
  France: 'APS (Autorisation Provisoire de Séjour) for 12 months',
  Netherlands: 'Orientation Year permit for 12 months',
  Singapore: 'Employment Pass with company sponsorship',
  Ireland: 'Third Level Graduate Programme for 2 years',
  'New Zealand': 'Post-Study Work Visa for up to 3 years',
  Sweden: '6-month job-seeker permit after graduation',
  UAE: 'Employment visa with company sponsorship',
  Denmark: '6-month job-seeker permit',
  Italy: 'Job-seeker visa for 12 months',
  Spain: 'Job-seeker authorisation for 12 months',
};

/**
 * Generates a rich, ~300-word prose introduction for a university page.
 * All text is derived deterministically from structured data so it's unique per university.
 */
export function generateUniversityAbout(u: University): string {
  const ctx = countryContext[u.country] || `a leading study destination`;
  const established = 2026 - u.establishedYear;
  const scholarshipText = u.scholarships.length > 0
    ? `The university offers competitive scholarships for international students, including the ${u.scholarships[0].name} (${u.scholarships[0].amount}).`
    : 'Merit-based financial aid is available for international students with strong academic profiles.';
  const campusDesc = u.campusType === 'Urban'
    ? `Located in the heart of ${u.city}, the campus benefits from excellent public transport links and proximity to industry, cultural venues, and internship opportunities.`
    : u.campusType === 'Suburban'
    ? `The campus in ${u.city} offers a quieter, residential atmosphere while remaining within easy reach of the city's professional and cultural life.`
    : `The green campus in ${u.city} provides a spacious, self-contained environment ideal for deep academic focus and a strong community atmosphere.`;

  const qsText = u.qsRanking ? `with a QS World University Ranking of #${u.qsRanking} in 2026` : 'as a leading institution recognised for academic excellence';

  return `${u.name} (${u.shortName}) is one of the premier universities in ${u.country} and ${ctx}. Founded in ${u.establishedYear} — over ${established} years ago — ${u.shortName} has established itself as a world-class institution ${qsText}.

${u.description} With a student community of over ${u.totalStudents.toLocaleString()} students, of whom approximately ${u.internationalStudentPercent}% come from abroad, ${u.shortName} offers a genuinely international learning environment. Indian students make up a significant and growing part of this international community, drawn by the university's strong academic reputation, career outcomes, and its location in ${u.country}.

${campusDesc} The campus is equipped with research libraries, modern computer labs, on-campus accommodation, sports and recreation facilities, an international student office, and a dedicated career and placement centre.

Graduates of ${u.shortName} enjoy an employment rate of ${u.employmentRate}% within six months of graduation, with an average starting salary of $${(u.avgSalaryUSD / 1000).toFixed(0)}K (approximately ₹${(u.avgSalaryUSD * 84 / 100000).toFixed(0)}L per annum). Top employers recruiting from ${u.shortName} include ${u.topEmployers.slice(0, 4).join(', ')}, reflecting the institution's strong industry connections.

${scholarshipText} The university accepts applications for ${u.intakeMonths.join(' and ')} intake, with an overall acceptance rate of ${u.acceptanceRate}%. Students from India typically require a minimum IELTS score of ${u.requirements.ieltsMin} and a GPA of ${u.requirements.gpaMin}/10 for postgraduate admission.`;
}

/**
 * Generates a "Why Indian students choose this university" section.
 */
export function generateWhyIndianStudents(u: University): string {
  const wr = workRights[u.country] || 'post-study work rights';
  const topCourses = u.popularCourses.slice(0, 3).join(', ');
  const schName = u.scholarships.length > 0 ? u.scholarships[0].name : 'available scholarships';
  const schAmt = u.scholarships.length > 0 ? u.scholarships[0].amount : 'partial funding';

  return `${u.country} is a top study destination for Indian students, and ${u.shortName} consistently ranks among the most popular choices. Here is why:

**Strong Career Outcomes:** With an average graduate salary of $${(u.avgSalaryUSD / 1000).toFixed(0)}K/year and an employment rate of ${u.employmentRate}%, ${u.shortName} alumni are highly sought after by global employers. Top recruiters include ${u.topEmployers.slice(0, 3).join(', ')}.

**Most Popular Courses for Indians:** ${topCourses} are the most commonly chosen programmes by Indian students at ${u.shortName}. These courses align well with India's growing demand for internationally qualified professionals.

**Post-Study Work Rights:** After graduating, students can apply for ${wr}, giving them the opportunity to gain international work experience and potentially transition to permanent residency.

**Scholarships Available:** ${schName} offers ${schAmt} to eligible international students. ${u.scholarships.length > 1 ? `The ${u.scholarships[1].name} (${u.scholarships[1].amount}) is also available for ${u.scholarships[1].eligibility}.` : ''}

**Visa Success Rate:** Indian students applying for a ${u.country} student visa have an average approval rate of ${u.visaApprovalRate}%. Jaivik Overseas Consultants has helped hundreds of students successfully obtain their ${u.country} student visas.`;
}

/**
 * Generates an application process section with concrete steps.
 */
export function generateApplicationProcess(u: University): {
  steps: { step: number; title: string; detail: string }[];
  note: string;
} {
  const intakeText = u.intakeMonths.length === 1
    ? `${u.intakeMonths[0]} intake`
    : `${u.intakeMonths[0]} and ${u.intakeMonths[1]} intakes`;

  return {
    steps: [
      {
        step: 1,
        title: 'Check Eligibility',
        detail: `Minimum GPA ${u.requirements.gpaMin}/10, IELTS ${u.requirements.ieltsMin}+${u.requirements.greMin ? `, GRE ${u.requirements.greMin}+` : ''}${u.requirements.gmatMin ? `, GMAT ${u.requirements.gmatMin}+` : ''}. Maximum ${u.requirements.backlogs === 0 ? 'zero backlogs' : `${u.requirements.backlogs} backlogs`} allowed.`,
      },
      {
        step: 2,
        title: 'Prepare Documents',
        detail: 'Gather transcripts, IELTS/TOEFL scores, SOP (Statement of Purpose), LORs (Letters of Recommendation), CV/Resume, and passport copy.',
      },
      {
        step: 3,
        title: 'Submit Application',
        detail: `Apply through the official ${u.name} portal. Application fee: $${u.applicationFeeUSD}. Deadline is typically 4–6 months before the ${intakeText}.`,
      },
      {
        step: 4,
        title: 'Receive Offer Letter',
        detail: `${u.shortName} typically issues conditional or unconditional offer letters within 4–8 weeks. An unconditional offer requires meeting all entry requirements.`,
      },
      {
        step: 5,
        title: 'Apply for Student Visa',
        detail: `With an offer letter and CAS (Confirmation of Acceptance), apply for your ${u.country} student visa. Approval rate for Indian students: ${u.visaApprovalRate}%.`,
      },
      {
        step: 6,
        title: 'Pre-Departure Preparation',
        detail: `Book accommodation (on-campus or off-campus), book flights, arrange forex/education loan, and attend Jaivik Overseas pre-departure briefing.`,
      },
    ],
    note: `Jaivik Overseas Consultants provides end-to-end support — from shortlisting to visa — with a dedicated counsellor assigned to your application.`,
  };
}

/**
 * Generates notable alumni text based on available university data.
 */
export function generateNotableAlumni(u: University): string {
  // Generic but unique text based on university data
  const field = u.popularCourses[0]?.split(' ').slice(-1)[0] || 'Technology';
  return `${u.name} has produced numerous leaders across industry, academia, and government. Graduates of ${u.shortName} hold prominent positions at companies including ${u.topEmployers.slice(0, 3).join(', ')}, and many have gone on to found their own ventures. The ${u.shortName} alumni network spans over 180 countries, and the university's Indian alumni community is particularly active, with dedicated chapters in Mumbai, Delhi, Bangalore, and Hyderabad. Many Indian graduates have returned home to build successful careers or start companies, leveraging the ${field} skills and global networks gained during their time at ${u.shortName}.`;
}
