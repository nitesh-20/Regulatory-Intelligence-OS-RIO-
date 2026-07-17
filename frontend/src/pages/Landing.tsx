import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  ArrowRight, 
  Terminal, 
  Cpu, 
  Database, 
  RefreshCw, 
  Lock, 
  Layers 
} from 'lucide-react';

export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 font-sans selection:bg-zinc-800 relative overflow-hidden flex flex-col justify-between">
      {/* Visual background decorations */}
      <div className="absolute inset-0 grid-mesh [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Navigation */}
      <header className="relative z-10 border-b border-zinc-900/60 bg-[#08080a]/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6.5 h-6.5 rounded bg-zinc-100 flex items-center justify-center border border-zinc-200">
              <Shield className="w-3.5 h-3.5 text-zinc-900" />
            </div>
            <span className="font-semibold text-xs tracking-tight text-zinc-200">
              RIO
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              to="/dashboard" 
              className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700/60 text-[10.5px] font-medium text-zinc-300 transition-all flex items-center gap-1.5"
            >
              <Terminal className="w-3 h-3" />
              Dev Console
            </Link>
            <Link 
              to="/chat" 
              className="px-3 py-1.5 rounded bg-zinc-100 hover:bg-zinc-200 text-[10.5px] font-medium text-zinc-950 transition-all flex items-center gap-1 shadow-md shadow-white/5"
            >
              Launch Platform
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Body */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-16 text-center flex-1 flex flex-col items-center justify-center">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 max-w-3xl"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900/80 border border-zinc-850/80 select-none shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Multi-Agent Compliance Operating System</span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.1] text-zinc-100"
          >
            Continuous intelligence for <br />
            <span className="bg-gradient-to-r from-zinc-100 via-indigo-300 to-zinc-400 bg-clip-text text-transparent">
              Enterprise Regulatory Integrity
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-zinc-400 text-xs sm:text-[13px] max-w-xl mx-auto leading-relaxed"
          >
            RIO orchestrates autonomous reasoning pipelines to parse policy documents, calculate risk scores, and audit alignment gaps instantly using a self-correcting RAG store.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex items-center justify-center gap-3 pt-4"
          >
            <Link 
              to="/dashboard" 
              className="px-4 py-2.5 rounded bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-950 transition-all flex items-center gap-1.5 shadow"
            >
              Enter platform
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a 
              href="https://github.com/nitesh-20/Regulatory-Intelligence-OS-RIO-" 
              target="_blank" 
              rel="noreferrer"
              className="px-4 py-2.5 rounded bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-semibold text-zinc-350 hover:text-zinc-200 transition-colors"
            >
              Documentation
            </a>
          </motion.div>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-4xl mt-24"
        >
          {[
            { title: "Multi-Agent Networks", desc: "Coordinated pipelines (Search, Risk, Compliance) executing parallel verification.", icon: Cpu },
            { title: "Self-Correcting RAG", desc: "High-density vector embeddings paired with cosine similarity ranking.", icon: Database },
            { title: "Continuous Monitoring", desc: "Automated crawling of global regulatory index updates using Firecrawl.", icon: RefreshCw }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              className="p-5 rounded-lg bg-zinc-900/30 border border-zinc-900 hover:border-zinc-800 transition-all text-left relative group select-none shadow-sm"
            >
              <div className="p-2 w-fit rounded bg-zinc-950 border border-zinc-850 text-zinc-400 group-hover:text-zinc-200 transition-colors mb-3.5">
                <feature.icon className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-semibold text-zinc-200 mb-1.5">{feature.title}</h3>
              <p className="text-zinc-500 text-[10.5px] leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-900/60 bg-[#08080a]/40 py-6 text-center select-none">
        <p className="text-[9.5px] font-semibold text-zinc-650 tracking-wider">
          PLATFORM VERDICT ACTIVE • CONTINUOUS RUNS LOGGED DIRECTLY TO POSTGRES / SQLITE
        </p>
      </footer>
    </div>
  );
}
