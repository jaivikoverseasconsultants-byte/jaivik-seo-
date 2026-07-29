// Brevo transactional email — personalised lead-nurture sequence

type Band = 'low' | 'mid' | 'high';

interface UniRec {
  name: string;
  course: string;
  ieltsMin: number;
  feesINRLakh: number;
  intake: string;
}

interface LeadData {
  name: string;
  email: string;
  ieltsScore: string;
  country: string;
  course: string;
}

// ── University data by country + band ─────────────────────────────────────────

const UNIS: Record<string, Record<Band, UniRec[]>> = {
  UK: {
    low: [
      { name: 'Coventry University', course: 'Pre-Masters Foundation Year', ieltsMin: 5.0, feesINRLakh: 12.5, intake: 'Sep & Jan' },
      { name: 'University of Plymouth', course: 'International Foundation Year', ieltsMin: 5.0, feesINRLakh: 11.8, intake: 'September' },
      { name: 'University of Derby', course: 'Foundation Year Programme', ieltsMin: 5.0, feesINRLakh: 12.0, intake: 'Sep & Jan' },
      { name: 'University of Bradford', course: 'Pre-Masters Programme', ieltsMin: 5.0, feesINRLakh: 11.5, intake: 'Sep & Jan' },
      { name: 'University of Hertfordshire', course: 'International Year One', ieltsMin: 5.0, feesINRLakh: 12.8, intake: 'September' },
    ],
    mid: [
      { name: 'University of Surrey', course: 'MSc Computer Science', ieltsMin: 6.0, feesINRLakh: 22.4, intake: 'September' },
      { name: 'Brunel University London', course: 'MSc Data Science', ieltsMin: 6.0, feesINRLakh: 21.0, intake: 'September' },
      { name: 'Sheffield Hallam University', course: 'MBA International', ieltsMin: 6.0, feesINRLakh: 17.5, intake: 'Sep & Jan' },
      { name: 'City, University of London', course: 'MSc Finance', ieltsMin: 6.5, feesINRLakh: 25.0, intake: 'September' },
      { name: 'University of Reading', course: 'MSc Business', ieltsMin: 6.0, feesINRLakh: 22.0, intake: 'September' },
    ],
    high: [
      { name: 'University College London (UCL)', course: 'MSc Data Science', ieltsMin: 7.0, feesINRLakh: 33.6, intake: 'September' },
      { name: 'University of Manchester', course: 'MSc Computer Science', ieltsMin: 6.5, feesINRLakh: 26.0, intake: 'September' },
      { name: 'University of Edinburgh', course: 'MSc Informatics', ieltsMin: 6.5, feesINRLakh: 27.5, intake: 'September' },
      { name: 'University of Leeds', course: 'MSc Data Analytics', ieltsMin: 6.5, feesINRLakh: 25.0, intake: 'September' },
      { name: "King's College London", course: 'MSc AI & Machine Learning', ieltsMin: 6.5, feesINRLakh: 31.5, intake: 'September' },
    ],
  },
  Australia: {
    low: [
      { name: 'Edith Cowan University', course: 'Foundation Studies', ieltsMin: 5.5, feesINRLakh: 13.2, intake: 'Feb, Jun & Oct' },
      { name: 'Swinburne University', course: 'Diploma Pathway to Masters', ieltsMin: 5.5, feesINRLakh: 14.5, intake: 'Mar & Jul' },
      { name: 'CQUniversity', course: 'Graduate Certificate (Pathway)', ieltsMin: 5.5, feesINRLakh: 12.8, intake: 'Mar, Jul & Nov' },
      { name: 'Victoria University', course: 'Diploma Pathway', ieltsMin: 5.5, feesINRLakh: 13.0, intake: 'Feb & Jul' },
      { name: 'Charles Darwin University', course: 'Foundation Year', ieltsMin: 5.5, feesINRLakh: 11.5, intake: 'Feb & Jul' },
    ],
    mid: [
      { name: 'Griffith University', course: 'Master of Business Administration', ieltsMin: 6.0, feesINRLakh: 22.0, intake: 'Feb & Jul' },
      { name: 'Deakin University', course: 'Master of Data Analytics', ieltsMin: 6.0, feesINRLakh: 24.0, intake: 'Mar, Jul & Nov' },
      { name: 'La Trobe University', course: 'Master of Computer Science', ieltsMin: 6.0, feesINRLakh: 23.5, intake: 'Feb & Jul' },
      { name: 'Macquarie University', course: 'Master of Data Science', ieltsMin: 6.5, feesINRLakh: 25.5, intake: 'Feb & Jul' },
      { name: 'James Cook University', course: 'Master of Business', ieltsMin: 6.0, feesINRLakh: 20.0, intake: 'Feb, Jun & Sep' },
    ],
    high: [
      { name: 'Monash University', course: 'Master of Data Science', ieltsMin: 6.5, feesINRLakh: 30.0, intake: 'Feb & Jul' },
      { name: 'UNSW Sydney', course: 'Master of Information Technology', ieltsMin: 7.0, feesINRLakh: 34.5, intake: 'Feb & Jul' },
      { name: 'University of Melbourne', course: 'Master of Computer Science', ieltsMin: 7.0, feesINRLakh: 38.0, intake: 'Feb & Jul' },
      { name: 'Australian National University', course: 'Master of Computing', ieltsMin: 6.5, feesINRLakh: 28.0, intake: 'Feb & Jul' },
      { name: 'University of Queensland', course: 'Master of AI & Machine Learning', ieltsMin: 6.5, feesINRLakh: 28.5, intake: 'Feb & Jul' },
    ],
  },
  Canada: {
    low: [
      { name: 'Langara College', course: 'Diploma Pathway', ieltsMin: 5.5, feesINRLakh: 11.0, intake: 'Jan, May & Sep' },
      { name: 'BCIT', course: 'Diploma in Technology', ieltsMin: 5.5, feesINRLakh: 10.5, intake: 'Jan & Sep' },
      { name: 'Centennial College', course: 'Graduate Certificate Pathway', ieltsMin: 5.5, feesINRLakh: 10.0, intake: 'Jan, May & Sep' },
      { name: 'Georgian College', course: 'Graduate Pathway Certificate', ieltsMin: 5.5, feesINRLakh: 9.5, intake: 'Jan & Sep' },
      { name: 'Conestoga College', course: 'Graduate Certificate Pathway', ieltsMin: 5.5, feesINRLakh: 9.0, intake: 'Jan, May & Sep' },
    ],
    mid: [
      { name: 'University of Saskatchewan', course: "MSc Computer Science", ieltsMin: 6.0, feesINRLakh: 18.0, intake: 'Jan & Sep' },
      { name: 'University of Windsor', course: 'MEng Computer Science', ieltsMin: 6.0, feesINRLakh: 16.5, intake: 'Jan, May & Sep' },
      { name: 'University of Manitoba', course: 'MSc Computer Science', ieltsMin: 6.0, feesINRLakh: 15.0, intake: 'Jan & Sep' },
      { name: 'University of New Brunswick', course: 'MCS Computer Science', ieltsMin: 6.0, feesINRLakh: 14.5, intake: 'Jan & Sep' },
      { name: 'Memorial University', course: 'MSc Business Administration', ieltsMin: 6.0, feesINRLakh: 13.0, intake: 'Jan & Sep' },
    ],
    high: [
      { name: 'University of Waterloo', course: 'MMath Computer Science', ieltsMin: 7.0, feesINRLakh: 29.0, intake: 'Jan & Sep' },
      { name: 'McGill University', course: 'MSc Computer Science', ieltsMin: 6.5, feesINRLakh: 26.0, intake: 'September' },
      { name: 'University of Ottawa', course: 'MSc Data Science & AI', ieltsMin: 6.5, feesINRLakh: 22.0, intake: 'Jan & Sep' },
      { name: 'Simon Fraser University', course: 'MSc Computing Science', ieltsMin: 6.5, feesINRLakh: 21.5, intake: 'Jan & Sep' },
      { name: "Queen's University", course: 'MSc Computing', ieltsMin: 6.5, feesINRLakh: 24.0, intake: 'September' },
    ],
  },
  Germany: {
    low: [
      { name: 'HS Augsburg', course: 'MBA International Management', ieltsMin: 5.5, feesINRLakh: 2.5, intake: 'October' },
      { name: 'TH Wildau', course: 'MBA International Management', ieltsMin: 5.5, feesINRLakh: 3.0, intake: 'October' },
      { name: 'University of Duisburg-Essen', course: 'MSc Computer Engineering', ieltsMin: 5.5, feesINRLakh: 1.5, intake: 'October' },
      { name: 'TU Kaiserslautern', course: 'MSc Electrical Engineering', ieltsMin: 5.5, feesINRLakh: 1.2, intake: 'October' },
      { name: 'HS für Technik Stuttgart', course: 'MEng Civil Engineering', ieltsMin: 5.5, feesINRLakh: 2.0, intake: 'October' },
    ],
    mid: [
      { name: 'University of Potsdam', course: 'MSc Data Science', ieltsMin: 6.0, feesINRLakh: 1.0, intake: 'October' },
      { name: 'University of Regensburg', course: 'MSc International Business', ieltsMin: 6.0, feesINRLakh: 1.5, intake: 'October' },
      { name: 'Jacobs University Bremen', course: 'MSc Data Engineering', ieltsMin: 6.0, feesINRLakh: 18.0, intake: 'September' },
      { name: 'Frankfurt School of Finance', course: 'MSc Finance', ieltsMin: 6.5, feesINRLakh: 22.0, intake: 'Sep & Jan' },
      { name: 'University of Mannheim', course: 'MSc Business Informatics', ieltsMin: 6.0, feesINRLakh: 1.0, intake: 'September' },
    ],
    high: [
      { name: 'Technical University of Munich (TUM)', course: 'MSc Data Engineering & Analytics', ieltsMin: 7.0, feesINRLakh: 1.5, intake: 'October' },
      { name: 'LMU Munich', course: 'MSc Data Science', ieltsMin: 7.0, feesINRLakh: 1.0, intake: 'October' },
      { name: 'RWTH Aachen', course: 'MSc Computer Science', ieltsMin: 6.5, feesINRLakh: 1.2, intake: 'October' },
      { name: 'University of Heidelberg', course: 'MSc Data Analysis', ieltsMin: 6.5, feesINRLakh: 1.5, intake: 'October' },
      { name: 'KIT Karlsruhe', course: 'MSc Informatics', ieltsMin: 6.5, feesINRLakh: 1.0, intake: 'October' },
    ],
  },
  USA: {
    low: [
      { name: 'ELS Language Centers (Pathway)', course: 'Graduate Pathway Program', ieltsMin: 5.0, feesINRLakh: 12.0, intake: 'Monthly' },
      { name: 'INTO University Partnerships', course: 'Graduate Pathway Program', ieltsMin: 5.5, feesINRLakh: 14.5, intake: 'Jan & Aug' },
      { name: 'Kaplan International Pathways', course: 'Graduate Entry Program', ieltsMin: 5.5, feesINRLakh: 12.5, intake: 'Monthly' },
      { name: 'Shorelight (University of Utah)', course: 'Grad Pathway Program', ieltsMin: 5.5, feesINRLakh: 13.0, intake: 'Jan & Aug' },
      { name: 'CEA CAPA (Pathway)', course: 'Pre-Graduate Program', ieltsMin: 5.5, feesINRLakh: 11.5, intake: 'Jan & Aug' },
    ],
    mid: [
      { name: 'Cleveland State University', course: 'MS Computer Science', ieltsMin: 6.0, feesINRLakh: 24.0, intake: 'Jan & Aug' },
      { name: 'University of Missouri', course: 'MS Data Science', ieltsMin: 6.0, feesINRLakh: 22.0, intake: 'Jan & Aug' },
      { name: 'University of Kansas', course: 'MS Computer Science', ieltsMin: 6.0, feesINRLakh: 22.5, intake: 'Jan & Aug' },
      { name: 'Wayne State University', course: 'MS Computer Science', ieltsMin: 6.0, feesINRLakh: 21.0, intake: 'Jan & Aug' },
      { name: 'University of Memphis', course: 'MS Computer Science', ieltsMin: 6.0, feesINRLakh: 19.5, intake: 'Jan & Aug' },
    ],
    high: [
      { name: 'University of Southern California (USC)', course: 'MS Computer Science', ieltsMin: 7.0, feesINRLakh: 55.0, intake: 'August' },
      { name: 'Northeastern University', course: 'MS Data Analytics', ieltsMin: 7.0, feesINRLakh: 45.0, intake: 'Jan & Sep' },
      { name: 'Boston University', course: 'MS AI & Machine Learning', ieltsMin: 6.5, feesINRLakh: 44.5, intake: 'Jan & Sep' },
      { name: 'Purdue University', course: 'MS Computer Science', ieltsMin: 6.5, feesINRLakh: 30.0, intake: 'Jan & Aug' },
      { name: 'University of Michigan', course: 'MS Data Science', ieltsMin: 7.0, feesINRLakh: 38.0, intake: 'August' },
    ],
  },
  Ireland: {
    low: [
      { name: 'Kaplan Dublin', course: 'International Foundation Year', ieltsMin: 5.0, feesINRLakh: 11.0, intake: 'September' },
      { name: 'DCU Alpha College', course: 'Pre-Masters Programme', ieltsMin: 5.5, feesINRLakh: 10.5, intake: 'Sep & Jan' },
      { name: 'Institute of Technology Carlow', course: 'Graduate Diploma Pathway', ieltsMin: 5.5, feesINRLakh: 9.5, intake: 'September' },
      { name: 'IBAT College Dublin', course: 'Graduate Certificate Pathway', ieltsMin: 5.5, feesINRLakh: 9.0, intake: 'Sep & Feb' },
      { name: 'DBS School of Arts', course: 'Diploma Pathway', ieltsMin: 5.0, feesINRLakh: 8.5, intake: 'Sep & Jan' },
    ],
    mid: [
      { name: 'Maynooth University', course: 'MSc Computer Science', ieltsMin: 6.0, feesINRLakh: 18.0, intake: 'September' },
      { name: 'Dublin City University', course: 'MSc Data Analytics', ieltsMin: 6.0, feesINRLakh: 19.5, intake: 'September' },
      { name: 'Ulster University', course: 'MSc AI & Machine Learning', ieltsMin: 6.0, feesINRLakh: 17.0, intake: 'Sep & Jan' },
      { name: 'TU Dublin', course: 'MSc Data Science', ieltsMin: 6.5, feesINRLakh: 18.5, intake: 'September' },
      { name: 'Mary Immaculate College', course: 'MSc Educational Technology', ieltsMin: 6.0, feesINRLakh: 15.0, intake: 'September' },
    ],
    high: [
      { name: 'Trinity College Dublin', course: 'MSc Computer Science', ieltsMin: 6.5, feesINRLakh: 24.0, intake: 'September' },
      { name: 'University College Dublin', course: 'MSc Data Analytics', ieltsMin: 6.5, feesINRLakh: 22.5, intake: 'September' },
      { name: 'University College Cork', course: 'MSc Intelligent Systems', ieltsMin: 6.5, feesINRLakh: 20.0, intake: 'September' },
      { name: 'NUI Galway', course: 'MSc Data Analytics', ieltsMin: 6.5, feesINRLakh: 19.5, intake: 'September' },
      { name: 'University of Limerick', course: 'MSc AI & Data Science', ieltsMin: 6.5, feesINRLakh: 18.0, intake: 'September' },
    ],
  },
  'New Zealand': {
    low: [
      { name: 'Lincoln University', course: 'Foundation Studies', ieltsMin: 5.0, feesINRLakh: 13.0, intake: 'Feb & Jul' },
      { name: 'Massey University', course: 'Diploma Pathway', ieltsMin: 5.5, feesINRLakh: 14.0, intake: 'Feb & Jul' },
      { name: 'Eastern Institute of Technology', course: 'Graduate Diploma Pathway', ieltsMin: 5.5, feesINRLakh: 11.0, intake: 'Feb & Jul' },
      { name: 'Whitireia Polytechnic', course: 'Diploma Pathway', ieltsMin: 5.0, feesINRLakh: 10.0, intake: 'Feb & Jul' },
      { name: 'Unitec Institute', course: 'Bridging Programme', ieltsMin: 5.0, feesINRLakh: 11.5, intake: 'Feb & Jul' },
    ],
    mid: [
      { name: 'Auckland University of Technology (AUT)', course: 'Master of Computer & Information Sciences', ieltsMin: 6.0, feesINRLakh: 20.0, intake: 'Feb & Jul' },
      { name: 'Victoria University of Wellington', course: 'MSc Data Science', ieltsMin: 6.0, feesINRLakh: 21.0, intake: 'Feb & Jul' },
      { name: 'University of Waikato', course: 'Master of Computer Science', ieltsMin: 6.0, feesINRLakh: 18.5, intake: 'Feb & Jul' },
      { name: 'Massey University', course: 'Master of Cybersecurity', ieltsMin: 6.0, feesINRLakh: 20.5, intake: 'Feb & Jul' },
      { name: 'Lincoln University', course: 'MBA International', ieltsMin: 6.5, feesINRLakh: 22.0, intake: 'Feb & Jul' },
    ],
    high: [
      { name: 'University of Auckland', course: 'Master of Information Technology', ieltsMin: 6.5, feesINRLakh: 27.0, intake: 'Feb & Jul' },
      { name: 'University of Otago', course: 'MSc Information Science', ieltsMin: 6.5, feesINRLakh: 24.0, intake: 'Feb & Jul' },
      { name: 'University of Canterbury', course: 'MSc Data Science', ieltsMin: 6.5, feesINRLakh: 23.0, intake: 'Feb & Jul' },
      { name: 'Victoria University of Wellington', course: 'MSc Data Analytics', ieltsMin: 6.5, feesINRLakh: 24.5, intake: 'Feb & Jul' },
      { name: 'AUT Auckland', course: 'Master of Applied Data Science', ieltsMin: 6.0, feesINRLakh: 22.5, intake: 'Feb & Jul' },
    ],
  },
  Singapore: {
    low: [
      { name: 'SIM Global Education', course: 'Foundation Programme', ieltsMin: 5.5, feesINRLakh: 14.0, intake: 'Multiple intakes' },
      { name: 'MDIS Singapore', course: 'Diploma Pathway', ieltsMin: 5.5, feesINRLakh: 13.5, intake: 'Jan, Mar, Jul & Sep' },
      { name: 'PSB Academy', course: 'Graduate Diploma Pathway', ieltsMin: 5.5, feesINRLakh: 12.5, intake: 'Quarterly' },
      { name: 'Kaplan Singapore', course: 'Graduate Diploma Pathway', ieltsMin: 5.5, feesINRLakh: 11.0, intake: 'Quarterly' },
      { name: 'Dimensions International College', course: 'Bridging Programme', ieltsMin: 5.0, feesINRLakh: 10.0, intake: 'Quarterly' },
    ],
    mid: [
      { name: 'SIM Global Education (RMIT)', course: 'MBA', ieltsMin: 6.0, feesINRLakh: 22.0, intake: 'Jan, May & Sep' },
      { name: 'MDIS Singapore', course: 'MSc Computer Science', ieltsMin: 6.0, feesINRLakh: 20.0, intake: 'Quarterly' },
      { name: 'Kaplan Higher Education', course: 'MSc Business Analytics', ieltsMin: 6.0, feesINRLakh: 24.0, intake: 'Jan & Jul' },
      { name: 'PSB Academy', course: 'MSc Data Science', ieltsMin: 6.0, feesINRLakh: 21.0, intake: 'Quarterly' },
      { name: 'James Cook University Singapore', course: 'Master of Business Administration', ieltsMin: 6.5, feesINRLakh: 30.0, intake: 'Mar, Jul & Nov' },
    ],
    high: [
      { name: 'National University of Singapore (NUS)', course: 'MSc Computer Science', ieltsMin: 6.5, feesINRLakh: 42.0, intake: 'August' },
      { name: 'Nanyang Technological University (NTU)', course: 'MSc Data Science & AI', ieltsMin: 6.5, feesINRLakh: 40.0, intake: 'August' },
      { name: 'Singapore Management University (SMU)', course: 'MSc Data Science', ieltsMin: 6.5, feesINRLakh: 38.0, intake: 'August' },
      { name: 'SUTD', course: 'MSc Security by Design', ieltsMin: 6.5, feesINRLakh: 35.0, intake: 'August' },
      { name: 'James Cook University Singapore', course: 'Master of IT', ieltsMin: 6.5, feesINRLakh: 28.0, intake: 'Mar & Jul' },
    ],
  },
};

function getBand(score: number): Band {
  if (score < 6.0) return 'low';
  if (score <= 6.5) return 'mid';
  return 'high';
}

function getUnis(country: string, band: Band, limit: number): UniRec[] {
  return (UNIS[country]?.[band] ?? UNIS['UK'][band]).slice(0, limit);
}

// ── Email HTML helpers ────────────────────────────────────────────────────────

const BRAND_BLUE = '#1e3a8a';
const BRAND_MID  = '#1e40af';
const GOLD       = '#d97706';
const WA_LINK    = 'https://wa.me/919971226347';

function wrap(body: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Jaivik Overseas</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f5f9;">
<tr><td align="center" style="padding:32px 16px;">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.10);">
${body}
<tr><td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
<p style="color:#94a3b8;font-size:11px;line-height:1.6;margin:0;">You are receiving this email because you enquired with Jaivik Overseas Consultants.<br>To unsubscribe, reply with "unsubscribe".</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function header(title: string, sub: string): string {
  return `<tr><td style="background:linear-gradient(135deg,${BRAND_BLUE} 0%,${BRAND_MID} 100%);padding:36px 40px;text-align:center;">
<p style="color:${GOLD};font-size:12px;font-weight:700;margin:0 0 10px;letter-spacing:1.5px;text-transform:uppercase;">Jaivik Overseas Consultants</p>
<h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 8px;line-height:1.4;">${title}</h1>
<p style="color:#93c5fd;font-size:14px;margin:0;">${sub}</p>
</td></tr>`;
}

function uniCard(u: UniRec): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;">
<tr><td style="padding:16px 18px;">
<p style="color:${BRAND_MID};font-weight:700;font-size:14px;margin:0 0 3px;">${u.name}</p>
<p style="color:#64748b;font-size:13px;margin:0 0 10px;">${u.course}</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td width="33%" style="text-align:left;"><p style="color:#94a3b8;font-size:10px;margin:0;text-transform:uppercase;letter-spacing:.5px;">Annual Fee</p><p style="color:#1e293b;font-weight:700;font-size:14px;margin:3px 0 0;">&#8377;${u.feesINRLakh}L</p></td>
<td width="33%" style="text-align:left;"><p style="color:#94a3b8;font-size:10px;margin:0;text-transform:uppercase;letter-spacing:.5px;">IELTS Min</p><p style="color:#1e293b;font-weight:700;font-size:14px;margin:3px 0 0;">${u.ieltsMin}+</p></td>
<td width="33%" style="text-align:left;"><p style="color:#94a3b8;font-size:10px;margin:0;text-transform:uppercase;letter-spacing:.5px;">Intake</p><p style="color:#1e293b;font-weight:700;font-size:14px;margin:3px 0 0;">${u.intake}</p></td>
</tr></table>
</td></tr></table>`;
}

function waCta(ctaText: string): string {
  return `<tr><td>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;background:#f0fdf4;border-radius:12px;border:1px solid #bbf7d0;">
<tr><td style="padding:24px;text-align:center;">
<p style="color:#166534;font-weight:700;font-size:15px;margin:0 0 6px;">${ctaText}</p>
<p style="color:#15803d;font-size:13px;margin:0 0 18px;">Book a free 30-min call — Mr. Gaurav Katyal will personally guide you.</p>
<a href="${WA_LINK}" style="background:#16a34a;color:#ffffff;text-decoration:none;padding:13px 30px;border-radius:8px;font-weight:700;font-size:14px;display:inline-block;">WhatsApp +91-9971226347 &#8250;</a>
</td></tr>
</table>
</td></tr>`;
}

function signature(): string {
  return `<tr><td style="padding:28px 40px 0;border-top:1px solid #f1f5f9;margin-top:28px;">
<p style="color:#64748b;font-size:14px;margin:0 0 4px;">Warm regards,</p>
<p style="color:${BRAND_MID};font-weight:700;font-size:15px;margin:0 0 2px;">Gaurav Katyal</p>
<p style="color:#64748b;font-size:13px;margin:0;">Senior Education Consultant &mdash; Jaivik Overseas Consultants</p>
<p style="color:#94a3b8;font-size:12px;margin:8px 0 0;">+91-9971226347 &nbsp;|&nbsp; jaivikoverseasconsultants.com &nbsp;|&nbsp; 13 years &bull; 99% visa success</p>
</td></tr>`;
}

// ── Email 1 — Immediate ────────────────────────────────────────────────────────

function buildEmail1(lead: LeadData, unis: UniRec[], band: Band, score: string): { subject: string; html: string } {
  const subject = `${lead.name}, your IELTS ${score} — here's what it means for ${lead.country}`;

  const scoreMessages: Record<Band, string> = {
    low: `Your IELTS ${score} qualifies you for foundation and pathway programmes in ${lead.country}. These are the fastest route to a full Masters — most take just 6&ndash;9 months before you step into your main programme. Here are 4 universities that accept this score and have strong Indian student communities:`,
    mid: `Good score! An IELTS ${score} opens doors to a wide range of Masters programmes in ${lead.country}. Many universities actively recruit at this level, and you'll find strong scholarship options too. Here are 4 universities perfectly matched to your profile:`,
    high: `Excellent score! IELTS ${score} puts you in the top tier &mdash; you qualify for rankings-listed universities across ${lead.country}. At this level, your choice narrows to best-fit, best-value, and career outcomes. Here are your strongest options:`,
  };

  const body = `
${header(`Your IELTS ${score} — What It Opens for You in ${lead.country}`, 'Personalised analysis by Gaurav Katyal')}
<tr><td style="padding:32px 40px 0;">
<p style="color:#1e293b;font-size:16px;margin:0 0 16px;font-weight:600;">Hi ${lead.name},</p>
<p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 24px;">${scoreMessages[band]}</p>
${unis.map(u => uniCard(u)).join('')}
<p style="color:#475569;font-size:14px;line-height:1.7;margin:16px 0 0;">Over the next few days I'll share real examples of Indian students who got admitted with similar scores, and a personalised shortlist tailored to your background.</p>
</td></tr>
${waCta('Ready to explore your options?')}
${signature()}
<tr><td style="padding:12px 40px 32px;"></td></tr>`;

  return { subject, html: wrap(body) };
}

// ── Email 2 — Day 3 ───────────────────────────────────────────────────────────

function buildEmail2(lead: LeadData, unis: UniRec[], score: string): { subject: string; html: string } {
  const subject = `${lead.name}, students with IELTS ${score} got into these universities`;

  const body = `
${header(`Students with IELTS ${score} Got Into These Universities`, `Real admissions from ${lead.country} — 2024&ndash;2025`)}
<tr><td style="padding:32px 40px 0;">
<p style="color:#1e293b;font-size:16px;margin:0 0 16px;font-weight:600;">Hi ${lead.name},</p>
<p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 8px;">You asked about studying ${lead.course || 'abroad'} in ${lead.country}. Here are 5 universities where Indian students with IELTS ${score} secured admission in the last two intake cycles:</p>
<p style="color:#94a3b8;font-size:13px;margin:0 0 20px;font-style:italic;">Fees shown are annual tuition in Indian Rupees. Living costs vary by city.</p>
${unis.map((u, i) => `
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;background:${i === 0 ? '#eff6ff' : '#f8fafc'};border-radius:10px;border:1px solid ${i === 0 ? '#bfdbfe' : '#e2e8f0'};">
<tr><td style="padding:16px 18px;">
${i === 0 ? `<p style="background:${GOLD};color:#fff;font-size:10px;font-weight:700;display:inline-block;padding:3px 10px;border-radius:20px;margin:0 0 8px;letter-spacing:.5px;">POPULAR CHOICE</p>` : ''}
<p style="color:${BRAND_MID};font-weight:700;font-size:14px;margin:0 0 3px;">${u.name}</p>
<p style="color:#64748b;font-size:13px;margin:0 0 10px;">${u.course}</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td width="25%" style="text-align:left;"><p style="color:#94a3b8;font-size:10px;margin:0;text-transform:uppercase;">Annual Fee</p><p style="color:#1e293b;font-weight:700;font-size:14px;margin:3px 0 0;">&#8377;${u.feesINRLakh}L</p></td>
<td width="25%" style="text-align:left;"><p style="color:#94a3b8;font-size:10px;margin:0;text-transform:uppercase;">IELTS</p><p style="color:#1e293b;font-weight:700;font-size:14px;margin:3px 0 0;">${u.ieltsMin}+</p></td>
<td width="50%" style="text-align:left;"><p style="color:#94a3b8;font-size:10px;margin:0;text-transform:uppercase;">Next Intake</p><p style="color:#1e293b;font-weight:700;font-size:14px;margin:3px 0 0;">${u.intake}</p></td>
</tr></table>
</td></tr></table>`).join('')}
<p style="color:#475569;font-size:14px;line-height:1.7;margin:20px 0 0;">Application deadlines for the next intake are approaching. Most of these universities send offers within 2&ndash;4 weeks of receiving a complete application.</p>
</td></tr>
${waCta('Want to apply to any of these?')}
${signature()}
<tr><td style="padding:12px 40px 32px;"></td></tr>`;

  return { subject, html: wrap(body) };
}

// ── Email 3 — Day 7 ───────────────────────────────────────────────────────────

function buildEmail3(lead: LeadData, unis: UniRec[]): { subject: string; html: string } {
  const subject = `Your personalised shortlist is ready, ${lead.name}`;

  const body = `
${header('Your Personalised University Shortlist', `Curated for ${lead.name} by Gaurav Katyal`)}
<tr><td style="padding:32px 40px 0;">
<p style="color:#1e293b;font-size:16px;margin:0 0 16px;font-weight:600;">Hi ${lead.name},</p>
<p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 24px;">Based on your IELTS score and interest in ${lead.course || 'higher education'} in ${lead.country}, I've put together a shortlist of my top 3 recommendations. These are the universities I would choose if I were in your position today:</p>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;background:#eff6ff;border-radius:12px;border:2px solid ${BRAND_MID};overflow:hidden;">
<tr><td style="background:${BRAND_MID};padding:10px 18px;">
<p style="color:#fff;font-weight:700;font-size:13px;margin:0;">&#127942; MY TOP PICK FOR YOU</p>
</td></tr>
<tr><td style="padding:18px;">
<p style="color:${BRAND_MID};font-weight:700;font-size:16px;margin:0 0 4px;">${unis[0]?.name ?? ''}</p>
<p style="color:#64748b;font-size:14px;margin:0 0 12px;">${unis[0]?.course ?? ''}</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td width="33%"><p style="color:#94a3b8;font-size:10px;margin:0;">Annual Fee</p><p style="color:#1e293b;font-weight:700;font-size:15px;margin:3px 0 0;">&#8377;${unis[0]?.feesINRLakh ?? 0}L</p></td>
<td width="33%"><p style="color:#94a3b8;font-size:10px;margin:0;">IELTS Min</p><p style="color:#1e293b;font-weight:700;font-size:15px;margin:3px 0 0;">${unis[0]?.ieltsMin ?? 0}+</p></td>
<td width="33%"><p style="color:#94a3b8;font-size:10px;margin:0;">Intake</p><p style="color:#1e293b;font-weight:700;font-size:15px;margin:3px 0 0;">${unis[0]?.intake ?? ''}</p></td>
</tr></table>
</td></tr>
</table>

${unis.slice(1).map(u => uniCard(u)).join('')}

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;background:#fefce8;border-radius:12px;border:1px solid #fde68a;">
<tr><td style="padding:20px 24px;">
<p style="color:#92400e;font-weight:700;font-size:14px;margin:0 0 6px;">Why schedule a call with me?</p>
<p style="color:#78350f;font-size:13px;line-height:1.7;margin:0;">I'll review your full academic profile, suggest which universities to target first, help you write a strong SOP, and guide you on the visa process &mdash; all for free. I've helped 1,400+ Indian students get abroad in the last 13+ years.</p>
</td></tr>
</table>
</td></tr>
${waCta('Book your free 30-min call with Mr. Gaurav Katyal')}
${signature()}
<tr><td style="padding:12px 40px 32px;"></td></tr>`;

  return { subject, html: wrap(body) };
}

// ── Brevo API caller ──────────────────────────────────────────────────────────

async function sendBrevoEmail(
  to: { email: string; name: string },
  subject: string,
  html: string,
  scheduledAt?: string,
): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('[Brevo] BREVO_API_KEY env var is not set — email not sent');
    return;
  }

  const payload: Record<string, unknown> = {
    sender: { name: 'Gaurav Katyal | Jaivik Overseas', email: 'info@jaivikoverseasconsultants.com' },
    to: [to],
    subject,
    htmlContent: html,
  };
  if (scheduledAt) payload.scheduledAt = scheduledAt;

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error(`[Brevo] Send failed (${res.status}):`, err);
    }
  } catch (err) {
    console.error('[Brevo] Network error:', err);
  }
}

// ── Public entry point ────────────────────────────────────────────────────────

export async function triggerEmailSequence(lead: LeadData): Promise<void> {
  const rawScore = parseFloat(lead.ieltsScore);
  const hasScore = !isNaN(rawScore);
  const band: Band = hasScore ? getBand(rawScore) : 'mid';
  const displayScore = hasScore ? String(rawScore) : 'your score';

  const unis5 = getUnis(lead.country, band, 5);

  const { subject: sub1, html: html1 } = buildEmail1(lead, unis5.slice(0, 4), band, displayScore);
  const { subject: sub2, html: html2 } = buildEmail2(lead, unis5, displayScore);
  const { subject: sub3, html: html3 } = buildEmail3(lead, unis5.slice(0, 3));

  const to = { email: lead.email, name: lead.name };
  const now = Date.now();
  const day3 = new Date(now + 3 * 24 * 60 * 60 * 1000).toISOString();
  const day7 = new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString();

  await Promise.allSettled([
    sendBrevoEmail(to, sub1, html1),
    sendBrevoEmail(to, sub2, html2, day3),
    sendBrevoEmail(to, sub3, html3, day7),
  ]);
}
