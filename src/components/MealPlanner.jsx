import React, { useState } from 'react';
import { Utensils, Plus, X, AlertCircle } from 'lucide-react';

const DEFAULT_MEAL_PRESETS = [
  { id: 'beef',    name: 'Beef / Lamb Burger',      type: 'non-veg meal', co2PerServing: 2.50, icon: '🥩', tag: 'High Carbon' },
  { id: 'chicken', name: 'Grilled Chicken Salad',   type: 'non-veg meal', co2PerServing: 0.80, icon: '🍗', tag: 'Medium Carbon' },
  { id: 'fish',    name: 'Fish & Rice Bowl',        type: 'non-veg meal', co2PerServing: 1.00, icon: '🐟', tag: 'Medium Carbon' },
  { id: 'tofu',    name: 'Tofu & Veggie Stir-fry',  type: 'veg meal',     co2PerServing: 0.50, icon: '🥗', tag: 'Low Carbon' },
  { id: 'avocado', name: 'Vegan Avocado Toast',     type: 'veg meal',     co2PerServing: 0.20, icon: '🥑', tag: 'Ultra Low Carbon' },
];

const VEG_EMOJIS    = ['🥗','🥦','🥑','🥕','🫛','🌽','🍲','🥘','🌮','🧆'];
const NONVEG_EMOJIS = ['🍗','🥩','🐟','🍖','🦐','🥚','🍔','🌭','🍣','🦑'];

function getTag(co2) {
  if (co2 <= 0.3) return 'Ultra Low Carbon';
  if (co2 <= 0.8) return 'Low Carbon';
  if (co2 <= 1.5) return 'Medium Carbon';
  return 'High Carbon';
}

function AddMealPanel({ onAdd, onClose }) {
  const [mealType, setMealType] = useState('veg meal');
  const [name, setName] = useState('');
  const [co2, setCo2] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(VEG_EMOJIS[0]);
  const [error, setError] = useState('');

  const emojis = mealType === 'veg meal' ? VEG_EMOJIS : NONVEG_EMOJIS;

  const handleAdd = () => {
    if (!name.trim()) { setError('Please enter a meal name.'); return; }
    if (!co2 || parseFloat(co2) <= 0) { setError('Enter a valid CO₂ value (kg per serving).'); return; }

    const co2Val = parseFloat(parseFloat(co2).toFixed(3));
    onAdd({
      id: `custom_${Date.now()}`,
      name: name.trim(),
      type: mealType,
      co2PerServing: co2Val,
      icon: selectedEmoji,
      tag: getTag(co2Val),
      isCustom: true,
    });

    setName(''); setCo2(''); setError('');
    onClose();
  };

  return (
    <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--cream-dark)', marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: 'var(--dark)' }}>Add New Meal Option</h4>
        <button onClick={onClose} className="btn-ghost" style={{ padding: 4 }}><X size={16} /></button>
      </div>

      {error && (
        <div style={{ padding: 10, borderRadius: 8, background: '#FEE2E2', color: '#DC2626', fontSize: 12, marginBottom: 12 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button
            type="button"
            onClick={() => { setMealType('veg meal'); setSelectedEmoji(VEG_EMOJIS[0]); }}
            className={`btn-outline ${mealType === 'veg meal' ? 'active' : ''}`}
            style={{ justifyContent: 'center', background: mealType === 'veg meal' ? 'var(--white)' : 'transparent', fontWeight: 700 }}
          >
            🥦 Veg Meal
          </button>
          <button
            type="button"
            onClick={() => { setMealType('non-veg meal'); setSelectedEmoji(NONVEG_EMOJIS[0]); }}
            className={`btn-outline ${mealType === 'non-veg meal' ? 'active' : ''}`}
            style={{ justifyContent: 'center', background: mealType === 'non-veg meal' ? 'var(--white)' : 'transparent', fontWeight: 700 }}
          >
            🍗 Non-Veg Meal
          </button>
        </div>

        <div>
          <label className="field-label">Icon</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {emojis.map(em => (
              <button
                key={em}
                type="button"
                onClick={() => setSelectedEmoji(em)}
                style={{
                  width: 36, height: 36, borderRadius: 8, fontSize: 18, border: '1px solid var(--border)',
                  background: selectedEmoji === em ? 'var(--white)' : 'transparent', cursor: 'pointer'
                }}
              >
                {em}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label className="field-label">Meal Name</label>
            <input
              type="text"
              placeholder="e.g. Quinoa Salad"
              value={name}
              onChange={e => setName(e.target.value)}
              className="field-input"
            />
          </div>
          <div>
            <label className="field-label">CO₂ per Serving (kg)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.50"
              value={co2}
              onChange={e => setCo2(e.target.value)}
              className="field-input"
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
          <button onClick={handleAdd} className="btn-dark" style={{ flex: 1, justifyContent: 'center' }}>Save Meal</button>
        </div>
      </div>
    </div>
  );
}

export default function MealPlanner({ onLogActivity }) {
  const [mealPresets, setMealPresets] = useState(DEFAULT_MEAL_PRESETS);
  const [selectedMeal, setSelectedMeal] = useState(DEFAULT_MEAL_PRESETS[3]);
  const [servings, setServings] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const totalCO2 = parseFloat((selectedMeal.co2PerServing * servings).toFixed(2));
  const visibleMeals = mealPresets.filter(m => filterType === 'all' ? true : m.type === filterType);

  const handleAddMeal = (newMeal) => {
    setMealPresets(prev => [...prev, newMeal]);
    setSelectedMeal(newMeal);
    setFilterType(newMeal.type);
  };

  const handleRemoveMeal = (mealId, e) => {
    e.stopPropagation();
    const remaining = mealPresets.filter(m => m.id !== mealId);
    setMealPresets(remaining);
    if (selectedMeal.id === mealId) {
      setSelectedMeal(remaining[0] || DEFAULT_MEAL_PRESETS[3]);
    }
  };

  const handleLog = async () => {
    try {
      setLoading(true);
      await onLogActivity({
        type: selectedMeal.type,
        quantity: servings,
        date: new Date().toISOString().split('T')[0],
        notes: `Meal: ${selectedMeal.name}`,
      });
    } catch (err) {
      alert(err.message || 'Failed to log meal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <p className="section-label" style={{ margin: 0 }}>Dietary Footprint</p>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--dark)', margin: '4px 0 0' }}>Meal Carbon Estimator</h3>
        </div>
        <button
          onClick={() => setShowAddPanel(v => !v)}
          className="btn-outline"
          style={{ fontSize: 11, padding: '6px 12px' }}
        >
          <Plus size={13} /> {showAddPanel ? 'Close' : 'Add Custom Meal'}
        </button>
      </div>

      {showAddPanel && (
        <AddMealPanel onAdd={handleAddMeal} onClose={() => setShowAddPanel(false)} />
      )}

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[
          { key: 'all', label: 'All Meals' },
          { key: 'veg meal', label: '🥦 Veg' },
          { key: 'non-veg meal', label: '🍗 Non-Veg' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilterType(f.key)}
            className={`btn-outline ${filterType === f.key ? 'active' : ''}`}
            style={{ fontSize: 12, padding: '6px 14px', background: filterType === f.key ? 'var(--dark)' : 'transparent', color: filterType === f.key ? '#FFF' : 'var(--dark)' }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        {visibleMeals.map(meal => {
          const isSelected = selectedMeal.id === meal.id;
          return (
            <div
              key={meal.id}
              onClick={() => setSelectedMeal(meal)}
              className={`meal-card ${isSelected ? 'active' : ''}`}
            >
              <div style={{ fontSize: 28, marginBottom: 6 }}>{meal.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--dark)' }}>{meal.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{meal.co2PerServing} kg CO₂ / serving</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <span className="chip-green" style={{ fontSize: 10 }}>{meal.tag}</span>
                {meal.isCustom && (
                  <button
                    onClick={(e) => handleRemoveMeal(meal.id, e)}
                    className="btn-ghost"
                    style={{ fontSize: 10, padding: '2px 4px', color: '#DC2626' }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action bottom bar */}
      <div style={{ padding: 20, borderRadius: 12, background: 'var(--cream-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div>
            <label className="field-label">Servings</label>
            <input
              type="number"
              min="1"
              max="10"
              value={servings}
              onChange={e => setServings(Math.max(1, parseInt(e.target.value) || 1))}
              className="field-input"
              style={{ width: 80 }}
            />
          </div>
          <div>
            <span className="field-label">Total Impact</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--green)' }}>{totalCO2}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>kg CO₂</span>
            </div>
          </div>
        </div>

        <button onClick={handleLog} disabled={loading} className="btn-dark">
          {loading ? 'Logging...' : `Log ${selectedMeal.name}`}
        </button>
      </div>

    </div>
  );
}
