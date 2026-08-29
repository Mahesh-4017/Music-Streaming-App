// app/(main)/library/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  ListMusic,
  Heart,
  Clock,
  Music2,
  LayoutGrid,
  List,
  ChevronRight,
  Play,
} from "lucide-react";
import { usePlayerStore, Track } from "@/store/playerStore";
import { useLikedStore } from "@/store/likedStore";

function YoutubeIcon({ size = 12, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

type FilterTab = "all" | "playlists" | "youtube" | "mp3";
type ViewMode = "grid" | "list";

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [songs, setSongs] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const { playTrack } = usePlayerStore();
  const { likedSongs } = useLikedStore();

  useEffect(() => {
    setMounted(true);
    const fetchSongs = async () => {
      try {
        const res = await fetch("/api/songs");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const mapped: Track[] = data.data.map((s: any) => ({
            id: s._id,
            title: s.title,
            artist: s.artist,
            audioUrl: s.audioUrl,
            thumbnail: s.thumbnailUrl || "/assets/images/default-song.png",
            type: s.type || (s.audioUrl?.includes("youtube") ? "youtube" : "audio"),
          }));
          setSongs(mapped);
        }
      } catch (err) {
        console.error("Failed to load library songs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (!mounted) return null;

  const filtered = songs.filter((item) => {
    const isYt = item.type === "youtube" || (item.audioUrl && item.audioUrl.includes("youtube"));
    if (activeTab === "youtube") return isYt;
    if (activeTab === "mp3") return !isYt;
    return true;
  });

  return (
    <div className="container py-8 animate-fade-in pb-16">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="label-overline mb-1 text-[var(--brand)] font-bold">Your Music Library</p>
          <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">
            Library
          </h1>
        </div>
        <Link
          href="/playlist"
          className="btn btn-primary flex items-center gap-2 px-4 py-2 text-xs font-semibold"
        >
          <Plus size={16} />
          <span>Add Music</span>
        </Link>
      </div>

      {/* ── Quick Access Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {/* Liked Songs */}
        <Link
          href="/liked-songs"
          className="
            flex items-center gap-4 p-4
            bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20
            rounded-[var(--radius-lg)]
            hover:border-red-500/40 hover:scale-[1.01]
            transition-all group shadow-sm
          "
        >
          <div className="w-12 h-12 rounded-[var(--radius-md)] bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-red-500/20 text-white">
            <Heart size={22} fill="white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold text-[var(--text-primary)] group-hover:text-red-400 transition-colors">
              Liked Songs
            </p>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              {likedSongs.length} {likedSongs.length === 1 ? "song" : "songs"} saved
            </p>
          </div>
          <ChevronRight size={18} className="text-[var(--text-muted)] group-hover:text-red-400 transition-colors" />
        </Link>

        {/* My YouTube & Saved Tracks Playlist */}
        <Link
          href="/playlist"
          className="
            flex items-center gap-4 p-4
            bg-gradient-to-r from-violet-500/10 to-transparent border border-violet-500/20
            rounded-[var(--radius-lg)]
            hover:border-violet-500/40 hover:scale-[1.01]
            transition-all group shadow-sm
          "
        >
          <div className="w-12 h-12 rounded-[var(--radius-md)] bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center flex-shrink-0 shadow-md shadow-violet-500/20 text-white">
            <ListMusic size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold text-[var(--text-primary)] group-hover:text-violet-400 transition-colors">
              My Saved Playlist
            </p>
            <p className="text-xs text-[var(--text-muted)] font-medium">
              {songs.length} {songs.length === 1 ? "track" : "tracks"} in MongoDB
            </p>
          </div>
          <ChevronRight size={18} className="text-[var(--text-muted)] group-hover:text-violet-400 transition-colors" />
        </Link>
      </div>

      {/* ── Filter Tabs + View Mode ── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { key: "all", label: `All Tracks (${songs.length})` },
            { key: "youtube", label: `YouTube Music (${songs.filter((s) => s.type === "youtube" || s.audioUrl?.includes("youtube")).length})` },
            { key: "mp3", label: `MP3 Audio (${songs.filter((s) => s.type !== "youtube" && !s.audioUrl?.includes("youtube")).length})` },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as FilterTab)}
              className={`
                px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all
                ${
                  activeTab === t.key
                    ? "bg-[var(--brand)] border-[var(--brand)] text-white shadow-sm"
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
            className={`p-1.5 rounded-lg border transition-colors ${
              viewMode === "grid"
                ? "bg-[var(--brand)]/20 border-[var(--brand)] text-[var(--brand)]"
                : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
            title="Grid View"
          >
            <LayoutGrid size={15} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-lg border transition-colors ${
              viewMode === "list"
                ? "bg-[var(--brand)]/20 border-[var(--brand)] text-[var(--brand)]"
                : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
            title="List View"
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* ── Library Tracks Section ── */}
      {loading ? (
        <div className="py-16 text-center text-xs text-[var(--text-muted)]">
          Loading library collection...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-[var(--border)] rounded-2xl bg-[var(--bg-surface)]">
          <Music2 size={44} className="text-[var(--text-muted)] mx-auto mb-3 opacity-50" />
          <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">
            No Tracks Found
          </h3>
          <p className="text-xs text-[var(--text-muted)] mb-4">
            Add YouTube links or MP3 files to populate your Library.
          </p>
          <Link href="/playlist" className="btn btn-primary text-xs px-4 py-2">
            Add Songs
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((item) => {
            const isYt = item.type === "youtube" || (item.audioUrl && item.audioUrl.includes("youtube"));

            return (
              <div
                key={item.id}
                onClick={() => playTrack(item, songs)}
                className="group relative bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--brand)]/40 p-3 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 shadow-sm hover:shadow-xl"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-black/40 border border-white/5">
                  <img
                    src={item.thumbnail || "/assets/images/default-song.png"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[var(--brand)] text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <Play size={18} className="ml-0.5" />
                    </div>
                  </div>
                  {isYt && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500 text-white shadow-md">
                      YT
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
                  {item.artist || "Unknown Artist"}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-1.5">
          {filtered.map((item, i) => {
            const isYt = item.type === "youtube" || (item.audioUrl && item.audioUrl.includes("youtube"));

            return (
              <div
                key={item.id}
                onClick={() => playTrack(item, songs)}
                className="group flex items-center gap-3 p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--brand)]/30 hover:bg-[var(--bg-elevated)] cursor-pointer transition-all"
              >
                <span className="text-xs font-mono text-[var(--text-muted)] w-5 text-center shrink-0">
                  {i + 1}
                </span>

                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-black/40 border border-white/5">
                  <img
                    src={item.thumbnail || "/assets/images/default-song.png"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] truncate">
                    {item.artist || "Unknown Artist"}
                  </p>
                </div>

                {isYt ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-semibold border border-red-500/20 shrink-0 flex items-center gap-1">
                    <YoutubeIcon size={10} /> YouTube
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20 shrink-0">
                    MP3
                  </span>
                )}

                <div className="w-8 h-8 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play size={14} className="ml-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}