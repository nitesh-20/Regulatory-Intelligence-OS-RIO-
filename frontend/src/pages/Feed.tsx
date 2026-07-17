import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  ArrowUpRight, 
  Clock, 
  ExternalLink 
} from 'lucide-react';

const initialFeed = [
  { id: '1', title: 'DPDP Data Consent Architecture Framework', authority: 'RBI / MEITY', category: 'Privacy', country: 'IN', date: '2026-06-21', severity: 'HIGH', summary: 'Framework laying down operational parameters for consent managers handling digital personal data.' },
  { id: '2', title: 'FTC Safeguards Rule on Consumer Data Security', authority: 'FTC', category: 'Cybersecurity', country: 'US', date: '2026-06-20', severity: 'CRITICAL', summary: 'Amended rule adding notification rules for security events affecting 500+ consumers.' },
  { id: '3', title: 'EU AI Act Risk Management Standard (Draft)', authority: 'EU Parliament', category: 'Artificial Intelligence', country: 'EU', date: '2026-06-19', severity: 'HIGH', summary: 'Technical parameters detailing self-audit records for foundational model developers.' },
  { id: '4', title: 'Digital operational resilience act (DORA)', authority: 'EIOPA', category: 'Financial', country: 'EU', date: '2026-06-18', severity: 'MEDIUM', summary: 'Updated technical standards for third-party risk management in banking infrastructures.' },
  { id: '5', title: 'SEC Cybersecurity Risk Management and Governance', authority: 'SEC', category: 'Cybersecurity', country: 'US', date: '2026-06-15', severity: 'HIGH', summary: 'Revised guidance on executive team risk monitoring methodologies and inline audit tags.' }
];

export default function Feed() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Privacy', 'Cybersecurity', 'Artificial Intelligence', 'Financial'];

  const filteredFeed = initialFeed.filter(item => {
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
          Continuous updates discovered globally, transformed into machine-readable structure.
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
        {filteredFeed.map((item) => (
          <div 
            key={item.id} 
            className="p-6 rounded-xl bg-slate-900/30 border border-slate-850/80 hover:border-indigo-500/20 hover:bg-slate-900/50 transition-all duration-300 relative group"
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
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-355 border border-slate-700">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-500">•</span>
                  <span className="text-[10px] font-semibold text-slate-450 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {item.country}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed max-w-4xl">
                  {item.summary}
                </p>
              </div>

              <div className="flex flex-col items-end justify-between min-w-[120px] text-right">
                <span className="text-[9px] text-slate-500 flex items-center gap-1 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  {item.date}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold mt-1">
                  {item.authority}
                </span>
                <button className="mt-3 text-[9px] text-indigo-400 font-bold flex items-center gap-1 bg-indigo-950/20 hover:bg-indigo-950/50 px-2.5 py-1 rounded border border-indigo-900/40 transition-colors">
                  Analyze Impact
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredFeed.length === 0 && (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
            <p className="text-xs text-slate-500">No regulations match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
