import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  ExternalLink,
  Loader2
} from 'lucide-react';

export default function Feed() {
  const [feed, setFeed] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadFeed() {
      try {
        const response = await fetch('/api/v1/regulations');
        if (response.ok) {
          const data = await response.json();
          setFeed(data);
        }
      } catch (err) {
        console.error("[Feed] Error loading regulations catalog", err);
      } finally {
        setLoading(false);
      }
    }
    loadFeed();
  }, []);

  const categories = ['All', 'Privacy', 'Cybersecurity', 'Artificial Intelligence', 'Financial'];

  const filteredFeed = feed.filter(item => {
    const matchesFilter = filter === 'All' || item.category === filter;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.authority.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 select-none max-w-[1600px] w-full mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Regulatory Feed</h1>
        <p className="text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
          Continuous updates discovered globally, transformed into machine-readable structure feed items.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-xl bg-zinc-900/10 border border-zinc-900 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search titles, authorities, tags..."
            className="w-full bg-zinc-950 border border-zinc-850 rounded-lg py-2.5 pl-10 pr-4 text-sm text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === cat
                  ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                  : 'bg-zinc-900/40 text-zinc-400 border border-zinc-850 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-sm text-zinc-500 flex items-center justify-center gap-2 py-12">
            <Loader2 className="w-5 h-5 animate-spin" /> Fetching updates...
          </div>
        ) : filteredFeed.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-12">No matching regulations found in the directory.</p>
        ) : (
          filteredFeed.map((item) => (
            <div 
              key={item.id} 
              className="p-6 rounded-xl bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800/80 transition-colors relative group shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${
                      item.severity === 'CRITICAL' 
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                        : item.severity === 'HIGH' 
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {item.severity}
                    </span>
                    <span className="text-zinc-700 text-sm">•</span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-zinc-900 text-zinc-400 border border-zinc-850">
                      {item.category}
                    </span>
                    <span className="text-zinc-700 text-sm">•</span>
                    <span className="text-xs font-semibold text-zinc-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                      {item.country_code || "Global"}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-zinc-200">
                    {item.title}
                  </h3>

                  <p className="text-zinc-400 text-sm leading-relaxed max-w-4xl">
                    {item.summary}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-semibold text-zinc-500 pt-3">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Updated July 17, 2026
                    </span>
                    <span>•</span>
                    <span>Authority: <b className="text-zinc-400">{item.authority}</b></span>
                  </div>
                </div>

                <a 
                  href={item.source_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-850 hover:text-zinc-100 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  Registry
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
