// app/(main)/playlist/[id]/PlaylistClient.tsx
// ✅ CLIENT COMPONENT — all onClick, usePlayerStore, useState lives here
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play, Pause, Shuffle, Heart, Clock,
  MoreHorizontal, Music2, Pencil,
} from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import type { Playlist, PlaylistSong } from "./page";

// ─── helpers ─────────────────────────────────────────────────────────────────
function fmt(secs: number) {
  return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
}

// Convert playlist song → playerStore Song shape
function toPlayerSong(s: PlaylistSong) {
  return {
    id:        s.id,
    title:     s.title,
    artist:    s.artist,
    thumbnail: s.thumbnail,
    audioUrl:  "",           // TODO: real URL from API
    duration:  s.duration,
  };
}

// ─── Song Row ─────────────────────────────────────────────────────────────────
function SongRow({
  song,
  index,
  isActive,
  isPlaying,
  onPlay,
}: {
  song:      PlaylistSong;
  index:     number;
  isActive:  boolean;
  isPlaying: boolean;
  onPlay:    () => void;
}) {
  const [liked, setLiked] = useState(false);

  return (
    <div
      onClick={onPlay}
      className={`
        group cursor-pointer
        grid gap-3 px-3 py-2.5
        rounded-[var(--radius-md)]
        transition-colors
        ${isActive
          ? "bg-[var(--brand)]/10"
          : "hover:bg-[var(--bg-elevated)]"
        }
      `}
      style={{ gridTemplateColumns: "40px 1fr 1fr auto", alignItems: "center" }}
    >
      {/* ── Index / play indicator ── */}
      <div className="flex items-center justify-center w-8 h-8">
        {isActive && isPlaying ? (
          // Animated equalizer
          <div className="equalizer">
            <span /><span /><span />
          </div>
        ) : isActive ? (
          <Pause size={14} className="text-[var(--brand)]" />
        ) : (
          <>
            <span className="text-sm text-[var(--text-muted)] group-hover:hidden">
              {index + 1}
            </span>
            <Play
              size={14}
              className="hidden group-hover:block text-[var(--text-primary)]"
            />
          </>
        )}
      </div>

      {/* ── Thumbnail + title + artist ── */}
      <div className="flex items-center gap-3 min-w-0">
        <Image
          src={song.thumbnail}
          alt={song.title}
          width={40}
          height={40}
          className="w-10 h-10 rounded-[var(--radius-md)] object-cover flex-shrink-0 bg-[var(--bg-elevated)]"
        />
        <div className="min-w-0">
          <p
            className={`
              text-sm font-medium truncate
              ${isActive ? "text-[var(--brand)]" : "text-[var(--text-primary)]"}
            `}
          >
            {song.title}
          </p>
          <Link
            href={`/artist/${song.artistId}`}
            onClick={e => e.stopPropagation()}  // don't fire onPlay
            className="
              text-xs text-[var(--text-muted)]
              hover:text-[var(--brand)] hover:underline
              truncate block
            "
          >
            {song.artist}
          </Link>
        </div>
      </div>

      {/* ── Album ── */}
      <Link
        href={`/album/${song.albumId}`}
        onClick={e => e.stopPropagation()}
        className="
          text-xs text-[var(--text-muted)]
          hover:text-[var(--brand)] hover:underline
          truncate hidden md:block
        "
      >
        {song.album}
      </Link>

      {/* ── Actions + duration ── */}
      <div className="flex items-center gap-2 justify-end">
        <button
          onClick={e => { e.stopPropagation(); setLiked(v => !v); }}
          className={`
            btn-icon w-7 h-7 border-none
            transition-opacity
            opacity-0 group-hover:opacity-100
            ${liked ? "!opacity-100 text-red-400" : "text-[var(--text-muted)]"}
          `}
        >
          <Heart size={13} fill={liked ? "currentColor" : "none"} />
        </button>

        <span className="text-xs text-[var(--text-muted)] w-9 text-right tabular-nums">
          {fmt(song.duration)}
        </span>

        <button
          onClick={e => e.stopPropagation()}
          className="btn-icon w-7 h-7 border-none opacity-0 group-hover:opacity-100"
        >
          <MoreHorizontal size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────
export default function PlaylistClient({ playlist: pl }: { playlist: Playlist }) {
  const { playSong, togglePlay, currentSong, isPlaying } = usePlayerStore();

  const totalMins = Math.floor(
    pl.songs.reduce((s, t) => s + t.duration, 0) / 60
  );

  // Convert all songs once for the queue
  const queue = pl.songs.map(toPlayerSong);

  function handlePlaySong(song: PlaylistSong) {
    const playerSong = toPlayerSong(song);
    if (currentSong?.id === song.id) {
      togglePlay();                    // toggle if already active
    } else {
      playSong(playerSong, queue);     // play + load full queue
    }
  }

  function handlePlayAll() {
    if (pl.songs[0]) handlePlaySong(pl.songs[0]);
  }

  function handleShuffle() {
    const shuffled = [...queue].sort(() => Math.random() - 0.5);
    if (shuffled[0]) playSong(shuffled[0], shuffled);
  }

  return (
    <div className="animate-fade-in">

      {/* ── Hero ── */}
      <div
        className="px-6 sm:px-8 pt-10 pb-8 border-b border-[var(--border)]"
        style={{ background: "linear-gradient(to bottom, rgba(124,111,224,.12), transparent)" }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">

          {/* Cover — edit on hover if owner */}
          <div className="relative w-40 h-40 sm:w-52 sm:h-52 flex-shrink-0 rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-lg)] group">
            <Image
              src={pl.thumbnail}
              alt={pl.title}
              fill
              className="object-cover"
              priority
            />
            {pl.isOwner && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
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
            <p className="text-sm text-[var(--text-muted)] mb-3">
              {pl.description}
            </p>
            <div className="flex items-center gap-2 flex-wrap text-sm">
              <span className="font-semibold text-[var(--text-primary)]">
                {pl.owner}
              </span>
              <span className="text-[var(--text-muted)]">·</span>
              <span className="text-[var(--text-muted)]">{pl.songs.length} songs</span>
              <span className="text-[var(--text-muted)]">·</span>
              <span className="text-[var(--text-muted)]">{totalMins} min</span>
              <span className="text-[var(--text-muted)]">·</span>
              <span className="text-[var(--text-muted)]">{pl.followers} followers</span>
            </div>

            {/* Action buttons — all have onClick so must be in client */}
            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={handlePlayAll}
                className="
                  w-12 h-12 rounded-full bg-[var(--brand)] text-white
                  flex items-center justify-center
                  hover:bg-[var(--brand-dark)] hover:scale-105
                  shadow-[var(--shadow-brand)] transition-all
                "
              >
                {currentSong && isPlaying && pl.songs.some(s => s.id === currentSong.id)
                  ? <Pause size={20} strokeWidth={2.5} />
                  : <Play  size={20} strokeWidth={2.5} />
                }
              </button>
              <button
                onClick={handleShuffle}
                className="btn btn-ghost flex items-center gap-2"
              >
                <Shuffle size={16} /> Shuffle
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
          className="grid gap-3 px-3 py-2 mb-1 border-b border-[var(--border)] text-[var(--text-muted)]"
          style={{ gridTemplateColumns: "40px 1fr 1fr auto" }}
        >
          <span className="text-xs">#</span>
          <span className="text-xs">Title</span>
          <span className="text-xs hidden md:block">Album</span>
          <Clock size={13} className="ml-auto" />
        </div>

        {/* Rows */}
        <div className="space-y-0.5 stagger">
          {pl.songs.map((song, i) => (
            <SongRow
              key={song.id}
              song={song}
              index={i}
              isActive={currentSong?.id === song.id}
              isPlaying={isPlaying && currentSong?.id === song.id}
              onPlay={() => handlePlaySong(song)}   // ✅ fine in client
            />
          ))}
        </div>

        {/* Add songs CTA — owner only */}
        {pl.isOwner && (
          <Link
            href={`/search?addTo=${pl.id}`}
            className="
              mt-8 flex items-center gap-3 px-3 py-4
              rounded-[var(--radius-lg)]
              border border-dashed border-[var(--border)]
              hover:border-[var(--border-brand)]
              transition-colors group
            "
          >
            <div className="
              w-10 h-10 rounded-[var(--radius-md)]
              bg-[var(--bg-elevated)]
              flex items-center justify-center flex-shrink-0
              group-hover:bg-[var(--brand)]/20 transition-colors
            ">
              <Music2
                size={16}
                className="text-[var(--text-muted)] group-hover:text-[var(--brand)]"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Add more songs
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Find something to add to this playlist
              </p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}