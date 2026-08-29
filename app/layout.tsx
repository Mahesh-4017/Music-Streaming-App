// app/layout.tsx  —  ROOT layout with Josefin Sans & Tuscan Sunset theme
import type { Metadata, Viewport } from "next";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/player/SessionWrapper";

// ─── Font Configuration ───────────────────────────────────────────────────────
const josefinSans = Josefin_Sans({
  variable: "--font-josefin",
  subsets:  ["latin"],
  weight:   ["300", "400", "500", "600", "700"],
  display:  "swap",
});

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default:  "Musify",
    template: "%s · Musify",
  },
  description: "Your music, everywhere. Stream millions of songs in Tuscan Sunset aesthetic.",
  keywords:    ["music", "streaming", "songs", "playlist", "artist"],
  authors:     [{ name: "Musify" }],
  icons: {
    icon:  "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type:        "website",
    siteName:    "Musify",
    title:       "Musify — Your music, everywhere",
    description: "Stream millions of songs, create playlists, discover new artists.",
  },
};

export const viewport: Viewport = {
  themeColor:    "#171213",
  colorScheme:   "dark",
  width:         "device-width",
  initialScale:  1,
  maximumScale:  1,
};

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${josefinSans.variable} h-full`}
    >
      <body
        className="
          min-h-full
          bg-[var(--bg-base)]
          text-[var(--text-primary)]
          font-[family-name:var(--font-josefin)]
          antialiased
          overflow-x-hidden
        "
      >
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
