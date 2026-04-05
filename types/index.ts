import "next-auth";

// ─── NextAuth augmentation ─────────────────────────────────────────────────
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

// ─── App types ─────────────────────────────────────────────────────────────

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface SongDTO {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  duration?: number;        // seconds
  audioUrl: string;
  thumbnailUrl?: string;
  uploader: UserDTO;
  plays: number;
  likes: number;
  isPublic: boolean;
  createdAt: string;
}

/** Shape passed to the music player store */
export interface PlayerTrack {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  thumbnailUrl?: string;
  duration?: number;
}

export type RepeatMode = "off" | "all" | "one";

export type TrackType = "youtube" | "soundcloud" | "audio" | "video" | "link";

export interface Track {
  id: string;
  url: string;
  title: string;
  type: TrackType;
  addedAt: number;
  duration?: number;
}

export interface PlayerState {
  currentTrackId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}
