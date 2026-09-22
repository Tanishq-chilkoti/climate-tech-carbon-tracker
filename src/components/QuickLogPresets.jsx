import React, { useState } from 'react';
import { Car, Bus, Utensils, Flame, Zap, Plane, Sparkles, Plus, X, AlertCircle, Leaf } from 'lucide-react';

const DEFAULT_PRESETS = [
  { label: '10km Office Drive', type: 'car', quantity: 10, notes: 'Daily commute', icon: Car, color: 'hover:border-blue-500/50 hover:bg-blue-500/10 text-blue-400' },
  { label: '5km Bus Trip', type: 'bus', quantity: 5, notes: 'Transit trip', icon: Bus, color: 'hover:border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-400' },
  { label: 'Veg Lunch Meal', type: 'veg meal', quantity: 1, notes: 'Plant-based lunch', icon: Utensils, color: 'hover:border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-400' },
  { label: 'Non-veg Dinner', type: 'non-veg meal', quantity: 1, notes: 'Meat dinner', icon: Flame, color: 'hover:border-rose-500/50 hover:bg-rose-500/10 text-rose-400' },
  { label: '5 kWh Electricity', type: 'electricity', quantity: 5, notes: 'Daily appliance power', icon: Zap, color: 'hover:border-amber-500/50 hover:bg-amber-500/10 text-amber-400' },
  { label: '150km Flight', type: 'flight', quantity: 150, notes: 'Short regional flight', icon: Plane, color: 'hover:border-purple-500/50 hover:bg-purple-500/10 text-purple-400' }
];

const ACTIVITY_TYPE_OPTIONS = [
  { value: 'car', label: '🚗 Car Travel' },
  { value: 'bus', label: '🚌 Bus Travel' },
  { value: 'flight', label: '✈️ Flight' },
  { value: 'electricity', label: '⚡ Electricity' },
  { value: 'veg meal', label: '🥗 Veg Meal' },
  { value: 'non-veg meal', label: '🍗 Non-veg Meal' },
];

const PRESET_COLORS = [
  'hover:border-teal-500/50 hover:bg-teal-500/10 text-teal-400',
  'hover:border-violet-500/50 hover:bg-violet-500/10 text-violet-400',
  'hover:border-pink-500/50 hover:bg-pink-500/10 text-pink-400',
  'hover:border-sky-500/50 hover:bg-sky-500/10 text-sky-400',
  'hover:border-lime-500/50 hover:bg-lime-500/10 text-lime-400',
  'hover:border-orange-500/50 hover:bg-orange-500/10 text-orange-400',
];

function AddPresetModal({ onAdd, onClose, existingCustomCount }) {
  const [label, setLabel] = useState('');
  const [type, setType] = useState('car');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!label.trim()) { setError('Please enter a shortcut label.'); return; }
    if (!quantity || parseFloat(quantity) <= 0) { setError('Please enter a valid quantity > 0.'); return; }

    const colorIndex = existingCustomCount % PRESET_COLORS.length;
    const newPreset = {
      id: `custom_${Date.now()}`,
      label: label.trim(),
      type,
      quantity: parseFloat(quantity),
      notes: notes.trim() || label.trim(),
      icon: Leaf,
      color: PRESET_COLORS[colorIndex],
      isCustom: true
    };
    onAdd(newPreset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-teal-500/30 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            Add Quick-Log Shortcut
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
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Shortcut Label</label>
            <input
              type="text"
              placeholder="e.g. Morning Bike Ride, Office Lunch..."
              value={label}
              onChange={e => setLabel(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Activity Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition-all"
              >
                {ACTIVITY_TYPE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Quantity</label>
              <input
                type="number"
                step="any"
                min="0.01"
                placeholder="e.g. 10"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Notes <span className="text-slate-500 font-normal">(Optional)</span></label>
            <input
              type="text"
              placeholder="Short description for log entry..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-all">
              Cancel
            </button>
            <button onClick={handleAdd} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Add Shortcut
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuickLogPresets({ onQuickLog }) {
  const [presets, setPresets] = useState(DEFAULT_PRESETS);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddPreset = (newPreset) => {
    setPresets(prev => [...prev, newPreset]);
  };

  const handleRemovePreset = (presetId, e) => {
    e.stopPropagation();
    setPresets(prev => prev.filter(p => p.id !== presetId));
  };

  const customCount = presets.filter(p => p.isCustom).length;

  return (
    <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
            ⚡ Quick-Log Shortcuts <span className="text-slate-400 font-normal">(1-Click Entry)</span>
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono border border-emerald-500/20">
            Instant Log
          </span>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 text-[10px] font-bold text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 px-2 py-1 rounded-lg transition-all"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {presets.map((preset, idx) => {
          const Icon = preset.icon;
          return (
            <button
              key={preset.id || idx}
              onClick={() => onQuickLog(preset)}
              className={`flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 transition-all text-left group cursor-pointer relative ${preset.color}`}
            >
              <div className="w-7 h-7 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="truncate flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{preset.label}</p>
                <p className="text-[10px] text-slate-400 font-mono capitalize">{preset.type}</p>
              </div>
              {preset.isCustom && (
                <button
                  type="button"
                  onClick={(e) => handleRemovePreset(preset.id, e)}
                  className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/40 transition-all opacity-0 group-hover:opacity-100"
                  title="Remove shortcut"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              )}
            </button>
          );
        })}
      </div>

      {customCount > 0 && (
        <p className="text-[10px] text-slate-500 mt-2 text-right">{customCount} custom shortcut{customCount > 1 ? 's' : ''} · Hover to remove</p>
      )}

      {showAddModal && (
        <AddPresetModal
          onAdd={handleAddPreset}
          onClose={() => setShowAddModal(false)}
          existingCustomCount={customCount}
        />
      )}
    </div>
  );
}
