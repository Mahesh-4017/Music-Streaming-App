"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Music2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    // Simulate sending reset request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
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
            alt="Musify Security"
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

        {/* Middle Floating Card */}
        <div className="relative z-10 my-auto max-w-lg space-y-8">
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--brand)]/15 border border-[var(--border-brand)] text-[var(--brand)] text-xs font-semibold">
              <KeyRound size={13} />
              <span>Account Recovery Protocol</span>
            </div>
            
            <h2 className="text-4xl xl:text-5xl font-bold tracking-tight text-white leading-tight font-[family-name:var(--font-display)]">
              Secure Recovery. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand)] via-indigo-300 to-purple-400">
                Instant Access.
              </span>
            </h2>
            <p className="text-base text-[var(--text-secondary)] font-light leading-relaxed">
              We&apos;ll help you regain access to your account and saved music library in just a few clicks.
            </p>
          </div>

          {/* Security Features Card */}
          <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-2xl shadow-2xl space-y-3">
            <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] font-medium">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck size={16} />
              </div>
              <div>
                <p className="font-bold text-white">End-to-End Encryption</p>
                <p className="text-[11px] text-[var(--text-muted)]">Your reset link is single-use and time-sensitive.</p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[var(--brand)]" /> Secure Tokens
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-400" /> Fast Delivery
              </span>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="relative z-10 pt-6 border-t border-white/5 text-xs text-[var(--text-muted)] flex items-center justify-between">
          <span>© {new Date().getFullYear()} Musify Inc.</span>
          <span>Security Center</span>
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

        {/* Forgot Password Card */}
        <div className="w-full max-w-md space-y-6 bg-[var(--bg-surface)]/80 backdrop-blur-2xl border border-[var(--border)] rounded-3xl p-8 sm:p-10 shadow-[0_16px_48px_rgba(0,0,0,0.6)] relative overflow-hidden">
          
          {submitted ? (
            /* ── Success State ── */
            <div className="space-y-6 text-center animate-fade-in py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_24px_rgba(16,185,129,0.2)]">
                <CheckCircle2 size={32} />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-display)]">
                  Check your inbox
                </h2>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  We sent password reset instructions to:
                </p>
                <p className="text-sm font-bold text-[var(--brand)] bg-[var(--brand)]/10 px-3 py-1.5 rounded-xl inline-block">
                  {email}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border)] space-y-3">
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] underline transition-colors"
                >
                  Didn&apos;t receive an email? Try again
                </button>
                <div>
                  <Link
                    href="/login"
                    className="
                      inline-flex items-center justify-center gap-2 w-full py-3
                      bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl
                      text-[var(--text-primary)] text-sm font-semibold hover:border-[var(--border-hover)]
                      transition-all duration-200
                    "
                  >
                    <ArrowLeft size={16} />
                    <span>Return to Sign In</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* ── Initial Form State ── */
            <>
              <div className="space-y-1.5 text-center sm:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] font-[family-name:var(--font-display)]">
                  Reset Password
                </h1>
                <p className="text-sm text-[var(--text-secondary)]">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm animate-shake">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5 animate-ping" />
                  <p className="flex-1 text-xs leading-relaxed">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail size={17} className="absolute left-3.5 text-[var(--text-muted)] pointer-events-none" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      <span>Sending link…</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>

              {/* Back to Login Link */}
              <div className="pt-4 border-t border-[var(--border)] text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </>
          )}

        </div>

      </div>

    </div>
  );
}
