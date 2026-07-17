import React, { useState, useEffect, useRef } from 'react';
import { Upload, Shield, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function ComplianceTwin() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [gaps, setGaps] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function fetchTwinData() {
    try {
      const [policiesRes, gapsRes] = await Promise.all([
        fetch('/api/v1/documents'),
        fetch('/api/v1/compliance/gaps')
      ]);
      if (policiesRes.ok) {
        const policiesData = await policiesRes.json();
        setPolicies(policiesData);
      }
      if (gapsRes.ok) {
        const gapsData = await gapsRes.json();
        setGaps(gapsData);
      }
    } catch (err) {
      console.error("[ComplianceTwin] Error fetching live policies/gaps", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTwinData();
  }, []);

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setUploading(true);
    
    // Prepare multi-part form payload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "General");
    
    try {
      const response = await fetch('/api/v1/documents/upload', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        // Refresh policies and gaps list to show newly compiled items and self-correcting gaps
        await fetchTwinData();
      } else {
        alert("Failed to parse and index document.");
      }
    } catch (err) {
      console.error("[ComplianceTwin] Upload failed", err);
      alert("Error uploading file.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept=".pdf,.txt,.md"
      />

      {/* Title */}
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-100 mb-1">Compliance Twin</h1>
        <p className="text-xs text-slate-400">
          Upload and index internal policies, security frameworks, and controls. The agent evaluates updates directly against this twin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Column */}
        <div className="space-y-6">
          {/* File Upload Zone */}
          <div 
            onClick={handleFileSelect}
            className="p-6 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 hover:border-indigo-500/40 transition-colors flex flex-col items-center justify-center text-center cursor-pointer group"
          >
            <div className="p-3 rounded-full bg-slate-950 border border-slate-800 text-slate-400 mb-3 group-hover:text-indigo-400 transition-colors">
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
            </div>
            <h4 className="text-xs font-semibold text-slate-200">
              {uploading ? "Analyzing & Indexing..." : "Upload Policy Documents"}
            </h4>
            <p className="text-[10px] text-slate-500 mt-1 max-w-[200px] leading-relaxed">
              {uploading 
                ? "Running Gemini entity analysis, chunking, and vector store embedding computation."
                : "Support PDF, Markdown, TXT. Files are parsed, chunked, and vectorized automatically."
              }
            </p>
            <button 
              disabled={uploading}
              className="mt-4 px-3 py-1.5 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold disabled:opacity-50"
            >
              {uploading ? "Please Wait" : "Select Files"}
            </button>
          </div>

          {/* Active Policies List */}
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 shadow-md">
            <h3 className="text-xs font-bold text-slate-300 mb-4 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-indigo-400" />
              Indexed Corporate Policies
            </h3>
            <div className="space-y-3">
              {loading ? (
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 py-4 justify-center">
                  <Loader2 className="w-4.5 h-4.5 animate-spin" /> Loading policies...
                </div>
              ) : policies.length === 0 ? (
                <p className="text-[10px] text-slate-500 py-4 text-center">No policies currently indexed.</p>
              ) : (
                policies.map((policy) => (
                  <div key={policy.id} className="p-3 rounded-lg bg-slate-950/40 border border-slate-850 flex items-start gap-3">
                    <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[11px] font-semibold text-slate-200 truncate">{policy.name}</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5">{policy.size} • {policy.uploaded} ({policy.chunks} chunks)</p>
                    </div>
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                      {policy.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Gaps Column */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 rounded-full bg-rose-500"></div>
              <h3 className="font-display font-semibold text-slate-200">Active Compliance Gaps</h3>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1.5 ${
              gaps.length > 0
                ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
            }`}>
              {gaps.length > 0 ? "Needs Attention" : "Fully Compliant"}
            </span>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-xs text-slate-500 flex items-center gap-1.5 py-8 justify-center">
                <Loader2 className="w-4.5 h-4.5 animate-spin" /> Evaluating compliance logs...
              </div>
            ) : gaps.length === 0 ? (
              <div className="p-8 rounded-xl bg-slate-950/20 border border-slate-900 flex flex-col items-center justify-center text-center">
                <CheckCircle className="w-8 h-8 text-emerald-500/80 mb-2" />
                <h4 className="text-xs font-semibold text-slate-300">All Systems Clear</h4>
                <p className="text-[10px] text-slate-500 mt-1 max-w-xs leading-relaxed">
                  No active gaps or discrepancies identified. Your uploaded controls are in complete alignment with current regulations.
                </p>
              </div>
            ) : (
              gaps.map((gap) => (
                <div key={gap.id} className="p-4 rounded-xl bg-slate-950/40 border border-slate-850">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                        gap.severity === 'CRITICAL' 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {gap.severity}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-200">{gap.gap_description.split("Gap")[0]}</h4>
                    </div>
                    <span className="text-[9px] text-slate-400 font-medium">Status: <span className={gap.status === 'RESOLVED' ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>{gap.status}</span></span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    {gap.gap_description}
                  </p>

                  <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-900/30">
                    <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">REMEDIATION ACTION REQUIRED</span>
                    <p className="text-[10.5px] text-indigo-200 leading-relaxed">
                      {gap.remediation_plan || "Establish encryption standards in configurations."}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
