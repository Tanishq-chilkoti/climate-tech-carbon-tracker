import React, { useState } from 'react';
import { Sliders, Sparkles, RefreshCw } from 'lucide-react';

export default function CarbonSimulator() {
  const [vegSwaps, setVegSwaps] = useState(3);
  const [transitKm, setTransitKm] = useState(30);
  const [energySaved, setEnergySaved] = useState(10);

  const weeklyVegSavings = vegSwaps * 1.5;
  const weeklyTransitSavings = transitKm * 0.12;
  const weeklyEnergySavings = energySaved * 0.80;

  const totalWeeklySavings = weeklyVegSavings + weeklyTransitSavings + weeklyEnergySavings;
  const annualSavings = totalWeeklySavings * 52;
  const annualTreesEquivalent = (annualSavings / 21).toFixed(1);

  return (
    <div className="card" style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <p className="section-label" style={{ margin: 0 }}>Interactive Simulation</p>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--dark)', margin: '4px 0 0' }}>Carbon Savings Calculator</h3>
        </div>
        <button
          onClick={() => { setVegSwaps(3); setTransitKm(30); setEnergySaved(10); }}
          className="btn-outline"
          style={{ fontSize: 11, padding: '6px 12px' }}
        >
          <RefreshCw size={13} /> Reset
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        
        <div style={{ padding: 20, borderRadius: 12, background: 'var(--cream-dark)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
            <span>Veg Meal Swaps</span>
            <span style={{ color: 'var(--green)' }}>{vegSwaps} / week</span>
          </div>
          <input
            type="range"
            min="0"
            max="14"
            step="1"
            value={vegSwaps}
            onChange={(e) => setVegSwaps(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>-1.5 kg CO₂ per swapped meal</div>
        </div>

        <div style={{ padding: 20, borderRadius: 12, background: 'var(--cream-dark)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
            <span>Bus vs Car Transit</span>
            <span style={{ color: 'var(--green)' }}>{transitKm} km / week</span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            step="5"
            value={transitKm}
            onChange={(e) => setTransitKm(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>-0.12 kg CO₂ per bus km</div>
        </div>

        <div style={{ padding: 20, borderRadius: 12, background: 'var(--cream-dark)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
            <span>Electricity Saved</span>
            <span style={{ color: 'var(--green)' }}>{energySaved} kWh / week</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={energySaved}
            onChange={(e) => setEnergySaved(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>-0.80 kg CO₂ per kWh</div>
        </div>

      </div>

      <div style={{ padding: 24, borderRadius: 12, background: 'var(--dark-card)', color: '#FFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: 'var(--green-light)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            <Sparkles size={14} /> Projected Reduction
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
            <span style={{ fontSize: 32, fontWeight: 900 }}>{totalWeeklySavings.toFixed(1)}</span>
            <span style={{ fontSize: 12, color: 'var(--green-light)' }}>kg CO₂ saved / week</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, textAlign: 'right' }}>
          <div>
            <div style={{ fontSize: 10, textTransform: 'uppercase', opacity: 0.6 }}>Annual CO₂ Saved</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--green-light)' }}>{annualSavings.toFixed(0)} kg</div>
          </div>
          <div>
            <div style={{ fontSize: 10, textTransform: 'uppercase', opacity: 0.6 }}>Tree Equivalent</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#FFF' }}>+{annualTreesEquivalent} trees/yr</div>
          </div>
        </div>
      </div>
    </div>
  );
}
