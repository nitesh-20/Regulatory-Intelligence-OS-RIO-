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
    <div className="space-y-6 select-none max-w-[1600px] w-full mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Workspace Settings</h1>
        <p className="text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
          Manage corporate profile thresholds, key scopes, and API credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Profile Card */}
        <div className="p-6 rounded-xl bg-zinc-900/20 border border-zinc-900 shadow-sm space-y-5">
          <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-zinc-500" />
            Corporate Identity
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1.5">Company Name</label>
              <input
                type="text"
                value={profile.companyName}
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-850 rounded-lg py-2 px-4 text-sm text-zinc-300 focus:outline-none focus:border-zinc-700 transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1.5">Industry Classification</label>
              <input
                type="text"
                value={profile.industry}
                onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-850 rounded-lg py-2 px-4 text-sm text-zinc-300 focus:outline-none focus:border-zinc-700 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1.5">Jurisdictions</label>
                <input
                  type="text"
                  value={profile.regions}
                  onChange={(e) => setProfile({ ...profile, regions: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-lg py-2 px-4 text-sm text-zinc-300 focus:outline-none focus:border-zinc-700 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1.5">Employees</label>
                <input
                  type="text"
                  value={profile.employees}
                  onChange={(e) => setProfile({ ...profile, employees: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-lg py-2 px-4 text-sm text-zinc-300 focus:outline-none focus:border-zinc-700 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-sm font-semibold flex items-center gap-2 transition-colors shadow">
              <Save className="w-4 h-4" />
              Save Identity Settings
            </button>
          </div>
        </div>

        {/* API Credentials */}
        <div className="p-6 rounded-xl bg-zinc-900/20 border border-zinc-900 shadow-sm space-y-5">
          <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
            <Key className="w-4 h-4 text-zinc-500" />
            Security Scopes & Keys
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1.5">Gemini API Key</label>
              <input
                type="password"
                value={keys.geminiKey}
                onChange={(e) => setKeys({ ...keys, geminiKey: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-850 rounded-lg py-2 px-4 text-sm text-zinc-300 focus:outline-none focus:border-zinc-700 transition-colors font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1.5">External Log API Endpoint</label>
              <input
                type="text"
                disabled
                value="https://api.rio-compliance.com/v1/ingest"
                className="w-full bg-zinc-900 border border-zinc-850 rounded-lg py-2 px-4 text-sm text-zinc-500 select-all cursor-text font-mono"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-sm font-semibold flex items-center gap-2 transition-colors shadow">
              <Save className="w-4 h-4" />
              Update API Scopes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
