import React, { useState } from 'react';
import { 
  Search, 
  Trash2, 
  Car, 
  Bus, 
  Plane, 
  Zap, 
  Utensils, 
  Flame, 
  History 
} from 'lucide-react';

const CATEGORY_ICONS = {
  car: Car,
  bus: Bus,
  flight: Plane,
  electricity: Zap,
  'veg meal': Utensils,
  'non-veg meal': Flame
};

const UNITS = {
  car: 'km',
  bus: 'km',
  flight: 'km',
  electricity: 'kWh',
  'veg meal': 'servings',
  'non-veg meal': 'servings'
};

export default function ActivityHistory({ activities, onDeleteActivity }) {
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  let filtered = [...activities];

  if (selectedType !== 'all') {
    filtered = filtered.filter(a => a.type.toLowerCase() === selectedType.toLowerCase());
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(a => 
      a.type.toLowerCase().includes(q) || 
      (a.notes && a.notes.toLowerCase().includes(q))
    );
  }

  if (dateRange === 'today') {
    const todayStr = new Date().toISOString().split('T')[0];
    filtered = filtered.filter(a => a.date === todayStr);
  } else if (dateRange === 'week') {
    const now = new Date();
    const weekAgo = new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];
    filtered = filtered.filter(a => a.date >= weekAgo);
  }

  filtered.sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'highest') return b.co2_kg - a.co2_kg;
    if (sortBy === 'lowest') return a.co2_kg - b.co2_kg;
    return 0;
  });

  return (
    <div className="card" style={{ padding: 32 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <p className="section-label" style={{ margin: 0 }}>Log History</p>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--dark)', margin: '4px 0 0' }}>Activity Records</h3>
        </div>
        <span className="chip-green" style={{ fontSize: 11 }}>
          Showing {filtered.length} of {activities.length} entries
        </span>
      </div>

      {/* Filter toolbar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="field-input"
            style={{ paddingLeft: 36, fontSize: 12 }}
          />
          <Search size={14} color="#999" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="field-input"
          style={{ fontSize: 12 }}
        >
          <option value="all">📅 All Time</option>
          <option value="today">Today Only</option>
          <option value="week">Past 7 Days</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="field-input"
          style={{ fontSize: 12 }}
        >
          <option value="newest">↕ Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest CO₂ Output</option>
          <option value="lowest">Lowest CO₂ Output</option>
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="field-input"
          style={{ fontSize: 12 }}
        >
          <option value="all">🏷 All Categories</option>
          <option value="car">Car Travel</option>
          <option value="bus">Bus Travel</option>
          <option value="flight">Flight</option>
          <option value="electricity">Electricity</option>
          <option value="veg meal">Veg Meal</option>
          <option value="non-veg meal">Non-veg Meal</option>
        </select>

      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Activity</th>
              <th>Quantity</th>
              <th>Date</th>
              <th>Notes</th>
              <th style={{ textAlign: 'right' }}>CO₂ Impact</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((act) => {
              const Icon = CATEGORY_ICONS[act.type] || History;
              const unit = UNITS[act.type] || 'units';

              return (
                <tr key={act.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={15} color="var(--green)" />
                      </div>
                      <span style={{ fontWeight: 700, textTransform: 'capitalize', color: 'var(--dark)' }}>{act.type}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-body)', fontWeight: 600 }}>
                    {act.quantity} {unit}
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {act.date}
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-body)', fontStyle: act.notes ? 'normal' : 'italic' }}>
                    {act.notes || '—'}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--green)', fontSize: 14 }}>
                    +{act.co2_kg.toFixed(2)} kg
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => onDeleteActivity(act.id)}
                      className="btn-ghost"
                      style={{ color: '#DC2626', padding: '4px 8px' }}
                      title="Delete log entry"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
          No activity logs match your filter criteria.
        </div>
      )}

    </div>
  );
}
