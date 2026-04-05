import { Info } from "lucide-react";

export function InfoBanner() {
  return (
    <div className="flex gap-3 bg-violet-950/40 border border-violet-500/20 rounded-xl px-4 py-3">
      <Info className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
      <p className="text-xs text-violet-300/80 leading-relaxed">
        Direct <span className="text-violet-300 font-medium">.mp3</span> and{" "}
        <span className="text-violet-300 font-medium">.mp4</span> URLs play directly.
        For YouTube, use{" "}
        <a
          href="https://cobalt.tools"
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-400 underline hover:text-violet-200"
        >
          cobalt.tools
        </a>{" "}
        or{" "}
        <code className="font-mono bg-violet-900/40 px-1 rounded text-violet-300">yt-dlp</code>{" "}
        to get a direct MP3 link first.
      </p>
    </div>
  );
}
