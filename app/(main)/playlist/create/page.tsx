// app/(main)/playlist/create/page.tsx
"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Metadata } from "next";
import { Music2, Upload, Lock, Globe, Loader2, X } from "lucide-react";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CreatePlaylistPage() {
  const router = useRouter();

  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [isPublic,    setIsPublic]    = useState(true);
  const [cover,       setCover]       = useState<string | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [errors,      setErrors]      = useState<Record<string, string>>({});

  const fileRef = useRef<HTMLInputElement>(null);

  // Handle cover image upload (preview only — upload to your storage separately)
  function handleCover(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors(v => ({ ...v, cover: "Please select an image file." }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setCover(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!title.trim())           errs.title = "Playlist name is required.";
    if (title.length > 100)      errs.title = "Name must be under 100 characters.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // TODO: replace with real API call
      // const playlist = await playlistService.create({ title, description, isPublic, cover });
      await new Promise(r => setTimeout(r, 800)); // simulate API
      router.push("/library");                    // redirect on success
    } catch {
      setErrors(v => ({ ...v, form: "Failed to create playlist. Please try again." }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container max-w-lg py-10 animate-fade-in">

      {/* ── Header ── */}
      <div className="mb-8">
        <p className="label-overline mb-1">New playlist</p>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Create playlist
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Build a collection of songs you love.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">

        {/* ── Cover art upload ── */}
        <div className="flex items-start gap-5">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="
              relative w-32 h-32 sm:w-40 sm:h-40
              rounded-[var(--radius-xl)] overflow-hidden
              bg-[var(--bg-elevated)] border-2 border-dashed border-[var(--border)]
              flex flex-col items-center justify-center gap-2
              hover:border-[var(--border-brand)] hover:bg-[var(--brand)]/5
              transition-all group flex-shrink-0
              cursor-pointer
            "
          >
            {cover ? (
              <>
                <Image src={cover} alt="Cover" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                  <Upload size={18} className="text-white" />
                  <span className="text-white text-xs font-medium">Change</span>
                </div>
              </>
            ) : (
              <>
                <Music2 size={28} className="text-[var(--text-muted)] group-hover:text-[var(--brand)] transition-colors" />
                <span className="text-[10px] text-[var(--text-muted)] text-center px-2 leading-snug">
                  Add cover art
                </span>
              </>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleCover}
            className="hidden"
          />
          <div className="flex-1 min-w-0 pt-1">
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Upload a JPG, PNG or WEBP image.<br />
              Recommended: 500×500px or larger.
            </p>
            {errors.cover && (
              <p className="text-xs text-red-400 mt-2">{errors.cover}</p>
            )}
          </div>
        </div>

        {/* ── Playlist name ── */}
        <div className="space-y-1.5">
          <label className="label-overline">Playlist name *</label>
          <input
            type="text"
            value={title}
            onChange={e => { setTitle(e.target.value); setErrors(v => ({ ...v, title:"" })); }}
            placeholder="My awesome playlist…"
            maxLength={100}
            className={`
              input
              ${errors.title ? "border-red-500/60 focus:border-red-500" : ""}
            `}
          />
          <div className="flex items-center justify-between">
            {errors.title
              ? <p className="text-xs text-red-400">{errors.title}</p>
              : <span />
            }
            <span className="text-[10px] text-[var(--text-muted)] ml-auto">
              {title.length}/100
            </span>
          </div>
        </div>

        {/* ── Description ── */}
        <div className="space-y-1.5">
          <label className="label-overline">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Give your playlist a description (optional)…"
            rows={3}
            maxLength={300}
            className="
              input resize-none rounded-[var(--radius-lg)]
              py-3 leading-relaxed
            "
          />
          <span className="text-[10px] text-[var(--text-muted)] block text-right">
            {description.length}/300
          </span>
        </div>

        {/* ── Visibility toggle ── */}
        <div className="space-y-2">
          <label className="label-overline">Visibility</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: true,  icon: Globe, label: "Public",  desc: "Anyone can see it" },
              { value: false, icon: Lock,  label: "Private", desc: "Only you can see it" },
            ].map(opt => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => setIsPublic(opt.value)}
                className={`
                  flex items-center gap-3 p-4
                  rounded-[var(--radius-lg)] border text-left
                  transition-all
                  ${isPublic === opt.value
                    ? "border-[var(--border-brand)] bg-[var(--brand)]/10"
                    : "border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--border-hover)]"
                  }
                `}
              >
                <opt.icon
                  size={18}
                  className={isPublic === opt.value ? "text-[var(--brand)]" : "text-[var(--text-muted)]"}
                />
                <div className="min-w-0">
                  <p className={`text-sm font-semibold ${isPublic === opt.value ? "text-[var(--brand)]" : "text-[var(--text-primary)]"}`}>
                    {opt.label}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Global error ── */}
        {errors.form && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-[var(--radius-md)] px-4 py-3">
            <X size={14} className="text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-400">{errors.form}</p>
          </div>
        )}

        {/* ── Submit ── */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary px-8 py-3 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Creating…
              </>
            ) : (
              "Create Playlist"
            )}
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