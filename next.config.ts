import type { NextConfig } from "next";

// Firebase Auth helper lives at <projectId>.firebaseapp.com/__/auth/*.
// We transparently reverse-proxy it under our own origin so the OAuth
// round-trip is first-party — otherwise browser storage partitioning
// makes getRedirectResult() return null and the login "bounces back".
const firebaseAppDomain = `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`;

// HTTP security headers applied to all routes.
// CSP uses 'unsafe-inline'/'unsafe-eval' for Next.js hydration compatibility.
// Nonce-based strict CSP is a future improvement once the app stabilises.
const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js needs unsafe-inline (hydration scripts) and unsafe-eval (dynamic imports).
      // Google Sign-in popup loads from apis.google.com.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://accounts.google.com",
      "style-src 'self' 'unsafe-inline'",
      // next/font/google bakes fonts into /_next/static — only 'self' + data: needed.
      "font-src 'self' data:",
      // Images: self + all https (Firebase Storage, Google/GitHub avatars) + data/blob (previews).
      "img-src 'self' https: data: blob:",
      // API calls: Firebase services, Google OAuth.
      "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://accounts.google.com",
      // Firebase Auth redirect flow uses an iframe on <project>.firebaseapp.com.
      "frame-src 'self' https://aibyggare-c45c6.firebaseapp.com https://accounts.google.com https://github.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://accounts.google.com https://github.com",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // firebase-admin använder dynamiska require/native-beroenden som går sönder
  // om Next.js försöker bundla det. Markera som externt så det laddas direkt
  // från node_modules i serverless-funktionen — annars kraschar importen på
  // Vercel med 500 redan innan vår try/catch i admin.ts hinner köra.
  serverExternalPackages: ["firebase-admin"],
  images: {
    remotePatterns: [
      // Firebase Storage (project cover images, user avatars)
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      // Google profile pictures (via Google Sign-In)
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // GitHub profile pictures (via GitHub Sign-In)
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/__/auth/:path*",
        destination: `https://${firebaseAppDomain}/__/auth/:path*`,
      },
      {
        source: "/__/firebase/:path*",
        destination: `https://${firebaseAppDomain}/__/firebase/:path*`,
      },
    ];
  },
};

export default nextConfig;
