import React, { useState } from 'react';
import { Save, ShieldCheck, Key } from 'lucide-react';

export default function Settings() {
  const [profile, setProfile] = useState({
    companyName: 'Fintech Sandbox Org',
    industry: 'Financial Services / Payments',
    regions: 'IN, US, EU',
    employees: '120'
  });

  const [keys, setKeys] = useState({
    geminiKey: '••••••••••••••••••••••••',
    clerkKey: '••••••••••••••••••••••••'
  });

  return (
    <div className="space-y-6 select-none">
      {/* Title */}
      <div>
        <h1 className="text-base font-semibold text-zinc-100 tracking-tight">Workspace Settings</h1>
        <p className="text-[10px] text-zinc-500 mt-0.5">
          Manage corporate profile thresholds, key scopes, and API credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Profile Card */}
        <div className="p-5 rounded-lg bg-zinc-900/20 border border-zinc-900 shadow-sm space-y-4">
          <h3 className="text-[11px] font-semibold text-zinc-300 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
            Corporate Identity
          </h3>

          <div className="space-y-3.5">
            <div>
              <label className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block mb-1">Company Name</label>
              <input
                type="text"
                value={profile.companyName}
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-850 rounded py-1.5 px-3 text-[11px] text-zinc-300 focus:outline-none focus:border-zinc-700 transition-colors"
              />
            </div>

            <div>
              <label className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block mb-1">Industry Classification</label>
              <input
                type="text"
                value={profile.industry}
                onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-850 rounded py-1.5 px-3 text-[11px] text-zinc-300 focus:outline-none focus:border-zinc-700 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block mb-1">Jurisdictions</label>
                <input
                  type="text"
                  value={profile.regions}
                  onChange={(e) => setProfile({ ...profile, regions: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded py-1.5 px-3 text-[11px] text-zinc-300 focus:outline-none focus:border-zinc-700 transition-colors"
                />
              </div>

              <div>
                <label className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block mb-1">Employees</label>
                <input
                  type="text"
                  value={profile.employees}
                  onChange={(e) => setProfile({ ...profile, employees: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded py-1.5 px-3 text-[11px] text-zinc-300 focus:outline-none focus:border-zinc-700 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button className="px-3 py-1.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-[10.5px] font-semibold flex items-center gap-1.5 transition-colors shadow">
              <Save className="w-3 h-3" />
              Save Identity Settings
            </button>
          </div>
        </div>

        {/* API Credentials */}
        <div className="p-5 rounded-lg bg-zinc-900/20 border border-zinc-900 shadow-sm space-y-4">
          <h3 className="text-[11px] font-semibold text-zinc-300 flex items-center gap-2">
            <Key className="w-3.5 h-3.5 text-zinc-500" />
            Security Scopes & Keys
          </h3>

          <div className="space-y-3.5">
            <div>
              <label className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block mb-1">Gemini API Key</label>
              <input
                type="password"
                value={keys.geminiKey}
                onChange={(e) => setKeys({ ...keys, geminiKey: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-850 rounded py-1.5 px-3 text-[11px] text-zinc-300 focus:outline-none focus:border-zinc-700 transition-colors font-mono"
              />
            </div>

            <div>
              <label className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block mb-1">External Log API Endpoint</label>
              <input
                type="text"
                disabled
                value="https://api.rio-compliance.com/v1/ingest"
                className="w-full bg-zinc-900 border border-zinc-850 rounded py-1.5 px-3 text-[11px] text-zinc-500 select-all cursor-text font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button className="px-3 py-1.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-[10.5px] font-semibold flex items-center gap-1.5 transition-colors shadow">
              <Save className="w-3 h-3" />
              Update API Scopes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
