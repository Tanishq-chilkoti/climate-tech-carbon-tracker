# 📝 DECISIONS.md — Decision Points & Rationale

This document details the architectural choices and UX design decisions made for the three core Decision Points in the **Climate Tech Carbon Footprint Tracker** brief.

---

## Decision Point 1: The Nudge (Weekly Target Exceeded)

### Choice
**Empathetic Warning & Actionable Micro-Encouragement Banner (Warn + Encourage)**

### Rationale (2–4 Sentences)
When a user crosses their weekly CO₂ target, shaming or hard-blocking their account discourages honest logging and leads to user drop-off. Instead, our app triggers a high-visibility amber/rose notification banner that clearly warns the user of the target breach while providing 3 actionable, high-impact suggestions (e.g., swapping two non-veg meals for plant-based meals to save 3.0 kg CO₂). This positive reinforcement keeps users engaged, maintains log integrity, and empowers immediate behavioral adjustments.

---

## Decision Point 2: Absurd Input Handling

### Choice
**Soft Threshold Check with Interactive Confirmation Modal (Warn & Verify)**

### Rationale (2–4 Sentences)
Obviously wrong inputs, such as a 500,000 km car trip or 50,000 kWh electricity entry, are usually accidental fat-finger typos that severely distort analytics and weekly target calculations. When an entry exceeds established domain safety limits (e.g. >1,000 km for car travel or >10,000 km for flights), the app halts submission and presents a verification dialog displaying the input alongside typical averages. Users can easily correct typos with one click or explicitly confirm edge-case entries, striking a balance between data quality and user intent.

---

## Decision Point 3: The Week & Mid-Week Progress

### Choice
**ISO Calendar Week (Monday 00:00 start) with Dynamic Pacing Burn-Rate Calculation**

### Rationale (2–4 Sentences)
We define a week starting on Monday at 00:00 to align with standard global weekly routines and work schedules. To make mid-week progress meaningful, the app compares the percentage of weekly budget consumed against the percentage of time elapsed in the current week (e.g., Day 3 elapsed = 43% time budget). If CO₂ consumption outpaces time elapsed, the dashboard flags a "High Burn Rate" pacing badge, providing early warning days before the target is actually crossed.
