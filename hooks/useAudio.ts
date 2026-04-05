// hooks/useAudio.ts
// ─── THE REAL AUDIO ENGINE ────────────────────────────────────────────────────
// This hook owns the single <audio> element for the whole app.
// Mount it ONCE in (main)/layout.tsx — never anywhere else.

"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePlayerStore } from "@/store/playerStore";

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    currentSong,
    isPlaying,
    volume,
    isMuted,
    repeatMode,
    play,
    pause,
    next,
    seek,
  } = usePlayerStore();

  // ── 1. Create audio element once ─────────────────────────────────────────
  useEffect(() => {
    if (audioRef.current) return;           // already created
    audioRef.current = new Audio();
    audioRef.current.preload = "metadata";
  }, []);

  // ── 2. Load new song whenever currentSong changes ────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (!currentSong.audioUrl) {
      console.warn("[useAudio] audioUrl is empty for:", currentSong.title);
      return;
    }

    audio.src = currentSong.audioUrl;
    audio.load();

    if (isPlaying) {
      audio.play().catch(err => {
        console.error("[useAudio] play() failed:", err);
        pause();
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong?.id]);               // only re-run when song ID changes

  // ── 3. Play / pause in sync with store ───────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong?.audioUrl) return;

    if (isPlaying) {
      audio.play().catch(err => {
        console.error("[useAudio] play() failed:", err);
        pause();
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong?.audioUrl, pause]);

  // ── 4. Volume & mute ─────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // ── 5. Sync time → store (throttled via requestAnimationFrame) ───────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let rafId: number;

    const tick = () => {
      if (!audio.paused) {
        // Update store progress every animation frame
        usePlayerStore.setState({
          currentTime: audio.currentTime,
          duration:    audio.duration || 0,
          progress:    audio.duration
            ? (audio.currentTime / audio.duration) * 100
            : 0,
        });
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // ── 6. Native events → store ─────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play();
      } else {
        next();
      }
    };

    const onLoadedMetadata = () => {
      usePlayerStore.setState({ duration: audio.duration });
    };

    const onError = (e: Event) => {
      console.error("[useAudio] audio error:", e);
      pause();
    };

    audio.addEventListener("ended",           onEnded);
    audio.addEventListener("loadedmetadata",  onLoadedMetadata);
    audio.addEventListener("error",           onError);

    return () => {
      audio.removeEventListener("ended",           onEnded);
      audio.removeEventListener("loadedmetadata",  onLoadedMetadata);
      audio.removeEventListener("error",           onError);
    };
  }, [repeatMode, next, pause]);

  // ── 7. Expose seek so Player UI can call it ───────────────────────────────
  const seekTo = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = seconds;
    seek(seconds);
  }, [seek]);

  const seekToPercent = useCallback((percent: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const seconds = (percent / 100) * audio.duration;
    audio.currentTime = seconds;
    seek(seconds);
  }, [seek]);

  return { audioRef, seekTo, seekToPercent };
}