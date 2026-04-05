"use client";

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
  isActive: boolean;
  className?: string;
}

export function WaveformIcon({ isActive, className }: Props) {
  const bars = [0, 60, 20, 80, 40];
  return (
    <div className={cn("flex items-end gap-[2px] h-4", className)}>
      {bars.map((delay, i) => (
        <div
          key={i}
          className={cn(
            "w-[3px] rounded-full bg-violet-400 origin-bottom transition-all",
            isActive
              ? "animate-waveform"
              : "h-[4px] opacity-40"
          )}
          style={
            isActive
              ? {
                  animationDelay: `${delay}ms`,
                  // eslint-disable-next-line react-hooks/purity
                  height: `${8 + Math.random() * 8}px`,
                }
              : {}
          }
        />
      ))}
    </div>
  );
}
