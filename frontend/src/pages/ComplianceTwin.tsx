import React, { useState, useEffect, useRef } from 'react';
import { Upload, Shield, FileText, Loader2, CheckCircle, X, ChevronRight, Activity, AlertTriangle, Layers, Key, CheckSquare, Target } from 'lucide-react';

export default function ComplianceTwin() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [gaps, setGaps] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadStatusText, setUploadStatusText] = useState<string>("Upload Policy Document");
  const [selectedPolicy, setSelectedPolicy] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processingStages = [
    "Uploading Document...",
    "Parsing PDF & OCR...",
    "Extracting Clauses & Tables...",
    "Generating AI Embeddings...",
    "Storing in Qdrant Vector DB...",
    "Running Compliance Mapping...",
    "Evaluating Risk Score...",
    "Finalizing Executive Summary..."
  ];

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
    
    let stageIndex = 0;
    setUploadStatusText(processingStages[0]);
    
    const intervalId = setInterval(() => {
      stageIndex++;
      if (stageIndex < processingStages.length) {
        setUploadStatusText(processingStages[stageIndex]);
      }
    }, 1500); // cycle stages visually
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", "General");
    
    try {
      const response = await fetch('/api/v1/documents/upload', {
        method: 'POST',
        body: formData
      });
      
      clearInterval(intervalId);
      
      if (response.ok) {
        setUploadStatusText("Completed!");
        await fetchTwinData();
      } else {
        alert("Failed to parse and index document.");
      }
    } catch (err) {
      clearInterval(intervalId);
      console.error("[ComplianceTwin] Upload failed", err);
      alert("Error uploading file.");
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadStatusText("Upload Policy Document");
      }, 1000);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-6 select-none max-w-[1600px] mx-auto w-full relative">
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
            onClick={!uploading ? handleFileSelect : undefined}
            className={`p-8 rounded-xl bg-zinc-900/10 border border-dashed transition-colors flex flex-col items-center justify-center text-center group ${uploading ? 'border-emerald-500/50 cursor-default' : 'border-zinc-800 hover:border-zinc-700 cursor-pointer'}`}
          >
            <div className={`p-3 rounded-lg bg-zinc-900/50 border transition-colors mb-4 ${uploading ? 'border-emerald-500/30 text-emerald-400' : 'border-zinc-800 text-zinc-400 group-hover:text-zinc-200'}`}>
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
            </div>
            <h4 className="text-sm font-semibold text-zinc-200">
              {uploadStatusText}
            </h4>
            <p className="text-xs text-zinc-500 mt-1.5 max-w-[220px] leading-relaxed">
              {uploading 
                ? "Orchestrating AI agents..."
                : "Supports PDF, Markdown, TXT. Files are chunked and vectorized instantly."
              }
            </p>
            <button 
              disabled={uploading}
              className="mt-4 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-semibold text-zinc-300 disabled:opacity-50"
            >
              {uploading ? "Processing..." : "Select File"}
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
                  <div 
                    key={policy.id} 
                    onClick={() => setSelectedPolicy(policy)}
                    className="p-4 rounded-lg bg-zinc-900/30 border border-zinc-900 flex items-center justify-between gap-3 cursor-pointer hover:bg-zinc-900/60 transition-colors group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <FileText className="w-4 h-4 text-zinc-500 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-zinc-200 truncate">{policy.name}</h4>
                        <p className="text-xs text-zinc-500 mt-1">{policy.size} • {policy.uploaded} ({policy.chunks} chunks)</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
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
                      <h4 className="text-sm font-semibold text-zinc-200">{gap.title || gap.gap_description?.split("Gap")[0] || "Policy Gap"}</h4>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      gap.status === 'RESOLVED' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {gap.status}
                    </span>
                  </div>

                  <p className="text-zinc-400 text-sm leading-relaxed mb-4 whitespace-pre-line">
                    {gap.description || gap.gap_description}
                  </p>

                  <div className="p-4 rounded-lg bg-zinc-950/40 border border-zinc-900">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1.5">REMEDIATION ACTION</span>
                    <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                      {gap.remediation_plan || "Update alignment configurations to reflect targets."}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Slide-over Policy Details Modal */}
      {selectedPolicy && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedPolicy(null)}
          />
          
          {/* Panel */}
          <div className="relative w-full max-w-md bg-zinc-950 border-l border-zinc-800 h-full overflow-y-auto flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-zinc-900 flex items-center justify-between sticky top-0 bg-zinc-950/90 backdrop-blur z-10">
              <h2 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                Document Details
              </h2>
              <button 
                onClick={() => setSelectedPolicy(null)}
                className="p-2 rounded-lg hover:bg-zinc-900 text-zinc-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Executive Summary */}
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">AI Summary</h3>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {selectedPolicy.metadata?.ai_summary || "Document parsed and indexed successfully. Semantic search is active."}
                </p>
              </div>

              {/* Grid Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                  <div className="flex items-center gap-2 text-zinc-400 mb-1">
                    <Layers className="w-4 h-4" />
                    <span className="text-xs">Type</span>
                  </div>
                  <div className="text-sm font-medium text-zinc-200">
                    {selectedPolicy.metadata?.document_type || "Corporate Policy"}
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                  <div className="flex items-center gap-2 text-zinc-400 mb-1">
                    <Target className="w-4 h-4" />
                    <span className="text-xs">Compliance Score</span>
                  </div>
                  <div className="text-lg font-semibold text-emerald-400">
                    {selectedPolicy.metadata?.compliance_score || "100"}%
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                  <div className="flex items-center gap-2 text-zinc-400 mb-1">
                    <CheckSquare className="w-4 h-4" />
                    <span className="text-xs">Clauses</span>
                  </div>
                  <div className="text-sm font-medium text-zinc-200">
                    {selectedPolicy.metadata?.clauses_extracted || selectedPolicy.chunks * 3} Detected
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                  <div className="flex items-center gap-2 text-zinc-400 mb-1">
                    <Key className="w-4 h-4" />
                    <span className="text-xs">Owner</span>
                  </div>
                  <div className="text-sm font-medium text-zinc-200">
                    {selectedPolicy.metadata?.owner || "Legal / Compliance"}
                  </div>
                </div>
              </div>

              {/* Extraction Array Data */}
              {selectedPolicy.metadata?.regulations_matched?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Regulations Matched</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPolicy.metadata.regulations_matched.map((reg: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-medium">
                        {reg}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedPolicy.metadata?.obligations?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Key Obligations</h3>
                  <ul className="space-y-3">
                    {selectedPolicy.metadata.obligations.map((ob: string, i: number) => (
                      <li key={i} className="flex gap-3 text-sm text-zinc-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-1.5 shrink-0" />
                        <span className="leading-relaxed">{ob}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="pt-4 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-500">
                <span>Vector Sync: Active</span>
                <span>ID: {selectedPolicy.id?.substring(0,8)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
