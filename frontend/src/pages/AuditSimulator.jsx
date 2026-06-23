import React, { useState } from 'react'
import { Play, ClipboardCheck, CheckCircle2, XCircle, AlertTriangle, RefreshCw, BarChart2 } from 'lucide-react'

export default function AuditSimulator() {
  const [isRunning, setIsRunning] = useState(false)
  const [activeReport, setActiveReport] = useState('DORA')
  const [readinessScore, setReadinessScore] = useState(82)

  const auditFrameworks = [
    { name: 'SEC Cyber Readiness', code: 'SEC-CYBER', lastRun: '2 days ago', status: 'PASSING', score: 87 },
    { name: 'DPDP Data Consent Audit', code: 'DPDP', lastRun: '4 days ago', status: 'WARNING', score: 71 },
    { name: 'Digital Operational Resilience (DORA)', code: 'DORA', lastRun: '1 week ago', status: 'PASSING', score: 82 },
  ]

  const simulatedChecks = [
    { id: 1, name: 'Database Encryption strength', type: 'Database Control', result: 'PASS', details: 'Validated that prod clusters utilize AES-256 (Compliance Policy Ref #3)' },
    { id: 2, name: 'Customer Consent manager audit trial logs', type: 'Consent Control', result: 'FAIL', details: 'Consent deletion request triggers do not currently push events to logs database (DPDP Art. 6)' },
    { id: 3, name: 'Material incident notification period check', type: 'Incident Management', result: 'PASS', details: 'Incident response handbook details 72-hour trigger logic for SEC alerts.' },
    { id: 4, name: 'Third-party SaaS integrations vendor risk logs', type: 'Vendor Management', result: 'WARNING', details: '3 vendors have expired SOC2 reports. Warning raised for DORA Section 5.' }
  ]

  const triggerAudit = () => {
    setIsRunning(true)
    setTimeout(() => {
      setIsRunning(false)
      setReadinessScore(84)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-100 mb-1">Audit Simulator</h1>
          <p className="text-xs text-slate-400">
            Sandbox tool that runs virtual regulatory audits using policy twin parameters and connected evidence.
          </p>
        </div>
        <button
          onClick={triggerAudit}
          disabled={isRunning}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Running Simulation...
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              Run Full Audit Simulation
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Frameworks Column */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/80 shadow-md">
            <h3 className="text-xs font-bold text-slate-300 mb-4 flex items-center gap-1.5">
              <ClipboardCheck className="w-4 h-4 text-indigo-400" />
              Audit Frameworks
            </h3>
            <div className="space-y-3">
              {auditFrameworks.map((framework) => (
                <div
                  key={framework.code}
                  onClick={() => setActiveReport(framework.code)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    activeReport === framework.code
                      ? 'bg-indigo-600/10 border-indigo-500/30'
                      : 'bg-slate-950/40 border-slate-850 hover:bg-slate-900/40 hover:border-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs font-semibold text-slate-200">{framework.name}</h4>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                      framework.status === 'PASSING' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {framework.status}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">Run: {framework.lastRun}</span>
                    <span className="text-xs font-bold font-display text-slate-300">{framework.score}% score</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audit Score & Detailed Log Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dashboard Summary score */}
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 shadow-md flex items-center gap-8">
            <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-4 border-indigo-500/20">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-r-transparent animate-pulse-slow"></div>
              <span className="text-2xl font-bold font-display text-indigo-400">{readinessScore}%</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Simulation Score: {activeReport}</h3>
              <p className="text-[11px] text-slate-400 mt-1 max-w-md leading-relaxed">
                Your company passes 3/4 major verification targets. There are 2 warnings and 1 blocking control failures. Remediation plans have been scheduled.
              </p>
              <div className="mt-3 flex gap-4 text-[10px] font-medium text-slate-500">
                <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 18 Passed</span>
                <span className="flex items-center gap-1"><XCircle className="w-3.5 h-3.5 text-rose-500" /> 1 Failed</span>
                <span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> 2 Warnings</span>
              </div>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 shadow-md">
            <h3 className="text-xs font-bold text-slate-300 mb-4 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-indigo-400" />
              Automated Check Verifications
            </h3>

            <div className="space-y-3">
              {simulatedChecks.map((check) => (
                <div key={check.id} className="p-4 rounded-xl bg-slate-950/40 border border-slate-850 flex items-start gap-4">
                  <div className="mt-0.5">
                    {check.result === 'PASS' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    {check.result === 'FAIL' && <XCircle className="w-4 h-4 text-rose-500" />}
                    {check.result === 'WARNING' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-xs font-semibold text-slate-200">{check.name}</h4>
                      <span className="text-[9px] text-slate-500">{check.type}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      {check.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
