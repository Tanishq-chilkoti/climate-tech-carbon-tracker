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
  AlertCircle
} from 'lucide-react';
import AbsurdInputModal from './AbsurdInputModal';

const ACTIVITY_TYPES = [
  { id: 'car', label: 'Car Travel', factor: 0.20, unit: 'km', icon: Car, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', maxThreshold: 1000 },
  { id: 'bus', label: 'Bus Travel', factor: 0.08, unit: 'km', icon: Bus, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', maxThreshold: 1000 },
  { id: 'flight', label: 'Flight', factor: 0.25, unit: 'km', icon: Plane, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', maxThreshold: 10000 },
  { id: 'electricity', label: 'Electricity', factor: 0.80, unit: 'kWh', icon: Zap, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', maxThreshold: 500 },
  { id: 'veg meal', label: 'Veg Meal', factor: 0.50, unit: 'servings', icon: Utensils, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', maxThreshold: 20 },
  { id: 'non-veg meal', label: 'Non-veg Meal', factor: 2.00, unit: 'servings', icon: Flame, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', maxThreshold: 20 }
];

export default function ActivityForm({ onLogActivity }) {
  const [selectedType, setSelectedType] = useState('car');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // DP2 Absurd Input Modal State
  const [pendingAbsurdLog, setPendingAbsurdLog] = useState(null);

  const activeConfig = ACTIVITY_TYPES.find(a => a.id === selectedType);
  const qtyVal = parseFloat(quantity) || 0;
  const calculatedCO2 = parseFloat((qtyVal * activeConfig.factor).toFixed(2));

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
        type: selectedType,
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
    executeLog({ type: selectedType, quantity: qtyVal, date, notes });
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
          Feature 1 & 2
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
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
            Select Activity Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {ACTIVITY_TYPES.map((type) => {
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
                    <span className="text-[10px] font-mono opacity-80">{type.factor} kg/{type.unit}</span>
                  </div>
                  <span className="text-xs font-bold text-white capitalize">{type.label}</span>
                </button>
              );
            })}
          </div>
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

    </div>
  );
}
