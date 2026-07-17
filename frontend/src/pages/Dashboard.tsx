import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  CheckCircle, 
  FileText, 
  Calendar, 
  ChevronRight, 
  Zap, 
  Activity,
  Download
} from 'lucide-react';

export default function Dashboard() {
  const [gaps, setGaps] = useState<any[]>([]);
  const [regulations, setRegulations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [gapsRes, regsRes] = await Promise.all([
          fetch('/api/v1/compliance/gaps'),
          fetch('/api/v1/regulations')
        ]);
        if (gapsRes.ok) {
          const gapsData = await gapsRes.json();
          setGaps(gapsData);
        }
        if (regsRes.ok) {
          const regsData = await regsRes.json();
          setRegulations(regsData);
        }
      } catch (err) {
        console.error("[Dashboard] Error fetching live metrics", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  const gapsCount = gaps.length;
  const regulationsCount = regulations.length || 4;
  const readinessScore = Math.max(10, 100 - (gapsCount * 15));

  const handleDownloadReport = () => {
    window.open('/api/v1/reports/generate', '_blank');
  };

  return (
    <div className="space-y-6 select-none max-w-[1600px] w-full mx-auto">
      
      {/* Premium Mini-Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl bg-zinc-900/30 border border-zinc-900 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
            Executive Compliance Sandbox
          </h1>
          <p className="text-zinc-400 text-sm mt-1 max-w-2xl leading-relaxed">
            Continuous multi-agent reasoning monitoring detected active changes in your compliance framework. Your audit twin analysis is synchronised.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <button 
            onClick={handleDownloadReport}
            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-300 border border-zinc-800 transition-colors flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            PDF Report
          </button>
          <Link 
            to="/chat" 
            className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-950 transition-colors flex items-center gap-2 shadow"
          >
            <Zap className="w-3.5 h-3.5 text-zinc-900" />
            Ask Assistant
          </Link>
        </div>
      </div>

      {/* Stats Cards Row */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {[
          { title: 'Audit Readiness', value: `${readinessScore}%`, change: readinessScore >= 80 ? '+3.4%' : '-10.2%', lightColor: readinessScore >= 80 ? 'bg-emerald-500' : 'bg-rose-500', desc: 'readiness rating' },
          { title: 'Identified Gaps', value: `${gapsCount} Open`, change: `${gapsCount} items pending`, lightColor: gapsCount > 0 ? 'bg-amber-500' : 'bg-emerald-500', desc: 'remediation targets' },
          { title: 'Tracked Directives', value: `${regulationsCount}`, change: '+2 active feeds', lightColor: 'bg-zinc-400', desc: 'compliance catalogs' },
          { title: 'Active Audit Tasks', value: `${gapsCount} Tasks`, change: 'due soon', lightColor: 'bg-indigo-500', desc: 'remediation updates' }
        ].map((kpi, idx) => (
          <motion.div 
            key={idx} 
            variants={cardVariants}
            className="p-6 rounded-xl bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800/80 transition-all select-none shadow-sm relative group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{kpi.title}</p>
                <h3 className="text-3xl font-semibold text-zinc-100 mt-2">{kpi.value}</h3>
              </div>
              <span className={`w-2 h-2 rounded-full ${kpi.lightColor} mt-1`} />
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs font-medium">
              <span className="text-zinc-400">{kpi.change}</span>
              <span className="text-zinc-600">{kpi.desc}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Briefing Card */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-zinc-900/20 border border-zinc-900 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-zinc-200 tracking-wide">Daily Intelligent Briefing</h3>
              <span className="text-xs text-zinc-500 font-bold px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-850 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                July 17, 2026
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-900">
                <span className="text-[10px] font-bold text-rose-400 px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20 uppercase tracking-wider">
                  Critical Impact
                </span>
                <h4 className="text-base font-semibold text-zinc-100 mt-3">EU AI Act General Purpose AI Model Amendment</h4>
                <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed">
                  The European Commission has updated audit standards for models exceeding 10^22 FLOPS. As you operate self-hosted models, you are required to submit an active risk inventory.
                </p>
                <div className="mt-4">
                  <Link to="/diff" className="text-xs text-indigo-400 font-semibold hover:underline flex items-center gap-1">
                    Compare Versions <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-900">
                <span className="text-[10px] font-bold text-amber-400 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 uppercase tracking-wider">
                  Medium Impact
                </span>
                <h4 className="text-base font-semibold text-zinc-100 mt-3">SEC Cyber Risk Disclosure Form 8-K Update</h4>
                <p className="text-zinc-400 text-sm mt-1.5 leading-relaxed">
                  Amended requirements for inline XBRL tagging of material cybersecurity incidents within 4 business days of assessment.
                </p>
                <div className="mt-4">
                  <Link to="/twin" className="text-xs text-indigo-400 font-semibold hover:underline flex items-center gap-1">
                    Check Compliance Twin <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-zinc-900 flex justify-end">
            <Link to="/feed" className="text-xs text-zinc-400 hover:text-zinc-200 font-semibold flex items-center gap-1">
              View complete regulatory feed <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Activity Logs */}
        <div className="p-6 rounded-xl bg-zinc-900/20 border border-zinc-900 flex flex-col justify-between shadow-sm">
          <div>
            <h3 className="text-sm font-semibold text-zinc-200 mb-6 tracking-wide">Enforcement Activity</h3>
            <div className="space-y-4">
              {[
                { name: 'AlphaCorp Ltd.', fine: '$1,200,000', regulation: 'DPDP Violations', date: '2 days ago' },
                { name: 'Vortex Capital', fine: '$450,000', regulation: 'SEC Cyber Failure', date: '4 days ago' },
                { name: 'Lumina Tech LLC', fine: '$80,000', regulation: 'HIPAA Breach', date: '1 week ago' },
              ].map((enforcement, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 rounded-lg bg-zinc-900/30 border border-zinc-900">
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-200">{enforcement.name}</h4>
                    <p className="text-xs text-zinc-500 mt-1">{enforcement.regulation} • {enforcement.date}</p>
                  </div>
                  <span className="text-xs font-bold text-rose-400 px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/10">
                    {enforcement.fine}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-zinc-900 flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
            <span>Tracking 18 active trials</span>
            <span className="text-rose-400 flex items-center gap-1.5">
              Fines up 12% YoY <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
