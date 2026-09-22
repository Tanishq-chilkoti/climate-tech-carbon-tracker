import React from 'react';
import { Award, CheckCircle2, Lock, Sparkles, Shield, Flame, TreePine, Zap, Bus, Utensils } from 'lucide-react';

export default function EcoBadges({ summary, activities }) {
  if (!summary) return null;

  const busCount = activities.filter(a => a.type === 'bus').length;
  const vegCount = activities.filter(a => a.type === 'veg meal').length;
  const elecTotal = activities.filter(a => a.type === 'electricity').reduce((s, a) => s + a.quantity, 0);
  const categoriesCount = new Set(activities.map(a => a.type)).size;

  const badges = [
    {
      id: 'green-commuter',
      title: 'Green Commuter',
      desc: 'Log 2 or more transit bus trips',
      icon: Bus,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      unlocked: busCount >= 2,
      progress: `${Math.min(busCount, 2)} / 2 trips`
    },
    {
      id: 'plant-hero',
      title: 'Plant-Based Hero',
      desc: 'Log 3 or more vegetarian meals',
      icon: Utensils,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      unlocked: vegCount >= 3,
      progress: `${Math.min(vegCount, 3)} / 3 meals`
    },
    {
      id: 'energy-guardian',
      title: 'Energy Guardian',
      desc: 'Log electricity usage entries',
      icon: Zap,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      unlocked: elecTotal > 0,
      progress: elecTotal > 0 ? `${elecTotal.toFixed(1)} kWh logged` : '0 kWh'
    },
    {
      id: 'diversity-master',
      title: 'Carbon Explorer',
      desc: 'Record activities across 4 different categories',
      icon: Sparkles,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      unlocked: categoriesCount >= 4,
      progress: `${categoriesCount} / 4 categories`
    },
    {
      id: 'target-hero',
      title: 'Budget Master',
      desc: 'Keep weekly total within target budget',
      icon: Shield,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
      unlocked: !summary.isTargetExceeded,
      progress: summary.isTargetExceeded ? 'Target Exceeded' : 'On Track'
    }
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Eco Achievements & Badges
          </h2>
          <p className="text-xs text-slate-400">Gamified milestone rewards earned through sustainable choices</p>
        </div>
        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 font-mono">
          {unlockedCount} of {badges.length} Unlocked
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map(badge => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.id}
              className={`p-4 rounded-xl border transition-all relative overflow-hidden ${
                badge.unlocked
                  ? `${badge.color} shadow-lg shadow-emerald-500/5`
                  : 'bg-slate-900/40 border-slate-800/80 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${badge.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {badge.unlocked ? (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Unlocked
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-slate-500 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Locked
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-white mb-0.5">{badge.title}</h3>
              <p className="text-xs text-slate-400 mb-2">{badge.desc}</p>
              
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Progress:</span>
                <span className={badge.unlocked ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {badge.progress}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
