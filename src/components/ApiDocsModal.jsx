import React from 'react';
import { X, Code2, Copy, Check, Terminal, Globe } from 'lucide-react';

export default function ApiDocsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const endpoints = [
    {
      method: 'GET',
      path: '/api/activities',
      desc: 'Query activity logs. Supports filters: ?type=car, ?startDate=2026-09-01, ?endDate=2026-09-22, ?search=commute',
      example: 'curl http://localhost:3000/api/activities?type=car'
    },
    {
      method: 'POST',
      path: '/api/activities',
      desc: 'Log new activity. Computes CO2 factor automatically based on brief specification.',
      example: 'curl -X POST http://localhost:3000/api/activities \\\n  -H "Content-Type: application/json" \\\n  -d \'{"type":"car","quantity":15,"date":"2026-09-22","notes":"Office travel"}\''
    },
    {
      method: 'DELETE',
      path: '/api/activities/:id',
      desc: 'Remove activity log entry by ID.',
      example: 'curl -X DELETE http://localhost:3000/api/activities/act-1'
    },
    {
      method: 'GET',
      path: '/api/target',
      desc: 'Get current weekly CO2 target allowance.',
      example: 'curl http://localhost:3000/api/target'
    },
    {
      method: 'POST',
      path: '/api/target',
      desc: 'Update weekly CO2 target allowance in kg.',
      example: 'curl -X POST http://localhost:3000/api/target \\\n  -H "Content-Type: application/json" \\\n  -d \'{"weeklyTarget":45.0}\''
    },
    {
      method: 'GET',
      path: '/api/summary',
      desc: 'Get aggregated metrics: total CO2, weekly total, target status, category breakdown, and DP1 nudge status.',
      example: 'curl http://localhost:3000/api/summary'
    },
    {
      method: 'GET',
      path: '/api/decisions',
      desc: 'Get Decision Points configuration and rationales for DP1, DP2, and DP3.',
      example: 'curl http://localhost:3000/api/decisions'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-3xl rounded-2xl p-6 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 space-y-5 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Standard REST API Specification</h3>
              <p className="text-xs text-slate-400">Automated grading endpoint compatibility layer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {endpoints.map((ep, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                  ep.method === 'GET' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                  ep.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {ep.method}
                </span>
                <code className="text-xs font-mono font-bold text-white">{ep.path}</code>
              </div>
              <p className="text-xs text-slate-300">{ep.desc}</p>
              <pre className="p-2.5 rounded-lg bg-slate-950 text-[11px] font-mono text-emerald-300 overflow-x-auto border border-slate-800">
                {ep.example}
              </pre>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
}
