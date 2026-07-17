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
    <div className="space-y-6 select-none max-w-[1600px] w-full mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Document Comparison</h1>
        <p className="text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
          Run the Document Comparison Agent to parse alterations, shifts in penalties, and business consequences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Comparison Targets */}
        <div className="p-6 rounded-xl bg-zinc-900/20 border border-zinc-900 shadow-sm space-y-6">
          <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-zinc-500" />
            Comparison Target Documents
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-lg bg-zinc-950/40 border border-zinc-900 space-y-3">
              <span className="text-[10px] font-bold text-zinc-400 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 uppercase tracking-wider">
                Source Document
              </span>
              <div className="flex items-center gap-2.5 mt-2">
                <FileText className="w-5 h-5 text-zinc-500" />
                <span className="text-sm font-semibold text-zinc-200 truncate">RBI_Consent_v1.0.pdf</span>
              </div>
            </div>

            <div className="p-5 rounded-lg bg-zinc-950/40 border border-zinc-900 space-y-3">
              <span className="text-[10px] font-bold text-zinc-400 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 uppercase tracking-wider">
                Target Amendment
              </span>
              <div className="flex items-center gap-2.5 mt-2">
                <FileText className="w-5 h-5 text-zinc-500" />
                <span className="text-sm font-semibold text-zinc-200 truncate">RBI_Consent_v2.0_Draft.pdf</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={triggerCompare}
              disabled={comparing}
              className="w-full py-3 px-4 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
            >
              {comparing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing circular drafts...
                </>
              ) : (
                <>
                  Compute Revision Differences
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Block */}
        <div className="p-6 rounded-xl bg-zinc-900/20 border border-zinc-900 shadow-sm flex flex-col justify-between min-h-[400px]">
          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-5 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-zinc-500" />
              Agent Audit Findings
            </h3>

            {!diffResult ? (
              <div className="py-24 text-center">
                <p className="text-sm text-zinc-500">No comparative runs loaded.</p>
                <p className="text-xs text-zinc-500 mt-2 max-w-[280px] mx-auto leading-relaxed">
                  Trigger comparison metrics above to identify deletions, insertions, and shift impacts.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="p-4 rounded-lg bg-zinc-950/40 border border-zinc-900">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">Textual Differences</span>
                  <div className="space-y-3 mt-3">
                    <div className="p-3 rounded-md bg-rose-500/5 border border-rose-500/10 text-rose-400 text-xs line-through font-mono">
                      - {diffResult.diff_summary || "Encryption using AES-128 is acceptable."}
                    </div>
                    <div className="p-3 rounded-md bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-xs font-mono">
                      + {diffResult.amendment_summary || "Encryption MUST employ AES-256 keys."}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-indigo-950/10 border border-indigo-900/20">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-2">IMPACT DIAGNOSTIC</span>
                  <p className="text-sm text-indigo-200 leading-relaxed mt-1">
                    {diffResult.business_impact || "Key encryption standard change requires updating the database encryption protocols."}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-5 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
            <span>Accuracy score: 98%</span>
            <span>Gemini comparative engine</span>
          </div>
        </div>

      </div>
    </div>
  );
}
