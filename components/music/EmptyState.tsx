import { Music2 } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-ink-800 border border-ink-700 flex items-center justify-center mb-4">
        <Music2 className="w-6 h-6 text-ink-500" />
      </div>
      <p className="text-sm font-medium text-ink-400 mb-1">No tracks yet</p>
      <p className="text-xs text-ink-600 max-w-xs">
        Paste any media URL above — YouTube, SoundCloud, direct .mp3 links, or video files.
      </p>
    </div>
  );
}
