'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  targetCountry?: string;
  budget?: string;
  interestedCourse?: string;
  role: 'student' | 'trainer';
  [key: string]: unknown;
}

interface AuthContextValue {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  currentUser: null,
  userProfile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(uid: string) {
    try {
      const studentSnap = await getDoc(doc(db, 'users', uid));
      if (studentSnap.exists()) {
        setUserProfile({ role: 'student', ...(studentSnap.data() as Omit<UserProfile, 'role'>) } as UserProfile);
        return;
      }
      const trainerSnap = await getDoc(doc(db, 'trainers', uid));
      if (trainerSnap.exists()) {
        setUserProfile({ role: 'trainer', ...(trainerSnap.data() as Omit<UserProfile, 'role'>) } as UserProfile);
        return;
      }
      setUserProfile(null);
    } catch {
      setUserProfile(null);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await loadProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signOut() {
    await firebaseSignOut(auth);
    setUserProfile(null);
  }

  async function refreshProfile() {
    if (currentUser) await loadProfile(currentUser.uid);
  }

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
