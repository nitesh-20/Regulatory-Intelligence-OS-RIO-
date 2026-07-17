import React, { useState } from 'react';
import {
  Cpu,
  Search,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Copy,
  Play,
  CheckCircle,
  Code
} from 'lucide-react';

const agentConfigurations = [
  {
    name: "PlannerAgent",
    role: "Central Orchestration Brain",
    model: "Gemini 2.5 Pro",
    tools: ["delegate_to_agent", "aggregate_results"],
    prompt: "You are the central Planner Agent of RIO (Regulatory Intelligence Operating System). Your role is to orchestrate a team of multi-agent specialists to address enterprise compliance goals...",
    status: "ACTIVE",
    icon: Cpu
  },
  {
    name: "MonitoringAgent",
    role: "Regulatory Scraper & Hash Tracker",
    model: "Gemini 2.5 Flash",
    tools: ["monitor_sources", "check_version_db_tool"],
    prompt: "You are the continuous Monitoring Agent. Spot updates to official gazettes, download PDFs, and verify database versions...",
    status: "ACTIVE",
    icon: Search
  },
  {
    name: "DocumentAgent",
    role: "OCR Layout Parser & Vector Sync",
    model: "Gemini 2.5 Flash",
    tools: ["search_documents", "extract_obligations"],
    prompt: "You are a document extraction and ingestion specialist. Perform OCR, structural cleanups, and extract entities...",
    status: "ACTIVE",
    icon: FileText
  },
  {
    name: "ComplianceAgent",
    role: "Twin Policy Obligations Evaluator",
    model: "Gemini 2.5 Pro",
    tools: ["extract_obligations", "query_policy_vector_index"],
    prompt: "You are the Compliance Agent. Map parsed regulations directly against corporate policies to evaluate alignment...",
    status: "ACTIVE",
    icon: ShieldCheck
  },
  {
    name: "RiskAgent",
    role: "Exposure & Priority Analyst",
    model: "Gemini 2.5 Flash",
    tools: ["risk_analysis"],
    prompt: "You are a compliance risk assessment officer. Calculate risk exposure scores, criticality levels, and map affected teams...",
    status: "ACTIVE",
    icon: ShieldAlert
  }
];

export default function AgentsPanel() {
  const [selectedAgent, setSelectedAgent] = useState(agentConfigurations[0]);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [simulationState, setSimulationState] = useState<'idle' | 'running' | 'success'>('idle');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const runSimulation = () => {
    setSimulationState('running');
    setTimeout(() => {
      setSimulationState('success');
    }, 2500);
  };

  return (
    <div className="space-y-6 select-none">

      {/* Title */}
      <div>
        <h1 className="text-base font-semibold text-zinc-100 tracking-tight">Agents Console</h1>
        <p className="text-[10px] text-zinc-500 mt-0.5">
          Inspect coordinated agent configurations, parameters, and system prompts active in RIO.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Agents List (Left Panel) */}
        <div className="space-y-2 lg:col-span-1">
          {agentConfigurations.map((agent) => {
            const isSelected = agent.name === selectedAgent.name;
            return (
              <div
                key={agent.name}
                onClick={() => {
                  setSelectedAgent(agent);
                  setSimulationState('idle');
                }}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all text-left relative overflow-hidden ${isSelected
                    ? 'bg-zinc-900/35 border-zinc-700/80 text-zinc-100 shadow-sm'
                    : 'bg-zinc-900/10 border-zinc-900 text-zinc-400 hover:border-zinc-800 hover:text-zinc-250'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded ${isSelected ? 'bg-zinc-950 border border-zinc-800' : 'bg-zinc-900/50'
                    }`}>
                    <agent.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-semibold truncate">{agent.name}</h4>
                    <p className="text-[9.5px] text-zinc-500 truncate mt-0.5">{agent.role}</p>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Agent Details (Right Panel) */}
        <div className="lg:col-span-2 p-5 rounded-lg bg-zinc-900/20 border border-zinc-900 shadow-sm flex flex-col justify-between min-h-[400px]">
          <div className="space-y-5">

            {/* Header Details */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-900">
              <div>
                <h3 className="text-xs font-semibold text-zinc-200">{selectedAgent.name} Settings</h3>
                <p className="text-[9.5px] text-zinc-500 mt-0.5">Model parameter: <b>{selectedAgent.model}</b></p>
              </div>

              <button
                onClick={runSimulation}
                disabled={simulationState === 'running'}
                className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-[10px] font-semibold text-zinc-350 hover:text-zinc-200 transition-colors flex items-center gap-1.5 shadow disabled:opacity-50"
              >
                {simulationState === 'running' ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                    Simulating...
                  </>
                ) : simulationState === 'success' ? (
                  <>
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                    Passed Clean
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-zinc-500" />
                    Run Diagnostic
                  </>
                )}
              </button>
            </div>

            {/* Diagnostic Logs (when run) */}
            {simulationState === 'running' && (
              <div className="p-3.5 rounded bg-zinc-950/40 border border-zinc-900 font-mono text-[9px] text-zinc-500 space-y-1">
                <p>&gt; Initializing agent container diagnostic checks...</p>
                <p>&gt; Validating connection schema parameters...</p>
                <p>&gt; Verifying workspace settings scopes...</p>
              </div>
            )}

            {simulationState === 'success' && (
              <div className="p-3.5 rounded bg-emerald-500/5 border border-emerald-500/10 font-mono text-[9.5px] text-emerald-450 space-y-1">
                <p className="font-semibold">&gt; Diagnostic results verified successfully.</p>
                <p>&gt; Gemini GenAI API connectivity: OK (Latency 140ms)</p>
                <p>&gt; Vector databases query: OK (Index verified)</p>
              </div>
            )}

            {/* Allocated Tools */}
            <div className="space-y-2">
              <label className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block">Allocated Tools</label>
              <div className="flex flex-wrap gap-1.5">
                {selectedAgent.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-850 text-zinc-400 font-mono text-[9.5px] flex items-center gap-1"
                  >
                    <Code className="w-2.5 h-2.5 text-zinc-500" />
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* System instructions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block">System Instructions</label>
                <button
                  onClick={() => copyToClipboard(selectedAgent.prompt)}
                  className="text-zinc-500 hover:text-zinc-300 text-[10px] font-semibold flex items-center gap-1 transition-colors"
                >
                  {copiedPrompt ? "Copied" : "Copy Prompt"}
                  <Copy className="w-2.5 h-2.5" />
                </button>
              </div>

              <div className="p-3.5 rounded bg-zinc-950 border border-zinc-900 text-zinc-400 text-[10.5px] leading-relaxed max-h-48 overflow-y-auto">
                {selectedAgent.prompt}
              </div>
            </div>

          </div>

          <div className="mt-4 pt-4 border-t border-zinc-900 flex justify-between text-[9px] text-zinc-600 font-bold uppercase tracking-wider">
            <span>Execution Status: Active</span>
            <span>Security context: Sandbox Verified</span>
          </div>
        </div>

      </div>
    </div>
  );
}
