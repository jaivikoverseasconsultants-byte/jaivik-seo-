import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Call on any meaningful user action: login, test submit, university save, profile update.
// Non-critical — failure is swallowed so it never blocks the UI.
export async function trackActivity(uid: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', uid), { lastActivity: serverTimestamp() });
  } catch {
    // intentionally silent
  }
}
