"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Settings,
  LogOut,
  User,
  ListMusic,
  X,
  Music2,
  Home,
  Library,
  Heart,
  Upload,
} from "lucide-react";

// ─── Greeting ─────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good Morning",   emoji: "☀️" };
  if (h < 18) return { text: "Good Afternoon", emoji: "🌤️" };
  if (h < 22) return { text: "Good Evening",   emoji: "🌙" };
  return       { text: "Good Night",           emoji: "🌙" };
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface SearchResult {
  id:        string;
  title:     string;
  artist:    string;
  thumbnail: string;
  type:      "song" | "album" | "artist";
}

// ─── Search Dropdown ──────────────────────────────────────────────────────────
function SearchDropdown({
  query,
  results,
  loading,
  onClose,
  onSelect,
}: {
  query:    string;
  results:  SearchResult[];
  loading:  boolean;
  onClose:  () => void;
  onSelect: (r: SearchResult) => void;
}) {
  if (query.trim().length < 2) return null;

  return (
    <div
      className="
        absolute top-full left-0 right-0 mt-2
        bg-[var(--bg-surface)] border border-[var(--border)]
        rounded-[var(--radius-lg)] overflow-hidden
        shadow-[var(--shadow-lg)] animate-fade-in-scale
      "
      style={{ zIndex: "var(--z-modal)" as string }}
    >
      {loading ? (
        <div className="p-4 flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="skeleton w-10 h-10 rounded-[var(--radius-md)] flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="skeleton h-3 w-3/4 rounded-full" />
                <div className="skeleton h-2.5 w-1/2 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No results for &ldquo;{query}&rdquo;
          </p>
        </div>
      ) : (
        <>
          <div
            className="px-4 py-2 border-b border-[var(--border)]"
            style={{ color: "var(--text-muted)" }}
          >
            <span className="label-overline">Results</span>
          </div>
          <div className="flex flex-col">
            {results.map((r) => (
              <button
                key={r.id}
                onClick={() => onSelect(r)}
                className="
                  flex items-center gap-3 px-4 py-2.5 text-left
                  transition-colors hover:bg-[var(--bg-elevated)]
                "
              >
                <div className="w-10 h-10 rounded-[var(--radius-md)] overflow-hidden flex-shrink-0 bg-[var(--bg-elevated)]">
                  <Image
                    src={r.thumbnail}
                    alt={r.title}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {r.title}
                  </p>
                  <p
                    className="text-xs truncate mt-0.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {r.artist}
                  </p>
                </div>
                <span className="badge badge-brand text-[10px] flex-shrink-0 px-2 py-0.5">
                  {r.type}
                </span>
              </button>
            ))}
          </div>
          <Link
            href={`/search?q=${encodeURIComponent(query)}`}
            onClick={onClose}
            className="
              flex items-center justify-center gap-1.5
              py-3 text-xs font-medium
              border-t border-[var(--border)]
              transition-colors hover:bg-[var(--bg-elevated)]
            "
            style={{ color: "var(--brand)" }}
          >
            <Search size={12} />
            View all results for &ldquo;{query}&rdquo;
          </Link>
        </>
      )}
    </div>
  );
}

// ─── User Menu ────────────────────────────────────────────────────────────────
function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref             = useRef<HTMLDivElement>(null);
  const router          = useRouter();

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // TODO: replace with real session / auth store
  const user     = { name: "Ahmed Khan", email: "ahmed@example.com" };
  const initials = user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  const menuItems = [
    { icon: User,      label: "Profile",   href: "/profile"  },
    { icon: ListMusic, label: "Playlists", href: "/playlist" },
    { icon: Settings,  label: "Settings",  href: "/settings" },
  ];

  const handleLogout = () => {
    setOpen(false);
    // TODO: call your actual signOut() here, e.g. signOut({ callbackUrl: "/login" })
    router.push("/login");
  };

  return (
    <div ref={ref} className="relative">
      {/* ── Avatar pill ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          flex items-center gap-2 pl-1 pr-3 py-1
          rounded-[var(--radius-full)]
          border border-[var(--border)]
          transition-all hover:border-[var(--border-hover)] hover:bg-[var(--bg-elevated)]
        "
      >
        <div
          className="
            w-7 h-7 rounded-full flex items-center justify-center
            text-[11px] font-semibold text-white flex-shrink-0
          "
          style={{ background: "var(--brand)" }}
        >
          {initials}
        </div>
        <span
          className="text-xs font-medium hidden xl:block max-w-[80px] truncate"
          style={{ color: "var(--text-secondary)" }}
        >
          {user.name.split(" ")[0]}
        </span>
        <ChevronRight
          size={12}
          className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`}
          style={{ color: "var(--text-muted)" }}
        />
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div
          className="
            absolute right-0 top-11 w-52
            bg-[var(--bg-surface)] border border-[var(--border)]
            rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)]
            overflow-hidden animate-fade-in-scale
          "
          style={{ zIndex: "var(--z-modal)" as string }}
        >
          {/* User info */}
          <div className="px-4 py-3 border-b border-[var(--border)]">
            <p
              className="text-sm font-semibold truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {user.name}
            </p>
            <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
              {user.email}
            </p>
          </div>

          {/* Nav items */}
          <div className="py-1">
            {menuItems.map(({ icon: Icon, label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="
                  flex items-center gap-3 px-4 py-2.5 text-sm
                  transition-colors hover:bg-[var(--bg-elevated)]
                "
                style={{ color: "var(--text-secondary)" }}
              >
                <Icon size={15} style={{ color: "var(--text-muted)" }} />
                {label}
              </Link>
            ))}
          </div>

          {/* Sign out */}
          <div className="border-t border-[var(--border)] py-1">
            <button
              onClick={handleLogout}
              className="
                w-full flex items-center gap-3 px-4 py-2.5 text-sm
                text-red-400 transition-colors hover:bg-red-500/10
              "
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Notifications Bell ───────────────────────────────────────────────────────
function NotificationsBell() {
  const [open,  setOpen]  = useState(false);
  const [count]           = useState(3); // TODO: from API
  const ref               = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn-icon relative"
        aria-label="Notifications"
      >
        <Bell size={16} />
        {count > 0 && (
          <span
            className="
              absolute -top-0.5 -right-0.5
              w-4 h-4 rounded-full
              text-[9px] font-bold text-white
              flex items-center justify-center
            "
            style={{ background: "var(--brand)" }}
          >
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div
          className="
            absolute right-0 top-11 w-72
            bg-[var(--bg-surface)] border border-[var(--border)]
            rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)]
            overflow-hidden animate-fade-in-scale
          "
          style={{ zIndex: "var(--z-modal)" as string }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Notifications
            </span>
            <button
              onClick={() => setOpen(false)}
              className="transition-colors hover:opacity-70"
              style={{ color: "var(--text-muted)" }}
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
          <div className="py-10 text-center text-sm" style={{ color: "var(--text-muted)" }}>
            🔔 You&apos;re all caught up!
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Mobile bottom nav ────────────────────────────────────────────────────────
const MOBILE_NAV = [
  { href: "/",           icon: Home,    label: "Home"    },
  { href: "/search",     icon: Search,  label: "Search"  },
  { href: "/library",    icon: Library, label: "Library" },
  { href: "/liked-songs",icon: Heart,   label: "Liked"   },
  { href: "/upload",     icon: Upload,  label: "Upload"  },
] as const;

function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="
        lg:hidden fixed bottom-0 left-0 right-0
        flex items-center justify-around
        px-2 pb-safe
        border-t border-[var(--border)]
        backdrop-blur-xl
      "
      style={{
        background: "var(--bg-overlay)",
        zIndex: "var(--z-navbar)" as string,
        height: "var(--nav-height-mobile)",
      }}
    >
      {MOBILE_NAV.map(({ href, icon: Icon, label }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-[var(--radius-md)] transition-all"
            style={{ color: active ? "var(--brand)" : "var(--text-muted)" }}
          >
            <Icon
              size={20}
              strokeWidth={active ? 2.5 : 1.75}
            />
            <span
              className="text-[10px] font-medium"
              style={{ color: active ? "var(--brand)" : "var(--text-muted)" }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const router  = useRouter();
  const greeting = getGreeting();

  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // Close search on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // Debounced live search
  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        // TODO: replace with your real API call
        // const data = await fetch(`/api/search?q=${encodeURIComponent(query)}`).then(r => r.json());
        // setResults(data.results);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  // ⌘K shortcut
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setFocused(true);
      }
      if (e.key === "Escape") {
        setFocused(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  const handleSelect = (result: SearchResult) => {
    setFocused(false);
    setQuery("");
    router.push(`/${result.type}/${result.id}`);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      setFocused(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <>
      {/* ════════════════════════════════════════════════
          MOBILE top bar  (< lg)
      ════════════════════════════════════════════════ */}
      <header
        className="
          lg:hidden flex items-center justify-between
          px-5 sticky top-0
          border-b border-[var(--border)]
          backdrop-blur-xl
        "
        style={{
          height: "48px",
          background: "var(--bg-overlay)",
          zIndex: "var(--z-navbar)" as string,
        }}
      >
        {/* Logo + greeting */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--brand)" }}
          >
            <Music2 size={14} className="text-white" strokeWidth={2} />
          </div>
          <div>
            <p className="text-[11px] font-semibold leading-none" style={{ color: "var(--text-primary)" }}>
              {greeting.text} {greeting.emoji}
            </p>
          </div>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => router.push("/search")}
            className="btn-icon w-8 h-8"
            aria-label="Search"
          >
            <Search size={16} />
          </button>
          <button
            onClick={() => router.push("/settings")}
            className="btn-icon w-8 h-8"
            aria-label="Settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </header>

      {/* ════════════════════════════════════════════════
          DESKTOP top bar  (≥ lg)
      ════════════════════════════════════════════════ */}
      <header
        className="
          hidden lg:flex items-center gap-4
          sticky top-0
          border-b border-[var(--border)]
          backdrop-blur-xl
          px-6
        "
        style={{
          height: "56px",
          background: "var(--bg-overlay)",
          zIndex: "var(--z-navbar)" as string,
        }}
      >
        {/* ── Back / Forward ── */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => router.back()}
            className="btn-icon w-8 h-8"
            aria-label="Go back"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => router.forward()}
            className="btn-icon w-8 h-8"
            aria-label="Go forward"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* ── Search bar ── */}
        <div ref={searchRef} className="relative flex-1 max-w-sm">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-full)] border transition-all duration-200"
            style={{
              background: "var(--bg-elevated)",
              borderColor: focused ? "var(--border-brand)" : "var(--border)",
              boxShadow: focused ? "0 0 0 3px rgba(124,111,224,0.15)" : "none",
            }}
          >
            <Search size={14} className="flex-shrink-0" style={{ color: "var(--text-muted)" }} />

            <input
              ref={inputRef}
              type="text"
              value={query}
              placeholder="Search songs, artists, albums…"
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onKeyDown={handleSearchKeyDown}
              className="flex-1 bg-transparent text-sm outline-none"
              style={{
                color: "var(--text-primary)",
              }}
            />

            {query ? (
              <button
                onClick={clearSearch}
                className="flex-shrink-0 transition-opacity hover:opacity-70"
                style={{ color: "var(--text-muted)" }}
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            ) : (
              !focused && (
                <kbd
                  className="hidden xl:flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded font-mono flex-shrink-0 border"
                  style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}
                >
                  ⌘K
                </kbd>
              )
            )}
          </div>

          {/* Search results dropdown */}
          {focused && (
            <SearchDropdown
              query={query}
              results={results}
              loading={loading}
              onClose={() => setFocused(false)}
              onSelect={handleSelect}
            />
          )}
        </div>

        {/* ── Right actions ── */}
        <div className="ml-auto flex items-center gap-2 flex-shrink-0">
          <NotificationsBell />
          <UserMenu />
        </div>
      </header>

      {/* ════════════════════════════════════════════════
          MOBILE bottom nav  (< lg)
      ════════════════════════════════════════════════ */}
      <MobileNav />
    </>
  );
}