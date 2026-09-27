'use strict';
'use client';

import React from 'react';

export default function LifeSupportGauges({
  suitPressure = 4.3, // psi (Standard NASA EMU is 4.3 psi pure O2)
  o2Primary = 94,
  o2Secondary = 100,
  co2Level = 0.18, // mmHg
  coreTemp = 37.1, // Celsius
  lcvgWaterTemp = 16.4, // Liquid Cooling Garment Celsius
  batteryHours = 6.4,
  radiationRate = 12.8 // uSv/h
}) {
  return (
    <div className="hud-panel" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.2rem' }}>🧑‍🚀</span>
          <h2 className="font-orbitron" style={{ fontSize: '1rem', color: '#fff' }}>
            EVA LIFE SUPPORT TELEMETRY (PLSS / EMU-X)
          </h2>
        </div>
        <span className="cyber-badge cyber-badge-emerald font-mono">PLSS NOMINAL</span>
      </div>

      {/* Grid of Gauges & Monitors */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '14px',
        flex: 1
      }}>
        {/* Gauge 1: Suit Internal Pressure */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(0, 240, 255, 0.15)',
          borderRadius: '8px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>SUIT PRESSURE (PURE O₂)</span>
            <span className="cyber-badge cyber-badge-cyan" style={{ fontSize: '0.62rem' }}>NOMINAL (4.3 PSI)</span>
          </div>
          <div style={{ margin: '8px 0' }}>
            <span className="font-orbitron glow-cyan" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--hud-cyan)' }}>
              {suitPressure.toFixed(1)}
            </span>
            <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '6px' }}>psi (29.6 kPa)</span>
          </div>
          <div className="telemetry-bar-bg">
            <div className="telemetry-bar-fill" style={{ width: `${(suitPressure / 5.0) * 100}%`, background: 'var(--hud-cyan)' }}></div>
          </div>
        </div>

        {/* Gauge 2: Core Body Temperature */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(0, 255, 136, 0.15)',
          borderRadius: '8px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>CORE BODY TEMPERATURE</span>
            <span className="cyber-badge cyber-badge-emerald" style={{ fontSize: '0.62rem' }}>HOMEOSTATIC</span>
          </div>
          <div style={{ margin: '8px 0' }}>
            <span className="font-orbitron glow-emerald" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--hud-emerald)' }}>
              {coreTemp.toFixed(1)}
            </span>
            <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '6px' }}>°C (98.8 °F)</span>
          </div>
          <div className="telemetry-bar-bg">
            <div className="telemetry-bar-fill" style={{ width: `${((coreTemp - 35) / 5) * 100}%`, background: 'var(--hud-emerald)' }}></div>
          </div>
        </div>

        {/* Gauge 3: Primary & Secondary O2 Tanks */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>O₂ HIGH-PRESSURE TANKS</span>
            <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--hud-cyan)' }}>6.1 hrs EVA Left</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', margin: '8px 0' }}>
            <div>
              <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>PRIMARY TANK</div>
              <div className="font-orbitron" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{o2Primary}%</div>
            </div>
            <div>
              <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>RESERVE SOP TANK</div>
              <div className="font-orbitron" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--hud-emerald)' }}>{o2Secondary}%</div>
            </div>
          </div>
          <div className="telemetry-bar-bg">
            <div className="telemetry-bar-fill" style={{ width: `${o2Primary}%`, background: 'var(--hud-cyan)' }}></div>
          </div>
        </div>

        {/* Gauge 4: CO2 Scrubber & LCVG Loop */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>CO₂ SCRUBBER (LiOH / METOX)</span>
            <span className="cyber-badge cyber-badge-emerald" style={{ fontSize: '0.62rem' }}>0.18 mmHg</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', margin: '8px 0' }}>
            <div>
              <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>LCVG COOLANT TEMP</div>
              <div className="font-orbitron" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--hud-cyan)' }}>{lcvgWaterTemp}°C</div>
            </div>
            <div>
              <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>POWER CELL RESERVE</div>
              <div className="font-orbitron" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{batteryHours} hrs</div>
            </div>
          </div>
          <div className="telemetry-bar-bg">
            <div className="telemetry-bar-fill" style={{ width: '82%', background: 'var(--hud-violet)' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
