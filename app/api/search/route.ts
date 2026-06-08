import { NextRequest, NextResponse } from 'next/server';
import { universities } from '@/data/universities';
import COURSE_CATEGORIES from '@/data/course-categories';

const ALL_COUNTRIES = ['USA','UK','Canada','Australia','Germany','Ireland','Singapore','New Zealand','France','Netherlands','Sweden','UAE','Denmark','Italy','Spain'];

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.toLowerCase().trim() ?? '';
  if (q.length < 2) return NextResponse.json({ courseAtUni: [], categories: [], unis: [], countries: [] });

  // Primary: courses at specific universities (search popularCourses)
  const courseAtUni: { courseName: string; universityName: string; universitySlug: string; country: string; ielts: number; fee: number }[] = [];
  for (const u of universities) {
    const matched = u.popularCourses.filter(c => c.toLowerCase().includes(q));
    for (const courseName of matched.slice(0, 2)) {
      courseAtUni.push({
        courseName,
        universityName: u.name,
        universitySlug: u.slug,
        country: u.country,
        ielts: u.requirements.ieltsMin,
        fee: u.annualTuitionUSD,
      });
      if (courseAtUni.length >= 6) break;
    }
    if (courseAtUni.length >= 6) break;
  }

  // Secondary: course categories/streams
  const categories = COURSE_CATEGORIES
    .filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.keywords.some(k => k.toLowerCase().includes(q))
    )
    .slice(0, 4)
    .map(c => ({ name: c.name, slug: c.slug, emoji: c.emoji }));

  // Tertiary: universities (name/city match — NOT course match, that's already in courseAtUni)
  const unis = universities
    .filter(u => u.name.toLowerCase().includes(q) || u.city.toLowerCase().includes(q))
    .slice(0, 4)
    .map(u => ({ name: u.name, slug: u.slug, country: u.country, city: u.city }));

  const countries = ALL_COUNTRIES.filter(c => c.toLowerCase().includes(q)).slice(0, 3);

  return NextResponse.json({ courseAtUni, categories, unis, countries });
}
