import React from 'react';
import { 
  PieChart as PieIcon, 
  BarChart3, 
  Car, 
  Bus, 
  Plane, 
  Zap, 
  Utensils, 
  Flame,
  TreePine, 
  Smartphone, 
  Compass,
  AlertTriangle,
  Info
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';

const CATEGORY_COLORS = {
  car: '#3b82f6',        // Blue
  bus: '#06b6d4',        // Cyan
  flight: '#8b5cf6',     // Purple
  electricity: '#eab308', // Amber
  'veg meal': '#22c55e',  // Green
  'non-veg meal': '#ef4444' // Red
};

const CATEGORY_ICONS = {
  car: Car,
  bus: Bus,
  flight: Plane,
  electricity: Zap,
  'veg meal': Utensils,
  'non-veg meal': Flame
};

export default function Dashboard({ summary, activities }) {
  if (!summary) return null;

  const {
    totalCO2,
    weeklyCO2,
    weeklyTarget,
    categoryBreakdown,
    equivalencies
  } = summary;

  // Prepare data for Pie Chart
  const pieData = Object.entries(categoryBreakdown)
    .filter(([_, val]) => val > 0)
    .map(([key, value]) => ({
      name: key.toUpperCase(),
      value,
      color: CATEGORY_COLORS[key] || '#94a3b8'
    }));

  // Prepare data for Daily Trend Bar Chart (last 7 days)
  const daysMap = {};
  activities.forEach(a => {
    const d = a.date;
    daysMap[d] = (daysMap[d] || 0) + a.co2_kg;
  });

  const barData = Object.entries(daysMap)
    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
    .slice(-7)
    .map(([date, co2]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      co2: parseFloat(co2.toFixed(2))
    }));

  return (
    <div className="space-y-6">
      
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total CO2 Card */}
        <div className="glass-panel p-5 rounded-2xl glass-panel-hover relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total CO₂ Logged</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TreePine className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{totalCO2.toFixed(1)}</span>
            <span className="text-sm font-semibold text-emerald-400">kg CO₂</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Cumulative footprint from all activities</p>
        </div>

        {/* Weekly Footprint Card */}
        <div className="glass-panel p-5 rounded-2xl glass-panel-hover relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Weekly Footprint</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{weeklyCO2.toFixed(1)}</span>
            <span className="text-sm font-medium text-slate-400">/ {weeklyTarget.toFixed(1)} kg</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Current ISO week CO₂ total</p>
        </div>

        {/* Trees Needed Card */}
        <div className="glass-panel p-5 rounded-2xl glass-panel-hover relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tree Offset Needed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TreePine className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">{equivalencies.treesNeeded}</span>
            <span className="text-sm font-semibold text-slate-300">Trees / year</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">To absorb your logged carbon footprint</p>
        </div>

        {/* Phone Charges Equivalency Card */}
        <div className="glass-panel p-5 rounded-2xl glass-panel-hover relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Equivalent Energy</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400 tracking-tight">{equivalencies.phoneCharges.toLocaleString()}</span>
            <span className="text-sm font-semibold text-slate-300">Phone charges</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Equivalent smartphone battery recharges</p>
        </div>

      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Donut Chart: Category Breakdown */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-400" />
                Emissions by Category
              </h3>
              <p className="text-xs text-slate-400">Distribution across transport, food, and energy</p>
            </div>
          </div>

          {pieData.length > 0 ? (
            <div className="h-64 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#334155', 
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px'
                    }} 
                    formatter={(val) => [`${val.toFixed(2)} kg CO₂`, 'Emissions']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center pointer-events-none">
                <span className="text-xs text-slate-400 font-medium">Total</span>
                <p className="text-lg font-bold text-white">{totalCO2.toFixed(1)} kg</p>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs">
              No activity logs recorded yet.
            </div>
          )}

          {/* Category Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800/80">
            {Object.entries(categoryBreakdown).map(([cat, val]) => {
              const Icon = CATEGORY_ICONS[cat] || Zap;
              const color = CATEGORY_COLORS[cat];
              return (
                <div key={cat} className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/40 border border-slate-800/60">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: `${color}20`, color }}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-300 capitalize">{cat}</p>
                    <p className="text-xs font-bold text-white">{val.toFixed(1)} <span className="text-[10px] text-slate-400 font-normal">kg</span></p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bar Chart: Daily Emissions Trend */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-teal-400" />
                Daily Emissions Trend
              </h3>
              <p className="text-xs text-slate-400">Recent daily CO₂ output in kg</p>
            </div>
          </div>

          {barData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#334155', 
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                    formatter={(val) => [`${val} kg CO₂`, 'Daily Footprint']}
                  />
                  <Bar dataKey="co2" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs">
              No recent trend data.
            </div>
          )}

          {/* Reference Emission Factors Banner */}
          <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-emerald-400">Fixed Conversion Factors: </span>
              Car (0.20 kg/km) • Bus (0.08 kg/km) • Flight (0.25 kg/km) • Electricity (0.80 kg/kWh) • Veg Meal (0.5 kg) • Non-veg Meal (2.0 kg).
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
