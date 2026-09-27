'use strict';
'use client';

import React from 'react';

export default function CrewRoster({ crewMembers, activeId, onSelect }) {
  return (
    <div className="hud-panel" style={{ padding: '20px', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.2rem' }}>👥</span>
          <h2 className="font-orbitron" style={{ fontSize: '1rem', color: '#fff' }}>
            CREW SQUAD BIOMETRIC ROSTER
          </h2>
        </div>
        <span className="cyber-badge cyber-badge-cyan font-mono">4 CREW ACTIVE</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
        {crewMembers.map((member) => {
          const isSelected = member.id === activeId;
          return (
            <div
              key={member.id}
              onClick={() => onSelect(member.id)}
              style={{
                background: isSelected ? 'rgba(0, 240, 255, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                border: isSelected ? '1px solid var(--hud-cyan)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div className="font-orbitron" style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
                  {member.name}
                </div>
                <span className={`status-dot ${member.status === 'Nominal' ? 'nominal' : 'warning'}`}></span>
              </div>

              <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--hud-cyan)', marginBottom: '10px' }}>
                {member.role}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.75rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>HR: </span>
                  <strong style={{ color: '#fff' }}>{member.hr} BPM</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>SpO₂: </span>
                  <strong style={{ color: 'var(--hud-emerald)' }}>{member.spo2}%</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Suit P: </span>
                  <strong style={{ color: 'var(--hud-cyan)' }}>{member.suitP} psi</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>O₂ Level: </span>
                  <strong style={{ color: '#fff' }}>{member.o2}%</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
