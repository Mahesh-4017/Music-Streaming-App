// app/(main)/album/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Play, Shuffle, Heart, Clock, MoreHorizontal } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Track { id:string; trackNum:number; title:string; duration:number; plays:string; }

// ─── Mock fetcher (replace with API) ─────────────────────────────────────────
async function getAlbum(id: string) {
  return {
    id,
    title:       "After Hours",
    artist:      "The Weeknd",
    artistId:    "weeknd",
    year:        2020,
    genre:       "R&B / Pop",
    thumbnail:   "https://picsum.photos/seed/album1/500/500",
    label:       "Republic Records",
    description: "After Hours is the fourth studio album by The Weeknd. It features the global hit 'Blinding Lights'.",
    tracks: [
      { id:"1",  trackNum:1,  title:"Alone Again",          duration:276, plays:"320M" },
      { id:"2",  trackNum:2,  title:"Too Late",              duration:238, plays:"280M" },
      { id:"3",  trackNum:3,  title:"Hardest to Love",       duration:232, plays:"260M" },
      { id:"4",  trackNum:4,  title:"Scared to Live",        duration:200, plays:"240M" },
      { id:"5",  trackNum:5,  title:"Snowchild",             duration:261, plays:"310M" },
      { id:"6",  trackNum:6,  title:"Escape from LA",        duration:365, plays:"195M" },
      { id:"7",  trackNum:7,  title:"Heartless",             duration:189, plays:"890M" },
      { id:"8",  trackNum:8,  title:"Faith",                 duration:366, plays:"520M" },
      { id:"9",  trackNum:9,  title:"Blinding Lights",       duration:200, plays:"3.8B" },
      { id:"10", trackNum:10, title:"In Your Eyes",          duration:238, plays:"980M" },
      { id:"11", trackNum:11, title:"Save Your Tears",       duration:215, plays:"2.4B" },
      { id:"12", trackNum:12, title:"Repeat After Me",       duration:202, plays:"410M" },
      { id:"13", trackNum:13, title:"After Hours",            duration:361, plays:"620M" },
    ] as Track[],
  };
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const album = await getAlbum(params.id);
  return { title: `${album.title} · ${album.artist}`, description: album.description };
}

function formatDuration(secs: number) {
  return `${Math.floor(secs/60)}:${String(secs%60).padStart(2,"0")}`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function AlbumPage({ params }: { params: { id: string } }) {
  const album = await getAlbum(params.id);
  const totalDuration = album.tracks.reduce((s, t) => s + t.duration, 0);
  const totalMins = Math.floor(totalDuration / 60);

  return (
    <div className="animate-fade-in">

      {/* ── Hero ── */}
      <div
        className="px-6 sm:px-8 pt-10 pb-8 border-b border-[var(--border)]"
        style={{ background:"linear-gradient(to bottom, rgba(124,111,224,.12), transparent)" }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">

          {/* Cover */}
          <div className="relative w-40 h-40 sm:w-52 sm:h-52 flex-shrink-0 rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-lg)]">
            <Image src={album.thumbnail} alt={album.title} fill className="object-cover" priority />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="label-overline mb-2">Album</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-2">
              {album.title}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={`/artist/${album.artistId}`}
                className="text-sm font-semibold text-[var(--text-primary)] hover:underline">
                {album.artist}
              </Link>
              <span className="text-[var(--text-muted)]">·</span>
              <span className="text-sm text-[var(--text-muted)]">{album.year}</span>
              <span className="text-[var(--text-muted)]">·</span>
              <span className="text-sm text-[var(--text-muted)]">{album.tracks.length} songs</span>
              <span className="text-[var(--text-muted)]">·</span>
              <span className="text-sm text-[var(--text-muted)]">{totalMins} min</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">{album.genre} · {album.label}</p>

            {/* Action buttons */}
            <div className="flex items-center gap-3 mt-5">
              <button className="
                w-12 h-12 rounded-full bg-[var(--brand)] text-white
                flex items-center justify-center
                hover:bg-[var(--brand-dark)] hover:scale-105
                shadow-[var(--shadow-brand)] transition-all
              ">
                <Play size={20} strokeWidth={2.5} />
              </button>
              <button className="btn btn-ghost flex items-center gap-2">
                <Shuffle size={16} />Shuffle
              </button>
              <button className="btn-icon">
                <Heart size={16} />
              </button>
              <button className="btn-icon">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Track list ── */}
      <div className="container py-6">

        {/* Table header */}
        <div
          className="
            grid gap-3 px-3 py-2 mb-1
            border-b border-[var(--border)]
            text-[var(--text-muted)]
          "
          style={{ gridTemplateColumns:"40px 1fr auto auto" }}
        >
          <span className="text-xs">#</span>
          <span className="text-xs">Title</span>
          <span className="text-xs hidden sm:block">Plays</span>
          <Clock size={13} />
        </div>

        <div className="space-y-0.5 stagger">
          {album.tracks.map((track) => (
            <div
              key={track.id}
              className="song-row group cursor-pointer"
              style={{ display:"grid", gridTemplateColumns:"40px 1fr auto auto", gap:"12px", alignItems:"center", padding:"8px 12px", borderRadius:"var(--radius-md)" }}
            >
              {/* Track num / play */}
              <div className="flex items-center justify-center">
                <span className="text-sm text-[var(--text-muted)] group-hover:hidden">
                  {track.trackNum}
                </span>
                <Play size={14} className="hidden group-hover:block text-[var(--text-primary)]" />
              </div>

              {/* Title */}
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                {track.title}
              </p>

              {/* Plays */}
              <span className="text-xs text-[var(--text-muted)] hidden sm:block">
                {track.plays}
              </span>

              {/* Duration */}
              <div className="flex items-center gap-2 justify-end">
                <button
                  className="btn-icon w-7 h-7 border-none opacity-0 group-hover:opacity-100"
                  onClick={e => e.stopPropagation()}
                >
                  <Heart size={13} />
                </button>
                <span className="text-xs text-[var(--text-muted)] w-9 text-right">
                  {formatDuration(track.duration)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Album info footer ── */}
        <div className="mt-8 border-t border-[var(--border)] pt-6">
          <p className="text-xs text-[var(--text-muted)] mb-1">{album.year} · {album.label}</p>
          <p className="text-sm text-[var(--text-secondary)] max-w-xl leading-relaxed">
            {album.description}
          </p>
        </div>
      </div>
    </div>
  );
}