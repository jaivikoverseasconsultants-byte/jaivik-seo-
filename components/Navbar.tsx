'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

const COUNTRIES = [
  { name: 'USA', flag: '🇺🇸', slug: 'usa' },
  { name: 'UK', flag: '🇬🇧', slug: 'uk' },
  { name: 'Canada', flag: '🇨🇦', slug: 'canada' },
  { name: 'Australia', flag: '🇦🇺', slug: 'australia' },
  { name: 'Germany', flag: '🇩🇪', slug: 'germany' },
  { name: 'Ireland', flag: '🇮🇪', slug: 'ireland' },
  { name: 'Singapore', flag: '🇸🇬', slug: 'singapore' },
  { name: 'New Zealand', flag: '🇳🇿', slug: 'new-zealand' },
  { name: 'France', flag: '🇫🇷', slug: 'france' },
  { name: 'Netherlands', flag: '🇳🇱', slug: 'netherlands' },
  { name: 'Sweden', flag: '🇸🇪', slug: 'sweden' },
  { name: 'UAE', flag: '🇦🇪', slug: 'uae' },
  { name: 'Denmark', flag: '🇩🇰', slug: 'denmark' },
  { name: 'Italy', flag: '🇮🇹', slug: 'italy' },
  { name: 'Spain', flag: '🇪🇸', slug: 'spain' },
];

const regularLinks = [
  { href: '/courses', label: 'Courses' },
  { href: '/find-my-course', label: 'Find My Course' },
  { href: '/scholarships', label: 'Scholarships' },
  { href: '/course-finder', label: 'Course Finder' },
  { href: '/blog', label: 'Blog' },
  { href: '/mock-test', label: 'IELTS Mock Test' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [uniMenuOpen, setUniMenuOpen] = useState(false);
  const [mobileUniOpen, setMobileUniOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close mega menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUniMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="bg-brand-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0" onClick={() => setMobileOpen(false)}>
            <img src="/joc-logo-circle.jpeg" alt="Jaivik Overseas Consultants" className="h-11 w-11 rounded-full" />
            <div className="leading-tight">
              <p className="font-bold text-sm">Jaivik Overseas</p>
              <p className="text-xs text-blue-300">Study Abroad Consultants</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" ref={menuRef}>

            {/* Universities — mega menu trigger */}
            <div className="relative">
              <button
                onMouseEnter={() => setUniMenuOpen(true)}
                onMouseLeave={() => setUniMenuOpen(false)}
                onClick={() => setUniMenuOpen(v => !v)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-100 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              >
                Universities
                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${uniMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Mega menu panel */}
              {uniMenuOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[540px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 z-50"
                  onMouseEnter={() => setUniMenuOpen(true)}
                  onMouseLeave={() => setUniMenuOpen(false)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Study Destinations</p>
                    <Link href="/universities" className="text-xs text-brand-700 font-semibold hover:underline" onClick={() => setUniMenuOpen(false)}>
                      View All →
                    </Link>
                  </div>

                  {/* Country grid */}
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {COUNTRIES.map(c => (
                      <Link
                        key={c.slug}
                        href={`/universities/country/${c.slug}`}
                        onClick={() => setUniMenuOpen(false)}
                        className="flex flex-col items-center gap-1 p-2.5 rounded-xl hover:bg-brand-50 hover:text-brand-700 transition-colors group text-center"
                      >
                        <span className="text-2xl">{c.flag}</span>
                        <span className="text-xs font-medium text-gray-700 group-hover:text-brand-700 leading-tight">{c.name}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Footer links */}
                  <div className="border-t border-gray-100 pt-3 grid grid-cols-3 gap-2">
                    <Link href="/universities" onClick={() => setUniMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 text-sm text-gray-700 hover:text-brand-700 font-medium transition-colors">
                      🏛️ All Universities
                    </Link>
                    <Link href="/find-my-course" onClick={() => setUniMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 text-sm text-gray-700 hover:text-brand-700 font-medium transition-colors">
                      🎯 Find My Course
                    </Link>
                    <Link href="/compare" onClick={() => setUniMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 text-sm text-gray-700 hover:text-brand-700 font-medium transition-colors">
                      ⚖️ Compare
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Regular links */}
            {regularLinks.map(l => (
              <Link key={l.href} href={l.href}
                className="px-3 py-2 text-sm font-medium text-blue-100 hover:text-white transition-colors rounded-lg hover:bg-white/10">
                {l.label}
              </Link>
            ))}

            <Link href="/book-counselling"
              className="ml-2 bg-gold-500 hover:bg-gold-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              Book Free Counselling
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10 py-3 space-y-0.5">
            {/* Universities with sub-menu */}
            <button
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-blue-100 hover:text-white font-medium"
              onClick={() => setMobileUniOpen(v => !v)}
            >
              Universities
              <svg className={`w-4 h-4 transition-transform ${mobileUniOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {mobileUniOpen && (
              <div className="mx-3 mb-2 bg-white/10 rounded-xl p-3">
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {COUNTRIES.map(c => (
                    <Link
                      key={c.slug}
                      href={`/universities/country/${c.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-1.5 text-xs text-blue-100 hover:text-white py-1"
                    >
                      <span>{c.flag}</span>
                      <span>{c.name}</span>
                    </Link>
                  ))}
                </div>
                <Link href="/universities" onClick={() => setMobileOpen(false)}
                  className="block text-xs text-gold-400 font-semibold pt-2 border-t border-white/10">
                  View All Universities →
                </Link>
              </div>
            )}

            {regularLinks.map(l => (
              <Link key={l.href} href={l.href}
                className="block px-3 py-2.5 text-sm text-blue-100 hover:text-white font-medium"
                onClick={() => setMobileOpen(false)}>
                {l.label}
              </Link>
            ))}

            <Link href="/book-counselling"
              className="block mx-3 mt-2 text-center py-2.5 bg-gold-500 hover:bg-gold-600 text-white text-sm font-semibold rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}>
              Book Free Counselling →
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
