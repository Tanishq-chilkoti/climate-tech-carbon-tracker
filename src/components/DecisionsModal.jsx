import React, { useEffect, useState } from 'react';
import { X, BookOpen, CheckCircle2 } from 'lucide-react';
import { fetchDecisions } from '../services/api';

export default function DecisionsModal({ isOpen, onClose }) {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchDecisions()
        .then(res => {
          if (res.success) setDecisions(res.decisions);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-bg">
      <div className="modal-box" style={{ maxWidth: 680 }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BookOpen size={20} color="var(--green)" />
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--dark)' }}>
              DECISIONS.md Viewer
            </h3>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: 4 }}><X size={18} /></button>
        </div>

        {/* Content */}
        <div style={{ maxHeight: 420, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>Loading decisions...</div>
          ) : (
            decisions.map((dp) => (
              <div key={dp.id} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span className="chip-green" style={{ fontSize: 10 }}>{dp.id}</span>
                  <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--dark)', margin: 0 }}>{dp.name}</h4>
                </div>

                <div style={{ padding: 12, borderRadius: 8, background: 'var(--cream-dark)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: 'var(--dark)', marginBottom: 12 }}>
                  <CheckCircle2 size={16} color="var(--green)" />
                  <span>Choice: {dp.choice}</span>
                </div>

                <div>
                  <span className="field-label" style={{ marginBottom: 4 }}>Rationale</span>
                  <p style={{ fontSize: 12, color: 'var(--text-body)', lineHeight: 1.5, margin: 0 }}>
                    {dp.rationale}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn-dark">Close Viewer</button>
        </div>

      </div>
    </div>
  );
}
