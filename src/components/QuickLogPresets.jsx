import React, { useState } from 'react';
import { Car, Bus, Utensils, Flame, Zap, Plane, Plus, X, ArrowUpRight } from 'lucide-react';

const DEFAULT_PRESETS = [
  { id: 'p1', label: 'Office drive', type: 'car', quantity: 10, subtext: '10 km', notes: 'Daily commute', icon: Car },
  { id: 'p2', label: 'Bus trip', type: 'bus', quantity: 5, subtext: '5 km', notes: 'Transit trip', icon: Bus },
  { id: 'p3', label: 'Veg lunch', type: 'veg meal', quantity: 1, subtext: '1 meal', notes: 'Plant-based lunch', icon: Utensils },
  { id: 'p4', label: 'Home energy', type: 'electricity', quantity: 5, subtext: '5 kWh', notes: 'Daily power', icon: Zap },
  { id: 'p5', label: 'Non-veg dinner', type: 'non-veg meal', quantity: 1, subtext: '1 meal', notes: 'Dinner', icon: Flame },
  { id: 'p6', label: 'Flight', type: 'flight', quantity: 150, subtext: '150 km', notes: 'Short flight', icon: Plane }
];

function AddPresetModal({ onAdd, onClose }) {
  const [label, setLabel] = useState('');
  const [type, setType] = useState('car');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!label.trim()) { setError('Please enter a label.'); return; }
    if (!quantity || parseFloat(quantity) <= 0) { setError('Please enter a valid quantity > 0.'); return; }

    const newPreset = {
      id: `custom_${Date.now()}`,
      label: label.trim(),
      type,
      quantity: parseFloat(quantity),
      subtext: `${quantity} units`,
      notes: notes.trim() || label.trim(),
      icon: Car,
      isCustom: true
    };
    onAdd(newPreset);
    onClose();
  };

  return (
    <div className="modal-bg">
      <div className="modal-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--dark)' }}>Add Quick Shortcut</h3>
          <button onClick={onClose} className="btn-ghost" style={{ padding: 4 }}><X size={18} /></button>
        </div>

        {error && (
          <div style={{ padding: 10, borderRadius: 8, background: '#FEE2E2', color: '#DC2626', fontSize: 12, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="field-label">Shortcut Label</label>
            <input
              type="text"
              placeholder="e.g. Daily Ride"
              value={label}
              onChange={e => setLabel(e.target.value)}
              className="field-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="field-label">Category</label>
              <select value={type} onChange={e => setType(e.target.value)} className="field-input">
                <option value="car">Car Travel</option>
                <option value="bus">Bus Travel</option>
                <option value="flight">Flight</option>
                <option value="electricity">Electricity</option>
                <option value="veg meal">Veg Meal</option>
                <option value="non-veg meal">Non-veg Meal</option>
              </select>
            </div>
            <div>
              <label className="field-label">Quantity</label>
              <input
                type="number"
                step="any"
                placeholder="e.g. 10"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="field-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button onClick={onClose} className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
            <button onClick={handleAdd} className="btn-dark" style={{ flex: 1, justifyContent: 'center' }}>Add Shortcut</button>
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

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {presets.map((preset) => {
          const Icon = preset.icon || Car;
          return (
            <div
              key={preset.id}
              onClick={() => onQuickLog(preset)}
              className="quick-pill"
              style={{ justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 50, background: 'var(--cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={14} color="var(--green)" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dark)' }}>{preset.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{preset.subtext}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {preset.isCustom && (
                  <button
                    onClick={(e) => handleRemovePreset(preset.id, e)}
                    className="btn-ghost"
                    style={{ fontSize: 10, padding: 2, color: '#DC2626' }}
                  >
                    ✕
                  </button>
                )}
                <span style={{ fontSize: 16, color: 'var(--green)', fontWeight: 700 }}>+</span>
              </div>
            </div>
          );
        })}

        <button
          onClick={() => setShowAddModal(true)}
          className="quick-pill"
          style={{ justifyContent: 'center', background: 'transparent', borderStyle: 'dashed' }}
        >
          <Plus size={14} color="var(--green)" />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)' }}>Add Shortcut</span>
        </button>
      </div>

      {showAddModal && (
        <AddPresetModal onAdd={handleAddPreset} onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
