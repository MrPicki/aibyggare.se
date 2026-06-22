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

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
      } else {
        document.cookie = "__session=; path=/; max-age=0; SameSite=Lax";
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
    <AuthContext.Provider value={{ user, loading, error, signInWithGoogle, signInWithGitHub, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
