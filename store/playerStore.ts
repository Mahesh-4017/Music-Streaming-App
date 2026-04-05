// store/playerStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Song {
  id:          string;
  title:       string;
  artist:      string;
  album?:      string;
  thumbnail:   string;
  audioUrl:    string;
  duration:    number;   // seconds
}

export type RepeatMode = "off" | "one" | "all";

interface PlayerState {
  // ── Current track ──
  currentSong:   Song | null;
  isPlaying:     boolean;
  currentTime:   number;   // seconds
  duration:      number;   // seconds
  progress:      number;   // 0-100

  // ── Queue ──
  queue:         Song[];
  queueIndex:    number;

  // ── Settings ──
  volume:        number;   // 0-1
  isMuted:       boolean;
  repeatMode:    RepeatMode;
  isShuffle:     boolean;

  // ── UI ──
  isQueueOpen:   boolean;
  isFullPlayer:  boolean;

  // ── Actions ──
  playSong:      (song: Song, queue?: Song[]) => void;
  togglePlay:    () => void;
  pause:         () => void;
  play:          () => void;
  next:          () => void;
  prev:          () => void;
  seek:          (time: number) => void;
  setProgress:   (progress: number) => void;
  setVolume:     (volume: number) => void;
  toggleMute:    () => void;
  toggleRepeat:  () => void;
  toggleShuffle: () => void;
  addToQueue:    (song: Song) => void;
  removeFromQueue:(index: number) => void;
  clearQueue:    () => void;
  toggleQueue:   () => void;
  toggleFullPlayer: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const usePlayerStore = create<PlayerState>()(
  devtools(
    (set, get) => ({
      // ── Initial state ──────────────────────────────────────
      currentSong:    null,
      isPlaying:      false,
      currentTime:    0,
      duration:       0,
      progress:       0,

      queue:          [],
      queueIndex:     -1,

      volume:         0.8,
      isMuted:        false,
      repeatMode:     "off",
      isShuffle:      false,

      isQueueOpen:    false,
      isFullPlayer:   false,

      // ── Actions ────────────────────────────────────────────

      playSong: (song, queue) => {
        const newQueue = queue ?? get().queue;
        const idx      = newQueue.findIndex(s => s.id === song.id);

        set({
          currentSong: song,
          isPlaying:   true,
          currentTime: 0,
          progress:    0,
          queue:       newQueue,
          queueIndex:  idx >= 0 ? idx : 0,
        });
      },

      togglePlay: () =>
        set(s => ({ isPlaying: !s.isPlaying })),

      pause: () => set({ isPlaying: false }),
      play:  () => set({ isPlaying: true  }),

      next: () => {
        const { queue, queueIndex, isShuffle, repeatMode } = get();
        if (!queue.length) return;

        let nextIdx: number;

        if (isShuffle) {
          nextIdx = Math.floor(Math.random() * queue.length);
        } else if (queueIndex < queue.length - 1) {
          nextIdx = queueIndex + 1;
        } else if (repeatMode === "all") {
          nextIdx = 0;
        } else {
          set({ isPlaying: false });
          return;
        }

        set({
          currentSong: queue[nextIdx],
          queueIndex:  nextIdx,
          currentTime: 0,
          progress:    0,
          isPlaying:   true,
        });
      },

      prev: () => {
        const { queue, queueIndex, currentTime } = get();

        // If >3s in, restart current song
        if (currentTime > 3) {
          set({ currentTime: 0, progress: 0 });
          return;
        }

        const prevIdx = Math.max(0, queueIndex - 1);
        if (!queue[prevIdx]) return;

        set({
          currentSong: queue[prevIdx],
          queueIndex:  prevIdx,
          currentTime: 0,
          progress:    0,
          isPlaying:   true,
        });
      },

      seek: (time) => {
        const { duration } = get();
        const progress = duration > 0 ? (time / duration) * 100 : 0;
        set({ currentTime: time, progress });
      },

      setProgress: (progress) => {
        const { duration } = get();
        const currentTime = (progress / 100) * duration;
        set({ progress, currentTime });
      },

      setVolume: (volume) =>
        set({ volume: Math.max(0, Math.min(1, volume)), isMuted: false }),

      toggleMute: () =>
        set(s => ({ isMuted: !s.isMuted })),

      toggleRepeat: () =>
        set(s => {
          const modes: RepeatMode[] = ["off", "all", "one"];
          const next = modes[(modes.indexOf(s.repeatMode) + 1) % modes.length];
          return { repeatMode: next };
        }),

      toggleShuffle: () =>
        set(s => ({ isShuffle: !s.isShuffle })),

      addToQueue: (song) =>
        set(s => ({ queue: [...s.queue, song] })),

      removeFromQueue: (index) =>
        set(s => ({
          queue:      s.queue.filter((_, i) => i !== index),
          queueIndex: index < s.queueIndex
            ? s.queueIndex - 1
            : s.queueIndex,
        })),

      clearQueue: () =>
        set({ queue: [], queueIndex: -1 }),

      toggleQueue: () =>
        set(s => ({ isQueueOpen: !s.isQueueOpen })),

      toggleFullPlayer: () =>
        set(s => ({ isFullPlayer: !s.isFullPlayer })),
    }),
    { name: "PlayerStore" }
  )
);