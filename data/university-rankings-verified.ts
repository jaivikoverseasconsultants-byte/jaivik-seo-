// Manually verified QS World University Rankings — 2026-07-30.
// The pre-existing `qsRanking` field on every one of the 465 entries in
// data/universities.ts was never individually audited (only 7 profiles got a
// sourced check, in the 2026-07-13 cleanup). A live spot-check of 9
// universities against current QS reporting found 8 of 9 MISMATCHED the
// stale `qsRanking` value (see DATA-AUDIT.md "University rankings
// (2026-07-30)" for the full comparison table) — so that field cannot be
// trusted as-is. This file is the small, freshly-verified subset that a new
// "Rankings" section is allowed to read from; every other university
// intentionally shows no rankings section rather than repeat an unverified
// number.
//
// Employer-reputation sub-scores were investigated and could not be
// confidently sourced per-university from general search — QS publishes
// this as one component of the methodology, not as an easily-verifiable
// per-institution page — so it is omitted here rather than guessed.

export interface VerifiedRanking {
  universitySlug: string;
  qsWorldRank: number;
  rankingScope: string; // e.g. "QS World University Rankings 2026" or "QS Europe University Rankings 2026"
  sourceUrl: string;
  verifiedDate: string;
  confidence: 'high' | 'moderate'; // 'moderate' = single corroborating source, not an official university press release
}

export const verifiedRankings: VerifiedRanking[] = [
  {
    universitySlug: 'university-of-manchester',
    qsWorldRank: 35,
    rankingScope: 'QS World University Rankings 2026',
    sourceUrl: 'https://www.topuniversities.com/world-university-rankings/2026',
    verifiedDate: '2026-07-30',
    confidence: 'high',
  },
  {
    universitySlug: 'university-of-bristol',
    qsWorldRank: 51,
    rankingScope: 'QS World University Rankings 2026',
    sourceUrl: 'https://www.topuniversities.com/world-university-rankings/2026',
    verifiedDate: '2026-07-30',
    confidence: 'high',
  },
  {
    universitySlug: 'university-of-birmingham',
    qsWorldRank: 76,
    rankingScope: 'QS World University Rankings 2026',
    sourceUrl: 'https://www.topuniversities.com/world-university-rankings/2026',
    verifiedDate: '2026-07-30',
    confidence: 'high',
  },
  {
    universitySlug: 'university-of-leeds',
    qsWorldRank: 86,
    rankingScope: 'QS World University Rankings 2026',
    sourceUrl: 'https://www.topuniversities.com/world-university-rankings/2026',
    verifiedDate: '2026-07-30',
    confidence: 'high',
  },
  {
    universitySlug: 'mcgill-university',
    qsWorldRank: 27,
    rankingScope: 'QS World University Rankings 2026',
    sourceUrl: 'https://www.topuniversities.com/world-university-rankings/2026',
    verifiedDate: '2026-07-30',
    confidence: 'high',
  },
  {
    universitySlug: 'university-of-toronto',
    qsWorldRank: 29,
    rankingScope: 'QS World University Rankings 2026',
    sourceUrl: 'https://www.topuniversities.com/world-university-rankings/2026',
    verifiedDate: '2026-07-30',
    confidence: 'high',
  },
  {
    universitySlug: 'unsw-sydney',
    qsWorldRank: 20,
    rankingScope: 'QS World University Rankings 2026',
    sourceUrl: 'https://www.unsw.edu.au/newsroom/news/2025/06/unsw-sydney-maintains-top-20-spot-in-qs-world-university-rankings',
    verifiedDate: '2026-07-30',
    confidence: 'high',
  },
  {
    universitySlug: 'university-of-calgary',
    qsWorldRank: 211,
    rankingScope: 'QS World University Rankings 2025-2026',
    sourceUrl: 'https://www.topuniversities.com/universities/university-calgary',
    verifiedDate: '2026-07-30',
    confidence: 'moderate',
  },
  {
    universitySlug: 'coventry-university',
    qsWorldRank: 193,
    rankingScope: 'QS Europe University Rankings 2026 (not the QS World ranking)',
    sourceUrl: 'https://www.coventry.ac.uk/news/2026/qs-world-university-rankings/',
    verifiedDate: '2026-07-30',
    confidence: 'high',
  },
];

export function getVerifiedRanking(slug: string): VerifiedRanking | null {
  return verifiedRankings.find(r => r.universitySlug === slug) ?? null;
}
