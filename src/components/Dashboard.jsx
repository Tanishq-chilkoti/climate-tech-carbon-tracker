import React from 'react';
import { 
  PieChart as PieIcon, 
  BarChart3, 
  TreePine, 
  Smartphone, 
  Car, 
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
  car: '#1A1A1A',
  bus: '#2D6A4F',
  flight: '#4F46E5',
  electricity: '#D97706',
  'veg meal': '#52B788',
  'non-veg meal': '#E63946'
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

  // Prepare pie data
  const pieData = Object.entries(categoryBreakdown)
    .filter(([_, val]) => val > 0)
    .map(([key, value]) => ({
      name: key.toUpperCase(),
      value: parseFloat(value.toFixed(2)),
      color: CATEGORY_COLORS[key] || '#748C94'
    }));

  // Daily trend bar chart (last 7 days)
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* 4 Stat Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--text-muted)' }}>
              Total CO₂ Logged
            </span>
            <TreePine size={16} color="var(--green)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1px', color: 'var(--dark)' }}>
              {totalCO2.toFixed(1)}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)' }}>kg CO₂e</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, margin: 0 }}>Cumulative lifetime emissions</p>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--text-muted)' }}>
              This Week
            </span>
            <BarChart3 size={16} color="var(--dark)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1px', color: 'var(--dark)' }}>
              {weeklyCO2.toFixed(1)}
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>/ {weeklyTarget} kg</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, margin: 0 }}>Current week vs target limit</p>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--text-muted)' }}>
              Tree Absorption
            </span>
            <TreePine size={16} color="var(--green)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1px', color: 'var(--green)' }}>
              {equivalencies.treesNeeded}
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--dark)' }}>trees / year</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, margin: 0 }}>Trees required to absorb total log</p>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--text-muted)' }}>
              Energy Equivalent
            </span>
            <Smartphone size={16} color="#d97706" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-1px', color: '#d97706' }}>
              {equivalencies.phoneCharges.toLocaleString()}
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--dark)' }}>recharges</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, margin: 0 }}>Smartphone full battery charges</p>
        </div>

      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
        
        {/* Category Breakdown Pie Chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <PieIcon size={16} color="var(--green)" />
              <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--dark)' }}>Category Breakdown</h3>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Emissions proportion by activity type</p>
          </div>

          {pieData.length > 0 ? (
            <div style={{ height: 240, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1A1A1A', 
                      borderRadius: '8px', 
                      color: '#FFF', 
                      fontSize: '12px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }} 
                    formatter={(val) => [`${val} kg CO₂`, 'Emissions']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', margin: 0 }}>Total</p>
                <p style={{ fontSize: 16, fontWeight: 900, color: 'var(--dark)', margin: 0 }}>{totalCO2.toFixed(1)} kg</p>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>No activity data logged yet.</p>
          )}

          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            {pieData.map(item => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: 'var(--dark)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                {item.name}: {item.value} kg
              </div>
            ))}
          </div>
        </div>

        {/* Daily Trend Bar Chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <BarChart3 size={16} color="var(--dark)" />
              <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--dark)' }}>Daily Emissions Trend</h3>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Logged CO₂ emissions over the last 7 days</p>
          </div>

          {barData.length > 0 ? (
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1A1A1A', 
                      borderRadius: '8px', 
                      color: '#FFF', 
                      fontSize: '12px',
                      border: 'none'
                    }} 
                    formatter={(val) => [`${val} kg CO₂`, 'Emissions']}
                  />
                  <Bar dataKey="co2" fill="#2D6A4F" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>No daily trend data available.</p>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--text-muted)' }}>
            <span>Target daily average: ~{(weeklyTarget / 7).toFixed(1)} kg</span>
            <span style={{ fontWeight: 700, color: 'var(--green)' }}>7-day window</span>
          </div>
        </div>

      </div>

    </div>
  );
}
