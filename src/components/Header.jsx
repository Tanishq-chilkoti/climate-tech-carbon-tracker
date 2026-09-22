import React, { useState } from 'react';
import { Leaf, Download, Code2, BookOpen, RotateCcw, ArrowUpRight, Menu, X } from 'lucide-react';

export default function Header({
  summary,
  activeTab,
  setActiveTab,
  onReset,
  onExport,
  onOpenApi,
  onOpenDecisions,
  onGoHome
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'track', label: 'Track' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'history', label: 'History' },
    { id: 'meals', label: 'Meals' },
    { id: 'power', label: 'Energy' },
    { id: 'routes', label: 'Routes' },
    { id: 'coach', label: 'AI Coach' },
  ];

  return (
    <header className="app-nav" style={{ padding: '16px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>
        
        {/* Main Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Brand Logo */}
          <button
            onClick={onGoHome}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <span className="live-dot" />
            <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.5px', color: '#1A1A1A' }}>
              PlanetPulse
            </span>
          </button>

          {/* Desktop Nav Tabs */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }} className="hidden-mobile">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`tab-link ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            
            {/* Status indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }} className="hidden-mobile">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#d97706' }} />
              Browser saved
            </div>

            {/* Quick Action Tools */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={onOpenApi}
                className="btn-outline"
                style={{ fontSize: 11, padding: '6px 12px' }}
                title="Standard REST API Endpoints"
              >
                <Code2 size={13} />
                <span className="hidden-mobile">API</span>
              </button>

              <button
                onClick={onOpenDecisions}
                className="btn-outline"
                style={{ fontSize: 11, padding: '6px 12px' }}
                title="View DECISIONS.md"
              >
                <BookOpen size={13} />
                <span className="hidden-mobile">Docs</span>
              </button>

              <button
                onClick={onReset}
                className="btn-outline"
                style={{ fontSize: 11, padding: '6px 10px' }}
                title="Reset dataset"
              >
                <RotateCcw size={13} />
              </button>

              {/* Primary CTA */}
              <button
                className="btn-dark"
                onClick={() => setActiveTab('track')}
                style={{ fontSize: 12, padding: '9px 18px' }}
              >
                Log activity <ArrowUpRight size={13} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
