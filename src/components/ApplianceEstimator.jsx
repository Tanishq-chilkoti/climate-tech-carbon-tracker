import React, { useState } from 'react';
import { Zap, PlusCircle, Plus, X, AlertCircle } from 'lucide-react';

const DEFAULT_APPLIANCES = [
  { id: 'ac', name: 'Air Conditioner', kwhPerHour: 1.5, icon: '❄️', isCustom: false },
  { id: 'pc', name: 'Desktop Gaming PC', kwhPerHour: 0.4, icon: '🖥️', isCustom: false },
  { id: 'ev', name: 'EV Home Charging', kwhPerHour: 7.0, icon: '🔌', isCustom: false },
  { id: 'washer', name: 'Washing Machine Cycle', kwhPerHour: 1.0, icon: '🧺', isCustom: false },
  { id: 'fridge', name: 'Refrigerator (24h)', kwhPerHour: 0.1, icon: '🧊', isCustom: false }
];

const APPLIANCE_EMOJIS = ['💡','🌡️','📺','🎮','🔥','🚿','🫙','🧹','🏠','⚡','🔋','🌀'];

function AddApplianceModal({ onAdd, onClose }) {
  const [name, setName] = useState('');
  const [kwh, setKwh] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(APPLIANCE_EMOJIS[0]);
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!name.trim()) { setError('Please enter an appliance name.'); return; }
    if (!kwh || parseFloat(kwh) <= 0) { setError('Please enter a valid kWh/hour value > 0.'); return; }

    const newAppliance = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      kwhPerHour: parseFloat(parseFloat(kwh).toFixed(3)),
      icon: selectedEmoji,
      isCustom: true
    };
    onAdd(newAppliance);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-amber-500/30 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" />
            Add Custom Appliance
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
              {APPLIANCE_EMOJIS.map(em => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setSelectedEmoji(em)}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center border transition-all ${selectedEmoji === em ? 'border-amber-500 bg-amber-500/20' : 'border-slate-700 bg-slate-900/60 hover:border-slate-600'}`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Appliance Name</label>
            <input
              type="text"
              placeholder="e.g. Microwave, Hair Dryer, Heater..."
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Power Consumption (kWh per hour)</label>
            <input
              type="number"
              step="any"
              min="0.001"
              placeholder="e.g. 0.8 for microwave"
              value={kwh}
              onChange={e => setKwh(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            />
            <p className="text-[10px] text-slate-500 mt-1">Tip: check your device's label for wattage. Watts ÷ 1000 = kWh/hr</p>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-all">
              Cancel
            </button>
            <button onClick={handleAdd} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Add Appliance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ApplianceEstimator({ onLogActivity }) {
  const [appliances, setAppliances] = useState(DEFAULT_APPLIANCES);
  const [selectedAppliance, setSelectedAppliance] = useState(DEFAULT_APPLIANCES[0]);
  const [hours, setHours] = useState(4);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const totalKWh = parseFloat((selectedAppliance.kwhPerHour * hours).toFixed(2));
  const totalCO2 = parseFloat((totalKWh * 0.80).toFixed(2)); // 0.80 kg CO2 per kWh

  const handleAddAppliance = (newAppliance) => {
    setAppliances(prev => [...prev, newAppliance]);
    setSelectedAppliance(newAppliance);
  };

  const handleRemoveAppliance = (appId, e) => {
    e.stopPropagation();
    setAppliances(prev => prev.filter(a => a.id !== appId));
    if (selectedAppliance.id === appId) {
      setSelectedAppliance(DEFAULT_APPLIANCES[0]);
    }
  };

  const handleLog = async () => {
    try {
      setLoading(true);
      await onLogActivity({
        type: 'electricity',
        quantity: totalKWh,
        date: new Date().toISOString().split('T')[0],
        notes: `Appliance: ${selectedAppliance.name} (${hours} hrs)`
      });
    } catch (err) {
      alert(err.message || 'Failed to log electricity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Household Appliance Electricity Estimator
          </h2>
          <p className="text-xs text-slate-400">Calculate appliance power usage in kWh &amp; log carbon output</p>
        </div>
        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          Power Estimator
        </span>
      </div>

      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{appliances.length} appliances · {appliances.filter(a => a.isCustom).length} custom</p>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1.5 rounded-lg transition-all"
        >
          <Plus className="w-3 h-3" />
          Add Custom Appliance
        </button>
      </div>

      {/* Appliance Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {appliances.map((app) => {
          const isSelected = selectedAppliance.id === app.id;
          return (
            <button
              type="button"
              key={app.id}
              onClick={() => setSelectedAppliance(app)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative group ${
                isSelected
                  ? 'bg-amber-950/40 border-amber-500/50 ring-1 ring-amber-500/30 text-white shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="text-xl mb-1">{app.icon}</div>
              <h4 className="text-xs font-bold text-white truncate">{app.name}</h4>
              <p className="text-[10px] text-slate-400 font-mono">{app.kwhPerHour} kWh / hr</p>
              {app.isCustom && (
                <span className="text-[9px] font-bold text-teal-400 block mt-0.5">Custom</span>
              )}
              {app.isCustom && (
                <button
                  type="button"
                  onClick={(e) => handleRemoveAppliance(app.id, e)}
                  className="absolute top-1.5 right-1.5 w-5 h-5 flex items-center justify-center rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-all opacity-0 group-hover:opacity-100"
                  title="Remove appliance"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </button>
          );
        })}
      </div>

      {/* Hours & Output Bar */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6 w-full sm:w-auto">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Hours Used
            </label>
            <input
              type="number"
              min="1"
              max="24"
              value={hours}
              onChange={(e) => setHours(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Estimated Energy &amp; CO₂
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-400 font-mono">{totalKWh} <span className="text-xs font-normal text-slate-400">kWh</span></span>
              <span className="text-xs text-slate-500">→</span>
              <span className="text-xl font-bold text-rose-400 font-mono">+{totalCO2} kg CO₂</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLog}
          disabled={loading}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{loading ? 'Logging Power...' : `Log ${totalKWh} kWh Electricity`}</span>
        </button>
      </div>

      {showAddModal && (
        <AddApplianceModal onAdd={handleAddAppliance} onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
