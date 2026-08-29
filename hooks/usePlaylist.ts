"use client";

import { useState, useCallback } from "react";
import { Track } from "@/types";

// ✅ Supported types only
export type TrackType = "youtube" | "audio" | "video" | "invalid";

// ✅ Detect type
function detectType(url: string): TrackType {
  const lower = url.toLowerCase();

  if (lower.includes("youtube.com") || lower.includes("youtu.be")) {
    return "youtube";
  }

  if (lower.match(/\.(mp3|ogg|wav|m4a)(\?|$)/)) {
    return "audio";
  }

  if (lower.match(/\.(mp4|webm|mov)(\?|$)/)) {
    return "video";
  }

  return "invalid";
}

// ✅ Extract title cleanly
function extractTitle(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");

    if (host.includes("youtube") || host.includes("youtu.be")) {
      const v = u.searchParams.get("v") || u.pathname.split("/").pop();
      return `YouTube Track (${v ?? "Audio"})`;
    }

    const filename = u.pathname.split("/").pop()?.replace(/\.[^.]+$/, "");
    if (filename) {
      let decoded = decodeURIComponent(filename);
      decoded = decoded.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
      return decoded.replace(/\b\w/g, (c) => c.toUpperCase());
    }

    return host;
  } catch {
    return "Offline Song";
  }
}

// ✅ Generate ID
function generateId(): string {
  return crypto.randomUUID();
}

export function usePlaylist() {
  const [tracks, setTracks] = useState<Track[]>([]);

  // ✅ ADD TRACK (FIXED)
  const addTrack = useCallback((url: string): Track | null => {
    const cleanUrl = url.trim();

    // ❌ Invalid URL format
    try {
      new URL(cleanUrl);
    } catch {
      alert("❌ Invalid URL format");
      return null;
    }

    const type = detectType(cleanUrl);

    // ❌ Block unsupported links
    if (type === "invalid") {
      alert("❌ Only MP3, MP4, or YouTube links allowed");
      return null;
    }

    const newTrack: Track = {
      id: generateId(),
      url: cleanUrl,
      title: extractTitle(cleanUrl),
      type,
      addedAt: Date.now(),
    };

    setTracks((prev) => [...prev, newTrack]);

    return newTrack;
  }, []);

  // ✅ REMOVE
  const removeTrack = useCallback((id: string) => {
    setTracks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ✅ RENAME
  const renameTrack = useCallback((id: string, title: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title } : t))
    );
  }, []);

  // ✅ REORDER
  const reorderTracks = useCallback(
    (fromIdx: number, toIdx: number) => {
      setTracks((prev) => {
        const next = [...prev];
        const [moved] = next.splice(fromIdx, 1);
        next.splice(toIdx, 0, moved);
        return next;
      });
    },
    []
  );

  return {
    tracks,
    addTrack,
    removeTrack,
    renameTrack,
    reorderTracks,
  };
}