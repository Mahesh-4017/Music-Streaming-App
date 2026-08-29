// app/(main)/search/page.tsx
"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  X,
  Play,
  Pause,
  Music2,
  User,
  Disc3,
  Heart,
  Sparkles,
  Filter,
} from "lucide-react";
import { usePlayerStore, Track } from "@/store/playerStore";
import { useLikedStore } from "@/store/likedStore";
import {
  GENRES,
  CATALOG_TRACKS,
  ARTISTS,
  ALBUMS,
  ArtistItem,
  AlbumItem,
} from "@/lib/catalog";

function YoutubeIcon({ size = 10, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

type CategoryFilter = "all" | "songs" | "artists" | "albums";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlQuery = searchParams?.get("q") || "";
  const urlGenre = searchParams?.get("genre") || "";

  const [query, setQuery] = useState(urlQuery || (urlGenre ? `genre:${urlGenre}` : ""));
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [selectedGenreFilter, setSelectedGenreFilter] = useState<string>(urlGenre);

  const [userSongs, setUserSongs] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayerStore();
  const { isLiked, toggleLike } = useLikedStore();

  useEffect(() => {
    setMounted(true);

    // Fetch user created/added playlist songs to include in search
    fetch("/api/songs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const mapped: Track[] = data.data.map((s: any) => ({
            id: s._id,
            title: s.title,
            artist: s.artist,
            audioUrl: s.audioUrl,
            thumbnail: s.thumbnailUrl || "/assets/images/default-song.png",
            type: s.type || "youtube",
            duration: s.duration || 180,
          }));
          setUserSongs(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Update query when URL params change
  useEffect(() => {
    if (urlGenre) {
      setSelectedGenreFilter(urlGenre);
      setQuery(`genre:${urlGenre}`);
    } else if (urlQuery) {
      setQuery(urlQuery);
    }
  }, [urlQuery, urlGenre]);

  const allAvailableTracks = [...userSongs, ...CATALOG_TRACKS];

  // Combine search results
  const trimmed = query.trim().toLowerCase();
  const isGenreSearch = trimmed.startsWith("genre:");
  const activeGenreId = isGenreSearch ? trimmed.replace("genre:", "").trim() : selectedGenreFilter;

  const filteredSongs = allAvailableTracks.filter((track) => {
    if (activeGenreId && !trimmed.replace(`genre:${activeGenreId}`, "").trim()) {
      return (track as any).genre?.toLowerCase() === activeGenreId;
    }
    const searchTerm = isGenreSearch ? trimmed.replace(`genre:${activeGenreId}`, "").trim() : trimmed;
    if (!searchTerm) return true;

    return (
      track.title.toLowerCase().includes(searchTerm) ||
      (track.artist && track.artist.toLowerCase().includes(searchTerm)) ||
      (track.album && track.album.toLowerCase().includes(searchTerm))
    );
  });

  const filteredArtists = ARTISTS.filter((art) => {
    if (activeGenreId) return art.genre === activeGenreId;
    if (!trimmed) return true;
    return art.name.toLowerCase().includes(trimmed);
  });

  const filteredAlbums = ALBUMS.filter((alb) => {
    if (activeGenreId) return alb.genre === activeGenreId;
    if (!trimmed) return true;
    return (
      alb.title.toLowerCase().includes(trimmed) ||
      alb.artist.toLowerCase().includes(trimmed)
    );
  });

  const hasSearchInput = query.trim().length > 0;
  const topSong = filteredSongs.length > 0 ? filteredSongs[0] : null;

  const handlePlaySong = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, filteredSongs);
    }
  };

  const handleSelectGenre = (genreId: string) => {
    setSelectedGenreFilter(genreId);
    setQuery(`genre:${genreId}`);
    router.push(`/search?genre=${genreId}`);
  };

  const clearSearch = () => {
    setQuery("");
    setSelectedGenreFilter("");
    router.push("/search");
    inputRef.current?.focus();
  };

  return (
    <div className="container py-8 animate-fade-in pb-20">
      {/* ── Search Input & Header ── */}
      <div className="max-w-2xl mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <Search size={28} className="text-[var(--brand)]" /> Search & Discover
        </h1>

        <div
          className="
            flex items-center gap-3
            bg-[var(--bg-elevated)]
            border border-[var(--border)]
            rounded-[var(--radius-full)]
            px-5 py-3.5
            focus-within:border-[var(--brand)]
            focus-within:shadow-[0_0_0_3px_rgba(124,111,224,0.2)]
            transition-all shadow-md
          "
        >
          <Search size={18} className="text-[var(--text-muted)] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            placeholder="Search songs, artists, albums, or genre:pop..."
            onChange={(e) => {
              setQuery(e.target.value);
              if (selectedGenreFilter) setSelectedGenreFilter("");
            }}
            className="
              flex-1 bg-transparent text-sm sm:text-base
              text-[var(--text-primary)]
              placeholder:text-[var(--text-muted)]
              outline-none
            "
          />
          {query && (
            <button
              onClick={clearSearch}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-full hover:bg-white/10 flex-shrink-0"
              title="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
          {(["all", "songs", "artists", "albums"] as CategoryFilter[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all border shrink-0
                ${
                  selectedCategory === cat
                    ? "bg-[var(--brand)] text-white border-[var(--brand)] shadow-sm"
                    : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--border-hover)]"
                }
              `}
            >
              {cat}
            </button>
          ))}

          {selectedGenreFilter && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1 shrink-0">
              Genre: {selectedGenreFilter}
              <X size={12} className="cursor-pointer" onClick={clearSearch} />
            </span>
          )}
        </div>
      </div>

      {/* ── Active Search Results ── */}
      {hasSearchInput ? (
        <div className="space-y-10">
          {/* Top Result Card */}
          {topSong && (selectedCategory === "all" || selectedCategory === "songs") && (
            <section className="animate-fade-in">
              <p className="label-overline mb-3 text-xs font-bold uppercase tracking-wider text-[var(--brand)]">
                Top Result
              </p>

              <div
                onClick={() => handlePlaySong(topSong)}
                className="
                  group relative flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6
                  rounded-[var(--radius-xl)] bg-gradient-to-r from-[var(--bg-surface)] to-[var(--bg-elevated)]
                  border border-[var(--border)] hover:border-[var(--brand)]/40 cursor-pointer
                  transition-all shadow-xl hover:shadow-2xl max-w-2xl
                "
              >
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0 shadow-lg border border-white/10">
                  <Image
                    src={topSong.thumbnail || "/assets/images/default-song.png"}
                    alt={topSong.title}
                    fill
                    sizes="(max-width: 640px) 112px, 128px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <button className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[var(--brand)] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    {currentTrack?.id === topSong.id && isPlaying ? (
                      <Pause size={20} fill="white" />
                    ) : (
                      <Play size={20} fill="white" className="ml-0.5" />
                    )}
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <span className="badge badge-brand mb-2">Track</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] truncate">
                    {topSong.title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] mt-1">
                    {topSong.artist} {topSong.album ? `· ${topSong.album}` : ""}
                  </p>

                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(topSong);
                      }}
                      className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                        ${
                          mounted && isLiked(topSong.id)
                            ? "bg-red-500/20 text-red-400 border-red-500/30"
                            : "bg-white/5 text-[var(--text-secondary)] border-white/10 hover:text-white"
                        }
                      `}
                    >
                      <Heart size={14} fill={mounted && isLiked(topSong.id) ? "currentColor" : "none"} />
                      {mounted && isLiked(topSong.id) ? "Liked" : "Like"}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Songs List */}
          {(selectedCategory === "all" || selectedCategory === "songs") && (
            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">
                Songs ({filteredSongs.length})
              </h2>

              {filteredSongs.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] italic">No matching songs found.</p>
              ) : (
                <div className="space-y-1 max-w-4xl">
                  {filteredSongs.map((song, i) => {
                    const isCurrent = currentTrack?.id === song.id;
                    const isPlayingCurrent = isCurrent && isPlaying;
                    const liked = mounted ? isLiked(song.id) : false;
                    const isYt = song.type === "youtube" || (song.audioUrl && (song.audioUrl.includes("youtube") || song.audioUrl.includes("youtu.be")));

                    return (
                      <div
                        key={song.id || i}
                        onClick={() => handlePlaySong(song)}
                        className={`
                          group flex items-center justify-between gap-3 p-2.5 rounded-xl cursor-pointer transition-all border border-transparent
                          ${
                            isCurrent
                              ? "bg-[var(--brand)]/10 border-[var(--brand)]/30 text-[var(--brand)] shadow-sm"
                              : "hover:bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                          }
                        `}
                      >
                        {/* Play Icon / Index */}
                        <div className="w-8 text-center shrink-0">
                          {isPlayingCurrent ? (
                            <span className="flex items-end justify-center gap-0.5 h-3">
                              <span className="w-0.5 bg-[var(--brand)] animate-bounce h-full"></span>
                              <span className="w-0.5 bg-[var(--brand)] animate-bounce h-2 delay-100"></span>
                              <span className="w-0.5 bg-[var(--brand)] animate-bounce h-2.5 delay-200"></span>
                            </span>
                          ) : (
                            <>
                              <span className="text-xs font-mono text-[var(--text-muted)] group-hover:hidden">{i + 1}</span>
                              <Play size={14} className="hidden group-hover:block mx-auto text-[var(--text-primary)]" fill="currentColor" />
                            </>
                          )}
                        </div>

                        {/* Thumbnail */}
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[var(--bg-elevated)] shrink-0 border border-white/5 relative">
                          <Image
                            src={song.thumbnail || "/assets/images/default-song.png"}
                            alt={song.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-semibold truncate ${isCurrent ? "text-[var(--brand)]" : "text-[var(--text-primary)]"}`}>
                            {song.title}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] truncate">
                            {song.artist}
                          </p>
                        </div>

                        {/* Type badge */}
                        {isYt && (
                          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-semibold border border-red-500/20">
                            <YoutubeIcon size={10} /> YT
                          </span>
                        )}

                        {/* Like button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(song);
                          }}
                          className={`
                            p-2 rounded-full transition-colors shrink-0
                            ${liked ? "text-red-500 bg-red-500/10" : "text-[var(--text-muted)] hover:text-red-400 opacity-0 group-hover:opacity-100"}
                          `}
                          title={liked ? "Remove from Liked" : "Like Song"}
                        >
                          <Heart size={16} fill={liked ? "currentColor" : "none"} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* Artists Section */}
          {(selectedCategory === "all" || selectedCategory === "artists") && (
            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">
                Artists ({filteredArtists.length})
              </h2>
              {filteredArtists.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] italic">No matching artists found.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {filteredArtists.map((artist) => (
                    <div
                      key={artist.id}
                      onClick={() => handleSelectGenre(artist.genre)}
                      className="
                        p-4 rounded-[var(--radius-xl)] bg-[var(--bg-surface)] border border-[var(--border)]
                        hover:bg-[var(--bg-elevated)] transition-all cursor-pointer text-center group shadow-sm
                      "
                    >
                      <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden mb-3 border border-white/10 group-hover:scale-105 transition-transform">
                        <Image
                          src={artist.thumbnail}
                          alt={artist.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                      <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                        {artist.name}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                        {artist.followers}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Albums Section */}
          {(selectedCategory === "all" || selectedCategory === "albums") && (
            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">
                Albums ({filteredAlbums.length})
              </h2>
              {filteredAlbums.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] italic">No matching albums found.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredAlbums.map((album) => {
                    const matchTrack = CATALOG_TRACKS.find(t => t.album === album.title || t.artist === album.artist) || CATALOG_TRACKS[0];
                    return (
                      <div
                        key={album.id}
                        onClick={() => handlePlaySong(matchTrack)}
                        className="
                          p-3 rounded-[var(--radius-xl)] bg-[var(--bg-surface)] border border-[var(--border)]
                          hover:bg-[var(--bg-elevated)] transition-all cursor-pointer group shadow-sm relative
                        "
                      >
                        <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-2.5 border border-white/5">
                          <Image
                            src={album.thumbnail}
                            alt={album.title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <button className="absolute bottom-2 right-2 p-3 rounded-full bg-[var(--brand)] text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play size={16} fill="white" />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                          {album.title}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                          {album.artist} · {album.year}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </div>
      ) : (
        /* ── Browse Genres (Default State) ── */
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Sparkles size={18} className="text-[var(--brand)]" /> Browse all genres
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 stagger">
            {GENRES.map((g) => (
              <div
                key={g.id}
                onClick={() => handleSelectGenre(g.id)}
                className="
                  flex items-center justify-center
                  h-20 rounded-[var(--radius-xl)]
                  border border-[var(--border)]
                  text-sm font-bold cursor-pointer
                  transition-all duration-[var(--duration-base)]
                  hover:scale-105 hover:border-[var(--border-hover)]
                  shadow-md animate-fade-in text-center px-3
                "
                style={{ background: g.bg, color: g.color }}
              >
                {g.label}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container py-12 text-center text-xs text-[var(--text-muted)]">
        Loading search page...
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}