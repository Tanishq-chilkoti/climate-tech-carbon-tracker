import React, { useState } from 'react';
import { Utensils, PlusCircle, Plus, X, AlertCircle, ChevronDown, ChevronUp, Leaf, Drumstick } from 'lucide-react';

const DEFAULT_MEAL_PRESETS = [
  { id: 'beef',    name: 'Beef / Lamb Burger',      type: 'non-veg meal', co2PerServing: 2.50, icon: '🥩', tag: 'High Carbon' },
  { id: 'chicken', name: 'Grilled Chicken Salad',   type: 'non-veg meal', co2PerServing: 0.80, icon: '🍗', tag: 'Medium Carbon' },
  { id: 'fish',    name: 'Fish & Rice Bowl',        type: 'non-veg meal', co2PerServing: 1.00, icon: '🐟', tag: 'Medium Carbon' },
  { id: 'tofu',    name: 'Tofu & Veggie Stir-fry',  type: 'veg meal',     co2PerServing: 0.50, icon: '🥗', tag: 'Low Carbon' },
  { id: 'avocado', name: 'Vegan Avocado Toast',     type: 'veg meal',     co2PerServing: 0.20, icon: '🥑', tag: 'Ultra Low Carbon' },
];

const VEG_EMOJIS    = ['🥗','🥦','🥑','🥕','🫛','🌽','🍲','🥘','🌮','🧆'];
const NONVEG_EMOJIS = ['🍗','🥩','🐟','🍖','🦐','🥚','🍔','🌭','🍣','🦑'];

const TAG_COLOR = {
  'Ultra Low Carbon': 'text-emerald-400',
  'Low Carbon':       'text-green-400',
  'Medium Carbon':    'text-amber-400',
  'High Carbon':      'text-rose-400',
};

function getTag(co2) {
  if (co2 <= 0.3) return 'Ultra Low Carbon';
  if (co2 <= 0.8) return 'Low Carbon';
  if (co2 <= 1.5) return 'Medium Carbon';
  return 'High Carbon';
}

/* ── Inline "Add Meal" panel ── */
function AddMealPanel({ onAdd, onClose }) {
  const [mealType, setMealType]         = useState('veg meal');
  const [name, setName]                 = useState('');
  const [co2, setCo2]                   = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(VEG_EMOJIS[0]);
  const [error, setError]               = useState('');

  const emojis = mealType === 'veg meal' ? VEG_EMOJIS : NONVEG_EMOJIS;

  // when user switches type, reset emoji to first of that set
  const switchType = (t) => {
    setMealType(t);
    setSelectedEmoji(t === 'veg meal' ? VEG_EMOJIS[0] : NONVEG_EMOJIS[0]);
    setError('');
  };

  const handleAdd = () => {
    if (!name.trim())                     { setError('Please enter a meal name.'); return; }
    if (!co2 || parseFloat(co2) <= 0)     { setError('Enter a valid CO₂ value (kg per serving).'); return; }

    const co2Val = parseFloat(parseFloat(co2).toFixed(3));
    onAdd({
      id: `custom_${Date.now()}`,
      name: name.trim(),
      type: mealType,
      co2PerServing: co2Val,
      icon: selectedEmoji,
      tag: getTag(co2Val),
      isCustom: true,
    });

    // reset
    setName(''); setCo2(''); setError('');
    setSelectedEmoji(mealType === 'veg meal' ? VEG_EMOJIS[0] : NONVEG_EMOJIS[0]);
    onClose();
  };

  return (
    <div className="rounded-2xl border border-emerald-500/25 bg-slate-900/80 backdrop-blur-sm p-5 space-y-4 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-400" />
          Add New Meal Option
        </h3>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Veg / Non-veg big toggle */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => switchType('veg meal')}
          className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all font-bold text-sm ${
            mealType === 'veg meal'
              ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400 shadow-lg shadow-emerald-500/10'
              : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-600'
          }`}
        >
          <span className="text-3xl">🥦</span>
          <span>Veg Meal</span>
        </button>
        <button
          type="button"
          onClick={() => switchType('non-veg meal')}
          className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all font-bold text-sm ${
            mealType === 'non-veg meal'
              ? 'border-rose-500 bg-rose-500/15 text-rose-400 shadow-lg shadow-rose-500/10'
              : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-600'
          }`}
        >
          <span className="text-3xl">🍗</span>
          <span>Non-veg Meal</span>
        </button>
      </div>

      {/* Emoji picker */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Pick an Icon</label>
        <div className="flex gap-2 flex-wrap">
          {emojis.map(em => (
            <button
              key={em}
              type="button"
              onClick={() => setSelectedEmoji(em)}
              className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center border transition-all ${
                selectedEmoji === em
                  ? mealType === 'veg meal'
                    ? 'border-emerald-500 bg-emerald-500/20'
                    : 'border-rose-500 bg-rose-500/20'
                  : 'border-slate-700 bg-slate-900/60 hover:border-slate-600'
              }`}
            >
              {em}
            </button>
          ))}
        </div>
      </div>

      {/* Name + CO2 */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Meal Name</label>
        <input
          type="text"
          placeholder={mealType === 'veg meal' ? 'e.g. Dal Tadka, Veggie Wrap…' : 'e.g. Mutton Biryani, Prawn Curry…'}
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          CO₂ per Serving (kg)
          <span className="ml-2 text-slate-500 font-normal normal-case">
            — veg ≈ 0.2–0.6 · non-veg ≈ 0.8–3.0
          </span>
        </label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          placeholder={mealType === 'veg meal' ? '0.50' : '1.50'}
          value={co2}
          onChange={e => setCo2(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
        />
        {co2 && parseFloat(co2) > 0 && (
          <p className={`text-[11px] mt-1 font-semibold ${TAG_COLOR[getTag(parseFloat(co2))] || 'text-slate-400'}`}>
            → {getTag(parseFloat(co2))}
          </p>
        )}
      </div>

      {error && (
        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleAdd}
          className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-1.5 ${
            mealType === 'veg meal'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
              : 'bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          Add {mealType === 'veg meal' ? 'Veg' : 'Non-veg'} Meal
        </button>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function MealPlanner({ onLogActivity }) {
  const [mealPresets, setMealPresets]   = useState(DEFAULT_MEAL_PRESETS);
  const [selectedMeal, setSelectedMeal] = useState(DEFAULT_MEAL_PRESETS[3]);
  const [servings, setServings]         = useState(1);
  const [loading, setLoading]           = useState(false);
  const [showAddPanel, setShowAddPanel] = useState(false);

  // filter view
  const [filterType, setFilterType] = useState('all'); // 'all' | 'veg meal' | 'non-veg meal'

  const totalCO2 = parseFloat((selectedMeal.co2PerServing * servings).toFixed(2));

  const visibleMeals = mealPresets.filter(m =>
    filterType === 'all' ? true : m.type === filterType
  );

  const handleAddMeal = (newMeal) => {
    setMealPresets(prev => [...prev, newMeal]);
    setSelectedMeal(newMeal);
    setFilterType(newMeal.type); // switch filter to show the new meal
  };

  const handleRemoveMeal = (mealId, e) => {
    e.stopPropagation();
    const remaining = mealPresets.filter(m => m.id !== mealId);
    setMealPresets(remaining);
    if (selectedMeal.id === mealId) {
      setSelectedMeal(remaining[0] || DEFAULT_MEAL_PRESETS[3]);
    }
  };

  const handleLog = async () => {
    try {
      setLoading(true);
      await onLogActivity({
        type: selectedMeal.type,
        quantity: servings,
        date: new Date().toISOString().split('T')[0],
        notes: `Meal: ${selectedMeal.name}`,
      });
    } catch (err) {
      alert(err.message || 'Failed to log meal');
    } finally {
      setLoading(false);
    }
  };

  const vegCount    = mealPresets.filter(m => m.type === 'veg meal').length;
  const nonVegCount = mealPresets.filter(m => m.type === 'non-veg meal').length;
  const customCount = mealPresets.filter(m => m.isCustom).length;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 space-y-5">

      {/* Title */}
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

      {/* Filter tabs + Add button */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2">
          {[
            { key: 'all',          label: `All (${mealPresets.length})` },
            { key: 'veg meal',     label: `🥦 Veg (${vegCount})` },
            { key: 'non-veg meal', label: `🍗 Non-veg (${nonVegCount})` },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilterType(f.key)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                filterType === f.key
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                  : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddPanel(v => !v)}
          className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
            showAddPanel
              ? 'bg-slate-700 border-slate-600 text-white'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
          }`}
        >
          {showAddPanel ? <ChevronUp className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showAddPanel ? 'Close' : '+ Add Meal'}
        </button>
      </div>

      {/* Inline Add Panel */}
      {showAddPanel && (
        <AddMealPanel
          onAdd={handleAddMeal}
          onClose={() => setShowAddPanel(false)}
        />
      )}

      {/* Meal Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {visibleMeals.map((meal) => {
          const isSelected = selectedMeal.id === meal.id;
          const isVeg = meal.type === 'veg meal';
          return (
            <button
              type="button"
              key={meal.id}
              onClick={() => setSelectedMeal(meal)}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden cursor-pointer group ${
                isSelected
                  ? isVeg
                    ? 'bg-emerald-950/50 border-emerald-500/50 ring-1 ring-emerald-500/40 text-white shadow-lg'
                    : 'bg-rose-950/40 border-rose-500/50 ring-1 ring-rose-500/40 text-white shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="text-2xl mb-1.5">{meal.icon}</div>
              <h4 className="text-xs font-bold text-white mb-0.5 truncate">{meal.name}</h4>
              <p className="text-[10px] text-slate-400 font-mono">~{meal.co2PerServing} kg CO₂</p>
              <p className={`text-[9px] font-bold mt-0.5 ${TAG_COLOR[meal.tag] || 'text-slate-400'}`}>{meal.tag}</p>
              {meal.isCustom && (
                <span className="text-[9px] font-bold text-teal-400 block">Custom</span>
              )}
              {/* Remove button (custom meals only) */}
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

        {visibleMeals.length === 0 && (
          <div className="col-span-5 text-center py-8 text-slate-500 text-sm">
            No meals in this category yet. Click <strong className="text-emerald-400">+ Add Meal</strong> to add one!
          </div>
        )}
      </div>

      {customCount > 0 && (
        <p className="text-[10px] text-slate-600 text-right">
          {customCount} custom meal{customCount > 1 ? 's' : ''} added · Hover card to remove
        </p>
      )}

      {/* Calculator Bar */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Servings
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={servings}
              onChange={(e) => setServings(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Total Footprint
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-emerald-400 font-mono">{totalCO2}</span>
              <span className="text-xs font-bold text-slate-400">kg CO₂</span>
            </div>
          </div>

          <div className="hidden sm:block border-l border-slate-700 pl-4">
            <span className="block text-[10px] text-slate-500 mb-0.5">Selected</span>
            <span className="text-sm font-bold text-white">{selectedMeal.icon} {selectedMeal.name}</span>
            <span className={`block text-[10px] font-bold ${TAG_COLOR[selectedMeal.tag] || 'text-slate-400'}`}>{selectedMeal.tag}</span>
          </div>
        </div>

        <button
          onClick={handleLog}
          disabled={loading}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{loading ? 'Logging…' : `Log ${selectedMeal.name}`}</span>
        </button>
      </div>
    </div>
  );
}
