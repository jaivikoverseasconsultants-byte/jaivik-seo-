'use client';

import Link from 'next/link';
import { useState, useRef, useCallback } from 'react';

// ─── Data ────────────────────────────────────────────────────────────────────

const COUNTRIES = [
  { name: 'USA',         flag: '🇺🇸', slug: 'usa',         unis: '80+' },
  { name: 'UK',          flag: '🇬🇧', slug: 'uk',          unis: '30+' },
  { name: 'Canada',      flag: '🇨🇦', slug: 'canada',      unis: '90+' },
  { name: 'Australia',   flag: '🇦🇺', slug: 'australia',   unis: '20+' },
  { name: 'Germany',     flag: '🇩🇪', slug: 'germany',     unis: '15+' },
  { name: 'Ireland',     flag: '🇮🇪', slug: 'ireland',     unis: '10+' },
  { name: 'Singapore',   flag: '🇸🇬', slug: 'singapore',   unis: '8+'  },
  { name: 'New Zealand', flag: '🇳🇿', slug: 'new-zealand', unis: '8+'  },
  { name: 'France',      flag: '🇫🇷', slug: 'france',      unis: '10+' },
  { name: 'Netherlands', flag: '🇳🇱', slug: 'netherlands', unis: '8+'  },
  { name: 'Sweden',      flag: '🇸🇪', slug: 'sweden',      unis: '6+'  },
  { name: 'UAE',         flag: '🇦🇪', slug: 'uae',         unis: '8+'  },
  { name: 'Denmark',     flag: '🇩🇰', slug: 'denmark',     unis: '5+'  },
  { name: 'Italy',       flag: '🇮🇹', slug: 'italy',       unis: '6+'  },
  { name: 'Spain',       flag: '🇪🇸', slug: 'spain',       unis: '5+'  },
];

const COURSE_LEVELS = [
  { label: 'Undergraduate', icon: '📘', desc: 'Bachelor\'s (3–4 yrs)', href: '/courses?level=undergraduate' },
  { label: 'Postgraduate',  icon: '📗', desc: 'Master\'s (1–2 yrs)',   href: '/courses?level=postgraduate' },
  { label: 'MBA / PGDM',    icon: '💼', desc: 'Business degrees',      href: '/courses?level=mba' },
  { label: 'PhD / Research',icon: '🔬', desc: 'Doctoral (3–5 yrs)',    href: '/courses?level=phd' },
  { label: 'PG Diploma',    icon: '📋', desc: 'Short programmes',      href: '/courses?level=diploma' },
];

const COURSE_STREAMS = [
  { label: 'Computer Science', icon: '💻', href: '/courses/ms-computer-science' },
  { label: 'Data Science & AI', icon: '🤖', href: '/courses/ms-data-science' },
  { label: 'Business & MBA',    icon: '📊', href: '/courses/mba-master-of-business-administration' },
  { label: 'Engineering',       icon: '⚙️', href: '/courses?stream=engineering' },
  { label: 'Law & LLM',         icon: '⚖️', href: '/courses/llm-master-of-laws' },
  { label: 'Health Sciences',   icon: '🏥', href: '/courses?stream=health' },
  { label: 'Finance',           icon: '💰', href: '/courses/ms-finance' },
  { label: 'Media & Design',    icon: '🎨', href: '/courses?stream=media' },
];

const IELTS_LEVELS = [
  { key: 'beginner',     label: 'Beginner',     band: 'Band 4.0–5.5', icon: '🌱', color: 'text-green-400' },
  { key: 'intermediate', label: 'Intermediate', band: 'Band 5.5–7.0', icon: '📈', color: 'text-blue-400'  },
  { key: 'advanced',     label: 'Advanced',     band: 'Band 7.0–9.0', icon: '🏆', color: 'text-purple-400' },
];

const IELTS_SECTIONS = [
  { key: 'full',     label: 'Full Test',  icon: '📋', time: '2h 45min' },
  { key: 'reading',  label: 'Reading',    icon: '📖', time: '60 min'   },
  { key: 'listening',label: 'Listening',  icon: '🎧', time: '30 min'   },
  { key: 'writing',  label: 'Writing',    icon: '✍️',  time: '60 min'   },
  { key: 'speaking', label: 'Speaking',   icon: '🎤', time: '14 min'   },
];

const TOOLS_GUIDES = [
  { label: 'Find My Course',    icon: '🎯', href: '/find-my-course',                    gold: true  },
  { label: 'Low Budget Guide',  icon: '💰', href: '/scholarships-and-low-budget-guide', gold: false },
  { label: 'Scholarships',      icon: '🎓', href: '/scholarships',                      gold: false },
];

const SIMPLE_LINKS = [
  { href: '/blog', label: 'Blog' },
];

// ─── Component ───────────────────────────────────────────────────────────────

type MenuKey = 'universities' | 'courses' | 'exams' | '';

export default function Navbar() {
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [activeMenu, setActiveMenu]       = useState<MenuKey>('');
  const [mobileExpanded, setMobileExpanded] = useState<string>('');
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = useCallback((key: MenuKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(key);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveMenu(''), 120);
  }, []);

  const closeAll = () => { setActiveMenu(''); setMobileOpen(false); };

  // ── Mega menu panel wrapper ────────────────────────────────────────────────
  const MegaPanel = ({
    id, children, wide = false,
  }: { id: MenuKey; children: React.ReactNode; wide?: boolean }) => (
    <div
      onMouseEnter={() => openMenu(id)}
      onMouseLeave={scheduleClose}
      className={[
        'absolute top-[calc(100%+4px)] left-1/2 -translate-x-1/2',
        'rounded-2xl border border-white/10 shadow-2xl z-50',
        'transition-all duration-200 origin-top',
        wide ? 'w-[620px]' : 'w-[540px]',
        // dark navy panel
        'bg-[#0d1b2e]',
        activeMenu === id
          ? 'opacity-100 scale-y-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 scale-y-95 -translate-y-1 pointer-events-none',
      ].join(' ')}
    >
      {children}
    </div>
  );

  return (
    <header className="bg-[#0a1628] text-white shadow-xl sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0" onClick={closeAll}>
            <img src="/joc-logo-circle.jpeg" alt="Jaivik Overseas Consultants" className="h-10 w-10 rounded-full ring-2 ring-gold-500/40" />
            <div className="leading-tight">
              <p className="font-bold text-sm tracking-tight">Jaivik Overseas</p>
              <p className="text-[10px] text-blue-300/80 tracking-wide uppercase">Study Abroad Consultants</p>
            </div>
          </Link>

          {/* ── Desktop nav ──────────────────────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-0.5">

            {/* UNIVERSITIES mega trigger */}
            <div className="relative"
              onMouseEnter={() => openMenu('universities')}
              onMouseLeave={scheduleClose}>
              <button className={navBtn(activeMenu === 'universities')}>
                Universities
                <Chevron open={activeMenu === 'universities'} />
              </button>

              <MegaPanel id="universities" wide>
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-bold text-blue-400/70 uppercase tracking-widest">Study Destinations</p>
                    <Link href="/universities" onClick={closeAll}
                      className="text-xs text-gold-400 hover:text-gold-300 font-semibold flex items-center gap-1 transition-colors">
                      All Universities →
                    </Link>
                  </div>

                  {/* 5-col country grid */}
                  <div className="grid grid-cols-5 gap-1.5 mb-5">
                    {COUNTRIES.map(c => (
                      <Link key={c.slug} href={`/universities/country/${c.slug}`} onClick={closeAll}
                        className="group flex flex-col items-center gap-1 p-2.5 rounded-xl hover:bg-white/8 transition-all">
                        <span className="text-[26px] leading-none group-hover:scale-110 transition-transform duration-150">{c.flag}</span>
                        <span className="text-[11px] font-semibold text-white/80 group-hover:text-white text-center leading-tight">{c.name}</span>
                        <span className="text-[10px] text-blue-400/60">{c.unis} unis</span>
                      </Link>
                    ))}
                  </div>

                  {/* Footer quick links */}
                  <div className="border-t border-white/8 pt-3 grid grid-cols-3 gap-2">
                    {[
                      { href: '/universities',    label: '🏛️ All Universities' },
                      { href: '/find-my-course',  label: '🎯 Find My Course'   },
                      { href: '/compare',         label: '⚖️ Compare Options'  },
                    ].map(l => (
                      <Link key={l.href} href={l.href} onClick={closeAll}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white/8 text-xs text-white/70 hover:text-white font-medium transition-all">
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </MegaPanel>
            </div>

            {/* COURSES mega trigger */}
            <div className="relative"
              onMouseEnter={() => openMenu('courses')}
              onMouseLeave={scheduleClose}>
              <button className={navBtn(activeMenu === 'courses')}>
                Courses
                <Chevron open={activeMenu === 'courses'} />
              </button>

              <MegaPanel id="courses" wide>
                <div className="p-5">
                  <div className="grid grid-cols-2 gap-6">
                    {/* By Level */}
                    <div>
                      <p className="text-[10px] font-bold text-blue-400/70 uppercase tracking-widest mb-3">By Level</p>
                      <div className="space-y-0.5">
                        {COURSE_LEVELS.map(l => (
                          <Link key={l.href} href={l.href} onClick={closeAll}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/8 group transition-all">
                            <span className="text-base w-6 text-center">{l.icon}</span>
                            <div>
                              <p className="text-sm font-semibold text-white/85 group-hover:text-white leading-tight">{l.label}</p>
                              <p className="text-[11px] text-blue-400/60">{l.desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* By Stream */}
                    <div>
                      <p className="text-[10px] font-bold text-blue-400/70 uppercase tracking-widest mb-3">By Stream</p>
                      <div className="grid grid-cols-2 gap-0.5">
                        {COURSE_STREAMS.map(s => (
                          <Link key={s.href} href={s.href} onClick={closeAll}
                            className="flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-white/8 group transition-all">
                            <span className="text-sm">{s.icon}</span>
                            <span className="text-xs font-medium text-white/80 group-hover:text-white leading-tight">{s.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tools & Guides */}
                  <div className="border-t border-white/8 pt-3 mt-4">
                    <p className="text-[10px] font-bold text-blue-400/70 uppercase tracking-widest mb-2">Tools &amp; Guides</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {TOOLS_GUIDES.map(t => (
                        <Link key={t.href} href={t.href} onClick={closeAll}
                          className={[
                            'flex items-center gap-2 px-3 py-2 rounded-xl transition-all group',
                            t.gold
                              ? 'border border-gold-500/30 hover:border-gold-500/60 hover:bg-gold-500/10'
                              : 'hover:bg-white/8',
                          ].join(' ')}>
                          <span className="text-sm">{t.icon}</span>
                          <span className={`text-xs font-semibold leading-tight ${t.gold ? 'text-gold-400 group-hover:text-gold-300' : 'text-white/80 group-hover:text-white'}`}>
                            {t.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/8 pt-3 mt-3 flex items-center gap-2">
                    <Link href="/courses" onClick={closeAll}
                      className="flex-1 text-center px-3 py-2 rounded-lg hover:bg-white/8 text-xs text-white/70 hover:text-white font-medium transition-all">
                      📚 Browse All Courses
                    </Link>
                    <Link href="/course-finder" onClick={closeAll}
                      className="flex-1 text-center px-3 py-2 rounded-lg hover:bg-white/8 text-xs text-white/70 hover:text-white font-medium transition-all">
                      🔍 Course Finder Tool
                    </Link>
                  </div>
                </div>
              </MegaPanel>
            </div>

            {/* EXAMS mega trigger */}
            <div className="relative"
              onMouseEnter={() => openMenu('exams')}
              onMouseLeave={scheduleClose}>
              <button className={navBtn(activeMenu === 'exams')}>
                Exams
                <Chevron open={activeMenu === 'exams'} />
              </button>

              <MegaPanel id="exams" wide>
                <div className="p-5">
                  {/* IELTS header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🇬🇧</span>
                      <div>
                        <p className="text-sm font-black text-white">IELTS Mock Tests</p>
                        <p className="text-[10px] text-blue-400/60">Free · Auto-scored · Band prediction</p>
                      </div>
                    </div>
                    <Link href="/mock-test" onClick={closeAll}
                      className="text-xs text-gold-400 hover:text-gold-300 font-semibold transition-colors">
                      All Tests →
                    </Link>
                  </div>

                  {/* Level selector */}
                  <p className="text-[10px] font-bold text-blue-400/70 uppercase tracking-widest mb-2">Choose Level</p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {IELTS_LEVELS.map(lvl => (
                      <Link key={lvl.key} href={`/mock-test/${lvl.key}/full`} onClick={closeAll}
                        className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white/8 transition-all group border border-white/5 hover:border-white/15">
                        <span className="text-2xl">{lvl.icon}</span>
                        <p className={`text-sm font-bold ${lvl.color}`}>{lvl.label}</p>
                        <p className="text-[10px] text-blue-400/50">{lvl.band}</p>
                      </Link>
                    ))}
                  </div>

                  {/* Section selector */}
                  <p className="text-[10px] font-bold text-blue-400/70 uppercase tracking-widest mb-2">Choose Section</p>
                  <div className="grid grid-cols-5 gap-1.5 mb-4">
                    {IELTS_SECTIONS.map(sec => (
                      <Link key={sec.key} href={`/mock-test/intermediate/${sec.key}`} onClick={closeAll}
                        className="flex flex-col items-center gap-1 p-2.5 rounded-xl hover:bg-white/8 transition-all group border border-white/5 hover:border-white/15">
                        <span className="text-xl">{sec.icon}</span>
                        <p className="text-[11px] font-semibold text-white/80 group-hover:text-white">{sec.label}</p>
                        <p className="text-[10px] text-blue-400/50">{sec.time}</p>
                      </Link>
                    ))}
                  </div>

                  {/* Gold CTA */}
                  <Link href="/mock-test" onClick={closeAll}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-gold-500 hover:bg-gold-600 text-white font-semibold text-sm rounded-xl transition-colors shadow-lg shadow-gold-500/20">
                    ✏️ Start Free IELTS Mock Test →
                  </Link>
                </div>
              </MegaPanel>
            </div>

            {/* Simple links */}
            {SIMPLE_LINKS.map(l => (
              <Link key={l.href} href={l.href}
                className="px-3 py-2 text-sm font-medium text-blue-100/80 hover:text-white transition-colors rounded-lg hover:bg-white/8">
                {l.label}
              </Link>
            ))}

            <Link href="/student-login"
              className="ml-3 flex items-center gap-1.5 text-blue-100/80 hover:text-white text-sm font-medium px-3 py-2 rounded-xl hover:bg-white/8 transition-all border border-white/10 hover:border-white/20 whitespace-nowrap">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Student Login
            </Link>
            <Link href="/book-counselling"
              className="ml-2 bg-gold-500 hover:bg-gold-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap shadow-md shadow-gold-500/20">
              Book Free Counselling
            </Link>
          </nav>

          {/* ── Mobile hamburger ─────────────────────────────────────────── */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* ── Mobile menu ───────────────────────────────────────────────── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/8 py-3 space-y-0.5">

            {/* Universities */}
            <MobileAccordion
              label="Universities"
              isOpen={mobileExpanded === 'universities'}
              onToggle={() => setMobileExpanded(v => v === 'universities' ? '' : 'universities')}
            >
              <div className="grid grid-cols-3 gap-x-3 gap-y-1 mb-3">
                {COUNTRIES.map(c => (
                  <Link key={c.slug} href={`/universities/country/${c.slug}`} onClick={closeAll}
                    className="flex items-center gap-1.5 text-xs text-blue-200/80 hover:text-white py-1.5">
                    <span>{c.flag}</span><span>{c.name}</span>
                  </Link>
                ))}
              </div>
              <Link href="/universities" onClick={closeAll}
                className="block text-xs text-gold-400 font-semibold pt-2 border-t border-white/10">
                View All Universities →
              </Link>
            </MobileAccordion>

            {/* Courses */}
            <MobileAccordion
              label="Courses"
              isOpen={mobileExpanded === 'courses'}
              onToggle={() => setMobileExpanded(v => v === 'courses' ? '' : 'courses')}
            >
              <div className="mb-2">
                <p className="text-[10px] text-blue-400/60 uppercase font-bold tracking-wider mb-1.5">By Level</p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  {COURSE_LEVELS.map(l => (
                    <Link key={l.href} href={l.href} onClick={closeAll}
                      className="text-xs text-blue-200/80 hover:text-white flex items-center gap-1.5 py-1">
                      <span>{l.icon}</span><span>{l.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-blue-400/60 uppercase font-bold tracking-wider mb-1.5 mt-2">By Stream</p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  {COURSE_STREAMS.map(s => (
                    <Link key={s.href} href={s.href} onClick={closeAll}
                      className="text-xs text-blue-200/80 hover:text-white flex items-center gap-1.5 py-1">
                      <span>{s.icon}</span><span>{s.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-white/10">
                <p className="text-[10px] text-blue-400/60 uppercase font-bold tracking-wider mb-1.5">Tools &amp; Guides</p>
                <div className="grid grid-cols-3 gap-x-2 gap-y-1 mb-2">
                  {TOOLS_GUIDES.map(t => (
                    <Link key={t.href} href={t.href} onClick={closeAll}
                      className={`text-xs flex items-center gap-1 py-1 ${t.gold ? 'text-gold-400 font-semibold' : 'text-blue-200/80 hover:text-white'}`}>
                      <span>{t.icon}</span><span>{t.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/courses" onClick={closeAll}
                className="block text-xs text-gold-400 font-semibold pt-2 mt-1 border-t border-white/10">
                Browse All Courses →
              </Link>
            </MobileAccordion>

            {/* Exams */}
            <MobileAccordion
              label="IELTS Mock Tests"
              isOpen={mobileExpanded === 'exams'}
              onToggle={() => setMobileExpanded(v => v === 'exams' ? '' : 'exams')}
            >
              <p className="text-[10px] text-blue-400/60 uppercase font-bold tracking-wider mb-1.5">By Level</p>
              <div className="grid grid-cols-3 gap-x-3 gap-y-1 mb-3">
                {IELTS_LEVELS.map(lvl => (
                  <Link key={lvl.key} href={`/mock-test/${lvl.key}/full`} onClick={closeAll}
                    className="flex items-center gap-1.5 text-xs text-blue-200/80 hover:text-white py-1.5">
                    <span>{lvl.icon}</span><span>{lvl.label}</span>
                  </Link>
                ))}
              </div>
              <p className="text-[10px] text-blue-400/60 uppercase font-bold tracking-wider mb-1.5">By Section</p>
              <div className="grid grid-cols-3 gap-x-3 gap-y-1 mb-3">
                {IELTS_SECTIONS.map(sec => (
                  <Link key={sec.key} href={`/mock-test/intermediate/${sec.key}`} onClick={closeAll}
                    className="flex items-center gap-1.5 text-xs text-blue-200/80 hover:text-white py-1.5">
                    <span>{sec.icon}</span><span>{sec.label}</span>
                  </Link>
                ))}
              </div>
              <Link href="/mock-test" onClick={closeAll}
                className="block text-center py-2 bg-gold-500 text-white text-xs font-semibold rounded-lg">
                ✏️ All IELTS Mock Tests
              </Link>
            </MobileAccordion>

            {/* Simple links */}
            {SIMPLE_LINKS.map(l => (
              <Link key={l.href} href={l.href}
                className="block px-3 py-2.5 text-sm text-blue-100/80 hover:text-white font-medium"
                onClick={closeAll}>
                {l.label}
              </Link>
            ))}

            <div className="mx-3 mt-3 grid grid-cols-2 gap-2">
              <Link href="/student-login"
                className="text-center py-2.5 border border-white/15 hover:bg-white/8 text-blue-200 text-sm font-semibold rounded-xl transition-colors"
                onClick={closeAll}>
                👤 Student Login
              </Link>
              <Link href="/book-counselling"
                className="text-center py-2.5 bg-gold-500 hover:bg-gold-600 text-white text-sm font-semibold rounded-xl transition-colors"
                onClick={closeAll}>
                Book Counselling
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function navBtn(active: boolean) {
  return [
    'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all',
    active
      ? 'text-white bg-white/12'
      : 'text-blue-100/80 hover:text-white hover:bg-white/8',
  ].join(' ');
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="none" stroke="currentColor" viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function MobileAccordion({
  label, isOpen, onToggle, children,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-blue-100/80 hover:text-white font-medium"
      >
        {label}
        <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="mx-3 mb-2 bg-white/6 rounded-xl p-3.5">
          {children}
        </div>
      )}
    </div>
  );
}
