import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, Edit3, Info } from 'lucide-react';

export default function AbsurdInputModal({ 
  isOpen, 
  activity, 
  threshold, 
  onConfirm, 
  onCancel 
}) {
  if (!isOpen || !activity) return null;

  const { type, quantity, co2_kg, unit } = activity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-amber-500/30 shadow-2xl shadow-amber-500/10 space-y-5">
        
        {/* Header Icon */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldAlert className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              Decision Point 2 · Absurd Input
            </span>
            <h3 className="text-lg font-extrabold text-white mt-0.5">High Input Value Detected</h3>
          </div>
        </div>

        {/* Warning Details */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Activity Type:</span>
            <span className="font-bold text-white capitalize">{type}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Entered Quantity:</span>
            <span className="font-extrabold text-amber-400 text-sm">{quantity} {unit}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Calculated CO₂ Impact:</span>
            <span className="font-extrabold text-rose-400 text-sm">{co2_kg.toFixed(1)} kg CO₂</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
            <span className="text-slate-400">Typical Limit Threshold:</span>
            <span className="font-medium text-slate-300">{threshold} {unit}</span>
          </div>
        </div>

        {/* Explanation Rationale */}
        <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong>DP2 Rationale:</strong> Did you mean a lower value? Unusually high entries skew weekly analytics. You may edit your input or double-confirm to submit if this entry was intentional.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Input</span>
          </button>
          
          <button
            onClick={onConfirm}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg shadow-amber-600/20 transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirm & Log</span>
          </button>
        </div>

      </div>
    </div>
  );
}
