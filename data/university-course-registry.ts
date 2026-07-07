// Server-side course registry — maps university slugs to normalized course arrays.
// Used by the generic [slug]/page.tsx to pass rich course data to UniversityCoursesSection.
// This file is server-only (imported only in Server Components); it never ships to the client bundle.

import { aruCourses as m_anglia_ruskin_university } from './aru-courses';
import { assiniboineCourses as m_assiniboine_college } from './assiniboine-courses';
import { astonCourses as m_aston_university } from './aston-courses';
import { bangorCourses as m_bangor_university } from './bangor-courses';
import { bitsPilaniDubaiCourses as m_bits_pilani_dubai } from './bits-pilani-dubai-courses';
import { bocconiUniversityCourses as m_bocconi_university } from './bocconi-university-courses';
import { bondCourses as m_bond_university } from './bond-courses';
import { bmouthCourses as m_bournemouth_university } from './bmouth-courses';
import { cduCourses as m_charles_darwin_university } from './cdu-courses';
import { columbia_college_bcCourses as m_columbia_college } from './columbia-college-bc-courses';
import { concordiaCourses as m_concordia_university } from './concordia-courses';
import { coventryCourses as m_coventry_university } from './coventry-courses';
import { cquCourses as m_cquniversity } from './cqu-courses';
import { dalCourses as m_dalhousie_university } from './dal-courses';
import { demontfortCourses as m_de_montfort_university } from './demontfort-courses';
import { delftCourses as m_delft_university_of_technology } from './delft-courses';
import { dcuCourses as m_dublin_city_university } from './dcu-courses';
import { durhamuniCourses as m_durham_university } from './durhamuni-courses';
import { eindhovenCourses as m_eindhoven_university_of_technology } from './eindhoven-courses';
import { fdu_vancouverCourses as m_fairleigh_dickinson_university_vancouver } from './fdu-vancouver-courses';
import { flindersCourses as m_flinders_university } from './flinders-courses';
import { fuberlinCourses as m_free_university_of_berlin } from './fu-berlin-courses';
import { gatechCourses as m_georgia_institute_of_technology } from './gatech-courses';
import { griffithCourses as m_griffith_university } from './griffith-courses';
import { heriotWattUniversityDubaiCourses as m_heriot_watt_university_dubai } from './heriot-watt-university-dubai-courses';
import { humboldtCourses as m_humboldt_university_of_berlin } from './humboldt-courses';
import { jcu_brisbaneCourses as m_jcu_brisbane } from './jcu-brisbane-courses';
import { jibcCourses as m_justice_institute_of_bc } from './jibc-courses';
import { kaplanCourses as m_kaplan_business_school } from './kaplan-courses';
import { kclCourses as m_kings_college_london } from './kcl-courses';
import { kingstonCourses as m_kingston_university_london } from './kingston-courses';
import { laurentianCourses as m_laurentian_university } from './laurentian-courses';
import { leedsBeckettCourses as m_leeds_beckett_university } from './leeds-beckett-courses';
import { leidenUniversityCourses as m_leiden_university } from './leiden-university-courses';
import { ljmuCourses as m_liverpool_john_moores_university } from './ljmu-courses';
import { londonmetCourses as m_london_metropolitan_university } from './londonmet-courses';
import { lsbuCourses as m_london_south_bank_university } from './lsbu-courses';
import { lboroCourses as m_loughborough_university } from './lboro-courses';
import { maastrichtUniversityCourses as m_maastricht_university } from './maastricht-university-courses';
import { macqCourses as m_macquarie_university } from './macq-courses';
import { mcgillCourses as m_mcgill_university } from './mcgill-courses';
import { mcmasterCourses as m_mcmaster_university } from './mcmaster-courses';
import { middlesexCourses as m_middlesex_university } from './middlesex-courses';
import { murdochCourses as m_murdoch_university } from './murdoch-courses';
import { ntuCourses as m_nanyang_technological_university } from './ntu-courses';
import { nusCourses as m_national_university_of_singapore } from './nus-courses';
import { nclCourses as m_newcastle_university } from './ncl-courses';
import { niagara_universityCourses as m_niagara_university } from './niagara-university-courses';
import { northeasternCourses as m_northeastern_university } from './northeastern-courses';
import { northumbriaCourses as m_northumbria_university } from './northumbria-courses';
import { nottinghamtrentCourses as m_nottingham_trent_university } from './nottinghamtrent-courses';
import { nsccCourses as m_nscc } from './nscc-courses';
import { nyit_vancouverCourses as m_nyit_vancouver } from './nyit-vancouver-courses';
import { brookesCourses as m_oxford_brookes_university } from './brookes-courses';
import { purdueCourses as m_purdue_university } from './purdue-courses';
import { qmulCourses as m_queen_mary_university_london } from './qmul-courses';
import { queensCourses as m_queens_university } from './queens-courses';
import { ritDubaiCourses as m_rit_dubai } from './rit-dubai-courses';
import { rmitCourses as m_rmit_university } from './rmit-courses';
import { rguCourses as m_robert_gordon_university } from './rgu-courses';
import { rhulCourses as m_royal_holloway_university_london } from './rhul-courses';
import { sheffieldHallamCourses as m_sheffield_hallam_university } from './sheffield-hallam-courses';
import { sfuCourses as m_simon_fraser_university } from './sfu-courses';
import { swanseaCourses as m_swansea_university } from './swansea-courses';
import { swinburneCourses as m_swinburne_university } from './swinburne-courses';
import { tuMunichCourses as m_technical_university_of_munich } from './tu-munich-courses';
import { tcdCourses as m_trinity_college_dublin } from './tcd-courses';
import { ucdavisCourses as m_uc_davis } from './ucdavis-courses';
import { uiucCourses as m_uiuc_illinois } from './uiuc-courses';
import { umassAmherstCourses as m_umass_amherst } from './umass-courses';
import { uaeuniversityCourses as m_united_arab_emirates_university } from './uae-university-courses';
import { ucdCourses as m_university_college_dublin } from './ucd-courses';
import { uclCourses as m_university_college_london } from './ucl-courses';
import { adelaideCourses as m_university_of_adelaide } from './adelaide-courses';
import { universityOfAmsterdamCourses as m_university_of_amsterdam } from './university-of-amsterdam-courses';
import { aucklandCourses as m_university_of_auckland } from './auckland-courses';
import { bhamCourses as m_university_of_birmingham } from './bham-courses';
import { bathCourses as m_university_of_bath } from './bath-courses';
import { bristolCourses as m_university_of_bristol } from './bristol-courses';
import { ubcCourses as m_university_of_british_columbia } from './ubc-courses';
import { ucalgaryCourses as m_university_of_calgary } from './ucalgary-courses';
import { chesterCourses as m_university_of_chester } from './chester-courses';
import { universityOfCopenhagenCourses as m_university_of_copenhagen } from './university-of-copenhagen-courses';
import { derbyCourses as m_university_of_derby } from './derby-courses';
import { dundeeCourses as m_university_of_dundee } from './dundee-courses';
import { ueaCourses as m_university_of_east_anglia } from './uea-courses';
import { uelCourses as m_university_of_east_london } from './uel-courses';
import { edinburghCourses as m_university_of_edinburgh } from './edinburgh-courses';
import { exeterCourses as m_university_of_exeter } from './exeter-courses';
import { glasgowCourses as m_university_of_glasgow } from './glasgow-courses';
import { glosCourses as m_university_of_gloucestershire } from './glos-courses';
import { universityOfGroningenCourses as m_university_of_groningen } from './university-of-groningen-courses';
import { uguelphCourses as m_university_of_guelph } from './uguelph-courses';
import { uhamCourses as m_university_of_hamburg } from './uham-courses';
import { universityOfHelsinkiCourses as m_university_of_helsinki } from './university-of-helsinki-courses';
import { hertfordshireCourses as m_university_of_hertfordshire } from './hertfordshire-courses';
import { leedsCourses as m_university_of_leeds } from './leeds-courses';
import { manchesterCourses as m_university_of_manchester } from './manchester-courses';
import { umanitobaCourses as m_university_of_manitoba } from './umanitoba-courses';
import { uomCourses as m_university_of_melbourne } from './uom-courses';
import { unswCourses as m_university_of_new_south_wales } from './unsw-courses';
import { northamptonCourses as m_university_of_northampton } from './northampton-courses';
import { otagoCourses as m_university_of_otago } from './otago-courses';
import { uottawaCourses as m_university_of_ottawa } from './uottawa-courses';
import { portsmouthCourses as m_university_of_portsmouth } from './portsmouth-courses';
import { uqCourses as m_university_of_queensland } from './uq-courses';
import { rdgCourses as m_university_of_reading } from './rdg-courses';
import { roehamCourses as m_university_of_roehampton } from './roeham-courses';
import { sheffieldCourses as m_university_of_sheffield } from './sheffield-courses';
import { sotonCourses as m_university_of_southampton } from './soton-courses';
import { strathCourses as m_university_of_strathclyde } from './strath-courses';
import { suffolkCourses as m_university_of_suffolk } from './suffolk-courses';
import { sunderlandCourses as m_university_of_sunderland } from './sunderland-courses';
import { surreyCourses as m_university_of_surrey } from './surrey-courses';
import { usydCourses as m_university_of_sydney } from './usyd-courses';
import { uoftCourses as m_university_of_toronto } from './uoft-courses';
import { uvicCourses as m_university_of_victoria } from './uvic-courses';
import { warwickCourses as m_university_of_warwick } from './warwick-courses';
import { waterlooCourses as m_university_of_waterloo } from './waterloo-courses';
import { westlondonCourses as m_university_of_west_london } from './westlondon-courses';
import { uweCourses as m_university_of_west_of_england } from './uwe-courses';
import { uowCourses as m_university_of_wollongong } from './uow-courses';
import { yorkuniCourses as m_university_of_york } from './yorkuni-courses';
import { uppsalaUniversityCourses as m_uppsala_university } from './uppsala-university-courses';
import { utsCourses as m_uts_sydney } from './uts-courses';
import { victoriaCourses as m_victoria_university_of_wellington } from './victoria-courses';
import { vu_sydneyCourses as m_victoria_university_sydney } from './vu-sydney-courses';
import { vuwCourses as m_victoria_university_wellington } from './vuw-courses';
import { vrijeUniversiteitAmsterdamCourses as m_vrije_universiteit_amsterdam } from './vrije-universiteit-amsterdam-courses';

const REGISTRY: Record<string, readonly unknown[]> = {
  'anglia-ruskin-university': m_anglia_ruskin_university,
  'assiniboine-college': m_assiniboine_college,
  'aston-university': m_aston_university,
  'bangor-university': m_bangor_university,
  'bits-pilani-dubai': m_bits_pilani_dubai,
  'bocconi-university': m_bocconi_university,
  'bond-university': m_bond_university,
  'bournemouth-university': m_bournemouth_university,
  'charles-darwin-university': m_charles_darwin_university,
  'columbia-college': m_columbia_college,
  'concordia-university': m_concordia_university,
  'coventry-university': m_coventry_university,
  'cquniversity': m_cquniversity,
  'dalhousie-university': m_dalhousie_university,
  'de-montfort-university': m_de_montfort_university,
  'delft-university-of-technology': m_delft_university_of_technology,
  'dublin-city-university': m_dublin_city_university,
  'durham-university': m_durham_university,
  'eindhoven-university-of-technology': m_eindhoven_university_of_technology,
  'fairleigh-dickinson-university-vancouver': m_fairleigh_dickinson_university_vancouver,
  'flinders-university': m_flinders_university,
  'free-university-of-berlin': m_free_university_of_berlin,
  'georgia-institute-of-technology': m_georgia_institute_of_technology,
  'griffith-university': m_griffith_university,
  'heriot-watt-university-dubai': m_heriot_watt_university_dubai,
  'humboldt-university-of-berlin': m_humboldt_university_of_berlin,
  'jcu-brisbane': m_jcu_brisbane,
  'justice-institute-of-bc': m_justice_institute_of_bc,
  'kaplan-business-school': m_kaplan_business_school,
  'kings-college-london': m_kings_college_london,
  'kingston-university-london': m_kingston_university_london,
  'laurentian-university': m_laurentian_university,
  'leeds-beckett-university': m_leeds_beckett_university,
  'leiden-university': m_leiden_university,
  'liverpool-john-moores-university': m_liverpool_john_moores_university,
  'london-metropolitan-university': m_london_metropolitan_university,
  'london-south-bank-university': m_london_south_bank_university,
  'loughborough-university': m_loughborough_university,
  'maastricht-university': m_maastricht_university,
  'macquarie-university': m_macquarie_university,
  'mcgill-university': m_mcgill_university,
  'mcmaster-university': m_mcmaster_university,
  'middlesex-university': m_middlesex_university,
  'murdoch-university': m_murdoch_university,
  'nanyang-technological-university': m_nanyang_technological_university,
  'national-university-of-singapore': m_national_university_of_singapore,
  'newcastle-university': m_newcastle_university,
  'niagara-university': m_niagara_university,
  'northeastern-university': m_northeastern_university,
  'northumbria-university': m_northumbria_university,
  'nottingham-trent-university': m_nottingham_trent_university,
  'nscc': m_nscc,
  'nyit-vancouver': m_nyit_vancouver,
  'oxford-brookes-university': m_oxford_brookes_university,
  'purdue-university': m_purdue_university,
  'queen-mary-university-london': m_queen_mary_university_london,
  'queens-university': m_queens_university,
  'rit-dubai': m_rit_dubai,
  'rmit-university': m_rmit_university,
  'robert-gordon-university': m_robert_gordon_university,
  'royal-holloway-university-london': m_royal_holloway_university_london,
  'sheffield-hallam-university': m_sheffield_hallam_university,
  'simon-fraser-university': m_simon_fraser_university,
  'swansea-university': m_swansea_university,
  'swinburne-university': m_swinburne_university,
  'technical-university-of-munich': m_technical_university_of_munich,
  'trinity-college-dublin': m_trinity_college_dublin,
  'uc-davis': m_uc_davis,
  'uiuc-illinois': m_uiuc_illinois,
  'umass-amherst': m_umass_amherst,
  'united-arab-emirates-university': m_united_arab_emirates_university,
  'university-college-dublin': m_university_college_dublin,
  'university-college-london': m_university_college_london,
  'university-of-adelaide': m_university_of_adelaide,
  'university-of-amsterdam': m_university_of_amsterdam,
  'university-of-auckland': m_university_of_auckland,
  'university-of-birmingham': m_university_of_birmingham,
  'university-of-bath': m_university_of_bath,
  'university-of-bristol': m_university_of_bristol,
  'university-of-british-columbia': m_university_of_british_columbia,
  'university-of-calgary': m_university_of_calgary,
  'university-of-chester': m_university_of_chester,
  'university-of-copenhagen': m_university_of_copenhagen,
  'university-of-derby': m_university_of_derby,
  'university-of-dundee': m_university_of_dundee,
  'university-of-east-anglia': m_university_of_east_anglia,
  'university-of-east-london': m_university_of_east_london,
  'university-of-edinburgh': m_university_of_edinburgh,
  'university-of-exeter': m_university_of_exeter,
  'university-of-glasgow': m_university_of_glasgow,
  'university-of-gloucestershire': m_university_of_gloucestershire,
  'university-of-groningen': m_university_of_groningen,
  'university-of-guelph': m_university_of_guelph,
  'university-of-hamburg': m_university_of_hamburg,
  'university-of-helsinki': m_university_of_helsinki,
  'university-of-hertfordshire': m_university_of_hertfordshire,
  'university-of-leeds': m_university_of_leeds,
  'university-of-manchester': m_university_of_manchester,
  'university-of-manitoba': m_university_of_manitoba,
  'university-of-melbourne': m_university_of_melbourne,
  'university-of-new-south-wales': m_university_of_new_south_wales,
  'university-of-northampton': m_university_of_northampton,
  'university-of-otago': m_university_of_otago,
  'university-of-ottawa': m_university_of_ottawa,
  'university-of-portsmouth': m_university_of_portsmouth,
  'university-of-queensland': m_university_of_queensland,
  'university-of-reading': m_university_of_reading,
  'university-of-roehampton': m_university_of_roehampton,
  'university-of-sheffield': m_university_of_sheffield,
  'university-of-southampton': m_university_of_southampton,
  'university-of-strathclyde': m_university_of_strathclyde,
  'university-of-suffolk': m_university_of_suffolk,
  'university-of-sunderland': m_university_of_sunderland,
  'university-of-surrey': m_university_of_surrey,
  'university-of-sydney': m_university_of_sydney,
  'university-of-toronto': m_university_of_toronto,
  'university-of-victoria': m_university_of_victoria,
  'university-of-warwick': m_university_of_warwick,
  'university-of-waterloo': m_university_of_waterloo,
  'university-of-west-london': m_university_of_west_london,
  'university-of-west-of-england': m_university_of_west_of_england,
  'university-of-wollongong': m_university_of_wollongong,
  'university-of-york': m_university_of_york,
  'uppsala-university': m_uppsala_university,
  'uts-sydney': m_uts_sydney,
  'victoria-university-of-wellington': m_victoria_university_of_wellington,
  'victoria-university-sydney': m_victoria_university_sydney,
  'victoria-university-wellington': m_victoria_university_wellington,
  'vrije-universiteit-amsterdam': m_vrije_universiteit_amsterdam,
};

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



/** Returns a lightweight slug→courseNames map for client-side search. */
export function getCourseIndex(): Record<string, string[]> {
  const index: Record<string, string[]> = {};
  for (const [slug, courses] of Object.entries(REGISTRY)) {
    index[slug] = (courses as any[]).map((c: any) => c.name ?? '').filter(Boolean);
  }
  return index;
}

export interface CourseSearchEntry {
  name: string;
  slug: string;
  level: string;        // 'UG' | 'PG' | 'MBA' | 'PhD'
  universitySlug: string;
}

export function classifyLevel(name: string, studyLevelRaw = '', levelRaw = ''): string {
  const n = name.toLowerCase();
  const sl = (studyLevelRaw + ' ' + levelRaw).toLowerCase();
  if (/^(phd|dphil|doctorate)/.test(n) || sl.includes('phd') || sl.includes('doctoral')) return 'PhD';
  if (/\bmba\b/.test(n) || sl.includes('mba')) return 'MBA';
  if (
    /^(bsc|beng|ba |bed |barch|bcom|bba|bhsc|bbus|bfin|blaw|bmus|bfa|bachelor|b\.sc|b\.eng)/.test(n) ||
    sl.includes('bachelor') || sl.includes('undergraduate')
  ) return 'UG';
  return 'PG';
}

let _searchCache: CourseSearchEntry[] | null = null;

/** Flat list of every course in the registry — used by the search API. */
export function getCourseSearchEntries(): CourseSearchEntry[] {
  if (_searchCache) return _searchCache;
  const entries: CourseSearchEntry[] = [];
  for (const [uniSlug, courses] of Object.entries(REGISTRY)) {
    for (const raw of courses as any[]) {
      const name: string = raw.name ?? '';
      if (!name) continue;
      entries.push({
        name,
        slug: raw.slug ?? '',
        level: classifyLevel(name, raw.studyLevel ?? '', raw.level ?? ''),
        universitySlug: uniSlug,
      });
    }
  }
  _searchCache = entries;
  return entries;
}

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
