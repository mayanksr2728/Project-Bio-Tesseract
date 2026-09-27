# Astronaut Health & Environmental Monitoring Application

A minimal, clean, 3-page astronaut physiological and environmental monitoring web application directly connected to a real Turso database.

---

## 3-Page Architecture

1. **Page 1: Home**
   - Clean astronaut welcome and greeting.
   - Front-facing anatomical human body visualization with major organs (Brain, Heart, Lungs, Liver, Kidneys, Stomach).
   - Real-time physiological status indicators driven by live Turso telemetry (Neutral state when no data exists).
   - Navigation to Astronaut Vitals and Environmental Factors.

2. **Page 2: Astronaut Vitals**
   - Vitals: **Heart Rate** (`bpm`) and **Breathing Rate** (`breaths/min`).
   - Dynamic status circles (`●`) directly beside parameter names:
     - **Green**: Normal
     - **Yellow**: Warning (Low or High)
     - **Red**: Critical (Low or High)
     - **Neutral/Gray**: No data available
   - Time-series chart areas that remain completely empty when no data is recorded.

3. **Page 3: Environmental Factors**
   - Atmospheric, toxicological, and habitat parameters (28 parameters listed with exact standard units).
   - Every parameter displays an empty state (`No data available`) until real data is written to Turso.

---

## Extensible Parameters & Thresholds

All organs, parameters, units, and 5-tier evaluation thresholds (`LOW CRITICAL`, `LOW WARNING`, `NORMAL`, `HIGH WARNING`, `HIGH CRITICAL`) are configured in `parameters.mjs`.

New vitals (e.g., SpO₂, HRV, Core Temp) can be added to `parameters.mjs` and will automatically link to the UI, status circles, organ mappings, and database queries without modifying any other files.

---

## Running the Application

### Prerequisites
- Node.js (v18+)

### Quick Start
```bash
# Start the server
node server.mjs
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Database Configuration

Credentials are configured in `.env`:
```env
PORT=3000
TURSO_DATABASE_URL=https://bio-arnav-mukherji.aws-ap-south-1.turso.io
TURSO_AUTH_TOKEN=<your_turso_token>
```

---

## Telemetry Ingestion API

To record real telemetry points into the Turso database:
```http
POST /api/telemetry
Content-Type: application/json

{
  "parameter_id": "heart_rate",
  "value": 72.0,
  "unit": "bpm"
}
```
