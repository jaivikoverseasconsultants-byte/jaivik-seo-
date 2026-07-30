'use client';

import { useState, useEffect } from 'react';

const MONTH_NUM: Record<string, number> = {
  January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
  July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
};

function getDeadlineDate(intakeMonth: string, intakeYear: number): Date {
  const mNum = MONTH_NUM[intakeMonth] ?? 9;
  let deadlineMNum = mNum - 3;
  let deadlineYear = intakeYear;
  if (deadlineMNum <= 0) { deadlineMNum += 12; deadlineYear -= 1; }
  // Use last day of deadline month
  return new Date(deadlineYear, deadlineMNum, 0, 23, 59, 59);
}

function findNextIntake(intakeMonths: string[]): { month: string; year: number; deadline: Date; intakeDate: Date } | null {
  const now = new Date();
  const candidates: { month: string; year: number; deadline: Date; intakeDate: Date }[] = [];

  // Look across a rolling window of years relative to today (never hardcoded)
  // so this doesn't silently go stale after any particular year.
  const startYear = now.getFullYear();
  for (const month of intakeMonths) {
    const mNum = MONTH_NUM[month] ?? 9;
    for (const year of [startYear, startYear + 1, startYear + 2]) {
      const deadline = getDeadlineDate(month, year);
      const intakeDate = new Date(year, mNum - 1, 1);
      // Only a candidate if its APPLICATION DEADLINE is still ahead of today —
      // an intake whose start date hasn't happened yet can still have an
      // already-passed deadline (e.g. a Sept intake's ~3-months-prior deadline
      // falls in June, which is behind "today" for most of the summer). Filtering
      // on the intake date alone (the old bug) let an expired deadline slip through.
      if (deadline > now) {
        candidates.push({ month, year, deadline, intakeDate });
      }
    }
  }

  // Among still-open candidates, the "next upcoming intake" is the one that
  // starts soonest — not necessarily the one whose deadline is soonest.
  candidates.sort((a, b) => a.intakeDate.getTime() - b.intakeDate.getTime());
  return candidates[0] ?? null;
}

interface Props {
  intakeMonths: string[];
}

export default function DeadlineCountdown({ intakeMonths }: Props) {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [next, setNext] = useState<{ month: string; year: number; deadline: Date; intakeDate: Date } | null>(null);

  useEffect(() => {
    let current = findNextIntake(intakeMonths);
    setNext(current);
    if (!current) return;

    // Re-derives the next intake whenever the currently-shown one's deadline
    // is reached, so a browser tab left open across that boundary rolls
    // forward to the next real intake instead of freezing at "0 days left".
    function tick() {
      const now = Date.now();
      let diff = current!.deadline.getTime() - now;
      if (diff <= 0) {
        current = findNextIntake(intakeMonths);
        setNext(current);
        if (!current) { setDaysLeft(null); return; }
        diff = current.deadline.getTime() - now;
      }
      setDaysLeft(Math.ceil(diff / 86400000));
    }
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [intakeMonths]);

  if (!next) return null;

  const deadlineLabel = next.deadline.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const urgency = daysLeft === null ? 'green'
    : daysLeft < 30 ? 'red'
    : daysLeft < 60 ? 'orange'
    : 'green';

  const colorMap = {
    red:    { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700',    badge: 'bg-red-100 text-red-700',    dot: '🔴' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700', dot: '🟠' },
    green:  { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  badge: 'bg-green-100 text-green-700',  dot: '🟢' },
  };
  const c = colorMap[urgency];

  return (
    <div className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm`}>
      <h2 className="text-xl font-bold text-gray-900 mb-4">⏰ Application Deadline</h2>
      <div className={`${c.bg} ${c.border} border rounded-xl p-4`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span>{c.dot}</span>
              <p className={`font-bold text-sm ${c.text}`}>
                {next.month} {next.year} Intake — Apply by ~{deadlineLabel} (estimated)
              </p>
            </div>
            <p className="text-xs text-gray-600">
              Deadlines are typical/estimated (most programs close applications ~3 months before the intake start) — confirm the exact date for your specific course with our counsellors.
            </p>
          </div>
          {daysLeft !== null && (
            <div className={`${c.badge} rounded-xl px-4 py-3 text-center flex-shrink-0`}>
              <p className="text-2xl font-black leading-none">{daysLeft}</p>
              <p className="text-xs font-semibold mt-0.5">days left (est.)</p>
            </div>
          )}
        </div>

        {urgency === 'red' && daysLeft !== null && (
          <div className="mt-3 bg-red-100 rounded-lg px-3 py-2">
            <p className="text-xs text-red-700 font-semibold">
              ⚠️ The estimated deadline is approaching — contact us soon to start your application.
            </p>
          </div>
        )}
      </div>

      <a
        href={`https://wa.me/919971226347?text=${encodeURIComponent('Hi Jaivik Overseas, I want to apply before the deadline. Please help me with the application process.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm rounded-xl transition-colors"
      >
        <svg className="w-4 h-4 fill-white flex-shrink-0" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Apply Before Deadline — WhatsApp Us Now
      </a>
    </div>
  );
}
