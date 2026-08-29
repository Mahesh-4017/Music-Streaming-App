import { create } from "zustand";
import { Track } from "@/types";

interface PlayerStore {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number; // 0–100, set externally by audio element

  // aliases so MobilePlayer keeps working without changes
  currentSong: Track | null;

  setTracks: (tracks: Track[]) => void;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  setProgress: (progress: number) => void;
  next: () => void;
  prev: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  tracks: [],
  currentTrack: null,
  currentSong: null, // mirror of currentTrack — for MobilePlayer
  isPlaying: false,
  progress: 0,

  setTracks: (tracks) => set({ tracks }),

  playTrack: (track) =>
    set({
      currentTrack: track,
      currentSong: track, // keep both in sync
      isPlaying: true,
      progress: 0,
    }),

  togglePlay: () =>
    set((s) => ({ isPlaying: !s.isPlaying })),

  setProgress: (progress) => set({ progress }),

  next: () => {
    const { tracks, currentTrack } = get();
    if (!tracks.length || !currentTrack) return;
    const idx = tracks.findIndex((t) => t.id === currentTrack.id);
    const next = tracks[(idx + 1) % tracks.length];
    set({ currentTrack: next, currentSong: next, isPlaying: true, progress: 0 });
  },

  prev: () => {
    const { tracks, currentTrack } = get();
    if (!tracks.length || !currentTrack) return;
    const idx = tracks.findIndex((t) => t.id === currentTrack.id);
    const prev = tracks[(idx - 1 + tracks.length) % tracks.length];
    set({ currentTrack: prev, currentSong: prev, isPlaying: true, progress: 0 });
  },
}));