import { NextRequest, NextResponse } from 'next/server';
import { universities } from '@/data/universities';
import { getCourseSearchEntries, classifyLevel } from '@/data/university-course-registry';
import COURSE_CATEGORIES from '@/data/course-categories';

const ALL_COUNTRIES = ['USA','UK','Canada','Australia','Germany','Ireland','Singapore','New Zealand','France','Netherlands','Sweden','UAE','Denmark','Italy','Spain'];

// ── Synonym expansion ────────────────────────────────────────────────────────
const SEARCH_SYNONYMS: Record<string, string[]> = {
  'energy': ['energy systems', 'energy engineering', 'power engineering', 'sustainable resource', 'environmental engineering', 'renewable'],
  'renewable energy': ['energy systems', 'sustainable resource', 'power engineering', 'environmental engineering', 'energy engineering', 'renewable energy'],
  'digital marketing': ['marketing', 'business analytics', 'media management', 'digital communications'],
  'human resources': ['human resource', 'organisational', 'organizational', 'people management', 'hr management'],
  'human resource': ['human resources', 'organisational', 'organizational', 'people management', 'hr management'],
  'human resource management': ['human resources', 'organisational', 'organizational', 'people management'],
  'cybersecurity': ['cyber security', 'information security', 'network security', 'computer security', 'cyber'],
  'supply chain': ['logistics', 'operations management', 'procurement', 'supply chain management'],
  'supply chain management': ['logistics', 'operations management', 'procurement'],
  'healthcare': ['health management', 'public health', 'biomedical', 'health informatics'],
  'healthcare management': ['health management', 'public health', 'health informatics', 'health sciences'],
  'artificial intelligence': ['machine learning', 'data science', 'deep learning', 'neural networks'],
  'finance': ['financial', 'accounting', 'economics', 'banking'],
  'construction management': ['civil engineering', 'project management', 'structural engineering', 'quantity surveying'],
  'construction': ['civil engineering', 'structural engineering', 'quantity surveying', 'architecture'],
  'ux design': ['human computer interaction', 'interaction design', 'product design', 'user experience', 'hci'],
  'strength conditioning': ['sports science', 'exercise science', 'kinesiology', 'sport and exercise'],
  'strength & conditioning': ['sports science', 'exercise science', 'kinesiology', 'sport and exercise'],
};

function getSearchTerms(raw: string): string[] {
  const q = raw.toLowerCase().trim();
  const terms = new Set<string>([q]);
  for (const [key, syns] of Object.entries(SEARCH_SYNONYMS)) {
    if (q === key || q.includes(key) || key.includes(q)) {
      syns.forEach(s => terms.add(s));
    }
  }
  return Array.from(terms);
}

// ── Module-level caches (built once per worker) ───────────────────────────────
const uniMap = Object.fromEntries(universities.map(u => [u.slug, u]));
let _registrySlugs: Set<string> | null = null;
let _corpus: Array<{ name: string; uniSlug: string; level: string }> | null = null;

function getCorpus() {
  if (_corpus) return _corpus;

  const corpus: Array<{ name: string; uniSlug: string; level: string }> = [];
  const registrySlugs = new Set<string>();

  // Full catalog from registry (~8k entries across ~80 unis)
  for (const entry of getCourseSearchEntries()) {
    registrySlugs.add(entry.universitySlug);
    corpus.push({ name: entry.name, uniSlug: entry.universitySlug, level: entry.level });
  }

  // popularCourses for unis NOT in registry (remaining ~300+ unis)
  for (const u of universities) {
    if (registrySlugs.has(u.slug)) continue;
    for (const cn of u.popularCourses) {
      corpus.push({ name: cn, uniSlug: u.slug, level: classifyLevel(cn) });
    }
  }

  _registrySlugs = registrySlugs;
  _corpus = corpus;
  return corpus;
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (raw.length < 2) {
    return NextResponse.json({ courseAtUni: [], categories: [], unis: [], countries: [], total: 0 });
  }

  const q = raw.toLowerCase();
  const searchTerms = getSearchTerms(q);
  const corpus = getCorpus();

  // ── Course results (up to 10) ──────────────────────────────────────────────
  type CourseResult = {
    courseName: string;
    universityName: string;
    universitySlug: string;
    country: string;
    ielts: number;
    fee: number;
    level: string;
  };
  const courseAtUni: CourseResult[] = [];
  const seenKeys = new Set<string>();

  // Pass 1: exact query match (highest relevance)
  for (const entry of corpus) {
    if (courseAtUni.length >= 10) break;
    if (!entry.name.toLowerCase().includes(q)) continue;
    const uni = uniMap[entry.uniSlug];
    if (!uni) continue;
    const key = `${entry.uniSlug}::${entry.name}`;
    if (seenKeys.has(key)) continue;
    seenKeys.add(key);
    courseAtUni.push({
      courseName: entry.name,
      universityName: uni.shortName ?? uni.name,
      universitySlug: entry.uniSlug,
      country: uni.country,
      ielts: uni.requirements.ieltsMin,
      fee: uni.annualTuitionUSD,
      level: entry.level,
    });
  }

  // Pass 2: synonym matches (fill remaining slots up to 10)
  if (courseAtUni.length < 10 && searchTerms.length > 1) {
    for (const term of searchTerms.slice(1)) {
      for (const entry of corpus) {
        if (courseAtUni.length >= 10) break;
        if (!entry.name.toLowerCase().includes(term)) continue;
        const uni = uniMap[entry.uniSlug];
        if (!uni) continue;
        const key = `${entry.uniSlug}::${entry.name}`;
        if (seenKeys.has(key)) continue;
        seenKeys.add(key);
        courseAtUni.push({
          courseName: entry.name,
          universityName: uni.shortName ?? uni.name,
          universitySlug: entry.uniSlug,
          country: uni.country,
          ielts: uni.requirements.ieltsMin,
          fee: uni.annualTuitionUSD,
          level: entry.level,
        });
      }
      if (courseAtUni.length >= 10) break;
    }
  }

  // ── Course categories / streams ────────────────────────────────────────────
  const categories = COURSE_CATEGORIES
    .filter((c: { name: string; keywords: string[]; slug: string; emoji: string }) =>
      c.name.toLowerCase().includes(q) ||
      c.keywords.some((k: string) => k.toLowerCase().includes(q))
    )
    .slice(0, 4)
    .map((c: { name: string; slug: string; emoji: string }) => ({ name: c.name, slug: c.slug, emoji: c.emoji }));

  // ── Universities (name/shortName/city match) ───────────────────────────────
  const unis = universities
    .filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.shortName.toLowerCase().includes(q) ||
      u.city.toLowerCase().includes(q)
    )
    .slice(0, 5)
    .map(u => ({ name: u.name, slug: u.slug, country: u.country, city: u.city }));

  // ── Countries ──────────────────────────────────────────────────────────────
  const countries = ALL_COUNTRIES.filter(c => c.toLowerCase().includes(q)).slice(0, 3);

  const total = courseAtUni.length + categories.length + unis.length + countries.length;

  return NextResponse.json({ courseAtUni, categories, unis, countries, total });
}
