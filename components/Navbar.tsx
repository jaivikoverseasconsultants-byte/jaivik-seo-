'use client';

import Link from 'next/link';
import { useState } from 'react';

const navLinks = [
  { href: '/universities', label: 'Universities' },
  { href: '/courses', label: 'Courses' },
  { href: '/course-finder', label: 'Course Finder' },
  { href: '/compare', label: 'Compare Options' },
  { href: '/ielts-mock-test', label: 'IELTS Mock Test' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-brand-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <img src="/joc-logo-circle.jpeg" alt="Jaivik Overseas Consultants" className="h-12 w-12 rounded-full" />
            <div className="leading-tight">
              <p className="font-bold text-sm">Jaivik Overseas</p>
              <p className="text-xs text-blue-200">Study Abroad Consultants</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-5">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href}
                className="text-sm font-medium text-blue-100 hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
            <Link href="/book-counselling"
              className="bg-gold-500 hover:bg-gold-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              Book Free Counselling
            </Link>
          </nav>

          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-blue-700 py-3 space-y-1">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href}
                className="block px-2 py-2 text-sm text-blue-100 hover:text-white"
                onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link href="/book-counselling"
              className="block px-2 py-2 text-sm font-semibold text-gold-400"
              onClick={() => setOpen(false)}>
              Book Free Counselling →
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
