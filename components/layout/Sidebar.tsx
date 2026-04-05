// components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library, Heart, ListMusic, Music2, Upload, Music3 } from "lucide-react";
import MiniPlayer from "@/components/player/MiniPlayer";
import { MuseoModerno } from "next/font/google";
import PlayerProvider from "../player/PlayerProvider";
 import { PlayerBar } from "@/components/music/PlayerBar";
import { usePlayerStore } from "@/store/player";

// ─── Nav config ───────────────────────────────────────────────────────────────
const NAV = [
  { href: "/",        icon: Home,    label: "Home"    },
  { href: "/search",  icon: Search,  label: "Search"  },
  { href: "/library", icon: Library, label: "Library" },
] as const;

const LIBRARY_NAV = [
  { href: "/liked-songs", icon: Heart,     label: "Liked Songs" },
  { href: "/playlist",   icon: ListMusic, label: "Playlists"   },
  { href: "/upload",   icon: Upload, label: "Upload Music"   },
    { href: "/your-music",   icon: Music2, label: "Your Music"   },
        { href: "/music",   icon: Music3, label: "YouTube Music"   },

] as const;

// ─── Nav link ─────────────────────────────────────────────────────────────────
function NavLink({
  href,
  icon: Icon,
  label,
  active,
}: {
  href:   string;
  icon:   React.ElementType;
  label:  string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-3 py-2
        rounded-[var(--radius-md)] text-sm
        transition-colors duration-[var(--duration-fast)]
        ${active
          ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] font-medium"
          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/60"
        }
      `}
    >
      <Icon
        size={16}
        strokeWidth={active ? 2.5 : 1.75}
        className={active ? "text-[var(--brand)]" : ""}
      />
      {label}
    </Link>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export default function Sidebar() {
  const pathname = usePathname();
    const { currentTrack, isPlaying, togglePlay } = usePlayerStore();


  return (
    <aside
      className="
        hidden lg:flex flex-col
        w-56 xl:w-64
        h-screen sticky top-0
        bg-[var(--bg-surface)]
        border-r border-[var(--border)]
        py-10 px-2 gap-1
        overflow-y-auto
      "
    >
      {/* ── Logo ── */}
      <Link
        href="/"
        className="
          flex items-center gap-2.5
          px-2 pb-4 mb-2
          border-b border-[var(--border)]
          group
        "
      >
        <div
          className="
            w-8 h-8 rounded-[var(--radius-md)]
            bg-[var(--brand)]
            flex items-center justify-center
            flex-shrink-0
            group-hover:bg-[var(--brand-dark)]
            transition-colors
          "
        >
          <Music2 size={16} className="text-white" strokeWidth={2} />
        </div>
        <span
          className="
            font-[family-name:var(--font-display)]
            font-bold text-base
            text-[var(--text-primary)]
          "
        >
          Musify
        </span>
      </Link>

      {/* ── Main nav ── */}
      <div className="flex flex-col gap-0.5">
        {NAV.map(({ href, icon, label }) => (
          <NavLink
            key={href}
            href={href}
            icon={icon}
            label={label}
            active={pathname === href}
          />
        ))}
      </div>

      {/* ── Library section ── */}
      <p
        className="
          label-overline
          px-3 pt-5 pb-2
        "
      >
        Your Music
      </p>
      <div className="flex flex-col gap-0.5">
        {LIBRARY_NAV.map(({ href, icon, label }) => (
          <NavLink
            key={href}
            href={href}
            icon={icon}
            label={label}
            active={pathname.startsWith(href)}
          />
        ))}
      </div>

      {/* ── Mini player pinned to bottom ── */}
      <div
        className="
          mt-auto pt-4
          border-t border-[var(--border)]
        "
      >
        <PlayerProvider />
        <MiniPlayer />
      <PlayerBar
        track={currentTrack}
        state={{
          isPlaying,
          currentTrackId: currentTrack?.id || null,
          currentTime: 0,
          duration: 0,
          volume: 1,
        }}
        onTogglePlay={togglePlay}
        onSeek={() => {}}
        onSetVolume={() => {}}
        onPrev={() => {}}
        onNext={() => {}}
        hasPrev={false}
        hasNext={false}
      />

      </div>
    </aside>
  );
}