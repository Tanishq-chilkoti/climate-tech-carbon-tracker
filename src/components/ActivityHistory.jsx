import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Trash2, 
  Car, 
  Bus, 
  Plane, 
  Zap, 
  Utensils, 
  Flame, 
  Calendar,
  ArrowUpDown
} from 'lucide-react';

const CATEGORY_ICONS = {
  car: Car,
  bus: Bus,
  flight: Plane,
  electricity: Zap,
  'veg meal': Utensils,
  'non-veg meal': Flame
};

const CATEGORY_COLORS = {
  car: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  bus: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  flight: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  electricity: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  'veg meal': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  'non-veg meal': 'text-rose-400 bg-rose-500/10 border-rose-500/30'
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
  const [dateRange, setDateRange] = useState('all'); // all, today, week
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest, lowest

  // Apply filters
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

  // Sorting
  filtered.sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'highest') return b.co2_kg - a.co2_kg;
    if (sortBy === 'lowest') return a.co2_kg - b.co2_kg;
    return 0;
  });

  return (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            Activity History & Filters
          </h2>
          <p className="text-xs text-slate-400">Feature 5 · Filterable activity log records</p>
        </div>
        <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 self-start sm:self-auto font-mono">
          {filtered.length} of {activities.length} entries
        </span>
      </div>

      {/* Filter Controls Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
        
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search notes or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Date Range Filter */}
        <div className="relative">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">📅 All Time</option>
            <option value="today">Today Only</option>
            <option value="week">Past 7 Days</option>
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="newest">↕️ Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest CO₂ Output</option>
            <option value="lowest">Lowest CO₂ Output</option>
          </select>
        </div>

        {/* Category Filter Pills */}
        <div className="sm:col-span-3 lg:col-span-1 relative">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 capitalize"
          >
            <option value="all">🏷️ All Categories</option>
            <option value="car">Car Travel</option>
            <option value="bus">Bus Travel</option>
            <option value="flight">Flight</option>
            <option value="electricity">Electricity</option>
            <option value="veg meal">Veg Meal</option>
            <option value="non-veg meal">Non-veg Meal</option>
          </select>
        </div>

      </div>

      {/* Activity List Records */}
      {filtered.length > 0 ? (
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {filtered.map((act) => {
            const Icon = CATEGORY_ICONS[act.type] || History;
            const badgeStyle = CATEGORY_COLORS[act.type] || 'text-slate-300 bg-slate-800';
            const unit = UNITS[act.type] || 'units';

            return (
              <div
                key={act.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-all group"
              >
                
                {/* Left details */}
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${badgeStyle}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white capitalize">{act.type}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {act.quantity} {unit}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{act.date}</span>
                      {act.notes && (
                        <>
                          <span>•</span>
                          <span className="italic text-slate-400 truncate max-w-xs">{act.notes}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right CO2 & Actions */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-emerald-400 block font-mono">
                      +{act.co2_kg.toFixed(2)} kg
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">CO₂ impact</span>
                  </div>

                  <button
                    onClick={() => onDeleteActivity(act.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-80 group-hover:opacity-100"
                    title="Delete activity record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-500 text-xs">
          No activity logs match your filter criteria.
        </div>
      )}

    </div>
  );
}
