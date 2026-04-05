"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Track, PlayerState } from "@/types/index";

export function useAudioPlayer(tracks: Track[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<PlayerState>({
    currentTrackId: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
  });

  useEffect(() => {
    const audio = new Audio();
    audio.volume = 0.8;
    audioRef.current = audio;

    const onTimeUpdate = () =>
      setState((s) => ({ ...s, currentTime: audio.currentTime }));
    const onDurationChange = () =>
      setState((s) => ({ ...s, duration: audio.duration || 0 }));
    const onEnded = () => {
      setState((s) => ({ ...s, isPlaying: false }));
      playNext();
    };
    const onPlay = () => setState((s) => ({ ...s, isPlaying: true }));
    const onPause = () => setState((s) => ({ ...s, isPlaying: false }));

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playTrack = useCallback(
    (track: Track) => {
      const audio = audioRef.current;
      if (!audio) return;
      if (track.type !== "audio" && track.type !== "video") {
        setState((s) => ({ ...s, currentTrackId: track.id, isPlaying: false }));
        return;
      }
      if (state.currentTrackId === track.id) {
        if (audio.paused) audio.play();
        else audio.pause();
        return;
      }
      audio.src = track.url;
      audio.play().catch(console.error);
      setState((s) => ({
        ...s,
        currentTrackId: track.id,
        currentTime: 0,
        duration: 0,
      }));
    },
    [state.currentTrackId]
  );

  const playNext = useCallback(() => {
    const idx = tracks.findIndex((t) => t.id === state.currentTrackId);
    if (idx >= 0 && idx < tracks.length - 1) playTrack(tracks[idx + 1]);
  }, [tracks, state.currentTrackId, playTrack]);

  const playPrev = useCallback(() => {
    const idx = tracks.findIndex((t) => t.id === state.currentTrackId);
    if (idx > 0) playTrack(tracks[idx - 1]);
  }, [tracks, state.currentTrackId, playTrack]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !state.currentTrackId) return;
    if (audio.paused) audio.play().catch(console.error);
    else audio.pause();
  }, [state.currentTrackId]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setState((s) => ({ ...s, currentTime: time }));
  }, []);

  const setVolume = useCallback((vol: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = vol;
    setState((s) => ({ ...s, volume: vol }));
  }, []);

  return { state, playTrack, togglePlay, seek, setVolume, playNext, playPrev };
}
