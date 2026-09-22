import React from 'react';
import { 
  Leaf, 
  Code2, 
  BookOpen, 
  RotateCcw, 
  Download, 
  BarChart3, 
  PlusCircle, 
  History, 
  Award,
  Bot,
  Globe,
  Compass,
  Zap,
  Utensils
} from 'lucide-react';

export default function Header({ 
  totalCO2, 
  weeklyCO2, 
  weeklyTarget,
  activeTab,
  setActiveTab,
  onOpenApiDocs, 
  onOpenDecisions, 
  onResetData,
  onExportCSV
}) {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3 mb-6">
      <div className="max-w-7xl mx-auto space-y-3">
        
        {/* Top Row: Brand & Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand & Track Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2 font-heading">
                  Climate Tracker
                </h1>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full shadow-sm shadow-emerald-500/10">
                  CLIMATE TECH
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                <span>Carbon Footprint Tracker Platform</span>
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hidden lg:flex items-center gap-4 bg-slate-900/80 border border-slate-800/90 px-4 py-1.5 rounded-full text-xs shadow-inner">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Total Footprint:</span>
              <span className="font-extrabold text-emerald-400 font-mono">{totalCO2.toFixed(1)} kg CO₂</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Weekly Target:</span>
              <span className="font-bold text-slate-200 font-mono">{weeklyCO2.toFixed(1)} / {weeklyTarget.toFixed(1)} kg</span>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={onExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-all hover:text-white cursor-pointer"
              title="Export Logged Activities to CSV"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={onOpenDecisions}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-all hover:text-white cursor-pointer"
              title="View Decision Points (DP1, DP2, DP3)"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>DECISIONS.md</span>
            </button>

            <button
              onClick={onOpenApiDocs}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 transition-all shadow-sm shadow-emerald-950/50 cursor-pointer"
              title="Standard REST API Endpoints & Interactive Sandbox"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Standard API</span>
            </button>

            <button
              onClick={onResetData}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-all cursor-pointer"
              title="Reset dataset to default state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Bottom Navigation Tabs Toolbar */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'logger', label: 'Log Entry', icon: PlusCircle },
            { id: 'history', label: 'History', icon: History },
            { id: 'routes', label: 'Route Tool', icon: Compass },
            { id: 'power', label: 'Appliance Power', icon: Zap },
            { id: 'meals', label: 'Meal Planner', icon: Utensils },
            { id: 'coach', label: 'AI Advisor', icon: Bot },
            { id: 'benchmarks', label: 'Badges & Goals', icon: Award }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20 ring-1 ring-emerald-400/30'
                    : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
