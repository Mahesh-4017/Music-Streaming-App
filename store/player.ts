import { create } from "zustand";
import { Track } from "@/types";

interface PlayerStore {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;

  setTracks: (tracks: Track[]) => void;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  tracks: [],
  currentTrack: null,
  isPlaying: false,

  setTracks: (tracks) => set({ tracks }),

  playTrack: (track) =>
    set({
      currentTrack: track,
      isPlaying: true,
    }),

  togglePlay: () =>
    set((s) => ({ isPlaying: !s.isPlaying })),
}));