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

export const metadata: Metadata = {
  title: "AIbyggare.se — För oss som bygger först och förstår sen",
  description:
    "En svensk community för AI-byggare, vibe coders och envisa nybörjare. Visa upp ditt bygge, få hjälp när du fastnar, dela prompts som faktiskt funkade.",
  openGraph: {
    title: "AIbyggare.se — För oss som bygger först och förstår sen",
    description:
      "En svensk community för AI-byggare, vibe coders och envisa nybörjare.",
    locale: "sv_SE",
    type: "website",
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
