import React, { useState } from 'react';
import { X, Code2, Play, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function ApiDocsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeEndpointIndex, setActiveEndpointIndex] = useState(0);
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const endpoints = [
    {
      method: 'GET',
      path: '/api/activities',
      desc: 'Query activity logs. Supports filters: ?type=car, ?startDate=2026-09-01, ?endDate=2026-09-22, ?search=commute',
      example: '/api/activities?type=car'
    },
    {
      method: 'POST',
      path: '/api/activities',
      desc: 'Log new activity. Computes CO2 factor automatically based on brief specification.',
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
      desc: 'Get aggregated metrics: total CO2, weekly total, target status, category breakdown, and DP1 nudge status.',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-4xl rounded-2xl p-6 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 space-y-5 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Standard REST API & Interactive Sandbox</h3>
              <p className="text-xs text-slate-400">Test API endpoints directly inside the browser</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 overflow-hidden">
          
          {/* Endpoint List Sidebar */}
          <div className="lg:col-span-5 space-y-2 overflow-y-auto pr-1">
            {endpoints.map((ep, idx) => {
              const isSelected = activeEndpointIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveEndpointIndex(idx);
                    setApiResponse(null);
                  }}
                  className={`w-full p-3 rounded-xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500/40 ring-1 ring-emerald-500/30 text-white'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                      ep.method === 'GET' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      ep.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {ep.method}
                    </span>
                    <code className="text-xs font-mono font-bold">{ep.path}</code>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Sandbox Panel */}
          <div className="lg:col-span-7 flex flex-col justify-between p-4 rounded-xl bg-slate-950 border border-slate-800 overflow-y-auto space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white font-mono">{currentEp.method} {currentEp.path}</span>
                <button
                  onClick={handleTestEndpoint}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-all cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{loading ? 'Running...' : 'Execute Request'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-400">{currentEp.desc}</p>
            </div>

            {/* Request Body Info */}
            {currentEp.body && (
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Request Payload</span>
                <pre className="p-2.5 rounded-lg bg-slate-900 text-[11px] font-mono text-amber-300 border border-slate-800">
                  {JSON.stringify(currentEp.body, null, 2)}
                </pre>
              </div>
            )}

            {/* Live Response Output */}
            <div className="flex-1 min-h-[160px]">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-1">
                <span>Live API Response</span>
                {apiResponse && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${apiResponse.ok ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {apiResponse.status} {apiResponse.ok ? 'OK' : 'Error'}
                  </span>
                )}
              </span>

              {apiResponse ? (
                <pre className="p-3 rounded-xl bg-slate-900/90 text-[11px] font-mono text-emerald-400 border border-emerald-500/20 overflow-x-auto max-h-56">
                  {JSON.stringify(apiResponse.data, null, 2)}
                </pre>
              ) : (
                <div className="h-36 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center justify-center text-xs text-slate-500 italic">
                  Click "Execute Request" to test endpoint live.
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
          >
            Close Sandbox
          </button>
        </div>

      </div>
    </div>
  );
}
