import type { Metadata, Viewport } from "next";
import { Geist, Fredoka, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementMarquee } from "@/components/home/AnnouncementMarquee";
import { AuthProvider } from "@/contexts/AuthContext";
import { FeedbackButton } from "@/components/feedback/FeedbackButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Mono — nav, labels, metadata, knappar. Stödjer å ä ö.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

// Display — chunky, puffiga rubriker. Stödjer å ä ö.
const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aibyggare.se";

// Lås sidan till telefonens bredd och stäng av auto-zoom (iOS zoomar annars in
// när man fokuserar fält). maximumScale + userScalable håller layouten stabil.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#64B26A",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AIbyggare.se — För oss som bygger med AI",
    template: "%s — AIbyggare.se",
  },
  description:
    "Sveriges community för AI-byggare, vibe coders och envisa nybörjare. Visa upp ditt bygge, få hjälp när du fastnar, dela prompts som faktiskt funkade.",
  keywords: [
    "AI byggare",
    "vibe coding",
    "bygga med AI",
    "Claude Code",
    "Cursor",
    "Lovable",
    "Bolt",
    "community Sverige",
    "indie hacker",
    "prompts AI",
    "Next.js",
    "Firebase",
    "Supabase",
    "Vercel",
    "AI-projekt",
    "apputveckling AI",
  ],
  applicationName: "AIbyggare.se",
  authors: [{ name: "AIbyggare.se", url: SITE_URL }],
  creator: "AIbyggare.se",
  publisher: "AIbyggare.se",
  alternates: {
    canonical: SITE_URL,
    types: { "application/rss+xml": `${SITE_URL}/feed.xml` },
  },
  openGraph: {
    title: "AIbyggare.se — För oss som bygger med AI",
    description:
      "Sveriges community för AI-byggare, vibe coders och envisa nybörjare. Bygg med AI. Visa upp. Få hjälp.",
    url: SITE_URL,
    siteName: "AIbyggare.se",
    locale: "sv_SE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIbyggare.se — För oss som bygger med AI",
    description:
      "Sveriges community för AI-byggare, vibe coders och envisa nybörjare. Bygg med AI. Visa upp. Få hjälp.",
    site: "@aibyggare",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AIbyggare.se",
  alternateName: "AI Byggare Sverige",
  url: SITE_URL,
  description:
    "Sveriges community för AI-byggare, vibe coders och envisa nybörjare.",
  inLanguage: "sv",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/projects?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  sameAs: [
    "https://www.instagram.com/aibyggare",
    "https://twitter.com/aibyggare",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sv"
      className={`${geistSans.variable} ${plexMono.variable} ${fredoka.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuthProvider>
          <AnnouncementMarquee />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FeedbackButton />
        </AuthProvider>
      </body>
    </html>
  );
}
