import React, { useState } from 'react';
import { Sparkles, Sliders, TreePine, Flame, Car, Zap, ArrowRight, RefreshCw } from 'lucide-react';

export default function CarbonSimulator() {
  const [vegSwaps, setVegSwaps] = useState(3); // 3 meals/wk swapped from non-veg (2.0 - 0.5 = 1.5kg saved/meal)
  const [transitKm, setTransitKm] = useState(30); // 30 km car swapped to bus (0.20 - 0.08 = 0.12kg saved/km)
  const [energySaved, setEnergySaved] = useState(10); // 10 kWh saved/wk (0.80kg saved/kWh)

  // Calculations
  const weeklyVegSavings = vegSwaps * 1.5; // kg
  const weeklyTransitSavings = transitKm * 0.12; // kg
  const weeklyEnergySavings = energySaved * 0.80; // kg

  const totalWeeklySavings = weeklyVegSavings + weeklyTransitSavings + weeklyEnergySavings;
  const annualSavings = totalWeeklySavings * 52; // kg per yr
  const annualTreesEquivalent = (annualSavings / 21).toFixed(1);
  const annualMilesAvoided = (annualSavings / 0.20).toFixed(0);

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-teal-400" />
            Interactive Carbon Impact Simulator
          </h2>
          <p className="text-xs text-slate-400">Simulate habit changes to see projected annual emissions & tree savings</p>
        </div>
        <button
          onClick={() => {
            setVegSwaps(3);
            setTransitKm(30);
            setEnergySaved(10);
          }}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all text-xs flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Sliders</span>
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Slider 1: Meal Swaps */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-emerald-400" />
              Veg Meal Swaps
            </span>
            <span className="text-xs font-extrabold text-emerald-400 font-mono">{vegSwaps} meals/wk</span>
          </div>
          <input
            type="range"
            min="0"
            max="14"
            step="1"
            value={vegSwaps}
            onChange={(e) => setVegSwaps(parseInt(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <p className="text-[11px] text-slate-400">Swap non-veg for plant-based meals (-1.5 kg CO₂ each)</p>
        </div>

        {/* Slider 2: Transit Shift */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Car className="w-4 h-4 text-cyan-400" />
              Bus vs Car Transit
            </span>
            <span className="text-xs font-extrabold text-cyan-400 font-mono">{transitKm} km/wk</span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            step="5"
            value={transitKm}
            onChange={(e) => setTransitKm(parseInt(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <p className="text-[11px] text-slate-400">Replace solo driving with transit bus (-0.12 kg CO₂/km)</p>
        </div>

        {/* Slider 3: Energy Savings */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Electricity Saved
            </span>
            <span className="text-xs font-extrabold text-amber-400 font-mono">{energySaved} kWh/wk</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={energySaved}
            onChange={(e) => setEnergySaved(parseInt(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <p className="text-[11px] text-slate-400">Reduce power/AC usage (-0.80 kg CO₂/kWh)</p>
        </div>

      </div>

      {/* Projected Impact Output Cards */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Projected Reduction Impact
          </span>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-3xl font-black text-white font-mono">{totalWeeklySavings.toFixed(1)}</span>
            <span className="text-xs font-bold text-emerald-400">kg CO₂ saved / week</span>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-6">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Annual CO₂ Saved</span>
            <p className="text-lg font-bold text-emerald-400 font-mono">{annualSavings.toFixed(0)} kg</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Tree Equivalent</span>
            <p className="text-lg font-bold text-teal-300 font-mono">+{annualTreesEquivalent} trees/yr</p>
          </div>
        </div>
      </div>
    </div>
  );
}
