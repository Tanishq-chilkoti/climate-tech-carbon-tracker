import React, { useState } from 'react';
import { 
  PlusCircle, 
  Car, 
  Bus, 
  Plane, 
  Zap, 
  Utensils, 
  Flame, 
  Sparkles,
  Calendar,
  FileText,
  AlertCircle,
  Plus,
  X,
  Pencil,
  Leaf
} from 'lucide-react';
import AbsurdInputModal from './AbsurdInputModal';

const DEFAULT_ACTIVITY_TYPES = [
  { id: 'car', label: 'Car Travel', factor: 0.20, unit: 'km', icon: Car, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', maxThreshold: 1000, isCustom: false },
  { id: 'bus', label: 'Bus Travel', factor: 0.08, unit: 'km', icon: Bus, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', maxThreshold: 1000, isCustom: false },
  { id: 'flight', label: 'Flight', factor: 0.25, unit: 'km', icon: Plane, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', maxThreshold: 10000, isCustom: false },
  { id: 'electricity', label: 'Electricity', factor: 0.80, unit: 'kWh', icon: Zap, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', maxThreshold: 500, isCustom: false },
  { id: 'veg meal', label: 'Veg Meal', factor: 0.50, unit: 'servings', icon: Utensils, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', maxThreshold: 20, isCustom: false },
  { id: 'non-veg meal', label: 'Non-veg Meal', factor: 2.00, unit: 'servings', icon: Flame, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', maxThreshold: 20, isCustom: false }
];

const CUSTOM_COLORS = [
  'text-teal-400 bg-teal-500/10 border-teal-500/30',
  'text-violet-400 bg-violet-500/10 border-violet-500/30',
  'text-orange-400 bg-orange-500/10 border-orange-500/30',
  'text-pink-400 bg-pink-500/10 border-pink-500/30',
  'text-sky-400 bg-sky-500/10 border-sky-500/30',
  'text-lime-400 bg-lime-500/10 border-lime-500/30',
];

function AddActivityTypeModal({ onAdd, onClose, existingCount }) {
  const [name, setName] = useState('');
  const [factor, setFactor] = useState('');
  const [unit, setUnit] = useState('units');
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!name.trim()) { setError('Please enter an activity name.'); return; }
    if (!factor || parseFloat(factor) <= 0) { setError('Please enter a valid CO₂ factor > 0.'); return; }
    if (!unit.trim()) { setError('Please enter a unit.'); return; }

    const colorIndex = existingCount % CUSTOM_COLORS.length;
    const newType = {
      id: `custom_${Date.now()}`,
      label: name.trim(),
      factor: parseFloat(parseFloat(factor).toFixed(4)),
      unit: unit.trim(),
      icon: Leaf,
      color: CUSTOM_COLORS[colorIndex],
      maxThreshold: 9999,
      isCustom: true
    };
    onAdd(newType);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-teal-500/30 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-teal-400" />
            Add Custom Activity Type
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
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Activity Name</label>
            <input
              type="text"
              placeholder="e.g. Motorcycle, Solar Panel..."
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">CO₂ Factor (kg per unit)</label>
              <input
                type="number"
                step="any"
                min="0.0001"
                placeholder="e.g. 0.12"
                value={factor}
                onChange={e => setFactor(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Unit Label</label>
              <input
                type="text"
                placeholder="e.g. km, kWh, trips"
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ActivityForm({ onLogActivity }) {
  const [activityTypes, setActivityTypes] = useState(DEFAULT_ACTIVITY_TYPES);
  const [selectedType, setSelectedType] = useState('car');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // DP2 Absurd Input Modal State
  const [pendingAbsurdLog, setPendingAbsurdLog] = useState(null);

  const activeConfig = activityTypes.find(a => a.id === selectedType) || activityTypes[0];
  const qtyVal = parseFloat(quantity) || 0;
  const calculatedCO2 = parseFloat((qtyVal * activeConfig.factor).toFixed(2));

  const handleAddCustomType = (newType) => {
    setActivityTypes(prev => [...prev, newType]);
    setSelectedType(newType.id);
  };

  const handleRemoveCustomType = (typeId, e) => {
    e.stopPropagation();
    setActivityTypes(prev => prev.filter(t => t.id !== typeId));
    if (selectedType === typeId) {
      setSelectedType('car');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!quantity || qtyVal <= 0) {
      setError('Please enter a valid positive quantity.');
      return;
    }

    // Check DP2 Absurd Input Threshold
    if (qtyVal > activeConfig.maxThreshold) {
      setPendingAbsurdLog({
        type: activeConfig.isCustom ? activeConfig.label : selectedType,
        quantity: qtyVal,
        co2_kg: calculatedCO2,
        date,
        notes,
        unit: activeConfig.unit,
        threshold: activeConfig.maxThreshold
      });
      return;
    }

    // Normal logging
    executeLog({ 
      type: activeConfig.isCustom ? activeConfig.label : selectedType, 
      quantity: qtyVal, 
      date, 
      notes 
    });
  };

  const executeLog = async (data) => {
    try {
      setLoading(true);
      await onLogActivity(data);
      // Reset form
      setQuantity('');
      setNotes('');
      setPendingAbsurdLog(null);
    } catch (err) {
      setError(err.message || 'Failed to log activity');
    } finally {
      setLoading(false);
    }
  };

  const customCount = activityTypes.filter(t => t.isCustom).length;

  return (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
      
      {/* Title Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            Log Carbon Activity
          </h2>
          <p className="text-xs text-slate-400">Record transport, energy, or dietary choices</p>
        </div>
        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          Feature 1 &amp; 2
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Activity Type Selector Grid */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Select Activity Type
            </label>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 text-[10px] font-bold text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 px-2 py-1 rounded-lg transition-all"
            >
              <Plus className="w-3 h-3" />
              Add Custom
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {activityTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => {
                    setSelectedType(type.id);
                    setError('');
                  }}
                  className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left relative overflow-hidden ${
                    isSelected
                      ? `${type.color} ring-2 ring-emerald-500/40 shadow-lg`
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <Icon className="w-4 h-4" />
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono opacity-80">{type.factor} kg/{type.unit}</span>
                      {type.isCustom && (
                        <button
                          type="button"
                          onClick={(e) => handleRemoveCustomType(type.id, e)}
                          className="w-4 h-4 flex items-center justify-center rounded text-rose-400 hover:bg-rose-500/20 transition-all opacity-0 group-hover:opacity-100 ml-0.5"
                          title="Remove custom type"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-white capitalize">{type.label}</span>
                  {type.isCustom && (
                    <span className="text-[9px] font-bold text-teal-400 mt-0.5">Custom</span>
                  )}
                  {type.isCustom && isSelected && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveCustomType(type.id, e)}
                      className="absolute top-1.5 right-1.5 w-5 h-5 flex items-center justify-center rounded-md bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:bg-rose-500/40 transition-all"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </button>
              );
            })}
          </div>
          {customCount > 0 && (
            <p className="text-[10px] text-slate-500 mt-1.5 text-right">{customCount} custom type{customCount > 1 ? 's' : ''} added · Click X on a selected card to remove</p>
          )}
        </div>

        {/* Input Fields Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Quantity Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Quantity ({activeConfig.unit})
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                min="0.1"
                placeholder={`e.g. 15 ${activeConfig.unit}`}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                {activeConfig.unit}
              </span>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Activity Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

        </div>

        {/* Notes Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Notes / Description <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g., Office trip, Home AC usage, Dinner"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Real-Time CO2 Calculation Preview */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-300 font-medium">Calculated CO₂ Output:</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-extrabold text-emerald-400">{calculatedCO2.toFixed(2)}</span>
            <span className="text-xs font-bold text-slate-400">kg CO₂</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <span>Logging activity...</span>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              <span>Log Activity Entry</span>
            </>
          )}
        </button>

      </form>

      {/* DP2 Absurd Input Modal Popup */}
      {pendingAbsurdLog && (
        <AbsurdInputModal
          isOpen={!!pendingAbsurdLog}
          activity={pendingAbsurdLog}
          threshold={pendingAbsurdLog.threshold}
          onConfirm={() => executeLog(pendingAbsurdLog)}
          onCancel={() => setPendingAbsurdLog(null)}
        />
      )}

      {/* Add Custom Activity Type Modal */}
      {showAddModal && (
        <AddActivityTypeModal
          onAdd={handleAddCustomType}
          onClose={() => setShowAddModal(false)}
          existingCount={customCount}
        />
      )}

    </div>
  );
}
