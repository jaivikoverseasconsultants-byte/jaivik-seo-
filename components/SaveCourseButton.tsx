'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';

interface SaveCourseButtonProps {
  slug: string;
  name: string;
  university?: string;
  fee?: string;
  ielts?: string;
}

export default function SaveCourseButton({ slug, name, university, fee, ielts }: SaveCourseButtonProps) {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [saved, setSaved] = useState(false);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!currentUser) { setChecking(false); return; }
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'users', currentUser.uid, 'savedCourses', slug));
        setSaved(snap.exists());
      } finally {
        setChecking(false);
      }
    })();
  }, [authLoading, currentUser, slug]);

  async function handleClick() {
    if (!currentUser) {
      router.push(`/student-login?returnUrl=${encodeURIComponent(pathname || '/')}`);
      return;
    }
    setBusy(true);
    try {
      const ref = doc(db, 'users', currentUser.uid, 'savedCourses', slug);
      if (saved) {
        await deleteDoc(ref);
        setSaved(false);
      } else {
        await setDoc(ref, { slug, name, university: university ?? '', fee: fee ?? '', ielts: ielts ?? '', savedAt: serverTimestamp() });
        setSaved(true);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={busy || checking}
      className={[
        'inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all border disabled:opacity-60',
        saved
          ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
          : 'bg-white/10 text-white border-white/30 hover:bg-white/20',
      ].join(' ')}
    >
      <span>{saved ? '⭐' : '☆'}</span>
      {checking ? 'Loading…' : saved ? 'Saved' : 'Save Course'}
    </button>
  );
}
