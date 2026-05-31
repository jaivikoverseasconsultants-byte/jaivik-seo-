export interface ContentBlock {
  type: 'h2' | 'h3' | 'p' | 'ul' | 'ol' | 'table' | 'callout' | 'tip';
  content?: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
}

export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  excerpt: string;
  tags: string[];
  relatedLinks: { href: string; label: string }[];
  content: ContentBlock[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'study-in-canada-guide-indian-students-2026',
    title: 'Study in Canada 2026: Complete Guide for Indian Students',
    metaTitle: 'Study in Canada 2026 – Fees, Visa, PR & Top Universities for Indian Students',
    metaDescription: 'Complete guide to studying in Canada from India in 2026. Learn about top universities, tuition fees (₹20–50L/yr), IELTS requirements, study permit process, and PR pathways.',
    category: 'Country Guides',
    publishedAt: '2026-01-15',
    updatedAt: '2026-05-01',
    readTime: 8,
    excerpt: 'Canada remains the #1 destination for Indian students in 2026. Here is everything you need to know — fees, universities, visa, and the PR pathway.',
    tags: ['Canada', 'Study Abroad', 'Student Visa', 'PR', 'Indian Students'],
    relatedLinks: [
      { href: '/universities/country/canada', label: 'Browse Canada Universities' },
      { href: '/course-finder', label: 'Find Courses in Canada' },
      { href: '/mock-test', label: 'Free IELTS Mock Test' },
    ],
    content: [
      {
        type: 'p',
        content: 'Canada consistently ranks as the top study destination for Indian students — over 230,000 Indian students enrolled in Canadian institutions in 2025. With world-class universities, a clear PR pathway, and a welcoming immigration policy, Canada offers an unmatched package for ambitious students from India.',
      },
      {
        type: 'h2',
        content: 'Why Indian Students Choose Canada in 2026',
      },
      {
        type: 'ul',
        items: [
          'Post-Graduate Work Permit (PGWP) for up to 3 years after graduation',
          'Express Entry PR pathway — possible within 2–3 years of graduating',
          'Strong Indian community in Toronto, Vancouver, Calgary, and Brampton',
          'Co-op and internship programs built into most degrees',
          'Lower tuition than the USA with similar academic quality',
          'Multicultural environment — no culture shock for Indian students',
        ],
      },
      {
        type: 'h2',
        content: 'Tuition Fees at Top Canadian Universities (2026)',
      },
      {
        type: 'table',
        headers: ['University', 'QS Rank', 'Annual Tuition (CAD)', 'Annual Tuition (INR)'],
        rows: [
          ['University of Toronto', '#25', 'CAD 55,000', '₹33.5L'],
          ['University of British Columbia', '#38', 'CAD 46,000', '₹28L'],
          ['McGill University', '#44', 'CAD 41,000', '₹25L'],
          ['University of Waterloo', '#154', 'CAD 38,000', '₹23L'],
          ['University of Alberta', '#111', 'CAD 28,000', '₹17L'],
          ['Dalhousie University', '#501–550', 'CAD 22,000', '₹13.4L'],
        ],
      },
      {
        type: 'callout',
        content: '💡 Total cost of studying in Canada (tuition + living) typically ranges from ₹25L to ₹55L per year depending on the city and university. Toronto and Vancouver are the most expensive; smaller cities like Halifax or Saskatoon are 30–40% cheaper.',
      },
      {
        type: 'h2',
        content: 'IELTS Requirements for Canadian Universities',
      },
      {
        type: 'p',
        content: 'Most Canadian universities require IELTS Academic with an overall band of 6.5 to 7.0 for Master\'s programs, and 6.0 to 6.5 for Bachelor\'s programs. Top universities like U of T, UBC, and McGill typically require 6.5–7.0 with no band below 6.0.',
      },
      {
        type: 'table',
        headers: ['Program Level', 'Typical IELTS Requirement'],
        rows: [
          ['Bachelor\'s degree', '6.0–6.5 overall, no band below 5.5'],
          ['Master\'s degree', '6.5–7.0 overall, no band below 6.0'],
          ['MBA / Business', '6.5–7.0 overall'],
          ['PhD', '7.0 overall'],
        ],
      },
      {
        type: 'h2',
        content: 'Canada Study Permit Process for Indian Students',
      },
      {
        type: 'ol',
        items: [
          'Receive Letter of Acceptance (LOA) from a Designated Learning Institution (DLI)',
          'Pay first-year tuition and get receipt',
          'Gather documents: passport, photos, SOP, financial proof (₹15–20L minimum), IELTS score',
          'Apply online on IRCC portal — current processing time 4–8 weeks',
          'Biometrics appointment at VAC in India',
          'Get Port of Entry (PoE) letter and travel to Canada',
          'Collect study permit at airport on arrival',
        ],
      },
      {
        type: 'h2',
        content: 'PR Pathway After Studying in Canada',
      },
      {
        type: 'p',
        content: 'Canada\'s Post-Graduation Work Permit (PGWP) allows you to work for up to 3 years (same as your study duration) after graduating. This work experience makes you eligible for Express Entry (Canadian Experience Class) or Provincial Nominee Programs (PNP). Most Indian students achieve PR within 2–3 years of graduating.',
      },
      {
        type: 'tip',
        content: '🎯 Pro Tip: Study in provinces with active PNP streams for international graduates — Ontario, British Columbia, and Saskatchewan all have strong programs. A 2-year Master\'s degree gives you a 3-year PGWP, maximising your PR chances.',
      },
      {
        type: 'h2',
        content: 'Top Programs for Indian Students in Canada',
      },
      {
        type: 'ul',
        items: [
          'MS / MEng in Computer Science, Software Engineering, Data Science',
          'MBA and MS in Finance / Business Analytics',
          'MEng in Electrical, Mechanical, Civil Engineering',
          'MS in Artificial Intelligence and Machine Learning',
          'MPH / MSc in Public Health',
          'MASc in Environmental Engineering',
        ],
      },
    ],
  },

  {
    slug: 'ielts-score-requirements-top-universities-2026',
    title: 'IELTS Score Requirements for Top Universities 2026',
    metaTitle: 'IELTS Score Requirements for Top 100 Universities 2026 – Complete List',
    metaDescription: 'Check IELTS requirements for Harvard, Oxford, University of Toronto, NUS, and 100+ top universities. Updated for 2026 intakes with minimum band scores by program level.',
    category: 'IELTS & Tests',
    publishedAt: '2026-01-20',
    updatedAt: '2026-05-10',
    readTime: 6,
    excerpt: 'IELTS score requirements vary by university and program. Here are the exact minimums for top universities in USA, UK, Canada, Australia, Germany and Singapore.',
    tags: ['IELTS', 'University Requirements', 'English Test', 'Study Abroad'],
    relatedLinks: [
      { href: '/mock-test', label: 'Take Free IELTS Mock Test' },
      { href: '/course-finder', label: 'Find Courses by IELTS Score' },
      { href: '/universities', label: 'Browse All Universities' },
    ],
    content: [
      {
        type: 'p',
        content: 'IELTS Academic is the most widely accepted English proficiency test for university admissions worldwide. Understanding the exact IELTS requirements before applying can save months of preparation time and prevent rejections.',
      },
      {
        type: 'h2',
        content: 'IELTS Requirements at Top US Universities',
      },
      {
        type: 'table',
        headers: ['University', 'UG Minimum', 'PG Minimum', 'Notes'],
        rows: [
          ['MIT', '7.0', '7.0', 'No band below 6.5'],
          ['Harvard University', '7.0', '7.5', 'Writing 7.0+'],
          ['Stanford University', '7.0', '7.0', 'Waivable with strong profile'],
          ['University of Chicago', '7.0', '7.0', '—'],
          ['University of Michigan', '6.5', '7.0', 'ESL support below 7.0'],
          ['Purdue University', '6.5', '6.5', 'Departments vary'],
          ['Arizona State University', '6.5', '6.5', 'Conditional admit at 6.0'],
        ],
      },
      {
        type: 'h2',
        content: 'IELTS Requirements at UK Universities',
      },
      {
        type: 'table',
        headers: ['University', 'UG Minimum', 'PG Minimum', 'Notes'],
        rows: [
          ['University of Oxford', '7.0', '7.5', 'No band below 7.0 for PG'],
          ['University of Cambridge', '7.5', '7.5', 'Some courses require 8.0'],
          ['Imperial College London', '6.5', '6.5–7.0', 'Engineering 6.5'],
          ['UCL', '6.5', '7.0', 'Medicine/Law 7.0+'],
          ['University of Edinburgh', '6.5', '6.5', 'Business 6.5'],
          ['University of Manchester', '6.5', '6.5', 'No band below 5.5'],
          ['King\'s College London', '6.5', '7.0', 'Health Sciences 7.0'],
        ],
      },
      {
        type: 'h2',
        content: 'IELTS Requirements at Canadian Universities',
      },
      {
        type: 'table',
        headers: ['University', 'UG Minimum', 'PG Minimum'],
        rows: [
          ['University of Toronto', '6.5', '7.0'],
          ['UBC', '6.5', '6.5'],
          ['McGill University', '6.5', '6.5'],
          ['University of Waterloo', '6.5', '7.0'],
          ['University of Alberta', '6.5', '6.5'],
          ['McMaster University', '6.5', '6.5'],
        ],
      },
      {
        type: 'h2',
        content: 'IELTS Requirements at Australian Universities',
      },
      {
        type: 'table',
        headers: ['University', 'UG Minimum', 'PG Minimum', 'Notes'],
        rows: [
          ['University of Melbourne', '6.5', '7.0', 'No band below 6.0'],
          ['Australian National University', '6.5', '7.0', 'Engineering 6.5'],
          ['University of Sydney', '6.5', '7.0', 'Medicine 7.5'],
          ['UNSW Sydney', '6.5', '6.5', 'Business 7.0'],
          ['Monash University', '6.0', '6.5', 'Some courses 7.0'],
        ],
      },
      {
        type: 'callout',
        content: '📝 Note: Many universities now accept Duolingo English Test (DET) or TOEFL iBT in addition to IELTS. Some universities waive the requirement for students who completed their Bachelor\'s through English medium.',
      },
      {
        type: 'h2',
        content: 'What if Your IELTS Score is Below Requirements?',
      },
      {
        type: 'ul',
        items: [
          'Apply for a conditional offer — many universities offer pre-sessional English courses',
          'Retake IELTS — aim to improve by 0.5 band in 6–8 weeks of focused preparation',
          'Apply to universities with lower requirements first; transfer later',
          'Consider TOEFL iBT (some find it easier than IELTS Academic)',
          'Book a free counselling session with Jaivik Overseas for personalised options',
        ],
      },
      {
        type: 'tip',
        content: '🎯 Quick tip: Take the free Jaivik Overseas IELTS Mock Test to benchmark your current level before deciding whether to apply or prepare more.',
      },
    ],
  },

  {
    slug: 'study-in-germany-free-for-indian-students-2026',
    title: 'Study in Germany Free: Complete Guide for Indian Students 2026',
    metaTitle: 'Study in Germany for Free 2026 – Public Universities, Costs & Visa for Indians',
    metaDescription: 'Public universities in Germany charge nearly zero tuition — even for international students. Learn how Indian students can study in Germany for free, semester fees, living costs, and visa process.',
    category: 'Country Guides',
    publishedAt: '2026-02-01',
    updatedAt: '2026-05-05',
    readTime: 7,
    excerpt: 'Germany\'s public universities charge virtually zero tuition — even for international students. Here\'s exactly how Indian students can study in Germany almost free.',
    tags: ['Germany', 'Free Education', 'Public Universities', 'Indian Students', 'Europe'],
    relatedLinks: [
      { href: '/universities/country/germany', label: 'Germany Universities' },
      { href: '/course-finder', label: 'Find Courses in Germany' },
      { href: '/book-counselling', label: 'Book Free Counselling' },
    ],
    content: [
      {
        type: 'p',
        content: 'Germany is the only country in the world where top-ranked public universities charge almost zero tuition fees — for both EU and international students including Indians. Most state universities charge only a semester administrative fee of €150–350 (₹14,000–32,000), making Germany the most affordable quality study destination in the world.',
      },
      {
        type: 'h2',
        content: 'How Much Does It Cost to Study in Germany?',
      },
      {
        type: 'table',
        headers: ['Expense', 'Amount per Year'],
        rows: [
          ['Tuition Fee (most public universities)', '€0 (FREE)'],
          ['Semester administrative fee', '€300–700/yr (₹28K–65K)'],
          ['Accommodation (university hostel)', '€250–400/month'],
          ['Food & groceries', '€150–250/month'],
          ['Health insurance (mandatory)', '€110/month'],
          ['Transport, phone, misc.', '€100–150/month'],
          ['Total living cost estimate', '€8,000–12,000/yr (₹7.5L–11L)'],
        ],
      },
      {
        type: 'callout',
        content: '💡 Total cost for an Indian student in Germany = ₹7.5L–11L per year (living costs only). Compare this to ₹25L–50L/yr in Canada or UK. Over a 2-year Master\'s, you save ₹30–70 lakh.',
      },
      {
        type: 'h2',
        content: 'Top German Public Universities for Indian Students',
      },
      {
        type: 'table',
        headers: ['University', 'QS Rank', 'Location', 'Known For'],
        rows: [
          ['TU Munich', '#37', 'Munich', 'Engineering, CS, Sciences'],
          ['LMU Munich', '#60', 'Munich', 'Medicine, Sciences, Arts'],
          ['Heidelberg University', '#87', 'Heidelberg', 'Medicine, Life Sciences'],
          ['KIT (Karlsruhe)', '#116', 'Karlsruhe', 'Engineering, CS'],
          ['Humboldt University Berlin', '#120', 'Berlin', 'Humanities, Sciences'],
          ['RWTH Aachen', '#106', 'Aachen', 'Engineering, Technology'],
          ['Free University Berlin', '#130', 'Berlin', 'Social Sciences, Arts'],
        ],
      },
      {
        type: 'h2',
        content: 'English-Taught Programs in Germany',
      },
      {
        type: 'p',
        content: 'Over 1,500 Master\'s programs in Germany are taught entirely in English. Popular choices for Indian students include Computer Science (TU Munich, KIT), Data Science, Automotive Engineering, Business Informatics, and Renewable Energy. Bachelor\'s programs are mostly in German — a B2 language certificate is required.',
      },
      {
        type: 'h2',
        content: 'German Student Visa Requirements for Indians',
      },
      {
        type: 'ol',
        items: [
          'Admission letter from a German university',
          'Blocked account with €11,208 (for 2026) — proof of funds for 12 months',
          'Valid passport, visa application form',
          'Health insurance coverage',
          'German language certificate (for German-medium programs) OR IELTS 6.5+ for English programs',
          'Academic transcripts, degree certificates',
          'APS certificate (Akademische Prüfstelle) — mandatory for Indian students since 2022',
        ],
      },
      {
        type: 'callout',
        content: '⚠️ APS Certificate: Indian students must get their documents verified by the German Academic Exchange Service (APS) India before applying for a student visa. The process takes 4–8 weeks and costs ₹18,000.',
      },
      {
        type: 'h2',
        content: 'Job Prospects After Studying in Germany',
      },
      {
        type: 'ul',
        items: [
          '18-month job seeker visa after graduation to find work in Germany',
          'Germany\'s Skilled Worker Immigration Act makes it easier to convert to work visa',
          'EU Blue Card available for skilled workers earning €45,300+ per year',
          'STEM graduates from TU Munich, RWTH Aachen are highly sought after in Germany, Netherlands, Switzerland',
          'Starting salaries: €45,000–65,000/yr for engineering and CS graduates',
        ],
      },
    ],
  },

  {
    slug: 'uk-vs-canada-vs-australia-for-indian-students-2026',
    title: 'UK vs Canada vs Australia for Indian Students 2026: Full Comparison',
    metaTitle: 'UK vs Canada vs Australia 2026 – Which is Best for Indian Students?',
    metaDescription: 'UK vs Canada vs Australia for Indian students: fees, PR chances, part-time work, IELTS, job market and quality of life. Comprehensive 2026 comparison to help you decide.',
    category: 'Country Comparison',
    publishedAt: '2026-02-10',
    updatedAt: '2026-05-12',
    readTime: 9,
    excerpt: 'UK, Canada, and Australia are the top 3 destinations for Indian students. Here\'s a side-by-side comparison on fees, PR, jobs, and quality of life.',
    tags: ['UK', 'Canada', 'Australia', 'Comparison', 'Indian Students', 'Study Abroad'],
    relatedLinks: [
      { href: '/universities/country/uk', label: 'UK Universities' },
      { href: '/universities/country/canada', label: 'Canada Universities' },
      { href: '/universities/country/australia', label: 'Australia Universities' },
      { href: '/course-finder', label: 'Course Finder' },
    ],
    content: [
      {
        type: 'p',
        content: 'UK, Canada, and Australia collectively host over 600,000 Indian students. Each offers a distinct set of advantages — and trade-offs. This guide cuts through the noise to give you a clear comparison across every factor that matters.',
      },
      {
        type: 'h2',
        content: 'Quick Comparison: UK vs Canada vs Australia 2026',
      },
      {
        type: 'table',
        headers: ['Factor', 'UK', 'Canada', 'Australia'],
        rows: [
          ['Study Duration (Master\'s)', '1 year', '2 years', '1.5–2 years'],
          ['Avg. Annual Tuition', '£18,000 (₹19L)', 'CAD 35,000 (₹21L)', 'AUD 38,000 (₹22L)'],
          ['IELTS Requirement', '6.5 minimum', '6.5 minimum', '6.5 minimum'],
          ['Part-Time Work Allowed', '20 hrs/week', '20 hrs/week (full-time on breaks)', '48 hrs/fortnight'],
          ['Post-Study Work Visa', 'Graduate Visa: 2–3 yrs', 'PGWP: up to 3 yrs', 'PSW: 2–4 yrs'],
          ['PR Pathway', 'Skilled Worker Visa', 'Express Entry / PNP', 'Skilled Migration (189/190)'],
          ['Average Salary After Graduation', '£32,000/yr', 'CAD 58,000/yr', 'AUD 70,000/yr'],
          ['Cost of Living', 'High (London)', 'Medium–High', 'Medium–High'],
          ['Indian Community Size', 'Large', 'Very Large', 'Large'],
        ],
      },
      {
        type: 'h2',
        content: 'Study Duration and Cost Comparison',
      },
      {
        type: 'p',
        content: 'The UK\'s biggest advantage is the 1-year Master\'s — you save an entire year of living costs and lost income. A UK Master\'s typically costs ₹35–45L total (tuition + living), while Canada or Australia costs ₹50–75L for a 2-year program. If time-to-graduation and total cost matter most, the UK wins on price-per-year.',
      },
      {
        type: 'h2',
        content: 'PR and Immigration Comparison',
      },
      {
        type: 'ul',
        items: [
          '🇨🇦 Canada: Best PR pathway — Express Entry CRS score gets a boost from Canadian work experience. Most Master\'s graduates with PGWP get PR in 2–3 years. PNP streams for healthcare, tech, and trades are even faster.',
          '🇦🇺 Australia: SkillSelect points-based PR is predictable. STEM, engineering and healthcare graduates qualify easily. State nomination (Subclass 190) adds 5 extra points and speeds things up.',
          '🇬🇧 UK: Graduate Route visa (2 years) then Skilled Worker visa. PR after 5 years total. No points system — you need a job offer from a licensed sponsor. More difficult than Canada/Australia.',
        ],
      },
      {
        type: 'h2',
        content: 'Job Market and Salaries',
      },
      {
        type: 'table',
        headers: ['Field', 'UK (£/yr)', 'Canada (CAD/yr)', 'Australia (AUD/yr)'],
        rows: [
          ['Software Engineer', '£45,000–65,000', 'CAD 75,000–100,000', 'AUD 95,000–130,000'],
          ['Data Scientist', '£50,000–75,000', 'CAD 80,000–110,000', 'AUD 110,000–140,000'],
          ['Civil / Structural Engineer', '£35,000–55,000', 'CAD 65,000–85,000', 'AUD 85,000–115,000'],
          ['Registered Nurse', '£30,000–40,000', 'CAD 70,000–90,000', 'AUD 70,000–90,000'],
          ['MBA Graduate (Finance)', '£55,000–80,000', 'CAD 80,000–115,000', 'AUD 90,000–130,000'],
        ],
      },
      {
        type: 'h2',
        content: 'Which Country Should You Choose?',
      },
      {
        type: 'ul',
        items: [
          'Choose UK if: You want to complete your Master\'s quickly and cheaply, or you already have a job offer lined up',
          'Choose Canada if: Long-term immigration and PR are your primary goal',
          'Choose Australia if: You prefer a warmer climate, and your field (engineering, healthcare, trades) is in demand',
          'All three are excellent choices — your specific course, target university, and career goals matter more than the country itself',
        ],
      },
      {
        type: 'tip',
        content: '🎯 Book a free 30-minute session with Jaivik Overseas — our counsellors have placed students in all three countries and can give you personalised advice based on your profile, budget, and immigration goals.',
      },
    ],
  },

  {
    slug: 'how-to-write-sop-for-university-admission',
    title: 'How to Write a Winning SOP for University Admission Abroad',
    metaTitle: 'SOP Writing Guide 2026 – How to Write Statement of Purpose for MS, MBA Abroad',
    metaDescription: 'Step-by-step guide to writing a winning Statement of Purpose (SOP) for MS, MBA or PhD applications abroad. Includes structure, tips, common mistakes and sample outline.',
    category: 'Application Tips',
    publishedAt: '2026-02-20',
    updatedAt: '2026-05-15',
    readTime: 8,
    excerpt: 'Your SOP is the single most important document in your application. Here is a proven structure and real tips to write one that gets you admitted.',
    tags: ['SOP', 'Statement of Purpose', 'Application', 'MS Abroad', 'MBA'],
    relatedLinks: [
      { href: '/book-counselling', label: 'Get SOP Review from Our Experts' },
      { href: '/course-finder', label: 'Find Your Course' },
      { href: '/mock-test', label: 'Practice IELTS First' },
    ],
    content: [
      {
        type: 'p',
        content: 'Admissions committees read thousands of SOPs. Yours needs to be specific, authentic, and clearly answer one question: "Why should we admit this student?" A generic SOP that could apply to 20 universities will get you rejected. A specific, well-crafted SOP gets you admitted.',
      },
      {
        type: 'h2',
        content: 'The Proven 5-Paragraph SOP Structure',
      },
      {
        type: 'ol',
        items: [
          'Hook + Why this field (100–150 words): Open with a specific story, project, or moment that ignited your interest. Not "I have always been passionate about..." — be concrete.',
          'Academic Background (150–200 words): Your undergraduate education, key projects, thesis, GPA, and what you learned. Mention relevant courses and professors who influenced you.',
          'Professional Experience (150–200 words): Internships, jobs, research assistantships. Use numbers — "reduced processing time by 40%," "managed team of 8 engineers." Connect experience to your research/study goals.',
          'Why This Program + University (150–200 words): Name specific professors whose research interests you, specific courses or labs, why their methodology fits your goals. Generic praise of rankings is a red flag.',
          'Future Goals (100–150 words): Where do you want to be in 5–10 years? Be ambitious but realistic. Connect your goals back to what this degree uniquely offers.',
        ],
      },
      {
        type: 'h2',
        content: 'What Admissions Committees Look For',
      },
      {
        type: 'ul',
        items: [
          'Specificity — names, numbers, projects, outcomes (not vague claims)',
          'Research fit — does your interest align with current faculty research?',
          'Clarity of purpose — why this degree, why now, why this university?',
          'Growth narrative — what gap does this program fill in your knowledge?',
          'Writing quality — clear, concise, no grammatical errors',
          'Unique voice — don\'t let ChatGPT write it; admissions can tell',
        ],
      },
      {
        type: 'h2',
        content: 'Common SOP Mistakes to Avoid',
      },
      {
        type: 'ul',
        items: [
          '❌ Starting with "Since childhood, I have been fascinated by..." — overused and cliché',
          '❌ Listing achievements without explaining the impact — "I won first prize" is weak; explain what you learned',
          '❌ Praising the university without specifics — "Your university is world-renowned" tells admissions nothing',
          '❌ Exceeding the word limit — 1,000 words is the standard maximum; stay tight',
          '❌ Using the same SOP for every university — tailor the "Why this program" section for each application',
          '❌ Discussing low GPA or backlogs in the SOP — leave negative explanations for the additional info section',
        ],
      },
      {
        type: 'h2',
        content: 'SOP Length and Format',
      },
      {
        type: 'table',
        headers: ['Program Type', 'Recommended Length', 'Font / Margins'],
        rows: [
          ['MS (Engineering, CS, Sciences)', '800–1,000 words', '12pt Times New Roman, 1-inch margins'],
          ['MBA', '500–800 words (2 essays)', 'Follow each school\'s specific prompt'],
          ['PhD', '1,000–1,500 words', 'Focus heavily on research experience'],
          ['UK LLM / Law', '600–800 words', 'Very formal tone'],
        ],
      },
      {
        type: 'callout',
        content: '📝 At Jaivik Overseas, our counsellors have reviewed 500+ SOPs for students admitted to MIT, UCL, University of Toronto, and NUS. Book a free session to get personalised feedback on your draft.',
      },
      {
        type: 'h2',
        content: 'SOP Checklist Before Submission',
      },
      {
        type: 'ul',
        items: [
          '✅ Opens with a specific story, not a generic statement',
          '✅ Mentions the professor or lab by name you want to work with',
          '✅ Every claim is backed by a specific example or number',
          '✅ Word count within the specified limit',
          '✅ No spelling or grammar errors (use Grammarly + human review)',
          '✅ Customised for this specific university and program',
          '✅ Ends with a clear statement of future goals',
        ],
      },
    ],
  },

  {
    slug: 'top-scholarships-indian-students-studying-abroad-2026',
    title: 'Top 10 Scholarships for Indian Students Studying Abroad 2026',
    metaTitle: 'Top 10 Scholarships for Indian Students Abroad 2026 – Full Funding & Partial',
    metaDescription: 'Comprehensive list of the best scholarships for Indian students studying abroad in 2026 — Chevening, Commonwealth, DAAD, Australia Awards, Fulbright and more. Deadlines, eligibility and tips.',
    category: 'Scholarships',
    publishedAt: '2026-03-01',
    updatedAt: '2026-05-20',
    readTime: 7,
    excerpt: 'Scholarships can save you ₹20L–₹1Cr on your education abroad. Here are the best scholarships for Indian students in 2026 with eligibility and deadlines.',
    tags: ['Scholarships', 'India', 'Study Abroad', 'Free Education', 'Funding'],
    relatedLinks: [
      { href: '/book-counselling', label: 'Get Scholarship Guidance' },
      { href: '/course-finder', label: 'Find Courses' },
      { href: '/universities', label: 'Browse Universities' },
    ],
    content: [
      {
        type: 'p',
        content: 'Studying abroad does not have to cost a fortune. Each year, thousands of Indian students receive scholarships worth ₹20L to ₹1 crore or more. These range from fully funded government scholarships to merit-based university awards. Here are the 10 most valuable scholarships you should apply for in 2026.',
      },
      {
        type: 'h2',
        content: '1. Chevening Scholarships (UK)',
      },
      {
        type: 'ul',
        items: [
          'Coverage: Full tuition + living allowance + flights + visa',
          'Destination: UK (any university)',
          'Level: Master\'s (1 year)',
          'Eligibility: 2+ years work experience, Indian citizenship',
          'Deadline: November (for following September intake)',
          'Value: ~£30,000 (₹32L+)',
        ],
      },
      {
        type: 'h2',
        content: '2. Commonwealth Scholarships (UK)',
      },
      {
        type: 'ul',
        items: [
          'Coverage: Full tuition + stipend + flights + visa',
          'Level: Master\'s and PhD',
          'Eligibility: Must demonstrate development impact for India',
          'Deadline: October–December',
          'Administered by: Commonwealth Scholarship Commission',
        ],
      },
      {
        type: 'h2',
        content: '3. DAAD Scholarships (Germany)',
      },
      {
        type: 'ul',
        items: [
          'Coverage: Full tuition + €850/month living stipend + health insurance',
          'Destination: Germany',
          'Level: Master\'s and PhD',
          'Eligibility: Strong academic record (70%+), relevant work experience',
          'Deadline: October–November (varies by program)',
          'Note: Over 200 Indian students receive DAAD annually',
        ],
      },
      {
        type: 'h2',
        content: '4. Australia Awards Scholarships',
      },
      {
        type: 'ul',
        items: [
          'Coverage: Full tuition + living allowance + airfare',
          'Level: Master\'s and PhD',
          'Deadline: April–May',
          'Value: ~AUD 60,000–100,000 total',
          'Focus: Students from development sectors (governance, education, health)',
        ],
      },
      {
        type: 'h2',
        content: '5. Fulbright-Nehru Fellowships (USA)',
      },
      {
        type: 'ul',
        items: [
          'Coverage: Tuition + living + airfare + health insurance',
          'Level: Master\'s, PhD, and Post-doctoral research',
          'Deadline: July 15 each year',
          'Fields: Arts, Humanities, Social Sciences, STEM',
          'Note: Highly competitive — requires strong research proposal',
        ],
      },
      {
        type: 'h2',
        content: '6. Inlaks Shivdasani Foundation Scholarships',
      },
      {
        type: 'ul',
        items: [
          'Coverage: Up to $100,000 (₹84L) for tuition and living',
          'Destination: USA, UK, or Europe',
          'Level: Master\'s and PhD at top 30 universities',
          'Deadline: March',
          'Eligibility: Indian citizens below 30 years, strong academic record',
        ],
      },
      {
        type: 'h2',
        content: '7. Ontario Graduate Scholarship (Canada)',
      },
      {
        type: 'ul',
        items: [
          'Value: CAD 10,000–15,000/yr',
          'Level: Master\'s and PhD at Ontario universities',
          'Eligibility: Any nationality — merit-based',
          'Applied through your Ontario university admission',
        ],
      },
      {
        type: 'table',
        headers: ['Scholarship', 'Country', 'Value (INR)', 'Deadline'],
        rows: [
          ['Chevening', 'UK', '₹32L+', 'November'],
          ['Commonwealth', 'UK', 'Full funding', 'Oct–Dec'],
          ['DAAD', 'Germany', '₹18L/yr', 'Oct–Nov'],
          ['Australia Awards', 'Australia', '₹50L–84L', 'April–May'],
          ['Fulbright-Nehru', 'USA', '₹40L+', 'July 15'],
          ['Inlaks Foundation', 'USA/UK/EU', 'Up to ₹84L', 'March'],
          ['Ontario Graduate', 'Canada', '₹6.1–9.1L/yr', 'Varies'],
          ['NUS/NTU Research', 'Singapore', 'Full + stipend', 'Dec–Feb'],
          ['MEXT', 'Japan', 'Full + stipend', 'May–June'],
          ['VLIR-UOS', 'Belgium', 'Full funding', 'February'],
        ],
      },
      {
        type: 'tip',
        content: '🎯 Scholarship tip: Apply to at least 5–6 scholarships simultaneously. Most have complementary eligibility criteria. Our counsellors at Jaivik Overseas can review your scholarship essays and maximize your chances.',
      },
    ],
  },

  {
    slug: 'australia-student-visa-guide-2026',
    title: 'Australia Student Visa (Subclass 500): Complete Guide for Indians 2026',
    metaTitle: 'Australia Student Visa Subclass 500 Guide 2026 – Process, Documents & Cost for Indians',
    metaDescription: 'Step-by-step guide to getting Australia Subclass 500 student visa from India in 2026. Documents required, processing time, GTE requirement, financial proof and tips.',
    category: 'Visa Guides',
    publishedAt: '2026-03-10',
    updatedAt: '2026-05-15',
    readTime: 7,
    excerpt: 'Everything Indian students need to know about getting the Australia Student Visa (Subclass 500) in 2026 — documents, GTE, processing time, and costs.',
    tags: ['Australia', 'Student Visa', 'Subclass 500', 'Visa Guide', 'Indian Students'],
    relatedLinks: [
      { href: '/universities/country/australia', label: 'Australia Universities' },
      { href: '/course-finder', label: 'Find Courses in Australia' },
      { href: '/book-counselling', label: 'Visa Counselling' },
    ],
    content: [
      {
        type: 'p',
        content: 'Australia\'s Student Visa (Subclass 500) allows international students to study full-time at a registered Australian institution. In 2025, Australia processed over 150,000 Indian student visa applications. With a 95%+ approval rate for well-prepared applications, getting the visa is straightforward if you follow the right steps.',
      },
      {
        type: 'h2',
        content: 'Australia Student Visa Eligibility Requirements',
      },
      {
        type: 'ul',
        items: [
          'Confirmation of Enrolment (CoE) from an Australian university registered under CRICOS',
          'Genuine Temporary Entrant (GTE) requirement — you must demonstrate intent to return to India',
          'Financial capacity: AUD 24,505/yr tuition + AUD 21,041/yr living + AUD 7,362/yr per dependent',
          'English proficiency: IELTS 5.5 minimum (most universities require 6.0–6.5)',
          'Health insurance (OSHC — Overseas Student Health Cover) for the full study period',
          'Health and character checks',
        ],
      },
      {
        type: 'h2',
        content: 'Step-by-Step Application Process',
      },
      {
        type: 'ol',
        items: [
          'Accept offer and pay tuition deposit — university issues CoE within 5–7 days',
          'Purchase OSHC — must cover full duration of your visa',
          'Create ImmiAccount on Australian Government portal',
          'Complete Form 157A online within ImmiAccount',
          'Upload all documents (see checklist below)',
          'Pay visa application fee — AUD 710 (₹38,500) for Student visa',
          'Biometrics: Not required from India (Australia removed biometrics requirement)',
          'Await decision — currently 4–8 weeks for Indian applicants',
        ],
      },
      {
        type: 'h2',
        content: 'Documents Required for Australia Student Visa',
      },
      {
        type: 'ul',
        items: [
          '📄 Confirmation of Enrolment (CoE)',
          '🛡️ OSHC policy (health insurance certificate)',
          '🛂 Passport (valid for at least 6 months beyond intended stay)',
          '💰 Financial evidence: Bank statements for last 3–6 months, loan sanction letter, or parents\' bank statements + proof of income',
          '📝 English proficiency: IELTS, TOEFL, or PTE score certificate',
          '🎓 Academic transcripts and degree certificates',
          '✍️ GTE statement (500–800 words explaining your study intentions)',
          '📸 Passport-size photos',
          '🏥 Health examination results (if requested by immigration)',
        ],
      },
      {
        type: 'callout',
        content: '⚠️ GTE (Genuine Temporary Entrant): This is the most common reason for visa refusals. Your GTE statement must convincingly explain why you will return to India after your studies — family ties, career opportunities, property ownership etc.',
      },
      {
        type: 'h2',
        content: 'Financial Requirements: How Much Proof Do You Need?',
      },
      {
        type: 'table',
        headers: ['Requirement', 'Amount (AUD)', 'Amount (INR)'],
        rows: [
          ['Tuition fees for 1 year', 'Your actual CoE amount', 'Varies'],
          ['Living costs per year', 'AUD 21,041', '₹11.4L'],
          ['Spouse/partner (if accompanying)', 'AUD 7,362', '₹4L'],
          ['Per child (if accompanying)', 'AUD 3,152', '₹1.7L'],
          ['Recommended bank balance to show', 'AUD 45,000–60,000', '₹24L–32L'],
        ],
      },
      {
        type: 'h2',
        content: 'Part-Time Work Rights for Students',
      },
      {
        type: 'p',
        content: 'From 2023, Australia removed the 40-hour cap on student work rights during term time. Students can now work unlimited hours during their studies (subject to visa conditions). After graduation, the Temporary Graduate visa (Subclass 485) gives 2–4 years of work rights depending on your study location and field.',
      },
    ],
  },

  {
    slug: 'best-courses-abroad-for-high-salary-jobs-2026',
    title: 'Best Courses to Study Abroad for High-Paying Jobs in 2026',
    metaTitle: 'Best Courses to Study Abroad 2026 – Highest Salary After Graduation for Indians',
    metaDescription: 'Which course gives the highest salary after studying abroad? Complete guide to the best courses in 2026 — CS, Data Science, Finance, Engineering, Healthcare — with average salaries.',
    category: 'Course Guidance',
    publishedAt: '2026-03-20',
    updatedAt: '2026-05-18',
    readTime: 8,
    excerpt: 'Choosing the right course is the most important decision for maximising your ROI on studying abroad. Here are the highest-paying fields and programs for 2026.',
    tags: ['Courses', 'High Salary', 'Career', 'ROI', 'Study Abroad'],
    relatedLinks: [
      { href: '/course-finder', label: 'Find Your Course' },
      { href: '/courses', label: 'All Course Categories' },
      { href: '/universities', label: 'Browse Universities' },
    ],
    content: [
      {
        type: 'p',
        content: 'The course you choose determines your salary, your PR pathway, and your overall ROI on studying abroad. With tuition and living costs ranging from ₹30L to ₹80L for a 2-year degree, choosing a course with strong job prospects is critical. Here are the best options for 2026 based on salary data from three key destinations.',
      },
      {
        type: 'h2',
        content: '1. Computer Science / Software Engineering',
      },
      {
        type: 'table',
        headers: ['Country', 'Avg. Starting Salary', 'Top Employers'],
        rows: [
          ['USA', '$90,000–$130,000/yr', 'Google, Meta, Amazon, Microsoft'],
          ['Canada', 'CAD 80,000–100,000/yr', 'Shopify, RBC, TD Bank, Amazon'],
          ['UK', '£45,000–65,000/yr', 'Revolut, HSBC, Amazon, Google'],
          ['Australia', 'AUD 90,000–120,000/yr', 'Atlassian, Canva, ANZ, AWS'],
          ['Germany', '€55,000–75,000/yr', 'SAP, Siemens, BMW, Deutsche Bank'],
        ],
      },
      {
        type: 'h2',
        content: '2. Data Science / AI / Machine Learning',
      },
      {
        type: 'p',
        content: 'Data Science remains the #1 highest-demand field in 2026. AI/ML roles command 20–30% salary premiums over traditional software engineering. Programs at University of Waterloo, Carnegie Mellon, Imperial College London, and TU Munich are especially valued by employers.',
      },
      {
        type: 'table',
        headers: ['Program', 'Duration', 'Avg. Salary (USA)', 'IELTS Required'],
        rows: [
          ['MS Data Science', '1.5–2 years', '$95,000–$135,000', '6.5+'],
          ['MS Artificial Intelligence', '1–2 years', '$100,000–$140,000', '6.5+'],
          ['MS Machine Learning', '1.5–2 years', '$105,000–$145,000', '7.0+'],
          ['MEng Computer Vision', '1–2 years', '$90,000–$125,000', '6.5+'],
        ],
      },
      {
        type: 'h2',
        content: '3. Finance, Accounting & Business Analytics',
      },
      {
        type: 'ul',
        items: [
          'MS Finance (London, New York, Toronto): Average starting salary £55,000–£85,000',
          'MBA (Top 20 schools): Average salary $120,000–$180,000 (USA)',
          'MS Business Analytics: High demand in consulting and banking — $80,000–$110,000 (USA)',
          'CFA + MS Finance combination is highly valued by investment banks',
          'Canada pathway: Work in Canadian banks → strong PR pathway through CEC',
        ],
      },
      {
        type: 'h2',
        content: '4. Civil, Mechanical & Electrical Engineering',
      },
      {
        type: 'p',
        content: 'Traditional engineering fields are especially strong for PR in Australia and Canada. Australia\'s skills shortage list includes Civil, Structural, Electrical, and Geotechnical Engineers — making PR via Subclass 190 (State Sponsored) very achievable. Canada\'s PNP streams also favour licensed engineers.',
      },
      {
        type: 'h2',
        content: '5. Healthcare — Nursing, Public Health, Physiotherapy',
      },
      {
        type: 'ul',
        items: [
          'Australia and Canada face critical nursing shortages — IELTS 7.0 required',
          'Registered Nurse salary: AUD 75,000–95,000 (Australia), CAD 70,000–90,000 (Canada)',
          'MSN (Master of Science in Nursing) from Australian or Canadian universities',
          'PR is extremely achievable for healthcare professionals in both countries',
          'UK: NHS employs 50,000+ Indian nurses — fastest route to UK PR for healthcare workers',
        ],
      },
      {
        type: 'h2',
        content: 'Courses to Avoid (Low ROI) for International Students',
      },
      {
        type: 'ul',
        items: [
          '⚠️ Fine Arts / Liberal Arts — low employability and high course costs',
          '⚠️ Hospitality Management — oversaturated in Australia and Canada',
          '⚠️ MBA from unranked universities — costs same but salary premium is minimal',
          '⚠️ Generic Business Management from colleges (not universities) — poor graduate outcomes',
        ],
      },
      {
        type: 'callout',
        content: '💡 ROI calculation: Always divide total course cost (tuition + living) by expected starting salary. A good study abroad decision should recover costs within 3–5 years of graduation.',
      },
    ],
  },

  {
    slug: 'singapore-universities-guide-indian-students-2026',
    title: 'Study in Singapore: NUS, NTU & Top Universities Guide for Indians 2026',
    metaTitle: 'Study in Singapore 2026 – NUS, NTU, SMU Fees, Visa & Jobs for Indian Students',
    metaDescription: 'Complete guide to studying in Singapore for Indian students. NUS ranks #8 globally. Fees, scholarships, student pass process, part-time work rules, and job market.',
    category: 'Country Guides',
    publishedAt: '2026-04-01',
    updatedAt: '2026-05-20',
    readTime: 6,
    excerpt: 'Singapore is home to two of Asia\'s top 20 universities. Low crime, excellent job market, and proximity to India make it a top choice for ambitious Indian students.',
    tags: ['Singapore', 'NUS', 'NTU', 'Study Abroad', 'Asia'],
    relatedLinks: [
      { href: '/universities/country/singapore', label: 'Singapore Universities' },
      { href: '/course-finder', label: 'Find Courses in Singapore' },
      { href: '/book-counselling', label: 'Get Free Counselling' },
    ],
    content: [
      {
        type: 'p',
        content: 'Singapore punches well above its weight in higher education. NUS ranks #8 globally (QS 2026), NTU ranks #15, and SMU is among Asia\'s best business schools. Combined with Singapore\'s status as Asia\'s financial hub, strategic location, and English-medium instruction, it\'s a compelling option for Indian students.',
      },
      {
        type: 'h2',
        content: 'Top Universities in Singapore',
      },
      {
        type: 'table',
        headers: ['University', 'QS Rank 2026', 'Annual Tuition (SGD)', 'Annual Tuition (INR)'],
        rows: [
          ['National University of Singapore (NUS)', '#8', 'SGD 35,000–50,000', '₹21.5L–30.7L'],
          ['Nanyang Technological University (NTU)', '#15', 'SGD 28,000–45,000', '₹17.2L–27.6L'],
          ['Singapore Management University (SMU)', '#511–520', 'SGD 32,000–40,000', '₹19.7L–24.6L'],
          ['Singapore Institute of Technology (SIT)', 'Unranked', 'SGD 24,000–32,000', '₹14.7L–19.7L'],
          ['SUTD (Singapore Univ. of Tech & Design)', 'Unranked', 'SGD 28,000–35,000', '₹17.2L–21.5L'],
        ],
      },
      {
        type: 'h2',
        content: 'Singapore Student Pass Process',
      },
      {
        type: 'ol',
        items: [
          'Receive offer letter from a Singapore university',
          'Complete eForm 16 (in-principle approval application) via SOLAR system',
          'Receive In-Principle Approval (IPA) letter — usually within 4–6 weeks',
          'Travel to Singapore and report to ICA with IPA letter within 2 months',
          'Enroll in Thumbprint Registration at ICA Building',
          'Collect Student\'s Pass (usually issued within 4 days)',
        ],
      },
      {
        type: 'h2',
        content: 'NUS and NTU Research Scholarships',
      },
      {
        type: 'p',
        content: 'Both NUS and NTU offer full scholarships for top PhD and research Master\'s students — covering tuition plus a monthly stipend of SGD 2,000–2,500 (₹1.2L–1.5L/month). For self-funded applicants, partial Merit Awards of SGD 10,000–20,000 are available for top Master\'s candidates.',
      },
      {
        type: 'h2',
        content: 'Job Market and Salaries in Singapore',
      },
      {
        type: 'table',
        headers: ['Field', 'Average Starting Salary (SGD/yr)'],
        rows: [
          ['Software Engineer', 'SGD 72,000–96,000'],
          ['Data Scientist / AI Engineer', 'SGD 84,000–110,000'],
          ['Investment Banking Analyst', 'SGD 90,000–120,000'],
          ['Management Consultant', 'SGD 80,000–105,000'],
          ['Civil / Structural Engineer', 'SGD 55,000–75,000'],
        ],
      },
      {
        type: 'callout',
        content: '🌏 Singapore is the gateway to Southeast Asian careers. NUS and NTU graduates are heavily recruited by Google APAC, Goldman Sachs, Grab, Sea Group, and all major banks operating in Asia.',
      },
    ],
  },

  {
    slug: 'ireland-student-visa-pr-guide-indians-2026',
    title: 'Study in Ireland 2026: Universities, Visa & Staying After Graduation',
    metaTitle: 'Study in Ireland 2026 – Trinity College, UCD, Fees & Graduate Visa for Indians',
    metaDescription: 'Complete guide to studying in Ireland for Indian students. Learn about Trinity College, UCD, fees (€12,000–€25,000/yr), student visa, and the 2-year Stay Back option after graduation.',
    category: 'Country Guides',
    publishedAt: '2026-04-15',
    updatedAt: '2026-05-22',
    readTime: 6,
    excerpt: 'Ireland is home to the European headquarters of Google, Meta, Apple, and Pfizer. A Master\'s here opens doors to both Irish jobs and EU-wide careers.',
    tags: ['Ireland', 'Trinity College', 'UCD', 'European Jobs', 'Indian Students'],
    relatedLinks: [
      { href: '/universities/country/ireland', label: 'Ireland Universities' },
      { href: '/course-finder', label: 'Find Courses in Ireland' },
      { href: '/book-counselling', label: 'Book Free Counselling' },
    ],
    content: [
      {
        type: 'p',
        content: 'Ireland has quietly become one of the most attractive study destinations for Indian students. With Ireland hosting the European HQs of Google, Meta, Apple, LinkedIn, Pfizer, and Medtronic, graduates have access to high-quality jobs in tech and pharma directly after their degree.',
      },
      {
        type: 'h2',
        content: 'Top Universities in Ireland',
      },
      {
        type: 'table',
        headers: ['University', 'QS Rank 2026', 'Annual Tuition', 'Location'],
        rows: [
          ['Trinity College Dublin', '#81', '€18,000–€25,000', 'Dublin City Centre'],
          ['University College Dublin (UCD)', '#181', '€16,000–€22,000', 'Dublin (Belfield)'],
          ['University College Cork (UCC)', '#303', '€12,000–€18,000', 'Cork'],
          ['University of Galway (NUIG)', '#303', '€12,000–€16,000', 'Galway'],
          ['Dublin City University (DCU)', '#486', '€10,000–€15,000', 'Dublin (Glasnevin)'],
        ],
      },
      {
        type: 'h2',
        content: 'Ireland\'s Third Level Graduate Programme (Stay-Back)',
      },
      {
        type: 'p',
        content: 'After completing a degree in Ireland, non-EEA graduates receive a Third Level Graduate Programme permission to remain in Ireland and seek employment. This is essentially a 2-year post-study work permit that converts to an employment permit if you get a qualifying job offer.',
      },
      {
        type: 'ul',
        items: [
          'Duration 1 year (for NFQ Level 8 degrees) or 2 years (for NFQ Level 9/10 — Master\'s and PhD)',
          'Full work authorisation — can work for any employer',
          'After 2 years of employment, you can apply for Critical Skills Employment Permit for PR pathway',
          'Irish naturalisation possible after 5 years of legal residence',
        ],
      },
      {
        type: 'h2',
        content: 'Ireland Student Visa Requirements for Indians',
      },
      {
        type: 'ol',
        items: [
          'Letter of Acceptance from an Irish university',
          'Proof of payment of first year tuition fees',
          'Financial funds: €7,000 minimum per year for living costs',
          'Private medical insurance',
          'English proficiency: IELTS 6.0–6.5 (varies by university)',
          'Passport valid for at least 12 months',
          'Visa application form + €60 fee (applied at VFS Global in India)',
        ],
      },
      {
        type: 'h2',
        content: 'Job Opportunities in Ireland After Graduation',
      },
      {
        type: 'ul',
        items: [
          'Google, Meta, LinkedIn, Airbnb all have large Dublin engineering offices hiring graduates',
          'Pfizer, Medtronic, Boston Scientific hire biomedical and pharma graduates',
          'Average software engineering salary in Dublin: €55,000–€80,000/yr',
          'Financial services (Citibank, Bank of America Dublin) hire finance graduates',
          'Strong demand for Data Scientists, Cloud Engineers, and DevOps in Dublin\'s Silicon Docks',
        ],
      },
      {
        type: 'callout',
        content: '💡 Ireland tip: Dublin\'s "Silicon Docks" area (where Google, Airbnb, Meta etc. are based) is a 20-minute walk from Trinity College. Many Irish CS and Data Science graduates get jobs here within 3 months of graduation.',
      },
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter(p => p.category === category);
}

export const blogCategories = Array.from(new Set(blogPosts.map(p => p.category)));
