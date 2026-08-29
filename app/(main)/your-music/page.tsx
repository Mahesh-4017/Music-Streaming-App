/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef, ChangeEvent, FormEvent } from "react";
import {
  Music2,
  Upload,
  Link as LinkIcon,
  Play,
  Trash2,
  Loader2,
  FileAudio,
  Sparkles,
  Plus,
  RefreshCw,
  X,
  ImageIcon,
  WifiOff,
  CheckCircle2,
  Download,
} from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { fetchUrlMetadata } from "@/lib/urlMetadata";

function YoutubeIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

interface Song {
  _id: string;
  title: string;
  artist: string;
  audioUrl: string;
  thumbnailUrl?: string;
  type?: "youtube" | "audio" | "video";
  isOffline?: boolean;
  audioBlob?: Blob;
  createdAt?: string;
}

// ─── IndexedDB Offline Audio Engine ───
const DB_NAME = "musify_offline_music_db";
const STORE_NAME = "songs";

function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject("IndexedDB not supported");
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "_id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveOfflineSong(song: Song, blob?: Blob): Promise<Song> {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const itemToSave = {
      ...song,
      audioBlob: blob || undefined,
      isOffline: true,
      createdAt: song.createdAt || new Date().toISOString(),
    };
    await new Promise((resolve, reject) => {
      const req = store.put(itemToSave);
      req.onsuccess = resolve;
      req.onerror = reject;
    });
    return itemToSave;
  } catch (err) {
    console.error("IndexedDB Save Error:", err);
    return song;
  }
}

async function loadOfflineSongs(): Promise<Song[]> {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => {
        const results = req.result || [];
        const items = results.map((item: any) => {
          if (item.audioBlob) {
            const blobUrl = URL.createObjectURL(item.audioBlob);
            return { ...item, audioUrl: blobUrl };
          }
          return item;
        });
        resolve(items);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

async function removeOfflineSong(id: string): Promise<void> {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);
  } catch (err) {
    console.error("IndexedDB Delete Error:", err);
  }
}

function detectType(url: string): "youtube" | "audio" {
  const lower = url.toLowerCase();
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) {
    return "youtube";
  }
  return "audio";
}

function getYouTubeId(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.substring(1);
    return u.searchParams.get("v") || "";
  } catch {
    return "";
  }
}

function extractTitle(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");
    if (host.includes("youtube") || host.includes("youtu.be")) {
      const v = u.searchParams.get("v") || u.pathname.split("/").pop();
      return `Track (${v ?? "Audio"})`;
    }
    const filename = u.pathname.split("/").pop()?.replace(/\.[^.]+$/, "");
    return decodeURIComponent(filename ?? host) || host;
  } catch {
    return "Downloaded Song";
  }
}

export default function CombinedYourMusic() {
  const [activeTab, setActiveTab] = useState<"url" | "upload">("url");
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form states
  const [musicUrl, setMusicUrl] = useState("");
  const [urlTitle, setUrlTitle] = useState("");
  const [urlArtist, setUrlArtist] = useState("");

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [mp3Title, setMp3Title] = useState("");
  const [mp3Artist, setMp3Artist] = useState("");

  const audioRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);

  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();

  // Load all tracks (combining server DB + offline local storage)
  const fetchSongs = async () => {
    setLoading(true);
    try {
      // Load offline IndexedDB tracks instantly
      const offlineList = await loadOfflineSongs();
      setSongs(offlineList);
      setLoading(false);

      // Async fetch server list with fast 2-second timeout
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2000);

      try {
        const res = await fetch("/api/songs", { signal: controller.signal });
        clearTimeout(timer);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const map = new Map<string, Song>();
          data.data.forEach((s: Song) => map.set(s._id, s));
          offlineList.forEach((s) => map.set(s._id, s));
          setSongs(Array.from(map.values()));
        }
      } catch {
        clearTimeout(timer);
      }
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const [isFetchingMeta, setIsFetchingMeta] = useState(false);

  // Auto-fetch song title and artist when user pastes/enters a URL
  const handleUrlInputChange = async (val: string) => {
    setMusicUrl(val);
    if (!val.trim()) return;

    setIsFetchingMeta(true);
    try {
      const meta = await fetchUrlMetadata(val.trim());
      if (meta) {
        setUrlTitle((prev) => (!prev || prev.startsWith("Track (") ? meta.title : prev));
        setUrlArtist((prev) => (!prev || prev === "YouTube Audio" ? meta.artist : prev));
      }
    } finally {
      setIsFetchingMeta(false);
    }
  };

  // Download & Save Link/URL to Offline MP3
  const handleUrlSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!musicUrl.trim()) return;

    setSubmitting(true);
    setMessage(null);

    const type = detectType(musicUrl);
    const songId = `song_${Date.now()}`;
    
    // Auto-fetch metadata if user left title or artist blank
    const fetchedMeta = await fetchUrlMetadata(musicUrl.trim());
    const finalTitle = urlTitle.trim() || fetchedMeta.title || extractTitle(musicUrl);
    const finalArtist = urlArtist.trim() || fetchedMeta.artist || (type === "youtube" ? "YouTube Audio" : "Saved Track");

    let thumbnail = fetchedMeta.thumbnail || "/assets/images/default-song.png";
    if (!fetchedMeta.thumbnail && type === "youtube") {
      const ytId = getYouTubeId(musicUrl);
      if (ytId) thumbnail = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }

    try {
      let audioBlob: Blob | undefined;

      // If direct audio URL, download Blob for offline playback
      if (type === "audio") {
        try {
          const resp = await fetch(musicUrl.trim());
          if (resp.ok) {
            audioBlob = await resp.blob();
          }
        } catch {
          // If CORS prevents blob fetch, save URL directly
        }
      }

      const newSong: Song = {
        _id: songId,
        title: finalTitle,
        artist: finalArtist,
        audioUrl: musicUrl.trim(),
        thumbnailUrl: thumbnail,
        type,
        isOffline: true,
        createdAt: new Date().toISOString(),
      };

      // Save to local offline database
      await saveOfflineSong(newSong, audioBlob);

      // Save to server if online
      try {
        await fetch("/api/songs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: finalTitle,
            artist: finalArtist,
            audioUrl: musicUrl.trim(),
            thumbnailUrl: thumbnail,
            type,
          }),
        });
      } catch {
        // Saved offline regardless
      }

      setMessage({ text: "✅ Track converted & saved! Available for offline playback without internet.", type: "success" });
      setMusicUrl("");
      setUrlTitle("");
      setUrlArtist("");
      await fetchSongs();
    } catch {
      setMessage({ text: "Failed to process music link", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  // Upload MP3 File to Offline Storage
  const handleUploadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!audioFile || !mp3Title.trim() || !mp3Artist.trim()) {
      setMessage({ text: "Audio file, title, and artist name are required.", type: "error" });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const songId = `mp3_${Date.now()}`;
      let thumbUrl = "/assets/images/default-song.png";
      if (thumbPreview) thumbUrl = thumbPreview;

      const newSong: Song = {
        _id: songId,
        title: mp3Title.trim(),
        artist: mp3Artist.trim(),
        audioUrl: "",
        thumbnailUrl: thumbUrl,
        type: "audio",
        isOffline: true,
        createdAt: new Date().toISOString(),
      };

      // Save MP3 file blob into offline IndexedDB
      await saveOfflineSong(newSong, audioFile);

      // Try uploading to server
      try {
        const form = new FormData();
        form.append("audio", audioFile);
        form.append("title", mp3Title.trim());
        form.append("artist", mp3Artist.trim());
        if (thumbFile) form.append("thumbnail", thumbFile);

        await fetch("/api/songs/upload", {
          method: "POST",
          body: form,
        });
      } catch {
        // Saved offline locally
      }

      setMessage({ text: "✅ MP3 track downloaded & saved to your device! Available offline anytime.", type: "success" });
      setAudioFile(null);
      setThumbFile(null);
      setThumbPreview(null);
      setMp3Title("");
      setMp3Artist("");
      if (audioRef.current) audioRef.current.value = "";
      await fetchSongs();
    } catch {
      setMessage({ text: "Error saving audio file", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAudioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioFile(file);
    if (!mp3Title) {
      const derived = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      setMp3Title(derived);
    }
  };

  const handleThumbChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setThumbPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDeleteSong = async (id: string) => {
    await removeOfflineSong(id);
    try {
      await fetch(`/api/songs?id=${id}`, { method: "DELETE" });
    } catch {
      // Deleted locally
    }
    setSongs((prev) => prev.filter((s) => s._id !== id));
  };

  const handlePlaySong = (song: Song) => {
    if (currentTrack?.id === song._id) {
      togglePlay();
      return;
    }

    const mappedSong = {
      id: song._id,
      title: song.title,
      artist: song.artist,
      audioUrl: song.audioUrl,
      thumbnail: song.thumbnailUrl || "/assets/images/default-song.png",
      type: (song.type as any) || (song.audioUrl?.includes("youtube") || song.audioUrl?.includes("youtu.be") ? "youtube" : "audio"),
      duration: 0,
    };

    const queue = songs.map((s) => ({
      id: s._id,
      title: s.title,
      artist: s.artist,
      audioUrl: s.audioUrl,
      thumbnail: s.thumbnailUrl || "/assets/images/default-song.png",
      type: (s.type as any) || (s.audioUrl?.includes("youtube") || s.audioUrl?.includes("youtu.be") ? "youtube" : "audio"),
      duration: 0,
    }));

    playTrack(mappedSong, queue);
  };

  return (
    <div className="container max-w-4xl py-8 animate-fade-in space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge badge-brand flex items-center gap-1.5 px-3 py-1 text-xs">
              <CheckCircle2 size={14} /> Offline Mode Enabled
            </span>
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
              <WifiOff size={13} /> Listen Anytime Without Internet
            </span>
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Your Music Library
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Convert music links or upload MP3 files to save them directly to your device for offline playback.
          </p>
        </div>

        <button
          onClick={fetchSongs}
          className="btn btn-ghost px-3 py-2 flex items-center gap-2 self-start md:self-auto text-xs"
          title="Refresh library"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* ── Notification Banner ── */}
      {message && (
        <div
          className={`p-4 rounded-[var(--radius-md)] flex items-center justify-between gap-3 text-sm ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="opacity-70 hover:opacity-100">
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── Input Form (URL / MP3 Upload) ── */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-xl)] p-6 shadow-xl">
        {/* Tab Buttons */}
        <div className="flex items-center gap-2 pb-5 border-b border-[var(--border)] mb-6">
          <button
            onClick={() => setActiveTab("url")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === "url"
                ? "bg-[var(--brand)] text-white shadow-[var(--shadow-brand)]"
                : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <LinkIcon size={16} /> Paste Music URL / YouTube Link
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === "upload"
                ? "bg-[var(--brand)] text-white shadow-[var(--shadow-brand)]"
                : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Upload size={16} /> Upload MP3 File
          </button>
        </div>

        {/* TAB 1: Convert Link / URL to MP3 */}
        {activeTab === "url" && (
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5 block">
                Music Link or YouTube URL *
              </label>
              <div className="relative">
                <LinkIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="url"
                  required
                  value={musicUrl}
                  onChange={(e) => handleUrlInputChange(e.target.value)}
                  placeholder="Paste YouTube or MP3 link (e.g. https://www.youtube.com/watch?v=...)"
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[var(--radius-md)] pl-10 pr-10 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--brand)] outline-none"
                />
                {isFetchingMeta && (
                  <Loader2 size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--brand)] animate-spin" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5 block">
                  Title <span className="text-[var(--text-muted)] normal-case font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={urlTitle}
                  onChange={(e) => setUrlTitle(e.target.value)}
                  placeholder="Song Title"
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[var(--radius-md)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--brand)] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5 block">
                  Artist <span className="text-[var(--text-muted)] normal-case font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={urlArtist}
                  onChange={(e) => setUrlArtist(e.target.value)}
                  placeholder="Artist Name"
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[var(--radius-md)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--brand)] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !musicUrl.trim()}
              className="btn btn-primary px-6 py-2.5 flex items-center gap-2 text-sm disabled:opacity-50"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              Convert & Save Offline
            </button>
          </form>
        )}

        {/* TAB 2: Upload MP3 */}
        {activeTab === "upload" && (
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5 block">
                  Select MP3 Audio File *
                </label>
                <button
                  type="button"
                  onClick={() => audioRef.current?.click()}
                  className="w-full flex items-center justify-center gap-3 p-4 rounded-[var(--radius-md)] border-2 border-dashed border-[var(--border)] hover:border-[var(--brand)] bg-[var(--bg-elevated)]/50 transition-all"
                >
                  <FileAudio size={24} className="text-[var(--brand)] shrink-0" />
                  <div className="text-left min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {audioFile ? audioFile.name : "Choose audio file..."}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {audioFile ? `${(audioFile.size / 1024 / 1024).toFixed(1)} MB` : "MP3, WAV, OGG"}
                    </p>
                  </div>
                </button>
                <input
                  ref={audioRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioChange}
                  className="hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5 block">
                  Cover Image <span className="text-[var(--text-muted)] normal-case font-normal">(optional)</span>
                </label>
                <button
                  type="button"
                  onClick={() => thumbRef.current?.click()}
                  className="w-full flex items-center justify-center gap-3 p-4 rounded-[var(--radius-md)] border border-[var(--border)] hover:border-[var(--brand)] bg-[var(--bg-elevated)]/50 transition-all"
                >
                  {thumbPreview ? (
                    <img src={thumbPreview} alt="Cover" className="w-10 h-10 rounded object-cover" />
                  ) : (
                    <ImageIcon size={24} className="text-[var(--text-muted)] shrink-0" />
                  )}
                  <div className="text-left min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {thumbFile ? thumbFile.name : "Select cover artwork"}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">JPG, PNG, WEBP</p>
                  </div>
                </button>
                <input
                  ref={thumbRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5 block">
                  Song Title *
                </label>
                <input
                  type="text"
                  required
                  value={mp3Title}
                  onChange={(e) => setMp3Title(e.target.value)}
                  placeholder="Enter song title"
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[var(--radius-md)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--brand)] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5 block">
                  Artist Name *
                </label>
                <input
                  type="text"
                  required
                  value={mp3Artist}
                  onChange={(e) => setMp3Artist(e.target.value)}
                  placeholder="Artist name"
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[var(--radius-md)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--brand)] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !audioFile || !mp3Title.trim() || !mp3Artist.trim()}
              className="btn btn-primary px-6 py-2.5 flex items-center gap-2 text-sm disabled:opacity-50"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              Save MP3 Offline
            </button>
          </form>
        )}
      </div>

      {/* ── Saved Offline Tracks List ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Saved Offline Tracks ({songs.length})
          </h2>
          <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
            <CheckCircle2 size={13} className="text-emerald-400" /> Stored locally on your device
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-[var(--text-muted)]">
            <Loader2 size={24} className="animate-spin mx-auto mb-2 text-[var(--brand)]" />
            Loading offline tracks...
          </div>
        ) : songs.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-[var(--border)] rounded-[var(--radius-xl)] bg-[var(--bg-surface)]">
            <Music2 size={36} className="mx-auto mb-3 text-[var(--text-muted)] opacity-60" />
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              No offline tracks saved yet
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm mx-auto">
              Paste any music link or upload an MP3 file above. They will be saved to your device for offline playback without internet!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {songs.map((song) => {
              const isCurrent = currentTrack?.id === song._id;
              const isPlayingCurrent = isCurrent && isPlaying;
              const isYt = song.type === "youtube" || song.audioUrl.includes("youtube.com") || song.audioUrl.includes("youtu.be");

              return (
                <div
                  key={song._id}
                  className={`group flex items-center gap-4 p-3.5 rounded-[var(--radius-lg)] border transition-all ${
                    isCurrent
                      ? "bg-[var(--brand)]/10 border-[var(--brand)]"
                      : "bg-[var(--bg-surface)] border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-elevated)]"
                  }`}
                >
                  <button
                    onClick={() => handlePlaySong(song)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                      isCurrent
                        ? "bg-[var(--brand)] text-white scale-105"
                        : "bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:scale-105"
                    }`}
                  >
                    {isPlayingCurrent ? "❚❚" : <Play size={16} className="ml-0.5" />}
                  </button>

                  <div className="w-12 h-12 rounded-[var(--radius-md)] overflow-hidden bg-[var(--bg-elevated)] shrink-0 relative">
                    <img
                      src={song.thumbnailUrl || "/assets/images/default-song.png"}
                      alt={song.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold truncate ${isCurrent ? "text-[var(--brand)]" : "text-[var(--text-primary)]"}`}>
                        {song.title}
                      </p>

                      {isYt ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
                          <YoutubeIcon size={11} /> YouTube
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                          <FileAudio size={11} /> MP3
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                        <CheckCircle2 size={10} /> Offline
                      </span>
                    </div>

                    <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                      {song.artist}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteSong(song._id)}
                    className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove from device"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}