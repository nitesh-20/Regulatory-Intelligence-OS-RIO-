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
    <div className="space-y-6 select-none">
      {/* Title */}
      <div>
        <h1 className="text-base font-semibold text-zinc-100 tracking-tight">Regulatory Feed</h1>
        <p className="text-[10px] text-zinc-500 mt-0.5">
          Continuous updates discovered globally, transformed into machine-readable structure feed items.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-3.5 rounded-lg bg-zinc-900/10 border border-zinc-900 shadow-sm">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search titles, authorities, tags..."
            className="w-full bg-zinc-950 border border-zinc-850 rounded py-1.5 pl-9 pr-4 text-[10.5px] text-zinc-300 placeholder-zinc-550 focus:outline-none focus:border-zinc-700 transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded text-[10px] font-semibold transition-colors ${
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
      <div className="space-y-3">
        {loading ? (
          <div className="text-[10px] text-zinc-550 flex items-center justify-center gap-1.5 py-12">
            <Loader2 className="w-4.5 h-4.5 animate-spin" /> Fetching updates...
          </div>
        ) : filteredFeed.length === 0 ? (
          <p className="text-[10px] text-zinc-650 text-center py-12">No matching regulations found in the directory.</p>
        ) : (
          filteredFeed.map((item) => (
            <div 
              key={item.id} 
              className="p-5 rounded-lg bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800/80 transition-colors relative group"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                      item.severity === 'CRITICAL' 
                        ? 'bg-rose-500/10 text-rose-450 border border-rose-500/20' 
                        : item.severity === 'HIGH' 
                        ? 'bg-amber-500/10 text-amber-450 border border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-450 border border-blue-500/20'
                    }`}>
                      {item.severity}
                    </span>
                    <span className="text-zinc-700 text-[10px]">•</span>
                    <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-850">
                      {item.category}
                    </span>
                    <span className="text-zinc-700 text-[10px]">•</span>
                    <span className="text-[9.5px] font-semibold text-zinc-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-zinc-500" />
                      {item.country_code || "Global"}
                    </span>
                  </div>

                  <h3 className="text-xs font-semibold text-zinc-200">
                    {item.title}
                  </h3>

                  <p className="text-zinc-450 text-[10.5px] leading-relaxed max-w-3xl">
                    {item.summary}
                  </p>

                  <div className="flex items-center gap-4 text-[9.5px] font-semibold text-zinc-500 pt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Updated July 17, 2026
                    </span>
                    <span>•</span>
                    <span>Authority: <b>{item.authority}</b></span>
                  </div>
                </div>

                <a 
                  href={item.source_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-[9.5px] font-semibold text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200 transition-colors flex items-center gap-1 shrink-0"
                >
                  Registry
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
