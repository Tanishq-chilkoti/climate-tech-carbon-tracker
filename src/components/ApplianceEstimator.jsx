import React, { useState } from 'react';
import { Zap, PlusCircle, Sparkles, Tv, Laptop, Refrigerator, ShieldAlert } from 'lucide-react';

const APPLIANCES = [
  { id: 'ac', name: 'Air Conditioner', kwhPerHour: 1.5, icon: '❄️' },
  { id: 'pc', name: 'Desktop Gaming PC', kwhPerHour: 0.4, icon: '🖥️' },
  { id: 'ev', name: 'EV Home Charging', kwhPerHour: 7.0, icon: '🔌' },
  { id: 'washer', name: 'Washing Machine Cycle', kwhPerHour: 1.0, icon: '🧺' },
  { id: 'fridge', name: 'Refrigerator (24h)', kwhPerHour: 0.1, icon: '🧊' }
];

export default function ApplianceEstimator({ onLogActivity }) {
  const [selectedAppliance, setSelectedAppliance] = useState(APPLIANCES[0]);
  const [hours, setHours] = useState(4);
  const [loading, setLoading] = useState(false);

  const totalKWh = parseFloat((selectedAppliance.kwhPerHour * hours).toFixed(2));
  const totalCO2 = parseFloat((totalKWh * 0.80).toFixed(2)); // 0.80 kg CO2 per kWh

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
          <p className="text-xs text-slate-400">Calculate appliance power usage in kWh & log carbon output</p>
        </div>
        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          Power Estimator
        </span>
      </div>

      {/* Appliance Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {APPLIANCES.map((app) => {
          const isSelected = selectedAppliance.id === app.id;
          return (
            <button
              type="button"
              key={app.id}
              onClick={() => setSelectedAppliance(app)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-950/40 border-amber-500/50 ring-1 ring-amber-500/30 text-white shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="text-xl mb-1">{app.icon}</div>
              <h4 className="text-xs font-bold text-white truncate">{app.name}</h4>
              <p className="text-[10px] text-slate-400 font-mono">{app.kwhPerHour} kWh / hr</p>
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
              Estimated Energy & CO₂
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

    </div>
  );
}
