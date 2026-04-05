"use client";

import { useState, useRef } from "react";
import { Link, Plus, AlertCircle } from "lucide-react";
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
  onAdd: (url: string) => boolean;
}

export function AddTrackInput({ onAdd }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const ok = onAdd(trimmed);

    if (ok) {
      // ✅ success
      setValue("");
      setError("");
    } else {
      // ❌ error
      setError("Only MP3, MP4, or YouTube links are allowed");
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  };

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "flex items-center gap-3 bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 transition-all duration-200 focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500/30",
          shake && "animate-[shake_0.4s_ease]"
        )}
      >
        <Link className="w-4 h-4 text-ink-400 shrink-0" />

        <input
          ref={inputRef}
          type="url"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Paste YouTube or .mp3 / .mp4 URL..."
          className="flex-1 bg-transparent text-ink-100 placeholder:text-ink-500 text-sm outline-none"
        />

        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
            value.trim()
              ? "bg-violet-600 text-white hover:bg-violet-500 active:scale-95"
              : "bg-ink-700 text-ink-500 cursor-not-allowed"
          )}
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-400 px-1 animate-fade-in">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </div>
      )}
    </div>
  );
}