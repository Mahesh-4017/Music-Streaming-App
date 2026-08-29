// components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Library,
  Heart,
  ListMusic,
  Music2,
  Folder,
} from "lucide-react";
import MiniPlayer from "@/components/player/MiniPlayer";
import PlayerProvider from "../player/PlayerProvider";
import { PlayerBar } from "@/components/music/PlayerBar";
import { usePlayerStore } from "@/store/player";
import { useUIStore } from "@/store/uiStore";
import { useFolderStore } from "@/store/folderStore";

// ─── Nav config ───────────────────────────────────────────────────────────────
const NAV = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/library", icon: Library, label: "Library" },
] as const;

const LIBRARY_NAV = [
  { href: "/liked-songs", icon: Heart, label: "Liked Songs" },
  { href: "/playlist", icon: ListMusic, label: "Playlists" },
  { href: "/your-music", icon: Music2, label: "Your Music" },
] as const;

// ─── Nav link ─────────────────────────────────────────────────────────────────
function NavLink({
  href,
  icon: Icon,
  label,
  active,
  collapsed,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={`
        flex items-center gap-3 py-2.5
        rounded-[var(--radius-md)] text-sm
        transition-all duration-[var(--duration-fast)] group relative
        ${collapsed ? "justify-center px-0 w-11 mx-auto" : "px-3 w-full"}
        ${active
          ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] font-medium"
          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/60"
        }
      `}
    >
      <Icon
        size={18}
        strokeWidth={active ? 2.5 : 1.75}
        className={`shrink-0 ${active ? "text-[var(--brand)]" : ""}`}
      />
      {!collapsed && <span className="truncate">{label}</span>}

      {/* Floating tooltip when collapsed */}
      {collapsed && (
        <span
          className="
            absolute left-full ml-3 px-2.5 py-1 text-xs font-medium text-white
            bg-[var(--bg-elevated)] border border-[var(--border)] rounded-md shadow-lg
            opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50
            whitespace-nowrap
          "
        >
          {label}
        </span>
      )}
    </Link>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export default function Sidebar() {
  const pathname = usePathname();
  const { currentTrack, isPlaying, togglePlay } = usePlayerStore();
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();
  const { folders } = useFolderStore();

  return (
    <aside
      className={`
        hidden lg:flex flex-col
        h-screen sticky top-0
        bg-[var(--bg-surface)]
        border-r border-[var(--border)]
        py-6 px-2 gap-1
        overflow-y-auto overflow-x-hidden
        transition-all duration-300 ease-in-out
        ${isSidebarCollapsed ? "w-[72px]" : "w-56 xl:w-64"}
      `}
    >
      {/* ── Header: Logo + Toggle ── */}
      <div className="flex items-center justify-between px-2 pb-4 mb-2 border-b border-[var(--border)]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="
              w-9 h-9 rounded-[var(--radius-md)]
              bg-[var(--brand)]
              flex items-center justify-center
              flex-shrink-0
              group-hover:bg-[var(--brand-dark)]
              transition-colors shadow-[var(--shadow-brand)]
            "
          >
            <Music2 size={18} className="text-white" strokeWidth={2} />
          </div>
          {!isSidebarCollapsed && (
            <span
              className="
                font-[family-name:var(--font-display)]
                font-bold text-lg tracking-tight
                text-[var(--text-primary)]
              "
            >
              Musify
            </span>
          )}
        </Link>
      </div>

      {/* ── Main nav ── */}
      <div className="flex flex-col gap-0.5">
        {NAV.map(({ href, icon, label }) => (
          <NavLink
            key={href}
            href={href}
            icon={icon}
            label={label}
            active={pathname === href}
            collapsed={isSidebarCollapsed}
          />
        ))}
      </div>

      {/* ── Library section header / divider ── */}
      {!isSidebarCollapsed ? (
        <p className="label-overline px-3 pt-5 pb-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Your Music
        </p>
      ) : (
        <div className="my-3 mx-auto w-8 h-[1px] bg-[var(--border)]" />
      )}

      <div className="flex flex-col gap-0.5">
        {LIBRARY_NAV.map(({ href, icon, label }) => (
          <NavLink
            key={href}
            href={href}
            icon={icon}
            label={label}
            active={pathname ? pathname.startsWith(href) : false}
            collapsed={isSidebarCollapsed}
          />
        ))}
      </div>

      {/* ── Music Folders section ── */}
      {!isSidebarCollapsed ? (
        <p className="label-overline px-3 pt-4 pb-1 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center justify-between">
          <span>Folders & Lists</span>
          <span className="text-[10px] bg-[var(--bg-elevated)] px-1.5 py-0.5 rounded text-[var(--brand)] font-bold">
            {folders.length}
          </span>
        </p>
      ) : (
        <div className="my-2 mx-auto w-6 h-[1px] bg-[var(--border)]" />
      )}

      <div className="flex flex-col gap-0.5 max-h-36 overflow-y-auto custom-scrollbar">
        {folders.map((f) => (
          <Link
            key={f.id}
            href="/playlist"
            title={isSidebarCollapsed ? f.name : undefined}
            className={`
              flex items-center gap-2.5 py-2 px-3
              rounded-[var(--radius-md)] text-xs
              transition-all text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/60
              ${isSidebarCollapsed ? "justify-center px-0 w-11 mx-auto" : "w-full"}
            `}
          >
            <Folder size={15} className="shrink-0 text-[var(--brand)]" />
            {!isSidebarCollapsed && <span className="truncate">{f.name}</span>}
          </Link>
        ))}
      </div>

      {/* ── Bottom Section: Quick Action ── */}
      {!isSidebarCollapsed ? (
        <div className="mt-auto pt-3 border-t border-[var(--border)]">
          <Link
            href="/your-music"
            className="
              w-full flex items-center justify-center gap-2 py-2.5 px-4
              rounded-[var(--radius-md)] text-xs font-semibold text-white
              bg-[var(--brand)] hover:bg-[var(--brand-dark)]
              shadow-[0_0_16px_rgba(42,82,190,0.3)]
              transition-all duration-200 active:scale-95
            "
          >
            <Music2 size={14} />
            <span>Add Music</span>
          </Link>
        </div>
      ) : (
        <div className="mt-auto pt-3 border-t border-[var(--border)] flex justify-center">
          <Link
            href="/your-music"
            title="Add Music"
            className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--brand)] text-white flex items-center justify-center hover:bg-[var(--brand-dark)] transition-colors shadow-md"
          >
            <Music2 size={16} />
          </Link>
        </div>
      )}
    </aside>
  );
}