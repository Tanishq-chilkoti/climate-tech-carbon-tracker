import React from 'react';
import { Award, CheckCircle2, Lock, Sparkles, Shield, Bus, Utensils, Zap } from 'lucide-react';

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
      unlocked: busCount >= 2,
      progress: `${Math.min(busCount, 2)} / 2 trips`
    },
    {
      id: 'plant-hero',
      title: 'Plant-Based Hero',
      desc: 'Log 3 or more vegetarian meals',
      icon: Utensils,
      unlocked: vegCount >= 3,
      progress: `${Math.min(vegCount, 3)} / 3 meals`
    },
    {
      id: 'energy-guardian',
      title: 'Energy Guardian',
      desc: 'Log electricity usage entries',
      icon: Zap,
      unlocked: elecTotal > 0,
      progress: elecTotal > 0 ? `${elecTotal.toFixed(1)} kWh logged` : '0 kWh'
    },
    {
      id: 'diversity-master',
      title: 'Carbon Explorer',
      desc: 'Record activities across 4 different categories',
      icon: Sparkles,
      unlocked: categoriesCount >= 4,
      progress: `${categoriesCount} / 4 categories`
    },
    {
      id: 'target-hero',
      title: 'Budget Master',
      desc: 'Keep weekly total within target budget',
      icon: Shield,
      unlocked: !summary.isTargetExceeded,
      progress: summary.isTargetExceeded ? 'Target Exceeded' : 'On Track'
    }
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="card" style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <p className="section-label" style={{ margin: 0 }}>Achievements</p>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--dark)', margin: '4px 0 0' }}>Eco Milestones & Badges</h3>
        </div>
        <span className="chip-green" style={{ fontSize: 11 }}>
          {unlockedCount} of {badges.length} Unlocked
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {badges.map(badge => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.id}
              className={`card ${badge.unlocked ? '' : 'card-cream'}`}
              style={{ padding: 20, opacity: badge.unlocked ? 1 : 0.7 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: badge.unlocked ? 'var(--green)' : 'rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={badge.unlocked ? '#FFF' : 'var(--text-muted)'} />
                </div>
                {badge.unlocked ? (
                  <span className="chip-green" style={{ fontSize: 10 }}>Unlocked</span>
                ) : (
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>Locked</span>
                )}
              </div>

              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--dark)', marginBottom: 4 }}>{badge.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-body)', lineHeight: 1.4, marginBottom: 12 }}>{badge.desc}</div>

              <div style={{ paddingTop: 10, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: badge.unlocked ? 'var(--green)' : 'var(--text-muted)' }}>
                <span>Progress:</span>
                <span>{badge.progress}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
