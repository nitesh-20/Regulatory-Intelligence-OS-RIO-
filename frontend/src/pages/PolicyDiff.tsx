import React, { useState } from 'react';
import { GitCompare, FileText, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-100 mb-1">Document & Version Comparison</h1>
        <p className="text-xs text-slate-400">
          Run the Document Comparison Agent to parse alterations, shifts in penalties, and business consequences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Upload Details */}
        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 shadow-md space-y-6">
          <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider flex items-center gap-1.5">
            <GitCompare className="w-4 h-4 text-indigo-400" />
            Comparison Target Documents
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-850 space-y-3">
              <span className="text-[9px] font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                Source Document
              </span>
              <div className="flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-200">RBI_Consent_v1.0.pdf</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-850 space-y-3">
              <span className="text-[9px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                Target Amendment
              </span>
              <div className="flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-200">RBI_Consent_v2.0_Amended.pdf</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-850">
            <button
              onClick={triggerCompare}
              disabled={comparing}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow shadow-indigo-600/25 flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {comparing ? (
                <>Comparing...</>
              ) : (
                <>
                  <Cpu className="w-4 h-4" />
                  Compare Version Shifts
                </>
              )}
            </button>
          </div>
        </div>

        {/* Comparison Results */}
        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 shadow-md flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-455" />
              Agent Audit Findings
            </h3>

            {diffResult ? (
              <div className="space-y-4">
                {/* Added Clauses */}
                {diffResult.added_clauses && diffResult.added_clauses.map((clause: string, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 space-y-1">
                    <span className="text-[8px] font-extrabold text-emerald-400 uppercase tracking-wider">Added Clause</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{clause}</p>
                  </div>
                ))}

                {/* Modified Clauses */}
                {diffResult.modified_clauses && diffResult.modified_clauses.map((clause: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/10 space-y-2">
                    <span className="text-[8px] font-extrabold text-amber-400 uppercase tracking-wider">Modified Standard (Section {clause.section})</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] leading-relaxed">
                      <div className="space-y-0.5">
                        <span className="text-slate-500 block font-semibold">Previous Version:</span>
                        <p className="text-slate-400 line-through bg-slate-950/20 p-1.5 rounded">{clause.old}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-emerald-400 block font-semibold">Amended Version:</span>
                        <p className="text-slate-200 bg-slate-950/40 p-1.5 rounded">{clause.new}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-550 flex flex-col justify-center items-center gap-2">
                <GitCompare className="w-8 h-8 text-slate-700" />
                <p className="text-[10px] text-slate-500 max-w-[180px] leading-relaxed">
                  Trigger comparison using the comparison agent to visualize version details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
