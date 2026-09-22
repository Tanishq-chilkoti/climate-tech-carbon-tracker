import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowDown, Leaf, Loader2 } from 'lucide-react';

export default function LandingHero({ weeklyCO2, totalCO2, loading, onEnter }) {
  const circleRef = useRef(null);

  // Override html/body to cream while on landing
  useEffect(() => {
    document.documentElement.style.backgroundColor = '#EDE8DC';
    document.body.style.backgroundColor = '#EDE8DC';
    document.body.style.color = '#1a1a1a';
    return () => {
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    };
  }, []);

  // Subtle parallax on the decorative circle
  useEffect(() => {
    const handleMove = (e) => {
      if (!circleRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      circleRef.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const co2Weekly = loading ? '—' : (weeklyCO2 ?? 0).toFixed(1);
  const co2Total  = loading ? '—' : (totalCO2  ?? 0).toFixed(1);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#EDE8DC',
        color: '#1a1a1a',
        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
      }}
    >
      {/* ── Navbar ── */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 64px',
        borderBottom: '1px solid rgba(0,0,0,0.09)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#2D6A4F' }} />
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.3px' }}>CarbonTracker</span>
        </div>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: 36, fontSize: 14, fontWeight: 500, color: '#555' }}
          className="hidden md:flex"
        >
          {['Overview', 'Track', 'Dashboard', 'History'].map(link => (
            <button
              key={link}
              onClick={onEnter}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: 14, fontWeight: 500, transition: 'color 0.15s' }}
              onMouseEnter={e => e.target.style.color = '#1a1a1a'}
              onMouseLeave={e => e.target.style.color = '#555'}
            >
              {link}
            </button>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#2D6A4F' }}
            className="hidden sm:flex"
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#2D6A4F', display: 'inline-block' }} />
            Live tracking
          </div>
          <button
            onClick={onEnter}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 22px',
              borderRadius: 999,
              backgroundColor: '#1a1a1a',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              transition: 'opacity 0.15s, transform 0.1s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Log activity <ArrowUpRight size={14} />
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '60px 64px',
        position: 'relative',
        gap: 40,
        flexWrap: 'wrap',
      }}>

        {/* Decorative concentric circles (right side) */}
        <div
          ref={circleRef}
          style={{
            position: 'absolute',
            right: '8%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            height: 500,
            borderRadius: '50%',
            border: '1px solid rgba(0,0,0,0.07)',
            pointerEvents: 'none',
            transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
            zIndex: 0,
          }}
        />
        <div style={{
          position: 'absolute',
          right: '11%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 350,
          height: 350,
          borderRadius: '50%',
          border: '1px solid rgba(0,0,0,0.05)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* ── Left: Text ── */}
        <div style={{ flex: 1, minWidth: 300, maxWidth: 620, zIndex: 1, position: 'relative' }}>

          {/* Label */}
          <p style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: '#999',
            marginBottom: 24,
            margin: '0 0 24px 0',
          }}>
            Personal Climate Ledger
          </p>

          {/* Dark headline */}
          <h1 style={{
            fontSize: 'clamp(40px, 6vw, 76px)',
            fontWeight: 900,
            lineHeight: 1.04,
            letterSpacing: '-2px',
            color: '#1a1a1a',
            margin: '0 0 4px 0',
          }}>
            Understand<br />
            your footprint.
          </h1>

          {/* Green headline */}
          <h2 style={{
            fontSize: 'clamp(40px, 6vw, 76px)',
            fontWeight: 900,
            lineHeight: 1.04,
            letterSpacing: '-2px',
            color: '#2D6A4F',
            margin: '4px 0 32px 0',
          }}>
            Change what<br />
            comes next.
          </h2>

          {/* Subtitle */}
          <p style={{
            fontSize: 15,
            lineHeight: 1.7,
            color: '#666',
            maxWidth: 420,
            margin: '0 0 40px 0',
          }}>
            CarbonTracker turns everyday choices into a clear, measurable
            carbon footprint, so the next decision feels possible.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
            <button
              onClick={onEnter}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '14px 28px',
                borderRadius: 999,
                backgroundColor: '#2D6A4F',
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 28px rgba(45,106,79,0.35)',
                transition: 'opacity 0.15s, transform 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Start tracking <ArrowUpRight size={16} />
            </button>

            <button
              onClick={onEnter}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'none', border: 'none',
                fontSize: 14, fontWeight: 600,
                color: '#1a1a1a',
                cursor: 'pointer',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.5'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Explore your impact <ArrowDown size={15} />
            </button>
          </div>
        </div>

        {/* ── Right: CO2 Widget ── */}
        <div style={{ zIndex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          {/* Main circle */}
          <div style={{
            width: 210,
            height: 210,
            borderRadius: '50%',
            backgroundColor: '#C8DFC8',
            border: '10px solid rgba(45,106,79,0.15)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 60px rgba(45,106,79,0.15), inset 0 2px 8px rgba(255,255,255,0.5)',
            position: 'relative',
          }}>
            {/* Inner ring */}
            <div style={{
              position: 'absolute',
              inset: 10,
              borderRadius: '50%',
              border: '1px solid rgba(45,106,79,0.18)',
            }} />

            <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#2D6A4F', margin: '0 0 4px 0' }}>
              This Week
            </p>
            {loading ? (
              <Loader2 size={32} style={{ color: '#2D6A4F', animation: 'spin 1s linear infinite' }} />
            ) : (
              <p style={{ fontSize: 52, fontWeight: 900, color: '#1B4332', lineHeight: 1, margin: 0 }}>
                {co2Weekly}
              </p>
            )}
            <p style={{ fontSize: 11, fontWeight: 600, color: '#2D6A4F', margin: '6px 0 0 0' }}>
              kg CO₂e logged
            </p>
          </div>

          {/* All-time pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 18px',
            borderRadius: 999,
            backgroundColor: 'rgba(45,106,79,0.12)',
            color: '#2D6A4F',
            fontSize: 12,
            fontWeight: 600,
          }}>
            <Leaf size={13} />
            All-time: {co2Total} kg CO₂
          </div>
        </div>
      </div>

      {/* ── Bottom Stats Strip ── */}
      <div style={{
        borderTop: '1px solid rgba(0,0,0,0.09)',
        padding: '28px 64px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 24,
      }}>
        <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
          {[
            { num: '6+',   label: 'Activity categories' },
            { num: '100%', label: 'Free & open' },
            { num: 'Live', label: 'CO₂ calculations' },
            { num: '∞',    label: 'Logs supported' },
          ].map(s => (
            <div key={s.label}>
              <p style={{ fontSize: 22, fontWeight: 900, color: '#2D6A4F', margin: '0 0 2px 0' }}>{s.num}</p>
              <p style={{ fontSize: 12, color: '#999', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onEnter}
          style={{
            background: 'none', border: 'none',
            fontSize: 12, fontWeight: 600,
            color: '#1a1a1a', cursor: 'pointer',
            textDecoration: 'underline',
            textUnderlineOffset: 4,
            opacity: 0.6,
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
        >
          Skip to dashboard →
        </button>
      </div>

      {/* Keyframe for spinner */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
