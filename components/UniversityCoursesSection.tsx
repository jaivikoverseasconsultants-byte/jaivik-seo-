'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { RegistryCourse } from '@/data/university-course-registry';

const PAGE_SIZE = 20;

type FilterLevel = 'All' | 'Undergraduate' | 'Postgraduate' | 'MBA' | 'PhD';

const LEVEL_STYLES: Record<string, string> = {
  PhD: 'bg-purple-100 text-purple-700',
  MBA: 'bg-amber-100 text-amber-700',
  Undergraduate: 'bg-blue-100 text-blue-700',
  Postgraduate: 'bg-green-100 text-green-700',
  Default: 'bg-gray-100 text-gray-600',
};

function normalizeFilterLevel(raw: string): Exclude<FilterLevel, 'All'> {
  const v = (raw || '').toLowerCase();
  if (/phd|doctorate|dphil/.test(v)) return 'PhD';
  if (/\bmba\b/.test(v)) return 'MBA';
  if (/undergraduate|bachelor|^b\.?sc|^beng|^b\.?a\.|^be\b|honours bachelor/.test(v)) return 'Undergraduate';
  return 'Postgraduate';
}

// ── Legacy helpers for popularCourses string fallback ────────────────────────

function deriveLevel(name: string): Exclude<FilterLevel, 'All'> {
  const n = name.toLowerCase();
  if (/phd|doctorate|d\.phil|dphil/.test(n)) return 'PhD';
  if (/\bmba\b|executive mba|master of business admin/.test(n)) return 'MBA';
  if (/^(bsc|ba\b|beng|bachelor|bba|be\b|llb|bfa|b\.a\.|b\.s\.|btech|b\.tech|honours bachelor|undergraduate)/.test(n)) return 'Undergraduate';
  if (/^(ms\b|msc|master|ma\b|mphil|mres|meng\b|llm|mpa|mfa|postgrad|pg\b|m\.s\.|m\.eng\.)/.test(n)) return 'Postgraduate';
  if (/bachelor|undergraduate|bsc|beng/.test(n)) return 'Undergraduate';
  if (/master|graduate|msc|mphil/.test(n)) return 'Postgraduate';
  return 'Postgraduate';
}

function deriveDuration(level: Exclude<FilterLevel, 'All'>): string {
  if (level === 'PhD') return '3–4 years';
  if (level === 'MBA') return '1–2 years';
  if (level === 'Undergraduate') return '3–4 years';
  return '1–2 years';
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// ── Props ──────────────────────────────────────────────────────────────────

interface Props {
  courses?: RegistryCourse[];
  popularCourses: string[];
  uniSlug: string;
  uniName: string;
  annualTuitionUSD: number;
  ieltsMin: number;
}

// ── Component ─────────────────────────────────────────────────────────────

export default function UniversityCoursesSection({
  courses,
  popularCourses,
  uniSlug,
  uniName,
  annualTuitionUSD,
  ieltsMin,
}: Props) {
  const [activeLevel, setActiveLevel] = useState<FilterLevel>('All');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // ── Build unified course list ─────────────────────────────────────────

  interface DisplayCourse {
    name: string;
    slug: string;
    filterLevel: Exclude<FilterLevel, 'All'>;
    displayLevel: string;
    duration: string;
    annualUSD: number;
    annualINR: number;
    ieltsMin: number;
  }

  const allCourses: DisplayCourse[] = (courses && courses.length > 0)
    ? courses.map(c => ({
        name: c.name,
        slug: c.slug,
        filterLevel: normalizeFilterLevel(c.level),
        displayLevel: c.level,
        duration: c.duration,
        annualUSD: c.annualUSD,
        annualINR: c.annualINR,
        ieltsMin: c.ieltsMin,
      }))
    : popularCourses.map(name => {
        const lv = deriveLevel(name);
        return {
          name,
          slug: toSlug(name),
          filterLevel: lv,
          displayLevel: lv,
          duration: deriveDuration(lv),
          annualUSD: annualTuitionUSD,
          annualINR: annualTuitionUSD * 84,
          ieltsMin,
        };
      });

  if (allCourses.length === 0) {
    return (
      <div className="bg-gray-50 rounded-2xl p-8 text-center">
        <p className="text-gray-500 text-sm mb-3">
          Contact our counsellors for the full course catalogue at {uniName}.
        </p>
        <Link href="/book-counselling" className="btn-primary text-sm inline-block">
          Get Free Course Guidance →
        </Link>
      </div>
    );
  }

  // ── Filter counts ──────────────────────────────────────────────────────

  const counts: Record<FilterLevel, number> = {
    All: allCourses.length,
    Undergraduate: allCourses.filter(c => c.filterLevel === 'Undergraduate').length,
    Postgraduate: allCourses.filter(c => c.filterLevel === 'Postgraduate').length,
    MBA: allCourses.filter(c => c.filterLevel === 'MBA').length,
    PhD: allCourses.filter(c => c.filterLevel === 'PhD').length,
  };

  const tabs = (['All', 'Undergraduate', 'Postgraduate', 'MBA', 'PhD'] as FilterLevel[]).filter(
    l => l === 'All' || counts[l] > 0
  );

  const filtered = activeLevel === 'All' ? allCourses : allCourses.filter(c => c.filterLevel === activeLevel);
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const isRich = !!(courses && courses.length > 0);

  const handleTabChange = (level: FilterLevel) => {
    setActiveLevel(level);
    setVisibleCount(PAGE_SIZE);
  };

  const formatFee = (c: DisplayCourse) => {
    if (!isRich) return `$${(annualTuitionUSD / 1000).toFixed(0)}K/yr`;
    if (c.annualUSD > 0) return `$${(c.annualUSD / 1000).toFixed(0)}K/yr`;
    return 'View page';
  };

  return (
    <div>
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="text-sm text-gray-500">
          {filtered.length} course{filtered.length !== 1 ? 's' : ''}{activeLevel !== 'All' ? ` · ${activeLevel}` : ''}
          {allCourses.length > filtered.length ? ` (of ${allCourses.length} total)` : ''}
        </p>
        <Link
          href={`/universities/${uniSlug}/courses`}
          className="text-xs text-brand-700 font-semibold hover:underline"
        >
          Full catalogue →
        </Link>
      </div>

      {/* Level filter tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {tabs.map(level => (
          <button
            key={level}
            onClick={() => handleTabChange(level)}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
              activeLevel === level
                ? 'bg-brand-700 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-brand-50 hover:text-brand-700'
            }`}
          >
            {level}
            {counts[level] > 0 && (
              <span className="ml-1 opacity-70">({counts[level]})</span>
            )}
          </button>
        ))}
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {visible.map(course => {
          const levelStyle = LEVEL_STYLES[course.filterLevel] || LEVEL_STYLES.Default;
          return (
            <Link
              key={course.slug + course.name}
              href={`/universities/${uniSlug}/courses/${course.slug}`}
              className="bg-gray-50 hover:bg-brand-50 rounded-xl p-4 border border-gray-100 hover:border-brand-200 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <p className="text-sm font-semibold text-gray-900 group-hover:text-brand-700 leading-snug line-clamp-2">
                  {course.name}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 font-medium ${levelStyle}`}>
                  {course.filterLevel}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-gray-400 mb-0.5">Duration</p>
                  <p className="font-semibold text-gray-700">{course.duration}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-0.5">Annual Fee</p>
                  <p className="font-semibold text-brand-700">{formatFee(course)}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-0.5">IELTS Min</p>
                  <p className="font-semibold text-gray-700">{course.ieltsMin}+</p>
                </div>
              </div>
              <p className="text-xs text-brand-600 font-semibold mt-3 group-hover:text-brand-800">
                View Details →
              </p>
            </Link>
          );
        })}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="mt-5 text-center">
          <button
            onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
            className="inline-flex items-center gap-2 bg-white border border-brand-200 text-brand-700 hover:bg-brand-50 font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            Load More Courses
            <span className="text-xs text-gray-400 font-normal">
              ({filtered.length - visibleCount} remaining)
            </span>
          </button>
        </div>
      )}

      {/* Browse all CTA */}
      <div className="mt-5 flex items-center justify-between bg-brand-50 rounded-xl p-4 border border-brand-100">
        <div>
          <p className="text-sm font-semibold text-brand-900">
            {allCourses.length} courses listed · {uniName}
          </p>
          <p className="text-xs text-brand-600 mt-0.5">
            Get personalised course matching from our counsellors
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Link
            href={`/universities/${uniSlug}/courses`}
            className="text-xs bg-brand-700 text-white px-3 py-2 rounded-lg font-semibold hover:bg-brand-800 transition-colors"
          >
            Browse All →
          </Link>
          <Link
            href="/book-counselling"
            className="text-xs bg-white text-brand-700 px-3 py-2 rounded-lg font-semibold border border-brand-200 hover:bg-brand-50 transition-colors"
          >
            Free Help
          </Link>
        </div>
      </div>
    </div>
  );
}
