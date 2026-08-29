// components/providers/PlayerProvider.tsx
"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/playerStore";

/**
 * Drop this ONCE in your root layout:
 *   <PlayerProvider />
 *   <MobilePlayer />
 *
 * It owns the single <audio> element for the entire app.
 * YouTube tracks are handled by MobilePlayer's iframe — this only drives
 * audio/video URL tracks.
 */
export default function PlayerProvider() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    repeatMode,
    next,
  } = usePlayerStore();

  // ── Create audio element once (client only, SSR safe) ────────────────────
  useEffect(() => {
    audioRef.current = new Audio();
  }, []);

  // ── Load new track & autoplay ─────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    // YouTube is handled by MobilePlayer iframe — skip
    if (currentTrack.type === "youtube") return;

    // Resolve the actual audio src (supports both store shapes)
    const src = currentTrack.audioUrl ?? currentTrack.url ?? "";
    if (!src) return;

    audio.src = src;
    audio.load();
    audio.play().catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.id]);   // only re-run when the track ID changes

  // ── Play / Pause ──────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(() => {});
    else           audio.pause();
  }, [isPlaying]);

  // ── Volume / mute ─────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // ── Sync timeupdate → store (progress bar) ────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      const d = audio.duration || 0;
      const t = audio.currentTime;
      usePlayerStore.setState({
        currentTime: t,
        duration:    d,
        progress:    d ? (t / d) * 100 : 0,
      });
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    return () => audio.removeEventListener("timeupdate", onTimeUpdate);
  }, []);

  // ── Song ended → next / repeat ────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        next();
      }
    };

    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [next, repeatMode]);

  // ── External seek (store.seek() → audio element) ─────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const unsub = usePlayerStore.subscribe((state) => {
      // Only jump if the diff is meaningful (> 1s) to avoid feedback loop
      if (Math.abs(audio.currentTime - state.currentTime) > 1) {
        audio.currentTime = state.currentTime;
      }
    });

    return () => unsub();
  }, []);

  return null; // renders nothing — pure audio engine
}