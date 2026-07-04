import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import COURSE_CATEGORIES from "@/data/course-categories";
import CoursesSearch from "@/components/CoursesSearch";

export const metadata: Metadata = buildMetadata({
  title: "Courses to Study Abroad from India 2026 — Fees, IELTS & Top Universities",
  description: "Top 50 courses to study abroad from India in 2026. Compare MBA, MS Computer Science, Engineering, Data Science fees in INR, IELTS requirements and apply through Jaivik Overseas — 13 years expertise.",
  path: "/courses",
  keywords: ["courses to study abroad from India 2026", "study abroad courses for Indian students", "MS abroad fees INR", "MBA abroad IELTS requirements", "engineering abroad from India"],
});

const FEATURED = ["ms-computer-science","mba","data-science","cybersecurity","engineering-electrical-electronic","ms-finance","nursing","law","psychology","public-health","engineering-mechanical-aeronautical","accounting-finance","business-analytics","sustainable-development","computer-science-information-systems"];

const GROUPS: Record<string, string[]> = {
  "Engineering": ["engineering-mechanical-aeronautical","engineering-electrical-electronic","engineering-aerospace","engineering-aeronautical","engineering-chemical","engineering-civil-structural","engineering-biomedical","engineering-general","engineering-management","engineering-materials","engineering-mechatronics","engineering-manufacturing","engineering-mineral-mining","engineering-petroleum","engineering-automotive","engineering-product-design"],
  "Computer Science & IT": ["computer-science-information-systems","ms-computer-science","data-science","cybersecurity","information-technology","business-analytics","statistics-operational-research"],
  "Business & Management": ["business-management","mba","accounting-finance","finance-accounting","ms-finance","marketing","human-resources-management","logistics-supply-chain","public-relations","real-estate"],
  "Medicine & Health": ["medicine","medical-school","nursing","pharmacy-pharmacology","public-health","health-healthcare","health-sciences","medicine-related-studies","anatomy-physiology","dentistry","veterinary-science","immunology","toxicology"],
  "Sciences": ["biological-sciences","chemistry","physics-astronomy","mathematics","genetics","life-sciences-medicine","materials-sciences","astronomy","geology","geophysics","food-science","zoology"],
  "Social Sciences & Humanities": ["psychology","sociology","anthropology","history-archaeology","philosophy","linguistics","politics","international-relations","global-affairs","area-studies","classics-ancient-history","english-language-literature","modern-languages","theology-religion","ethnicity-gender-diversity"],
  "Arts, Design & Media": ["art-design","architecture","fashion","music","performing-arts","digital-media","media-studies","art-history","communication-media-studies","journalism"],
  "Environment & Sustainability": ["environmental-sciences","sustainable-development","energy","earth-environmental-sciences","earth-marine-sciences","geography","urban-planning","agriculture-forestry"],
  "Law & Policy": ["law","social-work","social-policy","public-policy","criminology","development-studies","social-sciences-management","community-development","industrial-relations"],
  "Other Subjects": ["hospitality-leisure-management","sports-related","built-environment","library-information-management","education-training","textile"],
};

type TopCourse = {
  name: string;
  university: string;
  uniSlug: string;
  courseSlug: string;
  country: string;
  flag: string;
  inrLakh: number;
  ielts: number;
  level: string;
  duration: string;
};

const TOP_50: TopCourse[] = [
  // Canada — University of Toronto
  { name: "Computer Science", university: "University of Toronto", uniSlug: "university-of-toronto", courseSlug: "uoft-computer-science", country: "Canada", flag: "🇨🇦", inrLakh: 16.1, ielts: 6.5, level: "Masters", duration: "1 yr" },
  { name: "MBA — Management", university: "University of Toronto", uniSlug: "university-of-toronto", courseSlug: "uoft-management-master-of-business-administration", country: "Canada", flag: "🇨🇦", inrLakh: 16.1, ielts: 6.5, level: "Masters", duration: "1 yr" },
  { name: "Electrical & Computer Engineering", university: "University of Toronto", uniSlug: "university-of-toronto", courseSlug: "uoft-electrical-and-computer-engineering", country: "Canada", flag: "🇨🇦", inrLakh: 16.1, ielts: 6.5, level: "Masters", duration: "1 yr" },
  { name: "Biomedical Engineering", university: "University of Toronto", uniSlug: "university-of-toronto", courseSlug: "uoft-biomedical-engineering", country: "Canada", flag: "🇨🇦", inrLakh: 16.1, ielts: 6.5, level: "Masters", duration: "1 yr" },
  { name: "Mathematical Finance", university: "University of Toronto", uniSlug: "university-of-toronto", courseSlug: "uoft-mathematical-finance", country: "Canada", flag: "🇨🇦", inrLakh: 16.1, ielts: 6.5, level: "Masters", duration: "1 yr" },
  { name: "Nursing Science", university: "University of Toronto", uniSlug: "university-of-toronto", courseSlug: "uoft-nursing-science", country: "Canada", flag: "🇨🇦", inrLakh: 16.1, ielts: 6.5, level: "Masters", duration: "1 yr" },
  { name: "Mechanical & Industrial Engineering", university: "University of Toronto", uniSlug: "university-of-toronto", courseSlug: "uoft-mechanical-and-industrial-engineering", country: "Canada", flag: "🇨🇦", inrLakh: 16.1, ielts: 6.5, level: "Masters", duration: "1 yr" },
  { name: "Chemical Engineering", university: "University of Toronto", uniSlug: "university-of-toronto", courseSlug: "uoft-chemical-engineering-and-applied-chemistry", country: "Canada", flag: "🇨🇦", inrLakh: 16.1, ielts: 6.5, level: "Masters", duration: "1 yr" },
  // UK — University of Manchester
  { name: "Advanced Computer Science MSc", university: "University of Manchester", uniSlug: "university-of-manchester", courseSlug: "manchester-advanced-computer-science-msc", country: "UK", flag: "🇬🇧", inrLakh: 27.8, ielts: 6.5, level: "Masters", duration: "1 yr" },
  { name: "Artificial Intelligence MSc", university: "University of Manchester", uniSlug: "university-of-manchester", courseSlug: "manchester-artificial-intelligence-msc", country: "UK", flag: "🇬🇧", inrLakh: 27.8, ielts: 6.5, level: "Masters", duration: "1 yr" },
  { name: "Business Analytics & AI MSc", university: "University of Manchester", uniSlug: "university-of-manchester", courseSlug: "manchester-business-analytics-and-artificial-intelligence-msc", country: "UK", flag: "🇬🇧", inrLakh: 27.8, ielts: 6.5, level: "Masters", duration: "1 yr" },
  { name: "Accounting & Finance MSc", university: "University of Manchester", uniSlug: "university-of-manchester", courseSlug: "manchester-accounting-and-finance-msc", country: "UK", flag: "🇬🇧", inrLakh: 27.8, ielts: 6.5, level: "Masters", duration: "1 yr" },
  { name: "Aerospace Engineering MSc", university: "University of Manchester", uniSlug: "university-of-manchester", courseSlug: "manchester-aerospace-engineering-msc", country: "UK", flag: "🇬🇧", inrLakh: 27.8, ielts: 6.5, level: "Masters", duration: "1 yr" },
  { name: "Advanced Chemical Engineering MSc", university: "University of Manchester", uniSlug: "university-of-manchester", courseSlug: "manchester-advanced-chemical-engineering-msc", country: "UK", flag: "🇬🇧", inrLakh: 27.8, ielts: 6.5, level: "Masters", duration: "1 yr" },
  // UK — University of Edinburgh
  { name: "Artificial Intelligence MSc", university: "University of Edinburgh", uniSlug: "university-of-edinburgh", courseSlug: "edinburgh-artificial-intelligence-msc", country: "UK", flag: "🇬🇧", inrLakh: 24.6, ielts: 6.5, level: "Masters", duration: "1 yr" },
  { name: "AI for Business MSc", university: "University of Edinburgh", uniSlug: "university-of-edinburgh", courseSlug: "edinburgh-ai-for-business-msc", country: "UK", flag: "🇬🇧", inrLakh: 24.6, ielts: 6.5, level: "Masters", duration: "1 yr" },
  { name: "Accounting & Financial Management MSc", university: "University of Edinburgh", uniSlug: "university-of-edinburgh", courseSlug: "edinburgh-accounting-and-financial-management-msc", country: "UK", flag: "🇬🇧", inrLakh: 24.6, ielts: 6.5, level: "Masters", duration: "1 yr" },
  { name: "Advanced Chemical Engineering MSc", university: "University of Edinburgh", uniSlug: "university-of-edinburgh", courseSlug: "edinburgh-advanced-chemical-engineering-msc", country: "UK", flag: "🇬🇧", inrLakh: 24.6, ielts: 6.5, level: "Masters", duration: "1 yr" },
  { name: "Advanced Nursing MSc", university: "University of Edinburgh", uniSlug: "university-of-edinburgh", courseSlug: "edinburgh-advanced-nursing-msc", country: "UK", flag: "🇬🇧", inrLakh: 24.6, ielts: 6.5, level: "Masters", duration: "1 yr" },
  // Australia — Monash University
  { name: "MSc Computer Science", university: "Monash University", uniSlug: "monash-university", courseSlug: "monash-msc-computer-science", country: "Australia", flag: "🇦🇺", inrLakh: 23.9, ielts: 6.5, level: "Masters", duration: "2 yrs" },
  { name: "MSc Data Science", university: "Monash University", uniSlug: "monash-university", courseSlug: "monash-msc-data-science", country: "Australia", flag: "🇦🇺", inrLakh: 23.9, ielts: 6.5, level: "Masters", duration: "2 yrs" },
  { name: "MSc Artificial Intelligence", university: "Monash University", uniSlug: "monash-university", courseSlug: "monash-msc-artificial-intelligence", country: "Australia", flag: "🇦🇺", inrLakh: 23.9, ielts: 6.5, level: "Masters", duration: "2 yrs" },
  { name: "MSc Machine Learning", university: "Monash University", uniSlug: "monash-university", courseSlug: "monash-msc-machine-learning", country: "Australia", flag: "🇦🇺", inrLakh: 23.9, ielts: 6.5, level: "Masters", duration: "2 yrs" },
  { name: "MSc Cyber Security", university: "Monash University", uniSlug: "monash-university", courseSlug: "monash-msc-cyber-security", country: "Australia", flag: "🇦🇺", inrLakh: 21.7, ielts: 6.5, level: "Masters", duration: "2 yrs" },
  { name: "MSc Software Engineering", university: "Monash University", uniSlug: "monash-university", courseSlug: "monash-msc-software-engineering", country: "Australia", flag: "🇦🇺", inrLakh: 23.9, ielts: 6.5, level: "Masters", duration: "2 yrs" },
  // Australia — University of Wollongong
  { name: "MBA Advanced", university: "University of Wollongong", uniSlug: "university-of-wollongong", courseSlug: "uow-master-of-business-administration-advanced", country: "Australia", flag: "🇦🇺", inrLakh: 17.1, ielts: 6.0, level: "Masters", duration: "1.5 yrs" },
  { name: "Master of Professional Psychology", university: "University of Wollongong", uniSlug: "university-of-wollongong", courseSlug: "uow-master-of-professional-psychology", country: "Australia", flag: "🇦🇺", inrLakh: 17.1, ielts: 6.0, level: "Masters", duration: "1.5 yrs" },
  { name: "Master of Nutrition & Dietetics", university: "University of Wollongong", uniSlug: "university-of-wollongong", courseSlug: "uow-master-of-nutrition-and-dietetics", country: "Australia", flag: "🇦🇺", inrLakh: 17.1, ielts: 6.0, level: "Masters", duration: "1.5 yrs" },
  { name: "Graduate Certificate in Applied Finance", university: "University of Wollongong", uniSlug: "university-of-wollongong", courseSlug: "uow-graduate-certificate-in-applied-finance", country: "Australia", flag: "🇦🇺", inrLakh: 9.9, ielts: 6.0, level: "Masters", duration: "6 mths" },
  { name: "Graduate Diploma in Business Administration", university: "University of Wollongong", uniSlug: "university-of-wollongong", courseSlug: "uow-graduate-diploma-in-business-administration", country: "Australia", flag: "🇦🇺", inrLakh: 12.1, ielts: 6.0, level: "Masters", duration: "1 yr" },
  // Germany — Technical University of Munich
  { name: "Aerospace Engineering MSc", university: "TU Munich", uniSlug: "technical-university-of-munich", courseSlug: "tum-aerospace-engineering-master-of-science-msc", country: "Germany", flag: "🇩🇪", inrLakh: 5.5, ielts: 6.5, level: "Masters", duration: "2 yrs" },
  { name: "Automotive Engineering MSc", university: "TU Munich", uniSlug: "technical-university-of-munich", courseSlug: "tum-automotive-engineering-master-of-science-msc", country: "Germany", flag: "🇩🇪", inrLakh: 5.5, ielts: 6.5, level: "Masters", duration: "2 yrs" },
  { name: "AI in Biomedicine MSc", university: "TU Munich", uniSlug: "technical-university-of-munich", courseSlug: "tum-ai-in-biomedicine-master-of-science-msc", country: "Germany", flag: "🇩🇪", inrLakh: 5.5, ielts: 6.5, level: "Masters", duration: "2 yrs" },
  { name: "Biomedical Engineering & Medical Physics MSc", university: "TU Munich", uniSlug: "technical-university-of-munich", courseSlug: "tum-biomedical-engineering-and-medical-physics-master-of-science-msc", country: "Germany", flag: "🇩🇪", inrLakh: 5.5, ielts: 6.5, level: "Masters", duration: "2 yrs" },
  { name: "Bioinformatics MSc", university: "TU Munich", uniSlug: "technical-university-of-munich", courseSlug: "tum-bioinformatics-master-of-science-msc-1", country: "Germany", flag: "🇩🇪", inrLakh: 5.5, ielts: 6.5, level: "Masters", duration: "2 yrs" },
  // Germany — LMU Munich
  { name: "MSc Computer Science", university: "LMU Munich", uniSlug: "lmu-munich", courseSlug: "lmu-msc-computer-science", country: "Germany", flag: "🇩🇪", inrLakh: 0.5, ielts: 6.5, level: "Masters", duration: "2 yrs" },
  { name: "MSc Data Science", university: "LMU Munich", uniSlug: "lmu-munich", courseSlug: "lmu-msc-data-science", country: "Germany", flag: "🇩🇪", inrLakh: 0.5, ielts: 6.5, level: "Masters", duration: "2 yrs" },
  { name: "MSc Artificial Intelligence", university: "LMU Munich", uniSlug: "lmu-munich", courseSlug: "lmu-msc-artificial-intelligence", country: "Germany", flag: "🇩🇪", inrLakh: 0.5, ielts: 6.5, level: "Masters", duration: "2 yrs" },
  { name: "MSc Machine Learning", university: "LMU Munich", uniSlug: "lmu-munich", courseSlug: "lmu-msc-machine-learning", country: "Germany", flag: "🇩🇪", inrLakh: 0.5, ielts: 6.5, level: "Masters", duration: "2 yrs" },
  // More UK — Aston University
  { name: "AI Business Transformation MSc", university: "Aston University", uniSlug: "aston-university", courseSlug: "aston-ai-business-transformation-msc", country: "UK", flag: "🇬🇧", inrLakh: 18.2, ielts: 6.0, level: "Masters", duration: "1 yr" },
  { name: "Project Management MSc", university: "Aston University", uniSlug: "aston-university", courseSlug: "aston-project-management-msc-msc", country: "UK", flag: "🇬🇧", inrLakh: 18.2, ielts: 6.0, level: "Masters", duration: "1 yr" },
  { name: "LLM Law & Legal Practice", university: "Aston University", uniSlug: "aston-university", courseSlug: "aston-master-laws-and-legal-practice-llm", country: "UK", flag: "🇬🇧", inrLakh: 19.3, ielts: 6.0, level: "Masters", duration: "1 yr" },
  { name: "Physician Associate Practice MSc", university: "Aston University", uniSlug: "aston-university", courseSlug: "aston-physician-associate-practice-msc", country: "UK", flag: "🇬🇧", inrLakh: 18.2, ielts: 6.0, level: "Masters", duration: "1 yr" },
  // UK — University of Birmingham
  { name: "MSc Computer Science", university: "University of Birmingham", uniSlug: "university-of-birmingham", courseSlug: "birmingham-msc-computer-science", country: "UK", flag: "🇬🇧", inrLakh: 31.5, ielts: 6.5, level: "Masters", duration: "1 yr" },
  { name: "MSc Data Science", university: "University of Birmingham", uniSlug: "university-of-birmingham", courseSlug: "birmingham-msc-data-science", country: "UK", flag: "🇬🇧", inrLakh: 31.5, ielts: 6.5, level: "Masters", duration: "1 yr" },
  { name: "MSc Artificial Intelligence", university: "University of Birmingham", uniSlug: "university-of-birmingham", courseSlug: "birmingham-msc-artificial-intelligence", country: "UK", flag: "🇬🇧", inrLakh: 31.5, ielts: 6.5, level: "Masters", duration: "1 yr" },
  { name: "MSc Finance", university: "University of Birmingham", uniSlug: "university-of-birmingham", courseSlug: "birmingham-msc-finance", country: "UK", flag: "🇬🇧", inrLakh: 31.5, ielts: 6.5, level: "Masters", duration: "1 yr" },
  { name: "MSc Advanced Computer Science", university: "University of Birmingham", uniSlug: "university-of-birmingham", courseSlug: "birmingham-msc-advanced-computer-science", country: "UK", flag: "🇬🇧", inrLakh: 31.5, ielts: 6.5, level: "Masters", duration: "1 yr" },
  { name: "MSc Human Computer Interaction", university: "Monash University", uniSlug: "monash-university", courseSlug: "monash-msc-human-computer-interaction", country: "Australia", flag: "🇦🇺", inrLakh: 23.9, ielts: 6.5, level: "Masters", duration: "2 yrs" },
  { name: "Chemistry MSc", university: "University of Manchester", uniSlug: "university-of-manchester", courseSlug: "manchester-chemistry-msc", country: "UK", flag: "🇬🇧", inrLakh: 27.8, ielts: 6.5, level: "Masters", duration: "1 yr" },
  { name: "Civil & Mineral Engineering", university: "University of Toronto", uniSlug: "university-of-toronto", courseSlug: "uoft-civil-and-mineral-engineering", country: "Canada", flag: "🇨🇦", inrLakh: 16.1, ielts: 6.5, level: "Masters", duration: "1 yr" },
];

export default function CoursesPage() {
  const featured = FEATURED.map(s => COURSE_CATEGORIES.find(c => c.slug === s)).filter(Boolean) as typeof COURSE_CATEGORIES;
  const total = COURSE_CATEGORIES.length;

  const countryColors: Record<string, string> = {
    Canada: "bg-red-50 text-red-700 border-red-200",
    UK: "bg-blue-50 text-blue-700 border-blue-200",
    Australia: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Germany: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            {total}+ Course Streams — 13 Countries
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Courses to Study Abroad from India 2026</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto mb-6">
            Top 50 courses with verified 2026 fees in INR, IELTS cutoffs and direct links to course pages — MBA, MS, Engineering, Data Science and more.
          </p>
          <Link href="/book-counselling" className="btn-gold inline-block">Free Counselling →</Link>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[[`${total}+`,"Course Streams"],["500+","Universities"],["13","Countries"],["10,000+","Course Pages"]].map(([v,l])=>(
            <div key={l} className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
              <p className="text-2xl font-bold text-brand-700">{v}</p>
              <p className="text-xs text-gray-500 mt-1">{l}</p>
            </div>
          ))}
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Most Popular Course Streams for Indian Students</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {featured.map(c => (
              <Link key={c!.slug} href={`/courses/${c!.slug}`}
                className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-brand-200 hover:shadow-md transition-all text-center group">
                <span className="text-2xl">{c!.emoji}</span>
                <p className="text-xs font-semibold text-gray-900 group-hover:text-brand-700 mt-2 leading-snug">{c!.name}</p>
                <p className="text-xs text-gray-500 mt-1">${Math.round(c!.avgFeeUSD/1000)}K/yr avg</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Top 50 Courses Abroad for Indian Students — 2026</h2>
          <p className="text-gray-500 text-sm mb-5">Verified fees in INR, IELTS requirements and direct links to full course pages with admission details.</p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">#</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Course</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">University</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">Country</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">Annual Fee (INR)</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">IELTS</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">Duration</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 whitespace-nowrap"></th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_50.map((c, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-400 font-medium">{i + 1}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.level}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{c.university}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${countryColors[c.country] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                          {c.flag} {c.country}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-brand-700 whitespace-nowrap">
                        {c.inrLakh < 1 ? `₹${Math.round(c.inrLakh * 100)}K` : `₹${c.inrLakh.toFixed(1)}L`}
                      </td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{c.ielts}+</td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{c.duration}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/universities/${c.uniSlug}/courses/${c.courseSlug}`}
                          className="text-xs font-semibold text-brand-700 hover:text-brand-900 whitespace-nowrap"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">Fees are indicative for 2026. Contact Jaivik Overseas for exact current fees and scholarships.</p>
        </div>

        <CoursesSearch categories={COURSE_CATEGORIES} groups={GROUPS} />

        <div className="mt-12 bg-brand-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Not Sure Which Course Suits You?</h2>
          <p className="text-blue-200 mb-5 max-w-xl mx-auto">Our counsellors have guided 500+ Indian students to the right course and university. Free 30-minute session.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/book-counselling" className="btn-gold">Book Free Counselling →</Link>
            <Link href="/find-my-course" className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-colors">Use Course Finder →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
