import React, { useState } from 'react';
import { 
  Target, 
  AlertTriangle, 
  CheckCircle2, 
  Edit2, 
  TrendingUp, 
  Sparkles,
  Zap,
  Info,
  Calendar,
  Flame,
  ArrowRight
} from 'lucide-react';

export default function WeeklyTarget({ summary, onUpdateTarget }) {
  if (!summary) return null;

  const {
    weeklyCO2,
    weeklyTarget,
    budgetConsumedPct,
    timeElapsedPct,
    isTargetExceeded,
    isPacingHigh,
    nudge
  } = summary;

  const [isEditing, setIsEditing] = useState(false);
  const [newTarget, setNewTarget] = useState(weeklyTarget.toString());
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    const val = parseFloat(newTarget);
    if (!val || val <= 0) return;
    try {
      setLoading(true);
      await onUpdateTarget(val);
      setIsEditing(false);
    } catch (err) {
      alert(err.message || 'Failed to update target');
    } finally {
      setLoading(false);
    }
  };

  // Status color determination
  let progressColor = 'from-emerald-500 to-teal-400';
  let badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  let statusText = 'Target On Track';

  if (isTargetExceeded) {
    progressColor = 'from-rose-600 to-red-500';
    badgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    statusText = 'Target Exceeded';
  } else if (budgetConsumedPct >= 80) {
    progressColor = 'from-amber-500 to-orange-400';
    badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    statusText = 'Budget Warning';
  }

  return (
    <div className="space-y-4">
      
      {/* Target Progress Card */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                Weekly Target Budget
              </h2>
              <p className="text-xs text-slate-400">Feature 4 & DP3 · Mid-Week Pacing</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${badgeColor}`}>
              {statusText}
            </span>
            <button
              onClick={() => {
                setNewTarget(weeklyTarget.toString());
                setIsEditing(!isEditing);
              }}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
              title="Edit Weekly Target"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Edit Target Form Drawer */}
        {isEditing && (
          <form onSubmit={handleSave} className="mb-5 p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                New Weekly CO₂ Target (kg)
              </label>
              <input
                type="number"
                step="any"
                min="1"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div className="flex items-center gap-2 self-end">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {/* Big Numbers Row */}
        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{weeklyCO2.toFixed(1)}</span>
            <span className="text-sm font-semibold text-slate-400">/ {weeklyTarget.toFixed(1)} kg CO₂</span>
          </div>
          <span className="text-sm font-extrabold text-slate-200 font-mono">
            {budgetConsumedPct}%
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 relative mb-3">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${progressColor} transition-all duration-500`}
            style={{ width: `${Math.min(budgetConsumedPct, 100)}%` }}
          />
        </div>

        {/* DP3 Mid-Week Pacing Indicator */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              ISO Week Elapsed:
            </span>
            <span className="font-bold text-slate-200 font-mono">{timeElapsedPct}% of 7 Days</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              Burn-Rate Pacing:
            </span>
            {isPacingHigh ? (
              <span className="font-extrabold text-amber-400 flex items-center gap-1">
                ⚠️ High Burn Rate
              </span>
            ) : (
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                ✓ Normal Pace
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Decision Point 1 · The Nudge Banner */}
      {isTargetExceeded && (
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-rose-500 bg-rose-950/20 border-rose-500/30 shadow-xl shadow-rose-950/20 space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-500/30">
                Decision Point 1 · The Nudge Active
              </span>
              <h3 className="text-sm font-extrabold text-white mt-0.5">
                Weekly Target Cross Warning
              </h3>
            </div>
          </div>

          <p className="text-xs text-rose-200/90 font-medium leading-relaxed">
            {nudge.message} We encourage positive reduction choices to bring your footprint back on track!
          </p>

          {/* Actionable Micro-Encouragement Tips */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-rose-500/20 space-y-2">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Recommended Quick Actions to Reduce Footprint:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {nudge.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}
