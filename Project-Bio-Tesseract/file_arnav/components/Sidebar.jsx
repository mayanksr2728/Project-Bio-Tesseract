'use strict';
'use client';

import React from 'react';

export default function Sidebar({ activeTab, onTabChange, activeAstronaut }) {
  const navItems = [
    { id: 'overview', label: 'Mission Overview', icon: '🌐', badge: 'LIVE' },
    { id: 'tesseract', label: '4D Bio-Tesseract', icon: '💠', badge: 'HYPER' },
    { id: 'ecg', label: 'Cardio & Vitals ECG', icon: '🫀', badge: 'REALTIME' },
    { id: 'lifesupport', label: 'EVA Suit Life Support', icon: '🧑‍🚀', badge: 'EMU-X' },
    { id: 'ai-doc', label: 'AI Bio-Diagnostic Doc', icon: '🧠', badge: 'NEURAL' },
    { id: 'crew', label: 'Crew Squad Roster', icon: '👥', badge: '4/4' }
  ];

  return (
    <aside style={{
      width: '280px',
      background: 'rgba(8, 14, 28, 0.9)',
      backdropFilter: 'blur(16px)',
      borderRight: '1px solid rgba(0, 240, 255, 0.2)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '20px 16px',
      minHeight: 'calc(100vh - 65px)'
    }}>
      <div>
        {/* Active Astronaut Profile Card */}
        <div className="hud-panel" style={{ padding: '14px', marginBottom: '20px', background: 'rgba(12, 22, 42, 0.8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00f0ff 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#000',
              fontFamily: 'var(--font-hud)',
              fontSize: '1rem',
              boxShadow: '0 0 12px rgba(0, 240, 255, 0.4)'
            }}>
              {activeAstronaut?.initials || 'SV'}
            </div>
            <div>
              <div className="font-orbitron" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                {activeAstronaut?.name || 'Cmdr. Sarah Vance'}
              </div>
              <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--hud-cyan)' }}>
                {activeAstronaut?.role || 'Mission Commander (EVA-1)'}
              </div>
            </div>
          </div>

          {/* Quick Vital Metric Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '3px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Suit O₂ Reserve</span>
                <span className="font-mono" style={{ color: 'var(--hud-emerald)' }}>94.2%</span>
              </div>
              <div className="telemetry-bar-bg">
                <div className="telemetry-bar-fill" style={{ width: '94.2%', background: 'var(--hud-emerald)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '3px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>EMU Suit Battery</span>
                <span className="font-mono" style={{ color: 'var(--hud-cyan)' }}>88.5% (6.2h)</span>
              </div>
              <div className="telemetry-bar-bg">
                <div className="telemetry-bar-fill" style={{ width: '88.5%', background: 'var(--hud-cyan)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '3px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Radiation Flux</span>
                <span className="font-mono" style={{ color: 'var(--hud-amber)' }}>14.2 µSv/h</span>
              </div>
              <div className="telemetry-bar-bg">
                <div className="telemetry-bar-fill" style={{ width: '28%', background: 'var(--hud-amber)' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '8px', paddingLeft: '6px' }}>
          NAVIGATION CHANNELS
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: isActive ? '1px solid var(--hud-cyan)' : '1px solid transparent',
                  background: isActive ? 'rgba(0, 240, 255, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                  <span className="font-orbitron" style={{ fontSize: '0.78rem', fontWeight: isActive ? 700 : 500 }}>
                    {item.label}
                  </span>
                </div>
                <span className={`cyber-badge ${isActive ? 'cyber-badge-cyan' : 'cyber-badge-emerald'}`} style={{ fontSize: '0.62rem' }}>
                  {item.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Ground Control Telemetry Uplink Box */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '8px',
        padding: '12px',
        marginTop: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>HOUSTON / DSN SYNC</span>
          <span className="status-dot nominal"></span>
        </div>
        <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--hud-emerald)' }}>
          QUANTUM SYNCED
        </div>
        <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          LATENCY: 1.18s | SNR: 44.2 dB
        </div>
      </div>
    </aside>
  );
}
