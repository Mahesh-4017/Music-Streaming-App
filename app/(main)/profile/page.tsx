// app/(main)/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  User,
  Heart,
  Music2,
  Clock,
  Award,
  Edit3,
  Settings,
  Play,
  Share2,
  Check,
  Sparkles,
  ListMusic,
  Flame,
  X,
  Upload,
  Camera,
} from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { useLikedStore } from "@/store/likedStore";

type ProfileTab = "overview" | "liked" | "playlists" | "activity";

export default function ProfilePage() {
  let session = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const res = useSession();
    session = res?.data ?? null;
  } catch {
    session = null;
  }
  const { playTrack } = usePlayerStore();
  const { likedSongs, removeLiked } = useLikedStore();

  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Profile Form State - set to user requested defaults
  const [displayName, setDisplayName] = useState("Mahesh");
  const [bio, setBio] = useState("Passionate music lover, audiophile & playlist builder 🎧");
  const [favGenre, setFavGenre] = useState("Synthwave & Pop");
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80");

  useEffect(() => {
    setMounted(true);
    if (session?.user) {
      if (session.user.name && displayName === "Alex Rivera") setDisplayName(session.user.name);
      if (session.user.image) setAvatarUrl(session.user.image);
    }
  }, [session]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setAvatarUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const userEmail = session?.user?.email || "mahesh@musify.app";

  return (
    <div className="animate-fade-in pb-20">
      {/* ── Profile Cover Banner ── */}
      <div
        className="relative h-64 sm:h-72 w-full overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(124, 111, 224, 0.4) 0%, rgba(239, 68, 68, 0.3) 50%, rgba(15, 15, 26, 1) 100%)",
        }}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      </div>

      {/* ── Main Profile Header ── */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative -mt-24">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 pb-6 border-b border-[var(--border)]">
          {/* Avatar & Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-[var(--bg-base)] shadow-2xl bg-[var(--bg-elevated)] shrink-0 group">
              <Image
                src={avatarUrl}
                alt={displayName}
                fill
                sizes="(max-width: 640px) 144px, 160px"
                className="object-cover"
                unoptimized
              />
              <button
                onClick={() => setIsEditing(true)}
                className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold"
              >
                <Camera size={20} className="mb-1" /> Change Photo
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)]">
                  {displayName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md flex items-center gap-1">
                  <Sparkles size={11} fill="white" /> Premium Pro
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[var(--text-muted)] font-mono">
                {userEmail}
              </p>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md pt-1">
                {bio}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary px-4 py-2 text-xs font-semibold flex items-center gap-2"
            >
              <Edit3 size={14} /> Edit Profile
            </button>

            <button
              onClick={handleShare}
              className="btn btn-ghost border border-white/10 px-3.5 py-2 text-xs flex items-center gap-2"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
              {copied ? "Copied Link" : "Share"}
            </button>

            <Link
              href="/settings"
              className="p-2 rounded-full border border-white/10 bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-elevated)] transition-colors"
              title="Settings"
            >
              <Settings size={18} />
            </Link>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-[var(--border)]">
          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0 border border-violet-500/20">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Listening Time</p>
              <p className="text-lg font-bold text-[var(--text-primary)]">148 Hours</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 border border-red-500/20">
              <Heart size={20} />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Liked Songs</p>
              <p className="text-lg font-bold text-[var(--text-primary)]">
                {mounted ? likedSongs.length : 0}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <ListMusic size={20} />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Playlists</p>
              <p className="text-lg font-bold text-[var(--text-primary)]">8 Playlists</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Award size={20} />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Top Genre</p>
              <p className="text-sm font-bold text-[var(--text-primary)] truncate">{favGenre}</p>
            </div>
          </div>
        </div>

        {/* ── Navigation Tabs ── */}
        <div className="flex items-center gap-2 border-b border-[var(--border)] my-6 overflow-x-auto pb-0.5">
          {(["overview", "liked", "playlists", "activity"] as ProfileTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-5 py-3 text-xs font-semibold capitalize border-b-2 transition-all whitespace-nowrap
                ${
                  activeTab === tab
                    ? "border-[var(--brand)] text-[var(--brand)] font-bold"
                    : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }
              `}
            >
              {tab === "liked" ? `Liked Songs (${mounted ? likedSongs.length : 0})` : tab}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Listening Artists */}
            <section>
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Flame size={16} className="text-rose-500" /> Top Artists This Month
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: "The Weeknd", plays: "42 plays", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300" },
                  { name: "Dua Lipa", plays: "38 plays", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300" },
                  { name: "SZA", plays: "29 plays", img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300" },
                  { name: "Cyberwave", plays: "24 plays", img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300" },
                ].map((artist, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-center group hover:bg-[var(--bg-elevated)] transition-all">
                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-3 relative border border-white/10 group-hover:scale-105 transition-transform">
                      <Image src={artist.img} alt={artist.name} fill sizes="80px" className="object-cover" />
                    </div>
                    <p className="text-sm font-bold text-[var(--text-primary)] truncate">{artist.name}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{artist.plays}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Liked Preview */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Heart size={16} className="text-red-500" fill="currentColor" /> Recently Liked Tracks
                </h3>
                <Link href="/liked-songs" className="text-xs text-[var(--brand)] hover:underline">
                  View All ({mounted ? likedSongs.length : 0}) →
                </Link>
              </div>

              {likedSongs.length === 0 ? (
                <div className="p-8 text-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-surface)]">
                  <Heart size={32} className="mx-auto text-[var(--text-muted)] mb-2 opacity-50" />
                  <p className="text-xs text-[var(--text-muted)]">No liked songs saved yet.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {likedSongs.slice(0, 4).map((track, i) => (
                    <div
                      key={track.id || i}
                      onClick={() => playTrack(track, likedSongs)}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-black relative shrink-0">
                          <img src={track.thumbnail || "/assets/images/default-song.png"} alt={track.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{track.title}</p>
                          <p className="text-[11px] text-[var(--text-muted)] truncate">{track.artist || "Unknown Artist"}</p>
                        </div>
                      </div>

                      <button className="p-2 text-[var(--text-muted)] hover:text-red-400" onClick={(e) => { e.stopPropagation(); removeLiked(track.id); }}>
                        <Heart size={16} fill="currentColor" className="text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === "liked" && (
          <div className="space-y-3 animate-fade-in">
            {likedSongs.length === 0 ? (
              <div className="py-16 text-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-surface)]">
                <Heart size={40} className="mx-auto text-red-500/40 mb-3" />
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Your Liked Collection is Empty</h3>
                <p className="text-xs text-[var(--text-muted)]">Heart songs across the app to build your library.</p>
              </div>
            ) : (
              likedSongs.map((track, i) => (
                <div
                  key={track.id || i}
                  onClick={() => playTrack(track, likedSongs)}
                  className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:bg-[var(--bg-elevated)] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono text-[var(--text-muted)] w-5 text-center">{i + 1}</span>
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-black shrink-0">
                      <img src={track.thumbnail || "/assets/images/default-song.png"} alt={track.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{track.title}</p>
                      <p className="text-[11px] text-[var(--text-muted)] truncate">{track.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); removeLiked(track.id); }}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                      title="Remove"
                    >
                      <Heart size={16} fill="currentColor" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "playlists" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-fade-in">
            {[
              { title: "Chill Synthwave Mix", tracks: "18 tracks", color: "from-indigo-600 to-purple-800" },
              { title: "Late Night Drive", tracks: "24 tracks", color: "from-rose-600 to-red-900" },
              { title: "Lofi Study Session", tracks: "45 tracks", color: "from-emerald-600 to-teal-900" },
              { title: "Workout Hits 2026", tracks: "32 tracks", color: "from-amber-600 to-orange-900" },
            ].map((pl, i) => (
              <div key={i} className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] hover:bg-[var(--bg-elevated)] transition-all cursor-pointer group">
                <div className={`aspect-square w-full rounded-lg bg-gradient-to-br ${pl.color} mb-3 flex items-center justify-center shadow-md relative group-hover:scale-105 transition-transform`}>
                  <Music2 size={36} className="text-white/80" />
                  <button className="absolute bottom-2 right-2 p-2.5 rounded-full bg-white text-black shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={16} fill="black" />
                  </button>
                </div>
                <p className="text-xs font-bold text-[var(--text-primary)] truncate">{pl.title}</p>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{pl.tracks}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-4 animate-fade-in">
            {[
              { action: "Liked track", target: "Blinding Lights by The Weeknd", time: "2 hours ago" },
              { action: "Created playlist", target: "Chill Synthwave Mix", time: "Yesterday" },
              { action: "Streamed album", target: "Future Nostalgia by Dua Lipa", time: "3 days ago" },
            ].map((act, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[var(--brand)]">{act.action}</span>
                  <span className="text-[var(--text-primary)] ml-2">{act.target}</span>
                </div>
                <span className="text-[var(--text-muted)] font-mono">{act.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Edit Profile Modal ── */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-xl)] w-full max-w-md p-6 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Edit3 size={16} className="text-[var(--brand)]" /> Edit Profile Details
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-[var(--text-muted)] hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[var(--text-muted)] mb-1 font-medium">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-[var(--text-muted)] mb-1 font-medium">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="input w-full py-2 resize-none"
                />
              </div>

              <div>
                <label className="block text-[var(--text-muted)] mb-1 font-medium">Favorite Genre</label>
                <input
                  type="text"
                  value={favGenre}
                  onChange={(e) => setFavGenre(e.target.value)}
                  className="input w-full"
                />
              </div>

              {/* Photo Upload Option */}
              <div className="space-y-2 pt-1">
                <label className="block text-[var(--text-muted)] font-medium">Profile Photo Option</label>
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    id="desktop-photo-input"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="desktop-photo-input"
                    className="btn bg-[var(--bg-elevated)] hover:bg-[var(--brand)]/15 border border-white/10 text-[var(--text-primary)] px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Upload size={14} className="text-[var(--brand)]" /> Upload Photo from Desktop
                  </label>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-[var(--border)]"></div>
                    <span className="flex-shrink mx-2 text-[10px] text-[var(--text-muted)] font-mono uppercase">Or paste image URL</span>
                    <div className="flex-grow border-t border-[var(--border)]"></div>
                  </div>

                  <input
                    type="url"
                    placeholder="https://..."
                    value={avatarUrl.startsWith("data:") ? "" : avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="input w-full text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-ghost px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-5 py-2 font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}