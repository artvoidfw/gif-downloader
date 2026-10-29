import React, { useState, useEffect } from 'react';
import { 
  Search as SearchIcon, 
  Download, 
  Share2, 
  Check, 
  Sparkles, 
  ExternalLink,
  Flame,
  Film
} from 'lucide-react';

export default function SearchSection({ t, onSelectGifForDownloader }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('trending');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const categories = [
    { id: 'trending', label: t.sr_trending },
    { id: 'reactions', label: t.sr_reactions },
    { id: 'anime', label: t.sr_anime },
    { id: 'memes', label: t.sr_memes },
    { id: 'gaming', label: t.sr_gaming },
    { id: 'animals', label: t.sr_animals },
    { id: 'movies', label: t.sr_movies },
    { id: 'sports', label: t.sr_sports },
  ];

  const fetchGifs = async (cat, q) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search-gifs?category=${encodeURIComponent(cat)}&q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGifs(activeCategory, query);
  }, [activeCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchGifs(activeCategory, query);
  };

  const handleDownload = (gif) => {
    const a = document.createElement('a');
    a.href = `/api/proxy-media?url=${encodeURIComponent(gif.url)}&download=1&filename=${gif.title.replace(/\s+/g, '_').toLowerCase()}.gif`;
    a.download = `${gif.title.replace(/\s+/g, '_').toLowerCase()}.gif`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLink = (gif) => {
    navigator.clipboard.writeText(gif.url);
    setCopiedId(gif.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Search Header - Strictly NO gradient */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-400">
          <SearchIcon className="h-3.5 w-3.5" />
          <span>{t.sr_title}</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
          {t.sr_title}
        </h2>
      </div>

      {/* Search Bar Input */}
      <form onSubmit={handleSearchSubmit} className="mx-auto max-w-2xl">
        <div className="relative flex items-center">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400">
            <SearchIcon className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.sr_search_placeholder}
            className="w-full rounded-2xl border border-zinc-300 bg-white py-3.5 pl-11 pr-24 text-sm text-zinc-900 shadow-sm focus:border-blue-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
          <button
            type="submit"
            className="absolute right-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
            }}
            className={`rounded-xl px-4 py-2 text-xs font-bold border transition-colors ${
              activeCategory === cat.id
                ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* GIF Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
          <span className="text-xs font-medium text-zinc-500">{t.loading}</span>
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
          {t.sr_no_results}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((gif) => (
            <div
              key={gif.id}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-900 dark:border-zinc-800 shadow-sm transition-all hover:border-zinc-400 dark:hover:border-zinc-600 flex flex-col justify-between"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-950 flex items-center justify-center">
                <img
                  src={gif.url}
                  alt={gif.title}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain"
                />

                {/* Top Badge: Size & Dimensions */}
                <div className="absolute top-2 left-2 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-white">
                  {gif.width}×{gif.height} • {gif.size}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="border-t border-zinc-800 bg-zinc-950/95 p-3 flex items-center justify-between">
                <div className="truncate pr-2">
                  <div className="truncate text-xs font-bold text-white">
                    {gif.title}
                  </div>
                  <div className="text-[10px] text-zinc-400 uppercase font-semibold">
                    {gif.category}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopyLink(gif)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                    title={t.dl_copy_link}
                  >
                    {copiedId === gif.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Share2 className="h-3.5 w-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleDownload(gif)}
                    className="flex h-7 items-center gap-1 rounded-lg bg-blue-600 px-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
                    title={t.sr_one_click}
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline text-[11px]">Save</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

