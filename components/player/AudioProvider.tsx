// components/player/AudioProvider.tsx
// ─── Mount ONCE in (main)/layout.tsx ─────────────────────────────────────────
// This component has no UI — it just starts the audio engine.
"use client";

import { useAudio } from "@/hooks/useAudio";

export default function AudioProvider() {
  useAudio();   // engine runs here, single instance
  return null;  // no DOM output
}