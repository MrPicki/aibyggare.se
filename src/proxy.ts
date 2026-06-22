import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication.
const PROTECTED_PATHS = [
  "/projects/new",
  "/help/new",
  "/prompts/new",
  "/guides/new",
  "/settings",
  "/onboarding",
];

// Middleware runs in Edge Runtime — Firebase Admin SDK cannot be used here.
// We decode the JWT payload (no crypto verification) to check expiry.
// Real security lives in Firestore Security Rules; this guard only prevents
// unauthenticated users from seeing protected UIs.
function isTokenValid(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const json = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    const { exp } = JSON.parse(json) as { exp?: number };
    return typeof exp === "number" && exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("__session")?.value;

  if (!token || !isTokenValid(token)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/projects/new",
    "/help/new",
    "/prompts/new",
    "/guides/new",
    "/settings",
    "/onboarding",
  ],
};
