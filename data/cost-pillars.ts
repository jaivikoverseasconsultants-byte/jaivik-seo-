// Cost-of-studying pillar pages (2026-07-17) — the only 3 countries where we
// have BOTH real tuition data (getAllRealCourses()) AND real cost-of-living
// data (data/cost-of-living.ts's costOfLivingGuides). Real-data-only,
// skip-on-missing: a 4th country never gets added here without both sources.

export interface CostPillarConfig {
  slug: string; // route slug, e.g. 'cost-of-studying-in-uk'
  displayName: string; // 'UK'
  flagEmoji: string;
  registryCountry: string; // matches RealCourseEntry.country (post COUNTRY_NORM)
  costGuideSlug: string; // matches CostOfLivingGuide.slug in data/cost-of-living.ts
  cheapestHubSlug: string; // matches the /cheapest-universities-<slug> hub
  pswHubSlug?: string; // matches /courses-with-psw/<slug>, if that country is PSW-eligible
  budgetCountrySlug: string; // matches /<slug>-under-<band>-lakh
}

export const COST_PILLARS: CostPillarConfig[] = [
  {
    slug: 'cost-of-studying-in-uk',
    displayName: 'UK',
    flagEmoji: '🇬🇧',
    registryCountry: 'UK',
    costGuideSlug: 'uk',
    cheapestHubSlug: 'uk',
    pswHubSlug: 'uk',
    budgetCountrySlug: 'uk',
  },
  {
    slug: 'cost-of-studying-in-australia',
    displayName: 'Australia',
    flagEmoji: '🇦🇺',
    registryCountry: 'Australia',
    costGuideSlug: 'australia',
    cheapestHubSlug: 'australia',
    pswHubSlug: 'australia',
    budgetCountrySlug: 'australia',
  },
  {
    slug: 'cost-of-studying-in-canada',
    displayName: 'Canada',
    flagEmoji: '🇨🇦',
    registryCountry: 'Canada',
    costGuideSlug: 'canada',
    cheapestHubSlug: 'canada',
    pswHubSlug: 'canada',
    budgetCountrySlug: 'canada',
  },
];

export function getCostPillarBySlug(slug: string): CostPillarConfig | undefined {
  return COST_PILLARS.find(p => p.slug === slug);
}

/** The cost pillar (if any) covering a given registry country string — used by
 * subject pillars / country hub to cross-link only where real data supports it. */
export function getCostPillarForCountry(registryCountry: string): CostPillarConfig | undefined {
  return COST_PILLARS.find(p => p.registryCountry === registryCountry);
}
