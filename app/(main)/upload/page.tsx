"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Upload, Music2, Image as ImageIcon,
  X, CheckCircle2, Loader2, Play, RefreshCw,
} from "lucide-react";

interface UploadedSong {
  id:        string;
  title:     string;
  artist:    string;
  audioUrl:  string;
  thumbnail: string;
  duration:  number;
}

// ─────────────────────────────────────────────────────────────────
// Canvas thumbnail — music note on black, title + artist as text
// ─────────────────────────────────────────────────────────────────
function generateDefaultThumbnail(title: string, artist: string): File {
  const SIZE = 500;
  const canvas = document.createElement("canvas");
  canvas.width  = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Subtle radial vignette
  const vignette = ctx.createRadialGradient(
    SIZE / 2, SIZE / 2, SIZE * 0.2,
    SIZE / 2, SIZE / 2, SIZE * 0.75,
  );
  vignette.addColorStop(0, "rgba(28,28,28,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.75)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Decorative outer ring
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.arc(SIZE / 2, SIZE / 2, SIZE * 0.43, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // ── Music note (hand-drawn paths, no external dep) ──────────
  const cx = SIZE / 2 - 10;   // slight left offset for visual balance
  const cy = SIZE / 2 - 24;

  ctx.save();
  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle   = "#ffffff";
  ctx.lineWidth   = 20;
  ctx.lineCap     = "round";
  ctx.lineJoin    = "round";

  // Vertical stem
  ctx.beginPath();
  ctx.moveTo(cx + 58, cy - 68);
  ctx.lineTo(cx + 58, cy + 28);
  ctx.stroke();

  // Curved flag
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.moveTo(cx + 58, cy - 68);
  ctx.bezierCurveTo(
    cx + 108, cy - 44,
    cx + 108, cy - 4,
    cx + 58,  cy - 8,
  );
  ctx.stroke();

  // Note head (filled rotated ellipse)
  ctx.save();
  ctx.translate(cx + 32, cy + 34);
  ctx.rotate(-0.48);
  ctx.scale(1.45, 1);
  ctx.beginPath();
  ctx.arc(0, 0, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();

  // ── Title ────────────────────────────────────────────────────
  const truncate = (str: string, max: number) =>
    str.length > max ? str.slice(0, max - 1) + "…" : str;

  if (title) {
    ctx.save();
    ctx.fillStyle    = "rgba(255,255,255,0.92)";
    ctx.font         = "600 28px -apple-system, system-ui, sans-serif";
    ctx.textAlign    = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(truncate(title, 22), SIZE / 2, SIZE - 88);
    ctx.restore();
  }

  // ── Artist ───────────────────────────────────────────────────
  if (artist) {
    ctx.save();
    ctx.fillStyle    = "rgba(255,255,255,0.38)";
    ctx.font         = "400 20px -apple-system, system-ui, sans-serif";
    ctx.textAlign    = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(truncate(artist, 30), SIZE / 2, SIZE - 58);
    ctx.restore();
  }

  // Convert canvas → File
  const dataUrl = canvas.toDataURL("image/png");
  const [header, b64] = dataUrl.split(",");
  const mime   = header.match(/:(.*?);/)![1];
  const binary = atob(b64);
  const bytes  = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], "thumbnail.png", { type: mime });
}

// ─────────────────────────────────────────────────────────────────
// Thumbnail preview component
// ─────────────────────────────────────────────────────────────────
function ThumbnailPreview({
  preview,
  isGenerated,
  onUploadClick,
  onRegenerate,
  onRemove,
}: {
  preview:      string | null;
  isGenerated:  boolean;
  onUploadClick: () => void;
  onRegenerate:  () => void;
  onRemove:      () => void;
}) {
  if (!preview) {
    // No image yet — simple upload button
    return (
      <button
        type="button"
        onClick={onUploadClick}
        className="
          flex items-center gap-4 w-full p-4
          rounded-[var(--radius-lg)]
          border border-[var(--border)]
          hover:border-[var(--border-hover)]
          transition-colors group
        "
      >
        <div className="
          w-16 h-16 rounded-[var(--radius-md)] overflow-hidden
          bg-[var(--bg-elevated)] flex items-center justify-center flex-shrink-0
        ">
          <ImageIcon size={20} className="text-[var(--text-muted)]" />
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-[var(--text-primary)]">
            Upload cover image
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            JPG, PNG, WEBP · 500 × 500 px recommended
          </p>
          <p className="text-xs text-[var(--brand)] mt-1">
            Or we&apos;ll generate one automatically ✦
          </p>
        </div>
      </button>
    );
  }

  return (
    <div className="
      flex items-center gap-4 w-full p-4
      rounded-[var(--radius-lg)]
      border border-[var(--border)]
      bg-[var(--bg-elevated)]/40
    ">
      {/* Preview image */}
      <div className="relative w-16 h-16 rounded-[var(--radius-md)] overflow-hidden flex-shrink-0">
        <img src={preview} alt="Cover preview" className="w-full h-full object-cover" />
        {isGenerated && (
          <div className="
            absolute inset-0 flex items-center justify-center
            bg-black/40 opacity-0 hover:opacity-100 transition-opacity
          ">
            <Music2 size={18} className="text-white/80" />
          </div>
        )}
      </div>

      {/* Info + actions */}
      <div className="flex-1 min-w-0 text-left">
        {isGenerated ? (
          <>
            <p className="text-sm font-medium text-[var(--text-primary)]">
              Auto-generated cover
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Music note · black background
            </p>
          </>
        ) : (
          <p className="text-sm font-medium text-[var(--text-primary)]">
            Custom cover selected
          </p>
        )}

        <div className="flex items-center gap-3 mt-2">
          <button
            type="button"
            onClick={onUploadClick}
            className="text-xs text-[var(--brand)] hover:underline flex items-center gap-1"
          >
            <ImageIcon size={11} /> Change image
          </button>
          {isGenerated && (
            <button
              type="button"
              onClick={onRegenerate}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1"
            >
              <RefreshCw size={11} /> Regenerate
            </button>
          )}
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
          >
            <X size={11} /> Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Main upload page
// ─────────────────────────────────────────────────────────────────
export default function UploadPage() {
  const router = useRouter();

  // Form fields
  const [title,  setTitle]  = useState("");
  const [artist, setArtist] = useState("");
  const [album,  setAlbum]  = useState("");

  // Files
  const [audioFile,    setAudioFile]    = useState<File | null>(null);
  const [thumbFile,    setThumbFile]    = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [thumbIsAuto,  setThumbIsAuto]  = useState(false);

  // UI
  const [loading,  setLoading]  = useState(false);
  const [progress, setProgress] = useState(0);
  const [success,  setSuccess]  = useState<UploadedSong | null>(null);
  const [errors,   setErrors]   = useState<Record<string, string>>({});

  const audioRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);

  // ── Generate / regenerate auto thumbnail ──────────────────────
  function applyGeneratedThumb(t = title, a = artist) {
    const file = generateDefaultThumbnail(t, a);
    setThumbFile(file);
    setThumbIsAuto(true);
    // Preview via object URL
    const url = URL.createObjectURL(file);
    setThumbPreview(url);
  }

  // ── Audio file handler ────────────────────────────────────────
  function handleAudio(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const ALLOWED = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/flac", "audio/aac"];
    if (!ALLOWED.includes(file.type)) {
      setErrors(v => ({ ...v, audio: "Supported: MP3, WAV, OGG, FLAC, AAC" }));
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setErrors(v => ({ ...v, audio: "File must be under 50 MB" }));
      return;
    }

    setAudioFile(file);
    setErrors(v => ({ ...v, audio: "" }));

    // Auto-fill title from filename
    const derived = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
    const newTitle = title || derived;
    if (!title) setTitle(newTitle);

    // Auto-generate thumbnail if none chosen yet
    if (!thumbFile) applyGeneratedThumb(newTitle, artist);
  }

  // ── Custom thumbnail handler ───────────────────────────────────
  function handleThumb(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors(v => ({ ...v, thumb: "Please select an image file" }));
      return;
    }
    setThumbFile(file);
    setThumbIsAuto(false);
    const reader = new FileReader();
    reader.onload = ev => setThumbPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function removeThumbnail() {
    setThumbFile(null);
    setThumbPreview(null);
    setThumbIsAuto(false);
    if (thumbRef.current) thumbRef.current.value = "";
  }

  // ── Title / artist blur → regenerate if auto thumb ────────────
  function onTitleBlur() {
    if (thumbIsAuto) applyGeneratedThumb(title, artist);
  }
  function onArtistBlur() {
    if (thumbIsAuto) applyGeneratedThumb(title, artist);
  }

  // ── Validation ────────────────────────────────────────────────
  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!audioFile)     errs.audio  = "Please select an audio file";
    if (!title.trim())  errs.title  = "Song title is required";
    if (!artist.trim()) errs.artist = "Artist name is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── Submit ────────────────────────────────────────────────────
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    // If still no thumbnail, generate one right before submit
    let finalThumb = thumbFile;
    if (!finalThumb) {
      finalThumb = generateDefaultThumbnail(title, artist);
    }

    setLoading(true);
    setProgress(0);

    try {
      const form = new FormData();
      form.append("audio",     audioFile!);
      form.append("title",     title.trim());
      form.append("artist",    artist.trim());
      if (album.trim()) form.append("album", album.trim());
      form.append("thumbnail", finalThumb);

      const tick = setInterval(() => setProgress(p => Math.min(p + 10, 90)), 200);

      const res  = await fetch("/api/songs/upload", { method: "POST", body: form });
      const data = await res.json();

      clearInterval(tick);
      setProgress(100);

      if (data.status && data.data) {
        setSuccess(data.data);
      } else {
        setErrors(v => ({ ...v, form: data.error ?? "Upload failed" }));
      }
    } catch {
      setErrors(v => ({ ...v, form: "Network error. Please try again." }));
    } finally {
      setLoading(false);
    }
  }

  // ── Reset ─────────────────────────────────────────────────────
  function reset() {
    setSuccess(null);
    setAudioFile(null);
    setThumbFile(null);
    setThumbPreview(null);
    setThumbIsAuto(false);
    setTitle("");
    setArtist("");
    setAlbum("");
    setProgress(0);
    setErrors({});
  }

  // ─────────────────────────────────────────────────────────────
  // Success screen
  // ─────────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="container max-w-lg py-16 text-center animate-fade-in">
        <div className="
          w-16 h-16 rounded-full
          bg-[var(--brand)]/20
          flex items-center justify-center mx-auto mb-4
        ">
          <CheckCircle2 size={32} className="text-[var(--brand)]" />
        </div>

        {/* Thumbnail preview */}
        {success.thumbnail && (
          <img
            src={success.thumbnail}
            alt="cover"
            className="w-24 h-24 rounded-[var(--radius-lg)] object-cover mx-auto mb-4 shadow-lg"
          />
        )}

        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">
          Song uploaded!
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          &quot;{success.title}&quot; by {success.artist} is ready to play.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={async () => {
              const { playSong } = (await import("@/store/playerStore"))
                .usePlayerStore.getState();
              playSong({
                id:        success.id,
                title:     success.title,
                artist:    success.artist,
                audioUrl:  success.audioUrl,
                thumbnail: success.thumbnail,
                duration:  success.duration,
              });
            }}
            className="btn btn-primary px-2 py-2 flex items-center gap-2"
          >
            <Play size={15} /> Play now
          </button>
          <button onClick={reset} className="btn p-2 btn-ghost">
            Upload another
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Main form
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="container max-w-lg py-10 animate-fade-in">

      {/* Header */}
      <div className="mb-8">
        <p className="label-overline mb-1">Add music</p>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Upload a song
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          MP3 · WAV · OGG · FLAC · AAC &nbsp;·&nbsp; max 50 MB
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">

        {/* ── Audio drop zone ──────────────────────────────────── */}
        <div>
          <label className="label-overline mb-2 block">Audio file *</label>
          <button
            type="button"
            onClick={() => audioRef.current?.click()}
            className={`
              w-full flex flex-col items-center justify-center gap-3
              py-10 rounded-[var(--radius-xl)]
              border-2 border-dashed transition-all
              ${audioFile
                ? "border-[var(--border-brand)] bg-[var(--brand)]/5"
                : errors.audio
                  ? "border-red-500/50 bg-red-500/5 hover:border-red-500"
                  : "border-[var(--border)] hover:border-[var(--border-brand)] hover:bg-[var(--brand)]/5"
              }
            `}
          >
            {audioFile ? (
              <>
                <div className="
                  w-12 h-12 rounded-full
                  bg-[var(--brand)]/20
                  flex items-center justify-center
                ">
                  <Music2 size={22} className="text-[var(--brand)]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {audioFile.name}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {(audioFile.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    setAudioFile(null);
                    if (audioRef.current) audioRef.current.value = "";
                  }}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <X size={12} /> Remove
                </button>
              </>
            ) : (
              <>
                <Upload size={28} className="text-[var(--text-muted)]" />
                <div className="text-center">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    Click to select audio
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    MP3, WAV, OGG, FLAC, AAC
                  </p>
                </div>
              </>
            )}
          </button>
          <input
            ref={audioRef}
            type="file"
            accept="audio/*"
            onChange={handleAudio}
            className="hidden"
          />
          {errors.audio && (
            <p className="text-xs text-red-400 mt-1.5">{errors.audio}</p>
          )}
        </div>

        {/* ── Title ─────────────────────────────────────────────── */}
        <div className="space-y-1.5">
          <label className="label-overline">Song title *</label>
          <input
            type="text"
            value={title}
            onChange={e => { setTitle(e.target.value); setErrors(v => ({ ...v, title: "" })); }}
            onBlur={onTitleBlur}
            placeholder="Enter song title"
            className={`input ${errors.title ? "border-red-500/60" : ""}`}
          />
          {errors.title && <p className="text-xs text-red-400">{errors.title}</p>}
        </div>

        {/* ── Artist ────────────────────────────────────────────── */}
        <div className="space-y-1.5">
          <label className="label-overline">Artist *</label>
          <input
            type="text"
            value={artist}
            onChange={e => { setArtist(e.target.value); setErrors(v => ({ ...v, artist: "" })); }}
            onBlur={onArtistBlur}
            placeholder="Artist name"
            className={`input ${errors.artist ? "border-red-500/60" : ""}`}
          />
          {errors.artist && <p className="text-xs text-red-400">{errors.artist}</p>}
        </div>

        {/* ── Album ─────────────────────────────────────────────── */}
        <div className="space-y-1.5">
          <label className="label-overline">
            Album{" "}
            <span className="text-[var(--text-muted)] normal-case tracking-normal font-normal">
              (optional)
            </span>
          </label>
          <input
            type="text"
            value={album}
            onChange={e => setAlbum(e.target.value)}
            placeholder="Album name"
            className="input"
          />
        </div>

        {/* ── Cover art ─────────────────────────────────────────── */}
        <div className="space-y-1.5">
          <label className="label-overline">
            Cover art{" "}
            <span className="text-[var(--text-muted)] normal-case tracking-normal font-normal">
              (optional — auto-generated if skipped)
            </span>
          </label>

          <ThumbnailPreview
            preview={thumbPreview}
            isGenerated={thumbIsAuto}
            onUploadClick={() => thumbRef.current?.click()}
            onRegenerate={() => applyGeneratedThumb(title, artist)}
            onRemove={removeThumbnail}
          />

          <input
            ref={thumbRef}
            type="file"
            accept="image/*"
            onChange={handleThumb}
            className="hidden"
          />
          {errors.thumb && (
            <p className="text-xs text-red-400 mt-1">{errors.thumb}</p>
          )}
        </div>

        {/* ── Progress bar ───────────────────────────────────────── */}
        {loading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span>Uploading…</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--brand)] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* ── Global error ───────────────────────────────────────── */}
        {errors.form && (
          <div className="
            flex items-center gap-2
            bg-red-500/10 border border-red-500/30
            rounded-[var(--radius-md)] px-4 py-3
          ">
            <X size={14} className="text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-400">{errors.form}</p>
          </div>
        )}

        {/* ── Submit row ─────────────────────────────────────────── */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="
              btn btn-primary px-8 py-3
              flex items-center gap-2
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {loading
              ? <><Loader2 size={15} className="animate-spin" /> Uploading…</>
              : <><Upload size={15} /> Upload Song</>
            }
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-ghost px-6 py-3"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}