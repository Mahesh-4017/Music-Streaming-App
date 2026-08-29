"use client";

import { usePlayerStore } from "@/store/playerStore";
import { useLikedStore } from "@/store/likedStore";
import { cleanTrackTitle } from "@/lib/urlMetadata";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  ListMusic,
  Maximize2,
} from "lucide-react";
import Image from "next/image";

function YoutubeIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function fmtTime(secs: number) {
  if (!secs || isNaN(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

import { useUIStore } from "@/store/uiStore";

export default function GlobalPlayerBar() {
  const { isSidebarCollapsed } = useUIStore();
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    progress,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isQueueOpen,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleQueue,
  } = usePlayerStore();

  const { isLiked, toggleLike } = useLikedStore();

  if (!currentTrack || isQueueOpen) return null;

  const liked = isLiked(currentTrack.id);
  const trackSrc = currentTrack.audioUrl || currentTrack.url || "";
  const isYt = currentTrack.type === "youtube" || trackSrc.includes("youtube.com") || trackSrc.includes("youtu.be");

  return (
    <div
      className={`
        fixed bottom-0 right-0 z-50
        h-[76px] px-4 md:px-6
        bg-[var(--bg-surface)]/95 backdrop-blur-2xl
        border-t border-[var(--border)]
        flex items-center justify-between gap-4
        shadow-[0_-8px_32px_rgba(0,0,0,0.5)]
        animate-slide-up transition-all duration-300
        left-0 ${isSidebarCollapsed ? "lg:left-[72px]" : "lg:left-56 xl:left-64"}
      `}
    >
      {/* ── Left: Track Info & Like Button ── */}
      <div className="flex items-center gap-3.5 min-w-0 w-1/4 max-w-[280px]">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[var(--bg-elevated)] shrink-0 border border-white/10 shadow-md group">
          <Image
            src={currentTrack.thumbnail || "/assets/images/default-song.png"}
            alt={currentTrack.title}
            width={48}
            height={48}
            className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? "scale-105" : ""}`}
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <span className="flex items-end justify-center gap-0.5 h-3">
                <span className="w-0.5 bg-[var(--brand)] animate-bounce h-full"></span>
                <span className="w-0.5 bg-[var(--brand)] animate-bounce h-2 delay-100"></span>
                <span className="w-0.5 bg-[var(--brand)] animate-bounce h-2.5 delay-200"></span>
              </span>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
              {cleanTrackTitle(currentTrack.title)}
            </p>
            {isYt ? (
              <span className="text-[9px] px-1 py-0.2 rounded bg-red-500/15 text-red-400 font-bold border border-red-500/20 shrink-0 flex items-center gap-0.5">
                <YoutubeIcon size={8} /> YT
              </span>
            ) : (
              <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-500/15 text-indigo-400 font-bold border border-indigo-500/20 shrink-0">
                MP3
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">
            {currentTrack.artist || "Musify Track"}
          </p>
        </div>

        <button
          onClick={() => toggleLike(currentTrack)}
          className={`p-2 rounded-full transition-all hover:scale-110 ${liked
              ? "text-red-500 bg-red-500/10 shadow-[0_0_12px_rgba(239,68,68,0.25)]"
              : "text-[var(--text-muted)] hover:text-red-400 hover:bg-white/5"
            }`}
          title={liked ? "Remove from Liked" : "Like Song"}
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
        </button>
      </div>

      {/* ── Center: Main Playback Controls & Progress Bar ── */}
      <div className="flex-1 max-w-2xl flex flex-col items-center gap-1">
        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleShuffle}
            className={`p-1.5 rounded-lg transition-colors ${isShuffle
                ? "text-[var(--brand)] bg-[var(--brand)]/15 font-bold"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            title={isShuffle ? "Shuffle On" : "Shuffle Off"}
          >
            <Shuffle size={15} />
          </button>

          <button
            onClick={prev}
            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:scale-110 transition-all"
            title="Previous Track"
          >
            <SkipBack size={19} />
          </button>

          <button
            onClick={togglePlay}
            className="
              w-10 h-10 rounded-full
              bg-[var(--brand)] text-white
              flex items-center justify-center
              hover:scale-105 active:scale-95
              shadow-[0_0_20px_rgba(42,82,190,0.4)]
              transition-all duration-200
            "
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause size={18} />
            ) : (
              <Play size={18} className="ml-0.5" />
            )}
          </button>

          <button
            onClick={next}
            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:scale-110 transition-all"
            title="Next Track"
          >
            <SkipForward size={19} />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-1.5 rounded-lg transition-colors ${repeatMode !== "off"
                ? "text-[var(--brand)] bg-[var(--brand)]/15 font-bold"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            title={`Repeat: ${repeatMode}`}
          >
            {repeatMode === "one" ? <Repeat1 size={15} /> : <Repeat size={15} />}
          </button>
        </div>

        {/* Progress Slider Bar */}
        <div className="w-full flex items-center gap-2.5">
          <span className="text-[11px] font-mono text-[var(--text-muted)] min-w-[32px] text-right">
            {fmtTime(currentTime)}
          </span>

          <div className="flex-1 relative group py-1 flex items-center cursor-pointer">
            <input
              type="range"
              min={0}
              max={duration || 210}
              step={0.1}
              value={currentTime || 0}
              onChange={(e) => {
                const newTime = Number(e.target.value);
                seek(newTime);
              }}
              style={{
                background: `linear-gradient(to right, var(--brand) ${((currentTime || 0) / (duration || 210)) * 100}%, rgba(255,255,255,0.15) ${((currentTime || 0) / (duration || 210)) * 100}%)`
              }}
              className="w-full h-1.5 rounded-full cursor-pointer transition-all"
            />
          </div>

          <span className="text-[11px] font-mono text-[var(--text-muted)] min-w-[32px]">
            {fmtTime(duration || 210)}
          </span>
        </div>
      </div>

      {/* ── Right: Volume & Queue Toggle ── */}
      <div className="hidden sm:flex items-center justify-end gap-3 w-1/4 max-w-[220px]">
        {/* Volume */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, var(--brand) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.15) ${(isMuted ? 0 : volume) * 100}%)`
            }}
            className="w-20 h-1.5 rounded-full cursor-pointer transition-all"
          />
        </div>

        {/* Queue Drawer Button */}
        <button
          onClick={toggleQueue}
          className={`p-2 rounded-xl border transition-all ${isQueueOpen
              ? "bg-[var(--brand)] text-white border-[var(--brand)] shadow-[0_0_16px_rgba(42,82,190,0.3)]"
              : "bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)]"
            }`}
          title="Toggle Queue & Player Panel"
        >
          <ListMusic size={17} />
        </button>
      </div>
    </div>
  );
}
