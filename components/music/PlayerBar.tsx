"use client";

import { Track, PlayerState } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// (other functions can stay below)
export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
interface Props {
  track: Track | null;
  state: PlayerState;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onSetVolume: (vol: number) => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

function getYouTubeId(url: string): string {
  const regExp =
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
  const match = url.match(regExp);
  return match ? match[1] : "";
}

export function PlayerBar({
  track,
  state,
  onTogglePlay,
  onSeek,
  onSetVolume,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: Props) {
  if (!track) return null;

  const isDirectPlayable =
    track.type === "audio" || track.type === "video";

  const progress =
    state.duration > 0
      ? (state.currentTime / state.duration) * 100
      : 0;

  return (
    <div className="sticky bottom-0 right-0 bg-ink-900/95 backdrop-blur-md border-ink-700/60 px-4 py-4 animate-slide-up">
      
      {/* 🎬 MEDIA PLAYER */}
      <div className="mb-4">
        {track.type === "audio" && (
          <audio
            src={track.url}
            autoPlay={state.isPlaying}
            controls
            className="w-full"
          />
        )}

        {track.type === "video" && (
          <video
            src={track.url}
            autoPlay={state.isPlaying}
            controls
            className="w-full rounded-lg"
          />
        )}

        {track.type === "youtube" && (
          <iframe
            className="w-50 h-40 rounded-lg"
            src={`https://www.youtube.com/embed/${getYouTubeId(
              track.url
            )}`}
            allow="autoplay"
          />
        )}
      </div>
    </div>
  );
}