import type { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { universities, countries } from '@/data/universities';
import { courses, courseCategories } from '@/data/courses';

const BASE = 'https://study.jaivikoverseasconsultants.com';

function loadCourses(file: string, exportName: string): { slug: string }[] {
  try { return (require(`@/data/${file}`) as Record<string, any>)[exportName] as { slug: string }[]; } catch { return []; }
}

// Complete registry: university directory slug → courses array
// Add a new entry here whenever a new university data file is created.
const COURSE_REGISTRY: Record<string, { slug: string }[]> = {
  // Australia
  'uts-sydney':                               loadCourses('uts-courses', 'utsCourses'),
  'charles-darwin-university':                loadCourses('cdu-courses', 'cduCourses'),
  'swinburne-university':                     loadCourses('swinburne-courses', 'swinburneCourses'),
  'kaplan-business-school':                   loadCourses('kaplan-courses', 'kaplanCourses'),
  'victoria-university-sydney':               loadCourses('vu-sydney-courses', 'vu_sydneyCourses'),
  'cquniversity':                             loadCourses('cqu-courses', 'cquCourses'),
  'jcu-brisbane':                             loadCourses('jcu-brisbane-courses', 'jcu_brisbaneCourses'),
  'murdoch-university':                       loadCourses('murdoch-courses', 'murdochCourses'),
  'flinders-university':                      loadCourses('flinders-courses', 'flindersCourses'),
  'griffith-university':                      loadCourses('griffith-courses', 'griffithCourses'),
  'la-trobe-university':                      loadCourses('latrobe-courses', 'latrobeCourses'),
  // UK
  'university-of-manchester':                 loadCourses('manchester-courses', 'manchesterCourses'),
  'university-of-birmingham':                 loadCourses('birmingham-courses', 'birminghamCourses'),
  'university-of-leeds':                      loadCourses('leeds-courses', 'leedsCourses'),
  'coventry-university':                      loadCourses('coventry-courses', 'coventryCourses'),
  'middlesex-university':                     loadCourses('middlesex-courses', 'middlesexCourses'),
  'brunel-university-london':                 loadCourses('brunel-courses', 'brunelCourses'),
  'university-of-hertfordshire':              loadCourses('hertfordshire-courses', 'hertfordshireCourses'),
  'anglia-ruskin-university':                 loadCourses('aru-courses', 'aruCourses'),
  'university-of-portsmouth':                 loadCourses('portsmouth-courses', 'portsmouthCourses'),
  'northumbria-university':                   loadCourses('northumbria-courses', 'northumbriaCourses'),
  'de-montfort-university':                   loadCourses('demontfort-courses', 'demontfortCourses'),
  'nottingham-trent-university':              loadCourses('nottinghamtrent-courses', 'nottinghamtrentCourses'),
  'university-of-west-london':                loadCourses('westlondon-courses', 'westlondonCourses'),
  // Canada
  'acadia-university':                        loadCourses('acadia-courses', 'acadiaCourses'),
  'algonquin-college':                        loadCourses('algonquin-courses', 'algonquinCourses'),
  'assiniboine-college':                      loadCourses('assiniboine-courses', 'assiniboineCourses'),
  'bow-valley-college':                       loadCourses('bow-valley-courses', 'bow_valleyCourses'),
  'brandon-university':                       loadCourses('brandon-university-courses', 'brandon_universityCourses'),
  'brock-university':                         loadCourses('brock-courses', 'brockCourses'),
  'cambrian-college':                         loadCourses('cambrian-courses', 'cambrianCourses'),
  'canadore-college':                         loadCourses('canadore-courses', 'canadoreCourses'),
  'cape-breton-university':                   loadCourses('cbu-courses', 'cbuCourses'),
  'capilano-university':                      loadCourses('capilano-courses', 'capilanoCourses'),
  'centennial-college':                       loadCourses('centennial-courses', 'centennialCourses'),
  'college-boreal':                           loadCourses('boreal-courses', 'borealCourses'),
  'college-of-the-rockies':                   loadCourses('college-of-rockies-courses', 'college_of_rockiesCourses'),
  'columbia-college':                         loadCourses('columbia-college-bc-courses', 'columbia_college_bcCourses'),
  'concordia-university-edmonton':            loadCourses('concordia-edmonton-courses', 'concordia_edmontonCourses'),
  'conestoga-college':                        loadCourses('conestoga-courses', 'conestogaCourses'),
  'confederation-college':                    loadCourses('confederation-courses', 'confederationCourses'),
  'dalhousie-university':                     loadCourses('dal-courses', 'dalCourses'),
  'douglas-college':                          loadCourses('douglas-courses', 'douglasCourses'),
  'durham-college':                           loadCourses('durham-courses', 'durhamCourses'),
  'fairleigh-dickinson-university-vancouver': loadCourses('fdu-vancouver-courses', 'fdu_vancouverCourses'),
  'fanshawe-college':                         loadCourses('fanshawe-courses', 'fanshaweCourses'),
  'first-nations-university':                 loadCourses('fnuniv-courses', 'fnunivCourses'),
  'fleming-college':                          loadCourses('fleming-courses', 'flemingCourses'),
  'george-brown-college':                     loadCourses('george-brown-courses', 'george_brownCourses'),
  'georgian-college':                         loadCourses('georgian-courses', 'georgianCourses'),
  'grande-prairie-regional-college':          loadCourses('gprc-courses', 'gprcCourses'),
  'holland-college':                          loadCourses('holland-courses', 'hollandCourses'),
  'humber-college':                           loadCourses('humber-courses', 'humberCourses'),
  'justice-institute-of-bc':                  loadCourses('jibc-courses', 'jibcCourses'),
  'kwantlen-polytechnic-university':          loadCourses('kpu-courses', 'kpuCourses'),
  'la-cite-college':                          loadCourses('la-cite-courses', 'la_citeCourses'),
  'lakehead-university':                      loadCourses('lakehead-courses', 'lakeheadCourses'),
  'lakeland-college':                         loadCourses('lakeland-college-courses', 'lakeland_collegeCourses'),
  'lambton-college':                          loadCourses('lambton-courses', 'lambtonCourses'),
  'langara-college':                          loadCourses('langara-courses', 'langaraCourses'),
  'laurentian-university':                    loadCourses('laurentian-courses', 'laurentianCourses'),
  'loyalist-college':                         loadCourses('loyalist-courses', 'loyalistCourses'),
  'macewan-university':                       loadCourses('macewan-courses', 'macewanCourses'),
  'medicine-hat-college':                     loadCourses('medicine-hat-courses', 'medicine_hatCourses'),
  'memorial-university':                      loadCourses('mun-courses', 'munCourses'),
  'mohawk-college':                           loadCourses('mohawk-courses', 'mohawkCourses'),
  'mount-allison-university':                 loadCourses('mount-allison-courses', 'mount_allisonCourses'),
  'nbcc':                                     loadCourses('nbcc-courses', 'nbccCourses'),
  'niagara-college':                          loadCourses('niagara-college-courses', 'niagara_collegeCourses'),
  'niagara-university':                       loadCourses('niagara-university-courses', 'niagara_universityCourses'),
  'norquest-college':                         loadCourses('norquest-courses', 'norquestCourses'),
  'north-island-college':                     loadCourses('north-island-courses', 'north_islandCourses'),
  'northern-college':                         loadCourses('northern-college-courses', 'northern_collegeCourses'),
  'nscc':                                     loadCourses('nscc-courses', 'nsccCourses'),
  'nyit-vancouver':                           loadCourses('nyit-vancouver-courses', 'nyit_vancouverCourses'),
  'okanagan-college':                         loadCourses('okanagan-courses', 'okanaganCourses'),
  'olds-college':                             loadCourses('olds-college-courses', 'olds_collegeCourses'),
  'ontario-tech-university':                  loadCourses('ontario-tech-courses', 'ontario_techCourses'),
  'portage-college':                          loadCourses('portage-college-courses', 'portage_collegeCourses'),
  'red-deer-polytechnic':                     loadCourses('red-deer-poly-courses', 'red_deer_polyCourses'),
  'red-river-college-polytechnic':            loadCourses('red-river-courses', 'red_riverCourses'),
  'royal-roads-university':                   loadCourses('royal-roads-courses', 'royal_roadsCourses'),
  'sait':                                     loadCourses('sait-courses', 'saitCourses'),
  'saskatchewan-polytechnic':                 loadCourses('sask-poly-courses', 'sask_polyCourses'),
  'sault-college':                            loadCourses('sault-college-courses', 'sault_collegeCourses'),
  'selkirk-college':                          loadCourses('selkirk-courses', 'selkirkCourses'),
  'seneca-polytechnic':                       loadCourses('seneca-courses', 'senecaCourses'),
  'sheridan-college':                         loadCourses('sheridan-courses', 'sheridanCourses'),
  'st-clair-college':                         loadCourses('st-clair-courses', 'st_clairCourses'),
  'st-lawrence-college':                      loadCourses('st-lawrence-courses', 'st_lawrenceCourses'),
  'st-thomas-university':                     loadCourses('st-thomas-courses', 'st_thomasCourses'),
  'thompson-rivers-university':               loadCourses('tru-courses', 'truCourses'),
  'toronto-metropolitan-university':          loadCourses('tmu-courses', 'tmuCourses'),
  'trent-university':                         loadCourses('trent-courses', 'trentCourses'),
  'university-canada-west':                   loadCourses('ucw-courses', 'ucwCourses'),
  'universite-de-moncton':                    loadCourses('umoncton-courses', 'umonctonCourses'),
  'university-of-lethbridge':                 loadCourses('u-lethbridge-courses', 'u_lethbridgeCourses'),
  'university-of-new-brunswick':              loadCourses('unb-courses', 'unbCourses'),
  'university-of-northern-bc':                loadCourses('unbc-courses', 'unbcCourses'),
  'university-of-ottawa':                     loadCourses('uottawa-courses', 'uottawaCourses'),
  'university-of-regina':                     loadCourses('ur-courses', 'urCourses'),
  'university-of-windsor':                    loadCourses('windsor-courses', 'windsorCourses'),
  'university-of-winnipeg':                   loadCourses('uwinnipeg-courses', 'uwinnipegCourses'),
  'upei':                                     loadCourses('upei-courses', 'upeiCourses'),
  'vancouver-community-college':              loadCourses('vcc-courses', 'vccCourses'),
  'wilfrid-laurier-university':               loadCourses('laurier-courses', 'laurierCourses'),
  'york-university':                          loadCourses('york-courses', 'yorkCourses'),
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                       lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/universities`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/courses`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/course-finder`,    lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/book-counselling`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ];

  const universityPages = universities.map(u => ({
    url: `${BASE}/universities/${u.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const countryPages = countries.map(c => ({
    url: `${BASE}/universities/country/${c.toLowerCase().replace(' ', '-')}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const coursePages = courses.map(c => ({
    url: `${BASE}/courses/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const categoryPages = courseCategories.map(cat => ({
    url: `${BASE}/courses/category/${encodeURIComponent(cat.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, 'and'))}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Auto-discover all university course index pages via filesystem scan.
  // Any new university directory with a courses/ subdirectory is included automatically.
  const appUniversitiesDir = path.join(process.cwd(), 'app', 'universities');
  const uniCourseIndexPages: MetadataRoute.Sitemap = fs
    .readdirSync(appUniversitiesDir, { withFileTypes: true })
    .filter(d =>
      d.isDirectory() &&
      !d.name.startsWith('[') &&
      fs.existsSync(path.join(appUniversitiesDir, d.name, 'courses'))
    )
    .map(d => ({
      url: `${BASE}/universities/${d.name}/courses`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  // Course detail pages from the registry above.
  const uniCourseDetailPages: MetadataRoute.Sitemap = Object.entries(COURSE_REGISTRY).flatMap(
    ([uniSlug, uniCourses]) =>
      uniCourses.map(c => ({
        url: `${BASE}/universities/${uniSlug}/courses/${c.slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
  );

  return [
    ...staticPages,
    ...universityPages,
    ...countryPages,
    ...coursePages,
    ...categoryPages,
    ...uniCourseIndexPages,
    ...uniCourseDetailPages,
  ];
}
