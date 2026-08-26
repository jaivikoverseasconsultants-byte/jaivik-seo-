// Client-side branded PDF export for /find-my-course's unlocked shortlist.
// Every course field written here comes straight off MatchedCourse (real
// registry data + the honest verified/unverified IELTS label from
// lib/find-my-course.ts) -- no fabricated field is ever added to the PDF.
// Profile fields (country/level/subject/budget/IELTS/%/backlogs/gap) are
// the student's own inputs, shown as context for the counsellor -- never
// asserted as an eligibility verdict.

import type { MatchedCourse } from '@/lib/find-my-course';
import { courseAnnualINRLakh } from '@/lib/currency';
import { isFeeVerified } from '@/lib/fee-verification';

const SITE_URL = 'https://study.jaivikoverseasconsultants.com';
const LOGO_PATH = '/joc-logo.png';
const LOGO_ASPECT = 8130 / 6053; // width / height of the source logo

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 14;
const CONTENT_BOTTOM = PAGE_H - 22; // leave room for the footer band
const NAVY = [30, 58, 95] as const; // brand-700 #1e3a5f
const NAVY_DARK = [30, 42, 74] as const; // brand-900 #1e2a4a
const GOLD = [245, 158, 11] as const; // gold-500 #f59e0b
const GRAY = [110, 110, 110] as const;

export interface ProfileSummaryForPdf {
  countries: string;
  level: string;
  subject: string;
  budget: string;
  ielts: string;
  percentage: string;
  backlogs: string;
  studyGap: string;
}

// jsPDF's default core font (Helvetica) uses WinAnsi/Windows-1252 encoding,
// which has no glyph for the Rupee sign (U+20B9, postdates that codepage)
// or a right-arrow (U+2192) -- both render as garbled/substituted glyphs
// instead of throwing, so this has to be caught by sanitizing text before
// doc.text()/textWithLink() rather than relying on jsPDF to error out.
function sanitizeForPdf(text: string): string {
  return text.replace(/₹/g, 'Rs. ').replace(/→/g, '->');
}

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch(LOGO_PATH);
    const blob = await res.blob();
    const bitmap = await createImageBitmap(blob);
    const maxW = 900;
    const scale = Math.min(1, maxW / bitmap.width);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width * scale;
    canvas.height = bitmap.height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  } catch {
    return null;
  }
}

export async function generateShortlistPdf(
  matches: MatchedCourse[],
  studentName: string,
  profile: ProfileSummaryForPdf
): Promise<void> {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const logoDataUrl = await loadLogoDataUrl();

  function drawWatermark() {
    if (!logoDataUrl) return;
    const w = 130;
    const h = w / LOGO_ASPECT;
    const x = (PAGE_W - w) / 2;
    const y = (PAGE_H - h) / 2;
    doc.saveGraphicsState();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    doc.setGState(new (doc as any).GState({ opacity: 0.08 }));
    doc.addImage(logoDataUrl, 'PNG', x, y, w, h);
    doc.restoreGraphicsState();
  }

  function newPage() {
    doc.addPage();
    drawWatermark();
    return MARGIN + 4;
  }

  // ── Page 1: watermark + header ───────────────────────────────────────
  drawWatermark();

  let y = MARGIN;
  if (logoDataUrl) {
    const headerLogoW = 26;
    const headerLogoH = headerLogoW / LOGO_ASPECT;
    doc.addImage(logoDataUrl, 'PNG', MARGIN, y, headerLogoW, headerLogoH);
    doc.setFontSize(15);
    doc.setTextColor(...NAVY);
    doc.setFont('helvetica', 'bold');
    doc.text('Personalized University Shortlist', MARGIN + headerLogoW + 6, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...GRAY);
    doc.text(`Prepared for: ${studentName}`, MARGIN + headerLogoW + 6, y + 15);
    doc.text(new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), MARGIN + headerLogoW + 6, y + 20);
    y += Math.max(headerLogoH, 22) + 6;
  } else {
    doc.setFontSize(16);
    doc.setTextColor(...NAVY);
    doc.setFont('helvetica', 'bold');
    doc.text('Personalized University Shortlist', MARGIN, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...GRAY);
    doc.text(`Prepared for: ${studentName} · ${new Date().toLocaleDateString('en-IN')}`, MARGIN, y + 14);
    y += 22;
  }

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.6);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 8;

  // ── Profile summary box ────────────────────────────────────────────────
  const boxTop = y;
  const boxHeight = 34;
  doc.setFillColor(239, 246, 255); // brand-50
  doc.setDrawColor(191, 219, 254); // brand-200
  doc.roundedRect(MARGIN, boxTop, PAGE_W - MARGIN * 2, boxHeight, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Your Profile', MARGIN + 5, boxTop + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(40, 40, 40);

  const colA = MARGIN + 5;
  const colB = MARGIN + 95;
  const rows: [string, string][] = [
    ['Target Country', profile.countries],
    ['Degree Level', profile.level],
    ['Subject', profile.subject],
    ['Budget', profile.budget],
  ];
  const rows2: [string, string][] = [
    ['IELTS Band', profile.ielts],
    ['Academic % / GPA', profile.percentage],
    ['Backlogs', profile.backlogs],
    ['Study Gap', profile.studyGap],
  ];
  let ry = boxTop + 13;
  for (const [label, value] of rows) {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, colA, ry);
    doc.setFont('helvetica', 'normal');
    doc.text(sanitizeForPdf(value), colA + 32, ry);
    ry += 5.3;
  }
  ry = boxTop + 13;
  for (const [label, value] of rows2) {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, colB, ry);
    doc.setFont('helvetica', 'normal');
    doc.text(sanitizeForPdf(value), colB + 32, ry);
    ry += 5.3;
  }

  y = boxTop + boxHeight + 10;

  // ── Course table ─────────────────────────────────────────────────────
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text(`Your Selected Courses (${matches.length})`, MARGIN, y);
  y += 7;

  // Header row
  function drawTableHeader() {
    doc.setFillColor(...NAVY);
    doc.rect(MARGIN, y - 4.5, PAGE_W - MARGIN * 2, 6.5, 'F');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('Course / University', MARGIN + 2, y);
    doc.text('Fee (INR/yr)', MARGIN + 108, y);
    doc.text('IELTS Req.', MARGIN + 138, y);
    doc.text('Duration', MARGIN + 165, y);
    y += 6;
  }

  drawTableHeader();

  for (let i = 0; i < matches.length; i++) {
    const c = matches[i];
    const rowHeight = 15;
    if (y + rowHeight > CONTENT_BOTTOM) {
      y = newPage();
      drawTableHeader();
    }

    if (i % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(MARGIN, y - 4, PAGE_W - MARGIN * 2, rowHeight, 'F');
    }

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 20, 20);
    const courseName = doc.splitTextToSize(c.name, 100)[0];
    doc.text(courseName, MARGIN + 2, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...GRAY);
    doc.text(`${c.universityName} · ${c.country}`, MARGIN + 2, y + 4.5);

    doc.setFontSize(8);
    doc.setTextColor(...NAVY);
    // an unverified fee must not be printed into a document the student keeps
    const feeLakh = isFeeVerified(c as any) ? courseAnnualINRLakh(c as any, 1) : null;
    doc.text(feeLakh ? `Rs. ${feeLakh}L` : 'On request', MARGIN + 108, y);
    doc.setTextColor(c.ieltsVerified ? 22 : 130, c.ieltsVerified ? 130 : 130, c.ieltsVerified ? 60 : 130);
    const ieltsText = doc.splitTextToSize(c.ieltsDisplay, 24);
    doc.text(ieltsText, MARGIN + 138, y);
    doc.setTextColor(60, 60, 60);
    doc.text(c.duration || 'Not specified', MARGIN + 165, y, { maxWidth: 30 });

    doc.setFontSize(7.5);
    doc.setTextColor(30, 90, 180);
    doc.textWithLink('View full course details ->', MARGIN + 2, y + 9,
      { url: `${SITE_URL}/universities/${c.universitySlug}/courses/${c.slug}` });

    y += rowHeight;
  }

  y += 4;

  // ── Counsellor note + CTA ───────────────────────────────────────────────
  const noteHeight = 26;
  if (y + noteHeight > CONTENT_BOTTOM) {
    y = newPage();
  }
  doc.setFillColor(255, 251, 235); // gold-50-ish
  doc.setDrawColor(...GOLD);
  doc.roundedRect(MARGIN, y, PAGE_W - MARGIN * 2, noteHeight, 2, 2, 'FD');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY_DARK);
  doc.text('A note from our counselling team', MARGIN + 5, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  const noteText = doc.splitTextToSize(
    'Final eligibility depends on your backlogs and academic marks — our counsellors review these personally before you apply. Book a free counselling session and we\'ll confirm exactly which of these courses fit your profile.',
    PAGE_W - MARGIN * 2 - 10
  );
  doc.text(noteText, MARGIN + 5, y + 13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Book free counselling: +91 99712 26347 · WhatsApp', MARGIN + 5, y + noteHeight - 3);

  // ── Footer on every page ────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, PAGE_H - 16, PAGE_W - MARGIN, PAGE_H - 16);
    doc.setFontSize(6.8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GRAY);
    doc.text(
      'Jaivik Overseas Consultants · 13+ yrs experience · 1,400+ students guided · 99% visa success rate',
      PAGE_W / 2, PAGE_H - 11, { align: 'center' }
    );
    doc.text(
      `+91 99712 26347 · WhatsApp · ${SITE_URL.replace('https://', '')}`,
      PAGE_W / 2, PAGE_H - 7, { align: 'center' }
    );
    doc.setFontSize(6.5);
    doc.text(`Page ${p} of ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 7, { align: 'right' });
  }

  doc.save(`jaivik-course-shortlist-${studentName.replace(/\s+/g, '-').toLowerCase() || 'student'}.pdf`);
}
