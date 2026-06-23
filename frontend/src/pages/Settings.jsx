import React, { useState } from 'react'
import { Settings as SettingsIcon, Key, Database, Building2, BellRing, Save } from 'lucide-react'

export default function Settings() {
  const [orgName, setOrgName] = useState('FinTech Sandbox')
  const [industry, setIndustry] = useState('Financial Services / Fintech')
  const [companySize, setCompanySize] = useState('10-50 employees')

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-100 mb-1">System Settings</h1>
        <p className="text-xs text-slate-400">
          Configure organization profiles, external database integrations, API credentials, and notification webhooks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Org Profile Setting Form */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 shadow-md space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-4">
              <Building2 className="w-4 h-4 text-indigo-400" />
              Organization Context Parameters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase">Organization Name</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-850 rounded-lg py-2.5 px-3.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/80"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase">Sector / Industry Category</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-850 rounded-lg py-2.5 px-3.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/80"
                >
                  <option>Financial Services / Fintech</option>
                  <option>Artificial Intelligence / SaaS</option>
                  <option>Healthcare / Biotech</option>
                  <option>Retail / E-Commerce</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase">Company Size Tier</label>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-850 rounded-lg py-2.5 px-3.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/80"
                >
                  <option>1-10 employees</option>
                  <option>10-50 employees</option>
                  <option>50-250 employees</option>
                  <option>250+ employees</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold uppercase">Jurisdictions of Operation</label>
                <input
                  type="text"
                  defaultValue="United States, European Union, India"
                  className="w-full bg-slate-950/60 border border-slate-850 rounded-lg py-2.5 px-3.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/80"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-850 flex justify-end">
            <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow flex items-center gap-2">
              <Save className="w-3.5 h-3.5" />
              Save Configuration
            </button>
          </div>
        </div>

        {/* Integration Credentials list */}
        <div className="space-y-6">
          {/* Databases Config Box */}
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 shadow-md">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-4">
              <Database className="w-4 h-4 text-indigo-400" />
              Connected Data Stores
            </h3>
            <div className="space-y-3">
              {[
                { name: 'PostgreSQL DB', status: 'CONNECTED', details: 'localhost:5432' },
                { name: 'Qdrant Vector DB', status: 'CONNECTED', details: 'localhost:6333' },
                { name: 'Redis Broker', status: 'CONNECTED', details: 'localhost:6379' },
              ].map((store, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-slate-950/40 border border-slate-850 text-xs">
                  <div>
                    <h4 className="font-semibold text-slate-300">{store.name}</h4>
                    <p className="text-[9px] text-slate-500 mt-0.5">{store.details}</p>
                  </div>
                  <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    {store.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Integrations Alerting Box */}
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 shadow-md">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-4">
              <BellRing className="w-4 h-4 text-indigo-400" />
              Alerting & Integrations
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Jira Software', status: 'CONFIGURED', url: 'sandbox.atlassian.net' },
                { name: 'Linear', status: 'NOT CONFIGURED', url: '—' },
                { name: 'Slack Alerts', status: 'CONFIGURED', url: '#regulatory-alerts' },
              ].map((int, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-slate-950/40 border border-slate-850 text-xs">
                  <div>
                    <h4 className="font-semibold text-slate-300">{int.name}</h4>
                    <p className="text-[9px] text-slate-500 mt-0.5">{int.url}</p>
                  </div>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                    int.status === 'CONFIGURED'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {int.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
