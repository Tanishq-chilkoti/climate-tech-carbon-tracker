import React from 'react';
import { Car, Bus, Utensils, Flame, Zap, Plane, Zap as ZapIcon, Sparkles } from 'lucide-react';

const PRESETS = [
  { label: '10km Office Drive', type: 'car', quantity: 10, notes: 'Daily commute', icon: Car, color: 'hover:border-blue-500/50 hover:bg-blue-500/10 text-blue-400' },
  { label: '5km Bus Trip', type: 'bus', quantity: 5, notes: 'Transit trip', icon: Bus, color: 'hover:border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-400' },
  { label: 'Veg Lunch Meal', type: 'veg meal', quantity: 1, notes: 'Plant-based lunch', icon: Utensils, color: 'hover:border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-400' },
  { label: 'Non-veg Dinner', type: 'non-veg meal', quantity: 1, notes: 'Meat dinner', icon: Flame, color: 'hover:border-rose-500/50 hover:bg-rose-500/10 text-rose-400' },
  { label: '5 kWh Electricity', type: 'electricity', quantity: 5, notes: 'Daily appliance power', icon: Zap, color: 'hover:border-amber-500/50 hover:bg-amber-500/10 text-amber-400' },
  { label: '150km Flight', type: 'flight', quantity: 150, notes: 'Short regional flight', icon: Plane, color: 'hover:border-purple-500/50 hover:bg-purple-500/10 text-purple-400' }
];

export default function QuickLogPresets({ onQuickLog }) {
  return (
    <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
            ⚡ Quick-Log Shortcuts <span className="text-slate-400 font-normal">(1-Click Entry)</span>
          </h3>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono border border-emerald-500/20">
          Instant Log
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {PRESETS.map((preset, idx) => {
          const Icon = preset.icon;
          return (
            <button
              key={idx}
              onClick={() => onQuickLog(preset)}
              className={`flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 transition-all text-left group cursor-pointer ${preset.color}`}
            >
              <div className="w-7 h-7 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{preset.label}</p>
                <p className="text-[10px] text-slate-400 font-mono capitalize">{preset.type}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
