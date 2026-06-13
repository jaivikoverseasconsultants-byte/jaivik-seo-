const TRENDS: Record<string, string> = {
  'Canada': '2026 PGWP eligibility changes for college diplomas — Express Entry now prioritises STEM & healthcare category draws, favouring international STEM graduates',
  'United Kingdom': 'Graduate Route visa under parliamentary review 2026 — Skilled Worker salary thresholds increased; consult our advisors for the latest guidance',
  'Australia': 'Subclass 485 post-study work rights extended for regional graduates in 2026 — student visa conditions also updated for course load requirements',
  'United States': 'OPT & STEM OPT extension rules under review 2026 — consult an advisor early to understand your post-graduation work options',
  'Ireland': "Ireland's Third Level Graduate Programme (stay-back visa) extended to 2 years for eligible master's graduates from 2026",
  'Germany': 'Germany Job Seeker Visa extended to 18-month search period for skilled international graduates from 2026',
};

export function getTrendingContext(country: string): string | null {
  return TRENDS[country] ?? null;
}

const LOCAL_GUIDANCE: Record<string, string[]> = {
  'United Kingdom': [
    'UK Student visa applications are processed online through the UKVI portal, with biometrics submitted at the VFS Global centre in Connaught Place, New Delhi or the Sector 18, Noida branch.',
    'Students from Ghaziabad, Meerut, and Haryana districts (Karnal, Ambala, Panipat, Kaithal) use the New Delhi VFS centre for biometric enrollment; appointments fill quickly so book early.',
    'UP applicants must provide apostilled degree transcripts, a financial undertaking letter from a scheduled bank, and a TB test certificate from a UKVI-approved clinic in Delhi-NCR.',
    'Jaivik Overseas at 333 Orbit Plaza, Crossing Republik, Ghaziabad guides NCR and Haryana students through UK CAS management, UKVI compliance, and pre-departure orientation.',
  ],
  'Canada': [
    'Canadian study permit applications for Indian students are filed online via IRCC, with biometrics at the VFS Global centre in Connaught Place, New Delhi or the Sector 18, Noida branch.',
    'Students from Ghaziabad, Meerut, and Haryana (Karnal, Kaithal, Ambala, Panipat) typically use the New Delhi VFS centre; SDS applications receive priority processing of ~20 days.',
    'UP and Haryana applicants under the SDS (Student Direct Stream) must submit an IELTS/TOEFL result, acceptance letter, proof of tuition payment, and a Guaranteed Investment Certificate (GIC).',
    'Jaivik Overseas at 333 Orbit Plaza, Crossing Republik, Ghaziabad specialises in SDS and non-SDS study permit files, LOA management, and IRCC compliance for NCR/Haryana students.',
  ],
  'Australia': [
    'Australian student visa (Subclass 500) applications are lodged online via ImmiAccount, with biometrics at the BLS International service centre in Connaught Place, New Delhi.',
    'Students from Noida and Gurgaon can also use the BLS Sector 60 Noida facility; Ghaziabad and Meerut students prefer the Delhi Connaught Place centre.',
    'UP/NCR applicants must provide a Genuine Temporary Entrant (GTE) statement, financial capacity evidence, and an Overseas Student Health Cover (OSHC) policy before lodgement.',
    'Jaivik Overseas at 333 Orbit Plaza, Crossing Republik, Ghaziabad specialises in Australia GTE statements and Subclass 500 compliance for UP/Haryana applicants.',
  ],
};

export function getLocalGuidance(country: string): string[] {
  return LOCAL_GUIDANCE[country] ?? [
    `Visa applications for ${country} are processed through the respective embassy in New Delhi. Students from Ghaziabad, Noida, Meerut, and across Haryana (Karnal, Ambala, Panipat) typically submit biometrics at the New Delhi centre.`,
    'Jaivik Overseas at 333 Orbit Plaza, Crossing Republik, Ghaziabad has 13 years of experience assisting UP/NCR students with international admissions, document preparation, and visa compliance across all major study destinations.',
  ];
}
