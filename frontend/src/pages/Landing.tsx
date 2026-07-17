import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { 
  Shield, ArrowRight, Terminal, Cpu, Database, RefreshCw, Lock, Layers,
  CheckCircle2, AlertTriangle, FileText, Search, Activity, Zap, Play,
  ChevronRight, BarChart3, Globe, MessageSquare, Briefcase, Building2,
  FileCheck2, HardDrive, Bell, Settings, Network, Gavel
} from 'lucide-react';

// --- Shared Constants & Styles ---
const GLASS_PANEL = "bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-2xl shadow-2xl";
const GLOW_TEXT = "bg-gradient-to-r from-zinc-100 via-indigo-300 to-zinc-400 bg-clip-text text-transparent";

// --- Subcomponents ---

const HeroSection = () => {
  const [events, setEvents] = useState([
    { time: "09:14 AM", text: "RBI uploaded new Payment Aggregator circular", type: "info" },
    { time: "09:16 AM", text: "RIO analyzed 148 clauses", type: "process" },
    { time: "09:17 AM", text: "4 compliance obligations identified", type: "alert" },
    { time: "09:18 AM", text: "Risk score changed from 81 → 87", type: "metric" },
    { time: "09:19 AM", text: "Executive report emailed to Compliance Team", type: "success" },
  ]);

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center pt-24 overflow-hidden">
      {/* Background Dashboard Mock */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex justify-center items-center">
         <div className="w-[120%] h-[120%] grid-mesh [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_80%)] scale-110 rotate-3 animate-pulse-slow"></div>
         <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 rounded-[100%] blur-[150px]"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Copy */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-indigo-500/30 text-[11px] font-bold text-indigo-300 uppercase tracking-widest shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Enterprise Regulatory Intelligence
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.05] text-zinc-100">
            Compliance, <br />
            <span className={GLOW_TEXT}>Fully Autonomous.</span>
          </h1>
          
          <p className="text-zinc-400 text-lg max-w-lg leading-relaxed">
            RIO continuously monitors global regulations, analyzes enterprise policies, and orchestrates risk mitigation workflows through an advanced multi-agent AI pipeline.
          </p>

          <div className="flex items-center gap-4 pt-4">
            <Link to="/chat" className="px-6 py-3.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-bold transition-all flex items-center gap-2 shadow-lg shadow-white/10 hover:shadow-white/20 hover:scale-105 active:scale-95">
              Start Monitoring
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/dashboard" className="px-6 py-3.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-semibold transition-all flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Dev Console
            </Link>
          </div>
        </motion.div>

        {/* Right: Live Stream Simulation */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`${GLASS_PANEL} p-6 relative overflow-hidden`}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
          
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800/60">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-zinc-300 tracking-wider uppercase">Live Threat Intel Feed</span>
            </div>
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {events.map((ev, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.4, type: "spring" }}
                  className="flex gap-3 text-sm"
                >
                  <span className="text-zinc-600 font-mono text-[10px] pt-1">{ev.time}</span>
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      {ev.type === 'info' && <Globe className="w-4 h-4 text-blue-400 mt-0.5" />}
                      {ev.type === 'process' && <Cpu className="w-4 h-4 text-indigo-400 mt-0.5" />}
                      {ev.type === 'alert' && <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />}
                      {ev.type === 'metric' && <BarChart3 className="w-4 h-4 text-rose-400 mt-0.5" />}
                      {ev.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />}
                      <span className={`${ev.type === 'alert' ? 'text-amber-100 font-medium' : 'text-zinc-300'} leading-snug`}>
                        {ev.text}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const SocialProof = () => {
  const sources = ["RBI", "SEBI", "NPCI", "MCA", "GST", "IRDAI", "CERT-In", "MeitY", "EU AI Act", "NIST", "ISO 27001"];
  return (
    <div className="py-12 border-y border-zinc-900/50 bg-[#08080a]/80 relative z-10 flex flex-col items-center justify-center overflow-hidden">
      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">Continuously ingesting intelligence from</p>
      <div className="flex gap-12 w-full px-6 flex-wrap justify-center opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
        {sources.map(s => (
          <div key={s} className="text-xl sm:text-2xl font-black tracking-tighter text-zinc-300">
            {s}
          </div>
        ))}
      </div>
    </div>
  );
};

const WorkflowSection = () => {
  const steps = [
    { title: "Continuous Ingestion", desc: "Crawlers monitor 100+ regulatory sources globally in real-time.", icon: Globe },
    { title: "AI Extraction", desc: "LLMs extract key obligations, dates, and severity from raw legal text.", icon: FileText },
    { title: "Compliance Mapping", desc: "Vector Search (RAG) maps new rules against your internal policy database.", icon: Network },
    { title: "Risk Scoring", desc: "Risk Agents quantify exposure based on exact operational gaps.", icon: AlertTriangle },
    { title: "Executive Reporting", desc: "Automated alerts and board-ready reports generated instantly.", icon: Briefcase }
  ];

  return (
    <div className="py-32 relative z-10 bg-[#08080a]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">How RIO works</h2>
          <p className="text-zinc-400 mt-4 text-lg">A fully autonomous pipeline from detection to resolution.</p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-zinc-800 to-transparent -translate-x-1/2"></div>
          
          <div className="space-y-24 relative">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 w-full flex ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                    <div className={`${GLASS_PANEL} p-8 max-w-sm w-full hover:-translate-y-2 transition-transform duration-500`}>
                      <div className="w-12 h-12 rounded-xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center mb-6">
                        <step.icon className="w-6 h-6 text-indigo-400" />
                      </div>
                      <h3 className="text-xl font-bold text-zinc-100 mb-3">{step.title}</h3>
                      <p className="text-zinc-400 leading-relaxed text-sm">{step.desc}</p>
                    </div>
                  </div>
                  
                  {/* Center Node */}
                  <div className="absolute left-8 md:left-1/2 w-6 h-6 rounded-full bg-[#08080a] border-[4px] border-indigo-500 -translate-x-1/2 z-10 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                  
                  <div className="flex-1 w-full hidden md:block">
                     {/* Empty space for alternating layout */}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const CapabilitiesBento = () => {
  return (
    <div className="py-24 bg-zinc-950 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100 mb-16 text-center">Enterprise Capabilities</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          
          <div className={`${GLASS_PANEL} md:col-span-2 p-8 group relative overflow-hidden`}>
            <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
            <Cpu className="w-8 h-8 text-indigo-400 mb-6" />
            <h3 className="text-2xl font-bold text-zinc-100 mb-3">Multi-Agent AI Network</h3>
            <p className="text-zinc-400 max-w-md leading-relaxed">
              RIO doesn't just use one LLM. It orchestrates specialized agents—Search, Risk, Compliance, and Report—that debate and verify each other's findings to eliminate hallucinations.
            </p>
          </div>

          <div className={`${GLASS_PANEL} p-8 group`}>
            <HardDrive className="w-8 h-8 text-emerald-400 mb-6" />
            <h3 className="text-xl font-bold text-zinc-100 mb-3">Compliance Twin</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              A digital replica of your enterprise posture powered by high-dimensional Qdrant vectors.
            </p>
          </div>

          <div className={`${GLASS_PANEL} p-8 group`}>
            <Search className="w-8 h-8 text-amber-400 mb-6" />
            <h3 className="text-xl font-bold text-zinc-100 mb-3">Policy Diff</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Line-by-line AI comparison between new regulatory drafts and your existing policies.
            </p>
          </div>

          <div className={`${GLASS_PANEL} md:col-span-2 p-8 group relative overflow-hidden flex flex-col justify-end`}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10">
              <div className="flex gap-4 mb-6">
                <div className="px-3 py-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold font-mono">CRITICAL RISK</div>
                <div className="px-3 py-1 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-bold font-mono">MITIGATED</div>
              </div>
              <h3 className="text-2xl font-bold text-zinc-100 mb-3">Explainable Risk Intelligence</h3>
              <p className="text-zinc-400 max-w-md leading-relaxed">
                Risk scores are not black boxes. Every point deduction is cited directly to a specific clause in your policy and the corresponding regulatory mandate.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const OnboardingSandbox = () => {
  const [industry, setIndustry] = useState('Fintech');
  
  const rules = {
    'Fintech': { regs: 42, score: 81, missing: ['Crypto AML Policy', 'UPI Consent Framework'] },
    'Bank': { regs: 128, score: 94, missing: ['Basel IV Liquidity Addendum'] },
    'Insurance': { regs: 65, score: 76, missing: ['IRDAI Cyber Annexure', 'Telematics Privacy'] },
  };
  
  const current = rules[industry as keyof typeof rules];

  return (
    <div className="py-32 bg-[#08080a] relative z-10">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100 mb-16">Instant Enterprise Onboarding</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
          
          {/* Left Controls */}
          <div className="space-y-8">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 block">Select Your Industry</label>
              <div className="flex gap-3">
                {['Fintech', 'Bank', 'Insurance'].map(ind => (
                  <button 
                    key={ind}
                    onClick={() => setIndustry(ind)}
                    className={`px-5 py-3 rounded-lg text-sm font-semibold transition-all ${industry === ind ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'}`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>
            
            <p className="text-zinc-400 leading-relaxed text-lg">
              RIO instantly pre-configures your Compliance Twin based on your sector, pulling thousands of relevant mandates before you even upload a single policy.
            </p>
          </div>

          {/* Right Simulated Result */}
          <div className={`${GLASS_PANEL} p-8 space-y-6 relative`}>
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
               <h3 className="font-bold text-zinc-200">System Configuration</h3>
               <span className="animate-pulse w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-850">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2">Applicable Mandates</p>
                <p className="text-3xl font-black text-indigo-400">{current.regs}</p>
              </div>
              <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-850">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2">Baseline Risk Score</p>
                <p className="text-3xl font-black text-emerald-400">{current.score}</p>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-3">Predicted Policy Gaps</p>
              <ul className="space-y-2">
                {current.missing.map(m => (
                  <li key={m} className="text-sm text-zinc-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    {m} required
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const MetricsCTA = () => {
  return (
    <div className="py-32 relative z-10 bg-zinc-950 overflow-hidden">
       <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-950/20 pointer-events-none"></div>
       
       <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-100 mb-6">
            Ready for enterprise scale.
          </h2>
          <p className="text-xl text-zinc-400 mb-12">
            Join the forward-thinking compliance teams automating risk away.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 border-y border-zinc-900 py-12">
            <div>
              <p className="text-4xl font-black text-white">400k+</p>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mt-2 font-bold">Vectors Indexed</p>
            </div>
            <div>
              <p className="text-4xl font-black text-white">1.2M</p>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mt-2 font-bold">Policies Scanned</p>
            </div>
            <div>
              <p className="text-4xl font-black text-white">&lt;2s</p>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mt-2 font-bold">Query Latency</p>
            </div>
            <div>
              <p className="text-4xl font-black text-white">99.9%</p>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mt-2 font-bold">Uptime</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link to="/chat" className="w-full sm:w-auto px-8 py-4 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-bold transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-105 text-lg">
                Deploy RIO to Workspace
             </Link>
             <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold transition-all hover:bg-zinc-800 text-lg">
                View Architecture
             </Link>
          </div>
       </div>
    </div>
  );
}

// --- Main Layout Assembly ---

export default function Landing() {
  return (
    <div className="bg-[#08080a] min-h-screen text-zinc-100 font-sans selection:bg-indigo-500/30">
      
      {/* Premium Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-900/80 bg-[#08080a]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-zinc-100 to-zinc-300 flex items-center justify-center shadow-lg">
              <Shield className="w-4 h-4 text-zinc-950" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              RIO
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-400">
             <a href="#how-it-works" className="hover:text-white transition-colors">Platform</a>
             <a href="#capabilities" className="hover:text-white transition-colors">Intelligence</a>
             <a href="#onboarding" className="hover:text-white transition-colors">Enterprises</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/chat" className="hidden md:flex items-center gap-2 text-sm font-semibold text-zinc-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/dashboard" className="px-4 py-2 rounded bg-zinc-100 text-zinc-950 text-sm font-bold shadow-md hover:bg-white transition-colors">
              Launch Terminal
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Sections */}
      <HeroSection />
      <SocialProof />
      <div id="how-it-works"><WorkflowSection /></div>
      <div id="capabilities"><CapabilitiesBento /></div>
      <div id="onboarding"><OnboardingSandbox /></div>
      <MetricsCTA />

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12 relative z-10 text-center">
         <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-zinc-500" />
            <span className="font-bold text-zinc-300">RIO</span>
         </div>
         <p className="text-zinc-600 text-xs uppercase tracking-widest font-bold">Enterprise Multi-Agent Regulatory OS</p>
         <p className="text-zinc-700 text-[10px] mt-2">© 2026 RIO Intelligence Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
