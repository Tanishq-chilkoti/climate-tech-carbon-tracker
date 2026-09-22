import React, { useState } from 'react';
import { Compass, Car, Bus, Plane, PlusCircle } from 'lucide-react';

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
    <div className="card" style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <p className="section-label" style={{ margin: 0 }}>Route Comparison</p>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--dark)', margin: '4px 0 0' }}>Transport Emissions Calculator</h3>
        </div>
        <span className="chip-green" style={{ fontSize: 11 }}>
          0.08 - 0.25 kg/km
        </span>
      </div>

      {/* Slider */}
      <div style={{ padding: 20, borderRadius: 12, background: 'var(--cream-dark)', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <label className="field-label" style={{ margin: 0 }}>Distance (km)</label>
          <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--dark)' }}>{distanceKm} km</span>
        </div>
        <input
          type="range"
          min="1"
          max="500"
          step="1"
          value={distanceKm}
          onChange={(e) => setDistanceKm(parseInt(e.target.value) || 1)}
          style={{ width: '100%' }}
        />
      </div>

      {/* Mode comparison grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        
        <div
          onClick={() => setSelectedMode('car')}
          className={`card ${selectedMode === 'car' ? 'card-dark' : ''}`}
          style={{ cursor: 'pointer', padding: 20 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Car size={20} color={selectedMode === 'car' ? '#FFF' : 'var(--dark)'} />
            <span style={{ fontSize: 10, opacity: 0.7 }}>0.20 kg/km</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Solo Drive</div>
          <div style={{ fontSize: 24, fontWeight: 900 }}>{carCO2} <span style={{ fontSize: 12, fontWeight: 500 }}>kg</span></div>
        </div>

        <div
          onClick={() => setSelectedMode('bus')}
          className={`card ${selectedMode === 'bus' ? 'card-dark' : ''}`}
          style={{ cursor: 'pointer', padding: 20 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Bus size={20} color={selectedMode === 'bus' ? '#FFF' : 'var(--green)'} />
            <span style={{ fontSize: 10, opacity: 0.7 }}>0.08 kg/km</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Transit Bus</div>
          <div style={{ fontSize: 24, fontWeight: 900 }}>{busCO2} <span style={{ fontSize: 12, fontWeight: 500 }}>kg</span></div>
          <div style={{ fontSize: 11, color: selectedMode === 'bus' ? '#A7F3D0' : 'var(--green)', fontWeight: 700, marginTop: 4 }}>
            Save {busSavings} kg vs Car!
          </div>
        </div>

        <div
          onClick={() => setSelectedMode('flight')}
          className={`card ${selectedMode === 'flight' ? 'card-dark' : ''}`}
          style={{ cursor: 'pointer', padding: 20 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Plane size={20} color={selectedMode === 'flight' ? '#FFF' : 'var(--dark)'} />
            <span style={{ fontSize: 10, opacity: 0.7 }}>0.25 kg/km</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Flight</div>
          <div style={{ fontSize: 24, fontWeight: 900 }}>{flightCO2} <span style={{ fontSize: 12, fontWeight: 500 }}>kg</span></div>
        </div>

      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleLog} disabled={loading} className="btn-dark">
          {loading ? 'Logging Trip...' : `Log ${currentSelection.label} (${currentSelection.co2} kg CO₂)`}
        </button>
      </div>
    </div>
  );
}
