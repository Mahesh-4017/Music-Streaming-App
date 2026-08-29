"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/playerStore";

function getYouTubeId(url?: string): string {
  if (!url) return "";
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : "";
}

export default function AudioProvider() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytIframeRef = useRef<HTMLIFrameElement | null>(null);

  const {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    repeatMode,
    next,
  } = usePlayerStore();

  const src = currentTrack?.audioUrl || currentTrack?.url || "";
  const isYt = Boolean(
    currentTrack?.type === "youtube" ||
    src.includes("youtube.com") ||
    src.includes("youtu.be")
  );
  const ytId = isYt ? getYouTubeId(src) : "";

  // 1. Initialize HTML5 Audio Element for MP3 files
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "auto";
    }
  }, []);

  // 2. Control MP3 Audio Playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isYt || !currentTrack) {
      audio.pause();
      return;
    }

    if (src && audio.src !== src) {
      audio.src = src;
      audio.load();
    }

    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn("[AudioProvider] MP3 Playback error:", err);
      });
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying, isYt, src]);

  // 3. Sync Volume & Mute to MP3
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // 4. Sync Seek Target from range bar for MP3 & YouTube
  const seekTarget = usePlayerStore((s) => s.seekTarget);
  useEffect(() => {
    if (seekTarget === null || seekTarget === undefined) return;

    if (isYt) {
      const iframe = ytIframeRef.current;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "seekTo", args: [seekTarget, true] }),
          "*"
        );
      }
    } else if (audioRef.current) {
      audioRef.current.currentTime = seekTarget;
    }

    usePlayerStore.setState({ seekTarget: null });
  }, [seekTarget, isYt]);

  // 5. MP3 Events: Progress & Duration & Ended
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const syncTime = () => {
      const d = audio.duration && !isNaN(audio.duration) && audio.duration > 0 ? audio.duration : 0;
      const t = audio.currentTime || 0;
      usePlayerStore.setState({
        currentTime: t,
        duration: d > 0 ? d : (usePlayerStore.getState().duration || 210),
        progress: d > 0 ? (t / d) * 100 : (t / 210) * 100,
      });
    };

    const onEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        next();
      }
    };

    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("loadedmetadata", syncTime);
    audio.addEventListener("durationchange", syncTime);
    audio.addEventListener("canplay", syncTime);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", syncTime);
      audio.removeEventListener("loadedmetadata", syncTime);
      audio.removeEventListener("durationchange", syncTime);
      audio.removeEventListener("canplay", syncTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, [next, repeatMode]);

  // 6. YouTube Iframe Play/Pause & Volume Commands via postMessage
  useEffect(() => {
    if (!isYt) return;
    const iframe = ytIframeRef.current;
    if (!iframe || !iframe.contentWindow) return;

    const func = isPlaying ? "playVideo" : "pauseVideo";
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: "command", func, args: [] }),
      "*"
    );

    // Sync volume to YT iframe
    const ytVol = isMuted ? 0 : Math.round(volume * 100);
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: "command", func: "setVolume", args: [ytVol] }),
      "*"
    );
  }, [isPlaying, isYt, volume, isMuted]);

  // 7. YouTube Progress Ticker & postMessage listener
  useEffect(() => {
    if (!isYt || !isPlaying) return;

    const timer = setInterval(() => {
      usePlayerStore.setState((state) => {
        const newTime = state.currentTime + 1;
        const dur = state.duration > 0 ? state.duration : 210;
        return {
          currentTime: newTime,
          duration: dur,
          progress: (newTime / dur) * 100,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isYt, isPlaying]);

  useEffect(() => {
    if (!isYt) return;
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== "https://www.youtube.com") return;
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data.event === "infoDelivery" && data.info) {
          if (typeof data.info.currentTime === "number") {
            const t = data.info.currentTime;
            const d = data.info.duration || 210;
            usePlayerStore.setState({
              currentTime: t,
              duration: d,
              progress: d > 0 ? (t / d) * 100 : 0,
            });
          }
          if (data.info.playerState === 0) {
            next();
          }
        }
      } catch {}
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [isYt, next]);

  return (
    <div className="hidden pointer-events-none aria-hidden">
      {isYt && ytId && (
        <iframe
          ref={ytIframeRef}
          id="global-yt-player"
          src={`https://www.youtube.com/embed/${ytId}?enablejsapi=1&autoplay=1&controls=0&playsinline=1`}
          allow="autoplay; encrypted-media"
          className="w-0 h-0 opacity-0 pointer-events-none"
        />
      )}
    </div>
  );
}