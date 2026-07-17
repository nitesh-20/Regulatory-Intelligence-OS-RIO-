import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  ArrowRight, 
  Terminal, 
  Cpu, 
  Database, 
  GitMerge, 
  RefreshCw, 
  Lock, 
  Layers 
} from 'lucide-react';

export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      {/* Dynamic ambient grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70"></div>
      
      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Navigation Header */}
      <header className="relative z-10 border-b border-slate-900/80 bg-slate-950/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 border border-indigo-500/20">
              <Shield className="w-5 h-5 text-indigo-100" />
            </div>
            <span className="font-display font-extrabold text-xl tracking-wider bg-gradient-to-r from-indigo-200 via-slate-100 to-indigo-100 bg-clip-text text-transparent">
              RIO
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard" 
              className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700/80 text-xs font-semibold text-slate-300 transition-all flex items-center gap-1.5 shadow"
            >
              <Terminal className="w-3.5 h-3.5" />
              Developer Console
            </Link>
            <Link 
              to="/chat" 
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center gap-1"
            >
              Launch Terminal
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 max-w-4xl mx-auto"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/40 border border-indigo-900/50 shadow-inner"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Enterprise Agentic Compliance OS</span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight leading-[1.1] text-slate-100"
          >
            The AI Operating System for <br />
            <span className="bg-gradient-to-r from-indigo-400 via-emerald-400 to-indigo-300 bg-clip-text text-transparent">
              Regulatory Intelligence & Compliance
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
          >
            RIO is an autonomous multi-agent platform that monitors global regulators, deconstructs legislation, validates policies, and flags alignment gaps instantly using a self-correcting RAG network.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="pt-6 flex justify-center gap-4"
          >
            <Link 
              to="/chat" 
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all flex items-center gap-2 group"
            >
              Deploy RIO Agent
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#architecture" 
              className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700/80 text-xs font-bold text-slate-300 transition-all flex items-center gap-1.5"
            >
              <Cpu className="w-4 h-4" />
              Explore Architecture
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Agents Architecture Flow Diagram */}
      <section id="architecture" className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-display font-bold text-slate-100 mb-2">Self-Orchestrating Agent Mesh</h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            User intents are deconstructed by the Planner Agent and dispatched to specialists in a parallel, transactional graph.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-slate-900/30 border border-slate-900 backdrop-blur-md relative overflow-hidden">
          {/* Connector paths */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <path d="M 100 200 Q 300 100 500 200 T 900 200" fill="none" stroke="url(#indigo-grad)" strokeWidth="2" />
              <defs>
                <linearGradient id="indigo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 relative z-10">
            {[
              { title: "Planner Agent", desc: "Orchestration Brain", icon: Cpu, color: "text-indigo-400 border-indigo-500/20" },
              { title: "Document Agent", desc: "OCR & Chunk Parser", icon: Database, color: "text-emerald-400 border-emerald-500/20" },
              { title: "Compliance Twin", desc: "Gap Mapping Agent", icon: Shield, color: "text-amber-400 border-amber-500/20" },
              { title: "Risk Agent", desc: "Exposure Scoring", icon: Lock, color: "text-rose-400 border-rose-500/20" },
              { title: "Report Agent", desc: "Briefing Synthesis", icon: Layers, color: "text-blue-400 border-blue-500/20" }
            ].map((node, idx) => (
              <div 
                key={idx} 
                className={`p-5 rounded-xl bg-slate-950/80 border ${node.color} shadow-lg text-center flex flex-col items-center gap-3`}
              >
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <node.icon className={`w-5 h-5 ${node.color.split(' ')[0]}`} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{node.title}</h4>
                  <p className="text-[9px] text-slate-500 mt-1">{node.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Self-Correcting RAG",
            desc: "Continuous evaluation loops monitor factual correctness, hallucination metrics, and metadata context match before answers resolve.",
            icon: RefreshCw,
            color: "text-indigo-400"
          },
          {
            title: "Dynamic Policy Diffs",
            desc: "Upload versioned acts to see immediate color-coded clause amendments, shifted compliance deadlines, and financial penalty updates.",
            icon: GitMerge,
            color: "text-emerald-400"
          },
          {
            title: "Observability Trace Panel",
            desc: "Watch agent logic unfold live. Track tokens consumed, tools executed, sub-agent latency, and reasoning pathways.",
            icon: Terminal,
            color: "text-amber-400"
          }
        ].map((feat, idx) => (
          <div 
            key={idx} 
            className="p-8 rounded-xl bg-slate-900/20 border border-slate-900 hover:border-slate-850 hover:bg-slate-900/30 transition-all shadow group"
          >
            <div className={`p-3 rounded-lg bg-slate-950 border border-slate-850 w-fit mb-6 ${feat.color}`}>
              <feat.icon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 mb-2 group-hover:text-indigo-400 transition-colors">
              {feat.title}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {feat.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Footer Block */}
      <footer className="relative z-10 border-t border-slate-900/80 bg-slate-950/60 py-12 text-center text-slate-500 text-[10px] font-medium">
        <p>© 2026 RIO Regulatory Intelligence OS. Autonomous compliance operations. All rights reserved.</p>
      </footer>
    </div>
  );
}
