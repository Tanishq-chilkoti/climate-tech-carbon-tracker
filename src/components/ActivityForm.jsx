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
  Plus,
  X,
  AlertCircle,
  Leaf
} from 'lucide-react';
import AbsurdInputModal from './AbsurdInputModal';

const DEFAULT_ACTIVITY_TYPES = [
  { id: 'car', label: 'Car Travel', factor: 0.20, unit: 'km', icon: Car, maxThreshold: 1000, isCustom: false },
  { id: 'bus', label: 'Bus Travel', factor: 0.08, unit: 'km', icon: Bus, maxThreshold: 1000, isCustom: false },
  { id: 'flight', label: 'Flight', factor: 0.25, unit: 'km', icon: Plane, maxThreshold: 10000, isCustom: false },
  { id: 'electricity', label: 'Electricity', factor: 0.80, unit: 'kWh', icon: Zap, maxThreshold: 500, isCustom: false },
  { id: 'veg meal', label: 'Veg Meal', factor: 0.50, unit: 'servings', icon: Utensils, maxThreshold: 20, isCustom: false },
  { id: 'non-veg meal', label: 'Non-veg Meal', factor: 2.00, unit: 'servings', icon: Flame, maxThreshold: 20, isCustom: false }
];

function AddActivityTypeModal({ onAdd, onClose }) {
  const [name, setName] = useState('');
  const [factor, setFactor] = useState('');
  const [unit, setUnit] = useState('units');
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!name.trim()) { setError('Please enter an activity name.'); return; }
    if (!factor || parseFloat(factor) <= 0) { setError('Please enter a valid factor > 0.'); return; }
    if (!unit.trim()) { setError('Please enter a unit.'); return; }

    const newType = {
      id: `custom_${Date.now()}`,
      label: name.trim(),
      factor: parseFloat(parseFloat(factor).toFixed(4)),
      unit: unit.trim(),
      icon: Leaf,
      maxThreshold: 9999,
      isCustom: true
    };
    onAdd(newType);
    onClose();
  };

  return (
    <div className="modal-bg">
      <div className="modal-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--dark)' }}>Add Custom Activity Type</h3>
          <button onClick={onClose} className="btn-ghost" style={{ padding: 4 }}><X size={18} /></button>
        </div>

        {error && (
          <div style={{ padding: 12, borderRadius: 8, background: '#FEE2E2', color: '#DC2626', fontSize: 12, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="field-label">Activity Name</label>
            <input
              type="text"
              placeholder="e.g. Electric Scooter, Solar, Train"
              value={name}
              onChange={e => setName(e.target.value)}
              className="field-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="field-label">CO₂ Factor (kg per unit)</label>
              <input
                type="number"
                step="any"
                placeholder="e.g. 0.12"
                value={factor}
                onChange={e => setFactor(e.target.value)}
                className="field-input"
              />
            </div>
            <div>
              <label className="field-label">Unit Label</label>
              <input
                type="text"
                placeholder="e.g. km, kWh, meals"
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="field-input"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button onClick={onClose} className="btn-outline" style={{ flex: 1, justifyCenter: 'center' }}>Cancel</button>
            <button onClick={handleAdd} className="btn-green" style={{ flex: 1, justifyCenter: 'center' }}>Add Type</button>
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
    if (selectedType === typeId) setSelectedType('car');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!quantity || qtyVal <= 0) {
      setError('Please enter a valid positive quantity.');
      return;
    }

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
    <div className="card" style={{ padding: 32 }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <p className="section-label" style={{ margin: 0 }}>Entry Form</p>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--dark)', margin: '4px 0 0' }}>Log Carbon Activity</h3>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="btn-outline"
          style={{ fontSize: 11, padding: '6px 12px' }}
        >
          <Plus size={13} /> Add Custom
        </button>
      </div>

      {error && (
        <div style={{ padding: 12, borderRadius: 8, background: '#FEE2E2', color: '#DC2626', fontSize: 12, marginBottom: 20 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Type selector */}
        <div>
          <label className="field-label">Select Category</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
            {activityTypes.map(type => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => { setSelectedType(type.id); setError(''); }}
                  className={`type-pill ${isSelected ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Icon size={16} />
                    {type.isCustom && (
                      <span
                        onClick={(e) => handleRemoveCustomType(type.id, e)}
                        style={{ fontSize: 11, cursor: 'pointer', opacity: 0.7 }}
                      >
                        ✕
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{type.label}</div>
                  <div style={{ fontSize: 10, opacity: 0.6, marginTop: 2 }}>{type.factor} kg/{type.unit}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label className="field-label">Quantity ({activeConfig.unit})</label>
            <input
              type="number"
              step="any"
              min="0.1"
              placeholder={`e.g. 15 ${activeConfig.unit}`}
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              className="field-input"
            />
          </div>

          <div>
            <label className="field-label">Activity Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="field-input"
            />
          </div>
        </div>

        <div>
          <label className="field-label">Notes / Description (Optional)</label>
          <input
            type="text"
            placeholder="e.g., Office commute, Weekend trip"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="field-input"
          />
        </div>

        {/* Output box */}
        <div style={{ padding: '16px 20px', borderRadius: 10, background: 'var(--cream-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={16} color="var(--green)" />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--dark)' }}>Calculated Output:</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--green)' }}>{calculatedCO2.toFixed(2)}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>kg CO₂e</span>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-dark" style={{ width: '100%', justifyContent: 'center', padding: '14px 24px', fontSize: 14 }}>
          {loading ? 'Logging entry...' : 'Log Activity Entry'}
        </button>

      </form>

      {pendingAbsurdLog && (
        <AbsurdInputModal
          isOpen={!!pendingAbsurdLog}
          activity={pendingAbsurdLog}
          threshold={pendingAbsurdLog.threshold}
          onConfirm={() => executeLog(pendingAbsurdLog)}
          onCancel={() => setPendingAbsurdLog(null)}
        />
      )}

      {showAddModal && (
        <AddActivityTypeModal
          onAdd={handleAddCustomType}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
