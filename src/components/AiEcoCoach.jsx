import React, { useState } from 'react';
import { Bot, Sparkles, Lightbulb, TrendingDown, ArrowRight, Zap, RefreshCw } from 'lucide-react';

export default function AiEcoCoach({ summary, activities }) {
  const [loading, setLoading] = useState(false);
  const [adviceIndex, setAdviceIndex] = useState(0);

  if (!summary) return null;

  const { totalCO2, weeklyCO2, weeklyTarget, groupBreakdown } = summary;

  const topGroup = Object.entries(groupBreakdown).sort((a, b) => b[1] - a[1])[0];
  const topCategory = topGroup ? topGroup[0] : 'Transport';

  const tipsList = [
    {
      title: `Optimize Your ${topCategory} Footprint`,
      content: `Your highest emission category is ${topCategory} (${groupBreakdown[topCategory] || 0} kg CO₂). Shifting just 20% of your ${topCategory.toLowerCase()} activities to green alternatives will save ~${((groupBreakdown[topCategory] || 5) * 0.2).toFixed(1)} kg CO₂ per week.`,
      action: `Try swapping 1 drive with bus transit today!`
    },
    {
      title: 'Dietary Carbon Leverage',
      content: 'Did you know? Replacing 2 beef/non-veg meals with plant-based options saves 3.0 kg CO₂ per week—the equivalent of planting 1 tree every fortnight!',
      action: 'Log a Veg Meal today to earn the Plant Hero badge.'
    },
    {
      title: 'Energy Efficiency Insight',
      content: 'Air Conditioning and space heating account for up to 60% of home electricity. Setting your thermostat 2°C higher in summer cuts cooling electricity footprint by 15%.',
      action: 'Turn down AC by 1 hour to save ~0.80 kg CO₂.'
    },
    {
      title: 'ISO Mid-Week Pacing Strategy',
      content: `You have consumed ${summary.budgetConsumedPct}% of your weekly target budget. To stay strictly within your ${weeklyTarget} kg budget, aim to keep daily output below ${(weeklyTarget / 7).toFixed(1)} kg CO₂.`,
      action: 'Set daily reminder to log transport choices.'
    }
  ];

  const currentTip = tipsList[adviceIndex % tipsList.length];

  const handleGenerateNextTip = () => {
    setLoading(true);
    setTimeout(() => {
      setAdviceIndex(prev => prev + 1);
      setLoading(false);
    }, 300);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 relative overflow-hidden space-y-4">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white">AI Carbon Coach & Advisor</h3>
              <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                AI Powered
              </span>
            </div>
            <p className="text-xs text-slate-400">Personalized climate recommendations based on real-time activity analysis</p>
          </div>
        </div>

        <button
          onClick={handleGenerateNextTip}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>New AI Advice</span>
        </button>
      </div>

      {/* AI Advice Card */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>{currentTip.title}</span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed">
          {currentTip.content}
        </p>
        <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-[11px] font-semibold text-teal-300">
          <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          <span>Recommended Action: {currentTip.action}</span>
        </div>
      </div>
    </div>
  );
}
