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
import { 
  fetchSummary, 
  fetchActivities, 
  logActivity, 
  deleteActivity, 
  updateWeeklyTarget, 
  resetDemoData 
} from './services/api';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function App() {
  const [summary, setSummary] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toastMessage, setToastMessage] = useState('');

  // Modals state
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isDecisionsModalOpen, setIsDecisionsModalOpen] = useState(false);

  // Load state from backend API
  const loadData = async () => {
    try {
      const [sumRes, actRes] = await Promise.all([
        fetchSummary(),
        fetchActivities()
      ]);
      if (sumRes.success) setSummary(sumRes.summary);
      if (actRes.success) setActivities(actRes.data);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleLogActivity = async (data) => {
    const res = await logActivity(data);
    if (res.success) {
      showToast(`Logged ${data.type} (${data.quantity}) — +${res.data.co2_kg} kg CO₂`);
      await loadData();
    }
  };

  const handleQuickLog = async (preset) => {
    try {
      await handleLogActivity({
        type: preset.type,
        quantity: preset.quantity,
        date: new Date().toISOString().split('T')[0],
        notes: preset.notes
      });
    } catch (err) {
      alert(err.message || 'Failed to log preset');
    }
  };

  const handleDeleteActivity = async (id) => {
    const res = await deleteActivity(id);
    if (res.success) {
      showToast('Activity record deleted');
      await loadData();
    }
  };

  const handleUpdateTarget = async (newTarget) => {
    const res = await updateWeeklyTarget(newTarget);
    if (res.success) {
      showToast(`Weekly target updated to ${newTarget} kg CO₂`);
      await loadData();
    }
  };

  const handleResetData = async () => {
    if (confirm('Reset to default demo activities dataset?')) {
      const res = await resetDemoData();
      if (res.success) {
        showToast('Dataset reset to default state');
        await loadData();
      }
    }
  };

  // CSV Export feature
  const handleExportCSV = () => {
    if (activities.length === 0) {
      alert('No activities to export');
      return;
    }

    const headers = ['ID', 'Type', 'Quantity', 'CO2_kg', 'Date', 'Notes'];
    const rows = activities.map(a => [
      a.id,
      `"${a.type}"`,
      a.quantity,
      a.co2_kg,
      a.date,
      `"${a.notes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `carbon_footprint_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported activity logs to CSV');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-spin">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Loading Climate Tracker Engine...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-16">
      
      {/* Top Header Navigation */}
      <Header
        totalCO2={summary ? summary.totalCO2 : 0}
        weeklyCO2={summary ? summary.weeklyCO2 : 0}
        weeklyTarget={summary ? summary.weeklyTarget : 50}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenApiDocs={() => setIsApiModalOpen(true)}
        onOpenDecisions={() => setIsDecisionsModalOpen(true)}
        onResetData={handleResetData}
        onExportCSV={handleExportCSV}
      />

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8 flex-1 w-full">
        
        {/* Quick Log Presets Bar */}
        <QuickLogPresets onQuickLog={handleQuickLog} />

        {/* Tab 1: Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <WeeklyTarget summary={summary} onUpdateTarget={handleUpdateTarget} />
            <AiEcoCoach summary={summary} activities={activities} />
            <Dashboard summary={summary} activities={activities} />
          </div>
        )}

        {/* Tab 2: Activity Logger */}
        {activeTab === 'logger' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <ActivityForm onLogActivity={handleLogActivity} />
            </div>
            <div className="lg:col-span-5 space-y-6">
              <WeeklyTarget summary={summary} onUpdateTarget={handleUpdateTarget} />
              <AiEcoCoach summary={summary} activities={activities} />
            </div>
          </div>
        )}

        {/* Tab 3: History */}
        {activeTab === 'history' && (
          <ActivityHistory activities={activities} onDeleteActivity={handleDeleteActivity} />
        )}

        {/* Tab 4: Route Calculator */}
        {activeTab === 'routes' && (
          <TransportCalculator onLogActivity={handleLogActivity} />
        )}

        {/* Tab 5: Appliance Power */}
        {activeTab === 'power' && (
          <ApplianceEstimator onLogActivity={handleLogActivity} />
        )}

        {/* Tab 6: Meal Planner */}
        {activeTab === 'meals' && (
          <MealPlanner onLogActivity={handleLogActivity} />
        )}

        {/* Tab 7: AI Coach */}
        {activeTab === 'coach' && (
          <div className="space-y-6">
            <AiEcoCoach summary={summary} activities={activities} />
            <CarbonSimulator />
          </div>
        )}

        {/* Tab 8: Badges & Benchmarks */}
        {activeTab === 'benchmarks' && (
          <div className="space-y-8">
            <CountryBenchmark totalCO2={summary ? summary.totalCO2 : 0} totalLogs={activities.length} />
            <EcoBadges summary={summary} activities={activities} />
            <CarbonSimulator />
          </div>
        )}

      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 glass-panel px-4 py-3 rounded-xl border border-emerald-500/40 shadow-2xl shadow-emerald-500/20 text-xs font-bold text-emerald-300 flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <ApiDocsModal isOpen={isApiModalOpen} onClose={() => setIsApiModalOpen(false)} />
      <DecisionsModal isOpen={isDecisionsModalOpen} onClose={() => setIsDecisionsModalOpen(false)} />

    </div>
  );
}
