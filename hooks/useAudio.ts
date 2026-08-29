// hooks/useAudio.ts
"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePlayerStore } from "@/store/playerStore";

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    repeatMode,
    pause,
    next,
    seek,
  } = usePlayerStore();

  useEffect(() => {
    if (audioRef.current) return;
    audioRef.current = new Audio();
    audioRef.current.preload = "metadata";
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (!currentTrack.audioUrl) {
      console.warn("[useAudio] audioUrl is empty for:", currentTrack.title);
      return;
    }

    audio.src = currentTrack.audioUrl;
    audio.load();

    if (isPlaying) {
      audio.play().catch((err) => {
        console.error("[useAudio] play() failed:", err);
        pause();
      });
    }
  }, [currentTrack?.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.audioUrl) return;

    if (isPlaying) {
      audio.play().catch((err) => {
        console.error("[useAudio] play() failed:", err);
        pause();
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack?.audioUrl, pause]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let rafId: number;

    const tick = () => {
      if (!audio.paused) {
        usePlayerStore.setState({
          currentTime: audio.currentTime,
          duration: audio.duration || 0,
        });
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

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

    audio.addEventListener("ended", onEnded);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("error", onError);
    };
  }, [repeatMode, next, pause]);

  const seekTo = useCallback(
    (seconds: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.currentTime = seconds;
      seek(seconds);
    },
    [seek]
  );

  const seekToPercent = useCallback(
    (percent: number) => {
      const audio = audioRef.current;
      if (!audio || !audio.duration) return;
      const seconds = (percent / 100) * audio.duration;
      audio.currentTime = seconds;
      seek(seconds);
    },
    [seek]
  );

  return { audioRef, seekTo, seekToPercent };
}