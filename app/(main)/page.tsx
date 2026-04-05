// app/(main)/page.tsx  —  Home / Discover page
import type { Metadata } from "next";
import Image from "next/image";
import Link  from "next/link";
import {
  Play,
  TrendingUp,
  Clock,
  Flame,
  Music2,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title:       "Home",
  description: "Discover new music, trending songs and your recent plays.",
};

// ─── Placeholder data (replace with real API calls) ───────────────────────────

const FEATURED = {
  id:          "1",
  title:       "Blinding Lights",
  artist:      "The Weeknd",
  album:       "After Hours",
  thumbnail:   "https://picsum.photos/seed/featured/800/400",
  description: "The global hit that defined an era. Synth-pop perfection.",
};

const TRENDING: Song[] = [
  { id:"1", title:"Levitating",         artist:"Dua Lipa",      thumbnail:"https://picsum.photos/seed/s1/200/200", duration:203 },
  { id:"2", title:"Stay",               artist:"The Kid LAROI",  thumbnail:"https://picsum.photos/seed/s2/200/200", duration:141 },
  { id:"3", title:"Good 4 U",           artist:"Olivia Rodrigo", thumbnail:"https://picsum.photos/seed/s3/200/200", duration:178 },
  { id:"4", title:"Montero",            artist:"Lil Nas X",      thumbnail:"https://picsum.photos/seed/s4/200/200", duration:137 },
  { id:"5", title:"Butter",             artist:"BTS",            thumbnail:"https://picsum.photos/seed/s5/200/200", duration:164 },
  { id:"6", title:"Peaches",            artist:"Justin Bieber",  thumbnail:"https://picsum.photos/seed/s6/200/200", duration:198 },
];

const NEW_RELEASES: Album[] = [
  { id:"1", title:"Midnight Rain",    artist:"Taylor Swift",  thumbnail:"https://picsum.photos/seed/a1/300/300", year:2024 },
  { id:"2", title:"SOS",             artist:"SZA",            thumbnail:"https://picsum.photos/seed/a2/300/300", year:2024 },
  { id:"3", title:"Un Verano Sin Ti",artist:"Bad Bunny",      thumbnail:"https://picsum.photos/seed/a3/300/300", year:2024 },
  { id:"4", title:"Renaissance",     artist:"Beyoncé",        thumbnail:"https://picsum.photos/seed/a4/300/300", year:2024 },
  { id:"5", title:"Honestly, Nevermind",artist:"Drake",       thumbnail:"https://picsum.photos/seed/a5/300/300", year:2024 },
];

const GENRES = [
  { id:"pop",    label:"Pop",      color:"#7C6FE0", bg:"rgba(124,111,224,.12)" },
  { id:"hiphop", label:"Hip-Hop",  color:"#E07C9F", bg:"rgba(224,124,159,.12)" },
  { id:"rnb",    label:"R&B",      color:"#7CB8E0", bg:"rgba(124,184,224,.12)" },
  { id:"rock",   label:"Rock",     color:"#E0A87C", bg:"rgba(224,168,124,.12)" },
  { id:"jazz",   label:"Jazz",     color:"#7CE0B8", bg:"rgba(124,224,184,.12)" },
  { id:"edm",    label:"EDM",      color:"#C07CE0", bg:"rgba(192,124,224,.12)" },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface Song  { id:string; title:string; artist:string; thumbnail:string; duration:number; }
interface Album { id:string; title:string; artist:string; thumbnail:string; year:number; }

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  title,
  href,
}: {
  icon:  React.ElementType;
  title: string;
  href?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-[var(--brand)]" />
        <h2 className="text-base font-semibold text-[var(--text-primary)]">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="
            flex items-center gap-1 text-xs
            text-[var(--text-muted)]
            hover:text-[var(--brand)]
            transition-colors
          "
        >
          See all <ChevronRight size={13} />
        </Link>
      )}
    </div>
  );
}

function AlbumCard({ album }: { album: Album }) {
  return (
    <Link href={`/album/${album.id}`} className="music-card group block">
      <Image
        src={album.thumbnail}
        alt={album.title}
        width={200}
        height={200}
        className="music-card__art"
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
      />
      <div className="music-card__overlay" />
      <button className="music-card__play">
        <Play size={18} strokeWidth={2.5} />
      </button>
      <div className="mt-2.5 px-0.5">
        <p className="text-sm font-medium text-[var(--text-primary)] truncate leading-tight">
          {album.title}
        </p>
        <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
          {album.artist} · {album.year}
        </p>
      </div>
    </Link>
  );
}

function SongRow({ song, index }: { song: Song; index: number }) {
  const mins = Math.floor(song.duration / 60);
  const secs = String(song.duration % 60).padStart(2, "0");

  return (
    <div className="song-row group">
      {/* Index / equalizer */}
      <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
        <span className="text-sm text-[var(--text-muted)] group-hover:hidden">
          {index + 1}
        </span>
        <button className="hidden group-hover:flex items-center justify-center w-8 h-8">
          <Play size={14} className="text-[var(--text-primary)]" />
        </button>
      </div>

      {/* Thumbnail + info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Image
          src={song.thumbnail}
          alt={song.title}
          width={40}
          height={40}
          className="w-10 h-10 rounded-md object-cover flex-shrink-0 bg-[var(--bg-elevated)]"
        />
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--text-primary)] truncate">
            {song.title}
          </p>
          <p className="text-xs text-[var(--text-muted)] truncate">
            {song.artist}
          </p>
        </div>
      </div>

      {/* Duration */}
      <span className="text-xs text-[var(--text-muted)] flex-shrink-0">
        {mins}:{secs}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" :
    hour < 18 ? "Good afternoon" :
                "Good evening";

  return (
    <div className="container py-8 space-y-12 animate-fade-in">

      {/* ── Greeting ── */}
      <div>
        <p className="label-overline mb-1">Dashboard</p>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          {greeting} 👋
        </h1>
        <p className="text-[var(--text-muted)] mt-1 text-sm">
          What do you want to listen to today?
        </p>
      </div>

      {/* ── Featured Banner ── */}
      <section>
        <div
          className="
            relative overflow-hidden rounded-[var(--radius-xl)]
            border border-[var(--border)]
            h-52 sm:h-64
            group cursor-pointer
          "
        >
          <Image
            src={FEATURED.thumbnail}
            alt={FEATURED.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(10,10,15,.9) 40%, rgba(10,10,15,.2))",
            }}
          />
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
            <span className="badge badge-brand w-fit mb-3">
              🔥 Featured
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {FEATURED.title}
            </h2>
            <p className="text-sm text-white/60 mb-4">
              {FEATURED.artist} · {FEATURED.album}
            </p>
            <button
              className="
                btn btn-primary w-fit flex items-center gap-2
                px-5 py-2.5
              "
            >
              <Play size={15} strokeWidth={2.5} />
              Play Now
            </button>
          </div>
        </div>
      </section>

      {/* ── Trending Now ── */}
      <section>
        <SectionHeader
          icon={Flame}
          title="Trending Now"
          href="/charts"
        />
        <div className="space-y-1">
          {TRENDING.map((song, i) => (
            <SongRow key={song.id} song={song} index={i} />
          ))}
        </div>
      </section>

      {/* ── New Releases ── */}
      <section>
        <SectionHeader
          icon={TrendingUp}
          title="New Releases"
          href="/new-releases"
        />
        <div
          className="
            grid gap-5
            grid-cols-2 sm:grid-cols-3
            md:grid-cols-4 xl:grid-cols-5
            stagger
          "
        >
          {NEW_RELEASES.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </section>

      {/* ── Browse Genres ── */}
      <section>
        <SectionHeader
          icon={Music2}
          title="Browse by Genre"
          href="/genres"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {GENRES.map((genre) => (
            <Link
              key={genre.id}
              href={`/genre/${genre.id}`}
              className="
                flex items-center justify-center
                h-16 rounded-[var(--radius-lg)]
                border border-[var(--border)]
                text-sm font-semibold
                transition-all duration-[var(--duration-base)]
                hover:scale-105 hover:border-[var(--border-hover)]
              "
              style={{
                background: genre.bg,
                color:      genre.color,
              }}
            >
              {genre.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Recently Played ── */}
      <section>
        <SectionHeader
          icon={Clock}
          title="Recently Played"
          href="/history"
        />
        <div
          className="
            grid gap-5
            grid-cols-2 sm:grid-cols-3
            md:grid-cols-4 xl:grid-cols-5
            stagger
          "
        >
          {/* Reusing trending as placeholder — replace with real history */}
          {TRENDING.slice(0, 5).map((song) => (
            <AlbumCard
              key={song.id}
              album={{
                id:        song.id,
                title:     song.title,
                artist:    song.artist,
                thumbnail: song.thumbnail,
                year:      2024,
              }}
            />
          ))}
        </div>
      </section>

    </div>
  );
}