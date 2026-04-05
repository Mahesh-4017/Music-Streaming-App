"use client";

import Image from "next/image";
import {
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Music2,
} from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";

// ── Format seconds → "3:42" ──────────────────────────────────────
function fmt(s: number) {
  if (!s || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ── Animated waveform (CSS only) ─────────────────────────────────
function WaveBars({ playing }: { playing: boolean }) {
  return (
    <span className="mini-wave" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="mini-wave-bar"
          style={{
            animationPlayState: playing ? "running" : "paused",
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </span>
  );
}

export default function MiniPlayer() {
  const {
    currentSong,
    isPlaying,
    progress, // 0–1 float expected (or 0–100 — adjust divisor below)
    currentTime,
    duration,
    playSong,
    togglePlay,
    next,
    prev,
    seek,

    setTime,
  } = usePlayerStore();

  if (!currentSong) return null;

  // Support both 0-1 and 0-100 progress from store
  const pct = progress > 1 ? progress : progress * 100;

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    if (!duration || !setTime) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width),
    );
    setTime(ratio * duration);
  }

  return (
    <>
      <div className="mini-player">
        {/* ── Row 1: art + meta + waveform ──────────────────────── */}
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Album art */}
          <div className="mini-art">
            {currentSong.thumbnail ? (
              <Image
                src={currentSong.thumbnail}
                alt={currentSong.title}
                width={36}
                height={36}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="mini-art-fallback">
                <Music2 size={14} />
              </div>
            )}
          </div>

          {/* Title + artist */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[var(--text-primary)] truncate leading-tight">
              {currentSong.title}
            </p>
            <p className="text-[10px] text-[var(--text-muted)] truncate mt-0.5">
              {currentSong.artist}
            </p>
          </div>

          {/* Live waveform when playing */}
          {isPlaying && <WaveBars playing={isPlaying} />}
        </div>

        {/* ── Row 2: controls ────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-3">
          <button className="mini-ctrl" onClick={prev} aria-label="Previous">
            <SkipBack size={13} />
          </button>

          <button
            className="mini-play"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          </button>

          <button className="mini-ctrl" onClick={next} aria-label="Next">
            <SkipForward size={13} />
          </button>
        </div>

        {/* ── Row 3: seek bar + times ────────────────────────────── */}
        <div className="space-y-1">
          <div
            className="mini-seek"
            onClick={handleSeek}
            role="slider"
            aria-label="Seek"
            aria-valuenow={Math.round(pct)}
            tabIndex={0}
          >
            <div className="mini-seek-fill" style={{ width: `${pct}%` }} />
          </div>

          {/* Timestamps */}
          <div className="flex justify-between">
            <span className="text-[9px] text-[var(--text-muted)] font-variant-numeric tabular-nums">
              {fmt(currentTime ?? 0)}
            </span>
            <span className="text-[9px] text-[var(--text-muted)] tabular-nums">
              {fmt(duration ?? 0)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
