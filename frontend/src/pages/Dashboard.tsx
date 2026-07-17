import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Calendar, 
  ChevronRight, 
  Zap, 
  Activity 
} from 'lucide-react';

export default function Dashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-100 mb-2">
            Executive Compliance Intelligence
          </h1>
          <p className="text-slate-400 text-xs max-w-2xl">
            Continuous multi-agent monitoring detected 2 new amendments affecting your operations today. Your audit twin gap analysis has been refreshed.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/chat" className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2">
            <Zap className="w-3.5 h-3.5" />
            Ask RIO Assistant
          </Link>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { title: 'Audit Readiness', value: '87%', change: '+3.4%', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { title: 'Identified Gaps', value: '5 Open', change: '-2 this week', icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', isDown: true },
          { title: 'Tracked Regulations', value: '1,482', change: '+24 new', icon: FileText, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
          { title: 'Pending Actions', value: '14 Tasks', change: '4 due soon', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        ].map((kpi, idx) => (
          <motion.div 
            key={idx} 
            variants={cardVariants}
            className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 shadow-md relative overflow-hidden group hover:border-slate-700/80 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">{kpi.title}</p>
                <h3 className="text-2xl font-bold font-display text-slate-100">{kpi.value}</h3>
              </div>
              <div className={`p-2.5 rounded-lg ${kpi.bg} ${kpi.color} border ${kpi.border}`}>
                <kpi.icon className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold">
              <span className={kpi.isDown ? 'text-emerald-400' : 'text-indigo-400'}>{kpi.change}</span>
              <span className="text-slate-550">from last evaluation</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Grid: Briefing + Enforcement Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Executive Briefing */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 rounded-full bg-indigo-500"></div>
                <h3 className="font-display font-semibold text-slate-200">Daily Intelligent Briefing</h3>
              </div>
              <span className="text-[9px] text-indigo-450 font-semibold px-2 py-1 rounded-md bg-indigo-950/40 border border-indigo-900/40 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                July 17, 2026
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-900">
                <span className="text-[9px] font-bold text-rose-450 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                  Critical Impact
                </span>
                <h4 className="text-xs font-semibold text-slate-200 mt-2">EU AI Act General Purpose AI Model Amendment</h4>
                <p className="text-slate-405 text-[11px] mt-1 leading-relaxed">
                  The European Commission has updated audit standards for models exceeding 10^22 FLOPS. As you operate self-hosted models, you are required to submit an active risk inventory.
                </p>
                <div className="mt-3 flex gap-2">
                  <Link to="/diff" className="text-[10px] text-indigo-400 font-semibold hover:underline flex items-center gap-1">
                    Compare Versions <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-900">
                <span className="text-[9px] font-bold text-amber-450 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  Medium Impact
                </span>
                <h4 className="text-xs font-semibold text-slate-200 mt-2">SEC Cyber Risk Disclosure Form 8-K Update</h4>
                <p className="text-slate-405 text-[11px] mt-1 leading-relaxed">
                  Amended requirements for inline XBRL tagging of material cybersecurity incidents within 4 business days of assessment.
                </p>
                <div className="mt-3 flex gap-2">
                  <Link to="/twin" className="text-[10px] text-indigo-400 font-semibold hover:underline flex items-center gap-1">
                    Check Compliance Twin <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-900/60 flex justify-end">
            <Link to="/feed" className="text-xs text-indigo-400 font-semibold hover:text-indigo-350 flex items-center gap-1">
              View complete regulatory feed <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Enforcement & Fine Log */}
        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-6 rounded-full bg-indigo-500"></div>
              <h3 className="font-display font-semibold text-slate-200">Enforcement Activity</h3>
            </div>

            <div className="space-y-4">
              {[
                { name: 'AlphaCorp Ltd.', fine: '$1,200,000', regulation: 'DPDP Violations', date: '2 days ago' },
                { name: 'Vortex Capital', fine: '$450,000', regulation: 'SEC Cyber Failure', date: '4 days ago' },
                { name: 'Lumina Tech LLC', fine: '$80,000', regulation: 'HIPAA Breach', date: '1 week ago' },
              ].map((enforcement, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-slate-950/40 border border-slate-900">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{enforcement.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{enforcement.regulation} • {enforcement.date}</p>
                  </div>
                  <span className="text-[11px] font-bold text-rose-400 px-2 py-1 rounded bg-rose-500/10 border border-rose-500/10">
                    {enforcement.fine}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-900/60 flex justify-between items-center">
            <span className="text-[10px] text-slate-500 font-medium">Tracking 18 active trials</span>
            <span className="text-[10px] text-rose-450 font-bold flex items-center gap-1">
              Fines up 12% YoY <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
