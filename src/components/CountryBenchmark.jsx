import React, { useState } from 'react';
import { Globe, CheckCircle2, AlertTriangle } from 'lucide-react';

const BENCHMARKS = [
  { country: 'Global Average', dailyAvg: 12.0, flag: '🌍', note: 'Global per-capita daily carbon emission' },
  { country: 'Paris Accord Target (2t/yr)', dailyAvg: 5.5, flag: '🎯', note: 'Maximum sustainable emission per person' },
  { country: 'United States', dailyAvg: 38.0, flag: '🇺🇸', note: 'US per-capita daily emission benchmark' },
  { country: 'Germany', dailyAvg: 22.0, flag: '🇩🇪', note: 'German per-capita daily benchmark' },
  { country: 'United Kingdom', dailyAvg: 15.0, flag: '🇬🇧', note: 'UK per-capita daily benchmark' },
  { country: 'India', dailyAvg: 5.2, flag: '🇮🇳', note: 'India per-capita daily benchmark' }
];

export default function CountryBenchmark({ totalCO2, totalLogs }) {
  const [selectedCountry, setSelectedCountry] = useState('Global Average');

  const daysActive = Math.max(totalLogs > 0 ? 7 : 1, 1);
  const userDailyAvg = parseFloat((totalCO2 / daysActive).toFixed(1));

  const benchmark = BENCHMARKS.find(b => b.country === selectedCountry) || BENCHMARKS[0];
  const pctOfBenchmark = parseFloat(((userDailyAvg / benchmark.dailyAvg) * 100).toFixed(1));
  const isBetterThanBenchmark = userDailyAvg <= benchmark.dailyAvg;

  return (
    <div className="card" style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <p className="section-label" style={{ margin: 0 }}>Global Benchmarks</p>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--dark)', margin: '4px 0 0' }}>Country & Target Comparison</h3>
        </div>

        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="field-input"
          style={{ width: 'auto', fontSize: 12 }}
        >
          {BENCHMARKS.map(b => (
            <option key={b.country} value={b.country}>
              {b.flag} {b.country} ({b.dailyAvg} kg/day)
            </option>
          ))}
        </select>
      </div>

      <div style={{ padding: 24, borderRadius: 12, background: 'var(--cream-dark)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div>
            <span className="field-label">Your Daily Average</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: 'var(--dark)' }}>{userDailyAvg}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)' }}>kg CO₂ / day</span>
            </div>
          </div>

          <div>
            <span className="field-label">{benchmark.flag} {benchmark.country}</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: 'var(--dark)' }}>{benchmark.dailyAvg}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>kg CO₂ / day</span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: 'var(--dark)', marginBottom: 8 }}>
            <span>Benchmark Ratio</span>
            <span>{pctOfBenchmark}% of {benchmark.country}</span>
          </div>
          <div className="progress-track" style={{ height: 8 }}>
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(pctOfBenchmark, 100)}%`,
                background: isBetterThanBenchmark ? 'var(--green)' : '#DC2626'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--border)', fontSize: 12 }}>
          <span style={{ color: 'var(--text-muted)' }}>{benchmark.note}</span>
          {isBetterThanBenchmark ? (
            <span className="chip-green">
              <CheckCircle2 size={13} /> Below Benchmark
            </span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: 99, background: '#FEE2E2', color: '#DC2626', fontSize: 11, fontWeight: 700 }}>
              <AlertTriangle size={13} /> Above Target
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
