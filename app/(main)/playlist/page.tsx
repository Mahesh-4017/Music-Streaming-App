// app/(main)/playlist/[id]/page.tsx
// ✅ SERVER COMPONENT — only fetches data, passes to client

import type { Metadata } from "next";
import PlaylistClient from "../PlaylistClient";

// ─── Types (shared) ───────────────────────────────────────────────────────────
export interface PlaylistSong {
  id:        string;
  title:     string;
  artist:    string;
  artistId:  string;
  album:     string;
  albumId:   string;
  thumbnail: string;
  duration:  number;
  addedBy:   string;
}

export interface Playlist {
  id:          string;
  title:       string;
  description: string;
  thumbnail:   string;
  owner:       string;
  isOwner:     boolean;
  isPublic:    boolean;
  followers:   string;
  songs:       PlaylistSong[];
}

// ─── Data fetcher (replace with real API) ────────────────────────────────────
async function getPlaylist(id: string): Promise<Playlist> {
  // TODO: const res = await fetch(`${process.env.API_URL}/playlists/${id}`, { next: { revalidate: 60 } });
  return {
    id,
    title:       "Chill Vibes",
    description: "The perfect playlist for late nights and good company.",
    thumbnail:   "https://picsum.photos/seed/pl1/500/500",
    owner:       "Ahmed Khan",
    isOwner:     true,
    isPublic:    true,
    followers:   "1.2K",
    songs: [
      { id:"1", title:"Blinding Lights",  artist:"The Weeknd",     artistId:"weeknd",  album:"After Hours",      albumId:"afterhours", thumbnail:"https://picsum.photos/seed/p1/80/80",  duration:200, addedBy:"Ahmed" },
      { id:"2", title:"Levitating",        artist:"Dua Lipa",       artistId:"dualipa", album:"Future Nostalgia", albumId:"fn",         thumbnail:"https://picsum.photos/seed/p2/80/80",  duration:203, addedBy:"Ahmed" },
      { id:"3", title:"Stay",              artist:"The Kid LAROI",  artistId:"laroi",   album:"F*CK LOVE 3",      albumId:"fl3",        thumbnail:"https://picsum.photos/seed/p3/80/80",  duration:141, addedBy:"Ahmed" },
      { id:"4", title:"Good 4 U",          artist:"Olivia Rodrigo", artistId:"olivia",  album:"SOUR",             albumId:"sour",       thumbnail:"https://picsum.photos/seed/p4/80/80",  duration:178, addedBy:"Ahmed" },
      { id:"5", title:"Montero",           artist:"Lil Nas X",      artistId:"lilnax",  album:"MONTERO",          albumId:"montero",    thumbnail:"https://picsum.photos/seed/p5/80/80",  duration:137, addedBy:"Ahmed" },
      { id:"6", title:"Butter",            artist:"BTS",            artistId:"bts",     album:"Butter",           albumId:"butter",     thumbnail:"https://picsum.photos/seed/p6/80/80",  duration:164, addedBy:"Ahmed" },
    ],
  };
}

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const pl = await getPlaylist(params.id);
  return { title: pl.title, description: pl.description };
}

// ─── Page (pure server — just fetch + hand off) ───────────────────────────────
export default async function PlaylistPage(
  { params }: { params: { id: string } }
) {
  const playlist = await getPlaylist(params.id);

  // ✅ Pass plain serialisable data — no functions
  return <PlaylistClient playlist={playlist} />;
}