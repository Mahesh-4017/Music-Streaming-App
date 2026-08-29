"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Music2,
  Headphones,
  Sparkles,
  ShieldCheck,
  Play,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password. Please check your credentials.");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-dvh w-full bg-[var(--bg-base)] flex flex-col lg:grid lg:grid-cols-12 relative overflow-hidden font-[family-name:var(--font-body)]">
      
      {/* ════════════════════════════════════════════════
          LEFT HERO VISUAL SIDE (Hidden on mobile, 5 cols on lg, 6 cols on xl)
      ════════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 relative flex-col justify-between p-12 overflow-hidden border-r border-[var(--border)]">
        
        {/* Background Image & Ambient Glow Gradients */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/login-hero.png"
            alt="Musify Experience"
            fill
            priority
            className="object-cover object-center opacity-40 scale-105 transition-transform duration-1000 hover:scale-100"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at 20% 20%, rgba(42,82,190,0.35) 0%, transparent 70%),
                radial-gradient(ellipse 60% 50% at 80% 80%, rgba(124,58,237,0.3) 0%, transparent 70%),
                linear-gradient(to bottom, rgba(10,10,15,0.4) 0%, rgba(10,10,15,0.85) 100%)
              `,
            }}
          />
        </div>

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[var(--brand)] flex items-center justify-center text-white shadow-[0_0_30px_rgba(124,111,224,0.4)]">
            <Music2 size={24} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white font-[family-name:var(--font-display)]">
            Musify
          </span>
        </div>

        {/* Middle Floating Feature Card */}
        <div className="relative z-10 my-auto max-w-lg space-y-8">
          
          {/* Main Headline */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--brand)]/15 border border-[var(--border-brand)] text-[var(--brand)] text-xs font-semibold">
              <Sparkles size={13} />
              <span>Next-Gen Audio Experience</span>
            </div>
            
            <h2 className="text-4xl xl:text-5xl font-bold tracking-tight text-white leading-tight font-[family-name:var(--font-display)]">
              Feel Every Beat. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand)] via-indigo-300 to-purple-400">
                Stream Unlimited.
              </span>
            </h2>
            <p className="text-base text-[var(--text-secondary)] font-light leading-relaxed">
              Access your favorite YouTube music, MP3 uploads, and custom playlists in one ultra-sleek player.
            </p>
          </div>

          {/* Interactive Player Mockup Preview Card */}
          <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-2xl shadow-2xl space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[var(--brand)]/30 border border-[var(--brand)]/40 flex items-center justify-center text-white shrink-0 relative">
                <Play size={20} className="fill-white ml-0.5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[var(--bg-base)] animate-ping" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white truncate">Blinding Lights</p>
                <p className="text-xs text-[var(--text-secondary)] truncate">The Weeknd · High Quality Audio</p>
              </div>

              {/* Animated Equalizer Wave */}
              <div className="flex items-end gap-1 h-5 shrink-0 px-2 py-1 bg-black/40 rounded-lg border border-white/5">
                <span className="w-0.5 bg-[var(--brand)] animate-bounce h-full"></span>
                <span className="w-0.5 bg-[var(--brand)] animate-bounce h-3 delay-100"></span>
                <span className="w-0.5 bg-[var(--brand)] animate-bounce h-4 delay-200"></span>
                <span className="w-0.5 bg-[var(--brand)] animate-bounce h-2 delay-300"></span>
              </div>
            </div>

            {/* Feature Bullets */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-[11px] text-[var(--text-secondary)] font-medium">
              <div className="flex items-center gap-1.5">
                <Headphones size={13} className="text-[var(--brand)]" /> Lossless Sound
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-400" /> Cloud Sync
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-400" /> YouTube & MP3
              </div>
            </div>
          </div>

        </div>

        {/* Footer Quote */}
        <div className="relative z-10 pt-6 border-t border-white/5 text-xs text-[var(--text-muted)] flex items-center justify-between">
          <span>© {new Date().getFullYear()} Musify Inc.</span>
          <span>Designed for Music Lovers</span>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          RIGHT FORM CONTAINER (7 cols on lg, 6 cols on xl)
      ════════════════════════════════════════════════ */}
      <div className="flex-1 lg:col-span-7 xl:col-span-6 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
        
        {/* Mobile Header Logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[var(--brand)] flex items-center justify-center text-white shrink-0 shadow-[0_0_24px_rgba(124,111,224,0.3)]">
            <Music2 size={20} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl tracking-tight text-[var(--text-primary)] font-[family-name:var(--font-display)]">
            Musify
          </span>
        </div>

        {/* Auth Form Card */}
        <div className="w-full max-w-md space-y-8 bg-[var(--bg-surface)]/80 backdrop-blur-2xl border border-[var(--border)] rounded-3xl p-8 sm:p-10 shadow-[0_16px_48px_rgba(0,0,0,0.6)] relative overflow-hidden">
          
          {/* Header */}
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] font-[family-name:var(--font-display)]">
              Welcome back
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Sign in to your account to resume listening.
            </p>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm animate-shake">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5 animate-ping" />
              <p className="flex-1 text-xs leading-relaxed">{error}</p>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="
              w-full flex items-center justify-center gap-3 px-4 py-3
              bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl
              text-[var(--text-primary)] text-sm font-semibold
              transition-all duration-200 hover:border-[var(--border-hover)] hover:bg-[var(--bg-elevated)]/80
              hover:shadow-lg active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {googleLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">
              Or with email
            </span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail size={17} className="absolute left-3.5 text-[var(--text-muted)] pointer-events-none" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  autoComplete="email"
                  className="
                    w-full pl-10 pr-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border)]
                    rounded-2xl text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)]
                    outline-none transition-all duration-200
                    focus:border-[var(--brand)] focus:shadow-[0_0_0_4px_rgba(124,111,224,0.15)]
                  "
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[var(--brand)] hover:text-[var(--brand-light)] transition-colors font-medium"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock size={17} className="absolute left-3.5 text-[var(--text-muted)] pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="current-password"
                  className="
                    w-full pl-10 pr-10 py-3 bg-[var(--bg-elevated)] border border-[var(--border)]
                    rounded-2xl text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)]
                    outline-none transition-all duration-200
                    focus:border-[var(--brand)] focus:shadow-[0_0_0_4px_rgba(124,111,224,0.15)]
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                mt-2 w-full py-3.5 bg-[var(--brand)] hover:bg-[var(--brand-dark)]
                active:scale-[0.98] text-white font-bold text-sm rounded-2xl
                flex items-center justify-center gap-2
                shadow-[0_4px_24px_rgba(124,111,224,0.35)]
                transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Footer Registration Link */}
          <div className="pt-4 border-t border-[var(--border)] text-center text-sm text-[var(--text-secondary)]">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-[var(--brand)] font-bold hover:text-[var(--brand-light)] transition-colors underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}