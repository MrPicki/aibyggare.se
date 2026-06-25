"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onIdTokenChanged,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";

// Lightweight profile slice shared across the app (header link, settings, etc.).
// The full profile doc is read on the settings page; here we keep only what the
// chrome needs so we fetch it once per session instead of on every page.
export interface ProfileLite {
  username: string;
  displayName: string;
  avatarUrl: string;
  role: string;
  totalXp: number;
  level: number;
  onboardingCompleted: boolean;
}

interface AuthContextValue {
  user: User | null;
  profile: ProfileLite | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function firebaseErrorMessage(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  const msg = (err as { message?: string })?.message ?? String(err);
  if (code === "auth/unauthorized-domain")   return "Den här domänen är inte auktoriserad i Firebase.";
  if (code === "auth/operation-not-allowed") return "Inloggningsmetoden är inte aktiverad i Firebase Console.";
  if (code === "auth/account-exists-with-different-credential")
    return "Du har redan ett konto med den e-postadressen via en annan inloggningsmetod.";
  return `Fel: ${code || msg}`;
}

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
      builderStatus: "",
      totalXp: 0,
      level: 0,
      onboardingCompleted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return true; // new user — needs onboarding
  }
  const data = snap.data();
  // Onboarding klar = uttryckligt flagga ELLER (äldre konton) ett username satt.
  return !(data.onboardingCompleted || data.username);
}

async function readProfileLite(uid: string): Promise<ProfileLite | null> {
  try {
    const snap = await getDoc(doc(db, "profiles", uid));
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      username: data.username ?? "",
      displayName: data.displayName ?? "",
      avatarUrl: data.avatarUrl ?? data.photoURL ?? "",
      role: data.role ?? "user",
      totalXp: typeof data.totalXp === "number" ? data.totalXp : 0,
      level: typeof data.level === "number" ? data.level : 0,
      onboardingCompleted: !!(data.onboardingCompleted || data.username),
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileLite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function refreshProfile() {
    if (!auth.currentUser) return;
    setProfile(await readProfileLite(auth.currentUser.uid));
  }

  useEffect(() => {
    // Handle the result when the user returns from the redirect sign-in flow.
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          const needsOnboarding = await ensureProfile(result.user);
          router.push(needsOnboarding ? "/onboarding" : "/projects");
        }
      })
      .catch((err) => setError(firebaseErrorMessage(err)));

    // onIdTokenChanged fires on sign-in, sign-out, and token refresh (every ~1 h).
    // We use it to keep the __session cookie in sync so the middleware can
    // protect routes without needing Firebase Admin SDK in Edge Runtime.
    const unsubscribe = onIdTokenChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        const token = await u.getIdToken();
        document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Lax`;
        setProfile(await readProfileLite(u.uid));
      } else {
        document.cookie = "__session=; path=/; max-age=0; SameSite=Lax";
        setProfile(null);
      }
    });
    return unsubscribe;
  }, [router]);

  async function signInWithGoogle() {
    setError(null);
    await signInWithRedirect(auth, new GoogleAuthProvider());
  }

  async function signInWithGitHub() {
    setError(null);
    await signInWithRedirect(auth, new GithubAuthProvider());
  }

  async function signOut() {
    await firebaseSignOut(auth);
    router.push("/");
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, signInWithGoogle, signInWithGitHub, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
