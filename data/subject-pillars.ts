// Subject pillar pages (2026-07-17) — the nursing-hub pattern (/nursing-abroad)
// generalized to a config-driven generator. Each entry drives one static route
// under app/<slug>/page.tsx via components/SubjectPillarPage.tsx. Matching is
// against real course names in data/university-course-registry.ts's REGISTRY
// only (getAllRealCourses()) — never against curated/estimated data.

export interface SubjectPillarConfig {
  slug: string;
  name: string; // short display name, e.g. "MBA"
  emoji: string;
  matcher: RegExp; // tested against RealCourseEntry.name
  introLabel: string; // used in copy: "{introLabel} Abroad for Indian Students"
}

export const SUBJECT_PILLARS: SubjectPillarConfig[] = [
  {
    slug: 'mba-abroad-for-indian-students',
    name: 'MBA',
    emoji: '💼',
    matcher: /\b(mba|business administration)\b/i,
    introLabel: 'MBA',
  },
  {
    slug: 'computer-science-abroad-for-indian-students',
    name: 'Computer Science',
    emoji: '💻',
    matcher: /\b(computer science|computing)\b/i,
    introLabel: 'Computer Science',
  },
  {
    slug: 'data-science-abroad-for-indian-students',
    name: 'Data Science',
    emoji: '📊',
    matcher: /\b(data science|data analytics|business analytics)\b/i,
    introLabel: 'Data Science & Analytics',
  },
  {
    slug: 'finance-accounting-abroad-for-indian-students',
    name: 'Finance & Accounting',
    emoji: '💰',
    matcher: /\b(finance|accounting)\b/i,
    introLabel: 'Finance & Accounting',
  },
];

export function getSubjectPillarBySlug(slug: string): SubjectPillarConfig | undefined {
  return SUBJECT_PILLARS.find(p => p.slug === slug);
}

/** Every pillar whose matcher matches a given real course name — a course can belong to more than one. */
export function getMatchingPillarsForCourseName(name: string): SubjectPillarConfig[] {
  return SUBJECT_PILLARS.filter(p => p.matcher.test(name));
}
