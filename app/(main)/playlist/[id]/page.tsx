// app/(main)/playlist/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Play, Shuffle, Heart, Clock, MoreHorizontal, Music2, Pencil } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PlaylistSong {
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

async function getPlaylist(id: string) {
  const res = await fetch(`http://localhost:3000/api/playlists/${id}`, {
    cache: "no-store",
  });

  const data = await res.json();
  return data.data;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const pl = await getPlaylist(params.id);
  return { title: pl.title, description: pl.description };
}

function fmt(secs: number) {
  return `${Math.floor(secs/60)}:${String(secs%60).padStart(2,"0")}`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function PlaylistPage({ params }: { params: { id: string } }) {
  const pl = await getPlaylist(params.id);
  const totalMins = Math.floor(pl.songs.reduce((s, t) => s + t.duration, 0) / 60);

  return (
    <div className="animate-fade-in">

      {/* ── Hero ── */}
      <div
        className="px-6 sm:px-8 pt-10 pb-8 border-b border-[var(--border)]"
        style={{ background:"linear-gradient(to bottom, rgba(124,111,224,.12), transparent)" }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">

          {/* Cover */}
          <div className="relative w-40 h-40 sm:w-52 sm:h-52 flex-shrink-0 rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-lg)] group">
            <Image src={pl.thumbnail} alt={pl.title} fill className="object-cover" priority />
            {pl.isOwner && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Pencil size={24} className="text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="label-overline mb-2">
              {pl.isPublic ? "Public Playlist" : "Private Playlist"}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-2">
              {pl.title}
            </h1>
            <p className="text-sm text-[var(--text-muted)] mb-2">{pl.description}</p>
            <div className="flex items-center gap-2 flex-wrap text-sm">
              <span className="font-semibold text-[var(--text-primary)]">{pl.owner}</span>
              <span className="text-[var(--text-muted)]">·</span>
              <span className="text-[var(--text-muted)]">{pl.songs.length} songs</span>
              <span className="text-[var(--text-muted)]">·</span>
              <span className="text-[var(--text-muted)]">{totalMins} min</span>
              <span className="text-[var(--text-muted)]">·</span>
              <span className="text-[var(--text-muted)]">{pl.followers} followers</span>
            </div>
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
              <button className="btn-icon"><Heart size={16} /></button>
              <button className="btn-icon"><MoreHorizontal size={16} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Track list ── */}
      <div className="container py-6">
        <div
          className="grid gap-3 px-3 py-2 mb-1 border-b border-[var(--border)] text-[var(--text-muted)]"
          style={{ gridTemplateColumns:"40px 1fr 1fr auto" }}
        >
          <span className="text-xs">#</span>
          <span className="text-xs">Title</span>
          <span className="text-xs hidden md:block">Album</span>
          <Clock size={13} />
        </div>

        <div className="space-y-0.5 stagger">
          {pl.songs.map((song, i) => (
            <div
              key={song.id}
              className="song-row group cursor-pointer"
              style={{ display:"grid", gridTemplateColumns:"40px 1fr 1fr auto", gap:"12px", alignItems:"center", padding:"8px 12px", borderRadius:"var(--radius-md)" }}
            >
              <div className="flex items-center justify-center">
                <span className="text-sm text-[var(--text-muted)] group-hover:hidden">{i+1}</span>
                <Play size={14} className="hidden group-hover:block text-[var(--text-primary)]" />
              </div>
              <div className="flex items-center gap-3 min-w-0">
                <Image src={song.thumbnail} alt={song.title} width={40} height={40}
                  className="w-10 h-10 rounded-[var(--radius-md)] object-cover flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{song.title}</p>
                  <Link href={`/artist/${song.artistId}`}
                    className="text-xs text-[var(--text-muted)] hover:text-[var(--brand)] hover:underline truncate block">
                    {song.artist}
                  </Link>
                </div>
              </div>
              <Link href={`/album/${song.albumId}`}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--brand)] hover:underline truncate hidden md:block">
                {song.album}
              </Link>
              <div className="flex items-center gap-2 justify-end">
                <button className="btn-icon w-7 h-7 border-none opacity-0 group-hover:opacity-100" onClick={e=>e.stopPropagation()}>
                  <Heart size={13} />
                </button>
                <span className="text-xs text-[var(--text-muted)] w-9 text-right">{fmt(song.duration)}</span>
                <button className="btn-icon w-7 h-7 border-none opacity-0 group-hover:opacity-100" onClick={e=>e.stopPropagation()}>
                  <MoreHorizontal size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add songs CTA */}
        {pl.isOwner && (
          <div className="mt-8 flex items-center gap-3 px-3 py-4 rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] hover:border-[var(--border-brand)] transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--brand)]/20 transition-colors">
              <Music2 size={16} className="text-[var(--text-muted)] group-hover:text-[var(--brand)]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Add more songs</p>
              <p className="text-xs text-[var(--text-muted)]">Find something to add to this playlist</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}