'use strict';
'use client';

import React, { useState } from 'react';

export default function AiMedicalAdvisor({ astronautName = 'Cmdr. Sarah Vance', heartRate = 72, stress = 18 }) {
  const [activeProtocol, setActiveProtocol] = useState(null);
  const [simulatingDiagnosis, setSimulatingDiagnosis] = useState(false);

  const runDiagnosticScan = () => {
    setSimulatingDiagnosis(true);
    setTimeout(() => {
      setSimulatingDiagnosis(false);
    }, 1200);
  };

  return (
    <div className="hud-panel" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.2rem' }}>🧠</span>
          <h2 className="font-orbitron" style={{ fontSize: '1rem', color: '#fff' }}>
            AI BIO-DIAGNOSTIC ADVISOR
          </h2>
        </div>
        <button
          onClick={runDiagnosticScan}
          disabled={simulatingDiagnosis}
          className="hud-btn hud-btn-emerald"
          style={{ padding: '4px 10px', fontSize: '0.68rem' }}
        >
          {simulatingDiagnosis ? '🔄 SCANNING SENSORS...' : '⚡ RUN NEURAL SCAN'}
        </button>
      </div>

      {/* Main Diagnostic Card */}
      <div style={{
        background: 'rgba(0, 240, 255, 0.04)',
        border: '1px solid rgba(0, 240, 255, 0.2)',
        borderRadius: '8px',
        padding: '14px',
        marginBottom: '14px',
        flex: 1
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span className="font-orbitron" style={{ fontSize: '0.85rem', color: 'var(--hud-cyan)' }}>
            BIO-ASSESSMENT FOR {astronautName.toUpperCase()}
          </span>
          <span className="cyber-badge cyber-badge-emerald">STABLE CLASSIFICATION</span>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '12px' }}>
          {simulatingDiagnosis ? (
            <span style={{ color: 'var(--hud-cyan)' }}>Synthesizing real-time telemetry from PPG, Galvanic Skin Response (GSR), Core Temp, and Suit Atmospheric sensors...</span>
          ) : (
            `All autonomic nervous system markers indicate optimal physiological adaptation to microgravity. Cardiac output and hemodynamic stability remain within acceptable EVA mission thresholds.`
          )}
        </p>

        {/* Risk Indexes Matrix */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>DECOMPRESSION SICKNESS RISK</div>
            <div className="font-orbitron" style={{ fontSize: '1rem', color: 'var(--hud-emerald)', fontWeight: 700 }}>
              0.02% <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>[LOW]</span>
            </div>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>ACUTE HYPOXIA RISK</div>
            <div className="font-orbitron" style={{ fontSize: '1rem', color: 'var(--hud-emerald)', fontWeight: 700 }}>
              0.00% <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>[NIL]</span>
            </div>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>COGNITIVE WORKLOAD LOAD</div>
            <div className="font-orbitron" style={{ fontSize: '1rem', color: stress > 40 ? 'var(--hud-amber)' : 'var(--hud-cyan)', fontWeight: 700 }}>
              {stress}% <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>[NORMAL]</span>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Actions & Protocols */}
      <div>
        <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          RECOMMENDED PROTOCOLS & MEDICAL COUNTERMEASURES
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveProtocol('hydration')}
            className={`hud-btn ${activeProtocol === 'hydration' ? 'hud-btn-emerald' : ''}`}
            style={{ padding: '6px 10px', fontSize: '0.68rem' }}
          >
            💧 HYDRATION PACK DISPENSE
          </button>
          <button
            onClick={() => setActiveProtocol('thermal')}
            className={`hud-btn ${activeProtocol === 'thermal' ? 'hud-btn-emerald' : ''}`}
            style={{ padding: '6px 10px', fontSize: '0.68rem' }}
          >
            ❄️ LCVG TEMP REGULATE (+0.5°C)
          </button>
          <button
            onClick={() => setActiveProtocol('oxygen')}
            className={`hud-btn ${activeProtocol === 'oxygen' ? 'hud-btn-emerald' : ''}`}
            style={{ padding: '6px 10px', fontSize: '0.68rem' }}
          >
            💨 100% PRE-BREATHE FLUSH
          </button>
        </div>

        {activeProtocol && (
          <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.3)', borderRadius: '6px', fontSize: '0.78rem', color: '#fff' }}>
            ✓ Protocol <strong>{activeProtocol.toUpperCase()}</strong> command transmitted to EMU-X Life Support Controller.
          </div>
        )}
      </div>
    </div>
  );
}
