// app/(main)/genre/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Play, Shuffle, Music2, Disc3, Radio, Sparkles } from "lucide-react";

interface GenreData {
  id: string;
  name: string;
  color: string;
  bgGradient: string;
  description: string;
  topTracks: { id: string; title: string; artist: string; thumbnail: string; duration: number }[];
  featuredAlbums: { id: string; title: string; artist: string; thumbnail: string; year: number }[];
}

const GENRE_DATA: Record<string, GenreData> = {
  pop: {
    id: "pop",
    name: "Pop",
    color: "#7C6FE0",
    bgGradient: "linear-gradient(135deg, rgba(124,111,224,0.4) 0%, rgba(20,20,30,0.95) 100%)",
    description: "Chart-topping pop hits, infectious hooks, and global anthems.",
    topTracks: [
      { id: "1", title: "Levitating", artist: "Dua Lipa", thumbnail: "https://picsum.photos/seed/pop1/200/200", duration: 203 },
      { id: "2", title: "Blinding Lights", artist: "The Weeknd", thumbnail: "https://picsum.photos/seed/pop2/200/200", duration: 200 },
      { id: "3", title: "As It Was", artist: "Harry Styles", thumbnail: "https://picsum.photos/seed/pop3/200/200", duration: 167 },
      { id: "4", title: "Cruel Summer", artist: "Taylor Swift", thumbnail: "https://picsum.photos/seed/pop4/200/200", duration: 178 },
    ],
    featuredAlbums: [
      { id: "1", title: "Future Nostalgia", artist: "Dua Lipa", thumbnail: "https://picsum.photos/seed/popa1/300/300", year: 2020 },
      { id: "2", title: "Midnights", artist: "Taylor Swift", thumbnail: "https://picsum.photos/seed/popa2/300/300", year: 2022 },
      { id: "3", title: "Harry's House", artist: "Harry Styles", thumbnail: "https://picsum.photos/seed/popa3/300/300", year: 2022 },
    ]
  },
  hiphop: {
    id: "hiphop",
    name: "Hip-Hop",
    color: "#E07C9F",
    bgGradient: "linear-gradient(135deg, rgba(224,124,159,0.4) 0%, rgba(20,20,30,0.95) 100%)",
    description: "Heavy basslines, lyricism, trap beats, and modern hip-hop culture.",
    topTracks: [
      { id: "1", title: "SICKO MODE", artist: "Travis Scott", thumbnail: "https://picsum.photos/seed/hh1/200/200", duration: 312 },
      { id: "2", title: "God's Plan", artist: "Drake", thumbnail: "https://picsum.photos/seed/hh2/200/200", duration: 198 },
      { id: "3", title: "HUMBLE.", artist: "Kendrick Lamar", thumbnail: "https://picsum.photos/seed/hh3/200/200", duration: 177 },
    ],
    featuredAlbums: [
      { id: "1", title: "ASTROWORLD", artist: "Travis Scott", thumbnail: "https://picsum.photos/seed/hha1/300/300", year: 2018 },
      { id: "2", title: "Certified Lover Boy", artist: "Drake", thumbnail: "https://picsum.photos/seed/hha2/300/300", year: 2021 },
    ]
  },
  rnb: {
    id: "rnb",
    name: "R&B",
    color: "#7CB8E0",
    bgGradient: "linear-gradient(135deg, rgba(124,184,224,0.4) 0%, rgba(20,20,30,0.95) 100%)",
    description: "Smooth melodies, soulful vocals, and modern R&B grooves.",
    topTracks: [
      { id: "1", title: "Kill Bill", artist: "SZA", thumbnail: "https://picsum.photos/seed/rnb1/200/200", duration: 153 },
      { id: "2", title: "Die For You", artist: "The Weeknd", thumbnail: "https://picsum.photos/seed/rnb2/200/200", duration: 259 },
    ],
    featuredAlbums: [
      { id: "1", title: "SOS", artist: "SZA", thumbnail: "https://picsum.photos/seed/rnba1/300/300", year: 2022 },
      { id: "2", title: "After Hours", artist: "The Weeknd", thumbnail: "https://picsum.photos/seed/rnba2/300/300", year: 2020 },
    ]
  },
  rock: {
    id: "rock",
    name: "Rock",
    color: "#E0A87C",
    bgGradient: "linear-gradient(135deg, rgba(224,168,124,0.4) 0%, rgba(20,20,30,0.95) 100%)",
    description: "Electric guitars, powerful drums, alternative jams, and timeless rock classics.",
    topTracks: [
      { id: "1", title: "Do I Wanna Know?", artist: "Arctic Monkeys", thumbnail: "https://picsum.photos/seed/rock1/200/200", duration: 272 },
      { id: "2", title: "Believer", artist: "Imagine Dragons", thumbnail: "https://picsum.photos/seed/rock2/200/200", duration: 204 },
    ],
    featuredAlbums: [
      { id: "1", title: "AM", artist: "Arctic Monkeys", thumbnail: "https://picsum.photos/seed/rocka1/300/300", year: 2013 },
    ]
  },
  jazz: {
    id: "jazz",
    name: "Jazz",
    color: "#7CE0B8",
    bgGradient: "linear-gradient(135deg, rgba(124,224,184,0.4) 0%, rgba(20,20,30,0.95) 100%)",
    description: "Smooth saxophones, sophisticated brass, fusion, and relaxing lounge jazz.",
    topTracks: [
      { id: "1", title: "Take Five", artist: "The Dave Brubeck Quartet", thumbnail: "https://picsum.photos/seed/jazz1/200/200", duration: 324 },
    ],
    featuredAlbums: [
      { id: "1", title: "Kind of Blue", artist: "Miles Davis", thumbnail: "https://picsum.photos/seed/jazza1/300/300", year: 1959 },
    ]
  },
  edm: {
    id: "edm",
    name: "EDM",
    color: "#C07CE0",
    bgGradient: "linear-gradient(135deg, rgba(192,124,224,0.4) 0%, rgba(20,20,30,0.95) 100%)",
    description: "Electrifying festival drops, synth beats, house, and dance music.",
    topTracks: [
      { id: "1", title: "Titanium", artist: "David Guetta ft. Sia", thumbnail: "https://picsum.photos/seed/edm1/200/200", duration: 245 },
      { id: "2", title: "Closer", artist: "The Chainsmokers", thumbnail: "https://picsum.photos/seed/edm2/200/200", duration: 244 },
    ],
    featuredAlbums: [
      { id: "1", title: "Memories...Do Not Open", artist: "The Chainsmokers", thumbnail: "https://picsum.photos/seed/edma1/300/300", year: 2017 },
    ]
  }
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const genre = GENRE_DATA[id] || { name: id.toUpperCase(), description: `Explore ${id} music.` };
  return { title: `${genre.name} Music`, description: genre.description };
}

export default async function GenrePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const genre = GENRE_DATA[id] || {
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    color: "#7C6FE0",
    bgGradient: "linear-gradient(135deg, rgba(124,111,224,0.4) 0%, rgba(20,20,30,0.95) 100%)",
    description: `Explore the best of ${id} music, trending songs, and top artists.`,
    topTracks: [
      { id: "1", title: `${id.toUpperCase()} Anthem`, artist: "Featured Artist", thumbnail: `https://picsum.photos/seed/${id}1/200/200`, duration: 210 },
      { id: "2", title: `Rhythm of ${id}`, artist: "Top Musician", thumbnail: `https://picsum.photos/seed/${id}2/200/200`, duration: 185 }
    ],
    featuredAlbums: [
      { id: "1", title: `${id.toUpperCase()} Hits 2024`, artist: "Various Artists", thumbnail: `https://picsum.photos/seed/${id}a1/300/300`, year: 2024 }
    ]
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <div
        className="px-6 sm:px-8 pt-12 pb-10 border-b border-[var(--border)] relative overflow-hidden"
        style={{ background: genre.bgGradient }}
      >
        <div className="max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-white mb-3">
            <Sparkles size={13} style={{ color: genre.color }} /> Genre Overview
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
            {genre.name}
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            {genre.description}
          </p>

          <div className="flex items-center gap-3">
            <button className="w-12 h-12 rounded-full bg-[var(--brand)] text-white flex items-center justify-center hover:bg-[var(--brand-dark)] hover:scale-105 shadow-[var(--shadow-brand)] transition-all">
              <Play size={20} strokeWidth={2.5} />
            </button>
            <button className="btn btn-ghost flex items-center gap-2 text-white border-white/20 hover:bg-white/10">
              <Shuffle size={16} /> Shuffle Genre
            </button>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-10">
        {/* Top Tracks */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Music2 size={18} className="text-[var(--brand)]" />
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Popular {genre.name} Songs</h2>
            </div>
          </div>

          <div className="space-y-1">
            {genre.topTracks.map((song, i) => {
              const mins = Math.floor(song.duration / 60);
              const secs = String(song.duration % 60).padStart(2, "0");
              return (
                <div key={song.id} className="song-row group">
                  {/* 1. Index / Play */}
                  <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
                    <span className="text-sm text-[var(--text-muted)] group-hover:hidden">
                      {i + 1}
                    </span>
                    <button className="hidden group-hover:flex items-center justify-center w-8 h-8">
                      <Play size={14} className="text-[var(--text-primary)]" />
                    </button>
                  </div>

                  {/* 2. Thumbnail + Info */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-[var(--bg-surface)] shrink-0">
                      <Image src={song.thumbnail} alt={song.title} width={40} height={40} className="object-cover w-full h-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">{song.title}</p>
                      <p className="text-xs text-[var(--text-muted)] truncate">{song.artist}</p>
                    </div>
                  </div>

                  {/* 3. Duration */}
                  <span className="text-xs text-[var(--text-muted)] flex-shrink-0">{mins}:{secs}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Featured Albums / Playlists */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Disc3 size={18} className="text-[var(--brand)]" />
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Featured Albums & Playlists</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {genre.featuredAlbums.map((album) => (
              <Link key={album.id} href={`/album/${album.id}`} className="music-card group block">
                <div className="relative aspect-square rounded-[var(--radius-lg)] overflow-hidden bg-[var(--bg-surface)]">
                  <Image src={album.thumbnail} alt={album.title} width={300} height={300} className="music-card__art" />
                  <div className="music-card__overlay" />
                  <button className="music-card__play">
                    <Play size={18} strokeWidth={2.5} />
                  </button>
                </div>
                <div className="mt-2.5 px-0.5">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{album.title}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">{album.artist} · {album.year}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
