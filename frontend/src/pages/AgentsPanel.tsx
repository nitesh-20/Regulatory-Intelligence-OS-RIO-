import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  FileText, 
  Play, 
  Terminal, 
  Activity, 
  Copy,
  DollarSign,
  Maximize2,
  Clock,
  Code,
  Network,
  CheckCircle
} from 'lucide-react';

const agentConfigurations = [
  {
    name: "PlannerAgent",
    role: "Central Orchestration Brain",
    model: "Gemini 2.5 Pro",
    tools: ["delegate_to_agent", "aggregate_results"],
    prompt: "You are the central Planner Agent of RIO. Your role is to orchestrate a team of multi-agent specialists to address enterprise compliance goals...",
    status: "ACTIVE",
    tokens: 4200,
    latency: "120ms",
    memory: "3.4 MB",
    icon: Cpu
  },
  {
    name: "SearchAgent",
    role: "Regulatory Scraper & Hash Tracker",
    model: "Gemini 2.5 Flash",
    tools: ["monitor_sources", "check_version_db_tool"],
    prompt: "You are the continuous Monitoring Agent. Spot updates to official gazettes, download PDFs, and verify database versions...",
    status: "ACTIVE",
    tokens: 1800,
    latency: "240ms",
    memory: "1.2 MB",
    icon: Search
  },
  {
    name: "DocumentAgent",
    role: "OCR Layout Parser & Vector Sync",
    model: "Gemini 2.5 Flash",
    tools: ["search_documents", "extract_obligations"],
    prompt: "You are a document extraction and ingestion specialist. Perform OCR, structural cleanups, and extract entities...",
    status: "ACTIVE",
    tokens: 8500,
    latency: "380ms",
    memory: "12.8 MB",
    icon: FileText
  },
  {
    name: "ComplianceAgent",
    role: "Twin Policy Obligations Evaluator",
    model: "Gemini 2.5 Pro",
    tools: ["extract_obligations", "query_policy_vector_index"],
    prompt: "You are the Compliance Agent. Map parsed regulations directly against corporate policies to evaluate alignment...",
    status: "ACTIVE",
    tokens: 12400,
    latency: "410ms",
    memory: "6.2 MB",
    icon: ShieldCheck
  },
  {
    name: "RiskAgent",
    role: "Exposure & Priority Analyst",
    model: "Gemini 2.5 Flash",
    tools: ["risk_analysis"],
    prompt: "You are a compliance risk assessment officer. Calculate risk exposure scores, criticality levels, and map affected teams...",
    status: "ACTIVE",
    tokens: 3100,
    latency: "95ms",
    memory: "2.1 MB",
    icon: ShieldAlert
  },
  {
    name: "ReportAgent",
    role: "Executive Summary Compiler",
    model: "Gemini 2.5 Flash",
    tools: ["compile_report", "notify_slack"],
    prompt: "You generate clear executive summaries from technical risk assessments and notify relevant stakeholders...",
    status: "ACTIVE",
    tokens: 2100,
    latency: "115ms",
    memory: "4.5 MB",
    icon: FileText
  }
];

export default function AgentsPanel() {
  const [selectedAgent, setSelectedAgent] = useState(agentConfigurations[0]);
  const [activeNode, setActiveNode] = useState<string>("Planner");
  const [isRunning, setIsRunning] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [liveLogs, setLiveLogs] = useState<{time: string, type: string, message: string}[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [liveLogs]);

  // Simulation logic mimicking the user's requested flow
  useEffect(() => {
    if (!isRunning) return;
    
    const flowSequence = [
      { node: "Planner", type: "INFO", message: "🧠 PlannerAgent -> SearchAgent: Find latest RBI circular on Payment Aggregators." },
      { node: "Search", type: "SUCCESS", message: "🔍 SearchAgent ✓ Retrieved 3 documents." },
      { node: "Document", type: "SUCCESS", message: "📄 DocumentAgent ✓ Parsed 127 clauses." },
      { node: "Compliance", type: "SUCCESS", message: "⚖ ComplianceAgent ✓ Found 5 compliance obligations." },
      { node: "Risk", type: "SUCCESS", message: "📊 RiskAgent ✓ Overall Risk Score: 87" },
      { node: "Report", type: "SUCCESS", message: "📑 ReportAgent ✓ Executive Summary Generated." }
    ];
    
    let currentIdx = 0;
    setLiveLogs([{ time: new Date().toLocaleTimeString([], { hour12: false }), type: "INFO", message: "System initializing mission sequence..." }]);
    setActiveNode("Planner");

    const interval = setInterval(() => {
      if (currentIdx < flowSequence.length) {
        const step = flowSequence[currentIdx];
        setActiveNode(step.node);
        
        const timestamp = new Date().toLocaleTimeString([], { hour12: false });
        setLiveLogs(prev => [...prev, { time: timestamp, type: step.type, message: step.message }]);
        currentIdx++;
      } else {
        // Loop restart
        currentIdx = 0;
        setLiveLogs(prev => [...prev, { 
          time: new Date().toLocaleTimeString([], { hour12: false }), 
          type: "INFO", 
          message: "Cycle completed. Listening for next triggers..." 
        }]);
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [isRunning]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="space-y-4 text-zinc-200 select-none max-w-[1600px] mx-auto min-h-[calc(100vh-4rem)] flex flex-col">
      
      {/* 1. TOP HUD (Mission Control) */}
      <div className="shrink-0 p-4 rounded-xl bg-zinc-950/50 border border-zinc-900 shadow-sm relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-1/4 w-[500px] h-[200px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
        <div className="absolute top-0 right-0 w-[300px] h-[150px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isRunning ? 'bg-indigo-400' : 'bg-zinc-500'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isRunning ? 'bg-indigo-500' : 'bg-zinc-500'}`}></span>
              </span>
              <h1 className="text-sm font-semibold tracking-wide text-zinc-100 uppercase font-sans flex items-center gap-2">
                <Network className="w-4 h-4 text-zinc-400" />
                RIO AI Mission Control
              </h1>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1 ml-5 font-mono tracking-wider">
              STATE: <span className={isRunning ? "text-indigo-400" : "text-zinc-400"}>{isRunning ? "Executing RBI Workflow" : "Idle Dashboard"}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[10.5px]">
            <div className="flex gap-4 px-4 py-2 rounded-lg bg-zinc-900/50 border border-zinc-800/80 backdrop-blur">
              <div>
                <span className="text-zinc-500 block text-[9px] font-bold uppercase tracking-widest">Active Fleet</span>
                <span className="text-zinc-100 font-semibold mt-0.5 block font-mono text-xs">6 Agents</span>
              </div>
              <div className="w-px bg-zinc-800/80"></div>
              <div>
                <span className="text-zinc-500 block text-[9px] font-bold uppercase tracking-widest">MCP Tools</span>
                <span className="text-zinc-100 font-semibold mt-0.5 block font-mono text-xs">18 Connected</span>
              </div>
              <div className="w-px bg-zinc-800/80"></div>
              <div>
                <span className="text-zinc-500 block text-[9px] font-bold uppercase tracking-widest">System Health</span>
                <span className="text-emerald-400 font-semibold mt-0.5 block font-mono text-xs">99.9%</span>
              </div>
            </div>

            <button 
              onClick={() => setIsRunning(!isRunning)}
              className={`px-4 py-2.5 rounded-lg font-bold tracking-wide uppercase text-[10px] shadow-xl transition-all flex items-center gap-2 border ${
                isRunning 
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20 hover:border-rose-500/50 hover:shadow-rose-500/20' 
                  : 'bg-zinc-100 text-zinc-950 hover:bg-white border-white/20 hover:shadow-white/20'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isRunning ? "Halt Engine" : "Initiate Run"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 overflow-hidden">
        
        {/* 2. LEFT PANEL: Live Agent Fleet */}
        <div className="lg:col-span-1 flex flex-col gap-2 overflow-y-auto pr-2 scrollbar-thin min-h-[500px] max-h-[800px]">
          <div className="sticky top-0 bg-[#040405]/90 backdrop-blur-xl z-10 pb-2">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest px-1 flex items-center gap-1.5">
              <Activity className="w-3 h-3" />
              Agent Fleet
            </span>
          </div>
          
          {agentConfigurations.map((agent) => {
            const isSelected = agent.name === selectedAgent.name;
            const isAgentActiveInGraph = activeNode.toLowerCase().includes(agent.name.toLowerCase().replace("agent", "")) && isRunning;
            
            return (
              <motion.div
                whileHover={{ scale: 1.01 }}
                key={agent.name}
                onClick={() => setSelectedAgent(agent)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all relative overflow-hidden group ${
                  isSelected 
                    ? 'bg-zinc-900/40 border-zinc-700 shadow-md shadow-black/50' 
                    : 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-800'
                }`}
              >
                {/* Visual active execution pulse */}
                <AnimatePresence>
                  {isAgentActiveInGraph && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-indigo-500/5" 
                    />
                  )}
                </AnimatePresence>
                
                {isAgentActiveInGraph && (
                  <div className="absolute left-0 top-0 w-1 h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                )}

                <div className="flex items-start gap-3 relative z-10">
                  <div className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-zinc-800 text-zinc-100' : 'bg-zinc-900 text-zinc-400 group-hover:text-zinc-300'
                  }`}>
                    <agent.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-200 tracking-wide truncate">{agent.name}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${isAgentActiveInGraph ? 'bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,1)]' : 'bg-emerald-500/40'}`} />
                    </div>
                    <p className="text-[10px] text-zinc-500 truncate mt-0.5">{agent.role}</p>

                    <div className="mt-2.5 pt-2 border-t border-zinc-800/50 flex justify-between text-[9px] font-mono text-zinc-500">
                      <div className="flex items-center gap-1"><Clock className="w-2.5 h-2.5"/> {agent.latency}</div>
                      <div className="flex items-center gap-1"><Activity className="w-2.5 h-2.5"/> {agent.memory}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 3. CENTER PANEL: Interactive SVG Execution Graph */}
        <div className="lg:col-span-2 rounded-xl bg-[#09090b] border border-zinc-900 shadow-xl flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
          
          <div className="flex items-center justify-between p-4 border-b border-zinc-900 relative z-10 bg-[#09090b]/80 backdrop-blur-sm">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5" />
              Execution Graph
            </span>
            <span className="text-[9px] font-mono px-2 py-1 rounded bg-zinc-900/80 text-emerald-400 border border-zinc-800 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`}></span>
              Status: {isRunning ? "Streaming" : "Idle"}
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center relative p-6 w-full">
            
            {/* Background SVG for Paths */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: '100%' }}>
              <defs>
                <linearGradient id="flowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="1" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <g className="opacity-40">
                <path d="M 50% 12% L 50% 88%" stroke="#27272a" strokeWidth="2" fill="none" />
              </g>
              {isRunning && (
                <path 
                  d="M 50% 12% L 50% 88%" 
                  stroke="url(#flowGradient)" 
                  strokeWidth="2" 
                  fill="none" 
                  strokeDasharray="6, 8"
                  className="animate-[dash_1s_linear_infinite]"
                  style={{ animation: 'dash 1s linear infinite' }}
                />
              )}
            </svg>

            {/* Vertically Stacked Nodes */}
            <div className="flex flex-col h-full w-full max-w-[280px] justify-between relative z-10 py-4">
              
              {["Planner", "Search", "Document", "Compliance", "Risk", "Report"].map((node) => {
                const isActive = activeNode === node && isRunning;
                const isPast = isRunning && ["Planner", "Search", "Document", "Compliance", "Risk", "Report"].indexOf(activeNode) > ["Planner", "Search", "Document", "Compliance", "Risk", "Report"].indexOf(node);
                
                let bgColor = "bg-[#09090b]";
                let borderColor = "border-zinc-800";
                let textColor = "text-zinc-500";
                let shadow = "";

                if (isActive) {
                  bgColor = "bg-indigo-500/10";
                  borderColor = "border-indigo-500";
                  textColor = "text-indigo-300";
                  shadow = "shadow-[0_0_15px_rgba(99,102,241,0.2)]";
                } else if (isPast) {
                  borderColor = "border-emerald-500/30";
                  textColor = "text-emerald-500/80";
                }

                return (
                  <motion.div 
                    key={node}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: isActive ? 1.05 : 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`w-full py-3 px-4 rounded-xl border flex items-center justify-between transition-all duration-300 backdrop-blur-md ${bgColor} ${borderColor} ${textColor} ${shadow}`}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-widest font-mono flex items-center gap-2">
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping absolute -left-1"></span>}
                      {node}
                    </span>
                    {isPast && <CheckCircle className="w-3.5 h-3.5 text-emerald-500/50" />}
                    {isActive && <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />}
                  </motion.div>
                );
              })}

            </div>
          </div>
          
          {/* Controls */}
          <div className="flex justify-between items-center text-[9px] font-semibold text-zinc-500 border-t border-zinc-900 p-3 bg-[#09090b]/80 backdrop-blur-sm z-10">
            <span className="flex items-center gap-3">
              <span className="hover:text-zinc-300 cursor-pointer transition-colors">Zoom 100%</span>
              <span className="w-1 h-1 rounded-full bg-zinc-800"></span>
              <span className="hover:text-zinc-300 cursor-pointer transition-colors">Grid Snap</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-zinc-300 cursor-pointer transition-colors uppercase tracking-wider">
              <Maximize2 className="w-3 h-3" />
              Fullscreen
            </span>
          </div>
        </div>

        {/* 4. RIGHT PANEL: AI Inspector */}
        <div className="lg:col-span-1 p-5 rounded-xl bg-zinc-950/80 border border-zinc-900 shadow-xl flex flex-col relative overflow-hidden backdrop-blur-xl">
          <div className="flex-1 space-y-6 overflow-y-auto scrollbar-thin pr-2">
            
            <div className="pb-4 border-b border-zinc-900">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5 mb-3">
                <Code className="w-3 h-3" />
                AI Inspector
              </span>
              <h3 className="text-sm font-bold text-zinc-100 tracking-wide">{selectedAgent.name}</h3>
              <p className="text-[10px] text-zinc-500 mt-1">Scope: <span className="font-mono text-indigo-400/80 bg-indigo-500/10 px-1 py-0.5 rounded">{selectedAgent.model}</span></p>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
              <div className="p-3 rounded-lg bg-[#040405] border border-zinc-900">
                <span className="text-[9px] text-zinc-600 font-sans font-bold uppercase tracking-widest block mb-1">Est. Cost</span>
                <span className="text-zinc-300 font-bold flex items-center text-xs">
                  <DollarSign className="w-3 h-3 text-zinc-500 mr-0.5" />
                  {(selectedAgent.tokens * 0.000015).toFixed(4)}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[#040405] border border-zinc-900">
                <span className="text-[9px] text-zinc-600 font-sans font-bold uppercase tracking-widest block mb-1">Compute Load</span>
                <span className="text-zinc-300 font-bold flex items-center gap-1.5 text-xs">
                  <Clock className="w-3 h-3 text-zinc-500" />
                  {selectedAgent.latency}
                </span>
              </div>
            </div>

            {/* MCP Tools */}
            <div className="space-y-2">
              <label className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest block">Active Tools</label>
              <div className="flex flex-wrap gap-2">
                {selectedAgent.tools.map(tool => (
                  <span key={tool} className="text-[9px] font-mono text-emerald-400/80 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded shadow-sm">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* System Prompt */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest block">System Context</label>
                <button 
                  onClick={() => copyToClipboard(selectedAgent.prompt)}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              <div className="p-4 rounded-lg bg-[#040405] border border-zinc-900 text-zinc-400 text-[10px] leading-loose font-mono relative group">
                {selectedAgent.prompt}
                <div className="absolute inset-0 bg-gradient-to-t from-[#040405] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-lg" />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 5. BOTTOM PANEL: Live Terminal */}
      <div className="shrink-0 h-[280px] rounded-xl bg-[#030303] border border-zinc-900 shadow-2xl flex flex-col overflow-hidden mb-6">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest font-sans">Execution Trace Logs</span>
          </div>
          <div className="flex gap-2">
             <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed space-y-2 scrollbar-thin">
          <AnimatePresence initial={false}>
            {liveLogs.map((log, idx) => {
              let colorClass = "text-zinc-400";
              if (log.type === "SUCCESS") colorClass = "text-emerald-400";
              
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10, x: -5 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  key={idx} 
                  className="flex items-start gap-4 hover:bg-zinc-900/30 p-1 -mx-1 rounded transition-colors"
                >
                  <span className="text-zinc-700 shrink-0 select-none w-16">{log.time}</span>
                  <span className={`${colorClass} break-words whitespace-pre-wrap`}>
                    {log.message}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={terminalEndRef} className="h-2" />
        </div>
      </div>
      
      {/* Global CSS for Stroke Dash Animation */}
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -28; }
        }
      `}</style>

    </div>
  );
}
