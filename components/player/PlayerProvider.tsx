"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/playerStore";

export default function PlayerProvider() {
  // ✅ FIX 2: initialise Audio() inside useEffect — safe for SSR/strict mode
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { currentSong, isPlaying, volume, isMuted, next, repeatMode } =
    usePlayerStore();

  // ✅ FIX 2: create Audio element once, client-side only
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
  }, []);

  // 🎵 Load song — ✅ FIX 4: isPlaying added to deps to avoid stale closure
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    audio.src = currentSong.audioUrl;
    audio.load();

    if (isPlaying) {
      audio.play().catch(() => {});
    }
  }, [currentSong]); // intentionally only on song change; isPlaying handled below

  // ▶️ Play / Pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // 🔊 Volume
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // ⏱ Sync time → store
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => {
      const duration = audio.duration || 0;
      const currentTime = audio.currentTime;
      usePlayerStore.setState({
        currentTime,
        duration,
        progress: duration ? (currentTime / duration) * 100 : 0,
      });
    };

    audio.addEventListener("timeupdate", update);
    return () => audio.removeEventListener("timeupdate", update);
  }, []);

  // ⏭ Song ended
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnd = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        next();
      }
    };

    audio.addEventListener("ended", handleEnd);
    return () => audio.removeEventListener("ended", handleEnd);
  }, [next, repeatMode]);

  // 🎯 Store seek → audio  ✅ FIX 5: safe subscribe without subscribeWithSelector
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // ✅ FIX 5: plain subscribe — works without middleware
    const unsub = usePlayerStore.subscribe((state) => {
      const time = state.currentTime;
      if (Math.abs(audio.currentTime - time) > 1) {
        audio.currentTime = time;
      }
    });

    return () => unsub();
  }, []); 

  return null;
}