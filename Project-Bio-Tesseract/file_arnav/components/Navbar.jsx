'use strict';
'use client';

import React, { useState, useEffect } from 'react';

export default function Navbar({ activeAstronaut, onSelectAstronaut, isAlarmActive, onToggleAlarm }) {
  const [currentTime, setCurrentTime] = useState('');
  const [metTime, setMetTime] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().slice(17, 25) + ' UTC');

      // MET (Mission Elapsed Time) Day 42, 14:28:09
      const baseSec = Math.floor((Date.now() / 1000) % 86400);
      const hrs = String(Math.floor(baseSec / 3600)).padStart(2, '0');
      const mins = String(Math.floor((baseSec % 3600) / 60)).padStart(2, '0');
      const secs = String(baseSec % 60).padStart(2, '0');
      setMetTime(`MET +042:${hrs}:${mins}:${secs}`);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header style={{
      background: 'rgba(7, 12, 24, 0.9)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(0, 240, 255, 0.25)',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Brand & Mission Identifier */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '8px',
          background: 'radial-gradient(circle, #00f0ff 0%, #050b1a 80%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)',
          border: '1px solid #00f0ff'
        }}>
          {/* Tesseract 4D Icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="#00f0ff" />
            <rect x="7" y="7" width="10" height="10" stroke="#00ff88" />
            <line x1="3" y1="3" x2="7" y2="7" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="21" y1="3" x2="17" y2="7" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="3" y1="21" x2="7" y2="17" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="21" y1="21" x2="17" y2="17" stroke="#ffffff" strokeWidth="1.5" />
          </svg>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 className="font-orbitron" style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', letterSpacing: '0.12em' }}>
              PROJECT <span style={{ color: 'var(--hud-cyan)' }}>BIO-TESSERACT</span>
            </h1>
            <span className="cyber-badge cyber-badge-cyan">EVA-OPS v4.2</span>
          </div>
          <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            DEEP SPACE EVA TELEMETRY & BIO-RESONANCE MONITOR
          </div>
        </div>
      </div>

      {/* Center Mission Clocks & Orbit Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          background: 'rgba(0, 240, 255, 0.05)',
          border: '1px solid rgba(0, 240, 255, 0.2)',
          padding: '6px 14px',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>MISSION CLOCK</div>
          <div className="font-orbitron glow-cyan" style={{ fontSize: '0.9rem', color: 'var(--hud-cyan)', fontWeight: 700 }}>
            {metTime || 'MET +042:00:00:00'}
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          padding: '6px 14px',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>ORBITAL SPEED</div>
          <div className="font-mono" style={{ fontSize: '0.9rem', color: 'var(--hud-emerald)', fontWeight: 600 }}>
            27,580 km/h <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>[ISS-GEO]</span>
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          padding: '6px 14px',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>COMM LINK DSN</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
            <span className="status-dot nominal"></span>
            <span className="font-mono" style={{ fontSize: '0.85rem', color: '#fff' }}>99.8% Q-LOCKED</span>
          </div>
        </div>
      </div>

      {/* Actions & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Crew Switcher */}
        <select 
          value={activeAstronaut?.id || 'AST-01'}
          onChange={(e) => onSelectAstronaut && onSelectAstronaut(e.target.value)}
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            color: 'var(--hud-cyan)',
            border: '1px solid var(--border-cyan)',
            borderRadius: '6px',
            padding: '7px 12px',
            fontFamily: 'var(--font-hud)',
            fontSize: '0.75rem',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="AST-01">Cmdr. Sarah Vance (EVA-1 Lead)</option>
          <option value="AST-02">Dr. Marcus Chen (EVA-2 Bio-Spec)</option>
          <option value="AST-03">Eng. Elena Rostova (Airlock Lead)</option>
          <option value="AST-04">Pilot David Kalu (Command Hub)</option>
        </select>

        {/* Audio HUD Blip Toggle */}
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="hud-btn"
          style={{ padding: '6px 10px', fontSize: '0.72rem' }}
          title="Toggle telemetry synth tone"
        >
          <span>{soundEnabled ? '🔊 HUD AUDIO' : '🔇 MUTED'}</span>
        </button>

        {/* Emergency Alert Toggle */}
        <button 
          onClick={onToggleAlarm}
          className={`hud-btn ${isAlarmActive ? 'hud-btn-danger' : 'hud-btn'}`}
          style={{ padding: '6px 12px', fontSize: '0.72rem' }}
        >
          <span>{isAlarmActive ? '⚠️ ALARM ACTIVE' : '🚨 SIM ANOMALY'}</span>
        </button>
      </div>
    </header>
  );
}
