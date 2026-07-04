import { NextRequest, NextResponse } from 'next/server';
import { triggerEmailSequence } from '@/lib/brevo';

const FORMSPREE_URL = 'https://formspree.io/f/xgoqzezk';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  return /^[\d\s+\-()]{7,15}$/.test(phone.trim());
}

async function storeInFirestore(data: Record<string, string>): Promise<void> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!projectId || !apiKey) {
    console.error('[Firestore] Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_API_KEY');
    return;
  }

  const fields: Record<string, { stringValue: string }> = {};
  for (const [k, v] of Object.entries(data)) {
    fields[k] = { stringValue: v };
  }

  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/leads?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields }),
      },
    );
    if (!res.ok) {
      const err = await res.text();
      console.error(`[Firestore] Write failed (${res.status}):`, err);
    }
  } catch (err) {
    console.error('[Firestore] Network error:', err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, phone, targetCountry, interestedCourse } = body;
    if (!name?.trim() || !email?.trim() || !phone?.trim() || !targetCountry?.trim() || !interestedCourse?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    if (!isValidPhone(phone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    const cleanName    = String(name).trim().slice(0, 100);
    const cleanEmail   = String(email).trim().slice(0, 200);
    const cleanPhone   = String(phone).trim().slice(0, 20);
    const cleanCountry = String(targetCountry).trim().slice(0, 50);
    const cleanCourse  = String(interestedCourse).trim().slice(0, 200);
    const cleanScore   = String(body.ieltsScore  || '').trim().slice(0, 20);
    const cleanBudget  = String(body.budget       || '').trim().slice(0, 100);
    const cleanGre     = String(body.greScore     || '').trim().slice(0, 20);
    const cleanMsg     = String(body.message      || '').trim().slice(0, 1000);
    const cleanSource  = String(body.source       || 'website').trim().slice(0, 100);
    const submittedAt  = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Run all three side-effects in parallel; none block the response
    await Promise.allSettled([
      // 1. Store in Firestore
      storeInFirestore({
        name: cleanName, email: cleanEmail, phone: cleanPhone,
        country: cleanCountry, course: cleanCourse, ieltsScore: cleanScore,
        budget: cleanBudget, greScore: cleanGre, message: cleanMsg,
        source: cleanSource, submittedAt,
      }),

      // 2. Trigger personalised Brevo email sequence
      triggerEmailSequence({
        name: cleanName, email: cleanEmail,
        ieltsScore: cleanScore, country: cleanCountry, course: cleanCourse,
      }),

      // 3. Forward to Formspree (backup notification to team inbox)
      fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `New Enquiry – ${cleanCourse} in ${cleanCountry} | ${cleanSource}`,
          name: cleanName, email: cleanEmail, phone: cleanPhone,
          'Target Country': cleanCountry,
          'Interested Course': cleanCourse,
          'Budget': cleanBudget,
          'IELTS Score': cleanScore,
          'GRE/GMAT Score': cleanGre,
          'Message': cleanMsg,
          'Source Page': cleanSource,
          'Submitted At': submittedAt,
        }),
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Lead API] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
