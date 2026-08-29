"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Music2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Radio,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match. Please check again.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.message || "Registration failed. Please try again.");
        return;
      }

      await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });
      router.push("/");
    } catch {
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  };

  // Password strength logic
  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"][strength];

  return (
    <div className="min-h-dvh w-full bg-[var(--bg-base)] flex flex-col lg:grid lg:grid-cols-12 relative overflow-hidden font-[family-name:var(--font-body)]">
      
      {/* ════════════════════════════════════════════════
          LEFT HERO VISUAL SIDE (Hidden on mobile, 5 cols on lg, 6 cols on xl)
      ════════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 relative flex-col justify-between p-12 overflow-hidden border-r border-[var(--border)]">
        
        {/* Background Image & Glow */}
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

        {/* Middle Hero Content */}
        <div className="relative z-10 my-auto max-w-lg space-y-8">
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--brand)]/15 border border-[var(--border-brand)] text-[var(--brand)] text-xs font-semibold">
              <Radio size={13} className="animate-pulse" />
              <span>Join the Musify Community</span>
            </div>
            
            <h2 className="text-4xl xl:text-5xl font-bold tracking-tight text-white leading-tight font-[family-name:var(--font-display)]">
              Your Sound. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand)] via-indigo-300 to-purple-400">
                Your Personal Space.
              </span>
            </h2>
            <p className="text-base text-[var(--text-secondary)] font-light leading-relaxed">
              Create your free account today to build custom playlists, stream high-fidelity audio, and save your liked tracks across all devices.
            </p>
          </div>

          {/* Feature Showcase Box */}
          <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-2xl shadow-2xl space-y-3">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-xl font-bold text-white">100%</p>
                <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-0.5">Free Access</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-xl font-bold text-[var(--brand)]">Unlimited</p>
                <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-0.5">Playlists</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-xl font-bold text-emerald-400">HD</p>
                <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-0.5">Audio Quality</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" /> Instant Setup
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[var(--brand)]" /> Secure & Encrypted
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-400" /> YouTube Sync
              </span>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="relative z-10 pt-6 border-t border-white/5 text-xs text-[var(--text-muted)] flex items-center justify-between">
          <span>© {new Date().getFullYear()} Musify Inc.</span>
          <span>Privacy Guaranteed</span>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          RIGHT FORM CONTAINER (7 cols on lg, 6 cols on xl)
      ════════════════════════════════════════════════ */}
      <div className="flex-1 lg:col-span-7 xl:col-span-6 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10 overflow-y-auto">
        
        {/* Mobile Header Logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[var(--brand)] flex items-center justify-center text-white shrink-0 shadow-[0_0_24px_rgba(124,111,224,0.3)]">
            <Music2 size={20} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl tracking-tight text-[var(--text-primary)] font-[family-name:var(--font-display)]">
            Musify
          </span>
        </div>

        {/* Registration Card */}
        <div className="w-full max-w-md space-y-6 bg-[var(--bg-surface)]/80 backdrop-blur-2xl border border-[var(--border)] rounded-3xl p-8 sm:p-10 shadow-[0_16px_48px_rgba(0,0,0,0.6)] relative overflow-hidden">
          
          {/* Header */}
          <div className="space-y-1.5 text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] font-[family-name:var(--font-display)]">
              Create your account
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Start streaming your favorite music in seconds.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm animate-shake">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5 animate-ping" />
              <p className="flex-1 text-xs leading-relaxed">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User size={17} className="absolute left-3.5 text-[var(--text-muted)] pointer-events-none" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="
                    w-full pl-10 pr-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border)]
                    rounded-2xl text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)]
                    outline-none transition-all duration-200
                    focus:border-[var(--brand)] focus:shadow-[0_0_0_4px_rgba(124,111,224,0.15)]
                  "
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail size={17} className="absolute left-3.5 text-[var(--text-muted)] pointer-events-none" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
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
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock size={17} className="absolute left-3.5 text-[var(--text-muted)] pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
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

              {/* Strength meter */}
              {form.password && (
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex flex-1 gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ background: i <= strength ? strengthColor : "var(--bg-elevated)" }}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold min-w-[40px] text-right" style={{ color: strengthColor }}>
                    {strengthLabel}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <Lock size={17} className="absolute left-3.5 text-[var(--text-muted)] pointer-events-none" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  required
                  className="
                    w-full pl-10 pr-10 py-3 bg-[var(--bg-elevated)] border border-[var(--border)]
                    rounded-2xl text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)]
                    outline-none transition-all duration-200
                    focus:border-[var(--brand)] focus:shadow-[0_0_0_4px_rgba(124,111,224,0.15)]
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Terms Disclaimer */}
            <p className="text-xs text-[var(--text-muted)] leading-relaxed pt-1">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-[var(--brand)] font-medium hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[var(--brand)] font-medium hover:underline">
                Privacy Policy
              </Link>.
            </p>

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
                  <span>Creating Account…</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">
              Or sign up with
            </span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          {/* Google Sign Up Button */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="
              w-full flex items-center justify-center gap-3 px-4 py-3
              bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl
              text-[var(--text-primary)] text-sm font-semibold
              transition-all duration-200 hover:border-[var(--border-hover)] hover:bg-[var(--bg-elevated)]/80
              hover:shadow-lg active:scale-[0.99]
            "
          >
            <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Sign In Link */}
          <div className="pt-4 border-t border-[var(--border)] text-center text-sm text-[var(--text-secondary)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[var(--brand)] font-bold hover:text-[var(--brand-light)] transition-colors underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}