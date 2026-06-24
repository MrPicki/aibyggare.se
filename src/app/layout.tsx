import type { Metadata } from "next";
import { Geist, Fredoka, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementMarquee } from "@/components/home/AnnouncementMarquee";
import { AuthProvider } from "@/contexts/AuthContext";

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aibyggare.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AIbyggare.se — För oss som bygger först och förstår sen",
    template: "%s — AIbyggare.se",
  },
  description:
    "En svensk community för AI-byggare, vibe coders och envisa nybörjare. Visa upp ditt bygge, få hjälp när du fastnar, dela prompts som faktiskt funkade.",
  keywords: [
    "AI-byggare",
    "vibe coding",
    "bygga med AI",
    "Claude Code",
    "Cursor",
    "Lovable",
    "community",
    "Sverige",
    "indie hacker",
    "prompts",
  ],
  applicationName: "AIbyggare.se",
  authors: [{ name: "AIbyggare.se" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "AIbyggare.se — För oss som bygger först och förstår sen",
    description:
      "En svensk community för AI-byggare, vibe coders och envisa nybörjare.",
    url: SITE_URL,
    siteName: "AIbyggare.se",
    locale: "sv_SE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIbyggare.se",
    description:
      "Sveriges community för dig som bygger appar och produkter med AI.",
  },
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
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuthProvider>
          <AnnouncementMarquee />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
