import React, { useState } from 'react';
import { X, Play, Code2 } from 'lucide-react';

export default function ApiDocsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeEndpointIndex, setActiveEndpointIndex] = useState(0);
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const endpoints = [
    {
      method: 'GET',
      path: '/api/activities',
      desc: 'Query activity logs with filters (?type=car, ?startDate, ?endDate, ?search)',
      example: '/api/activities?type=car'
    },
    {
      method: 'POST',
      path: '/api/activities',
      desc: 'Log a new carbon activity entry.',
      example: '/api/activities',
      body: { type: 'car', quantity: 15, notes: 'Interactive API sandbox test' }
    },
    {
      method: 'GET',
      path: '/api/target',
      desc: 'Get current weekly CO2 target allowance.',
      example: '/api/target'
    },
    {
      method: 'POST',
      path: '/api/target',
      desc: 'Update weekly CO2 target allowance in kg.',
      example: '/api/target',
      body: { weeklyTarget: 45.0 }
    },
    {
      method: 'GET',
      path: '/api/summary',
      desc: 'Get aggregated stats: total CO2, weekly total, target status, category breakdown, nudge state.',
      example: '/api/summary'
    },
    {
      method: 'GET',
      path: '/api/decisions',
      desc: 'Get Decision Points configuration and rationales for DP1, DP2, and DP3.',
      example: '/api/decisions'
    },
    {
      method: 'GET',
      path: '/api/health',
      desc: 'Check API engine health status.',
      example: '/api/health'
    }
  ];

  const currentEp = endpoints[activeEndpointIndex];

  const handleTestEndpoint = async () => {
    try {
      setLoading(true);
      const isPost = currentEp.method === 'POST';
      const options = {
        method: currentEp.method,
        headers: { 'Content-Type': 'application/json' }
      };
      if (isPost && currentEp.body) {
        options.body = JSON.stringify(currentEp.body);
      }

      const res = await fetch(currentEp.example, options);
      const data = await res.json();
      setApiResponse({ status: res.status, ok: res.ok, data });
    } catch (err) {
      setApiResponse({ status: 500, ok: false, data: { error: err.message } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-bg">
      <div className="modal-box" style={{ maxWidth: 800 }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Code2 size={20} color="var(--green)" />
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--dark)' }}>
              Standard REST API & Interactive Sandbox
            </h3>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: 4 }}><X size={18} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20, marginBottom: 20 }}>
          
          {/* Endpoint Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 380, overflowY: 'auto' }}>
            {endpoints.map((ep, idx) => (
              <button
                key={idx}
                onClick={() => { setActiveEndpointIndex(idx); setApiResponse(null); }}
                className={`type-pill ${activeEndpointIndex === idx ? 'active' : ''}`}
                style={{ padding: '8px 12px', fontSize: 11 }}
              >
                <span className="chip-green" style={{ fontSize: 9, padding: '2px 6px', marginRight: 6 }}>{ep.method}</span>
                <code>{ep.path}</code>
              </button>
            ))}
          </div>

          {/* Sandbox content */}
          <div style={{ padding: 20, borderRadius: 12, background: 'var(--dark-card)', color: '#FFF', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 800 }}>{currentEp.method} {currentEp.path}</span>
                <button onClick={handleTestEndpoint} disabled={loading} className="btn-green" style={{ fontSize: 11, padding: '6px 14px' }}>
                  <Play size={12} /> {loading ? 'Testing...' : 'Execute'}
                </button>
              </div>
              <p style={{ fontSize: 12, opacity: 0.7, margin: '0 0 12px' }}>{currentEp.desc}</p>

              {currentEp.body && (
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 10, uppercase: true, opacity: 0.6 }}>Payload</span>
                  <pre style={{ fontSize: 11, background: 'rgba(255,255,255,0.06)', padding: 10, borderRadius: 6, margin: '4px 0 0' }}>
                    {JSON.stringify(currentEp.body, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div>
              <span style={{ fontSize: 10, uppercase: true, opacity: 0.6 }}>Live Response</span>
              {apiResponse ? (
                <pre style={{ fontSize: 11, background: 'rgba(255,255,255,0.06)', color: 'var(--green-light)', padding: 12, borderRadius: 6, margin: '4px 0 0', maxHeight: 180, overflowY: 'auto' }}>
                  {JSON.stringify(apiResponse.data, null, 2)}
                </pre>
              ) : (
                <div style={{ padding: 20, textAlign: 'center', fontSize: 12, opacity: 0.5, fontStyle: 'italic' }}>
                  Click Execute to test API response.
                </div>
              )}
            </div>
          </div>

        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn-outline">Close Sandbox</button>
        </div>

      </div>
    </div>
  );
}
