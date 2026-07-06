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
  status?: 'active' | 'deactivated';
  role: 'student' | 'trainer';
  [key: string]: unknown;
}

interface AuthContextValue {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isDeactivated: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  currentUser: null,
  userProfile: null,
  loading: true,
  isDeactivated: false,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeactivated, setIsDeactivated] = useState(false);

  async function loadProfile(uid: string): Promise<UserProfile | null> {
    try {
      const studentSnap = await getDoc(doc(db, 'users', uid));
      if (studentSnap.exists()) {
        const profile = { role: 'student', ...(studentSnap.data() as Omit<UserProfile, 'role'>) } as UserProfile;
        setUserProfile(profile);
        return profile;
      }
      const trainerSnap = await getDoc(doc(db, 'trainers', uid));
      if (trainerSnap.exists()) {
        const profile = { role: 'trainer', ...(trainerSnap.data() as Omit<UserProfile, 'role'>) } as UserProfile;
        setUserProfile(profile);
        return profile;
      }
      setUserProfile(null);
      return null;
    } catch {
      setUserProfile(null);
      return null;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const profile = await loadProfile(user.uid);
          if (profile?.status === 'deactivated') {
            try { await firebaseSignOut(auth); } catch { /* ignore sign-out errors */ }
            setCurrentUser(null);
            setUserProfile(null);
            setIsDeactivated(true);
          } else {
            setCurrentUser(user);
            setIsDeactivated(false);
          }
        } catch {
          setCurrentUser(user);
          setIsDeactivated(false);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signOut() {
    setIsDeactivated(false);
    await firebaseSignOut(auth);
    setUserProfile(null);
  }

  async function refreshProfile() {
    if (currentUser) await loadProfile(currentUser.uid);
  }

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading, isDeactivated, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
