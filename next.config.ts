import type { NextConfig } from "next";

// Firebase Auth helper lives at <projectId>.firebaseapp.com/__/auth/*.
// We transparently reverse-proxy it under our own origin so the OAuth
// round-trip is first-party — otherwise browser storage partitioning
// makes getRedirectResult() return null and the login "bounces back".
const firebaseAppDomain = `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`;

const nextConfig: NextConfig = {
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
