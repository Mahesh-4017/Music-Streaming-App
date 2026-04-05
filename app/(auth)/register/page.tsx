"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords don't match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message || "Registration failed.");
      return;
    }

    // Auto sign-in after register
    await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });
    router.push("/");
  };

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
    <div className="auth-page">
      <div className="auth-glow" />

      <div className="auth-card animate-fade-in-scale">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M9 18V6l12-2v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2"/>
              <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <span className="auth-logo-text">Musify</span>
        </div>

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Start your music journey today</p>

        {error && (
          <div className="auth-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Full name</label>
            <input
              type="text"
              className="auth-input"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              type="email"
              className="auth-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              type="password"
              className="auth-input"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            {form.password && (
              <div className="strength-bar">
                <div className="strength-track">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="strength-segment"
                      style={{ background: i <= strength ? strengthColor : "var(--bg-elevated)" }}
                    />
                  ))}
                </div>
                <span className="strength-label" style={{ color: strengthColor }}>{strengthLabel}</span>
              </div>
            )}
          </div>

          <div className="auth-field">
            <label className="auth-label">Confirm password</label>
            <input
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              required
            />
          </div>

          <p className="auth-terms">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="auth-link">Terms</Link> and{" "}
            <Link href="/privacy" className="auth-link">Privacy Policy</Link>.
          </p>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" />
                Creating account…
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <button
          className="btn btn-ghost auth-google"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link href="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}