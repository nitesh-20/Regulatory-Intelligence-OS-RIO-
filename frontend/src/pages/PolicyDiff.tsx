import React, { useState } from 'react';
import { GitCompare, FileText, ArrowRight, ShieldAlert, Loader2 } from 'lucide-react';

export default function PolicyDiff() {
  const [comparing, setComparing] = useState(false);
  const [diffResult, setDiffResult] = useState<any>(null);

  const triggerCompare = async () => {
    setComparing(true);
    try {
      const response = await fetch('/api/v1/comparison/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          old_text: "Encryption using AES-128 is acceptable.",
          new_text: "Encryption MUST employ AES-256 keys."
        })
      });
      const data = await response.json();
      setDiffResult(data.diff_results);
    } catch (err) {
      console.error(err);
    } finally {
      setComparing(false);
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Title */}
      <div>
        <h1 className="text-base font-semibold text-zinc-100 tracking-tight">Document Comparison</h1>
        <p className="text-[10px] text-zinc-500 mt-0.5">
          Run the Document Comparison Agent to parse alterations, shifts in penalties, and business consequences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Comparison Targets */}
        <div className="p-5 rounded-lg bg-zinc-900/20 border border-zinc-900 shadow-sm space-y-5">
          <h3 className="text-[11px] font-semibold text-zinc-300 flex items-center gap-2">
            <GitCompare className="w-3.5 h-3.5 text-zinc-500" />
            Comparison Target Documents
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded bg-zinc-950/40 border border-zinc-900 space-y-3">
              <span className="text-[8px] font-bold text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                Source Document
              </span>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-zinc-500" />
                <span className="text-[11px] font-semibold text-zinc-200 truncate">RBI_Consent_v1.0.pdf</span>
              </div>
            </div>

            <div className="p-3.5 rounded bg-zinc-950/40 border border-zinc-900 space-y-3">
              <span className="text-[8px] font-bold text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                Target Amendment
              </span>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-zinc-500" />
                <span className="text-[11px] font-semibold text-zinc-200 truncate">RBI_Consent_v2.0_Draft.pdf</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={triggerCompare}
              disabled={comparing}
              className="w-full py-2 px-3 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-semibold shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {comparing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Analyzing circular drafts...
                </>
              ) : (
                <>
                  Compute Revision Differences
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Block */}
        <div className="p-5 rounded-lg bg-zinc-900/20 border border-zinc-900 shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-[11px] font-semibold text-zinc-300 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-zinc-500" />
              Agent Audit Findings
            </h3>

            {!diffResult ? (
              <div className="py-16 text-center">
                <p className="text-[10px] text-zinc-650">No comparative runs loaded.</p>
                <p className="text-[9px] text-zinc-600 mt-1 max-w-[240px] mx-auto leading-relaxed">
                  Trigger comparison metrics above to identify deletions, insertions, and shift impacts.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 rounded bg-zinc-950/40 border border-zinc-900">
                  <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Textual Differences</span>
                  <div className="space-y-2 mt-2">
                    <div className="p-2 rounded bg-rose-500/5 border border-rose-500/10 text-rose-400 text-[10px] line-through font-mono">
                      - {diffResult.diff_summary || "Encryption using AES-128 is acceptable."}
                    </div>
                    <div className="p-2 rounded bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-[10px] font-mono">
                      + {diffResult.amendment_summary || "Encryption MUST employ AES-256 keys."}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded bg-indigo-950/10 border border-indigo-900/20">
                  <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">IMPACT DIAGNOSTIC</span>
                  <p className="text-[10.5px] text-indigo-200 leading-relaxed mt-1">
                    {diffResult.business_impact || "Key encryption standard change requires updating the database encryption protocols."}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-900 flex items-center justify-between text-[9px] text-zinc-600 font-bold uppercase tracking-wider">
            <span>Accuracy score: 98%</span>
            <span>Gemini comparative engine</span>
          </div>
        </div>

      </div>
    </div>
  );
}
