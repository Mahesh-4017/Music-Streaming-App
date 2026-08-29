"use client";

import Image from "next/image";
import {
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Music2,
} from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";

function fmt(s: number) {
  if (!s || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

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
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    next,
    prev,
    seek,
  } = usePlayerStore();

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    if (!duration || !seek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width),
    );
    seek(ratio * duration);
  }

  return (
    <div className="mini-player">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="mini-art">
          {currentTrack.thumbnail ? (
            <Image
              src={currentTrack.thumbnail}
              alt={currentTrack.title}
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

        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[var(--text-primary)] truncate leading-tight">
            {currentTrack.title}
          </p>
          <p className="text-[10px] text-[var(--text-muted)] truncate mt-0.5">
            {currentTrack.artist}
          </p>
        </div>

        {isPlaying && <WaveBars playing={isPlaying} />}
      </div>

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

      <div className="space-y-1">
        <div
          className="mini-seek"
          onClick={handleSeek}
          role="slider"
          aria-label="Seek"
          aria-valuenow={Math.round(progress)}
          tabIndex={0}
        >
          <div className="mini-seek-fill" style={{ width: `${progress}%` }} />
        </div>

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
  );
}
