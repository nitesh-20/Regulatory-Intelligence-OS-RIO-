import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  ArrowUpRight, 
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
    <div className="space-y-6">
      {/* Title block */}
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-100 mb-1">Regulatory Catalog & Feed</h1>
        <p className="text-xs text-slate-400">
          Continuous updates discovered globally, transformed into machine-readable structures.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search titles, codes, regulators..."
            className="w-full bg-slate-950/60 border border-slate-850 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/80 transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === cat
                  ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/30'
                  : 'bg-slate-950/40 text-slate-400 border border-slate-850 hover:bg-slate-900/50 hover:text-slate-200'
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
          <div className="text-xs text-slate-500 flex items-center justify-center gap-1.5 py-12">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading regulatory feed...
          </div>
        ) : filteredFeed.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-12">No matching regulations found in the directory.</p>
        ) : (
          filteredFeed.map((item) => (
            <div 
              key={item.id} 
              className="p-6 rounded-xl bg-slate-900/30 border border-slate-855/80 hover:border-indigo-500/20 hover:bg-slate-900/50 transition-all duration-300 relative group"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                      item.severity === 'CRITICAL' 
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                        : item.severity === 'HIGH' 
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {item.severity}
                    </span>
                    <span className="text-[10px] text-slate-500">•</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-500">•</span>
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {item.country_code || "Global"}
                    </span>
                  </div>

                  <h3 className="text-sm font-display font-semibold text-slate-200">
                    {item.title}
                  </h3>

                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-3xl">
                    {item.summary}
                  </p>

                  <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-500 pt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
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
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-850 text-[10px] font-semibold text-slate-350 hover:bg-slate-900 hover:text-slate-100 transition-colors flex items-center gap-1 shrink-0"
                >
                  Source Registry
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
