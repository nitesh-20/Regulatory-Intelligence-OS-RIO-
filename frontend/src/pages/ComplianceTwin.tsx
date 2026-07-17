import React, { useState, useEffect, useRef } from 'react';
import { Upload, Shield, FileText, Loader2, CheckCircle } from 'lucide-react';

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
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "General");
    
    try {
      const response = await fetch('/api/v1/documents/upload', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
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
    <div className="space-y-6 select-none max-w-[1600px] mx-auto w-full">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept=".pdf,.txt,.md"
      />

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Compliance Twin</h1>
        <p className="text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
          Upload and index internal policy documents. The compliance system evaluates update gaps directly against this twin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Actions Column */}
        <div className="space-y-6">
          
          {/* File Upload Zone */}
          <div 
            onClick={handleFileSelect}
            className="p-8 rounded-xl bg-zinc-900/10 border border-dashed border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col items-center justify-center text-center cursor-pointer group"
          >
            <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-zinc-400 mb-4 group-hover:text-zinc-200 transition-colors">
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin text-zinc-200" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
            </div>
            <h4 className="text-sm font-semibold text-zinc-200">
              {uploading ? "Analyzing & Indexing..." : "Upload Policy Document"}
            </h4>
            <p className="text-xs text-zinc-500 mt-1.5 max-w-[220px] leading-relaxed">
              {uploading 
                ? "Extracting obligations using Gemini Flash..."
                : "Supports PDF, Markdown, TXT. Files are chunked and vectorized instantly."
              }
            </p>
            <button 
              disabled={uploading}
              className="mt-4 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-semibold text-zinc-300 disabled:opacity-50"
            >
              {uploading ? "Please Wait" : "Select File"}
            </button>
          </div>

          {/* Policy index List */}
          <div className="p-6 rounded-xl bg-zinc-900/20 border border-zinc-900 shadow-sm">
            <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2 tracking-wide">
              <Shield className="w-4 h-4 text-zinc-500" />
              Indexed Policies
            </h3>
            
            <div className="space-y-3">
              {loading ? (
                <div className="text-xs text-zinc-500 flex items-center gap-2 py-4 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading policies...
                </div>
              ) : policies.length === 0 ? (
                <p className="text-xs text-zinc-500 py-4 text-center">No indexed corporate files.</p>
              ) : (
                policies.map((policy) => (
                  <div key={policy.id} className="p-4 rounded-lg bg-zinc-900/30 border border-zinc-900 flex items-start gap-3">
                    <FileText className="w-4 h-4 text-zinc-500 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-zinc-200 truncate">{policy.name}</h4>
                      <p className="text-xs text-zinc-500 mt-1">{policy.size} • {policy.uploaded} ({policy.chunks} chunks)</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 uppercase tracking-wider">
                      {policy.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Gaps List Column */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-zinc-900/20 border border-zinc-900 shadow-sm flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-zinc-200 tracking-wide">Active Gap Checklist</h3>
            <span className={`text-xs font-semibold px-3 py-1 rounded-lg ${
              gaps.length > 0
                ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
            }`}>
              {gaps.length > 0 ? `${gaps.length} Action Needed` : "Fully Compliant"}
            </span>
          </div>

          <div className="space-y-4 flex-1">
            {loading ? (
              <div className="text-xs text-zinc-500 flex items-center gap-2 py-12 justify-center">
                <Loader2 className="w-4 h-4 animate-spin" /> Verifying twin matrices...
              </div>
            ) : gaps.length === 0 ? (
              <div className="p-10 rounded-xl bg-zinc-900/10 border border-zinc-900 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                <CheckCircle className="w-8 h-8 text-emerald-500/80 mb-3" />
                <h4 className="text-sm font-semibold text-zinc-300 font-display">All Systems Aligned</h4>
                <p className="text-xs text-zinc-500 mt-2 max-w-[280px] leading-relaxed">
                  No active gaps identified. Your controls are fully in alignment with all active tracking rules.
                </p>
              </div>
            ) : (
              gaps.map((gap) => (
                <div key={gap.id} className="p-5 rounded-xl bg-zinc-900/30 border border-zinc-900">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                        gap.severity === 'CRITICAL' 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {gap.severity}
                      </span>
                      <h4 className="text-sm font-semibold text-zinc-200">{gap.gap_description.split("Gap")[0]}</h4>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      gap.status === 'RESOLVED' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {gap.status}
                    </span>
                  </div>

                  <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                    {gap.gap_description}
                  </p>

                  <div className="p-4 rounded-lg bg-zinc-950/40 border border-zinc-900">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">REMEDIATION ACTION</span>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {gap.remediation_plan || "Update alignment configurations to reflect targets."}
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
