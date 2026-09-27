'use strict';
'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      background: 'rgba(5, 9, 20, 0.95)',
      borderTop: '1px solid rgba(0, 240, 255, 0.15)',
      padding: '10px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '0.75rem',
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-muted)',
      zIndex: 40
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span>TELEMETRY STREAM: <strong style={{ color: 'var(--hud-emerald)' }}>ENCRYPTED (AES-GCM-256)</strong></span>
        <span>•</span>
        <span>BUFFER PACKETS: <strong style={{ color: '#fff' }}>0 DROPPED (0.00%)</strong></span>
        <span>•</span>
        <span>FREQUENCY: <strong style={{ color: 'var(--hud-cyan)' }}>8.45 GHz (X-BAND)</strong></span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <span>DEEP SPACE NETWORK (DSN-GOLDSTONE-14)</span>
        <span className="cyber-badge cyber-badge-cyan">TESSERACT-CORE v4.2.0</span>
      </div>
    </footer>
  );
}
