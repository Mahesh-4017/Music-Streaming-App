"use client";

import { useState } from "react";
import { Play, Pause, Trash2, Pencil, Check, X, ExternalLink } from "lucide-react";
import { Track } from "@/types";
import { TrackTypeBadge } from "./TrackTypeBadge";
import { WaveformIcon } from "./WaveformIcon";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// (other functions can stay below)
export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
interface Props {
  track: Track;
  isActive: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
  index: number;
}

export function TrackItem({
  track,
  isActive,
  isPlaying,
  onPlay,
  onDelete,
  onRename,
  index,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(track.title);

  const submitRename = () => {
    const trimmed = editValue.trim();
    if (trimmed) onRename(trimmed);
    else setEditValue(track.title);
    setEditing(false);
  };

  const isDirectPlayable = track.type === "audio" || track.type === "video";

  return (
    <div
      className={cn(
        "group flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200 animate-slide-up",
        isActive
          ? "bg-violet-950/60 border-violet-500/40 shadow-[0_0_20px_rgba(124,90,245,0.08)]"
          : "bg-ink-800/60 border-ink-700/50 hover:border-ink-500/60 hover:bg-ink-800"
      )}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Index / Play button */}
      <button
        onClick={onPlay}
        className={cn(
          "relative w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-150 font-mono text-xs",
          isActive
            ? "bg-violet-600 text-white hover:bg-violet-500"
            : "bg-ink-700 text-ink-400 hover:bg-violet-600 hover:text-white group-hover:text-white"
        )}
        title={isActive && isPlaying ? "Pause" : "Play"}
      >
        {isActive && isPlaying ? (
          isDirectPlayable ? (
            <Pause className="w-4 h-4" />
          ) : (
            <WaveformIcon isActive={true} />
          )
        ) : isActive ? (
          <Play className="w-4 h-4" />
        ) : (
          <span className="group-hover:hidden">{index + 1}</span>
        )}
        {!isActive && (
          <Play className="w-4 h-4 hidden group-hover:block" />
        )}
      </button>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitRename();
                if (e.key === "Escape") {
                  setEditValue(track.title);
                  setEditing(false);
                }
              }}
              className="flex-1 bg-ink-700 border border-violet-500/50 rounded-lg px-2 py-1 text-sm text-ink-100 outline-none focus:border-violet-400"
            />
            <button onClick={submitRename} className="text-violet-400 hover:text-violet-300">
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setEditValue(track.title);
                setEditing(false);
              }}
              className="text-ink-400 hover:text-ink-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <p
            className={cn(
              "text-sm font-medium truncate leading-snug",
              isActive ? "text-violet-100" : "text-ink-100"
            )}
          >
            {track.title}
          </p>
        )}
        {!editing && (
          <p className="text-[11px] text-ink-500 truncate mt-0.5 font-mono">
            {track.url}
          </p>
        )}
      </div>

      {/* Badge */}
      <TrackTypeBadge type={track.type} />

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        {!isDirectPlayable && (
          <a
            href={track.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-ink-400 hover:text-violet-300 hover:bg-ink-700 transition-colors"
            title="Open link"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
        <button
          onClick={() => setEditing(true)}
          className="p-1.5 rounded-lg text-ink-400 hover:text-violet-300 hover:bg-ink-700 transition-colors"
          title="Rename"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg text-ink-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
