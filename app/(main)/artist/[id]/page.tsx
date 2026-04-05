// app/(main)/artist/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Play, Shuffle, CheckCircle2, Music2, Disc3 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Song  { id:string; title:string; plays:string; duration:number; thumbnail:string; }
interface Album { id:string; title:string; year:number; thumbnail:string; }

// ─── Mock fetcher (replace with real API) ─────────────────────────────────────
async function getArtist(id: string) {
  return {
    id,
    name:        "The Weeknd",
    bio:         "Abel Makkonen Tesfaye, known professionally as The Weeknd, is a Canadian singer, songwriter, and record producer. Known for his sonic versatility and dark lyricism.",
    thumbnail:   "https://picsum.photos/seed/artist1/800/400",
    avatar:      "https://picsum.photos/seed/artist1av/300/300",
    followers:   "57.2M",
    isVerified:  true,
    monthlyListeners: "82.4M",
    genres:      ["R&B", "Pop", "Alternative"],
    topSongs: [
      { id:"1", title:"Blinding Lights",  plays:"3.8B", duration:200, thumbnail:"https://picsum.photos/seed/as1/80/80" },
      { id:"2", title:"Starboy",           plays:"2.9B", duration:230, thumbnail:"https://picsum.photos/seed/as2/80/80" },
      { id:"3", title:"Save Your Tears",   plays:"2.4B", duration:215, thumbnail:"https://picsum.photos/seed/as3/80/80" },
      { id:"4", title:"Die For You",       plays:"2.1B", duration:259, thumbnail:"https://picsum.photos/seed/as4/80/80" },
      { id:"5", title:"Can't Feel My Face",plays:"1.9B", duration:213, thumbnail:"https://picsum.photos/seed/as5/80/80" },
    ] as Song[],
    albums: [
      { id:"1", title:"After Hours",      year:2020, thumbnail:"https://picsum.photos/seed/aa1/300/300" },
      { id:"2", title:"Dawn FM",           year:2022, thumbnail:"https://picsum.photos/seed/aa2/300/300" },
      { id:"3", title:"Starboy",           year:2016, thumbnail:"https://picsum.photos/seed/aa3/300/300" },
      { id:"4", title:"Beauty Behind the Madness", year:2015, thumbnail:"https://picsum.photos/seed/aa4/300/300" },
    ] as Album[],
  };
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const artist = await getArtist(params.id);
  return { title: artist.name, description: artist.bio };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ArtistPage({ params }: { params: { id: string } }) {
  const artist = await getArtist(params.id);

  return (
    <div className="animate-fade-in">

      {/* ── Hero banner ── */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <Image
          src={artist.thumbnail}
          alt={artist.name}
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0"
          style={{ background:"linear-gradient(to bottom, rgba(10,10,15,0) 0%, rgba(10,10,15,.7) 60%, var(--bg-base) 100%)" }}
        />
        <div className="absolute bottom-6 left-6 sm:left-8 flex items-end gap-4">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
            <Image src={artist.avatar} alt={artist.name} fill className="object-cover" />
          </div>
          <div>
            {artist.isVerified && (
              <div className="flex items-center gap-1.5 mb-1">
                <CheckCircle2 size={14} className="text-[var(--brand)]" />
                <span className="text-xs text-[var(--brand)] font-semibold">Verified Artist</span>
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl font-bold text-white">{artist.name}</h1>
            <p className="text-sm text-white/60 mt-1">{artist.monthlyListeners} monthly listeners</p>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-10">

        {/* ── Actions ── */}
        <div className="flex items-center gap-3">
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
          <button className="btn btn-ghost border-[var(--border-brand)] text-[var(--brand)] hover:bg-[var(--brand)]/10">
            Follow · {artist.followers}
          </button>
        </div>

        {/* ── Genre tags ── */}
        <div className="flex flex-wrap gap-2">
          {artist.genres.map(g => (
            <span key={g} className="badge">{g}</span>
          ))}
        </div>

        {/* ── Popular songs ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Music2 size={16} className="text-[var(--brand)]" />
            <h2 className="text-base font-semibold text-[var(--text-primary)]">Popular</h2>
          </div>
          <div className="space-y-1">
            {artist.topSongs.map((song, i) => (
              <div
                key={song.id}
                className="song-row group cursor-pointer"
                style={{ display:"grid", gridTemplateColumns:"40px 1fr auto auto", gap:"12px", alignItems:"center", padding:"8px 12px", borderRadius:"var(--radius-md)" }}
              >
                <div className="flex items-center justify-center">
                  <span className="text-sm text-[var(--text-muted)] group-hover:hidden">{i + 1}</span>
                  <Play size={14} className="hidden group-hover:block text-[var(--text-primary)]" />
                </div>
                <div className="flex items-center gap-3 min-w-0">
                  <Image src={song.thumbnail} alt={song.title} width={40} height={40}
                    className="w-10 h-10 rounded-[var(--radius-md)] object-cover flex-shrink-0" />
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{song.title}</p>
                </div>
                <span className="text-xs text-[var(--text-muted)] hidden sm:block">{song.plays}</span>
                <span className="text-xs text-[var(--text-muted)]">
                  {Math.floor(song.duration/60)}:{String(song.duration%60).padStart(2,"0")}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Albums ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Disc3 size={16} className="text-[var(--brand)]" />
            <h2 className="text-base font-semibold text-[var(--text-primary)]">Albums</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 stagger">
            {artist.albums.map(album => (
              <Link key={album.id} href={`/album/${album.id}`} className="music-card block">
                <Image src={album.thumbnail} alt={album.title} width={200} height={200}
                  className="music-card__art" />
                <div className="music-card__overlay" />
                <button className="music-card__play"><Play size={18} /></button>
                <div className="mt-2.5 px-0.5">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{album.title}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{album.year}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Bio ── */}
        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-3">About</h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
            {artist.bio}
          </p>
        </section>
      </div>
    </div>
  );
}