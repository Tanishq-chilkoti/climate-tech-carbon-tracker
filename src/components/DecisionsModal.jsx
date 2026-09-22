import React, { useEffect, useState } from 'react';
import { X, BookOpen, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { fetchDecisions } from '../services/api';

export default function DecisionsModal({ isOpen, onClose }) {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchDecisions()
        .then(res => {
          if (res.success) setDecisions(res.decisions);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-3xl rounded-2xl p-6 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 space-y-5 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">DECISIONS.md Viewer</h3>
              <p className="text-xs text-slate-400">Architectural & UX choices for Decision Points 1, 2, and 3</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Loading decision points...</div>
          ) : (
            decisions.map((dp) => (
              <div key={dp.id} className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                      {dp.id}
                    </span>
                    <h4 className="text-sm font-extrabold text-white">{dp.name}</h4>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-emerald-300 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Choice: {dp.choice}</span>
                </div>

                <div>
                  <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Rationale</h5>
                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-800/80">
                    {dp.rationale}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
}
