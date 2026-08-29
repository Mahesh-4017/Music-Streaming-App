// lib/urlMetadata.ts — Auto Title & Metadata Fetcher for YouTube & Audio URLs

function getYouTubeId(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.substring(1).split("?")[0];
    return u.searchParams.get("v") || u.pathname.split("/").pop() || "";
  } catch {
    return "";
  }
}

export function cleanTrackTitle(title: string): string {
  if (!title) return "YouTube Track";

  // Remove (video_id) patterns like (C3njz8sf4aM)
  let clean = title.replace(/\s*\([\w-]{11}\)/g, "");

  // Remove common YouTube clutter like (Official Video), [4K], (Audio), etc.
  clean = clean
    .replace(/\s*[\(\[](Official|Audio|Video|4K|HD|MV|Visualizer|Lyric|Lyrics|Full Song|Topic)[\)\]]/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (clean.toLowerCase().startsWith("track (") || clean === "Track") {
    return "YouTube Track";
  }

  return clean || "YouTube Track";
}

export async function fetchUrlMetadata(url: string): Promise<{
  title: string;
  artist: string;
  thumbnail?: string;
}> {
  if (!url || !url.trim()) {
    return { title: "YouTube Track", artist: "YouTube Artist" };
  }

  const cleanUrl = url.trim();
  const lower = cleanUrl.toLowerCase();

  // ── YouTube Link ──
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) {
    const ytId = getYouTubeId(cleanUrl);
    const defaultThumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : undefined;

    try {
      // Try free CORS-friendly oEmbed endpoint
      const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(cleanUrl)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.title) {
          let rawTitle = data.title;
          let artist = data.author_name ? data.author_name.replace(" - Topic", "") : "YouTube Music";

          // If title format is "Artist - Title"
          if (rawTitle.includes(" - ")) {
            const parts = rawTitle.split(" - ");
            artist = parts[0].trim();
            rawTitle = parts.slice(1).join(" - ").trim();
          }

          const cleanedTitle = cleanTrackTitle(rawTitle);
          return {
            title: cleanedTitle || "YouTube Track",
            artist: artist || "YouTube Artist",
            thumbnail: data.thumbnail_url || defaultThumb,
          };
        }
      }
    } catch {
      // Network/offline fallback
    }

    return {
      title: "YouTube Track",
      artist: "YouTube Artist",
      thumbnail: defaultThumb,
    };
  }

  // ── Direct Audio / MP3 URL ──
  try {
    const u = new URL(cleanUrl);
    const filename = u.pathname.split("/").pop()?.replace(/\.[^.]+$/, "");
    if (filename) {
      let decoded = decodeURIComponent(filename);
      decoded = decoded.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
      const prettyTitle = decoded.replace(/\b\w/g, (c) => c.toUpperCase());
      return {
        title: prettyTitle || "Audio Track",
        artist: "Offline Audio",
      };
    }
  } catch {
    // Ignore invalid URL formatting
  }

  return {
    title: "Audio Track",
    artist: "Artist",
  };
}
