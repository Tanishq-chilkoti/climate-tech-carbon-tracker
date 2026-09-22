# 🌿 Climate Tech: Carbon Footprint Tracker

**Track:** CLIMATE TECH  
**Hackathon ID:** `CT-2026-TRACKER`  
**Live Production URL:** [https://climate-tech-carbon-tracker.vercel.app](https://climate-tech-carbon-tracker.vercel.app)  

---

## 📌 Overview

**Carbon Footprint Tracker** is an intuitive, real-time web application that transforms everyday transport, energy, and dietary choices into transparent carbon impact metrics. Designed for high usability and automated grading, it features zero-friction access (no authentication required), standard REST API endpoints, live pacing indicators, intelligent nudge banners, and smart validation for abnormal entries.

---

## ✨ Required Features Implemented

1. **Log an Activity**:
   - Record activity by type and quantity (e.g., Car travel in km, Electricity in kWh, Veg meals in servings).
   - Instant CO₂ emission feedback before submission.

2. **CO₂ Emission Calculation Engine**:
   - 🚗 **Car Travel**: `0.20 kg CO₂ / km`
   - 🚌 **Bus Travel**: `0.08 kg CO₂ / km`
   - ✈️ **Flight**: `0.25 kg CO₂ / km`
   - ⚡ **Electricity**: `0.80 kg CO₂ / kWh`
   - 🥗 **Vegetarian Meal**: `0.50 kg CO₂ / meal`
   - 🥩 **Non-Vegetarian Meal**: `2.00 kg CO₂ / meal`

3. **Interactive Dashboard**:
   - Total CO₂ footprint statistics & weekly activity breakdown.
   - Category distribution Donut chart & Daily trend Bar chart.
   - Real-world environmental impact equivalencies (trees needed to offset, smartphone charges, driving miles avoided).

4. **Weekly Target & Pacing System**:
   - User-configurable weekly CO₂ target (default: 50.0 kg).
   - Visual progress gauge with status alerts (Green < 75%, Amber 75–99%, Red ≥ 100%).
   - Dynamic mid-week pacing rate calculation (**ISO Monday start**).
   - Automated **DP1 Nudge Banner** with actionable emission-reduction tips upon target breach.

5. **History & Advanced Filter**:
   - Tabular and card view of logged activities with date, category badge, quantity, and computed CO₂.
   - Multi-criteria filtering by category type and date range (Today, This Week, This Month, All).
   - Real-time search bar & sorting options (Newest, Oldest, Highest CO₂, Lowest CO₂).
   - One-click activity deletion & batch data reset.

---

## 🛠️ Decision Points (DECISIONS.md Summary)

- **DP1 · The Nudge (Target Exceeded)**: **Empathetic Warning & Actionable Micro-Encouragement**. When target is crossed, app presents a high-visibility warning banner with 3 practical reduction recommendations without blocking activity logging.
- **DP2 · Absurd Input**: **Soft Threshold Alert with Double-Confirmation Dialog**. Single-log entries exceeding safety thresholds (e.g. >1,000 km car) trigger a verification prompt to prevent accidental typos.
- **DP3 · The Week**: **ISO Week starting Monday 00:00 with Mid-Week Pacing Indicator**. Calculates current day progress against total week allowance to notify user of high burn rate early in the week.

---

## 🔌 Standard REST API Reference

The application exposes a standard REST API at `/api` for automated test scripts and browser grading agents:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/activities` | Query logged activities. Supports `?type=car`, `?startDate=YYYY-MM-DD`, `?endDate=YYYY-MM-DD`. |
| `POST` | `/api/activities` | Log a new activity. Body: `{ "type": "car", "quantity": 15, "date": "2026-09-22", "notes": "Commute" }` |
| `DELETE` | `/api/activities/:id` | Remove activity by ID. |
| `GET` | `/api/target` | Retrieve weekly CO₂ target. |
| `POST` | `/api/target` | Set weekly CO₂ target. Body: `{ "weeklyTarget": 45.0 }` |
| `GET` | `/api/summary` | Get aggregated dashboard metrics (total CO₂, weekly CO₂, category breakdown, target status, nudge status). |
| `GET` | `/api/decisions` | Fetch Decision Point configurations and rationales. |
| `GET` | `/api/health` | Health check endpoint returning `{ "status": "ok", "track": "CLIMATE TECH" }`. |

---

## 🚀 Quick Start Guide

### Live URL
Open [https://climate-tech-carbon-tracker.vercel.app](https://climate-tech-carbon-tracker.vercel.app) in any browser.

### Local Development
```bash
git clone <your-repo-url>
cd projectsss
npm install
npm run dev
```

---

## 🧪 Test Credentials & Grading Notes
- **No Authentication Required**: Direct access to all features on page load.
- **Pre-populated Demo Data**: Loaded automatically on fresh start to display rich charts and historical trends immediately.
- **Reset Option**: Click "Reset Demo Data" in the top bar to restore default state anytime.
