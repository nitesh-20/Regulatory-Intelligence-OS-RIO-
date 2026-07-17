import React, { useState } from 'react';
import { 
  Cpu, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  FileText, 
  Copy, 
  Play, 
  Sparkles, 
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
    role: "Regulatory Site Scraper & Hash Tracker",
    model: "Gemini 2.5 Flash",
    tools: ["monitor_sources", "check_version_db_tool"],
    prompt: "You are the continuous Monitoring Agent. Spot updates to official gazettes, download PDFs, and verify database versions...",
    status: "ACTIVE",
    icon: Search
  },
  {
    name: "DocumentAgent",
    role: "OCR Layout Parser & Vector DB Sync",
    model: "Gemini 2.5 Flash",
    tools: ["search_documents", "extract_obligations"],
    prompt: "You are a document extraction and ingestion specialist. Perform OCR, structural cleanups, and extract entities...",
    status: "ACTIVE",
    icon: FileText
  },
  {
    name: "ComplianceAgent",
    role: "Twin Policy & Obligations Evaluator",
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

  const triggerSimulation = () => {
    setSimulationState('running');
    setTimeout(() => {
      setSimulationState('success');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-100 mb-1">Multi-Agent Configuration Console</h1>
        <p className="text-xs text-slate-400">
          Inspect system prompts, allocated MCP tools, and execute agent dry runs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Agent Selection */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Agents Grid</h3>
          <div className="space-y-2">
            {agentConfigurations.map((agent) => (
              <button
                key={agent.name}
                onClick={() => {
                  setSelectedAgent(agent);
                  setSimulationState('idle');
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 relative group ${
                  selectedAgent.name === agent.name
                    ? 'bg-indigo-600/10 border-indigo-500/40 shadow-inner'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/60'
                }`}
              >
                <div className={`p-2 rounded-lg border bg-slate-950 ${
                  selectedAgent.name === agent.name ? 'text-indigo-400 border-indigo-500/20' : 'text-slate-400 border-slate-800'
                }`}>
                  <agent.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-semibold text-slate-200">{agent.name}</h4>
                    <span className="text-[8px] font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      {agent.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 truncate">{agent.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Agent Details / Control */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 shadow-md space-y-6">
            {/* Title & Metadata */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pb-4 border-b border-slate-850">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
                  <selectedAgent.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-200">{selectedAgent.name}</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">{selectedAgent.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-slate-400 px-2 py-1 rounded bg-slate-950 border border-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Model: {selectedAgent.model}
                </span>
              </div>
            </div>

            {/* System Instruction */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Code className="w-3.5 h-3.5" />
                  System Instructions
                </h4>
                <button
                  onClick={() => copyToClipboard(selectedAgent.prompt)}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  {copiedPrompt ? "Copied!" : "Copy Prompt"}
                </button>
              </div>
              <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-850/80 text-[11px] text-slate-400 leading-relaxed font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                {selectedAgent.prompt}
              </div>
            </div>

            {/* Active MCP Tools */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Allocated MCP Tools</h4>
              <div className="flex flex-wrap gap-2">
                {selectedAgent.tools.map((tool) => (
                  <span 
                    key={tool} 
                    className="text-[10px] font-semibold text-indigo-400 px-2.5 py-1 rounded-md bg-indigo-950/30 border border-indigo-900/40"
                  >
                    {tool}()
                  </span>
                ))}
              </div>
            </div>

            {/* Simulation Interface */}
            <div className="pt-4 border-t border-slate-850 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-medium">Verify system outputs using test dry run.</span>
              <button
                onClick={triggerSimulation}
                disabled={simulationState === 'running'}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow shadow-indigo-600/10 flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {simulationState === 'running' ? (
                  <>Evaluating...</>
                ) : simulationState === 'success' ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Dry Run Passed
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Execute Dry Run
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
