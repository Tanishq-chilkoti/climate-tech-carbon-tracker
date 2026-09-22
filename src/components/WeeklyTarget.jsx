import React, { useState } from 'react';
import { Target, AlertTriangle, Edit2, TrendingUp, Sparkles, ArrowRight, Calendar } from 'lucide-react';

export default function WeeklyTarget({ summary, onUpdateTarget }) {
  if (!summary) return null;

  const {
    weeklyCO2,
    weeklyTarget,
    budgetConsumedPct,
    timeElapsedPct,
    isTargetExceeded,
    isPacingHigh,
    nudge
  } = summary;

  const [isEditing, setIsEditing] = useState(false);
  const [newTarget, setNewTarget] = useState(weeklyTarget.toString());
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    const val = parseFloat(newTarget);
    if (!val || val <= 0) return;
    try {
      setLoading(true);
      await onUpdateTarget(val);
      setIsEditing(false);
    } catch (err) {
      alert(err.message || 'Failed to update target');
    } finally {
      setLoading(false);
    }
  };

  let statusText = 'Target On Track';
  let statusBg = 'rgba(45,106,79,0.1)';
  let statusColor = 'var(--green)';

  if (isTargetExceeded) {
    statusBg = '#FEE2E2';
    statusColor = '#DC2626';
    statusText = 'Target Exceeded';
  } else if (budgetConsumedPct >= 80) {
    statusBg = '#FEF3C7';
    statusColor = '#D97706';
    statusText = 'Budget Warning';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* Target Progress Card */}
      <div className="card" style={{ padding: 32 }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--cream-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Target size={20} color="var(--green)" />
            </div>
            <div>
              <p className="section-label" style={{ margin: 0 }}>Weekly Budget</p>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--dark)', margin: 0 }}>Target Pacing & Signal</h3>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ padding: '4px 12px', borderRadius: 99, background: statusBg, color: statusColor, fontSize: 11, fontWeight: 700 }}>
              {statusText}
            </span>
            <button
              onClick={() => {
                setNewTarget(weeklyTarget.toString());
                setIsEditing(!isEditing);
              }}
              className="btn-outline"
              style={{ padding: '6px 10px', fontSize: 11 }}
              title="Edit Target"
            >
              <Edit2 size={13} />
            </button>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSave} style={{ padding: 16, borderRadius: 10, background: 'var(--cream-dark)', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1 }}>
              <label className="field-label">New Target Limit (kg CO₂)</label>
              <input
                type="number"
                step="any"
                min="1"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                className="field-input"
              />
            </div>
            <div style={{ display: 'flex', gap: 8, alignSelf: 'flex-end' }}>
              <button type="button" onClick={() => setIsEditing(false)} className="btn-outline" style={{ fontSize: 12 }}>Cancel</button>
              <button type="submit" disabled={loading} className="btn-dark" style={{ fontSize: 12 }}>Save</button>
            </div>
          </form>
        )}

        {/* Numbers Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 36, fontWeight: 900, color: 'var(--dark)', letterSpacing: '-1px' }}>{weeklyCO2.toFixed(1)}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)' }}>/ {weeklyTarget.toFixed(1)} kg CO₂</span>
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--dark)' }}>
            {budgetConsumedPct}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="progress-track" style={{ height: 10, marginBottom: 20 }}>
          <div
            className="progress-fill"
            style={{
              width: `${Math.min(budgetConsumedPct, 100)}%`,
              background: isTargetExceeded ? '#DC2626' : 'var(--green)'
            }}
          />
        </div>

        {/* Pacing Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <div style={{ padding: 12, borderRadius: 8, background: 'var(--cream-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={14} color="var(--green)" /> ISO Week:
            </span>
            <span style={{ fontWeight: 700, color: 'var(--dark)' }}>{timeElapsedPct}% of 7 Days</span>
          </div>

          <div style={{ padding: 12, borderRadius: 8, background: 'var(--cream-dark)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <TrendingUp size={14} color="#D97706" /> Burn Rate:
            </span>
            {isPacingHigh ? (
              <span style={{ fontWeight: 800, color: '#DC2626' }}>⚠️ High Burn Rate</span>
            ) : (
              <span style={{ fontWeight: 800, color: 'var(--green)' }}>✓ Normal Pace</span>
            )}
          </div>
        </div>

      </div>

      {/* DP1 Nudge Alert Banner */}
      {isTargetExceeded && nudge && (
        <div style={{ padding: 24, borderRadius: 12, background: '#FEF2F2', border: '1px solid #FCA5A5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <AlertTriangle size={20} color="#DC2626" />
            <span style={{ fontSize: 14, fontWeight: 800, color: '#991B1B' }}>Weekly Target Cross Warning</span>
          </div>
          <p style={{ fontSize: 13, color: '#7F1D1D', lineHeight: 1.5, margin: '0 0 12px' }}>
            {nudge.message} We encourage positive reduction choices to bring your footprint back on track!
          </p>

          <div style={{ padding: 14, borderRadius: 8, background: '#FFF', border: '1px solid #FCA5A5' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--green)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={13} /> Recommended Quick Actions:
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: '#374151', lineHeight: 1.6 }}>
              {nudge.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}
