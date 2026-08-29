// app/(main)/liked-songs/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart, Play, Pause, Shuffle, Music, Trash2 } from "lucide-react";
import { usePlayerStore, Track } from "@/store/playerStore";
import { useLikedStore } from "@/store/likedStore";

function YoutubeIcon({ size = 12, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export default function LikedSongsPage() {
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayerStore();
  const { likedSongs, toggleLike, removeLiked } = useLikedStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handlePlay = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, likedSongs);
    }
  };

  const handlePlayAll = () => {
    if (likedSongs.length > 0) {
      playTrack(likedSongs[0], likedSongs);
    }
  };

  return (
    <div className="animate-fade-in pb-12">
      {/* ── Hero Header ── */}
      <div
        className="
          flex flex-col sm:flex-row items-start sm:items-end gap-6
          px-6 sm:px-8 pt-12 pb-8
          border-b border-[var(--border)]
        "
        style={{ background: "linear-gradient(to bottom, rgba(239, 68, 68, 0.15), transparent)" }}
      >
        {/* Cover art */}
        <div
          className="
            w-36 h-36 sm:w-44 sm:h-44
            rounded-[var(--radius-xl)] flex-shrink-0
            bg-gradient-to-br from-red-500 via-rose-500 to-pink-600
            flex items-center justify-center
            shadow-2xl shadow-red-500/20
          "
        >
          <Heart size={64} className="text-white" fill="white" />
        </div>

        {/* Info */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-red-400 mb-2">
            Your Collection
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] mb-3">
            Liked Songs
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            {likedSongs.length} {likedSongs.length === 1 ? "song" : "songs"} saved to your library
          </p>

          {/* Actions */}
          {likedSongs.length > 0 && (
            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={handlePlayAll}
                className="
                  w-12 h-12 rounded-full
                  bg-red-500 text-white
                  flex items-center justify-center
                  hover:bg-red-600
                  shadow-lg shadow-red-500/30
                  transition-all hover:scale-105
                "
              >
                <Play size={20} className="ml-0.5" strokeWidth={2.5} />
              </button>
              <button
                onClick={handlePlayAll}
                className="btn btn-ghost flex items-center gap-2 border border-white/10"
              >
                <Shuffle size={16} />
                Play Queue
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-6 sm:px-8 pt-6">
        {likedSongs.length === 0 ? (
          <div className="text-center py-16 px-4 bg-[var(--bg-surface)]/50 rounded-2xl border border-[var(--border)] max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <Heart size={28} />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
              No Liked Songs Yet
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Click the <Heart size={12} className="inline text-red-400 fill-red-400" /> heart icon on any track in your Playlist or Now Playing Sidebar to save it here!
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {likedSongs.map((track, i) => {
              const isCurrent = currentTrack?.id === track.id;
              const trackSrc = track.audioUrl || track.url || "";
              const isYt = track.type === "youtube" || trackSrc.includes("youtube.com") || trackSrc.includes("youtu.be");

              return (
                <div
                  key={track.id || i}
                  onClick={() => handlePlay(track)}
                  className={`
                    group flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all border border-transparent
                    ${
                      isCurrent
                        ? "bg-red-500/10 border-red-500/20 text-red-400 shadow-sm"
                        : "hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }
                  `}
                >
                  {/* Index / Equalizer */}
                  <div className="w-6 text-center shrink-0 text-xs font-mono">
                    {isCurrent && isPlaying ? (
                      <span className="flex items-end justify-center gap-0.5 h-3">
                        <span className="w-0.5 bg-red-400 animate-bounce h-full"></span>
                        <span className="w-0.5 bg-red-400 animate-bounce h-2 delay-100"></span>
                        <span className="w-0.5 bg-red-400 animate-bounce h-2.5 delay-200"></span>
                      </span>
                    ) : (
                      <span className="group-hover:hidden text-[var(--text-muted)]">{i + 1}</span>
                    )}
                    {!isCurrent && (
                      <Play size={14} className="hidden group-hover:block mx-auto text-[var(--text-primary)] ml-0.5" />
                    )}
                  </div>

                  {/* Artwork */}
                  <div className="w-11 h-11 rounded-lg overflow-hidden bg-black/40 shrink-0 border border-white/5 relative">
                    <img
                      src={track.thumbnail || "/assets/images/default-song.png"}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Title & Artist */}
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold truncate ${isCurrent ? "text-red-400" : ""}`}>
                      {track.title}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] truncate">
                      {track.artist || "Unknown Artist"}
                    </p>
                  </div>

                  {/* Source Tag */}
                  {isYt ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-semibold border border-red-500/20 shrink-0 hidden sm:inline-flex items-center gap-1">
                      <YoutubeIcon size={10} /> YouTube
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20 shrink-0 hidden sm:inline-flex items-center gap-1">
                      <Music size={10} /> MP3
                    </span>
                  )}

                  {/* Heart / Remove Action */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLiked(track.id);
                    }}
                    className="p-2 rounded-lg text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                    title="Remove from Liked Songs"
                  >
                    <Heart size={18} fill="currentColor" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}