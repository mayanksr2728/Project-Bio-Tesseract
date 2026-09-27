'use strict';
'use client';

import React, { useRef, useEffect, useState } from 'react';

export default function LiveEcgChart({ heartRate = 72, spO2 = 98.4, bpSys = 118, bpDia = 76, respRate = 15 }) {
  const canvasRef = useRef(null);
  const [leadMode, setLeadMode] = useState('LEAD-II');
  const [sweepSpeed, setSweepSpeed] = useState(2.5); // pixels per frame

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;
    
    // Waveform buffer
    const points = new Array(width).fill(height / 2);
    let currentX = 0;
    let phase = 0;
    let animationId;

    // ECG wave generator function (P-Q-R-S-T wave model)
    const getEcgSample = (t) => {
      // Period in seconds = 60 / heartRate
      const period = 60 / heartRate;
      const normalizedTime = (t % period) / period; // 0.0 to 1.0

      let sample = 0;

      // P wave (Atrial Depolarization)
      if (normalizedTime > 0.1 && normalizedTime < 0.2) {
        const pPhase = (normalizedTime - 0.1) / 0.1;
        sample = Math.sin(pPhase * Math.PI) * 12;
      }
      // PR Segment (flat)
      // Q Wave
      else if (normalizedTime >= 0.22 && normalizedTime < 0.25) {
        sample = -10;
      }
      // R Peak (Ventricular Depolarization)
      else if (normalizedTime >= 0.25 && normalizedTime < 0.28) {
        const rPhase = (normalizedTime - 0.25) / 0.03;
        sample = Math.sin(rPhase * Math.PI) * 75; // high sharp peak
      }
      // S Wave
      else if (normalizedTime >= 0.28 && normalizedTime < 0.31) {
        sample = -20;
      }
      // ST Segment
      // T wave (Ventricular Repolarization)
      else if (normalizedTime >= 0.42 && normalizedTime < 0.6) {
        const tPhase = (normalizedTime - 0.42) / 0.18;
        sample = Math.sin(tPhase * Math.PI) * 22;
      }
      // Baseline small noise
      sample += (Math.random() - 0.5) * 2;

      return sample;
    };

    let startTime = performance.now();

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.lineWidth = 1;

      // Fine grid 20px
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Major grid 100px
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.18)';
      for (let x = 0; x < width; x += 100) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 100) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    const render = () => {
      const now = performance.now();
      const elapsedSec = (now - startTime) / 1000;

      // Calculate new point
      const rawEcg = getEcgSample(elapsedSec);
      const baselineY = height / 2;
      const yVal = baselineY - rawEcg;

      // Insert into buffer
      for (let i = 0; i < Math.ceil(sweepSpeed); i++) {
        points[currentX] = yVal;
        currentX = (currentX + 1) % width;
      }

      // Clear canvas
      ctx.fillStyle = 'rgba(7, 12, 24, 0.95)';
      ctx.fillRect(0, 0, width, height);

      // Draw Grid
      drawGrid();

      // Draw ECG Waveform
      ctx.beginPath();
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2.2;
      ctx.lineJoin = 'round';
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 8;

      for (let x = 0; x < width; x++) {
        // Skip scan gap
        if (Math.abs(x - currentX) < 12) continue;

        if (x === 0 || Math.abs(x - currentX) === 12) {
          ctx.moveTo(x, points[x]);
        } else {
          ctx.lineTo(x, points[x]);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Sweep Cursor line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.moveTo(currentX, 0);
      ctx.lineTo(currentX, height);
      ctx.stroke();

      // Sweep glow dot at the tip
      ctx.beginPath();
      ctx.arc(currentX, points[currentX], 4, 0, Math.PI * 2);
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [heartRate, sweepSpeed]);

  return (
    <div className="hud-panel" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.2rem' }}>🫀</span>
          <h2 className="font-orbitron" style={{ fontSize: '1rem', color: '#fff' }}>
            ELECTROCARDIOGRAM & PPG TELEMETRY
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <span className="cyber-badge cyber-badge-emerald font-mono">SINUS RHYTHM</span>
          <span className="cyber-badge cyber-badge-cyan font-mono">{leadMode}</span>
        </div>
      </div>

      {/* Vital Metric Highlights */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '14px'
      }}>
        <div style={{ background: 'rgba(0, 255, 136, 0.08)', border: '1px solid rgba(0, 255, 136, 0.3)', padding: '10px', borderRadius: '8px' }}>
          <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>HEART RATE (HR)</div>
          <div className="font-orbitron glow-emerald" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--hud-emerald)' }}>
            {heartRate} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>BPM</span>
          </div>
        </div>

        <div style={{ background: 'rgba(0, 240, 255, 0.08)', border: '1px solid rgba(0, 240, 255, 0.3)', padding: '10px', borderRadius: '8px' }}>
          <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>O₂ SATURATION (SpO₂)</div>
          <div className="font-orbitron glow-cyan" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--hud-cyan)' }}>
            {spO2}%
          </div>
        </div>

        <div style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '10px', borderRadius: '8px' }}>
          <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>BLOOD PRESSURE</div>
          <div className="font-orbitron" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--hud-violet)' }}>
            {bpSys}/{bpDia} <span style={{ fontSize: '0.7rem', fontWeight: 400 }}>mmHg</span>
          </div>
        </div>

        <div style={{ background: 'rgba(255, 170, 0, 0.08)', border: '1px solid rgba(255, 170, 0, 0.3)', padding: '10px', borderRadius: '8px' }}>
          <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>RESPIRATION RATE</div>
          <div className="font-orbitron glow-amber" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--hud-amber)' }}>
            {respRate} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>BrPM</span>
          </div>
        </div>
      </div>

      {/* Real-time Oscilloscope Canvas */}
      <div style={{
        flex: 1,
        minHeight: '220px',
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid rgba(0, 240, 255, 0.25)'
      }}>
        <canvas
          ref={canvasRef}
          width={640}
          height={220}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>

      {/* Trace Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '12px',
        paddingTop: '10px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['LEAD-I', 'LEAD-II', 'LEAD-III', 'V1-PPG'].map((mode) => (
            <button
              key={mode}
              onClick={() => setLeadMode(mode)}
              className={`hud-btn ${leadMode === mode ? 'hud-btn-emerald' : 'hud-btn'}`}
              style={{ padding: '4px 10px', fontSize: '0.68rem' }}
            >
              {mode}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>SWEEP: 25 mm/s</span>
        </div>
      </div>
    </div>
  );
}
