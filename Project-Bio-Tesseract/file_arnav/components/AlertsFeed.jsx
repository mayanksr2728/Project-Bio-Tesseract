'use strict';
'use client';

import React from 'react';

export default function AlertsFeed({ alerts, onAcknowledge }) {
  return (
    <div className="hud-panel" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.2rem' }}>⚠️</span>
          <h2 className="font-orbitron" style={{ fontSize: '1rem', color: '#fff' }}>
            MISSION ALARM & TELEMETRY LOG
          </h2>
        </div>
        <span className="cyber-badge cyber-badge-cyan font-mono">{alerts.length} EVENTS</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', flex: 1, maxHeight: '280px' }}>
        {alerts.map((alert) => {
          let badgeClass = 'cyber-badge-cyan';
          if (alert.severity === 'CRITICAL') badgeClass = 'cyber-badge-crimson';
          if (alert.severity === 'CAUTION') badgeClass = 'cyber-badge-amber';
          if (alert.severity === 'NOMINAL') badgeClass = 'cyber-badge-emerald';

          return (
            <div
              key={alert.id}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '6px',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className={`cyber-badge ${badgeClass}`}>{alert.severity}</span>
                <div>
                  <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 500 }}>{alert.title}</div>
                  <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    {alert.time} • {alert.subsystem}
                  </div>
                </div>
              </div>

              {!alert.acknowledged && onAcknowledge && (
                <button
                  onClick={() => onAcknowledge(alert.id)}
                  className="hud-btn"
                  style={{ padding: '3px 8px', fontSize: '0.65rem' }}
                >
                  ACK
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
