import type { NextConfig } from "next";

// Firebase Auth helper lives at <projectId>.firebaseapp.com/__/auth/*.
// We transparently reverse-proxy it under our own origin so the OAuth
// round-trip is first-party — otherwise browser storage partitioning
// makes getRedirectResult() return null and the login "bounces back".
const firebaseAppDomain = `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`;

const nextConfig: NextConfig = {
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
