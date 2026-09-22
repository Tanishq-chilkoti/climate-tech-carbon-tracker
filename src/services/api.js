// API service layer for Carbon Footprint Tracker REST endpoints

const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchSummary() {
  const res = await fetch(`${API_BASE}/summary`);
  if (!res.ok) throw new Error('Failed to fetch summary metrics');
  return res.json();
}

export async function fetchActivities(filters = {}) {
  const params = new URLSearchParams();
  if (filters.type && filters.type !== 'all') params.append('type', filters.type);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.search) params.append('search', filters.search);

  const url = `${API_BASE}/activities?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch activities');
  return res.json();
}

export async function logActivity(activityData) {
  const res = await fetch(`${API_BASE}/activities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(activityData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to log activity');
  return data;
}

export async function deleteActivity(id) {
  const res = await fetch(`${API_BASE}/activities/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete activity');
  return data;
}

export async function fetchWeeklyTarget() {
  const res = await fetch(`${API_BASE}/target`);
  if (!res.ok) throw new Error('Failed to fetch target');
  return res.json();
}

export async function updateWeeklyTarget(weeklyTarget) {
  const res = await fetch(`${API_BASE}/target`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ weeklyTarget })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update target');
  return data;
}

export async function fetchDecisions() {
  const res = await fetch(`${API_BASE}/decisions`);
  if (!res.ok) throw new Error('Failed to fetch decision points');
  return res.json();
}

export async function resetDemoData() {
  const res = await fetch(`${API_BASE}/reset`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset dataset');
  return res.json();
}
