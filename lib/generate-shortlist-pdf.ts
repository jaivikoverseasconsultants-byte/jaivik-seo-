// Client-side PDF export for /find-my-course's unlocked shortlist. Every
// field written here comes straight off MatchedCourse (real registry data
// + the honest verified/unverified IELTS label from lib/find-my-course.ts)
// -- no fabricated field is ever added to the PDF.

import type { MatchedCourse } from '@/lib/find-my-course';

const SITE_URL = 'https://study.jaivikoverseasconsultants.com';
const MARGIN = 14;
const PAGE_HEIGHT = 297; // A4 mm
const ROW_HEIGHT = 22;

export async function generateShortlistPdf(matches: MatchedCourse[], studentName: string): Promise<void> {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  doc.setFontSize(16);
  doc.setTextColor(30, 58, 95);
  doc.text('Jaivik Overseas — Your Course Shortlist', MARGIN, 18);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Prepared for ${studentName} · ${matches.length} real, crawled courses · ${new Date().toLocaleDateString('en-IN')}`, MARGIN, 25);

  let y = 35;

  for (let i = 0; i < matches.length; i++) {
    if (y + ROW_HEIGHT > PAGE_HEIGHT - MARGIN) {
      doc.addPage();
      y = MARGIN + 6;
    }

    const c = matches[i];
    const feeLabel = `Rs. ${(c.annualINR / 100000).toFixed(1)}L/yr`;
    const url = `${SITE_URL}/universities/${c.universitySlug}/courses/${c.slug}`;

    doc.setFontSize(11);
    doc.setTextColor(20, 20, 20);
    doc.text(`${i + 1}. ${c.name}`, MARGIN, y);

    doc.setFontSize(9);
    doc.setTextColor(90, 90, 90);
    doc.text(`${c.universityName} - ${c.country}`, MARGIN, y + 5);
    doc.text(`Fee: ${feeLabel}   Duration: ${c.duration || 'Not specified'}   IELTS: ${c.ieltsDisplay}`, MARGIN, y + 10);

    doc.setFontSize(8.5);
    doc.setTextColor(30, 90, 180);
    doc.textWithLink('View full course details ->', MARGIN, y + 15, { url });

    doc.setDrawColor(230, 230, 230);
    doc.line(MARGIN, y + 18, 210 - MARGIN, y + 18);

    y += ROW_HEIGHT;
  }

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    'Fees shown are as crawled from each university\'s own course page and may change by intake. Where IELTS says "Confirm with counsellor," we have not independently verified that course\'s exact requirement.',
    MARGIN, PAGE_HEIGHT - 10, { maxWidth: 210 - MARGIN * 2 }
  );

  doc.save(`jaivik-course-shortlist-${studentName.replace(/\s+/g, '-').toLowerCase() || 'student'}.pdf`);
}
