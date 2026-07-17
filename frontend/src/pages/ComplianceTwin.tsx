import React, { useState } from 'react';
import { Upload, Shield, FileText } from 'lucide-react';

export default function ComplianceTwin() {
  const [policies] = useState([
    { name: 'Corporate Privacy Policy v1.4.pdf', size: '2.4 MB', uploaded: '2 days ago', status: 'SYNCHRONIZED', chunks: 142 },
    { name: 'Database & Data Security controls.md', size: '18 KB', uploaded: '3 days ago', status: 'SYNCHRONIZED', chunks: 24 },
    { name: 'SEC Cyber Risk Policy Draft.docx', size: '1.2 MB', uploaded: 'Just now', status: 'PROCESSING', chunks: 0 },
  ]);

  const [gaps] = useState([
    { id: 1, title: 'Inadequate Data Retention Policy', policy: 'Corporate Privacy Policy v1.4.pdf', regulation: 'DPDP Act Section 11', severity: 'HIGH', status: 'OPEN', description: 'Your policy permits indefinite data storage. Under the DPDP Act, personal data must be erased as soon as the purpose for collection is served.' },
    { id: 2, title: 'Database Encryption Key Strength', policy: 'Database & Data Security controls.md', regulation: 'SEC Cyber Disclosure Rule 12', severity: 'CRITICAL', status: 'OPEN', description: 'Your current controls mandate AES-128 encryption. The revised guidelines require AES-256 for public-facing database instances.' },
  ]);

  return (
    <div className="space-y-6">
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
          <div className="p-6 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 hover:border-indigo-500/40 transition-colors flex flex-col items-center justify-center text-center cursor-pointer">
            <div className="p-3 rounded-full bg-slate-950 border border-slate-800 text-slate-400 mb-3 group hover:text-indigo-400 transition-colors">
              <Upload className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-semibold text-slate-200">Upload Policy Documents</h4>
            <p className="text-[10px] text-slate-500 mt-1 max-w-[200px] leading-relaxed">
              Support PDF, Markdown, DOCX. Files are parsed, chunked, and vectorized automatically.
            </p>
            <button className="mt-4 px-3 py-1.5 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold">
              Select Files
            </button>
          </div>

          {/* Active Policies List */}
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 shadow-md">
            <h3 className="text-xs font-bold text-slate-300 mb-4 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-indigo-400" />
              Indexed Corporate Policies
            </h3>
            <div className="space-y-3">
              {policies.map((policy, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950/40 border border-slate-850 flex items-start gap-3">
                  <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-semibold text-slate-200 truncate">{policy.name}</h4>
                    <p className="text-[9px] text-slate-500 mt-0.5">{policy.size} • {policy.uploaded}</p>
                  </div>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                    policy.status === 'SYNCHRONIZED' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                  }`}>
                    {policy.status}
                  </span>
                </div>
              ))}
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
            <span className="text-[10px] text-rose-455 font-bold px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/10">
              Needs Attention
            </span>
          </div>

          <div className="space-y-4">
            {gaps.map((gap) => (
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
                    <h4 className="text-xs font-semibold text-slate-200">{gap.title}</h4>
                  </div>
                  <span className="text-[9px] text-indigo-400 font-bold">{gap.regulation}</span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  {gap.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-900 text-[10px] text-slate-500">
                  <span className="truncate max-w-[250px] font-medium">Mapped Document: {gap.policy}</span>
                  <div className="flex gap-2">
                    <button className="text-[9px] px-2 py-1 rounded bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-750 font-semibold">
                      Create Jira Ticket
                    </button>
                    <button className="text-[9px] px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow shadow-indigo-600/10">
                      Remediate Gap
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
