"use client";

import { useEffect } from "react";
import { usePlaylist } from "@/hooks/usePlaylist";
import { AddTrackInput } from "@/components/music/AddTrackInput";
import { TrackItem } from "@/components/music/TrackItem";
import { EmptyState } from "@/components/music/EmptyState";
import { InfoBanner } from "@/components/music/InfoBanner";
import { ListMusic } from "lucide-react";
import { usePlayerStore } from "@/store/player";

export default function PlaylistPage() {
  const { tracks, addTrack, removeTrack, renameTrack } = usePlaylist();
  const { playTrack, setTracks, currentTrack, isPlaying } = usePlayerStore();

  // ✅ Keep global store tracks in sync so next() / prev() work in MobilePlayer
  useEffect(() => {
    setTracks(tracks);
  }, [tracks, setTracks]);

  const handleAdd = (url: string): boolean => {
    const track = addTrack(url);
    return track !== null;
  };

  return (
    // ✅ h-dvh + overflow-hidden fixes the width/height overflow
    <div className="h-dvh flex flex-col bg-[var(--bg-base)] overflow-hidden">

      {/* Header — fixed height, never scrolls */}
      <header className="shrink-0 border-b border-[var(--border)] px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--brand)]/10 border border-[var(--brand)]/20 flex items-center justify-center shrink-0">
            <ListMusic className="w-4 h-4 text-[var(--brand)]" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-[var(--text-primary)] leading-none">
              My Playlist
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {tracks.length} {tracks.length === 1 ? "track" : "tracks"}
            </p>
          </div>
        </div>
      </header>

      {/* ✅ Only this area scrolls */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-5 flex flex-col gap-4">

          <AddTrackInput onAdd={handleAdd} />

          <InfoBanner />

          {tracks.length === 0 ? (
            <EmptyState />
          ) : (
            // pb-32 = last track won't hide behind the fixed MobilePlayer bar
            <div className="flex flex-col gap-2 pb-32">
              {tracks.map((track, i) => (
                <TrackItem
                  key={track.id}
                  track={track}
                  index={i}
                  isActive={track.id === currentTrack?.id}
                  isPlaying={isPlaying && track.id === currentTrack?.id}
                  onPlay={() => playTrack(track)}
                  onDelete={() => removeTrack(track.id)}
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