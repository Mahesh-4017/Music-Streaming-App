// app/(main)/liked-songs/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import type { Metadata } from "next";
import {
  Heart, Play, Pause, Shuffle, MoreHorizontal, Clock,
} from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Song {
  id:        string;
  title:     string;
  artist:    string;
  album:     string;
  thumbnail: string;
  duration:  number;
  addedAt:   string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const LIKED_SONGS: Song[] = [
  { id:"1", title:"Blinding Lights",  artist:"The Weeknd",     album:"After Hours",          thumbnail:"https://picsum.photos/seed/ls1/80/80",  duration:200, addedAt:"2024-01-15" },
  { id:"2", title:"Levitating",        artist:"Dua Lipa",       album:"Future Nostalgia",     thumbnail:"https://picsum.photos/seed/ls2/80/80",  duration:203, addedAt:"2024-01-10" },
  { id:"3", title:"Stay",              artist:"The Kid LAROI",  album:"F*CK LOVE 3",          thumbnail:"https://picsum.photos/seed/ls3/80/80",  duration:141, addedAt:"2024-01-08" },
  { id:"4", title:"Good 4 U",          artist:"Olivia Rodrigo", album:"SOUR",                 thumbnail:"https://picsum.photos/seed/ls4/80/80",  duration:178, addedAt:"2024-01-05" },
  { id:"5", title:"Montero",           artist:"Lil Nas X",      album:"MONTERO",              thumbnail:"https://picsum.photos/seed/ls5/80/80",  duration:137, addedAt:"2023-12-30" },
  { id:"6", title:"Butter",            artist:"BTS",            album:"Butter",               thumbnail:"https://picsum.photos/seed/ls6/80/80",  duration:164, addedAt:"2023-12-22" },
  { id:"7", title:"Peaches",           artist:"Justin Bieber",  album:"Justice",              thumbnail:"https://picsum.photos/seed/ls7/80/80",  duration:198, addedAt:"2023-12-18" },
  { id:"8", title:"drivers license",   artist:"Olivia Rodrigo", album:"SOUR",                 thumbnail:"https://picsum.photos/seed/ls8/80/80",  duration:242, addedAt:"2023-12-10" },
];

function formatDuration(secs: number) {
  return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
}

// ─── Song Row ─────────────────────────────────────────────────────────────────
function SongRow({
  song,
  index,
  isPlaying,
  isActive,
  onPlay,
}: {
  song:     Song;
  index:    number;
  isPlaying:boolean;
  isActive: boolean;
  onPlay:   () => void;
}) {
  const [liked, setLiked] = useState(true);

  return (
    <div
      className={`
        song-row group cursor-pointer
        grid-cols-[40px_1fr_auto_auto_auto]
        ${isActive ? "active" : ""}
      `}
      onClick={onPlay}
      style={{ display:"grid", alignItems:"center", gap:"12px", padding:"8px 12px", borderRadius:"var(--radius-md)" }}
    >
      {/* Index / play */}
      <div className="flex items-center justify-center w-8">
        {isActive && isPlaying ? (
          <div className="equalizer">
            <span /><span /><span />
          </div>
        ) : (
          <>
            <span className="text-sm text-[var(--text-muted)] group-hover:hidden">
              {index + 1}
            </span>
            <Pause size={14} className="hidden group-hover:block text-[var(--text-primary)]" />
          </>
        )}
      </div>

      {/* Thumbnail + info */}
      <div className="flex items-center gap-3 min-w-0">
        <Image
          src={song.thumbnail}
          alt={song.title}
          width={40}
          height={40}
          className="w-10 h-10 rounded-[var(--radius-md)] object-cover flex-shrink-0 bg-[var(--bg-elevated)]"
        />
        <div className="min-w-0">
          <p className={`text-sm font-medium truncate ${isActive ? "text-[var(--brand)]" : "text-[var(--text-primary)]"}`}>
            {song.title}
          </p>
          <p className="text-xs text-[var(--text-muted)] truncate">{song.artist}</p>
        </div>
      </div>

      {/* Album — hidden on small screens */}
      <p className="text-xs text-[var(--text-muted)] truncate hidden md:block max-w-[160px]">
        {song.album}
      </p>

      {/* Added date — hidden on small screens */}
      <p className="text-xs text-[var(--text-muted)] hidden lg:block whitespace-nowrap">
        {formatDate(song.addedAt)}
      </p>

      {/* Duration + heart */}
      <div className="flex items-center gap-3 justify-end">
        <button
          onClick={e => { e.stopPropagation(); setLiked(v => !v); }}
          className={`
            btn-icon w-7 h-7 border-none opacity-0
            group-hover:opacity-100
            ${liked ? "opacity-100 text-red-400" : "text-[var(--text-muted)]"}
          `}
        >
          <Heart size={14} fill={liked ? "currentColor" : "none"} />
        </button>
        <span className="text-xs text-[var(--text-muted)] w-9 text-right">
          {formatDuration(song.duration)}
        </span>
        <button
          className="btn-icon w-7 h-7 border-none opacity-0 group-hover:opacity-100"
          onClick={e => e.stopPropagation()}
        >
          <MoreHorizontal size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LikedSongsPage() {
  const { playSong, currentSong, isPlaying, togglePlay } = usePlayerStore();
  const [activeSongId, setActiveSongId] = useState<string | null>(null);

  const totalDuration = LIKED_SONGS.reduce((s, song) => s + song.duration, 0);
  const totalMins     = Math.floor(totalDuration / 60);

  const handlePlay = (song: Song) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      playSong(
        { id:song.id, title:song.title, artist:song.artist, thumbnail:song.thumbnail, audioUrl:"", duration:song.duration },
        LIKED_SONGS.map(s => ({ id:s.id, title:s.title, artist:s.artist, thumbnail:s.thumbnail, audioUrl:"", duration:s.duration }))
      );
      setActiveSongId(song.id);
    }
  };

  const handlePlayAll = () => {
    if (LIKED_SONGS[0]) handlePlay(LIKED_SONGS[0]);
  };

  return (
    <div className="animate-fade-in">

      {/* ── Hero ── */}
      <div
        className="
          flex flex-col sm:flex-row items-start sm:items-end gap-6
          px-6 sm:px-8 pt-12 pb-8
          border-b border-[var(--border)]
        "
        style={{ background: "linear-gradient(to bottom, rgba(124,111,224,.15), transparent)" }}
      >
        {/* Cover art */}
        <div
          className="
            w-36 h-36 sm:w-44 sm:h-44
            rounded-[var(--radius-xl)] flex-shrink-0
            bg-gradient-to-br from-[var(--brand)] to-[#C07CE0]
            flex items-center justify-center
            shadow-[var(--shadow-lg)]
          "
        >
          <Heart size={56} className="text-white" fill="white" />
        </div>

        {/* Info */}
        <div>
          <p className="label-overline mb-2">Playlist</p>
          <h1 className="text-3xl sm:text-5xl font-bold text-[var(--text-primary)] mb-3">
            Liked Songs
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            {LIKED_SONGS.length} songs · {totalMins} min
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={handlePlayAll}
              className="
                w-12 h-12 rounded-full
                bg-[var(--brand)] text-white
                flex items-center justify-center
                hover:bg-[var(--brand-dark)]
                shadow-[var(--shadow-brand)]
                transition-all hover:scale-105
              "
            >
              <Play size={20} strokeWidth={2.5} />
            </button>
            <button className="btn btn-ghost flex items-center gap-2">
              <Shuffle size={16} />
              Shuffle
            </button>
          </div>
        </div>
      </div>

      {/* ── Table header ── */}
      <div className="px-6 sm:px-8">
        <div
          className="
            grid grid-cols-[40px_1fr_auto_auto_auto]
            gap-3 px-3 py-2 mb-1
            border-b border-[var(--border)]
            text-[var(--text-muted)]
          "
        >
          <span className="text-xs">#</span>
          <span className="text-xs">Title</span>
          <span className="text-xs hidden md:block">Album</span>
          <span className="text-xs hidden lg:block">Date added</span>
          <Clock size={13} className="ml-auto" />
        </div>

        {/* ── Song list ── */}
        <div className="space-y-0.5 pb-8 stagger">
          {LIKED_SONGS.map((song, i) => (
            <SongRow
              key={song.id}
              song={song}
              index={i}
              isActive={currentSong?.id === song.id}
              isPlaying={isPlaying && currentSong?.id === song.id}
              onPlay={() => handlePlay(song)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}