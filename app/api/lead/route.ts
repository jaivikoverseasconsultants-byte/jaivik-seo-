import { NextRequest, NextResponse } from 'next/server';

const FORMSPREE_URL = 'https://formspree.io/f/xgoqzezk';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  return /^[\d\s\+\-\(\)]{7,15}$/.test(phone.trim());
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

    const payload = {
      _subject: `New Enquiry – ${String(interestedCourse).trim()} in ${String(targetCountry).trim()} | ${String(body.source || 'website').trim()}`,
      name: String(name).trim().slice(0, 100),
      email: String(email).trim().slice(0, 200),
      phone: String(phone).trim().slice(0, 20),
      'Target Country': String(targetCountry).trim().slice(0, 50),
      'Interested Course': String(interestedCourse).trim().slice(0, 200),
      'Budget': String(body.budget || '').trim().slice(0, 100),
      'IELTS Score': String(body.ieltsScore || '').trim().slice(0, 20),
      'GRE/GMAT Score': String(body.greScore || '').trim().slice(0, 20),
      'Message': String(body.message || '').trim().slice(0, 1000),
      'Source Page': String(body.source || 'website').trim().slice(0, 100),
      'Submitted At': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    };

    const res = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Formspree error:', err);
      return NextResponse.json({ error: 'Submission failed' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lead route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
