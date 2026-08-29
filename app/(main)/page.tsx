/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(main)/page.tsx — Premium Unique 3D Home / Discover Experience
"use client";

import { useEffect, useState, useRef, MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Pause,
  TrendingUp,
  Clock,
  Flame,
  Music2,
  ChevronRight,
  Heart,
  Sparkles,
  Disc,
  Headphones,
  Zap,
  Folder,
  Radio,
  Volume2,
} from "lucide-react";
import { usePlayerStore, Track } from "@/store/playerStore";
import { useLikedStore } from "@/store/likedStore";
import { useFolderStore } from "@/store/folderStore";
import { cleanTrackTitle } from "@/lib/urlMetadata";
import {
  FEATURED_TRACK,
  CATALOG_TRACKS,
  ALBUMS,
  GENRES,
} from "@/lib/catalog";

function YoutubeIcon({ size = 10, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  href,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  href?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[var(--brand)]/15 border border-[var(--brand)]/30 flex items-center justify-center text-[var(--brand)]">
            <Icon size={16} />
          </div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="text-xs text-[var(--text-muted)] mt-0.5 ml-10">
            {subtitle}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="
            flex items-center gap-1 text-xs font-semibold
            text-[var(--brand)]
            hover:underline transition-all
          "
        >
          Explore All <ChevronRight size={13} />
        </Link>
      )}
    </div>
  );
}

const VIBE_CATEGORIES = [
  { id: "all", label: "All Audio", icon: Sparkles },
  { id: "chill", label: "Chill & Relax", icon: Headphones },
  { id: "workout", label: "Energetic Beats", icon: Zap },
  { id: "radio", label: "Live Radio", icon: Radio },
];

export default function HomePage() {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  const { isLiked, toggleLike } = useLikedStore();
  const { folders } = useFolderStore();

  const [greeting, setGreeting] = useState("Good day");
  const [mounted, setMounted] = useState(false);
  const [userSongs, setUserSongs] = useState<Track[]>([]);
  const [selectedVibe, setSelectedVibe] = useState("all");

  // 3D Tilt calculation state for Hero section
  const heroRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleHeroMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -12, y: x * 12 });
  };

  const handleHeroMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    setGreeting(
      hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
    );

    fetch("/api/songs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const mapped: Track[] = data.data.map((s: any) => ({
            id: s._id,
            title: s.title,
            artist: s.artist,
            audioUrl: s.audioUrl,
            thumbnail: s.thumbnailUrl || "/assets/images/default-song.png",
            type: s.type || "youtube",
            duration: s.duration || 180,
          }));
          setUserSongs(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const allTrendingTracks = [...userSongs, ...CATALOG_TRACKS];

  const handlePlaySong = (track: Track, queueList: Track[] = allTrendingTracks) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, queueList);
    }
  };

  const isFeaturedPlaying = currentTrack?.id === FEATURED_TRACK.id && isPlaying;
  const isFeaturedLiked = mounted ? isLiked(FEATURED_TRACK.id) : false;

  return (
    <div className="container py-8 space-y-12 animate-fade-in pb-20">

      {/* ── 1. Unique Header & Vibe Category Filter Pills ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/15 border border-[var(--brand)]/30 text-[var(--brand)] text-xs font-bold mb-2">
            <Sparkles size={13} className="animate-pulse" />
            <span>MUSIFY 3D EXPERIENCE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            {greeting}, Music Lover 👋
          </h1>
          <p className="text-[var(--text-muted)] mt-1 text-sm">
            Curated high-fidelity audio, custom music folders, and 3D vinyl collections.
          </p>
        </div>

        {/* Vibe Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {VIBE_CATEGORIES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedVibe(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                selectedVibe === id
                  ? "bg-[var(--brand)] text-white shadow-lg shadow-[var(--brand)]/30 scale-105"
                  : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--brand)]/50 hover:text-white"
              }`}
            >
              <Icon size={14} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 2. Futuristic 3D Holographic Spotlight Hero Section ── */}
      <section className="perspective-1000">
        <div
          ref={heroRef}
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={handleHeroMouseLeave}
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: "transform 0.15s ease-out",
          }}
          className="
            relative overflow-hidden rounded-[var(--radius-xl)]
            border border-[var(--brand)]/40
            min-h-[280px] sm:min-h-[320px]
            preserve-3d shadow-2xl group cursor-pointer
            bg-gradient-to-r from-zinc-950 via-indigo-950 to-purple-950
          "
        >
          {/* Ambient Glowing 3D Light Orbs */}
          <div className="glow-3d-orb w-80 h-80 bg-violet-600/35 -top-16 -left-16" />
          <div className="glow-3d-orb w-80 h-80 bg-indigo-500/25 -bottom-16 -right-16" />

          {/* Background Artwork Backdrop */}
          <Image
            src={FEATURED_TRACK.thumbnail || "https://picsum.photos/seed/featured/800/400"}
            alt={FEATURED_TRACK.title}
            fill
            className="object-cover opacity-25 group-hover:opacity-35 transition-opacity duration-700 group-hover:scale-105"
            priority
          />

          {/* Glass Overlay */}
          <div
            className="absolute inset-0 preserve-3d"
            style={{
              background:
                "linear-gradient(to right, rgba(10,10,20,0.95) 45%, rgba(10,10,20,0.6))",
            }}
          />

          {/* Holographic Sound Wave Spectrum Bars */}
          <div className="absolute top-6 right-8 hidden md:flex items-end gap-1 h-12 opacity-80 pointer-events-none">
            {[40, 75, 55, 90, 65, 80, 45, 100, 70, 85, 50, 95, 60].map((h, idx) => (
              <div
                key={idx}
                className="w-1.5 bg-[var(--brand)] rounded-full animate-bounce"
                style={{
                  height: `${h}%`,
                  animationDuration: `${0.6 + (idx % 5) * 0.2}s`,
                }}
              />
            ))}
          </div>

          {/* 3D Hero Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 preserve-3d">
            <div className="translate-z-30 mb-3 flex items-center gap-3">
              <span className="badge bg-[var(--brand)] text-white font-bold px-3 py-1 text-xs rounded-full shadow-lg shadow-[var(--brand)]/40 flex items-center gap-1.5 w-fit">
                <Sparkles size={12} /> FEATURED SPOTLIGHT
              </span>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <Radio size={10} className="animate-pulse" /> 14.2K Listening Now
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white mb-2 translate-z-30 drop-shadow-lg tracking-tight">
              {cleanTrackTitle(FEATURED_TRACK.title)}
            </h2>

            <p className="text-sm sm:text-base text-white/80 mb-6 translate-z-20 font-medium max-w-xl">
              {FEATURED_TRACK.artist} · <span className="text-[var(--brand)] font-bold">{FEATURED_TRACK.album}</span>
            </p>

            <div className="flex items-center gap-4 translate-z-30">
              <button
                onClick={() => handlePlaySong(FEATURED_TRACK, CATALOG_TRACKS)}
                className="
                  btn btn-primary flex items-center gap-2.5
                  px-8 py-3.5 rounded-full shadow-2xl shadow-[var(--brand)]/60
                  hover:scale-105 transition-all font-bold text-sm uppercase tracking-wider
                "
              >
                {isFeaturedPlaying ? (
                  <>
                    <Pause size={18} fill="white" /> Pause Stream
                  </>
                ) : (
                  <>
                    <Play size={18} strokeWidth={2.5} fill="white" /> Stream Now
                  </>
                )}
              </button>

              <button
                onClick={() => toggleLike(FEATURED_TRACK)}
                className={`
                  p-3.5 rounded-full border border-white/20 backdrop-blur-xl transition-all hover:scale-110
                  ${isFeaturedLiked ? "bg-red-500 text-white border-red-500/50 shadow-lg shadow-red-500/30" : "bg-black/50 text-white/80 hover:text-white"}
                `}
                title={isFeaturedLiked ? "Remove from Liked" : "Save to Liked Songs"}
              >
                <Heart size={20} fill={isFeaturedLiked ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Quick Access 6-Grid (Spotify Style 3D Cards) ── */}
      <section>
        <SectionHeader
          icon={Zap}
          title="Quick Pick Collections"
          subtitle="Instant access to your top catalog tracks"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {CATALOG_TRACKS.slice(0, 6).map((track) => {
            const isCurrent = currentTrack?.id === track.id;
            const isPlayingCurrent = isCurrent && isPlaying;

            return (
              <div
                key={track.id}
                onClick={() => handlePlaySong(track, CATALOG_TRACKS)}
                className={`group flex items-center gap-3.5 p-2.5 rounded-[var(--radius-lg)] border cursor-pointer transition-all duration-300 ${
                  isCurrent
                    ? "bg-[var(--brand)]/20 border-[var(--brand)] shadow-md"
                    : "bg-[var(--bg-surface)] border-[var(--border)] hover:bg-[var(--bg-elevated)] hover:border-[var(--brand)]/40 hover:shadow-lg"
                }`}
              >
                <div className="relative w-14 h-14 rounded-md overflow-hidden shrink-0 shadow-md">
                  <Image
                    src={track.thumbnail || "/assets/images/default-song.png"}
                    alt={track.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {isPlayingCurrent ? (
                      <Pause size={18} className="text-white" fill="white" />
                    ) : (
                      <Play size={18} className="text-white ml-0.5" fill="white" />
                    )}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-bold truncate ${isCurrent ? "text-[var(--brand)]" : "text-[var(--text-primary)]"}`}>
                    {cleanTrackTitle(track.title)}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">
                    {track.artist}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 4. Your Music Folders Shelf (Custom User Playlists) ── */}
      {folders.length > 0 && (
        <section>
          <SectionHeader
            icon={Folder}
            title="Your Custom Music Lists & Folders"
            subtitle="Playlists organized by you"
            href="/playlist"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {folders.slice(0, 3).map((folder) => (
              <Link
                key={folder.id}
                href="/playlist"
                className="group relative p-4 rounded-[var(--radius-xl)] bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--brand)]/50 transition-all shadow-md hover:shadow-xl flex items-center gap-4"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${folder.coverBg} flex items-center justify-center shrink-0 shadow-md text-white border border-white/10`}>
                  <Folder size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--brand)] truncate">
                    {folder.name}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                    {folder.tracks.length} {folder.tracks.length === 1 ? "track" : "tracks"} saved
                  </p>
                </div>
                <ChevronRight size={16} className="text-[var(--text-muted)] group-hover:text-[var(--brand)] transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── 5. Trending Tracks List ── */}
      <section>
        <SectionHeader
          icon={Flame}
          title="Trending Audio Stream"
          subtitle="Top played tracks across Musify"
          href="/search"
        />
        <div className="space-y-2">
          {allTrendingTracks.slice(0, 6).map((song, i) => {
            const isCurrent = currentTrack?.id === song.id;
            const isPlayingCurrent = isCurrent && isPlaying;
            const liked = mounted ? isLiked(song.id) : false;
            const mins = Math.floor((song.duration || 180) / 60);
            const secs = String((song.duration || 180) % 60).padStart(2, "0");
            const isYt = song.type === "youtube" || (song.audioUrl && (song.audioUrl.includes("youtube") || song.audioUrl.includes("youtu.be")));

            return (
              <div
                key={song.id || i}
                onClick={() => handlePlaySong(song, allTrendingTracks)}
                className={`
                  song-row group flex items-center justify-between gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 border
                  ${
                    isCurrent
                      ? "bg-[var(--brand)]/15 border-[var(--brand)]/50 text-[var(--brand)] shadow-md"
                      : "bg-[var(--bg-surface)] border-[var(--border)] hover:border-[var(--brand)]/40 hover:bg-[var(--bg-elevated)] hover:-translate-y-0.5"
                  }
                `}
              >
                <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
                  {isPlayingCurrent ? (
                    <span className="flex items-end justify-center gap-0.5 h-3.5">
                      <span className="w-1 bg-[var(--brand)] animate-bounce h-full rounded-full"></span>
                      <span className="w-1 bg-[var(--brand)] animate-bounce h-2 delay-100 rounded-full"></span>
                      <span className="w-1 bg-[var(--brand)] animate-bounce h-2.5 delay-200 rounded-full"></span>
                    </span>
                  ) : (
                    <>
                      <span className="text-xs font-mono text-[var(--text-muted)] group-hover:hidden">
                        {i + 1}
                      </span>
                      <button className="hidden group-hover:flex items-center justify-center w-8 h-8 text-[var(--brand)]">
                        <Play size={15} fill="currentColor" />
                      </button>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <Image
                    src={song.thumbnail || "/assets/images/default-song.png"}
                    alt={song.title}
                    width={44}
                    height={44}
                    className="w-11 h-11 rounded-xl object-cover flex-shrink-0 bg-[var(--bg-elevated)] border border-white/10 shadow-md"
                  />
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${isCurrent ? "text-[var(--brand)]" : "text-[var(--text-primary)]"}`}>
                      {cleanTrackTitle(song.title)}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] truncate">
                      {song.artist}
                    </p>
                  </div>
                </div>

                {isYt && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 font-bold border border-red-500/20">
                    <YoutubeIcon size={10} /> YT
                  </span>
                )}

                <span className="text-xs font-mono text-[var(--text-muted)] flex-shrink-0 hidden xs:block">
                  {mins}:{secs}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(song);
                  }}
                  className={`
                    p-2 rounded-full transition-all flex-shrink-0
                    ${
                      liked
                        ? "text-red-500 bg-red-500/15"
                        : "text-[var(--text-muted)] hover:text-red-400 opacity-0 group-hover:opacity-100 hover:bg-white/5"
                    }
                  `}
                  title={liked ? "Remove from Liked" : "Like Song"}
                >
                  <Heart size={16} fill={liked ? "currentColor" : "none"} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 6. 3D Vinyl Album Showcase ── */}
      <section>
        <SectionHeader
          icon={TrendingUp}
          title="3D Vinyl Collectors & Albums"
          subtitle="Slide-out vinyl audio experience"
          href="/search"
        />
        <div
          className="
            grid gap-6
            grid-cols-2 sm:grid-cols-3
            md:grid-cols-4 xl:grid-cols-5
          "
        >
          {ALBUMS.map((album) => {
            const matchingTrack = CATALOG_TRACKS.find(t => t.album === album.title || t.artist === album.artist) || CATALOG_TRACKS[0];
            const isPlayingAlbum = currentTrack?.id === matchingTrack.id && isPlaying;
            const liked = mounted ? isLiked(matchingTrack.id) : false;

            return (
              <div key={album.id} className="card-3d-wrap group block relative cursor-pointer">
                <div className="card-3d-body relative aspect-square w-full rounded-[var(--radius-xl)] bg-[var(--bg-surface)] border border-white/10 shadow-xl overflow-hidden">
                  
                  {/* 3D Vinyl Record */}
                  <div className={`vinyl-disc absolute right-2 top-2 w-[85%] h-[85%] rounded-full bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-800 border-4 border-zinc-700/80 shadow-2xl flex items-center justify-center opacity-0 ${isPlayingAlbum ? "vinyl-active" : ""}`}>
                    <div className="w-10 h-10 rounded-full bg-[var(--brand)]/80 border-2 border-white/20 flex items-center justify-center">
                      <Disc size={16} className="text-white animate-spin-slow" />
                    </div>
                  </div>

                  {/* Album Cover */}
                  <Image
                    src={album.thumbnail}
                    alt={album.title}
                    fill
                    className="object-cover rounded-[var(--radius-xl)] shadow-md group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={() => handlePlaySong(matchingTrack, CATALOG_TRACKS)}
                      className="w-12 h-12 rounded-full bg-[var(--brand)] text-white flex items-center justify-center hover:scale-110 shadow-2xl transition-transform"
                      title="Play album"
                    >
                      {isPlayingAlbum ? <Pause size={20} fill="white" /> : <Play size={20} strokeWidth={2.5} fill="white" className="ml-0.5" />}
                    </button>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(matchingTrack);
                    }}
                    className={`
                      absolute top-3 right-3 p-2 rounded-full backdrop-blur-xl transition-all z-10
                      ${liked ? "bg-red-500 text-white" : "bg-black/50 text-white/70 opacity-0 group-hover:opacity-100 hover:text-white"}
                    `}
                  >
                    <Heart size={15} fill={liked ? "currentColor" : "none"} />
                  </button>
                </div>

                <div className="mt-3 px-1">
                  <p className="text-sm font-bold text-[var(--text-primary)] truncate group-hover:text-[var(--brand)] transition-colors">
                    {album.title}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                    {album.artist} · {album.year}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 7. Mood Radar Tiles ── */}
      <section>
        <SectionHeader
          icon={Music2}
          title="Browse Audio Vibe Radar"
          subtitle="Filter audio streams by mood"
          href="/search"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
          {GENRES.slice(0, 6).map((genre) => (
            <Link
              key={genre.id}
              href={`/search?genre=${genre.id}`}
              className="
                relative overflow-hidden group
                flex flex-col items-center justify-center
                h-20 rounded-[var(--radius-xl)]
                border border-white/10
                text-sm font-bold
                transition-all duration-300
                hover:scale-105 hover:-translate-y-1
                shadow-lg preserve-3d
              "
              style={{
                background: genre.bg,
                color: genre.color,
              }}
            >
              <div className="absolute -right-3 -bottom-3 opacity-20 group-hover:opacity-40 transition-opacity">
                <Disc size={64} />
              </div>
              <span className="translate-z-20 drop-shadow-md">{genre.label}</span>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}