"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function ensureProfile(user: User): Promise<boolean> {
  const ref = doc(db, "profiles", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      userId: user.uid,
      displayName: user.displayName ?? "",
      email: user.email ?? "",
      photoURL: user.photoURL ?? "",
      username: "",
      bio: "",
      tools: [],
      role: "user",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return true; // new user — needs onboarding
  }
  const data = snap.data();
  return !data.username; // no username means onboarding not completed
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const needsOnboarding = await ensureProfile(result.user);
    router.push(needsOnboarding ? "/onboarding" : "/projects");
  }

  async function signInWithGitHub() {
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const needsOnboarding = await ensureProfile(result.user);
    router.push(needsOnboarding ? "/onboarding" : "/projects");
  }

  async function signOut() {
    await firebaseSignOut(auth);
    router.push("/");
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithGitHub, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
