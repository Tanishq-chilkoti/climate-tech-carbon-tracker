import React, { useState } from 'react';
import { Zap, Plus, X, AlertCircle } from 'lucide-react';

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
    <div className="modal-bg">
      <div className="modal-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--dark)' }}>Add Custom Appliance</h3>
          <button onClick={onClose} className="btn-ghost" style={{ padding: 4 }}><X size={18} /></button>
        </div>

        {error && (
          <div style={{ padding: 12, borderRadius: 8, background: '#FEE2E2', color: '#DC2626', fontSize: 12, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="field-label">Icon</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {APPLIANCE_EMOJIS.map(em => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setSelectedEmoji(em)}
                  style={{
                    width: 36, height: 36, borderRadius: 8, fontSize: 18, border: '1px solid var(--border)',
                    background: selectedEmoji === em ? 'var(--cream-dark)' : 'transparent', cursor: 'pointer'
                  }}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="field-label">Appliance Name</label>
            <input
              type="text"
              placeholder="e.g. Microwave, Water Heater"
              value={name}
              onChange={e => setName(e.target.value)}
              className="field-input"
            />
          </div>

          <div>
            <label className="field-label">kWh / Hour</label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 0.8"
              value={kwh}
              onChange={e => setKwh(e.target.value)}
              className="field-input"
            />
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button onClick={onClose} className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
            <button onClick={handleAdd} className="btn-dark" style={{ flex: 1, justifyContent: 'center' }}>Save Appliance</button>
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
  const totalCO2 = parseFloat((totalKWh * 0.80).toFixed(2));

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
    <div className="card" style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <p className="section-label" style={{ margin: 0 }}>Energy Usage</p>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--dark)', margin: '4px 0 0' }}>Appliance Power Estimator</h3>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-outline"
          style={{ fontSize: 11, padding: '6px 12px' }}
        >
          <Plus size={13} /> Add Custom Appliance
        </button>
      </div>

      {/* Appliance cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        {appliances.map(app => {
          const isSelected = selectedAppliance.id === app.id;
          return (
            <div
              key={app.id}
              onClick={() => setSelectedAppliance(app)}
              className={`appliance-card ${isSelected ? 'active' : ''}`}
            >
              <div style={{ fontSize: 28, marginBottom: 6 }}>{app.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>{app.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{app.kwhPerHour} kWh / hr</div>
              {app.isCustom && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <span className="chip-green" style={{ fontSize: 9 }}>Custom</span>
                  <button
                    onClick={(e) => handleRemoveAppliance(app.id, e)}
                    className="btn-ghost"
                    style={{ fontSize: 10, padding: '2px 4px', color: '#DC2626' }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action bottom bar */}
      <div style={{ padding: 20, borderRadius: 12, background: 'var(--cream-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div>
            <label className="field-label">Usage (Hours)</label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={hours}
              onChange={e => setHours(Math.max(0.1, parseFloat(e.target.value) || 1))}
              className="field-input"
              style={{ width: 80 }}
            />
          </div>
          <div>
            <span className="field-label">Total Consumption</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--dark)' }}>{totalKWh}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>kWh ({totalCO2} kg CO₂)</span>
            </div>
          </div>
        </div>

        <button onClick={handleLog} disabled={loading} className="btn-dark">
          {loading ? 'Logging...' : `Log ${totalKWh} kWh`}
        </button>
      </div>

      {showAddModal && (
        <AddApplianceModal
          onAdd={handleAddAppliance}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
