import { NextRequest, NextResponse } from 'next/server';
import { universities } from '@/data/universities';
import COURSE_CATEGORIES from '@/data/course-categories';

const ALL_COUNTRIES = ['USA','UK','Canada','Australia','Germany','Ireland','Singapore','New Zealand','France','Netherlands','Sweden','UAE','Denmark','Italy','Spain'];

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.toLowerCase().trim() ?? '';
  if (q.length < 2) return NextResponse.json({ unis: [], courses: [], countries: [] });

  const unis = universities
    .filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.city.toLowerCase().includes(q) ||
      u.popularCourses.some(c => c.toLowerCase().includes(q))
    )
    .slice(0, 5)
    .map(u => ({ name: u.name, slug: u.slug, country: u.country, city: u.city }));

  const courses = COURSE_CATEGORIES
    .filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.keywords.some(k => k.toLowerCase().includes(q))
    )
    .slice(0, 5)
    .map(c => ({ name: c.name, slug: c.slug, emoji: c.emoji }));

  const countries = ALL_COUNTRIES
    .filter(c => c.toLowerCase().includes(q))
    .slice(0, 3);

  return NextResponse.json({ unis, courses, countries });
}
