import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }

  try {
    const res = await fetch('https://formspree.io/f/xgoqzezk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        ...body,
        _subject: `Course Matcher Lead: ${body.name ?? 'Unknown'} — ${body.field ?? ''}`,
        _replyto: body.email ?? '',
        source: 'AI Course Matcher',
      }),
    });
    if (!res.ok) throw new Error(`formspree ${res.status}`);
  } catch {
    // Swallow — still return ok so we don't block the user
  }

  return NextResponse.json({ ok: true });
}
