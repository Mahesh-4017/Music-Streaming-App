"use client";

import { usePlaylist } from "@/hooks/usePlaylist";
import { AddTrackInput } from "@/components/music/AddTrackInput";
import { TrackItem } from "@/components/music/TrackItem";
import { EmptyState } from "@/components/music/EmptyState";
import { InfoBanner } from "@/components/music/InfoBanner";
import { ListMusic } from "lucide-react";
import { usePlayerStore } from "@/store/player";

export default function PlaylistPage() {
  const { tracks, addTrack, removeTrack, renameTrack } = usePlaylist();

  // ✅ GLOBAL PLAYER STORE
  const { playTrack, currentTrack, isPlaying } = usePlayerStore();

  // ✅ ADD TRACK
  const handleAdd = (url: string): boolean => {
    const track = addTrack(url);
    return track !== null;
  };

  // ✅ DELETE TRACK
  const handleDelete = (id: string) => {
    removeTrack(id);
  };

  return (
    <div className="min-h-screen bg-ink-950 flex flex-col">
      
      {/* Header */}
      <header className="border-b border-ink-800 px-4 py-5">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
            <ListMusic className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-ink-100 leading-none">
              MP3 Playlist
            </h1>
            <p className="text-xs text-ink-500 mt-1">
              {tracks.length} {tracks.length === 1 ? "track" : "tracks"}
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
          
          {/* Add URL */}
          <AddTrackInput onAdd={handleAdd} />

          {/* Info */}
          <InfoBanner />

          {/* Playlist */}
          {tracks.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-2">
              {tracks.map((track, i) => (
                <TrackItem
                  key={track.id}
                  track={track}
                  index={i}

                  // ✅ ACTIVE TRACK
                  isActive={track.id === currentTrack?.id}

                  // ✅ PLAYING STATE
                  isPlaying={isPlaying && track.id === currentTrack?.id}

                  // ✅ PLAY ACTION (GLOBAL)
                  onPlay={() => playTrack(track)}

                  // ✅ DELETE
                  onDelete={() => handleDelete(track.id)}

                  // ✅ RENAME
                  onRename={(title) => renameTrack(track.id, title)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}