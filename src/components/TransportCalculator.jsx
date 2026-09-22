import React, { useState } from 'react';
import { Compass, Car, Bus, Plane, PlusCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function TransportCalculator({ onLogActivity }) {
  const [distanceKm, setDistanceKm] = useState(25);
  const [selectedMode, setSelectedMode] = useState('car');
  const [loading, setLoading] = useState(false);

  const carCO2 = parseFloat((distanceKm * 0.20).toFixed(2));
  const busCO2 = parseFloat((distanceKm * 0.08).toFixed(2));
  const flightCO2 = parseFloat((distanceKm * 0.25).toFixed(2));

  const busSavings = parseFloat((carCO2 - busCO2).toFixed(2));

  const modeDetails = {
    car: { co2: carCO2, label: 'Car Travel', type: 'car' },
    bus: { co2: busCO2, label: 'Bus Travel', type: 'bus' },
    flight: { co2: flightCO2, label: 'Flight', type: 'flight' }
  };

  const currentSelection = modeDetails[selectedMode];

  const handleLog = async () => {
    try {
      setLoading(true);
      await onLogActivity({
        type: currentSelection.type,
        quantity: distanceKm,
        date: new Date().toISOString().split('T')[0],
        notes: `Trip: ${currentSelection.label} (${distanceKm} km)`
      });
    } catch (err) {
      alert(err.message || 'Failed to log trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-blue-500/20 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-400" />
            Trip & Transport Route Comparison Tool
          </h2>
          <p className="text-xs text-slate-400">Compare emissions across transport modes & log trip directly</p>
        </div>
        <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
          Route Calculator
        </span>
      </div>

      {/* Distance Input */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Trip Distance (km)
          </label>
          <span className="text-sm font-black text-blue-400 font-mono">{distanceKm} km</span>
        </div>
        <input
          type="range"
          min="1"
          max="500"
          step="1"
          value={distanceKm}
          onChange={(e) => setDistanceKm(parseInt(e.target.value) || 1)}
          className="w-full accent-blue-500 cursor-pointer"
        />
      </div>

      {/* Side by Side Mode Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Car */}
        <div 
          onClick={() => setSelectedMode('car')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            selectedMode === 'car' ? 'bg-blue-950/40 border-blue-500/50 ring-1 ring-blue-500/30' : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Car className="w-5 h-5 text-blue-400" />
            <span className="text-[10px] font-mono text-slate-400">0.20 kg/km</span>
          </div>
          <h4 className="text-xs font-bold text-white mb-1">Solo Driving</h4>
          <p className="text-xl font-black text-blue-400 font-mono">{carCO2} kg CO₂</p>
        </div>

        {/* Bus */}
        <div 
          onClick={() => setSelectedMode('bus')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            selectedMode === 'bus' ? 'bg-cyan-950/40 border-cyan-500/50 ring-1 ring-cyan-500/30' : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Bus className="w-5 h-5 text-cyan-400" />
            <span className="text-[10px] font-mono text-slate-400">0.08 kg/km</span>
          </div>
          <h4 className="text-xs font-bold text-white mb-1">Transit Bus</h4>
          <p className="text-xl font-black text-cyan-400 font-mono">{busCO2} kg CO₂</p>
          <p className="text-[10px] text-emerald-400 font-semibold mt-1">Save {busSavings} kg vs Car!</p>
        </div>

        {/* Flight */}
        <div 
          onClick={() => setSelectedMode('flight')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            selectedMode === 'flight' ? 'bg-purple-950/40 border-purple-500/50 ring-1 ring-purple-500/30' : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Plane className="w-5 h-5 text-purple-400" />
            <span className="text-[10px] font-mono text-slate-400">0.25 kg/km</span>
          </div>
          <h4 className="text-xs font-bold text-white mb-1">Flight</h4>
          <p className="text-xl font-black text-purple-400 font-mono">{flightCO2} kg CO₂</p>
        </div>

      </div>

      {/* Log Selection Button */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={handleLog}
          disabled={loading}
          className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{loading ? 'Logging Trip...' : `Log ${currentSelection.label} (${currentSelection.co2} kg CO₂)`}</span>
        </button>
      </div>

    </div>
  );
}
