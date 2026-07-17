import React, { useState } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Loader2, 
  Cpu, 
  Clock, 
  ChevronRight, 
  ChevronDown, 
  Code,
  Sparkles,
  Layers
} from 'lucide-react';

interface ExecutionStep {
  agent: string;
  status: string;
  duration: number;
  tools_called: string[];
  tokens_used: number;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  planner_decisions?: any;
  steps?: ExecutionStep[];
  time_taken?: number;
  tokens?: number;
}

export default function AskImpact() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Welcome to the RIO Compliance terminal. Submit any audit objective or regulatory inquiry to launch multi-agent coordination.' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [activeSteps, setActiveSteps] = useState<ExecutionStep[]>([]);
  const [activeMetrics, setActiveMetrics] = useState<{ time: number; tokens: number } | null>(null);
  
  // Expanded state for thinking traces inside messages
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({});

  const suggestionPrompts = [
    "Identify compliance gaps for RBI Data Consent guidelines.",
    "Verify encryption policy alignment against FTC rules.",
    "Compare SEC Cyber Disclosure rules against current draft."
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/v1/planner/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: query })
      });

      if (!response.ok) {
        throw new Error('API Gateway failed to respond.');
      }

      const data = await response.json();
      
      setIsLoading(false);
      if (data.status === 'success') {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.final_response,
          planner_decisions: data.planner_decisions,
          steps: data.steps,
          time_taken: data.time_taken,
          tokens: data.tokens
        }]);

        // Auto load into right panel metrics
        setActivePlan(data.planner_decisions);
        setActiveSteps(data.steps);
        setActiveMetrics({ time: data.time_taken, tokens: data.tokens });
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Error: Planner execution was unsuccessful.'
        }]);
      }
    } catch (err: any) {
      setIsLoading(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Failed to connect to RIO Agent backplane: ${err.message}`
      }]);
    }
  };

  const toggleStepExpansion = (idx: number) => {
    setExpandedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] select-none">
      
      {/* Split Workspace Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-5 min-h-0">
        
        {/* Left Side: Chat Workspace (2 columns) */}
        <div className="lg:col-span-2 flex flex-col bg-zinc-900/10 border border-zinc-900 rounded-lg overflow-hidden justify-between">
          
          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div 
                  key={index}
                  onClick={() => {
                    if (msg.role === 'assistant' && msg.steps) {
                      setActivePlan(msg.planner_decisions);
                      setActiveSteps(msg.steps);
                      setActiveMetrics({ time: msg.time_taken || 0, tokens: msg.tokens || 0 });
                    }
                  }}
                  className={`flex gap-3 items-start ${isUser ? 'justify-end' : 'group cursor-pointer p-1.5 rounded-lg hover:bg-zinc-900/20 transition-colors'}`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                  )}

                  <div className={`p-4 rounded text-[11px] leading-relaxed max-w-xl space-y-3 ${
                    isUser 
                      ? 'bg-zinc-900/60 text-zinc-100 border border-zinc-800' 
                      : 'bg-zinc-900/10 text-zinc-300 border border-zinc-900/60'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {/* Thinking steps trace container (Cursor-Style) */}
                    {!isUser && msg.steps && (
                      <div className="border-t border-zinc-900/80 pt-2.5">
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStepExpansion(index);
                          }}
                          className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-zinc-300 transition-colors"
                        >
                          {expandedSteps[index] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                          <span>Orchestration Chain steps</span>
                          <span className="ml-auto text-[8px] bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 lowercase">
                            {msg.steps.length} nodes
                          </span>
                        </div>

                        {expandedSteps[index] && (
                          <div className="mt-2.5 space-y-2 pl-3 border-l border-zinc-800">
                            {msg.steps.map((step, idx) => (
                              <div key={idx} className="space-y-1">
                                <div className="flex items-center justify-between text-[9px]">
                                  <span className="font-semibold text-zinc-400 font-mono">{step.agent}</span>
                                  <span className="text-zinc-650">{step.duration}s</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {step.tools_called.map((tool) => (
                                    <span key={tool} className="text-[8px] font-mono text-zinc-550 bg-zinc-950 px-1 py-0.5 rounded border border-zinc-900">
                                      {tool}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-6 h-6 rounded bg-zinc-100 flex items-center justify-center shrink-0 shadow">
                      <User className="w-3.5 h-3.5 text-zinc-950" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <div className="p-4 rounded bg-zinc-900/10 border border-zinc-900 max-w-sm">
                  <div className="flex items-center gap-2 text-zinc-450 text-[10.5px] font-semibold">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Planner executing compliance graph...
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Prompt input zone */}
          <div className="p-4 border-t border-zinc-900/60 bg-[#08080a]">
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 justify-center mb-4 select-none">
                {suggestionPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="px-2.5 py-1.5 rounded bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-850 text-[9.5px] text-zinc-400 hover:text-zinc-250 transition-colors text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Submit goal statement..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-zinc-950 border border-zinc-850 rounded px-3.5 py-2 text-xs text-zinc-300 placeholder-zinc-550 focus:outline-none focus:border-zinc-750 transition-colors"
              />
              <button
                onClick={() => handleSend()}
                className="p-2 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-950 transition-colors flex items-center justify-center shadow"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Observability Artifacts panel (1 column) */}
        <div className="p-5 rounded-lg bg-zinc-900/20 border border-zinc-900 shadow-sm flex flex-col justify-between overflow-y-auto">
          <div className="space-y-5">
            <h3 className="text-xs font-semibold text-zinc-200 flex items-center gap-2 pb-3 border-b border-zinc-900">
              <Layers className="w-3.5 h-3.5 text-zinc-500" />
              Observability Deck
            </h3>

            {!activeMetrics ? (
              <div className="py-24 text-center select-none">
                <p className="text-[10px] text-zinc-650">No trace loaded.</p>
                <p className="text-[9px] text-zinc-600 mt-1 max-w-[180px] mx-auto leading-relaxed">
                  Run a query statement to capture real-time agent metrics, latency, and tokens.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Executive timings */}
                <div className="p-3.5 rounded bg-zinc-950/40 border border-zinc-900 space-y-2">
                  <span className="text-[8px] font-bold text-zinc-555 uppercase tracking-widest block">Timing & Resources</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold">
                    <div>
                      <p className="text-zinc-500">Latency</p>
                      <p className="text-zinc-200 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        {activeMetrics.time}s
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-500">Tokens</p>
                      <p className="text-zinc-200 mt-0.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-zinc-400" />
                        {activeMetrics.tokens}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Plan Reasoning */}
                {activePlan && (
                  <div className="p-3.5 rounded bg-zinc-950/40 border border-zinc-900 space-y-2">
                    <span className="text-[8px] font-bold text-zinc-555 uppercase tracking-widest block flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-zinc-500" />
                      Plan reasoning
                    </span>
                    <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
                      {activePlan.reasoning || "Analyzing regulatory vectors to derive steps."}
                    </p>
                  </div>
                )}

                {/* Allocated execution steps */}
                {activeSteps.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-[8px] font-bold text-zinc-555 uppercase tracking-widest block">Agent Execution Flow</label>
                    <div className="space-y-2">
                      {activeSteps.map((step, idx) => (
                        <div key={idx} className="p-2.5 rounded bg-zinc-950 border border-zinc-850 flex items-center justify-between text-[10px]">
                          <span className="font-semibold text-zinc-350">{step.agent}</span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 font-bold text-[8.5px]">
                            {step.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-900 flex justify-between text-[9px] text-zinc-650 font-bold uppercase tracking-widest">
            <span>Orchestrator Sandbox</span>
            <span>RIO Core v2.0</span>
          </div>
        </div>

      </div>
    </div>
  );
}
