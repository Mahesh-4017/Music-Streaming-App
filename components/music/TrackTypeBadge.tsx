import { TrackType } from "@/types";
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
const config: Record<TrackType, { label: string; className: string }> = {
  youtube: {
    label: "YouTube",
    className: "bg-red-500/15 text-red-400 border-red-500/20",
  },
  soundcloud: {
    label: "SoundCloud",
    className: "bg-ember-500/15 text-ember-400 border-ember-500/20",
  },
  audio: {
    label: "MP3",
    className: "bg-violet-500/15 text-violet-300 border-violet-500/20",
  },
  video: {
    label: "Video",
    className: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  },
  link: {
    label: "Link",
    className: "bg-ink-600/40 text-ink-300 border-ink-500/20",
  },
};

interface Props {
  type: TrackType;
}

export function TrackTypeBadge({ type }: Props) {
  const { label, className } = config[type];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium border tracking-wider uppercase",
        className
      )}
    >
      {label}
    </span>
  );
}
