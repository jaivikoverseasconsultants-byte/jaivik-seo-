import fs from 'fs/promises';
import path from 'path';
import type { LeadData } from '@/types';

const CSV_PATH = path.join(process.cwd(), 'leads', 'leads.csv');
const HEADERS = ['Name', 'Email', 'Phone', 'Target Country', 'Interested Course', 'Budget', 'IELTS Score', 'GRE Score', 'Message', 'Source', 'Timestamp'];

function escapeCSV(value: string): string {
  const str = String(value || '').replace(/"/g, '""').replace(/\n/g, ' ');
  return `"${str}"`;
}

export async function appendLeadToCSV(lead: LeadData): Promise<void> {
  const dir = path.dirname(CSV_PATH);
  await fs.mkdir(dir, { recursive: true });

  let fileExists = false;
  try {
    await fs.access(CSV_PATH);
    fileExists = true;
  } catch {}

  const row = [
    lead.name, lead.email, lead.phone, lead.targetCountry,
    lead.interestedCourse, lead.budget, lead.ieltsScore,
    lead.greScore, lead.message, lead.source, lead.timestamp,
  ].map(escapeCSV).join(',');

  if (!fileExists) {
    const headerRow = HEADERS.map(h => escapeCSV(h)).join(',');
    await fs.writeFile(CSV_PATH, headerRow + '\n' + row + '\n', 'utf-8');
  } else {
    await fs.appendFile(CSV_PATH, row + '\n', 'utf-8');
  }
}
