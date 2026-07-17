import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Key, ShieldCheck } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-100 mb-1">Workspace Settings</h1>
        <p className="text-xs text-slate-400">
          Manage corporate profile thresholds, key scopes, and API credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Profile Configuration */}
        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 shadow-md space-y-4">
          <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            Corporate Identity
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Company Name</label>
              <input
                type="text"
                value={profile.companyName}
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                className="w-full bg-slate-950/60 border border-slate-850 rounded-lg py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Industry Classification</label>
              <input
                type="text"
                value={profile.industry}
                onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                className="w-full bg-slate-950/60 border border-slate-850 rounded-lg py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Jurisdictions</label>
                <input
                  type="text"
                  value={profile.regions}
                  onChange={(e) => setProfile({ ...profile, regions: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-850 rounded-lg py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Headcount</label>
                <input
                  type="text"
                  value={profile.employees}
                  onChange={(e) => setProfile({ ...profile, employees: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-850 rounded-lg py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-850">
            <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow shadow-indigo-600/10 flex items-center gap-1.5 transition-colors">
              <Save className="w-3.5 h-3.5" />
              Save Identity Settings
            </button>
          </div>
        </div>

        {/* API Credentials */}
        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 shadow-md space-y-4">
          <h3 className="text-xs font-bold text-slate-355 uppercase tracking-wider flex items-center gap-1.5">
            <Key className="w-4 h-4 text-indigo-400" />
            Connected Credentials
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Google Gemini API Key</label>
              <input
                type="password"
                value={keys.geminiKey}
                onChange={(e) => setKeys({ ...keys, geminiKey: e.target.value })}
                className="w-full bg-slate-950/60 border border-slate-850 rounded-lg py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Clerk Authentication Publishable Key</label>
              <input
                type="password"
                value={keys.clerkKey}
                onChange={(e) => setKeys({ ...keys, clerkKey: e.target.value })}
                className="w-full bg-slate-950/60 border border-slate-850 rounded-lg py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-850">
            <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow shadow-indigo-600/10 flex items-center gap-1.5 transition-colors">
              <Save className="w-3.5 h-3.5" />
              Save Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
