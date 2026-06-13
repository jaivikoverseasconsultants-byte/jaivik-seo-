// Server-side course registry — maps university slugs to normalized course arrays.
// Used by the generic [slug]/page.tsx to pass rich course data to UniversityCoursesSection.
// This file is server-only (imported only in Server Components); it never ships to the client bundle.

import { utsCourses } from './uts-courses';
import { northumbriaCourses } from './northumbria-courses';
import { vu_sydneyCourses } from './vu-sydney-courses';
import { flindersCourses } from './flinders-courses';
import { aruCourses } from './aru-courses';
import { warwickCourses } from './warwick-courses';
import { middlesexCourses } from './middlesex-courses';
import { ubcCourses } from './ubc-courses';
import { leedsCourses } from './leeds-courses';
import { edinburghCourses } from './edinburgh-courses';
import { latrobeCourses } from './latrobe-courses';
import { monashCourses } from './monash-courses';
import { nusCourses } from './nus-courses';
import { birminghamCourses } from './birmingham-courses';
import { unswCourses } from './unsw-courses';
import { bristolCourses } from './bristol-courses';
import { sheffieldCourses } from './sheffield-courses';
import { nottmCourses } from './nottm-courses';
import { umichCourses } from './umich-courses';
import { uqCourses } from './uq-courses';
import { glasgowCourses } from './glasgow-courses';
import { ucdCourses } from './ucd-courses';
import { ntuCourses } from './ntu-courses';
import { ualbertaCourses } from './ualberta-courses';
import { sotonCourses } from './soton-courses';
import { nyuCourses } from './nyu-courses';
import { exeterCourses } from './exeter-courses';
import { uoftCourses } from './uoft-courses';
import { waterlooCourses } from './waterloo-courses';
import { buCourses } from './bu-courses';
import { manchesterCourses } from './manchester-courses';
import { pennstateCourses } from './penn-state-courses';
import { purdueCourses } from './purdue-courses';
import { griffithCourses } from './griffith-courses';
import { westernCourses } from './western-courses';
import { tcdCourses } from './tcd-courses';
import { macqCourses } from './macq-courses';
import { gatechCourses } from './gatech-courses';
import { lmuCourses } from './lmu-courses';
import { urCourses } from './ur-courses';
import { cquCourses } from './cqu-courses';
import { mcmasterCourses } from './mcmaster-courses';
import { uwaCourses } from './uwa-courses';
import { aucklandCourses } from './auckland-courses';
import { lseCourses } from './lse-courses';
import { lancsCourses } from './lancs-courses';
import { qmulCourses } from './qmul-courses';
import { yorkuniCourses } from './yorkuni-courses';
import { uoaCourses } from './uoa-courses';
import { kitCourses } from './kit-courses';
import { cardiffCourses } from './cardiff-courses';
import { kclCourses } from './kcl-courses';
import { nclCourses } from './ncl-courses';
import { bathCourses } from './bath-courses';
import { uclCourses } from './ucl-courses';
import { usydCourses } from './usyd-courses';
import { uonCourses } from './uon-courses';
import { anuCourses } from './anu-courses';
import { uccCourses } from './ucc-courses';
import { nuigCourses } from './nuig-courses';
import { durhamuniCourses } from './durhamuni-courses';
import { rwthCourses } from './rwth-courses';
import { jcu_brisbaneCourses } from './jcu-brisbane-courses';
import { dalCourses } from './dal-courses';
import { mcgillCourses } from './mcgill-courses';
import { windsorCourses } from './windsor-courses';
import { murdochCourses } from './murdoch-courses';
import { munCourses } from './mun-courses';
import { coventryCourses } from './coventry-courses';
import { brunelCourses } from './brunel-courses';
import { portsmouthCourses } from './portsmouth-courses';
import { nottinghamtrentCourses } from './nottinghamtrent-courses';
import { uottawaCourses } from './uottawa-courses';
import { unbCourses } from './unb-courses';
import { truCourses } from './tru-courses';
import { unbcCourses } from './unbc-courses';
import { yorkCourses } from './york-courses';
import { cduCourses } from './cdu-courses';
import { lundUniversityCourses } from './lund-university-courses';
import { universityOfAmsterdamCourses } from './university-of-amsterdam-courses';

export interface RegistryCourse {
  name: string;
  slug: string;
  level: string;
  duration: string;
  annualUSD: number;
  annualINR: number;
  ieltsMin: number;
  intakeMonths: string[];
}

function n(c: any): RegistryCourse {
  return {
    name: c.name ?? '',
    slug: c.slug ?? '',
    level: c.studyLevel || c.level || 'Postgraduate',
    duration: c.duration ?? '1–2 years',
    annualUSD: Number(c.annualUSD) || 0,
    annualINR: Number(c.annualINR) || 0,
    ieltsMin: Number(c.ieltsMin) || 6.0,
    intakeMonths: Array.isArray(c.intakeMonths) ? c.intakeMonths : ['September'],
  };
}

const REGISTRY: Record<string, readonly unknown[]> = {
  'uts-sydney': utsCourses,
  'charles-darwin-university': cduCourses,
  'northumbria-university': northumbriaCourses,
  'victoria-university-sydney': vu_sydneyCourses,
  'flinders-university': flindersCourses,
  'anglia-ruskin-university': aruCourses,
  'university-of-warwick': warwickCourses,
  'middlesex-university': middlesexCourses,
  'university-of-british-columbia': ubcCourses,
  'university-of-leeds': leedsCourses,
  'university-of-edinburgh': edinburghCourses,
  'la-trobe-university': latrobeCourses,
  'monash-university': monashCourses,
  'national-university-of-singapore': nusCourses,
  'university-of-birmingham': birminghamCourses,
  'unsw-sydney': unswCourses,
  'university-of-bristol': bristolCourses,
  'university-of-sheffield': sheffieldCourses,
  'university-of-nottingham': nottmCourses,
  'university-of-michigan': umichCourses,
  'university-of-queensland': uqCourses,
  'university-of-glasgow': glasgowCourses,
  'university-college-dublin': ucdCourses,
  'nanyang-technological-university': ntuCourses,
  'university-of-alberta': ualbertaCourses,
  'university-of-southampton': sotonCourses,
  'new-york-university': nyuCourses,
  'university-of-exeter': exeterCourses,
  'university-of-toronto': uoftCourses,
  'university-of-waterloo': waterlooCourses,
  'boston-university': buCourses,
  'university-of-manchester': manchesterCourses,
  'penn-state-university': pennstateCourses,
  'purdue-university': purdueCourses,
  'griffith-university': griffithCourses,
  'western-university': westernCourses,
  'trinity-college-dublin': tcdCourses,
  'macquarie-university': macqCourses,
  'georgia-tech': gatechCourses,
  'georgia-institute-of-technology': gatechCourses,
  'lmu-munich': lmuCourses,
  'university-of-regina': urCourses,
  'cquniversity': cquCourses,
  'mcmaster-university': mcmasterCourses,
  'university-of-western-australia': uwaCourses,
  'university-of-auckland': aucklandCourses,
  'london-school-of-economics': lseCourses,
  'lancaster-university': lancsCourses,
  'queen-mary-university-london': qmulCourses,
  'university-of-york': yorkuniCourses,
  'university-of-adelaide': uoaCourses,
  'karlsruhe-institute-of-technology': kitCourses,
  'cardiff-university': cardiffCourses,
  'kings-college-london': kclCourses,
  'newcastle-university': nclCourses,
  'university-of-bath': bathCourses,
  'university-college-london': uclCourses,
  'university-of-sydney': usydCourses,
  'university-of-newcastle-australia': uonCourses,
  'australian-national-university': anuCourses,
  'university-college-cork': uccCourses,
  'university-of-galway': nuigCourses,
  'durham-university': durhamuniCourses,
  'rwth-aachen-university': rwthCourses,
  'jcu-brisbane': jcu_brisbaneCourses,
  'dalhousie-university': dalCourses,
  'mcgill-university': mcgillCourses,
  'university-of-windsor': windsorCourses,
  'murdoch-university': murdochCourses,
  'memorial-university': munCourses,
  'coventry-university': coventryCourses,
  'brunel-university-london': brunelCourses,
  'university-of-portsmouth': portsmouthCourses,
  'nottingham-trent-university': nottinghamtrentCourses,
  'university-of-ottawa': uottawaCourses,
  'university-of-new-brunswick': unbCourses,
  'thompson-rivers-university': truCourses,
  'university-of-northern-bc': unbcCourses,
  'york-university': yorkCourses,
  'lund-university': lundUniversityCourses,
  'university-of-amsterdam': universityOfAmsterdamCourses,
};

export function getCoursesBySlug(slug: string): RegistryCourse[] {
  const raw = REGISTRY[slug];
  if (!raw || raw.length === 0) return [];
  return (raw as any[]).map(n);
}

export function findAlternativeCourses(
  fieldKeywords: string[],
  currentUniSlug: string,
  ieltsMax: number | undefined,
  limit = 2
): Array<RegistryCourse & { universitySlug: string }> {
  if (fieldKeywords.length === 0) return [];
  const results: Array<RegistryCourse & { universitySlug: string }> = [];
  const seenUnis = new Set<string>();

  for (const [slug, courses] of Object.entries(REGISTRY)) {
    if (slug === currentUniSlug || seenUnis.has(slug)) continue;
    for (const raw of courses as any[]) {
      const c = n(raw);
      if (ieltsMax !== undefined && c.ieltsMin > ieltsMax) continue;
      const nameLower = c.name.toLowerCase();
      if (!fieldKeywords.some(kw => nameLower.includes(kw))) continue;
      seenUnis.add(slug);
      results.push({ ...c, universitySlug: slug });
      break;
    }
    if (results.length >= limit) break;
  }
  return results;
}
