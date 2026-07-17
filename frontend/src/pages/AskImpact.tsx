import React, { useState } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Loader2, 
  ShieldCheck, 
  HelpCircle, 
  Cpu, 
  Clock, 
  Zap, 
  Activity, 
  CheckCircle,
  AlertCircle
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
      content: 'Welcome to the Compliance Operating System terminal. Submit any goal or regulatory inquiry to initiate multi-agent reasoning.' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activePlan, setActivePlan] = useState<any>(null);
  const [activeSteps, setActiveSteps] = useState<ExecutionStep[]>([]);
  const [activeMetrics, setActiveMetrics] = useState<{ time: number; tokens: number } | null>(null);

  const suggestionPrompts = [
    "Identify compliance gaps for RBI Data Consent guidelines.",
    "Verify encryption policy alignment against FTC rules.",
    "Draft a plain English executive report on recent MCA amendments."
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setInput('');
    setIsLoading(true);
    setActivePlan(null);
    setActiveSteps([]);
    setActiveMetrics(null);

    try {
      // Hit backend API planner executor
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

        // Load into active side-panel metrics
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

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-140px)]">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-100 mb-1">Ask RIO Compliance OS</h1>
        <p className="text-xs text-slate-400">
          Autonomous multi-agent execution workspace. Actions map directly to your compliance twin.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Chat message space (Left 3 columns) */}
        <div className="lg:col-span-3 flex flex-col bg-slate-900/30 border border-slate-850 rounded-xl overflow-hidden justify-between">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                onClick={() => {
                  if (msg.role === 'assistant' && msg.steps) {
                    setActivePlan(msg.planner_decisions);
                    setActiveSteps(msg.steps);
                    setActiveMetrics({ time: msg.time_taken || 0, tokens: msg.tokens || 0 });
                  }
                }}
                className={`flex gap-4 items-start ${msg.role === 'user' ? 'justify-end' : 'cursor-pointer hover:bg-slate-950/20 rounded-lg p-2 transition-colors'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center border border-indigo-500/20 shadow-md">
                    <Bot className="w-4 h-4 text-indigo-100" />
                  </div>
                )}
                
                <div className={`p-4 rounded-xl max-w-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600/20 text-indigo-100 border border-indigo-500/30'
                    : 'bg-slate-950/60 text-slate-300 border border-slate-850'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  
                  {msg.steps && (
                    <div className="mt-3 flex gap-2 items-center text-[10px] text-slate-500 border-t border-slate-850 pt-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Executed {msg.steps.length} agents in {msg.time_taken}s • click message to view trace</span>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-slate-850 flex items-center justify-center border border-slate-700">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-indigo-100" />
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-850 max-w-md">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Planner orchestrating compliance chain...
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form input */}
          <div className="p-4 border-t border-slate-850 bg-slate-950/20">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Submit goal e.g. Audit encryption policies against SEC rules..."
                disabled={isLoading}
                className="flex-1 bg-slate-950/60 border border-slate-850 rounded-xl py-3 px-4 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/80 transition-colors"
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading}
                className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* AI Observability Panel (Right column) */}
        <div className="space-y-4 flex flex-col min-h-0 overflow-y-auto">
          {/* Active Metrics */}
          {activeMetrics && (
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-4">
              <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Activity className="w-4 h-4 text-indigo-400" />
                AI Observability
              </h3>
              
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-850">
                  <span className="text-[10px] text-slate-500 block">Total Latency</span>
                  <span className="text-sm font-bold text-slate-200">{activeMetrics.time}s</span>
                </div>
                <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-850">
                  <span className="text-[10px] text-slate-500 block">Tokens Used</span>
                  <span className="text-sm font-bold text-slate-200">{activeMetrics.tokens}</span>
                </div>
              </div>

              {activePlan && (
                <div className="space-y-1.5">
                  <span className="text-[9px] text-slate-500 uppercase font-semibold">Planner Decision Reasoning</span>
                  <p className="text-[10px] text-slate-400 leading-relaxed bg-slate-950/40 p-2.5 rounded border border-slate-850 font-mono">
                    {activePlan.reasoning}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Node Execution graph */}
          {activeSteps.length > 0 ? (
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex-1 space-y-3">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Agent Chain Node Trace</h4>
              <div className="space-y-3 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-800">
                {activeSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-3 items-start relative pl-1">
                    <div className="w-6 h-6 rounded-full bg-slate-950 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-[9px] font-bold z-10">
                      {idx + 1}
                    </div>
                    <div className="flex-1 p-2 rounded bg-slate-950/50 border border-slate-850 text-[10px] space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-200">{step.agent}</span>
                        <span className="text-[8px] text-slate-500">{step.duration}s</span>
                      </div>
                      {step.tools_called.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {step.tools_called.map((tool, ti) => (
                            <span key={ti} className="text-[8px] px-1 bg-indigo-950 text-indigo-400 rounded border border-indigo-900/40">{tool}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-slate-900/20 border border-slate-900 text-center flex-1 flex flex-col justify-center items-center gap-2">
              <HelpCircle className="w-8 h-8 text-slate-650" />
              <p className="text-[10px] text-slate-500 max-w-[150px] leading-relaxed">
                Submit queries to visualize planner routing and node latency.
              </p>
            </div>
          )}

          {/* Quick suggestions if idle */}
          {!activeMetrics && (
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                Compliance Tasks
              </h3>
              <div className="space-y-2">
                {suggestionPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    disabled={isLoading}
                    className="w-full text-left p-3 rounded-lg bg-slate-950/60 border border-slate-850 text-[10px] text-slate-400 hover:text-slate-200 hover:border-slate-700/80 transition-all leading-relaxed"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
