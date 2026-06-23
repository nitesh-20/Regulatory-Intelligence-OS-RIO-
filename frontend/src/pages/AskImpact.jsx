import React, { useState } from 'react'
import { MessageSquare, Send, Bot, User, Loader2, ShieldCheck, HelpCircle } from 'lucide-react'

export default function AskImpact() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your regulatory reasoning agent. Ask me how any new regulation or compliance update affects your business.' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [reasoningSteps, setReasoningSteps] = useState([])

  const suggestionPrompts = [
    "How does the new EU AI Act affect my self-hosted model?",
    "What security controls do we miss under SEC cybersecurity rule?",
    "Do we require DPDP compliance for our user logs database?"
  ]

  const handleSend = async (textToSend) => {
    const query = textToSend || input
    if (!query.trim()) return

    setMessages(prev => [...prev, { role: 'user', content: query }])
    setInput('')
    setIsLoading(true)
    setReasoningSteps([])

    // Simulate Agent Reasoning steps
    const steps = [
      "Regulatory Discovery Agent matching text index...",
      "Monitoring Agent verifying version history...",
      "Industry Impact Agent evaluating sector compatibility...",
      "Compliance Twin Agent comparing against uploaded policies..."
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setReasoningSteps(prev => [...prev, steps[i]])
    }

    await new Promise(resolve => setTimeout(resolve, 600))
    setIsLoading(false)

    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `Here is the legal and technical analysis for your query in FinTech Sandbox workspace context:`,
      metadata: {
        verdict: 'Requires action',
        reasons: [
          'Under SEC Rule 12(a), customer data tables must utilize AES-256 (your current policy defines AES-128).',
          'Database logs must capture audit trails for key rotation events.'
        ],
        tasks: [
          'Update "Database Encryption Policy" document to reflect AES-256 requirements.',
          'Migrate dev and production database clusters encryption keys.'
        ]
      }
    }])
  }

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-140px)]">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-display font-bold text-slate-100 mb-1">Ask Impact AI</h1>
        <p className="text-xs text-slate-400">
          Semantic regulatory reasoning engine connected directly to your company's compliance twin.
        </p>
      </div>

      {/* Main chat layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Chat message space */}
        <div className="lg:col-span-3 flex flex-col bg-slate-900/30 border border-slate-850 rounded-xl overflow-hidden justify-between">
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, index) => (
              <div key={index} className={`flex gap-4 items-start ${msg.role === 'user' ? 'justify-end' : ''}`}>
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
                  <p>{msg.content}</p>
                  
                  {msg.metadata && (
                    <div className="mt-4 space-y-4 pt-4 border-t border-slate-800">
                      <div>
                        <span className="text-[10px] font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                          {msg.metadata.verdict}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                          Compliance Twin Gaps:
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-slate-400">
                          {msg.metadata.reasons.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                          <Bot className="w-3.5 h-3.5 text-emerald-400" />
                          Recommended Actions:
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-slate-400">
                          {msg.metadata.tasks.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      </div>
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
                    Multi-agent thinking...
                  </div>
                  <div className="mt-3 space-y-1">
                    {reasoningSteps.map((step, i) => (
                      <p key={i} className="text-[10px] text-slate-500 font-medium">✓ {step}</p>
                    ))}
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
                placeholder="Ask RIO Agent about regulatory impacts..."
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

        {/* Prompts column */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <h3 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              Suggested Scenarios
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

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Connected Context</h4>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] py-1 border-b border-slate-800/60">
                <span className="text-slate-500">Corporate Policies</span>
                <span className="text-emerald-400 font-semibold">3 Files Active</span>
              </div>
              <div className="flex justify-between items-center text-[10px] py-1 border-b border-slate-800/60">
                <span className="text-slate-500">Infrastructure Schema</span>
                <span className="text-emerald-400 font-semibold">Postgres/AWS Sync</span>
              </div>
              <div className="flex justify-between items-center text-[10px] py-1">
                <span className="text-slate-500">Industry Profile</span>
                <span className="text-indigo-400 font-semibold">Fintech Platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
