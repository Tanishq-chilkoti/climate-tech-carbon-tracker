import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowDown, Leaf } from 'lucide-react';

export default function LandingHero({ weeklyCO2, totalCO2, onEnter }) {
  const circleRef = useRef(null);

  // Subtle parallax on the decorative circle
  useEffect(() => {
    const handleMove = (e) => {
      if (!circleRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 18;
      const y = (e.clientY / window.innerHeight - 0.5) * 18;
      circleRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#EDE8DC', color: '#1a1a1a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── Nav ── */}
      <nav
        className="flex items-center justify-between px-8 md:px-16 py-5 border-b"
        style={{ borderColor: 'rgba(0,0,0,0.1)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: '#2D6A4F' }}
          />
          <span className="text-base font-extrabold tracking-tight" style={{ color: '#1a1a1a' }}>
            CarbonTracker
          </span>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: '#555' }}>
          <button onClick={onEnter} className="hover:text-black transition-colors">Overview</button>
          <button onClick={onEnter} className="hover:text-black transition-colors">Track</button>
          <button onClick={onEnter} className="hover:text-black transition-colors">Dashboard</button>
          <button onClick={onEnter} className="hover:text-black transition-colors">History</button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#2D6A4F' }}>
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: '#2D6A4F' }}
            />
            Live tracking
          </div>
          <button
            onClick={onEnter}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            Log activity
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <main className="flex-1 flex flex-col md:flex-row items-center px-8 md:px-16 pt-16 md:pt-0 relative overflow-hidden">

        {/* Decorative background circle */}
        <div
          ref={circleRef}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border pointer-events-none transition-transform duration-700 ease-out"
          style={{ borderColor: 'rgba(0,0,0,0.08)', right: '6%' }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            right: '12%',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '380px',
            height: '380px',
            borderRadius: '50%',
            border: '1px solid rgba(0,0,0,0.05)'
          }}
        />

        {/* Left — Text */}
        <div className="flex-1 max-w-2xl z-10">
          {/* Label */}
          <p
            className="text-xs font-bold uppercase tracking-[0.2em] mb-6"
            style={{ color: '#888' }}
          >
            Personal Climate Ledger
          </p>

          {/* Headline */}
          <h1
            className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-4"
            style={{ color: '#1a1a1a' }}
          >
            Understand<br />
            your footprint.
          </h1>
          <h2
            className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-8"
            style={{ color: '#2D6A4F' }}
          >
            Change what<br />
            comes next.
          </h2>

          {/* Subtext */}
          <p
            className="text-base leading-relaxed mb-10 max-w-md"
            style={{ color: '#666' }}
          >
            CarbonTracker turns everyday choices into a clear, measurable
            carbon footprint, so the next decision feels possible.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-5 flex-wrap">
            <button
              onClick={onEnter}
              className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 shadow-lg"
              style={{ backgroundColor: '#2D6A4F', boxShadow: '0 8px 24px rgba(45,106,79,0.3)' }}
            >
              Start tracking
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('app-features');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else onEnter();
              }}
              className="flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-70"
              style={{ color: '#1a1a1a' }}
            >
              Explore your impact
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right — Weekly CO2 widget */}
        <div className="mt-16 md:mt-0 z-10 flex-shrink-0">
          <div
            className="relative w-52 h-52 rounded-full flex flex-col items-center justify-center shadow-xl"
            style={{
              backgroundColor: '#D4E6D8',
              border: '8px solid rgba(45,106,79,0.12)',
            }}
          >
            {/* Inner ring */}
            <div
              className="absolute inset-3 rounded-full"
              style={{ border: '1px solid rgba(45,106,79,0.2)' }}
            />
            <p
              className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1"
              style={{ color: '#2D6A4F' }}
            >
              This Week
            </p>
            <p
              className="text-5xl font-black leading-none"
              style={{ color: '#1B4332' }}
            >
              {weeklyCO2 !== undefined ? weeklyCO2.toFixed(1) : '0.0'}
            </p>
            <p
              className="text-xs font-semibold mt-1"
              style={{ color: '#2D6A4F' }}
            >
              kg CO₂e logged
            </p>
          </div>

          {/* Total pill below */}
          <div
            className="mt-4 flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold"
            style={{ backgroundColor: 'rgba(45,106,79,0.1)', color: '#2D6A4F' }}
          >
            <Leaf className="w-3 h-3" />
            Total all-time: {totalCO2 !== undefined ? totalCO2.toFixed(1) : '0.0'} kg CO₂
          </div>
        </div>
      </main>

      {/* ── Feature strip ── */}
      <div
        id="app-features"
        className="border-t px-8 md:px-16 py-8"
        style={{ borderColor: 'rgba(0,0,0,0.1)' }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl">
          {[
            { num: '6+', label: 'Activity categories' },
            { num: '100%', label: 'Free & open' },
            { num: 'Live', label: 'CO₂ calculations' },
            { num: '∞', label: 'Logs supported' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-extrabold" style={{ color: '#2D6A4F' }}>{stat.num}</p>
              <p className="text-sm" style={{ color: '#888' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Enter app prompt */}
        <button
          onClick={onEnter}
          className="mt-6 text-xs font-semibold underline underline-offset-4 transition-opacity hover:opacity-60"
          style={{ color: '#1a1a1a' }}
        >
          Skip to dashboard →
        </button>
      </div>
    </div>
  );
}
