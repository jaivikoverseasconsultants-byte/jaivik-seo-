import type { Metadata } from 'next';
import { getCostPillarBySlug } from '@/data/cost-pillars';
import { getTuitionStats, buildCostPillarMetadata } from '@/lib/cost-pillars';
import CostPillarPage from '@/components/CostPillarPage';

const SLUG = 'cost-of-studying-in-australia';

export async function generateMetadata(): Promise<Metadata> {
  const config = getCostPillarBySlug(SLUG)!;
  return buildCostPillarMetadata(config, getTuitionStats(config.registryCountry));
}

export default function Page() {
  const config = getCostPillarBySlug(SLUG)!;
  return <CostPillarPage config={config} />;
}
