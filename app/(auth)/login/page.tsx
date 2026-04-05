"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setError("Invalid email or password. Please try again.");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

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

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to continue listening</p>

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

        {/* Google button — outside the form, type="button" prevents form submit */}
        <button
          type="button"
          className="auth-google-btn"
          onClick={handleGoogle}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <span className="auth-spinner" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          Continue with Google
        </button>

        <div className="auth-divider"><span>or sign in with email</span></div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              type="email"
              className="auth-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <div className="auth-label-row">
              <label className="auth-label">Password</label>
              <Link href="/forgot-password" className="auth-link-small">Forgot password?</Link>
            </div>
            <input
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <><span className="auth-spinner" /> Signing in…</>
            ) : "Sign in"}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="auth-link">Create one</Link>
        </p>
      </div>

      <style>{authStyles}</style>
    </div>
  );
}

const authStyles = `
  .auth-page {
    min-height: 100dvh; display: flex; align-items: center; justify-content: center;
    padding: 1.5rem; position: relative; background: var(--bg-base); overflow: hidden;
  }
  .auth-glow {
    position: fixed; inset: 0; pointer-events: none;
    background-image:
      radial-gradient(ellipse 70% 50% at 15% 15%, rgba(124,111,224,.13) 0%, transparent 60%),
      radial-gradient(ellipse 55% 40% at 85% 80%, rgba(124,111,224,.09) 0%, transparent 60%),
      repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(255,255,255,.022) 79px,rgba(255,255,255,.022) 80px),
      repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(255,255,255,.022) 79px,rgba(255,255,255,.022) 80px);
  }
  .auth-card {
    position: relative; width: 100%; max-width: 420px;
    background: var(--bg-surface); border: 1px solid var(--border);
    border-radius: var(--radius-xl); padding: 2.5rem;
    box-shadow: var(--shadow-lg), 0 0 80px rgba(124,111,224,.07);
  }
  .auth-logo { display:flex; align-items:center; gap:10px; margin-bottom:2rem; }
  .auth-logo-icon {
    width:42px; height:42px; background:var(--brand); border-radius:var(--radius-md);
    display:flex; align-items:center; justify-content:center; color:#fff;
    flex-shrink:0; box-shadow:var(--shadow-brand);
  }
  .auth-logo-text {
    font-family:var(--font-display); font-size:1.375rem; font-weight:700;
    color:var(--text-primary); letter-spacing:-0.02em;
  }
  .auth-title { font-size:1.5rem; margin-bottom:0.25rem; }
  .auth-subtitle { color:var(--text-secondary); font-size:0.9rem; margin-bottom:1.5rem; line-height:1.5; }
  .auth-error {
    display:flex; align-items:center; gap:8px; padding:0.75rem 1rem; margin-bottom:1rem;
    background:rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.25);
    border-radius:var(--radius-md); color:#f87171; font-size:0.85rem;
  }
  .auth-google-btn {
    width:100%; display:flex; align-items:center; justify-content:center; gap:10px;
    padding:0.7rem 1rem; background:var(--bg-elevated); border:1px solid var(--border);
    border-radius:var(--radius-md); color:var(--text-primary); font-family:var(--font-body);
    font-size:0.9rem; font-weight:500; cursor:pointer;
    transition:all var(--duration-fast) var(--ease); margin-bottom:1.25rem;
  }
  .auth-google-btn:hover:not(:disabled) { background:var(--bg-elevated); border-color:var(--border-hover); }
  .auth-google-btn:disabled { opacity:0.6; cursor:not-allowed; }
  .auth-divider { display:flex; align-items:center; gap:12px; margin-bottom:1.25rem; }
  .auth-divider::before,.auth-divider::after { content:""; flex:1; height:1px; background:var(--border); }
  .auth-divider span { font-size:0.75rem; color:var(--text-muted); white-space:nowrap; }
  .auth-form { display:flex; flex-direction:column; gap:1rem; }
  .auth-field { display:flex; flex-direction:column; gap:6px; }
  .auth-label-row { display:flex; align-items:center; justify-content:space-between; }
  .auth-label { font-size:0.8125rem; font-weight:500; color:var(--text-secondary); }
  .auth-link-small { font-size:0.75rem; color:var(--brand); transition:color var(--duration-fast) var(--ease); }
  .auth-link-small:hover { color:var(--brand-dark); }
  .auth-input {
    width:100%; padding:0.7rem 0.875rem; background:var(--bg-elevated);
    border:1px solid var(--border); border-radius:var(--radius-md); color:var(--text-primary);
    font-family:var(--font-body); font-size:0.9rem; outline:none;
    transition:border-color var(--duration-fast) var(--ease), box-shadow var(--duration-fast) var(--ease);
  }
  .auth-input::placeholder { color:var(--text-muted); }
  .auth-input:focus { border-color:var(--brand); box-shadow:0 0 0 3px rgba(124,111,224,.15); }
  .auth-submit-btn {
    margin-top:0.25rem; width:100%; padding:0.75rem; background:var(--brand); color:white;
    border:none; border-radius:var(--radius-md); font-family:var(--font-body);
    font-size:0.9375rem; font-weight:600; cursor:pointer;
    display:flex; align-items:center; justify-content:center; gap:8px;
    transition:background var(--duration-fast) var(--ease), transform var(--duration-fast);
  }
  .auth-submit-btn:hover:not(:disabled) { background:var(--brand-dark); }
  .auth-submit-btn:active:not(:disabled) { transform:scale(.98); }
  .auth-submit-btn:disabled { opacity:0.6; cursor:not-allowed; }
  .auth-spinner {
    display:inline-block; width:15px; height:15px; flex-shrink:0;
    border:2px solid rgba(255,255,255,.3); border-top-color:white;
    border-radius:50%; animation:auth-spin 0.8s linear infinite;
  }
  .auth-footer { text-align:center; margin-top:1.5rem; font-size:0.875rem; color:var(--text-secondary); }
  .auth-link { color:var(--brand); font-weight:500; transition:color var(--duration-fast) var(--ease); }
  .auth-link:hover { color:var(--brand-dark); }
  @keyframes auth-spin { to { transform: rotate(360deg); } }
`;