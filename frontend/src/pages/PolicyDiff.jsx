import React, { useState } from 'react'
import { GitCompare, Calendar, ChevronRight, FileCode, Check } from 'lucide-react'

export default function PolicyDiff() {
  const [selectedRegulation, setSelectedRegulation] = useState('EU-AI-ACT')

  const regulationVersions = [
    { code: 'EU-AI-ACT', title: 'EU AI Act', versions: ['v2.1 (2026.06)', 'v2.0 (2024.12)'], commit: 'Amended threshold for foundational models audit requirements (Article 4).' },
    { code: 'SEC-CYBER', title: 'SEC Cybersecurity Act', versions: ['v1.8 (2026.03)', 'v1.7 (2023.09)'], commit: 'Added inline XBRL tagging directives for disclosure forms.' },
  ]

  const currentDiff = {
    title: 'EU Artificial Intelligence Act - Article 4.1',
    modifiedDate: 'Amended: June 18, 2026',
    lines: [
      { type: 'normal', text: 'Section 4.1. General Purpose Artificial Intelligence Models (GPAI)' },
      { type: 'delete', text: '- 1. Developers of GPAI models that present systemic risks shall run evaluation processes.' },
      { type: 'delete', text: '- 2. A model is presumed to present systemic risks if cumulative computing power exceeds 10^24 FLOPS.' },
      { type: 'add', text: '+ 1. Developers of GPAI models that exceed 10^22 FLOPS cumulative computing power shall register.' },
      { type: 'add', text: '+ 2. Such entities must run evaluation processes and submit reports to the AI Office every 6 months.' },
      { type: 'normal', text: 'Section 4.2. Incident Disclosures and Cyber Auditing rules apply to all registered providers.' },
    ]
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-100 mb-1">Regulation GitHub & Policy Diff</h1>
        <p className="text-xs text-slate-400">
          Git-style version control tracking amendments, added clauses, and deleted segments across global regulations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Versions Selection Column */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/80 shadow-md">
            <h3 className="text-xs font-bold text-slate-300 mb-4 flex items-center gap-1.5">
              <GitCompare className="w-4 h-4 text-indigo-400" />
              Regulation Repository
            </h3>

            <div className="space-y-3">
              {regulationVersions.map((reg) => (
                <div
                  key={reg.code}
                  onClick={() => setSelectedRegulation(reg.code)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer text-xs ${
                    selectedRegulation === reg.code
                      ? 'bg-indigo-600/15 border-indigo-500/30'
                      : 'bg-slate-950/40 border-slate-850 hover:bg-slate-900/40'
                  }`}
                >
                  <h4 className="font-semibold text-slate-200">{reg.title}</h4>
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
                    <span>{reg.versions[0]}</span>
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                    <span>{reg.versions[1]}</span>
                  </div>
                  <p className="mt-2 text-[9px] text-slate-500 leading-normal bg-slate-950/20 p-2 rounded">
                    {reg.commit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Git diff Viewer */}
        <div className="lg:col-span-3 p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 shadow-md space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800/60">
            <div>
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-400" />
                {currentDiff.title}
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">{currentDiff.modifiedDate}</p>
            </div>
            <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
              Commit Hash: ae3b719
            </span>
          </div>

          {/* Code block style diff */}
          <div className="font-mono text-xs rounded-xl bg-slate-950 border border-slate-900 overflow-hidden">
            <div className="h-8 bg-slate-900/60 border-b border-slate-900 flex items-center px-4 justify-between">
              <span className="text-[10px] text-slate-500 font-semibold">Unified Diff View</span>
              <div className="flex gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/30 border border-rose-500/50"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/30 border border-emerald-500/50"></span>
              </div>
            </div>
            <div className="p-4 space-y-2 overflow-x-auto whitespace-pre">
              {currentDiff.lines.map((line, idx) => (
                <div
                  key={idx}
                  className={`p-1.5 rounded text-[11px] ${
                    line.type === 'delete'
                      ? 'bg-rose-950/20 text-rose-300 border-l-2 border-rose-500/60 font-semibold'
                      : line.type === 'add'
                      ? 'bg-emerald-950/20 text-emerald-300 border-l-2 border-emerald-500/60 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  {line.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
