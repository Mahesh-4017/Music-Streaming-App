/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  Play,
  Pause,
  Music2,
  Plus,
  Trash2,
  RefreshCw,
  Heart,
  Folder,
  FolderPlus,
  FolderOpen,
  FolderCheck,
  X,
  Sparkles,
  Check,
} from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { useLikedStore } from "@/store/likedStore";
import { useFolderStore, MusicFolder } from "@/store/folderStore";
import { cleanTrackTitle, fetchUrlMetadata } from "@/lib/urlMetadata";

function YoutubeIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function extractYoutubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

interface Song {
  _id: string;
  title: string;
  artist: string;
  audioUrl: string;
  thumbnailUrl?: string;
  type?: string;
}

const GRADIENTS = [
  { name: "Purple / Indigo", bg: "from-purple-600 to-indigo-900" },
  { name: "Blue / Ocean", bg: "from-blue-600 to-cyan-900" },
  { name: "Sunset Ember", bg: "from-amber-500 to-red-700" },
  { name: "Emerald Forest", bg: "from-emerald-600 to-teal-900" },
  { name: "Pink Neon", bg: "from-pink-600 to-rose-900" },
];

export default function PlaylistClient() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [ytUrl, setYtUrl] = useState("");
  const [ytTitle, setYtTitle] = useState("");
  const [ytArtist, setYtArtist] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Folder states
  const { folders, createFolder, deleteFolder, addTrackToFolder, removeTrackFromFolder } = useFolderStore();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDesc, setNewFolderDesc] = useState("");
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0].bg);
  const [openFolderMenuForSong, setOpenFolderMenuForSong] = useState<string | null>(null);

  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  const { isLiked, toggleLike } = useLikedStore();

  const loadSongs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/songs");
      const data = await res.json();
      if (data.success) {
        setSongs(data.data || []);
      }
    } catch {
      console.error("Failed to load playlist songs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSongs();
  }, []);

  const handleAddYoutubeSong = async (e: FormEvent) => {
    e.preventDefault();
    if (!ytUrl.trim()) return;

    setSubmitting(true);

    const meta = await fetchUrlMetadata(ytUrl.trim());
    const ytId = extractYoutubeId(ytUrl.trim());
    const finalTitle = ytTitle.trim() ? cleanTrackTitle(ytTitle.trim()) : meta.title || "YouTube Track";
    const finalArtist = ytArtist.trim() || meta.artist || "YouTube Artist";
    const finalThumbnail = meta.thumbnail || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : "/assets/images/default-song.png");

    try {
      const res = await fetch("/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioUrl: ytUrl.trim(),
          title: finalTitle,
          artist: finalArtist,
          thumbnailUrl: finalThumbnail,
          type: "youtube",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setYtUrl("");
        setYtTitle("");
        setYtArtist("");
        setShowAddForm(false);
        await loadSongs();
      } else {
        alert(data.message || "Failed to add YouTube song");
      }
    } catch {
      console.error("Error adding YouTube song");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSong = async (id: string) => {
    try {
      const res = await fetch(`/api/songs?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setSongs((prev) => prev.filter((s) => s._id !== id));
      }
    } catch {
      console.error("Failed to delete song");
    }
  };

  const handleCreateFolderSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    createFolder(newFolderName.trim(), newFolderDesc.trim(), selectedGradient);
    setNewFolderName("");
    setNewFolderDesc("");
    setShowCreateFolder(false);
  };

  const handlePlaySong = (song: Song) => {
    if (currentTrack?.id === song._id) {
      togglePlay();
      return;
    }

    const currentList = selectedFolderId
      ? getFolderSongs(selectedFolderId)
      : songs;

    const queue = currentList.map((s) => ({
      id: s._id,
      title: s.title,
      artist: s.artist,
      audioUrl: s.audioUrl,
      thumbnail: s.thumbnailUrl || "/assets/images/default-song.png",
      type: s.type as any,
    }));

    playTrack(
      {
        id: song._id,
        title: song.title,
        artist: song.artist,
        audioUrl: song.audioUrl,
        thumbnail: song.thumbnailUrl || "/assets/images/default-song.png",
        type: song.type as any,
      },
      queue
    );
  };

  const handlePlayFolder = (folder: MusicFolder) => {
    if (folder.tracks.length === 0) return;
    const firstTrack = folder.tracks[0];
    playTrack(firstTrack, folder.tracks);
  };

  const handlePlayAll = () => {
    const list = selectedFolderId ? getFolderSongs(selectedFolderId) : songs;
    if (list.length > 0) {
      handlePlaySong(list[0]);
    }
  };

  // Get songs inside selected folder
  const getFolderSongs = (folderId: string): Song[] => {
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return [];
    const folderTrackIds = new Set(folder.tracks.map((t) => t.id));
    return songs.filter((s) => folderTrackIds.has(s._id));
  };

  const activeFolder = folders.find((f) => f.id === selectedFolderId);
  const displayedSongs = selectedFolderId ? getFolderSongs(selectedFolderId) : songs;

  return (
    <div className="animate-fade-in pb-16">
      {/* ── Hero Header ── */}
      <div
        className="px-6 sm:px-8 pt-10 pb-8 border-b border-[var(--border)]"
        style={{ background: "linear-gradient(to bottom, rgba(124,111,224,.15), transparent)" }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 max-w-5xl mx-auto">
          {/* Cover */}
          <div className={`relative w-40 h-40 sm:w-48 sm:h-48 shrink-0 rounded-[var(--radius-xl)] overflow-hidden shadow-2xl bg-gradient-to-br ${activeFolder ? activeFolder.coverBg : "from-violet-600 to-indigo-900"} flex items-center justify-center border border-white/10`}>
            {activeFolder ? <FolderOpen size={64} className="text-white/80" /> : <Music2 size={64} className="text-white/80" />}
          </div>

          {/* Playlist Info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wider font-semibold text-[var(--brand)] mb-1">
              {activeFolder ? "Music Folder List" : "Your Personal Playlist"}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-2">
              {activeFolder ? activeFolder.name : "My Music & Folder Lists"}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              {activeFolder ? activeFolder.description : "Organize your YouTube links and MP3 files into custom folders."}
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handlePlayAll}
                disabled={displayedSongs.length === 0}
                className="w-12 h-12 rounded-full bg-[var(--brand)] text-white flex items-center justify-center hover:scale-105 shadow-[var(--shadow-brand)] transition-all disabled:opacity-50"
              >
                {isPlaying && currentTrack && displayedSongs.some((s) => s._id === currentTrack.id) ? (
                  <Pause size={20} />
                ) : (
                  <Play size={20} className="ml-0.5" />
                )}
              </button>

              <button
                onClick={() => setShowCreateFolder(true)}
                className="btn btn-primary px-4 py-2.5 text-xs font-semibold flex items-center gap-2"
              >
                <FolderPlus size={16} /> New Folder List
              </button>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="btn btn-ghost px-4 py-2.5 text-xs font-semibold flex items-center gap-2 border border-[var(--border)]"
              >
                <Plus size={16} /> Add YouTube Track
              </button>

              {selectedFolderId && (
                <button
                  onClick={() => setSelectedFolderId(null)}
                  className="btn btn-ghost px-3 py-2 text-xs flex items-center gap-1 text-[var(--brand)]"
                >
                  <X size={14} /> Show All Songs
                </button>
              )}

              <button
                onClick={loadSongs}
                className="btn btn-ghost px-3 py-2 text-xs flex items-center gap-1.5 ml-auto"
                title="Refresh"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Create New Folder Modal ── */}
      {showCreateFolder && (
        <div className="max-w-5xl mx-auto px-6 pt-6">
          <form
            onSubmit={handleCreateFolderSubmit}
            className="bg-[var(--bg-surface)] border border-[var(--brand)]/40 rounded-[var(--radius-xl)] p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-base font-bold text-[var(--text-primary)]">
                <FolderPlus size={20} className="text-[var(--brand)]" />
                <span>Create New Music Folder</span>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateFolder(false)}
                className="text-[var(--text-muted)] hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1 block">
                  Folder Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gym Workout Beats, Chill Lo-Fi"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[var(--radius-md)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--brand)] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1 block">
                  Folder Theme Style
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {GRADIENTS.map((g) => (
                    <button
                      key={g.bg}
                      type="button"
                      onClick={() => setSelectedGradient(g.bg)}
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${g.bg} flex items-center justify-center transition-transform ${
                        selectedGradient === g.bg ? "scale-110 ring-2 ring-white shadow-lg" : "opacity-70 hover:opacity-100"
                      }`}
                      title={g.name}
                    >
                      {selectedGradient === g.bg && <Check size={14} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1 block">
                  Description (optional)
                </label>
                <input
                  type="text"
                  placeholder="Short note about this music collection"
                  value={newFolderDesc}
                  onChange={(e) => setNewFolderDesc(e.target.value)}
                  className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[var(--radius-md)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-[var(--brand)] outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateFolder(false)}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full text-xs font-semibold bg-[var(--brand)] text-white shadow-[var(--shadow-brand)] hover:scale-105 transition-all"
              >
                Create Folder List
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Add YouTube Form Section ── */}
      {showAddForm && (
        <div className="max-w-5xl mx-auto px-6 pt-6">
          <form
            onSubmit={handleAddYoutubeSong}
            className="bg-[var(--bg-surface)] border border-[var(--brand)]/30 rounded-[var(--radius-xl)] p-5 shadow-xl space-y-4"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <YoutubeIcon size={18} className="text-red-500" />
              <span>Add YouTube Music Link to Playlist</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-3">
                <input
                  type="url"
                  placeholder="Paste YouTube Link (e.g. https://www.youtube.com/watch?v=...)"
                  value={ytUrl}
                  onChange={(e) => setYtUrl(e.target.value)}
                  required
                  className="input w-full text-xs"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Title (optional)"
                  value={ytTitle}
                  onChange={(e) => setYtTitle(e.target.value)}
                  className="input w-full text-xs"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Artist (optional)"
                  value={ytArtist}
                  onChange={(e) => setYtArtist(e.target.value)}
                  className="input w-full text-xs"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary w-full h-full text-xs font-semibold flex items-center justify-center gap-2 py-2.5"
                >
                  {submitting ? "Saving..." : "Save to Playlist"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ── Music List Folders Grid Section ── */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Folder size={18} className="text-[var(--brand)]" />
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Your Music List Folders</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--brand)]/15 text-[var(--brand)] font-semibold">
              {folders.length} Folders
            </span>
          </div>

          <button
            onClick={() => setShowCreateFolder(true)}
            className="text-xs text-[var(--brand)] font-semibold hover:underline flex items-center gap-1"
          >
            <Plus size={14} /> Create Folder
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {folders.map((folder) => {
            const isSelected = selectedFolderId === folder.id;
            const folderSongs = getFolderSongs(folder.id);

            return (
              <div
                key={folder.id}
                onClick={() => setSelectedFolderId(isSelected ? null : folder.id)}
                className={`group relative p-4 rounded-[var(--radius-xl)] border cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "bg-[var(--brand)]/15 border-[var(--brand)] shadow-lg scale-[1.02]"
                    : "bg-[var(--bg-surface)] border-[var(--border)] hover:border-[var(--brand)]/50 hover:shadow-md"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-12 h-12 rounded-[var(--radius-lg)] bg-gradient-to-br ${folder.coverBg} flex items-center justify-center shrink-0 shadow-md text-white border border-white/10`}>
                    <Folder size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-[var(--text-primary)] truncate group-hover:text-[var(--brand)] transition-colors">
                      {folder.name}
                    </h3>
                    <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 mb-2">
                      {folder.description || "Custom music list folder"}
                    </p>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[var(--text-secondary)] font-medium">
                        {folderSongs.length} {folderSongs.length === 1 ? "song" : "songs"}
                      </span>

                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {folderSongs.length > 0 && (
                          <button
                            onClick={() => handlePlayFolder(folder)}
                            className="w-7 h-7 rounded-full bg-[var(--brand)] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-sm"
                            title="Play Folder Tracks"
                          >
                            <Play size={12} className="ml-0.5" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteFolder(folder.id)}
                          className="w-7 h-7 rounded-full text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-colors"
                          title="Delete Folder"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Active Folder Filter Bar ── */}
      {selectedFolderId && activeFolder && (
        <div className="max-w-5xl mx-auto px-6 pt-6">
          <div className="flex items-center justify-between p-3.5 rounded-[var(--radius-lg)] bg-[var(--brand)]/15 border border-[var(--brand)]/30">
            <div className="flex items-center gap-2.5">
              <FolderOpen size={18} className="text-[var(--brand)]" />
              <div>
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  Filtered by Folder: {activeFolder.name}
                </span>
                <span className="text-[11px] text-[var(--text-secondary)] ml-2">
                  ({displayedSongs.length} tracks in this list)
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedFolderId(null)}
              className="text-xs font-semibold text-[var(--brand)] hover:underline flex items-center gap-1"
            >
              <X size={14} /> Clear Filter & Show All
            </button>
          </div>
        </div>
      )}

      {/* ── Track List Table ── */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider text-[var(--text-muted)]">
            {selectedFolderId ? `Folder Tracks (${displayedSongs.length})` : `All Playlist Songs (${songs.length})`}
          </h3>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-[var(--text-muted)]">
            Loading playlist tracks...
          </div>
        ) : displayedSongs.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-[var(--border)] rounded-[var(--radius-xl)] bg-[var(--bg-surface)]">
            <Music2 size={40} className="mx-auto text-[var(--text-muted)] mb-3 opacity-60" />
            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">
              No Songs Found
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mb-4 max-w-sm mx-auto">
              {selectedFolderId
                ? "This folder has no songs yet. Use 'Add to Folder' on any track below to save it here."
                : "Add YouTube music links or MP3 files to build your custom playlist."}
            </p>
            {selectedFolderId ? (
              <button
                onClick={() => setSelectedFolderId(null)}
                className="btn btn-primary text-xs px-4 py-2"
              >
                View All Songs
              </button>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="btn btn-primary text-xs px-4 py-2"
              >
                Add YouTube Track
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)] text-xs text-[var(--text-muted)] px-3">
              <span># TITLE & ARTIST</span>
              <span>FOLDER & ACTIONS</span>
            </div>

            {displayedSongs.map((song, index) => {
              const isCurrent = currentTrack?.id === song._id;
              const isPlayingCurrent = isCurrent && isPlaying;
              const liked = isLiked(song._id);
              const trackObj = {
                id: song._id,
                title: song.title,
                artist: song.artist,
                audioUrl: song.audioUrl,
                thumbnail: song.thumbnailUrl || "/assets/images/default-song.png",
                type: song.type as any,
              };

              return (
                <div
                  key={song._id}
                  className={`flex items-center justify-between gap-3 p-3 rounded-[var(--radius-lg)] border transition-all relative ${
                    isCurrent
                      ? "bg-[var(--brand)]/10 border-[var(--brand)]/40 shadow-sm"
                      : "bg-[var(--bg-surface)] border-[var(--border)] hover:border-[var(--border-brand)]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-xs font-mono text-[var(--text-muted)] w-5 text-center shrink-0">
                      {index + 1}
                    </span>

                    <button
                      onClick={() => handlePlaySong(song)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                        isCurrent
                          ? "bg-[var(--brand)] text-white scale-105"
                          : "bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:scale-105"
                      }`}
                    >
                      {isPlayingCurrent ? "❚❚" : <Play size={14} className="ml-0.5" />}
                    </button>

                    <div className="w-10 h-10 rounded-[var(--radius-md)] overflow-hidden bg-[var(--bg-elevated)] shrink-0">
                      <img
                        src={song.thumbnailUrl || "/assets/images/default-song.png"}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-semibold truncate ${isCurrent ? "text-[var(--brand)]" : "text-[var(--text-primary)]"}`}>
                        {cleanTrackTitle(song.title)}
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)] truncate">
                        {song.artist}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Folder Menu */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Source Badge */}
                    {song.type === "youtube" || song.audioUrl.includes("youtube") ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                        <YoutubeIcon size={10} /> YT
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        MP3
                      </span>
                    )}

                    {/* Add to Folder Menu Button */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenFolderMenuForSong(
                            openFolderMenuForSong === song._id ? null : song._id
                          )
                        }
                        className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--brand)] hover:bg-[var(--bg-elevated)] transition-colors flex items-center gap-1"
                        title="Add track to Folder List"
                      >
                        <FolderPlus size={15} />
                      </button>

                      {/* Dropdown Menu */}
                      {openFolderMenuForSong === song._id && (
                        <div className="absolute right-0 top-8 w-56 bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-2xl p-2 z-50 animate-fade-in space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] px-2 py-1">
                            Save to Music Folder:
                          </p>
                          {folders.length === 0 ? (
                            <p className="text-xs text-[var(--text-muted)] px-2 py-1">
                              No folders yet.
                            </p>
                          ) : (
                            folders.map((f) => {
                              const inFolder = f.tracks.some((t) => t.id === song._id);
                              return (
                                <button
                                  key={f.id}
                                  onClick={() => {
                                    if (inFolder) {
                                      removeTrackFromFolder(f.id, song._id);
                                    } else {
                                      addTrackToFolder(f.id, trackObj);
                                    }
                                  }}
                                  className={`w-full flex items-center justify-between text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                    inFolder
                                      ? "bg-[var(--brand)]/15 text-[var(--brand)] font-bold"
                                      : "hover:bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                                  }`}
                                >
                                  <span className="truncate">{f.name}</span>
                                  {inFolder ? <FolderCheck size={14} /> : <Plus size={14} className="opacity-60" />}
                                </button>
                              );
                            })
                          )}
                          <div className="pt-1 border-t border-[var(--border)]">
                            <button
                              onClick={() => {
                                setOpenFolderMenuForSong(null);
                                setShowCreateFolder(true);
                              }}
                              className="w-full flex items-center gap-1.5 text-xs text-[var(--brand)] font-semibold px-2 py-1 hover:underline"
                            >
                              <Plus size={13} /> Create New Folder
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Like Button */}
                    <button
                      onClick={() => toggleLike(trackObj)}
                      className={`p-1.5 rounded-full transition-colors ${
                        liked
                          ? "text-red-500 bg-red-500/10"
                          : "text-[var(--text-muted)] hover:text-red-400 hover:bg-white/5"
                      }`}
                      title={liked ? "Remove from Liked Songs" : "Add to Liked Songs"}
                    >
                      <Heart size={15} fill={liked ? "currentColor" : "none"} />
                    </button>

                    {/* Delete Track */}
                    <button
                      onClick={() => handleDeleteSong(song._id)}
                      className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Remove track"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}