// components/layout/MobilePlayer.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Pause, SkipBack, SkipForward, Heart, Music2 } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";

export default function MobilePlayer() {
  const {
    currentTrack,
    isPlaying,
    progress,
    togglePlay,
    next,
    prev,
  } = usePlayerStore();

  if (!currentTrack) return null;

  // ── resolve thumbnail ────────────────────────────────────────────────────
  // music library tracks have thumbnail; playlist tracks (YouTube) use YT img
  const ytId = currentTrack.url?.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/\s]{11})/
  )?.[1];

  const thumbSrc =
    currentTrack.thumbnail ??
    (ytId ? `https://img.youtube.com/vi/${ytId}/default.jpg` : null);

  return (
    <div
      className="lg:hidden fixed left-3 right-3 z-[calc(var(--z-player)-1)] animate-fade-in"
      style={{ bottom: "calc(var(--nav-height-mobile) + 8px)" }}
    >
      <div className="relative overflow-hidden bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)]">

        {/* ── Progress bar flush at top ─────────────────────────────────── */}
        <div className="h-0.5 bg-[var(--bg-surface)] w-full">
          <div
            className="h-full bg-[var(--brand)] transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ── Main row ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-3 py-2.5">

          {/* Thumbnail — always shows image, never video */}
          <Link href="/player" className="shrink-0">
            <div className="w-10 h-10 rounded-[var(--radius-md)] overflow-hidden bg-[var(--bg-surface)] flex items-center justify-center">
              {thumbSrc ? (
                <Image
                  src={thumbSrc}
                  alt={currentTrack.title}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              ) : (
                // fallback waveform icon when no thumbnail available
                <span className="flex items-end gap-[2px] h-4 px-1">
                  {[3, 6, 4, 7, 4].map((h, i) => (
                    <span
                      key={i}
                      className="w-[2px] rounded-full bg-[var(--brand)]"
                      style={{
                        height: `${h}px`,
                        animation: isPlaying
                          ? `barWave 0.8s ease-in-out ${i * 0.1}s infinite alternate`
                          : "none",
                        opacity: isPlaying ? 1 : 0.4,
                      }}
                    />
                  ))}
                </span>
              )}
            </div>
          </Link>

          {/* Song info */}
          <Link href="/player" className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate leading-tight">
              {currentTrack.title}
            </p>
            <p className="text-xs text-[var(--text-muted)] truncate leading-tight mt-0.5">
              {currentTrack.artist ?? (currentTrack.type === "youtube" ? "YouTube" : "Audio")}
            </p>
          </Link>

          {/* Controls */}
          <div
            className="flex items-center gap-1 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev */}
            <button
              onClick={prev}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-base)] transition-all active:scale-90"
              aria-label="Previous"
            >
              <SkipBack size={15} />
            </button>

            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-[var(--brand)] text-white flex items-center justify-center hover:bg-[var(--brand-dark)] active:scale-90 transition-all shadow-[var(--shadow-brand)]"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying
                ? <Pause size={15} strokeWidth={2.5} />
                : <Play  size={15} strokeWidth={2.5} />
              }
            </button>

            {/* Next */}
            <button
              onClick={next}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-base)] transition-all active:scale-90"
              aria-label="Next"
            >
              <SkipForward size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}