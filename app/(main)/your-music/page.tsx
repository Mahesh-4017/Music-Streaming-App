/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePlayerStore } from "@/store/playerStore";

interface Song {
  _id: string;
  title: string;
  artist: string;
  audioUrl: string;
  thumbnailUrl?: string;
}

// ─── Waveform ─────────────────────────
function WaveformBars({ playing }: { playing: boolean }) {
  return (
    <span className="waveform" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="waveform-bar"
          style={{
            animationPlayState: playing ? "running" : "paused",
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </span>
  );
}

// ─── Song Card ────────────────────────
function SongCard({
  song,
  index,
  isActive,
  isPlaying,
  progress,
  duration,
  onPlay,
  onSeek,
}: any) {
  const fmt = (s: number) => {
    if (!s || !isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    onSeek((e.clientX - rect.left) / rect.width);
  };

  return (
    <article
      className={`song-card ${isActive ? "song-card--active" : ""}`}
      style={{ "--i": index } as React.CSSProperties}
    >
      <div className="song-thumb">
        <Image
          src={song.thumbnailUrl || "/assets/images/default-song.png"}
          alt={song.title}
          width={64}
          height={64}
          className="song-thumb-img"
        />
        {isActive && isPlaying && <div className="thumb-glow" />}
      </div>

      <div className="song-meta">
        <div className="song-index">
          {String(index + 1).padStart(2, "0")}
        </div>
        <div className="song-text">
          <h3 className="song-title">{song.title}</h3>
          <p className="song-artist">{song.artist}</p>
        </div>
        {isActive && <WaveformBars playing={isPlaying} />}
      </div>

      {isActive && (
        <div className="song-progress-wrap mt-3">
          <div
            className="song-progress-track"
            onClick={handleSeek}
            role="slider"
            aria-valuenow={Math.round(progress)}
          >
            <div
              className="song-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="song-times">
            <span>{fmt((progress / 100) * duration)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>
      )}

      <button
        className={`song-play-btn ${
          isActive && isPlaying ? "song-play-btn--pause" : ""
        }`}
        onClick={() => onPlay(song)}
      >
        {isActive && isPlaying ? "❚❚" : "▶"}
      </button>
    </article>
  );
}

// ─── Main Page ────────────────────────
export default function YourMusic() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ ONLY SOURCE OF TRUTH
  const {
    currentSong,
    isPlaying,
    playSong,
    togglePlay,
    seek,
    duration,
    progress,
  } = usePlayerStore();

  // Fetch songs
  useEffect(() => {
    fetch("/api/songs")
      .then((r) => r.json())
      .then((d) => {
        setSongs(d.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Play handler
  const handlePlay = (song: Song) => {
    if (currentSong?.id === song._id) {
      togglePlay();
      return;
    }

    const queue = songs.map((s) => ({
      id: s._id,
      title: s.title,
      artist: s.artist,
      audioUrl: s.audioUrl,
      thumbnail: s.thumbnailUrl || "",
      duration: 0,
    }));

    playSong(
      {
        id: song._id,
        title: song.title,
        artist: song.artist,
        audioUrl: song.audioUrl,
        thumbnail: song.thumbnailUrl || "",
        duration: 0,
      },
      queue
    );
  };

  // Seek handler
  const handleSeek = (pct: number) => {
    if (!duration) return;
    seek((pct / 100) * duration);
  };

  return (
    <div className="ym-root border-l border-gray-800">
      <header className="ym-header">
        <p className="ym-eyebrow">Your Library</p>
        <h1 className="ym-headline">
          Your <em>Music</em>
        </h1>
        <p className="ym-subline">
          One track at a time — full presence, no interruption
        </p>

        {!loading && (
          <div className="ym-count">
            <span className="ym-count-dot" />
            {songs.length} track
          </div>
        )}
      </header>

      <div className="ym-divider" />

      {loading && <div className="ym-state">Loading…</div>}

      {!loading && songs.length === 0 && (
        <div className="ym-state">No songs</div>
      )}

      {!loading && songs.length > 0 && (
        <ul className="ym-list">
          {songs.map((song, i) => (
            <li key={song._id} style={{ listStyle: "none" }}>
              <SongCard
                song={song}
                index={i}
                isActive={currentSong?.id === song._id}
                isPlaying={
                  currentSong?.id === song._id && isPlaying
                }
                progress={
                  currentSong?.id === song._id ? progress : 0
                }
                duration={duration}
                onPlay={handlePlay}
                onSeek={handleSeek}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}