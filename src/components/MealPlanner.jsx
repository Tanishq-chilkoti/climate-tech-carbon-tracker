import React, { useState } from 'react';
import { Utensils, Flame, Sparkles, PlusCircle, ArrowRight } from 'lucide-react';

const MEAL_PRESETS = [
  { id: 'beef', name: 'Beef / Lamb Burger', type: 'non-veg meal', qtyPerServing: 1, co2PerServing: 2.50, icon: '🥩', tag: 'High Carbon' },
  { id: 'chicken', name: 'Grilled Chicken Salad', type: 'non-veg meal', qtyPerServing: 1, co2PerServing: 0.80, icon: '🍗', tag: 'Medium Carbon' },
  { id: 'fish', name: 'Fish & Rice Bowl', type: 'non-veg meal', qtyPerServing: 1, co2PerServing: 1.00, icon: '🐟', tag: 'Medium Carbon' },
  { id: 'tofu', name: 'Tofu & Veggie Stir-fry', type: 'veg meal', qtyPerServing: 1, co2PerServing: 0.50, icon: '🥗', tag: 'Low Carbon' },
  { id: 'avocado', name: 'Vegan Avocado Toast', type: 'veg meal', qtyPerServing: 1, co2PerServing: 0.20, icon: '🥑', tag: 'Ultra Low Carbon' }
];

export default function MealPlanner({ onLogActivity }) {
  const [selectedMeal, setSelectedMeal] = useState(MEAL_PRESETS[3]); // Tofu default
  const [servings, setServings] = useState(1);
  const [loading, setLoading] = useState(false);

  const totalCO2 = parseFloat((selectedMeal.co2PerServing * servings).toFixed(2));

  const handleLog = async () => {
    try {
      setLoading(true);
      await onLogActivity({
        type: selectedMeal.type,
        quantity: servings,
        date: new Date().toISOString().split('T')[0],
        notes: `Meal: ${selectedMeal.name}`
      });
    } catch (err) {
      alert(err.message || 'Failed to log meal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Utensils className="w-5 h-5 text-emerald-400" />
            Carbon-Conscious Meal & Diet Planner
          </h2>
          <p className="text-xs text-slate-400">Select meals to evaluate carbon output & log directly into your tracker</p>
        </div>
        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          Diet Calculator
        </span>
      </div>

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {MEAL_PRESETS.map((meal) => {
          const isSelected = selectedMeal.id === meal.id;
          return (
            <button
              type="button"
              key={meal.id}
              onClick={() => setSelectedMeal(meal)}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                isSelected
                  ? 'bg-emerald-950/50 border-emerald-500/50 ring-1 ring-emerald-500/40 text-white shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="text-2xl mb-1.5">{meal.icon}</div>
              <h4 className="text-xs font-bold text-white mb-0.5 truncate">{meal.name}</h4>
              <p className="text-[10px] text-slate-400 font-mono">~{meal.co2PerServing} kg CO₂ / serving</p>
            </button>
          );
        })}
      </div>

      {/* Calculator Bar */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Servings Count
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={servings}
              onChange={(e) => setServings(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Total Meal Footprint
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-emerald-400 font-mono">{totalCO2}</span>
              <span className="text-xs font-bold text-slate-400">kg CO₂</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLog}
          disabled={loading}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{loading ? 'Logging Meal...' : `Log ${selectedMeal.name}`}</span>
        </button>
      </div>

    </div>
  );
}
