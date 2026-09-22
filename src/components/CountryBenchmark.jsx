import React, { useState } from 'react';
import { Globe, Award, TrendingDown, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

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

  // Estimate user's daily average (assuming totalCO2 over active logs or 7 days)
  const daysActive = Math.max(totalLogs > 0 ? 7 : 1, 1);
  const userDailyAvg = parseFloat((totalCO2 / daysActive).toFixed(1));

  const benchmark = BENCHMARKS.find(b => b.country === selectedCountry) || BENCHMARKS[0];
  const pctOfBenchmark = parseFloat(((userDailyAvg / benchmark.dailyAvg) * 100).toFixed(1));

  const isBetterThanBenchmark = userDailyAvg <= benchmark.dailyAvg;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-teal-500/30 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-teal-400" />
            Global & Country Carbon Benchmarks
          </h3>
          <p className="text-xs text-slate-400">Compare your footprint against global averages & Paris Climate Accord targets</p>
        </div>

        {/* Country Selector */}
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500 font-medium cursor-pointer"
        >
          {BENCHMARKS.map(b => (
            <option key={b.country} value={b.country}>
              {b.flag} {b.country} ({b.dailyAvg} kg/day)
            </option>
          ))}
        </select>
      </div>

      {/* Visual Benchmark Gauge */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
        
        {/* Metric Comparison Numbers */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Your Daily Output</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-black text-white font-mono">{userDailyAvg}</span>
              <span className="text-xs font-bold text-emerald-400">kg CO₂ / day</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {benchmark.flag} {benchmark.country} Benchmark
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-black text-slate-300 font-mono">{benchmark.dailyAvg}</span>
              <span className="text-xs font-bold text-slate-400">kg CO₂ / day</span>
            </div>
          </div>
        </div>

        {/* Comparative Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
            <span className="text-slate-400">Benchmark Ratio:</span>
            <span className={isBetterThanBenchmark ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {pctOfBenchmark}% of {benchmark.country} Benchmark
            </span>
          </div>

          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isBetterThanBenchmark ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-rose-500'
              }`}
              style={{ width: `${Math.min(pctOfBenchmark, 100)}%` }}
            />
          </div>
        </div>

        {/* Status Badge */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">{benchmark.note}</span>
          {isBetterThanBenchmark ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Below Benchmark 🎉
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Above Target
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
