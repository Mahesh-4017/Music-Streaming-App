"use client";

import { useEffect, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
  ListMusic,
  Shuffle,
  Heart,
} from "lucide-react";
import { usePlayerStore, Track } from "@/store/playerStore";
import { useLikedStore } from "@/store/likedStore";
import { cleanTrackTitle } from "@/lib/urlMetadata";

function YoutubeIcon({ size = 12, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function getYouTubeId(url?: string): string {
  if (!url) return "";
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : "";
}

function fmtTime(secs: number) {
  if (!secs || isNaN(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export default function RightPlayerSidebar() {
  const {
    currentTrack,
    isPlaying,
    queue,
    currentTime,
    duration,
    progress,
    volume,
    isMuted,
    isShuffle,
    isQueueOpen,
    toggleQueue,
    playTrack,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
  } = usePlayerStore();

  const { isLiked, toggleLike } = useLikedStore();

  const [allSongs, setAllSongs] = useState<Track[]>([]);

  // Auto-fetch saved songs if queue is empty
  useEffect(() => {
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
          setAllSongs(mapped);
        }
      } catch (err) {
        console.error("Failed to load right sidebar songs", err);
      }
    };

    fetchSongs();
  }, []);

  const trackSrc = currentTrack?.audioUrl || currentTrack?.url || "";
  const isYt = currentTrack?.type === "youtube" || trackSrc.includes("youtube.com") || trackSrc.includes("youtu.be");
  const ytId = isYt ? getYouTubeId(trackSrc) : "";
  const isCurrentLiked = currentTrack ? isLiked(currentTrack.id) : false;

  // ── Sync YouTube iframe Play/Pause via postMessage without reloading iframe ──
  useEffect(() => {
    if (!isYt) return;
    const iframe = document.getElementById("yt-player-iframe") as HTMLIFrameElement;
    if (!iframe || !iframe.contentWindow) return;

    const func = isPlaying ? "playVideo" : "pauseVideo";
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: "command", func, args: [] }),
      "*"
    );
  }, [isPlaying, isYt]);

  // ── Live time progress ticker for YouTube tracks ────────────────────────
  useEffect(() => {
    if (!isYt || !isPlaying) return;

    const timer = setInterval(() => {
      usePlayerStore.setState((state) => {
        const newTime = state.currentTime + 1;
        const dur = state.duration > 0 ? state.duration : 210; // Default ~3m30s
        return {
          currentTime: newTime,
          duration: dur,
          progress: (newTime / dur) * 100,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isYt, isPlaying]);

  // Listen to postMessage from YouTube iframe for real time/end events
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== "https://www.youtube.com") return;
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data.event === "infoDelivery" && data.info) {
          if (typeof data.info.currentTime === "number") {
            const t = data.info.currentTime;
            const d = data.info.duration || usePlayerStore.getState().duration || 210;
            usePlayerStore.setState({
              currentTime: t,
              duration: d,
              progress: d > 0 ? (t / d) * 100 : 0,
            });
          }
          if (data.info.playerState === 0) { // Video ended
            next();
          }
        }
      } catch {}
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [next]);

  const handleSeek = (newProgress: number) => {
    const dur = duration || 210;
    const newTime = (newProgress / 100) * dur;
    seek(newTime);

    if (isYt) {
      const iframe = document.getElementById("yt-player-iframe") as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "seekTo", args: [newTime, true] }),
          "*"
        );
      }
    }
  };

  // Hide sidebar if no track active or user closed it
  if (!currentTrack || !isQueueOpen) return null;

  const displayList = queue.length > 0 ? queue : allSongs;

  return (
    <aside className="w-80 lg:w-96 h-dvh bg-[var(--bg-surface)]/95 border-l border-[var(--border)] backdrop-blur-2xl flex flex-col shrink-0 shadow-2xl z-40 relative animate-slide-left transition-all duration-300">
      
      {/* ── Top Header ── */}
      <div className="p-4 border-b border-[var(--border)] flex items-center justify-between shrink-0 bg-[var(--bg-elevated)]/50">
        <div className="flex items-center gap-2">
          <ListMusic size={18} className="text-[var(--brand)]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
            Now Playing & Queue
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--brand)]/15 text-[var(--brand)] font-semibold">
            {displayList.length} tracks
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleShuffle}
            className={`p-1.5 rounded-lg transition-colors ${
              isShuffle
                ? "bg-[var(--brand)]/20 text-[var(--brand)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
            title="Toggle Shuffle"
          >
            <Shuffle size={14} />
          </button>

          <button
            onClick={toggleQueue}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
            title="Close right player sidebar"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ── Upper Section: All Music List / Queue ── */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
        <div className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-2 py-1">
          Playing Next
        </div>

        {displayList.map((track, i) => {
          const isCurrent = currentTrack.id === track.id;
          const liked = isLiked(track.id);

          return (
            <div
              key={track.id || i}
              onClick={() => playTrack(track, displayList)}
              className={`group flex items-center gap-3 p-2 rounded-[var(--radius-md)] cursor-pointer transition-all ${
                isCurrent
                  ? "bg-[var(--brand)]/15 border border-[var(--brand)]/30 text-[var(--brand)] shadow-sm"
                  : "hover:bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {/* Equalizer or Index */}
              <div className="w-5 text-center shrink-0 text-xs font-mono">
                {isCurrent && isPlaying ? (
                  <span className="flex items-end justify-center gap-0.5 h-3">
                    <span className="w-0.5 bg-[var(--brand)] animate-bounce h-full"></span>
                    <span className="w-0.5 bg-[var(--brand)] animate-bounce h-2 delay-100"></span>
                    <span className="w-0.5 bg-[var(--brand)] animate-bounce h-2.5 delay-200"></span>
                  </span>
                ) : (
                  <span className="group-hover:hidden text-[var(--text-muted)]">{i + 1}</span>
                )}
                {!isCurrent && (
                  <Play size={12} className="hidden group-hover:block mx-auto text-[var(--text-primary)]" />
                )}
              </div>

              {/* Artwork */}
              <div className="w-9 h-9 rounded-md overflow-hidden bg-black/40 shrink-0 border border-white/5 relative">
                <img
                  src={track.thumbnail || "/assets/images/default-song.png"}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Artist */}
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-medium truncate ${isCurrent ? "font-bold text-[var(--brand)]" : ""}`}>
                  {cleanTrackTitle(track.title)}
                </p>
                <p className="text-[10px] text-[var(--text-muted)] truncate">
                  {track.artist || "Unknown Artist"}
                </p>
              </div>

              {/* Like Heart Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(track);
                }}
                className={`p-1 rounded-full transition-colors ${
                  liked
                    ? "text-red-500 bg-red-500/10"
                    : "text-[var(--text-muted)] hover:text-red-400 opacity-0 group-hover:opacity-100"
                }`}
                title={liked ? "Remove from Liked Songs" : "Like Song"}
              >
                <Heart size={13} fill={liked ? "currentColor" : "none"} />
              </button>

              {/* YouTube / MP3 Tag */}
              {track.type === "youtube" || (track.audioUrl && track.audioUrl.includes("youtube")) ? (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-semibold border border-red-500/20 shrink-0">
                  <YoutubeIcon size={9} className="inline mr-0.5" /> YT
                </span>
              ) : (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20 shrink-0">
                  MP3
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Bottom Section: Active Player Controls & Media Embed ── */}
      <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-surface)] shrink-0 flex flex-col gap-3 shadow-2xl">
        
        {/* Media Embed (YouTube Video/Audio iframe if active track is YouTube) */}
        {isYt && ytId ? (
          <div className="w-full rounded-xl overflow-hidden shadow-lg border border-white/10 bg-black/80 aspect-video relative">
            <iframe
              id="yt-player-iframe"
              key={ytId}
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&enablejsapi=1`}
              title={currentTrack.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 p-2 rounded-xl bg-[var(--bg-elevated)] border border-white/5">
            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-black/50">
              <img
                src={currentTrack.thumbnail || "/assets/images/default-song.png"}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                {cleanTrackTitle(currentTrack.title)}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] truncate">
                {currentTrack.artist || "Musify Audio"}
              </p>
            </div>
            <button
              onClick={() => toggleLike(currentTrack)}
              className={`p-2 rounded-full transition-colors ${
                isCurrentLiked
                  ? "text-red-500 bg-red-500/10"
                  : "text-[var(--text-muted)] hover:text-red-400 hover:bg-white/5"
              }`}
              title={isCurrentLiked ? "Unlike" : "Like"}
            >
              <Heart size={18} fill={isCurrentLiked ? "currentColor" : "none"} />
            </button>
          </div>
        )}

        {/* Progress Slider Bar */}
        <div className="space-y-1">
          <input
            type="range"
            min={0}
            max={duration || 210}
            step={0.1}
            value={currentTime || 0}
            onChange={(e) => seek(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, var(--brand) ${((currentTime || 0) / (duration || 210)) * 100}%, rgba(255,255,255,0.15) ${((currentTime || 0) / (duration || 210)) * 100}%)`
            }}
            className="w-full h-1.5 rounded-full cursor-pointer transition-all"
          />
          <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-mono">
            <span>{fmtTime(currentTime)}</span>
            <span>{fmtTime(duration || 210)}</span>
          </div>
        </div>

        {/* Main Controls: Prev, Play/Pause, Next & Volume */}
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={toggleMute}
              className="p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              title="Mute/Unmute"
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-12 accent-[var(--brand)] h-1 bg-[var(--bg-elevated)] rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleLike(currentTrack)}
              className={`p-1.5 rounded-full transition-colors ${
                isCurrentLiked
                  ? "text-red-500 bg-red-500/10"
                  : "text-[var(--text-muted)] hover:text-red-400"
              }`}
              title={isCurrentLiked ? "Unlike" : "Like Song"}
            >
              <Heart size={16} fill={isCurrentLiked ? "currentColor" : "none"} />
            </button>

            <button
              onClick={prev}
              className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
              title="Previous Track"
            >
              <SkipBack size={18} />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-[var(--brand)] text-white flex items-center justify-center hover:scale-105 shadow-[var(--shadow-brand)] transition-transform shrink-0"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>

            <button
              onClick={next}
              className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
              title="Next Track"
            >
              <SkipForward size={18} />
            </button>
          </div>
        </div>

      </div>
    </aside>
  );
}
