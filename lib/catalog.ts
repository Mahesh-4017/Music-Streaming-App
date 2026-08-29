// lib/catalog.ts
import { Track } from "@/store/playerStore";

export interface AlbumItem {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  year: number;
  genre: string;
  songsCount: number;
}

export interface ArtistItem {
  id: string;
  name: string;
  thumbnail: string;
  followers: string;
  genre: string;
}

export interface GenreItem {
  id: string;
  label: string;
  color: string;
  bg: string;
  image?: string;
}

export const GENRES: GenreItem[] = [
  { id: "pop", label: "Pop", color: "#E05A36", bg: "rgba(224,90,54,.15)" },
  { id: "hiphop", label: "Hip-Hop", color: "#E07C9F", bg: "rgba(224,124,159,.15)" },
  { id: "rnb", label: "R&B", color: "#7CB8E0", bg: "rgba(124,184,224,.15)" },
  { id: "rock", label: "Rock", color: "#E0A87C", bg: "rgba(224,168,124,.15)" },
  { id: "jazz", label: "Jazz", color: "#7CE0B8", bg: "rgba(124,224,184,.15)" },
  { id: "edm", label: "EDM", color: "#C07CE0", bg: "rgba(192,124,224,.15)" },
  { id: "classical", label: "Classical", color: "#E0D07C", bg: "rgba(224,208,124,.15)" },
  { id: "indie", label: "Indie", color: "#7CE0D0", bg: "rgba(124,224,208,.15)" },
  { id: "lofi", label: "Lo-Fi & Chill", color: "#E0987C", bg: "rgba(224,152,124,.15)" },
  { id: "kpop", label: "K-Pop", color: "#E07CC0", bg: "rgba(224,124,192,.15)" },
  { id: "metal", label: "Metal", color: "#A8A8A8", bg: "rgba(168,168,168,.15)" },
  { id: "acoustic", label: "Acoustic", color: "#C0E07C", bg: "rgba(192,224,124,.15)" },
];

export const FEATURED_TRACK: Track = {
  id: "ft-1",
  title: "Blinding Lights",
  artist: "The Weeknd",
  album: "After Hours",
  thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
  audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3",
  type: "audio",
  duration: 200,
};

export const CATALOG_TRACKS: (Track & { genre?: string; year?: number })[] = [
  {
    id: "s-1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3",
    type: "audio",
    duration: 200,
    genre: "pop",
    year: 2020,
  },
  {
    id: "s-2",
    title: "Midnight City Lights",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3",
    type: "audio",
    duration: 184,
    genre: "pop",
    year: 2023,
  },
  {
    id: "s-3",
    title: "Stay With Me",
    artist: "The Kid LAROI & Justin Bieber",
    album: "F*CK LOVE 3",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
    type: "audio",
    duration: 141,
    genre: "pop",
    year: 2021,
  },
  {
    id: "s-4",
    title: "Neon Horizon Beats",
    artist: "Cyberwave",
    album: "Synthwave Dreams",
    thumbnail: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3",
    type: "audio",
    duration: 215,
    genre: "edm",
    year: 2024,
  },
  {
    id: "s-5",
    title: "Velvet Groove",
    artist: "SZA",
    album: "SOS",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_8843286d9c.mp3",
    type: "audio",
    duration: 198,
    genre: "rnb",
    year: 2022,
  },
  {
    id: "s-6",
    title: "Electric Pulse",
    artist: "Bad Bunny",
    album: "Un Verano Sin Ti",
    thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c26569116e.mp3",
    type: "audio",
    duration: 172,
    genre: "hiphop",
    year: 2024,
  },
  {
    id: "s-7",
    title: "Coffee & Rain Lofi",
    artist: "ChillHop Cafe",
    album: "Rainy Vibes",
    thumbnail: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
    type: "audio",
    duration: 160,
    genre: "lofi",
    year: 2024,
  },
  {
    id: "s-8",
    title: "Smooth Saxophone Night",
    artist: "Jazz Quartet",
    album: "Midnight Sessions",
    thumbnail: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/02/10/audio_51a37c3a06.mp3",
    type: "audio",
    duration: 230,
    genre: "jazz",
    year: 2023,
  },
  {
    id: "s-9",
    title: "Symphony No. 5 In C Minor",
    artist: "Royal Philharmonic",
    album: "Classical Legends",
    thumbnail: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2023/04/10/audio_3385317b35.mp3",
    type: "audio",
    duration: 310,
    genre: "classical",
    year: 2021,
  },
];

export const ALBUMS: AlbumItem[] = [
  {
    id: "alb-1",
    title: "After Hours",
    artist: "The Weeknd",
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80",
    year: 2020,
    genre: "pop",
    songsCount: 14,
  },
  {
    id: "alb-2",
    title: "Future Nostalgia",
    artist: "Dua Lipa",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80",
    year: 2022,
    genre: "pop",
    songsCount: 12,
  },
  {
    id: "alb-3",
    title: "SOS",
    artist: "SZA",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop&q=80",
    year: 2023,
    genre: "rnb",
    songsCount: 23,
  },
  {
    id: "alb-4",
    title: "Un Verano Sin Ti",
    artist: "Bad Bunny",
    thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&auto=format&fit=crop&q=80",
    year: 2022,
    genre: "hiphop",
    songsCount: 23,
  },
  {
    id: "alb-5",
    title: "Synthwave Dreams",
    artist: "Cyberwave",
    thumbnail: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80",
    year: 2024,
    genre: "edm",
    songsCount: 10,
  },
];

export const ARTISTS: ArtistItem[] = [
  {
    id: "art-1",
    name: "The Weeknd",
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80",
    followers: "85.2M listeners",
    genre: "pop",
  },
  {
    id: "art-2",
    name: "Dua Lipa",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80",
    followers: "64.1M listeners",
    genre: "pop",
  },
  {
    id: "art-3",
    name: "SZA",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop&q=80",
    followers: "58.9M listeners",
    genre: "rnb",
  },
  {
    id: "art-4",
    name: "Bad Bunny",
    thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&auto=format&fit=crop&q=80",
    followers: "72.4M listeners",
    genre: "hiphop",
  },
];
