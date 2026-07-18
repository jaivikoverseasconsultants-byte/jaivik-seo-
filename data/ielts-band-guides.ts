// IELTS band decision guides (Phase 1, 2026-07-18 — BUILD-LOG.md §2 item 12).
// The per-course tables these hubs used to show were driven by RealCourseEntry
// .ieltsMin, which is a generator-formula default (not a real per-course crawl)
// for 95.5-100% of listings on every band — see BUILD-LOG.md §2 item 12 for
// the full quantified evidence. Phase 1: remove the fabricated table, reframe
// as a general decision guide. Phase 2 (later, separate task): replace with a
// real university-level English-requirements crawl.
//
// Content below is general, real-world study-abroad-counselling knowledge
// (how IELTS bands map to competitiveness tiers, the overall-vs-section-score
// distinction) — not derived from or asserting any specific per-university
// number from our own data.

export interface IeltsBandGuide {
  slug: string;
  band: number; // 6, 6.5, 7
  bandLabel: string; // '6.0', '6.5', '7.0'
  title: string;
  levelDescription: string; // CEFR-style "competent/good user" framing
  accessibility: string; // what's realistically accessible at this band
  countryNotes: string; // general, hedged country-level notes
}

export const IELTS_BAND_GUIDES: IeltsBandGuide[] = [
  {
    slug: 'ielts-6-0-universities',
    band: 6,
    bandLabel: '6.0',
    title: 'What IELTS 6.0 Really Means for Studying Abroad',
    levelDescription: 'IELTS 6.0 overall is generally described as a "competent user" level on the IELTS scale — you can handle everyday and much academic/professional English, though with occasional inaccuracies, misunderstandings, or hesitation in more complex situations.',
    accessibility: 'IELTS 6.0 sits toward the lower end of what universities typically accept. It is most commonly the entry bar for foundation/pathway programmes, some diploma and undergraduate programmes, and a smaller number of taught master\'s programmes — usually at less oversubscribed institutions or in less competitive subjects. Highly-ranked universities and popular, oversubscribed programmes (business, computer science, data science) very often ask for 6.5 or higher, even where a lower-ranked programme at the same university accepts 6.0.',
    countryNotes: 'The UK, Australia, Canada, Ireland, and New Zealand all have some genuinely IELTS-6.0-accepting pathways, but exactly which institution and course accepts 6.0 changes by intake and isn\'t something we track centrally as a verified per-university list — see "What to Do Next" below for how to actually find out.',
  },
  {
    slug: 'ielts-6-5-universities',
    band: 6.5,
    bandLabel: '6.5',
    title: 'What IELTS 6.5 Really Means for Studying Abroad',
    levelDescription: 'IELTS 6.5 overall sits between "competent" and "good" user on the IELTS scale — generally effective command of English with occasional inaccuracies, but able to handle complex academic language reasonably well.',
    accessibility: 'IELTS 6.5 is the most common minimum for taught master\'s degrees across the UK, Australia, Canada, Ireland, and New Zealand — it\'s the "standard" bar most Indian postgraduate applicants end up aiming for, since a large share of taught programmes across these destinations set their minimum here. Many highly competitive or highly-ranked programmes, and most professionally regulated subjects (law, teaching, some health fields), ask for more than 6.5.',
    countryNotes: 'Because 6.5 is such a common baseline, it opens up the largest range of realistic options among the three bands on this site — but "common baseline" doesn\'t mean universal, and specific programmes still vary. Confirm the exact requirement for your shortlisted courses rather than assuming 6.5 is automatically enough.',
  },
  {
    slug: 'ielts-7-0-universities',
    band: 7,
    bandLabel: '7.0',
    title: 'What IELTS 7.0 Really Means for Studying Abroad',
    levelDescription: 'IELTS 7.0 overall is generally described as a "good user" level — operationally effective command of English with occasional inaccuracies in unfamiliar situations, but generally strong handling of complex, academic language.',
    accessibility: 'IELTS 7.0 is commonly required for highly competitive or highly-ranked master\'s programmes, and for several professionally regulated fields — law, journalism, teaching/education, and some health and clinical subjects. It\'s also relevant beyond course entry: some professional registration bodies (for example, nursing regulators in several countries) require 7.0 or higher for post-graduation registration, sometimes with no individual section below 7.0 — a separate, often stricter bar than the course-entry requirement alone.',
    countryNotes: 'A 7.0 overall requirement doesn\'t automatically mean a top-20-ranked university — plenty of solid, mid-ranked programmes in competitive subjects also set their bar here. Course-entry IELTS and professional-registration IELTS (where relevant to your field) are two different thresholds — check both if you\'re heading into a regulated profession.',
  },
];

export function getIeltsBandGuideBySlug(slug: string): IeltsBandGuide | undefined {
  return IELTS_BAND_GUIDES.find(g => g.slug === slug);
}
