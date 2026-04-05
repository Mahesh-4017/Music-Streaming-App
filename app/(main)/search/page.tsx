// app/(main)/search/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Play, Music2, User, Disc3 } from "lucide-react";
import type { Metadata } from "next";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SearchResult {
  id:        string;
  title:     string;
  subtitle:  string;
  thumbnail: string;
  type:      "song" | "artist" | "album";
}

// ─── Static data (replace with API) ──────────────────────────────────────────
const GENRES = [
  { id: "pop",       label: "Pop",        color: "#7C6FE0", bg: "rgba(124,111,224,.15)" },
  { id: "hiphop",    label: "Hip-Hop",    color: "#E07C9F", bg: "rgba(224,124,159,.15)" },
  { id: "rnb",       label: "R&B",        color: "#7CB8E0", bg: "rgba(124,184,224,.15)" },
  { id: "rock",      label: "Rock",       color: "#E0A87C", bg: "rgba(224,168,124,.15)" },
  { id: "jazz",      label: "Jazz",       color: "#7CE0B8", bg: "rgba(124,224,184,.15)" },
  { id: "edm",       label: "EDM",        color: "#C07CE0", bg: "rgba(192,124,224,.15)" },
  { id: "classical", label: "Classical",  color: "#E0D07C", bg: "rgba(224,208,124,.15)" },
  { id: "latin",     label: "Latin",      color: "#E07C7C", bg: "rgba(224,124,124,.15)" },
  { id: "country",   label: "Country",    color: "#A8E07C", bg: "rgba(168,224,124,.15)" },
  { id: "metal",     label: "Metal",      color: "#8E8E8E", bg: "rgba(142,142,142,.15)" },
  { id: "indie",     label: "Indie",      color: "#7CE0D0", bg: "rgba(124,224,208,.15)" },
  { id: "kpop",      label: "K-Pop",      color: "#E07CC0", bg: "rgba(224,124,192,.15)" },
] as const;

const MOCK_RESULTS: SearchResult[] = [
  { id:"1", title:"Blinding Lights",   subtitle:"The Weeknd",     thumbnail:"https://picsum.photos/seed/r1/80/80",  type:"song"   },
  { id:"2", title:"Levitating",         subtitle:"Dua Lipa",       thumbnail:"https://picsum.photos/seed/r2/80/80",  type:"song"   },
  { id:"3", title:"The Weeknd",         subtitle:"57M followers",  thumbnail:"https://picsum.photos/seed/r3/80/80",  type:"artist" },
  { id:"4", title:"After Hours",        subtitle:"The Weeknd",     thumbnail:"https://picsum.photos/seed/r4/80/80",  type:"album"  },
  { id:"5", title:"Stay",               subtitle:"The Kid LAROI",  thumbnail:"https://picsum.photos/seed/r5/80/80",  type:"song"   },
  { id:"6", title:"Good 4 U",           subtitle:"Olivia Rodrigo", thumbnail:"https://picsum.photos/seed/r6/80/80",  type:"song"   },
];

const TYPE_ICON = {
  song:   Music2,
  artist: User,
  album:  Disc3,
} as const;

// ─── Result Row ───────────────────────────────────────────────────────────────
function ResultRow({ result }: { result: SearchResult }) {
  const Icon = TYPE_ICON[result.type];
  const href =
    result.type === "song"   ? `/song/${result.id}`   :
    result.type === "artist" ? `/artist/${result.id}` :
    `/album/${result.id}`;

  return (
    <Link
      href={href}
      className="
        flex items-center gap-3 px-4 py-2.5
        rounded-[var(--radius-md)]
        hover:bg-[var(--bg-elevated)]
        transition-colors group
      "
    >
      <div className="relative w-11 h-11 flex-shrink-0">
        <Image
          src={result.thumbnail}
          alt={result.title}
          fill
          className={`object-cover bg-[var(--bg-elevated)] ${result.type === "artist" ? "rounded-full" : "rounded-[var(--radius-md)]"}`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)] truncate">
          {result.title}
        </p>
        <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
          {result.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="badge badge-brand flex items-center gap-1">
          <Icon size={10} />
          {result.type}
        </span>
        <button
          className="
            btn-icon w-8 h-8 opacity-0
            group-hover:opacity-100
            transition-opacity
          "
          onClick={(e) => { e.preventDefault(); /* TODO: play */ }}
        >
          <Play size={13} />
        </button>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SearchPage() {
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => { inputRef.current?.focus(); }, []);

  // Debounced search
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (query.trim().length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      // TODO: replace with real API → const data = await searchService.search(query);
      await new Promise(r => setTimeout(r, 400));
      setResults(MOCK_RESULTS.filter(r =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.subtitle.toLowerCase().includes(query.toLowerCase())
      ));
      setLoading(false);
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  const showGenres  = query.trim().length < 2;
  const showResults = query.trim().length >= 2;

  return (
    <div className="container py-8 animate-fade-in">

      {/* ── Search input ── */}
      <div className="max-w-xl mb-10">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
          Search
        </h1>
        <div
          className="
            flex items-center gap-3
            bg-[var(--bg-elevated)]
            border border-[var(--border)]
            rounded-[var(--radius-full)]
            px-5 py-3
            focus-within:border-[var(--border-brand)]
            focus-within:shadow-[0_0_0_3px_rgba(124,111,224,0.15)]
            transition-all
          "
        >
          <Search size={16} className="text-[var(--text-muted)] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            placeholder="Search songs, artists, albums…"
            onChange={e => setQuery(e.target.value)}
            className="
              flex-1 bg-transparent text-sm
              text-[var(--text-primary)]
              placeholder:text-[var(--text-muted)]
              outline-none
            "
          />
          {query && (
            <button
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] flex-shrink-0"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* ── Browse genres (empty state) ── */}
      {showGenres && (
        <section>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4">
            Browse by genre
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 stagger">
            {GENRES.map(g => (
              <Link
                key={g.id}
                href={`/genre/${g.id}`}
                className="
                  flex items-center justify-center
                  h-16 rounded-[var(--radius-lg)]
                  border border-[var(--border)]
                  text-sm font-semibold
                  transition-all duration-[var(--duration-base)]
                  hover:scale-105 hover:border-[var(--border-hover)]
                  animate-fade-in
                "
                style={{ background: g.bg, color: g.color }}
              >
                {g.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Results ── */}
      {showResults && (
        <section>
          <p className="label-overline mb-4">
            {loading ? "Searching…" : `Results for "${query}"`}
          </p>

          {loading ? (
            <div className="space-y-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="skeleton w-11 h-11 rounded-[var(--radius-md)] flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-3 w-1/2 rounded" />
                    <div className="skeleton h-2.5 w-1/3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-4xl mb-4">🎵</p>
              <p className="text-[var(--text-muted)] text-sm">
                No results for &quot;{query}&quot;
              </p>
            </div>
          ) : (
            <div className="space-y-1 stagger">
              {results.map(r => <ResultRow key={r.id} result={r} />)}
            </div>
          )}
        </section>
      )}
    </div>
  );
}