// store/playerStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// ─── ONE unified Track type ───────────────────────────────────────────────────
// Works for both playlist page (url, type) and music library (audioUrl, thumbnail)
export interface Track {
  id:         string;
  title:      string;
  artist?:    string;
  album?:     string;
  thumbnail?: string;   // music library — album art image
  audioUrl?:  string;   // music library — direct audio src
  url?:       string;   // playlist page — pasted URL
  type?:      "audio" | "video" | "youtube" | "invalid";
  duration?:  number;
  addedAt?:   number;
}

export type RepeatMode = "off" | "one" | "all";

interface PlayerState {
  // ── track ──────────────────────────────────────────────
  currentTrack:   Track | null;
  isPlaying:      boolean;
  currentTime:    number;
  duration:       number;
  progress:       number;   // 0–100
  seekTarget:     number | null;

  // ── queue ──────────────────────────────────────────────
  queue:          Track[];
  queueIndex:     number;

  // ── settings ───────────────────────────────────────────
  volume:         number;
  isMuted:        boolean;
  repeatMode:     RepeatMode;
  isShuffle:      boolean;

  // ── ui ─────────────────────────────────────────────────
  isQueueOpen:    boolean;
  isFullPlayer:   boolean;

  // ── actions ────────────────────────────────────────────
  playTrack:          (track: Track, queue?: Track[]) => void;
  setTracks:          (tracks: Track[]) => void;
  togglePlay:         () => void;
  pause:              () => void;
  play:               () => void;
  next:               () => void;
  prev:               () => void;
  seek:               (time: number) => void;
  setProgress:        (progress: number) => void;
  setTime:            (time: number) => void;
  setVolume:          (volume: number) => void;
  toggleMute:         () => void;
  toggleRepeat:       () => void;
  toggleShuffle:      () => void;
  addToQueue:         (track: Track) => void;
  removeFromQueue:    (index: number) => void;
  clearQueue:         () => void;
  toggleQueue:        () => void;
  toggleFullPlayer:   () => void;
}

export const usePlayerStore = create<PlayerState>()(
  devtools(
    (set, get) => ({
      currentTrack:  null,
      isPlaying:     false,
      currentTime:   0,
      duration:      0,
      progress:      0,
      seekTarget:    null,
      queue:         [],
      queueIndex:    -1,
      volume:        0.8,
      isMuted:       false,
      repeatMode:    "off",
      isShuffle:     false,
      isQueueOpen:   false,
      isFullPlayer:  false,

      // ── Play a track — auto-sets queue if provided ─────────────────────
      playTrack: (track, queue) => {
        const newQueue = queue ?? get().queue;
        const idx      = newQueue.findIndex((t) => t.id === track.id);
        set({
          currentTrack: track,
          isPlaying:    true,
          currentTime:  0,
          progress:     0,
          queue:        newQueue,
          queueIndex:   idx >= 0 ? idx : 0,
        });
      },

      // ── Sync playlist tracks into queue without interrupting playback ──
      setTracks: (tracks) => {
        const { currentTrack, queueIndex } = get();
        const idx = currentTrack
          ? tracks.findIndex((t) => t.id === currentTrack.id)
          : -1;
        set({ queue: tracks, queueIndex: idx >= 0 ? idx : queueIndex });
      },

      togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
      pause:      () => set({ isPlaying: false }),
      play:       () => set({ isPlaying: true }),

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
        set({ currentTrack: queue[nextIdx], queueIndex: nextIdx, currentTime: 0, progress: 0, isPlaying: true });
      },

      prev: () => {
        const { queue, queueIndex, currentTime } = get();
        if (currentTime > 3) { set({ currentTime: 0, progress: 0 }); return; }
        const prevIdx = Math.max(0, queueIndex - 1);
        if (!queue[prevIdx]) return;
        set({ currentTrack: queue[prevIdx], queueIndex: prevIdx, currentTime: 0, progress: 0, isPlaying: true });
      },

      seek:        (time)     => { const d = get().duration; set({ currentTime: time, progress: d > 0 ? (time / d) * 100 : 0, seekTarget: time }); },
      setProgress: (progress) => { const d = get().duration; const t = (progress / 100) * d; set({ progress, currentTime: t, seekTarget: t }); },
      setTime:     (time)     => { const d = get().duration; set({ currentTime: time, progress: d > 0 ? (time / d) * 100 : 0, seekTarget: time }); },

      setVolume:      (v) => set({ volume: Math.max(0, Math.min(1, v)), isMuted: false }),
      toggleMute:     () => set((s) => ({ isMuted: !s.isMuted })),
      toggleRepeat:   () => set((s) => {
        const modes: RepeatMode[] = ["off", "all", "one"];
        return { repeatMode: modes[(modes.indexOf(s.repeatMode) + 1) % modes.length] };
      }),
      toggleShuffle:  () => set((s) => ({ isShuffle: !s.isShuffle })),
      addToQueue:     (track)  => set((s) => ({ queue: [...s.queue, track] })),
      removeFromQueue:(index)  => set((s) => ({
        queue:      s.queue.filter((_, i) => i !== index),
        queueIndex: index < s.queueIndex ? s.queueIndex - 1 : s.queueIndex,
      })),
      clearQueue:       () => set({ queue: [], queueIndex: -1 }),
      toggleQueue:      () => set((s) => ({ isQueueOpen: !s.isQueueOpen })),
      toggleFullPlayer: () => set((s) => ({ isFullPlayer: !s.isFullPlayer })),
    }),
    { name: "PlayerStore" }
  )
);

// ── Alias hook so MobilePlayer / MiniPlayer don't need changes ────────────────
// Files using currentSong / playSong will still work
export const useLegacyPlayerStore = () => {
  const s = usePlayerStore();
  return { ...s, currentSong: s.currentTrack, playSong: s.playTrack };
};