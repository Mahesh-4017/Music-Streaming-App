// store/likedStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Track } from "./playerStore";

interface LikedState {
  likedSongs: Track[];
  toggleLike: (track: Track) => void;
  isLiked: (trackId: string) => boolean;
  removeLiked: (trackId: string) => void;
}

export const useLikedStore = create<LikedState>()(
  persist(
    (set, get) => ({
      likedSongs: [],

      isLiked: (trackId: string) => {
        if (!trackId) return false;
        return get().likedSongs.some((s) => s.id === trackId);
      },

      toggleLike: (track: Track) => {
        if (!track || !track.id) return;
        const current = get().likedSongs;
        const exists = current.some((s) => s.id === track.id);

        if (exists) {
          set({ likedSongs: current.filter((s) => s.id !== track.id) });
        } else {
          set({ likedSongs: [track, ...current] });
        }
      },

      removeLiked: (trackId: string) => {
        set((state) => ({
          likedSongs: state.likedSongs.filter((s) => s.id !== trackId),
        }));
      },
    }),
    {
      name: "musify_liked_songs",
    }
  )
);
