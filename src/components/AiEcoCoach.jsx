import React, { useState } from 'react';
import { Bot, Lightbulb, ArrowRight, RefreshCw } from 'lucide-react';

export default function AiEcoCoach({ summary, activities }) {
  const [loading, setLoading] = useState(false);
  const [adviceIndex, setAdviceIndex] = useState(0);

  if (!summary) return null;

  const { weeklyTarget, groupBreakdown = {} } = summary;

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
      content: `You have consumed ${summary.budgetConsumedPct || 0}% of your weekly target budget. To stay strictly within your ${weeklyTarget} kg budget, keep daily output below ${(weeklyTarget / 7).toFixed(1)} kg CO₂.`,
      action: 'Set daily reminder to log transport choices.'
    }
  ];

  const currentTip = tipsList[adviceIndex % tipsList.length];

  const handleGenerateNextTip = () => {
    setLoading(true);
    setTimeout(() => {
      setAdviceIndex(prev => prev + 1);
      setLoading(false);
    }, 200);
  };

  return (
    <div className="card-dark" style={{ padding: 28, position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Bot size={22} color="var(--green-light)" />
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.5)' }}>
              AI Eco Advisor
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFF', margin: 0 }}>Smart Carbon Insights</h3>
          </div>
        </div>
        <button
          onClick={handleGenerateNextTip}
          disabled={loading}
          className="btn-outline"
          style={{ color: '#FFF', borderColor: 'rgba(255,255,255,0.2)', fontSize: 11, padding: '6px 12px' }}
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> New Tip
        </button>
      </div>

      <div style={{ padding: 20, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#FBBF24', fontSize: 14, fontWeight: 800 }}>
          <Lightbulb size={16} />
          {currentTip.title}
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, margin: '0 0 12px' }}>
          {currentTip.content}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: 'var(--green-light)' }}>
          <ArrowRight size={13} />
          {currentTip.action}
        </div>
      </div>
    </div>
  );
}
