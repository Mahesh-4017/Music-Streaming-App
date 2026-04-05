export type TrackType = "youtube" | "audio" | "video" | "invalid";

export function detectType(url: string): TrackType {
  if (!url) return "invalid";

  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return "youtube";
  }

  if (url.match(/\.(mp3|wav|ogg)$/i)) {
    return "audio";
  }

  if (url.match(/\.(mp4|webm)$/i)) {
    return "video";
  }

  return "invalid";
}