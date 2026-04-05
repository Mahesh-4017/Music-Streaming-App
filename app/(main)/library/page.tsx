// app/(main)/library/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Plus, ListMusic, Heart, Clock, Music2,
  LayoutGrid, List, ChevronRight, Play,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type FilterTab = "all" | "playlists" | "albums" | "artists";
type ViewMode  = "grid" | "list";

interface LibraryItem {
  id:        string;
  title:     string;
  subtitle:  string;
  thumbnail: string;
  type:      "playlist" | "album" | "artist";
  count?:    number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const LIBRARY_ITEMS: LibraryItem[] = [
  { id:"1", title:"Chill Vibes",        subtitle:"Playlist · 24 songs",  thumbnail:"https://picsum.photos/seed/l1/200/200", type:"playlist", count:24 },
  { id:"2", title:"Workout Mix",         subtitle:"Playlist · 18 songs",  thumbnail:"https://picsum.photos/seed/l2/200/200", type:"playlist", count:18 },
  { id:"3", title:"After Hours",         subtitle:"The Weeknd · Album",   thumbnail:"https://picsum.photos/seed/l3/200/200", type:"album"    },
  { id:"4", title:"SOS",                 subtitle:"SZA · Album",          thumbnail:"https://picsum.photos/seed/l4/200/200", type:"album"    },
  { id:"5", title:"The Weeknd",          subtitle:"Artist",               thumbnail:"https://picsum.photos/seed/l5/200/200", type:"artist"   },
  { id:"6", title:"Late Night Drive",    subtitle:"Playlist · 12 songs",  thumbnail:"https://picsum.photos/seed/l6/200/200", type:"playlist", count:12 },
  { id:"7", title:"Dua Lipa",            subtitle:"Artist",               thumbnail:"https://picsum.photos/seed/l7/200/200", type:"artist"   },
  { id:"8", title:"Renaissance",         subtitle:"Beyoncé · Album",      thumbnail:"https://picsum.photos/seed/l8/200/200", type:"album"    },
];

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all",       label: "All"       },
  { key: "playlists", label: "Playlists" },
  { key: "albums",    label: "Albums"    },
  { key: "artists",   label: "Artists"   },
];

// ─── Grid Card ────────────────────────────────────────────────────────────────
function GridCard({ item }: { item: LibraryItem }) {
  const href =
    item.type === "playlist" ? `/playlist/${item.id}` :
    item.type === "album"    ? `/album/${item.id}`    :
    `/artist/${item.id}`;

  return (
    <Link href={href} className="music-card group block">
      <div className="relative aspect-square">
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          className={`
            object-cover bg-[var(--bg-elevated)]
            ${item.type === "artist"
              ? "rounded-full"
              : "rounded-[var(--radius-md)]"
            }
          `}
        />
        <div className="music-card__overlay rounded-[var(--radius-md)]" />
        <button className="music-card__play">
          <Play size={18} strokeWidth={2.5} />
        </button>
      </div>
      <div className="mt-2.5 px-0.5">
        <p className="text-sm font-medium text-[var(--text-primary)] truncate">
          {item.title}
        </p>
        <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
          {item.subtitle}
        </p>
      </div>
    </Link>
  );
}

// ─── List Row ─────────────────────────────────────────────────────────────────
function ListRow({ item }: { item: LibraryItem }) {
  const href =
    item.type === "playlist" ? `/playlist/${item.id}` :
    item.type === "album"    ? `/album/${item.id}`    :
    `/artist/${item.id}`;

  return (
    <Link
      href={href}
      className="
        flex items-center gap-3 px-3 py-2.5
        rounded-[var(--radius-md)]
        hover:bg-[var(--bg-elevated)]
        transition-colors group
      "
    >
      <div className="relative w-12 h-12 flex-shrink-0">
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          className={`
            object-cover bg-[var(--bg-elevated)]
            ${item.type === "artist" ? "rounded-full" : "rounded-[var(--radius-md)]"}
          `}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)] truncate">
          {item.title}
        </p>
        <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
          {item.subtitle}
        </p>
      </div>
      <ChevronRight size={15} className="text-[var(--text-muted)] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [viewMode,  setViewMode]  = useState<ViewMode>("grid");

  const filtered = LIBRARY_ITEMS.filter(item =>
    activeTab === "all"       ? true :
    activeTab === "playlists" ? item.type === "playlist" :
    activeTab === "albums"    ? item.type === "album"    :
    item.type === "artist"
  );

  return (
    <div className="container py-8 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="label-overline mb-1">Your collection</p>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Library
          </h1>
        </div>
        <Link
          href="/playlist/create"
          className="btn btn-primary flex items-center gap-2 px-4 py-2"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">New Playlist</span>
        </Link>
      </div>

      {/* ── Quick access ── */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <Link
          href="/liked-songs"
          className="
            flex items-center gap-3 p-4
            bg-[var(--bg-elevated)] border border-[var(--border)]
            rounded-[var(--radius-lg)]
            hover:border-[var(--border-hover)]
            transition-all group
          "
        >
          <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--brand)]/20 flex items-center justify-center flex-shrink-0">
            <Heart size={18} className="text-[var(--brand)]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Liked Songs</p>
            <p className="text-xs text-[var(--text-muted)]">128 songs</p>
          </div>
        </Link>
        <Link
          href="/history"
          className="
            flex items-center gap-3 p-4
            bg-[var(--bg-elevated)] border border-[var(--border)]
            rounded-[var(--radius-lg)]
            hover:border-[var(--border-hover)]
            transition-all group
          "
        >
          <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--brand)]/20 flex items-center justify-center flex-shrink-0">
            <Clock size={18} className="text-[var(--brand)]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Recently Played</p>
            <p className="text-xs text-[var(--text-muted)]">View history</p>
          </div>
        </Link>
      </div>

      {/* ── Filter tabs + view toggle ── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 no-scrollbar overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`
                px-4 py-1.5 rounded-[var(--radius-full)]
                text-xs font-semibold whitespace-nowrap
                border transition-all
                ${activeTab === t.key
                  ? "bg-[var(--brand)] border-[var(--brand)] text-white"
                  : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]"
                }
              `}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 ml-3">
          <button
            onClick={() => setViewMode("grid")}
            className={`btn-icon w-8 h-8 ${viewMode === "grid" ? "active" : ""}`}
          >
            <LayoutGrid size={14} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`btn-icon w-8 h-8 ${viewMode === "list" ? "active" : ""}`}
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* ── Items ── */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <Music2 size={40} className="text-[var(--text-muted)] mx-auto mb-4" />
          <p className="text-[var(--text-muted)] text-sm">Nothing here yet</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5 stagger">
          {filtered.map(item => <GridCard key={item.id} item={item} />)}
        </div>
      ) : (
        <div className="space-y-1 stagger">
          {filtered.map(item => <ListRow key={item.id} item={item} />)}
        </div>
      )}
    </div>
  );
}