export interface VisaStep {
  step: number;
  title: string;
  description: string;
}

export interface DocumentItem {
  name: string;
  notes?: string;
}

export interface RejectionReason {
  reason: string;
  howToAvoid: string;
}

export interface VisaGuide {
  country: string;
  slug: string;
  flagEmoji: string;
  visaName: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  processingTime: string;
  visaFee: string;
  workRights: string;
  postStudyWork: string;
  highlights: string[];
  steps: VisaStep[];
  documents: DocumentItem[];
  timeline: { phase: string; duration: string; action: string }[];
  rejectionReasons: RejectionReason[];
  tips: string[];
  relatedLinks: { href: string; label: string }[];
}

export const visaGuides: VisaGuide[] = [
  {
    country: 'Canada',
    slug: 'canada',
    flagEmoji: '🇨🇦',
    visaName: 'Canada Study Permit',
    metaTitle: 'Canada Student Visa Guide 2026 for Indians: Study Permit Process & Documents',
    metaDescription: 'Complete Canada student visa (study permit) guide for Indian students 2026. SDS stream, documents checklist, GIC, processing time, financial requirements, and rejection reasons.',
    intro: 'Canada\'s Study Permit is issued by IRCC (Immigration, Refugees and Citizenship Canada). It allows you to study full-time at a Designated Learning Institution (DLI) and work up to 20 hours/week off-campus during semester. With the SDS (Student Direct Stream), most Indian students receive their permit in as little as 20 working days.',
    processingTime: '20 working days (SDS) / 4–8 weeks (Regular)',
    visaFee: 'CAD 150 + CAD 85 biometrics = CAD 235 (~₹14,300)',
    workRights: '20 hrs/week off-campus during semester; unlimited during scheduled breaks',
    postStudyWork: 'PGWP: up to 3 years open work permit after graduation',
    highlights: [
      'SDS fast-track: 20 working days if IELTS 6.0+ and funds ready',
      'Work 20 hrs/week off-campus; full-time during semester breaks',
      '3-year PGWP after 2-year Master\'s — the fastest PR pathway',
      'GIC (CAD 10,000) is refundable — you get it back after landing',
      'Dependants can accompany if you have sufficient funds',
    ],
    steps: [
      { step: 1, title: 'Receive Letter of Acceptance (LOA)', description: 'Get admitted to a DLI. Confirm your institution is on the IRCC DLI list. Pay first year tuition (required for SDS stream).' },
      { step: 2, title: 'Open a GIC (SDS applicants)', description: 'Deposit CAD 10,000 into a Guaranteed Investment Certificate with a participating Canadian bank (Scotiabank, TD, CIBC). This proves financial capacity and is refunded after arrival.' },
      { step: 3, title: 'Gather documents', description: 'Collect all required documents: passport, LOA, GIC confirmation, IELTS score (6.0+ all bands for SDS), medical exam results (SDS), financial proof, SOP, photos.' },
      { step: 4, title: 'Complete medical exam (SDS only)', description: 'Visit an IRCC-designated physician in India for an upfront medical examination. Results are uploaded directly to IRCC. Without this, you cannot use SDS stream.' },
      { step: 5, title: 'Apply online via IRCC portal', description: 'Create an IRCC account at canada.ca. Complete Form IMM 1294 online. Upload all documents. Pay CAD 150 application fee + CAD 85 biometrics fee.' },
      { step: 6, title: 'Biometrics at VAC', description: 'Book and attend your biometrics appointment at a VFS Global Canada VAC in India. Available in 9+ cities including Delhi, Mumbai, Chandigarh, Chennai, Hyderabad, Ahmedabad, Kolkata, Pune, Jalandhar.' },
      { step: 7, title: 'Receive Port of Entry (PoE) letter', description: 'For SDS applicants, receive the PoE letter electronically within ~20 working days. For regular stream, receive study permit approval letter. Keep all documents for the airport.' },
      { step: 8, title: 'Travel to Canada', description: 'Present PoE letter + LOA + passport at Canadian airport immigration. The actual study permit is stamped/issued at the port of entry. Collect it before leaving the immigration hall.' },
    ],
    documents: [
      { name: 'Valid passport', notes: 'Must be valid for entire study period + at least 6 months beyond' },
      { name: 'Letter of Acceptance from DLI', notes: 'Must show DLI number, program name, start date' },
      { name: 'Tuition payment proof (SDS)', notes: 'Receipt showing first year tuition paid in full' },
      { name: 'GIC confirmation letter (SDS)', notes: 'CAD 10,000 invested; from CIBC, TD, Scotiabank, or participating bank' },
      { name: 'IELTS Academic score report (SDS)', notes: 'Overall 6.0, no band below 6.0; from an approved test centre' },
      { name: 'Medical exam results (SDS)', notes: 'Completed with IRCC-designated physician; uploaded by doctor' },
      { name: 'Statement of Purpose', notes: 'Why Canada, why this program, career goals, ties to India' },
      { name: 'Financial proof (Regular stream)', notes: '3–6 months bank statements; stable balance = tuition + CAD 10,000' },
      { name: 'Biometric passport photo', notes: '35mm × 45mm; white background; neutral expression' },
      { name: 'IMM 1294 application form', notes: 'Completed online via IRCC account' },
    ],
    timeline: [
      { phase: 'Apply to university', duration: 'October–January', action: 'Submit university applications; aim for January–February admission deadline' },
      { phase: 'Receive LOA', duration: 'February–March', action: 'Accept offer, pay tuition deposit, receive official LOA' },
      { phase: 'Open GIC / gather docs', duration: 'March–April', action: 'Open GIC account, complete medical exam (SDS), prepare all documents' },
      { phase: 'Submit visa application', duration: 'April–May', action: 'Apply online via IRCC; pay fees; submit biometrics at VAC' },
      { phase: 'Visa decision', duration: 'May–June (SDS) / June–July (Regular)', action: 'Receive PoE letter or approval letter' },
      { phase: 'Travel to Canada', duration: 'August–September', action: 'Fly to Canada; collect study permit at immigration' },
    ],
    rejectionReasons: [
      { reason: 'Insufficient financial proof', howToAvoid: 'Maintain stable funds for 3–6 months; no sudden large deposits; include income source letters from parents' },
      { reason: 'Weak Statement of Purpose', howToAvoid: 'Explain specific reasons for choosing Canada and your exact program; demonstrate career plan and intent to return to India' },
      { reason: 'IELTS below SDS minimum (6.0)', howToAvoid: 'Ensure all 4 bands are 6.0+; if below, apply Regular stream or improve IELTS before applying' },
      { reason: 'Inconsistencies in documents', howToAvoid: 'Name, DOB, and address must match exactly across all documents; use passport as the reference document' },
      { reason: 'No ties to home country demonstrated', howToAvoid: 'Include evidence of family, property, job offer/scholarship in India; show officer you will return' },
      { reason: 'Missing medical exam (SDS stream)', howToAvoid: 'Complete medical exam before submitting application — it is mandatory for SDS and cannot be done after submission' },
    ],
    tips: [
      'Apply to university by November–January for September intake to allow maximum processing time',
      'Use SDS stream if your IELTS is 6.0+ and you can pay tuition upfront — saves 4–6 weeks',
      'Book biometrics appointment immediately after submitting your application — slots fill up weeks in advance',
      'Prepare a strong SOP — IRCC officers can refuse if not convinced you will return to India',
      'GIC is refundable: you get CAD 10,000 back in monthly installments after arriving in Canada',
    ],
    relatedLinks: [
      { href: '/universities/country/canada', label: 'Browse Canada Universities' },
      { href: '/blog/canada-student-visa-step-by-step-2026', label: 'Detailed Visa Step Guide' },
      { href: '/blog/canada-pr-after-masters-2026-guide', label: 'Canada PR After Masters' },
      { href: '/book-counselling', label: 'Free Visa Counselling' },
    ],
  },

  {
    country: 'United Kingdom',
    slug: 'uk',
    flagEmoji: '🇬🇧',
    visaName: 'UK Student Route (formerly Tier 4)',
    metaTitle: 'UK Student Visa Guide 2026 for Indians: CAS, IHS, Documents & Process',
    metaDescription: 'Complete UK Student Visa (Student Route) guide for Indian students 2026. CAS number, IHS surcharge, financial requirements, biometrics, processing time and rejection tips.',
    intro: 'The UK Student Route (formerly Tier 4) is managed by UK Visas and Immigration (UKVI). It requires a CAS (Confirmation of Acceptance for Studies) from your UK university, proof of financial support for 28 consecutive days, and payment of the Immigration Health Surcharge (IHS) — which gives you full NHS access during your studies.',
    processingTime: '3 weeks (standard) / 5 working days (priority) / next day (super priority)',
    visaFee: '£490 + IHS £1,035/year (~£2,070 for 2-year Master\'s) (~₹2.9L for standard + IHS)',
    workRights: '20 hrs/week during term; full-time during vacations',
    postStudyWork: 'Graduate Route: 2 years (Bachelor/Master) or 3 years (PhD)',
    highlights: [
      'CAS issued by university — essential before you can apply',
      'IHS: £1,035/year gives you full NHS healthcare access',
      '28-day funds holding rule — strictly enforced by UKVI',
      'Graduate Route visa: work anywhere in UK for 2 years after graduation',
      'TB test mandatory for all Indian applicants',
      'IELTS must be IELTS for UKVI (Academic for UKVI) — not regular IELTS',
    ],
    steps: [
      { step: 1, title: 'Receive your CAS from university', description: 'Your UK university issues a unique CAS reference number after you accept your offer and complete pre-enrolment. CAS is typically issued 3–6 months before course start. You cannot apply without it.' },
      { step: 2, title: 'Prepare financial evidence', description: 'Hold funds for 28 consecutive days before applying. London students: £1,334/month × 9 months + tuition. Outside London: £1,023/month × 9 months + tuition. The 28-day holding period is strictly verified.' },
      { step: 3, title: 'Take TB test', description: 'All Indian nationals must get a tuberculosis (TB) test from an UKVI-approved clinic in India. Results must be provided with your visa application. Clinics available in major Indian cities — cost: ₹1,800–3,000.' },
      { step: 4, title: 'Pay Immigration Health Surcharge (IHS)', description: 'Pay £1,035 per year of your visa upfront at IHS.homeoffice.gov.uk before applying. For a 2-year Master\'s: £2,070. This is non-refundable even if refused.' },
      { step: 5, title: 'Apply online via UKVI portal', description: 'Complete your online application at apply-to-visit-or-stay-in-the-uk.homeoffice.gov.uk. Upload all documents. Pay £490 visa fee. Select standard, priority, or super priority.' },
      { step: 6, title: 'Biometrics at VFS Global', description: 'Book and attend biometrics at a VFS Global UKVI centre in India. Available in 10+ cities. Allow 2–4 weeks for appointment availability in peak season (May–August).' },
      { step: 7, title: 'Receive visa decision', description: 'Standard: 3 weeks. Priority: 5 working days. Vignette sticker placed in passport or BRP (Biometric Residence Permit) collection card issued.' },
      { step: 8, title: 'Collect BRP in UK', description: 'Within 10 days of arriving in the UK, collect your Biometric Residence Permit (BRP) from the post office specified in your visa. This is your main ID document in the UK.' },
    ],
    documents: [
      { name: 'Valid passport', notes: 'All previous passports also required' },
      { name: 'CAS reference number', notes: 'Issued by your UK university; check all details match exactly' },
      { name: '28-day bank statements', notes: 'Lowest balance during 28-day period must meet requirement; no gaps' },
      { name: 'IHS payment receipt', notes: 'Printed confirmation from IHS portal; paid before application' },
      { name: 'TB test certificate', notes: 'From UKVI-approved clinic; valid for 6 months; mandatory for Indians' },
      { name: 'IELTS for UKVI score', notes: 'Must be IELTS Academic for UKVI (not regular IELTS); check university CAS minimum' },
      { name: 'Academic transcripts', notes: 'Degree certificates, marksheets — may be requested by UKVI' },
      { name: 'Passport photo', notes: 'Meets UKVI photo requirements: 45mm × 35mm, plain cream/light grey background' },
      { name: 'ATAS certificate', notes: 'Required for certain sensitive subjects (security check); check if your course needs it' },
    ],
    timeline: [
      { phase: 'Apply to university', duration: 'October–January', action: 'Apply via UCAS (undergrad) or direct university portal (postgrad)' },
      { phase: 'Receive offer + CAS', duration: 'February–June', action: 'Accept offer, complete pre-enrolment, request CAS from university' },
      { phase: 'Prepare finances', duration: '28 days before application', action: 'Ensure funds in account for 28 consecutive days meeting requirement' },
      { phase: 'Take TB test', duration: 'Anytime after CAS received', action: 'Book TB test at UKVI approved clinic; results valid 6 months' },
      { phase: 'Apply for visa', duration: 'June–July (for September start)', action: 'Pay IHS, apply online, book and attend biometrics' },
      { phase: 'Receive visa', duration: '3 weeks after biometrics', action: 'Vignette in passport; collect BRP on arrival in UK' },
    ],
    rejectionReasons: [
      { reason: 'Funds dipped below requirement during 28-day period', howToAvoid: 'Do NOT spend from the account during the 28 days; maintain a buffer above minimum' },
      { reason: 'CAS details don\'t match application', howToAvoid: 'Every detail (name, DOB, course title, fee) must match CAS exactly — no discrepancies' },
      { reason: 'No TB test certificate', howToAvoid: 'Book TB test as soon as you have your CAS; it\'s mandatory and cannot be waived' },
      { reason: 'IELTS not from UKVI-approved test (regular IELTS used)', howToAvoid: 'Ensure you booked IELTS Academic for UKVI — ask test centre explicitly for the UKVI version' },
      { reason: 'Applied too close to course start date', howToAvoid: 'Apply at least 6 weeks before course start; ideally 3 months before for standard processing' },
      { reason: 'Previous UK visa refusal not disclosed', howToAvoid: 'Always declare all previous visa refusals to any country — non-disclosure is grounds for permanent refusal' },
    ],
    tips: [
      'Apply as early as possible once you have CAS — 3 months before start date is ideal',
      'IHS is non-refundable — double-check your course dates before paying',
      'Priority service (£500 extra) is worth it in June–July when standard processing can be slow',
      'Graduate Route (2-year post-study work) is applied for after graduation, NOT on your initial visa',
      'Open a UK bank account online before arriving — Monzo, Starling (international signup) works with BRP',
    ],
    relatedLinks: [
      { href: '/universities/country/uk', label: 'Browse UK Universities' },
      { href: '/blog/uk-student-visa-tier-4-guide-indians', label: 'Detailed UK Visa Guide' },
      { href: '/blog/scholarships-india-students-uk-2026', label: 'UK Scholarships Guide' },
      { href: '/book-counselling', label: 'Free Visa Counselling' },
    ],
  },

  {
    country: 'Australia',
    slug: 'australia',
    flagEmoji: '🇦🇺',
    visaName: 'Australia Student Visa (Subclass 500)',
    metaTitle: 'Australia Student Visa 500 Guide 2026 for Indians: GTE, Documents & Process',
    metaDescription: 'Complete Australia Student Visa Subclass 500 guide for Indian students 2026. GTE statement, OSHC, financial requirements, ImmiAccount application process, and Temporary Graduate Visa (485) pathway.',
    intro: 'Australia\'s Student Visa Subclass 500 is applied for through the online ImmiAccount portal. The most important and unique requirement is the GTE (Genuine Temporary Entrant) statement — a personal assessment of whether you genuinely intend to study and return home. Australia also requires mandatory OSHC (health insurance) for the full visa duration.',
    processingTime: '4–6 weeks (standard); 2–4 months (complex cases)',
    visaFee: 'AUD 710 (~₹39,000)',
    workRights: '48 hrs/fortnight during semester; unlimited during semester breaks',
    postStudyWork: 'Temporary Graduate Visa 485: 2–6 years depending on qualification and location',
    highlights: [
      'GTE statement is the most critical part — officer-assessed subjectively',
      'OSHC mandatory before applying: AUD 600–700/year per person',
      '48 hours/fortnight work rights — more than UK\'s 20 hrs/week',
      'Regional study bonus: extra 485 duration + PR points',
      'Subclass 485 opens direct pathway to skilled migration and PR',
      'Dependants can get full work rights if you are a PhD student',
    ],
    steps: [
      { step: 1, title: 'Enrol and receive CoE', description: 'Accept your university offer and complete enrolment. University issues a Confirmation of Enrolment (CoE) for each course. You need the CoE reference number to apply.' },
      { step: 2, title: 'Arrange OSHC', description: 'Purchase Overseas Student Health Cover from an approved provider: Medibank, Allianz, Bupa, HCF, or nib. Must cover entire visa duration. Your university may arrange it. AUD 600–700/year for single students.' },
      { step: 3, title: 'Write your GTE statement', description: 'Prepare a 1–2 page Genuine Temporary Entrant statement explaining: why Australia for this specific program, career relevance, ties to India, and plans after study. Be specific — generic answers are a red flag.' },
      { step: 4, title: 'Prepare financial evidence', description: 'Show AUD 29,710 for 12 months living + full tuition fees via bank statements, term deposit, or education loan sanction letter. Evidence must be recent (within 3–6 months).' },
      { step: 5, title: 'Apply via ImmiAccount', description: 'Create ImmiAccount at immi.homeaffairs.gov.au. Select Student (Temporary) — Subclass 500. Complete Form 157A. Upload all documents. Pay AUD 710 visa fee.' },
      { step: 6, title: 'Health examination (if requested)', description: 'Most Indian applicants are required to undergo an upfront health examination at an approved panel physician. Book early — popular slots fill up weeks in advance in major cities.' },
      { step: 7, title: 'Biometrics at AVAC', description: 'Visit Australian Visa Application Centre (AVAC/VFS Global) for biometrics if requested. Available in Delhi, Mumbai, Chennai, Hyderabad, Kolkata, Ahmedabad, Chandigarh.' },
      { step: 8, title: 'Receive visa grant', description: 'Visa granted electronically — no sticker in passport. Receive a Visa Grant Notice via email. Print and keep this document. Present at Australian border control when entering.' },
    ],
    documents: [
      { name: 'Valid passport + all previous passports', notes: 'Must be valid beyond course end date' },
      { name: 'Confirmation of Enrolment (CoE)', notes: 'From university; shows course dates and fees' },
      { name: 'GTE statement', notes: '1–2 pages; specific, honest, tailored — the most important document' },
      { name: 'OSHC certificate', notes: 'Covers full duration; from approved provider' },
      { name: 'Financial evidence', notes: 'AUD 29,710 minimum for living + full tuition; bank statements / loan letter' },
      { name: 'IELTS/PTE score', notes: 'Usually IELTS 6.0–6.5; check specific university requirement' },
      { name: 'Academic transcripts', notes: 'Certified copies; may need official translation if not in English' },
      { name: 'Birth certificate', notes: 'For identity verification' },
      { name: 'Passport-size photos', notes: '35mm × 45mm; white background; recent' },
    ],
    timeline: [
      { phase: 'Apply to university', duration: 'October–February', action: 'Apply for July or February Australian intakes' },
      { phase: 'Receive CoE', duration: '2–4 weeks after acceptance', action: 'Pay deposit and complete enrolment to trigger CoE' },
      { phase: 'OSHC + documents', duration: '2–4 weeks', action: 'Purchase OSHC; write GTE statement; gather financial evidence' },
      { phase: 'Apply for visa', duration: 'At least 2 months before start', action: 'Submit ImmiAccount application; pay AUD 710' },
      { phase: 'Health exam + biometrics', duration: '2–4 weeks after application', action: 'Complete if requested by Department of Home Affairs' },
      { phase: 'Visa granted', duration: '4–8 weeks after application', action: 'Receive electronic Visa Grant Notice via email' },
    ],
    rejectionReasons: [
      { reason: 'Weak or generic GTE statement', howToAvoid: 'Be very specific: name exact features of your program, professor, or industry connection unique to Australia' },
      { reason: 'Insufficient financial evidence', howToAvoid: 'Show AUD 29,710 + full tuition; loan sanction letter is acceptable; ensure it\'s recent and from a recognised financial institution' },
      { reason: 'Prior Australian visa violations', howToAvoid: 'Any prior overstay or condition breach must be disclosed and explained; non-disclosure is automatic refusal' },
      { reason: 'OSHC not covering full period', howToAvoid: 'Purchase OSHC for the full course duration + at least 1 month buffer; extend automatically if course extends' },
      { reason: 'Inconsistent study history', howToAvoid: 'Explain any gaps in study (work, health, etc.) in GTE statement; officer checks for consistency of academic history' },
    ],
    tips: [
      'Spend significant time on your GTE — it is the most subjectively assessed part of the Australian visa',
      'Regional study (outside Sydney/Melbourne/Brisbane) gives extra 485 duration and PR points',
      'Electronic visa means no sticker — print your Visa Grant Notice and carry it when travelling',
      'The 48-hour/fortnight work limit is per fortnight (2 weeks), not per week — that\'s 24 hrs/week effectively',
      'Apply 2–3 months before course start; June–August applications take longer due to high volume',
    ],
    relatedLinks: [
      { href: '/universities/country/australia', label: 'Browse Australia Universities' },
      { href: '/blog/australia-student-visa-subclass-500-guide', label: 'Detailed Australia Visa Guide' },
      { href: '/blog/australia-nursing-course-indians-2026', label: 'Australia Nursing Guide' },
      { href: '/book-counselling', label: 'Free Visa Counselling' },
    ],
  },

  {
    country: 'Germany',
    slug: 'germany',
    flagEmoji: '🇩🇪',
    visaName: 'Germany National Visa (Type D) for Students',
    metaTitle: 'Germany Student Visa Guide 2026 for Indians: APS, Blocked Account & Process',
    metaDescription: 'Complete Germany student visa guide for Indian students 2026. APS certificate, blocked account (Sperrkonto), embassy appointment, documents, and residence permit process after arrival.',
    intro: 'Germany\'s student visa is a National Visa (Type D) issued by the German Embassy or Consulate in India. It is unique in two ways: Indian students must first obtain an APS (Akademische Prüfstelle) document authentication certificate, and must open a blocked account (Sperrkonto) with €11,904 before applying. Germany also has no tuition fees at public universities — making it the most affordable quality education destination.',
    processingTime: '4–8 weeks after embassy appointment',
    visaFee: '€75 (~₹6,700)',
    workRights: '120 full days or 240 half days per year',
    postStudyWork: '18-month job-seeking visa (Aufenthaltserlaubnis zur Arbeitsuche) after graduation',
    highlights: [
      'No tuition fees at public universities (only €150–350/semester contribution)',
      'APS certificate mandatory for Indian students — start 4–6 months early',
      'Blocked account €11,904 proves financial capacity — released monthly after arrival',
      '18-month post-study job-search visa converts to work visa (Blue Card)',
      'EU Blue Card: fast-track to German permanent residence (21 months)',
      'Germany has ~1 million job vacancies in IT, engineering, healthcare sectors',
    ],
    steps: [
      { step: 1, title: 'Obtain APS Certificate', description: 'Register at aps-india.de. Submit academic documents (marksheets, degree certificates). Attend in-person interview at APS office (New Delhi or Chennai). Receive APS certificate in 4–8 weeks. Cost: ~₹18,000. MANDATORY for all Indian students — universities won\'t admit without it.' },
      { step: 2, title: 'Apply to German universities', description: 'Apply through university portals or uni-assist.de (for multi-university applications; €75 + €30/extra). Deadline: usually 15 July for Winter Semester (October start). Receive Zulassungsbescheid (admission letter).' },
      { step: 3, title: 'Open Blocked Account (Sperrkonto)', description: 'Deposit €11,904 with Fintiba, Coracle, or Deutsche Bank (expatrio). Setup takes 3–5 days online. Cost: €79–89 one-time. Receive Sperrkonto confirmation letter — required for visa.' },
      { step: 4, title: 'Arrange health insurance', description: 'German health insurance is mandatory from day 1. Enrol with public insurance (Techniker Krankenkasse/TK, AOK, or BARMER) — ~€110/month. Ensure coverage starts from your first day in Germany. International private insurance is not accepted at most universities.' },
      { step: 5, title: 'Book embassy appointment', description: 'Book appointment at German Embassy (New Delhi) or Consulate (Mumbai, Chennai, Kolkata, Bengaluru). Appointments fill up fast — book 6–8 weeks in advance in peak season. Check for cancellation slots early morning.' },
      { step: 6, title: 'Attend visa appointment', description: 'Bring all original documents + copies. Pay €75 visa fee. Biometrics taken at appointment. Interview may occur (particularly for technical subjects). Keep calm; be specific about study plans and return intentions.' },
      { step: 7, title: 'Receive visa and travel', description: 'Visa issued in 4–8 weeks as a National Visa (Type D) sticker in passport. Valid for 3 months entry. Travel to Germany and register your address (Anmeldung) within 2 weeks of arrival.' },
      { step: 8, title: 'Convert to Residence Permit', description: 'Within 90 days of arrival, apply for Aufenthaltserlaubnis (Residence Permit for Study) at the Ausländerbehörde (foreigner\'s office). Bring: passport, Anmeldung confirmation, university enrollment, health insurance, blocked account statement, biometric photo.' },
    ],
    documents: [
      { name: 'APS Certificate', notes: 'Mandatory for Indians; issued by APS India; takes 4–8 weeks' },
      { name: 'University admission letter (Zulassungsbescheid)', notes: 'Official letter from German university' },
      { name: 'Blocked account (Sperrkonto) confirmation', notes: '€11,904 deposited; from Fintiba/Coracle/Deutsche Bank' },
      { name: 'Valid passport + copies', notes: 'Including all previous passports' },
      { name: 'Completed visa application form', notes: 'Online at videx-elias.diplo.de; bring printed copy' },
      { name: 'Biometric passport photo', notes: '3.5 × 4.5 cm; white background; strict ICAO standards' },
      { name: 'Health insurance certificate', notes: 'TK, AOK, or BARMER; coverage from first day in Germany' },
      { name: 'Academic certificates + marksheets', notes: 'All degree certificates; certified copies; APS already verified originals' },
      { name: 'Language proof', notes: 'German C1/TestDaF for German programs; IELTS 6.5 for English programs' },
      { name: 'CV and Motivation Letter', notes: 'Europass format recommended; tailor to your specific program' },
      { name: 'Proof of accommodation (if available)', notes: 'Student housing confirmation or rental agreement; not always available in advance' },
    ],
    timeline: [
      { phase: 'APS application', duration: 'January–March (for Oct intake)', action: 'Register, submit documents, attend interview at APS' },
      { phase: 'University applications', duration: 'February–June', action: 'Apply online; deadline 15 July for Winter Semester' },
      { phase: 'APS certificate received', duration: 'April–May', action: 'Typically 4–8 weeks after application' },
      { phase: 'Admission + Sperrkonto', duration: 'June–July', action: 'Open blocked account after admission; takes 3–5 days' },
      { phase: 'Embassy appointment + visa', duration: 'July–August', action: 'Book appointment early; apply for visa; 4–8 weeks processing' },
      { phase: 'Travel + register', duration: 'September', action: 'Arrive in Germany; Anmeldung within 2 weeks; apply for Residence Permit' },
    ],
    rejectionReasons: [
      { reason: 'Missing APS certificate', howToAvoid: 'APS is mandatory; without it, embassy will reject application immediately; start 4–6 months before visa appointment' },
      { reason: 'Blocked account not in applicant\'s name', howToAvoid: 'Sperrkonto must be in your name; parent\'s accounts not accepted' },
      { reason: 'Insufficient language documentation', howToAvoid: 'German-taught programs: TestDaF TDN4/DSH-2 mandatory; English programs: IELTS 6.5 or equivalent' },
      { reason: 'Applying too late for appointment', howToAvoid: 'Embassy appointments are limited; book 6–8 weeks in advance; check cancellations daily' },
      { reason: 'Health insurance not covering Germany', howToAvoid: 'Travel insurance is NOT acceptable; must be German public health insurance (TK, AOK, BARMER)' },
    ],
    tips: [
      'Start the APS process at least 4–6 months before your intended start date — it\'s the longest bottleneck',
      'Fintiba is the most popular blocked account provider for Indian students — fast setup and student-friendly',
      'Learn basic German (A2) before arriving — it makes everyday life, banking, and administration much easier',
      'DAAD offers living cost scholarships (€850/month) for Master\'s students — apply at daad.de with October deadline',
      'After getting a German job, EU Blue Card holders can apply for permanent residence in just 21 months',
    ],
    relatedLinks: [
      { href: '/universities/country/germany', label: 'Browse Germany Universities' },
      { href: '/blog/germany-student-visa-process-indians-2026', label: 'Detailed Germany Visa Guide' },
      { href: '/blog/germany-free-education-complete-guide', label: 'Germany Free Education Guide' },
      { href: '/book-counselling', label: 'Free Visa Counselling' },
    ],
  },

  {
    country: 'United States',
    slug: 'usa',
    flagEmoji: '🇺🇸',
    visaName: 'USA F-1 Student Visa',
    metaTitle: 'USA F-1 Student Visa Guide 2026 for Indians: I-20, DS-160, SEVIS & Interview',
    metaDescription: 'Complete USA F-1 student visa guide for Indian students 2026. I-20 form, DS-160, SEVIS fee, embassy interview tips, financial proof, OPT/STEM OPT explained.',
    intro: 'The F-1 Visa is the most common US student visa for academic programs. Unlike most other countries, the USA requires an in-person visa interview at the US Embassy or Consulate in India. The F-1 process involves obtaining an I-20 form from your university, paying the SEVIS fee, completing the DS-160 online form, and attending an interview. Interview wait times in India can range from 2 weeks to 8+ months in peak season.',
    processingTime: 'Interview appointment: 2 weeks to 8+ months; visa issued 1–3 days after interview',
    visaFee: 'USD 185 (MRV fee) + USD 350 SEVIS fee = USD 535 (~₹44,500)',
    workRights: 'On-campus only: 20 hrs/week during semester; off-campus generally not permitted',
    postStudyWork: 'OPT: 12 months; STEM OPT extension: additional 24 months (36 months total for STEM graduates)',
    highlights: [
      'In-person interview required at US Embassy/Consulate in India',
      'I-20 form from university is essential before any application steps',
      'SEVIS fee USD 350 paid before booking interview appointment',
      'OPT + STEM OPT: up to 3 years work authorization after graduation',
      'Strong "immigrant intent" ties required — must prove you will return to India',
      'Financial proof: Show ability to fund ENTIRE program, not just first year',
    ],
    steps: [
      { step: 1, title: 'Receive I-20 from university', description: 'After paying the SEVIS I-901 fee, your university\'s Designated School Official (DSO) issues Form I-20. This proves your enrollment. The SEVIS ID on the I-20 is needed for all subsequent steps.' },
      { step: 2, title: 'Pay SEVIS fee', description: 'Pay USD 350 at fmjfee.com using SEVIS ID from I-20. Keep the payment receipt — you must bring it to the visa interview. Allow 3 business days for payment to process.' },
      { step: 3, title: 'Complete DS-160 online form', description: 'Fill out the DS-160 nonimmigrant visa application at ceac.state.gov. Answer all questions carefully and honestly. Download and print the DS-160 confirmation page with barcode — required at interview.' },
      { step: 4, title: 'Pay MRV visa fee', description: 'Pay USD 185 visa application fee (MRV fee) via the US Embassy India payment portal or at designated bank. Keep receipt for interview appointment booking.' },
      { step: 5, title: 'Book visa interview appointment', description: 'Schedule interview at ustraveldocs.com/in. Choose nearest US Embassy or Consulate: New Delhi, Mumbai, Chennai, Hyderabad, or Kolkata. Tip: Check multiple dates/times; refresh at 8am daily for new slots.' },
      { step: 6, title: 'Prepare for interview', description: 'Compile all documents. Prepare answers to common interview questions: Why this university? Why this program? Plans after graduation? Financial support source? Who is sponsoring you? Keep answers honest, specific, and concise.' },
      { step: 7, title: 'Attend visa interview', description: 'Arrive 15 minutes early. Interview takes 5–10 minutes. The consular officer asks questions and reviews documents. Most decisions (approved/refused) are given on the spot. If approved, passport is retained for visa printing.' },
      { step: 8, title: 'Receive passport with visa', description: 'Visa takes 1–7 working days to print and courier to your address. F-1 visa is typically valid for 5 years or program end date + 60 days. You may enter the USA up to 30 days before your I-20 start date.' },
    ],
    documents: [
      { name: 'Valid passport', notes: 'Must be valid for at least 6 months beyond intended stay in USA' },
      { name: 'Form I-20', notes: 'Issued by university; signed by student and DSO; carry to interview' },
      { name: 'SEVIS fee receipt', notes: 'USD 350 payment from fmjfee.com; printed confirmation required' },
      { name: 'DS-160 confirmation page', notes: 'Printed barcode page from ceac.state.gov' },
      { name: 'MRV fee payment receipt', notes: 'USD 185 visa application fee; receipt from payment portal' },
      { name: 'Appointment confirmation letter', notes: 'From ustraveldocs.com; printed for entry to consulate' },
      { name: 'Passport photo', notes: '5×5 cm; white background; USCIS-compliant format' },
      { name: 'Financial documents', notes: 'Bank statements, fixed deposits, education loan sanction; must show entire program cost' },
      { name: 'Sponsorship letter + sponsor\'s documents', notes: 'If parents/family sponsoring: their bank statements, ITR, salary slips' },
      { name: 'Academic documents', notes: 'Marksheets, degrees, IELTS/GRE/GMAT scores; show academic preparation' },
      { name: 'Acceptance letter from university', notes: 'Official offer letter; different from I-20 but often requested' },
      { name: 'Ties to India evidence', notes: 'Property documents, employment offer for after graduation, family ties; crucial to prove you will return' },
    ],
    timeline: [
      { phase: 'Apply to universities', duration: 'September–January', action: 'GRE/GMAT + IELTS/TOEFL; common app or direct portals' },
      { phase: 'Admission + I-20', duration: 'March–April', action: 'Accept offer; pay deposit; university issues I-20' },
      { phase: 'SEVIS + DS-160', duration: 'April–May', action: 'Pay SEVIS fee; complete DS-160 online' },
      { phase: 'Book interview', duration: 'April–May (BOOK EARLY)', action: 'Interview slots in peak season can be 3–8 months away; book immediately after I-20' },
      { phase: 'Interview', duration: 'June–July (if booked on time)', action: '5–10 minute interview; consular officer makes decision on the spot' },
      { phase: 'Visa issued', duration: '1–7 days after interview', action: 'Passport returned with F-1 visa; enter USA up to 30 days before I-20 start' },
    ],
    rejectionReasons: [
      { reason: 'Insufficient financial proof', howToAvoid: 'Show ability to fund ENTIRE program (all years); not just Year 1; total of USD 60,000–120,000 depending on university' },
      { reason: 'Inability to articulate study plan convincingly', howToAvoid: 'Know your program deeply — research focus, professors you want to work with, career plan; vague answers signal lack of genuine intent' },
      { reason: 'Immigrant intent suspected (Section 214(b))', howToAvoid: 'Demonstrate strong ties to India: family, property, job offer letter after graduation, return plans; the officer must believe you will return' },
      { reason: 'Previous US visa denial not disclosed', howToAvoid: 'Always disclose previous denials; non-disclosure is a permanent bar to any US visa' },
      { reason: 'Inconsistency between DS-160 and spoken answers', howToAvoid: 'Review your DS-160 answers before the interview; your verbal answers must match what you wrote' },
      { reason: 'Missing or mismatched I-20 details', howToAvoid: 'Name, program, university, and start date on I-20 must match exactly what you describe; check with DSO before interview' },
    ],
    tips: [
      'Book your visa interview IMMEDIATELY after receiving the I-20 — peak season waits are 4–8 months',
      'OPT and STEM OPT are applied for AFTER graduation — not on initial F-1 visa; plan for this',
      'The 60-day grace period after program completion is for OPT application or departure only — not for job searching without authorization',
      'H-1B lottery after OPT is not guaranteed; have a backup plan (country of origin return, other country visa)',
      'Some US consulates have different interview vibes — Hyderabad is often considered more approachable than Mumbai for students',
    ],
    relatedLinks: [
      { href: '/universities/country/usa', label: 'Browse USA Universities' },
      { href: '/blog/mba-abroad-without-gmat-2026', label: 'MBA Without GMAT Guide' },
      { href: '/book-counselling', label: 'Free Visa Counselling' },
    ],
  },
];

export function getVisaGuideBySlug(slug: string): VisaGuide | undefined {
  return visaGuides.find(g => g.slug === slug);
}
