import React, { useState } from 'react';
import { Utensils, Flame, Sparkles, PlusCircle, Plus, X, AlertCircle, Leaf } from 'lucide-react';

const DEFAULT_MEAL_PRESETS = [
  { id: 'beef', name: 'Beef / Lamb Burger', type: 'non-veg meal', qtyPerServing: 1, co2PerServing: 2.50, icon: '🥩', tag: 'High Carbon' },
  { id: 'chicken', name: 'Grilled Chicken Salad', type: 'non-veg meal', qtyPerServing: 1, co2PerServing: 0.80, icon: '🍗', tag: 'Medium Carbon' },
  { id: 'fish', name: 'Fish & Rice Bowl', type: 'non-veg meal', qtyPerServing: 1, co2PerServing: 1.00, icon: '🐟', tag: 'Medium Carbon' },
  { id: 'tofu', name: 'Tofu & Veggie Stir-fry', type: 'veg meal', qtyPerServing: 1, co2PerServing: 0.50, icon: '🥗', tag: 'Low Carbon' },
  { id: 'avocado', name: 'Vegan Avocado Toast', type: 'veg meal', qtyPerServing: 1, co2PerServing: 0.20, icon: '🥑', tag: 'Ultra Low Carbon' }
];

const MEAL_EMOJIS = ['🍽️','🥘','🍲','🥙','🌮','🍛','🥞','🍱','🫕','🥗'];

function AddMealModal({ onAdd, onClose }) {
  const [name, setName] = useState('');
  const [co2, setCo2] = useState('');
  const [mealType, setMealType] = useState('veg meal');
  const [selectedEmoji, setSelectedEmoji] = useState(MEAL_EMOJIS[0]);
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!name.trim()) { setError('Please enter a meal name.'); return; }
    if (!co2 || parseFloat(co2) <= 0) { setError('Please enter a valid CO₂ value > 0.'); return; }

    const newMeal = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      type: mealType,
      qtyPerServing: 1,
      co2PerServing: parseFloat(parseFloat(co2).toFixed(3)),
      icon: selectedEmoji,
      tag: parseFloat(co2) <= 0.5 ? 'Low Carbon' : parseFloat(co2) <= 1.5 ? 'Medium Carbon' : 'High Carbon',
      isCustom: true
    };
    onAdd(newMeal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-emerald-500/30 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            Add Custom Meal
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Emoji picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Pick Icon</label>
            <div className="flex gap-2 flex-wrap">
              {MEAL_EMOJIS.map(em => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setSelectedEmoji(em)}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center border transition-all ${selectedEmoji === em ? 'border-emerald-500 bg-emerald-500/20' : 'border-slate-700 bg-slate-900/60 hover:border-slate-600'}`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Meal Name</label>
            <input
              type="text"
              placeholder="e.g. Lentil Soup, Turkey Sandwich..."
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">CO₂ per Serving (kg)</label>
              <input
                type="number"
                step="any"
                min="0.001"
                placeholder="e.g. 0.80"
                value={co2}
                onChange={e => setCo2(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Meal Type</label>
              <select
                value={mealType}
                onChange={e => setMealType(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
              >
                <option value="veg meal">🥦 Veg Meal</option>
                <option value="non-veg meal">🍗 Non-veg Meal</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-all">
              Cancel
            </button>
            <button onClick={handleAdd} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Add Meal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MealPlanner({ onLogActivity }) {
  const [mealPresets, setMealPresets] = useState(DEFAULT_MEAL_PRESETS);
  const [selectedMeal, setSelectedMeal] = useState(DEFAULT_MEAL_PRESETS[3]); // Tofu default
  const [servings, setServings] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const totalCO2 = parseFloat((selectedMeal.co2PerServing * servings).toFixed(2));

  const handleAddMeal = (newMeal) => {
    setMealPresets(prev => [...prev, newMeal]);
    setSelectedMeal(newMeal);
  };

  const handleRemoveMeal = (mealId, e) => {
    e.stopPropagation();
    setMealPresets(prev => prev.filter(m => m.id !== mealId));
    if (selectedMeal.id === mealId) {
      setSelectedMeal(mealPresets.find(m => m.id !== mealId) || DEFAULT_MEAL_PRESETS[3]);
    }
  };

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
            Carbon-Conscious Meal &amp; Diet Planner
          </h2>
          <p className="text-xs text-slate-400">Select meals to evaluate carbon output &amp; log directly into your tracker</p>
        </div>
        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          Diet Calculator
        </span>
      </div>

      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{mealPresets.length} meals available · {mealPresets.filter(m => m.isCustom).length} custom</p>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg transition-all"
        >
          <Plus className="w-3 h-3" />
          Add Custom Meal
        </button>
      </div>

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {mealPresets.map((meal) => {
          const isSelected = selectedMeal.id === meal.id;
          return (
            <button
              type="button"
              key={meal.id}
              onClick={() => setSelectedMeal(meal)}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden cursor-pointer group ${
                isSelected
                  ? 'bg-emerald-950/50 border-emerald-500/50 ring-1 ring-emerald-500/40 text-white shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="text-2xl mb-1.5">{meal.icon}</div>
              <h4 className="text-xs font-bold text-white mb-0.5 truncate">{meal.name}</h4>
              <p className="text-[10px] text-slate-400 font-mono">~{meal.co2PerServing} kg CO₂ / serving</p>
              {meal.isCustom && (
                <span className="text-[9px] font-bold text-teal-400">Custom</span>
              )}
              {meal.isCustom && (
                <button
                  type="button"
                  onClick={(e) => handleRemoveMeal(meal.id, e)}
                  className="absolute top-1.5 right-1.5 w-5 h-5 flex items-center justify-center rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-all opacity-0 group-hover:opacity-100"
                  title="Remove meal"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
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

      {showAddModal && (
        <AddMealModal onAdd={handleAddMeal} onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
