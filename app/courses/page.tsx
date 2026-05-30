import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import COURSE_CATEGORIES from "@/data/course-categories";

export const metadata: Metadata = buildMetadata({
  title: "Courses Abroad for Indian Students 2026 – All Subjects",
  description: "Browse 100+ degree programs abroad. MBA, MS Computer Science, Engineering, Medicine, Law, Data Science. Fees, IELTS requirements, top universities for every course stream.",
  path: "/courses",
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

export default function CoursesPage() {
  const featured = FEATURED.map(s => COURSE_CATEGORIES.find(c => c.slug === s)).filter(Boolean) as typeof COURSE_CATEGORIES;
  const total = COURSE_CATEGORIES.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-14 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            {total}+ Course Streams — 13 Countries
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Courses Abroad for Indian Students 2026</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto mb-6">
            Every degree stream — MBA to Medicine, Engineering to Environmental Science. Compare fees, IELTS requirements and top universities across 13 countries.
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">Most Popular Courses for Indian Students</h2>
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

        <div className="space-y-8">
          {Object.entries(GROUPS).map(([group, slugs]) => {
            const cats = slugs.map(s => COURSE_CATEGORIES.find(c => c.slug === s)).filter(Boolean) as typeof COURSE_CATEGORIES;
            if (!cats.length) return null;
            return (
              <div key={group}>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-brand-600 rounded-full inline-block" />
                  {group}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {cats.map(c => (
                    <Link key={c.slug} href={`/courses/${c.slug}`}
                      className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-brand-200 hover:shadow-md transition-all group flex items-start gap-3">
                      <span className="text-xl flex-shrink-0 mt-0.5">{c.emoji}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-brand-700 leading-snug">{c.name}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-xs text-brand-700 font-medium">${Math.round(c.avgFeeUSD/1000)}K/yr</span>
                          <span className="text-xs text-gray-400">IELTS {c.ieltsTypical}+</span>
                          <span className="text-xs text-gray-400">{c.topCountries.slice(0,2).join(", ")}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-brand-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Not Sure Which Course Suits You?</h2>
          <p className="text-blue-200 mb-5 max-w-xl mx-auto">Our counsellors have guided 500+ Indian students to the right course and university. Free 30-minute session.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/book-counselling" className="btn-gold">Book Free Counselling →</Link>
            <Link href="/course-finder" className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-colors">Use Course Finder →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
