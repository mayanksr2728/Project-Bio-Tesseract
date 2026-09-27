# 💠 Project Bio-Tesseract
### Deep Space Astronaut Bio-Telemetry & 4D Bio-Resonance Mission Monitor

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Status](https://img.shields.io/badge/EVA--OPS-Nominal-00ff88?style=flat)]()

**Project Bio-Tesseract** is a next-generation real-time astronaut bio-telemetry, EVA life support monitoring, and 4D geometric hypercube bio-resonance visualization platform engineered for deep space missions (e.g. Artemis, Mars surface excursions, and orbital microgravity operations).

---

## 🌟 Key Subsystems & Features

### 1. 💠 4D Bio-Tesseract Hypercube Resonator
- **$SO(4)$ Rotation Matrix Projection**: Real-time canvas projection of 16 vertices and 32 hyper-edges across $XW$, $ZW$, $XY$, and $YZ$ 4D rotation planes.
- **Biometric Frequency Coupling**: The tesseract's vertex pulse and node luminescence couple directly to the active astronaut's instantaneous heart rate ($\text{BPM}$) and metabolic stress index.
- **Stereographic & Orthographic Projection Modes**: Toggle between 4-dimensional stereographic depth hyperspace and orthographic projections.

### 2. 🫀 Multi-Lead Electrocardiogram (ECG) & PPG Telemetry
- **Oscilloscope Sweep Display**: Real-time rendering of P-Q-R-S-T cardiac depolarization waveforms with configurable 25 mm/s sweep rate.
- **Biometric Vitals Stream**: Heart Rate ($\text{BPM}$), Oxygen Saturation ($\text{SpO}_2\%$), Non-Invasive Blood Pressure ($\text{NIBP}$), and Respiration Rate ($\text{BrPM}$).
- **Anomaly Detection Mode**: Interactive tachycardia, arrhythmia, and elevated stress simulations.

### 3. 🧑‍🚀 Extravehicular Mobility Unit (EMU-X) Life Support Telemetry
- **Atmospheric & Pressure Regulation**: 4.3 psi pure $O_2$ EVA suit pressure monitoring (29.6 kPa) with cabin relative delta.
- **Thermal & Fluid Loop**: Liquid Cooling and Ventilation Garment (LCVG) coolant temperature and core body thermoregulation.
- **Consumable Reserves**: High-pressure Primary & Secondary $O_2$ tank volumes, Lithium Hydroxide ($\text{LiOH}$) $\text{CO}_2$ scrubber saturation, and suit battery endurance hours.

### 4. 🧠 Autonomous AI Bio-Diagnostic Co-Pilot
- **Autonomous Risk Indexing**: Real-time calculation of acute hypoxia risk and Decompression Sickness ($\text{DCS}$) likelihood.
- **Automated Medical Protocols**: Remote execution of hydration pack dispensing, thermal loop adjustments, and $100\%$ pre-breathe flush sequences.

### 5. 👥 4-Member Crew Squad Telemetry Roster
- Simultaneous multi-astronaut health matrices covering the Mission Commander (EVA-1), Medical Specialist (EVA-2), Flight Engineer (Airlock Lead), and Command Pilot.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- `npm` or `yarn`

### Installation & Launch

1. Navigate to the project directory:
   ```bash
   cd projectdb
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 📂 Project Architecture

```
Project-Bio-Tesseract/
├── README.md                          # Main project architecture & documentation
└── projectdb/
    ├── package.json                   # Project dependencies and run scripts
    ├── next.config.js                 # Next.js optimization configuration
    ├── app/
    │   ├── layout.js                  # Root Layout & metadata
    │   ├── global.css                 # Futuristic Cyberpunk/Sci-Fi HUD Design System
    │   ├── page.js                    # Primary Mission Bio-Tesseract Command Center
    │   └── dashboard/
    │       └── page.js                # Dedicated multi-screen telemetry cockpit
    └── components/
        ├── Navbar.jsx                 # Mission Elapsed Time (MET), DSN Comms & Actions
        ├── Sidebar.jsx                # Vital gauges, route switcher & crew quick overview
        ├── Footer.jsx                 # Quantum telemetry encryption & link latency
        ├── TesseractViewer.jsx        # 4D Hypercube bio-resonance canvas visualizer
        ├── LiveEcgChart.jsx           # Real-time multi-lead ECG & PPG heart monitor
        ├── LifeSupportGauges.jsx      # EMU-X suit pressure, O2 & thermal diagnostics
        ├── AiMedicalAdvisor.jsx       # Autonomous neural medical advisor & countermeasures
        ├── CrewRoster.jsx             # 4-astronaut squad status & vitals matrix
        └── AlertsFeed.jsx             # Mission alarms and alert acknowledgement center
```

---

## 🛰️ Mission Systems & Telemetry Specs

| Subsystem | Metric | Nominal Range |
| :--- | :--- | :--- |
| **Suit Internal Pressure** | $4.3 \text{ psi}$ ($29.6 \text{ kPa}$) | $4.1 - 4.5 \text{ psi}$ |
| **Oxygen Partial Pressure** | $99.2\% \pm 0.5\%$ | $\ge 95\%$ |
| **Core Body Temp** | $37.1^\circ\text{C}$ ($98.8^\circ\text{F}$) | $36.5 - 37.5^\circ\text{C}$ |
| **Cardiac Heart Rate** | $60 - 90 \text{ BPM}$ | $50 - 110 \text{ BPM}$ |
| **Radiation Exposure Rate** | $12.8 \ \mu\text{Sv/h}$ | $\le 50 \ \mu\text{Sv/h}$ |
| **DSN Quantum Comms** | $8.45\text{ GHz (X-Band)}$ | Active Lock |

---

*Project Bio-Tesseract • Space Bio-Telemetry Systems*