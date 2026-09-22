import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ActivityForm from './components/ActivityForm';
import WeeklyTarget from './components/WeeklyTarget';
import ActivityHistory from './components/ActivityHistory';
import QuickLogPresets from './components/QuickLogPresets';
import EcoBadges from './components/EcoBadges';
import CarbonSimulator from './components/CarbonSimulator';
import AiEcoCoach from './components/AiEcoCoach';
import CountryBenchmark from './components/CountryBenchmark';
import MealPlanner from './components/MealPlanner';
import ApplianceEstimator from './components/ApplianceEstimator';
import TransportCalculator from './components/TransportCalculator';
import ApiDocsModal from './components/ApiDocsModal';
import DecisionsModal from './components/DecisionsModal';
import LandingHero from './components/LandingHero';
import {
  fetchSummary, fetchActivities, logActivity,
  deleteActivity, editActivity, updateWeeklyTarget, resetDemoData
} from './services/api';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [summary, setSummary]       = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeTab, setActiveTab]   = useState('overview');
  const [toastMessage, setToastMessage] = useState('');
  const [showLanding, setShowLanding]   = useState(true);
  const [isApiModalOpen, setIsApiModalOpen]           = useState(false);
  const [isDecisionsModalOpen, setIsDecisionsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      const [sumRes, actRes] = await Promise.all([fetchSummary(), fetchActivities()]);
      if (sumRes.success) setSummary(sumRes.summary);
      if (actRes.success) setActivities(actRes.data);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // Body background: cream always
  useEffect(() => {
    document.body.style.backgroundColor = '#EDE8DC';
    document.documentElement.style.backgroundColor = '#EDE8DC';
    return () => {
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleLogActivity = async (data) => {
    const res = await logActivity(data);
    if (res.success) {
      showToast(`Logged +${res.data.co2_kg} kg CO₂ — ${data.type}`);
      await loadData();
    }
  };

  const handleQuickLog = async (preset) => {
    try {
      await handleLogActivity({ type: preset.type, quantity: preset.quantity, date: new Date().toISOString().split('T')[0], notes: preset.notes });
    } catch (err) { alert(err.message); }
  };

  const handleDeleteActivity = async (id) => {
    const res = await deleteActivity(id);
    if (res.success) { showToast('Entry deleted'); await loadData(); }
  };

  const handleEditActivity = async (id, data) => {
    const res = await editActivity(id, data);
    if (res.success) { showToast('Entry updated'); await loadData(); }
  };

  const handleUpdateTarget = async (newTarget) => {
    const res = await updateWeeklyTarget(newTarget);
    if (res.success) { showToast(`Target set to ${newTarget} kg CO₂`); await loadData(); }
  };

  const handleResetData = async () => {
    if (confirm('Reset to demo dataset?')) {
      const res = await resetDemoData();
      if (res.success) { showToast('Dataset reset'); await loadData(); }
    }
  };

  const handleExportCSV = () => {
    if (!activities.length) { alert('No activities to export'); return; }
    const headers = ['ID','Type','Quantity','CO2_kg','Date','Notes'];
    const rows = activities.map(a => [a.id,`"${a.type}"`,a.quantity,a.co2_kg,a.date,`"${a.notes||''}"`]);
    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','),...rows.map(r=>r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = `carbon_logs_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    showToast('CSV exported');
  };

  // Landing page
  if (showLanding) {
    return (
      <LandingHero
        weeklyCO2={summary ? summary.weeklyCO2 : 0}
        totalCO2={summary ? summary.totalCO2 : 0}
        loading={loading}
        onEnter={() => setShowLanding(false)}
      />
    );
  }

  const s = summary || { totalCO2: 0, weeklyCO2: 0, weeklyTarget: 50, categoryBreakdown: {}, equivalencies: {} };

  return (
    <div className="app-bg" style={{ minHeight: '100vh', paddingBottom: 80 }}>

      {/* Nav */}
      <Header
        summary={s}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onReset={handleResetData}
        onExport={handleExportCSV}
        onOpenApi={() => setIsApiModalOpen(true)}
        onOpenDecisions={() => setIsDecisionsModalOpen(true)}
        onGoHome={() => setShowLanding(true)}
      />

      {/* Main */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid rgba(0,0,0,0.09)', marginBottom: 56 }}>
              {[
                { label: 'Total Logged', value: s.totalCO2.toFixed(1), unit: 'kg CO₂e' },
                { label: 'This Week',    value: s.weeklyCO2.toFixed(1), unit: 'kg CO₂e' },
                { label: 'Activities',   value: activities.length, unit: '' },
                { label: 'Target',       value: s.weeklyTarget, unit: 'kg / week' },
              ].map((stat, i) => (
                <div key={i} className="stat-block">
                  <p className="stat-label">{stat.label}</p>
                  <p style={{ margin: 0 }}>
                    <span className="stat-num">{stat.value}</span>
                    {stat.unit && <span className="stat-unit">{stat.unit}</span>}
                  </p>
                </div>
              ))}
            </div>

            {/* How it works */}
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 1fr 1fr', gap: 16, marginBottom: 56 }}>
              <div className="card-dark">
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>01 — A Clearer Loop</p>
                <p style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.2, color: '#fff', margin: 0 }}>Small choices,<br />visible impact.</p>
              </div>
              {[
                { n:'01', title:'Log',        body:'Record travel, meals, or energy in seconds.' },
                { n:'02', title:'Understand', body:'See the CO₂ calculation before you save.' },
                { n:'03', title:'Adjust',     body:'Use your weekly signal to choose what comes next.' },
              ].map(s => (
                <div key={s.n} className="card" style={{ padding: '24px 28px' }}>
                  <p className="step-num">{s.n}</p>
                  <p className="step-title">{s.title}</p>
                  <p className="step-body">{s.body}</p>
                </div>
              ))}
            </div>

            {/* Quick Log section */}
            <div style={{ marginBottom: 56 }}>
              <p className="section-label">Track Your Day</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
                <h2 className="section-heading" style={{ margin: 0 }}>Make the invisible measurable.</h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 240, textAlign: 'right', lineHeight: 1.5, margin: 0 }}>
                  Every entry is calculated with a transparent factor. No accounts, no noise, no hidden score.
                </p>
              </div>
              <QuickLogPresets onQuickLog={handleQuickLog} />
            </div>

            {/* Signal + AI Coach */}
            <div style={{ marginBottom: 56 }}>
              <p className="section-label">Your Signal</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
                <h2 className="section-heading" style={{ margin: 0 }}>A week you can read at a glance.</h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 280, textAlign: 'right', lineHeight: 1.5, margin: 0 }}>
                  Compare your current footprint with the target you set. The week always runs Monday through Sunday.
                </p>
              </div>
              <WeeklyTarget summary={s} onUpdateTarget={handleUpdateTarget} />
            </div>

            {/* Charts */}
            <div style={{ marginBottom: 56 }}>
              <p className="section-label">Breakdown</p>
              <h2 className="section-heading">Where your emissions come from.</h2>
              <Dashboard summary={s} activities={activities} />
            </div>
          </div>
        )}

        {/* TRACK TAB */}
        {activeTab === 'track' && (
          <div style={{ paddingTop: 48 }}>
            <p className="section-label">Log an Activity</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
              <h2 className="section-heading" style={{ margin: 0 }}>Record your footprint.</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 260, textAlign: 'right', lineHeight: 1.5, margin: 0 }}>
                Pick a category, enter a quantity, and see the CO₂ impact before you save.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>
              <ActivityForm onLogActivity={handleLogActivity} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <AiEcoCoach summary={s} activities={activities} />
              </div>
            </div>
          </div>
        )}

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div style={{ paddingTop: 48 }}>
            <p className="section-label">Analytics</p>
            <h2 className="section-heading">Your full carbon picture.</h2>
            <div style={{ marginBottom: 32 }}>
              <WeeklyTarget summary={s} onUpdateTarget={handleUpdateTarget} />
            </div>
            <Dashboard summary={s} activities={activities} />
            <div style={{ marginTop: 32 }}>
              <EcoBadges summary={s} activities={activities} />
            </div>
            <div style={{ marginTop: 32 }}>
              <CountryBenchmark totalCO2={s.totalCO2} totalLogs={activities.length} />
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div style={{ paddingTop: 48 }}>
            <p className="section-label">History</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
              <h2 className="section-heading" style={{ margin: 0 }}>Every entry, every day.</h2>
              <button className="btn-outline" onClick={handleExportCSV} style={{ fontSize: 12 }}>Export CSV ↓</button>
            </div>
            <ActivityHistory activities={activities} onDeleteActivity={handleDeleteActivity} onEditActivity={handleEditActivity} />
          </div>
        )}

        {/* TOOLS TABS */}
        {activeTab === 'meals' && (
          <div style={{ paddingTop: 48 }}>
            <p className="section-label">Meal Planner</p>
            <h2 className="section-heading">Track your diet footprint.</h2>
            <MealPlanner onLogActivity={handleLogActivity} />
          </div>
        )}
        {activeTab === 'power' && (
          <div style={{ paddingTop: 48 }}>
            <p className="section-label">Appliance Estimator</p>
            <h2 className="section-heading">Calculate your home energy use.</h2>
            <ApplianceEstimator onLogActivity={handleLogActivity} />
          </div>
        )}
        {activeTab === 'routes' && (
          <div style={{ paddingTop: 48 }}>
            <p className="section-label">Route Calculator</p>
            <h2 className="section-heading">Compare transport emissions.</h2>
            <TransportCalculator onLogActivity={handleLogActivity} />
          </div>
        )}
        {activeTab === 'coach' && (
          <div style={{ paddingTop: 48 }}>
            <p className="section-label">AI Eco Coach</p>
            <h2 className="section-heading">Personalised climate guidance.</h2>
            <AiEcoCoach summary={s} activities={activities} />
            <div style={{ marginTop: 32 }}><CarbonSimulator /></div>
          </div>
        )}

      </main>

      {/* Toast */}
      {toastMessage && (
        <div className="toast">
          <CheckCircle2 size={16} color="#4ade80" />
          {toastMessage}
        </div>
      )}

      {/* Modals */}
      <ApiDocsModal isOpen={isApiModalOpen} onClose={() => setIsApiModalOpen(false)} />
      <DecisionsModal isOpen={isDecisionsModalOpen} onClose={() => setIsDecisionsModalOpen(false)} />
    </div>
  );
}
