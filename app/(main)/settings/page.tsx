// app/(main)/settings/page.tsx
"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  Settings,
  Sliders,
  User,
  Shield,
  Palette,
  HardDrive,
  Bell,
  Volume2,
  Check,
  LogOut,
  Sparkles,
  Zap,
  Radio,
  Trash2,
  ExternalLink,
} from "lucide-react";

type SettingsSection = "audio" | "account" | "appearance" | "privacy" | "storage";

export default function SettingsPage() {
  let session = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const res = useSession();
    session = res?.data ?? null;
  } catch {
    session = null;
  }

  const [activeSection, setActiveSection] = useState<SettingsSection>("audio");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Audio settings
  const [audioQuality, setAudioQuality] = useState("high");
  const [equalizer, setEqualizer] = useState("bass");
  const [crossfade, setCrossfade] = useState(4);
  const [autoplay, setAutoplay] = useState(true);
  const [normalizeVolume, setNormalizeVolume] = useState(true);

  // Appearance settings
  const [themeMode, setThemeMode] = useState("dark");
  const [accentColor, setAccentColor] = useState("purple");
  const [compactPlayer, setCompactPlayer] = useState(false);

  // Privacy & Notifications
  const [privateSession, setPrivateSession] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);

  // Storage
  const [cacheSize, setCacheSize] = useState("1.2 GB");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleClearCache = () => {
    setCacheSize("0 MB");
    showToast("Cache cleared successfully!");
  };

  return (
    <div className="container py-8 max-w-5xl mx-auto animate-fade-in pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-8 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <Check size={16} /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] flex items-center gap-2.5">
          <Settings size={28} className="text-[var(--brand)]" /> App Settings
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
          Customize your audio engine, appearance preferences, security, and storage options.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Category Navigation Sidebar */}
        <aside className="space-y-1">
          {[
            { id: "audio", label: "Audio & Playback", icon: Volume2 },
            { id: "account", label: "Account & Security", icon: User },
            { id: "appearance", label: "Appearance & Theme", icon: Palette },
            { id: "privacy", label: "Privacy & Notifications", icon: Shield },
            { id: "storage", label: "Storage & Cache", icon: HardDrive },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id as SettingsSection)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all text-left
                ${
                  activeSection === id
                    ? "bg-[var(--brand)] text-white shadow-md shadow-[var(--brand)]/20"
                    : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--bg-elevated)] hover:text-white"
                }
              `}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </aside>

        {/* Main Settings Panel */}
        <main className="md:col-span-3 space-y-6">
          {/* ── Audio & Playback ── */}
          {activeSection === "audio" && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-5">
                <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Volume2 size={18} className="text-[var(--brand)]" /> Audio Streaming Quality
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "normal", label: "Normal", bitrate: "160 kbps (Standard)" },
                    { id: "high", label: "High Quality", bitrate: "320 kbps (Recommended)" },
                    { id: "lossless", label: "Hi-Fi FLAC", bitrate: "Lossless (Master Audio)" },
                  ].map((q) => (
                    <div
                      key={q.id}
                      onClick={() => {
                        setAudioQuality(q.id);
                        showToast(`Audio quality set to ${q.label}`);
                      }}
                      className={`
                        p-3.5 rounded-xl border cursor-pointer transition-all text-left
                        ${
                          audioQuality === q.id
                            ? "bg-[var(--brand)]/10 border-[var(--brand)] text-[var(--brand)] shadow-sm"
                            : "bg-[var(--bg-elevated)] border-white/5 text-[var(--text-secondary)] hover:border-white/20"
                        }
                      `}
                    >
                      <p className="text-xs font-bold">{q.label}</p>
                      <p className="text-[10px] opacity-75 mt-0.5">{q.bitrate}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-[var(--border)] space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                      Equalizer Preset
                    </label>
                    <select
                      value={equalizer}
                      onChange={(e) => {
                        setEqualizer(e.target.value);
                        showToast(`Equalizer set to ${e.target.value.toUpperCase()}`);
                      }}
                      className="input w-full max-w-xs text-xs"
                    >
                      <option value="flat">Flat (Default)</option>
                      <option value="bass">Bass Boost 🔥</option>
                      <option value="treble">Treble Boost</option>
                      <option value="vocal">Vocal Clarity</option>
                      <option value="club">Club & EDM</option>
                      <option value="rock">Rock & Guitar</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-[var(--text-primary)]">Crossfade Songs</span>
                      <span className="text-[var(--brand)] font-mono">{crossfade} seconds</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={12}
                      value={crossfade}
                      onChange={(e) => setCrossfade(Number(e.target.value))}
                      className="w-full accent-[var(--brand)] cursor-pointer"
                    />
                    <p className="text-[11px] text-[var(--text-muted)] mt-1">
                      Smoothly overlap transitions between queue songs.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border)] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[var(--text-primary)]">Autoplay Similar Tracks</p>
                      <p className="text-[11px] text-[var(--text-muted)]">Keep playing recommended music when your queue finishes.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoplay}
                      onChange={(e) => setAutoplay(e.target.checked)}
                      className="w-4 h-4 accent-[var(--brand)] cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-xs font-bold text-[var(--text-primary)]">Volume Normalization</p>
                      <p className="text-[11px] text-[var(--text-muted)]">Maintain consistent volume levels across all songs.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={normalizeVolume}
                      onChange={(e) => setNormalizeVolume(e.target.checked)}
                      className="w-4 h-4 accent-[var(--brand)] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Account & Security ── */}
          {activeSection === "account" && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-5">
                <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <User size={18} className="text-[var(--brand)]" /> Subscription & Account Details
                </h2>

                <div className="p-4 rounded-xl bg-gradient-to-r from-violet-600/20 to-indigo-900/20 border border-violet-500/30 flex items-center justify-between">
                  <div>
                    <span className="badge badge-brand mb-1">Active Plan</span>
                    <h3 className="text-lg font-bold text-white">Musify Premium Pro</h3>
                    <p className="text-xs text-violet-200 mt-0.5">High Quality Audio • Unlimited Downloads • Zero Ads</p>
                  </div>
                  <button className="btn btn-ghost border border-white/20 text-xs px-3 py-1.5">
                    Manage Plan
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">Logged In Email</label>
                    <input
                      type="email"
                      value={session?.user?.email || "alex.rivera@musify.app"}
                      disabled
                      className="input w-full opacity-70 cursor-not-allowed text-xs font-mono"
                    />
                  </div>

                  <div className="pt-3 border-t border-[var(--border)]">
                    <p className="text-xs font-bold text-[var(--text-primary)] mb-2">Connected Music Sources</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-elevated)] text-xs">
                        <span className="font-semibold text-red-400">YouTube Music API</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1"><Check size={12} /> Connected</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-elevated)] text-xs">
                        <span className="font-semibold text-emerald-400">Spotify Library Sync</span>
                        <button className="text-[var(--brand)] hover:underline flex items-center gap-1 font-semibold">Connect <ExternalLink size={12} /></button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--border)] flex justify-between items-center">
                    <p className="text-xs text-[var(--text-muted)]">Need to sign out of your account on this device?</p>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="btn bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 text-xs font-semibold px-4 py-2 flex items-center gap-2"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Appearance & Theme ── */}
          {activeSection === "appearance" && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-5">
                <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Palette size={18} className="text-[var(--brand)]" /> Interface Customization
                </h2>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">Theme Mode</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { id: "dark", name: "Deep Obsidian", desc: "Dark theme (Default)" },
                      { id: "neon", name: "Cyber Neon", desc: "High contrast glowing UI" },
                      { id: "glass", name: "Glassmorphism", desc: "Translucent blurred cards" },
                    ].map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          setThemeMode(t.id);
                          showToast(`Theme updated to ${t.name}`);
                        }}
                        className={`
                          p-3.5 rounded-xl border cursor-pointer transition-all
                          ${
                            themeMode === t.id
                              ? "bg-[var(--brand)]/10 border-[var(--brand)] text-[var(--brand)]"
                              : "bg-[var(--bg-elevated)] border-white/5 text-[var(--text-secondary)]"
                          }
                        `}
                      >
                        <p className="text-xs font-bold">{t.name}</p>
                        <p className="text-[10px] opacity-75 mt-0.5">{t.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[var(--text-primary)]">Compact Mini Player</p>
                      <p className="text-[11px] text-[var(--text-muted)]">Shrink bottom player bar to minimal mode.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={compactPlayer}
                      onChange={(e) => setCompactPlayer(e.target.checked)}
                      className="w-4 h-4 accent-[var(--brand)] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Privacy & Notifications ── */}
          {activeSection === "privacy" && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-4">
                <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Shield size={18} className="text-[var(--brand)]" /> Privacy & Listening Visibility
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[var(--text-primary)]">Private Listening Session</p>
                      <p className="text-[11px] text-[var(--text-muted)]">Hide listening activity from public profile & friends.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privateSession}
                      onChange={(e) => setPrivateSession(e.target.checked)}
                      className="w-4 h-4 accent-[var(--brand)] cursor-pointer"
                    />
                  </div>

                  <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[var(--text-primary)]">Weekly Music Recommendation Email</p>
                      <p className="text-[11px] text-[var(--text-muted)]">Receive curated weekly mixes based on your liked tracks.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailNotifs}
                      onChange={(e) => setEmailNotifs(e.target.checked)}
                      className="w-4 h-4 accent-[var(--brand)] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Storage & Cache ── */}
          {activeSection === "storage" && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] space-y-4">
                <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <HardDrive size={18} className="text-[var(--brand)]" /> Offline Storage & Audio Cache
                </h2>

                <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[var(--text-primary)]">Used Local Storage</span>
                    <span className="text-[var(--brand)] font-mono">{cacheSize}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 w-1/4 rounded-full" />
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">Temporary audio stream cache and album art image thumbnails.</p>
                </div>

                <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[var(--text-primary)]">Clear Offline Cache</p>
                    <p className="text-[11px] text-[var(--text-muted)]">Frees up disk space without deleting your liked songs.</p>
                  </div>
                  <button
                    onClick={handleClearCache}
                    className="btn border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs font-semibold px-4 py-2 flex items-center gap-1.5"
                  >
                    <Trash2 size={14} /> Clear Cache
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}