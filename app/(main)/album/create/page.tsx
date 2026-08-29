"use client";

import React from "react";
import Link from "next/link";
import { Disc, ArrowLeft } from "lucide-react";

export default function CreateAlbumPage() {
  return (
    <div className="container max-w-2xl mx-auto py-12 px-6 animate-fade-in">
      <Link
        href="/library"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Library
      </Link>

      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-xl)] p-8 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[var(--brand)]/15 border border-[var(--brand)]/30 flex items-center justify-center mx-auto text-[var(--brand)]">
          <Disc size={32} />
        </div>

        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Create New Album
        </h1>

        <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
          Album creation studio is coming soon. You can organize your songs into custom Music List Folders in the Playlists section.
        </p>

        <Link
          href="/playlist"
          className="btn btn-primary px-6 py-2.5 text-xs font-semibold inline-flex items-center gap-2 rounded-full"
        >
          Go to Playlist Folders
        </Link>
      </div>
    </div>
  );
}