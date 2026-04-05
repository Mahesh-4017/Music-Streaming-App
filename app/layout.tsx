// app/layout.tsx  —  ROOT layout (wraps everything)
import type { Metadata, Viewport } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/player/SessionWrapper";

// ─── Fonts ────────────────────────────────────────────────────────────────────
const syne = Syne({
  variable: "--font-display",
  subsets:  ["latin"],
  weight:   ["400", "500", "600", "700", "800"],
  display:  "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets:  ["latin"],
  weight:   ["300", "400", "500"],
  style:    ["normal", "italic"],
  display:  "swap",
});

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default:  "Musify",
    template: "%s · Musify",
  },
  description: "Your music, everywhere. Stream millions of songs.",
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
  themeColor:    "#0A0A0F",
  colorScheme:   "dark",
  width:         "device-width",
  initialScale:  1,
  maximumScale:  1,          // prevent zoom on iOS input focus
};

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`
        ${syne.variable}
        ${dmSans.variable}
        h-full
      `}
    >
      <body
        className="
          min-h-full
          bg-[var(--bg-base)]
          text-[var(--text-primary)]
          font-[family-name:var(--font-body)]
          antialiased
          overflow-x-hidden
        "
      >
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}


