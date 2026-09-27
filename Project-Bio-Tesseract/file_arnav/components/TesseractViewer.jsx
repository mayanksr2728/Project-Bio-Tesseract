'use strict';
'use client';

import React, { useRef, useEffect, useState } from 'react';

export default function TesseractViewer({ heartRate = 72, stressLevel = 18, suitStatus = 'Nominal' }) {
  const canvasRef = useRef(null);
  const [rotationSpeed, setRotationSpeed] = useState(0.015);
  const [projectionMode, setProjectionMode] = useState('stereographic'); // 'stereographic' | 'orthographic'
  const [activePlane, setActivePlane] = useState('XW-ZW');
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // 16 Vertices of a 4D Hypercube (Tesseract): (±1, ±1, ±1, ±1)
    const vertices4D = [];
    for (let x = -1; x <= 1; x += 2) {
      for (let y = -1; y <= 1; y += 2) {
        for (let z = -1; z <= 1; z += 2) {
          for (let w = -1; w <= 1; w += 2) {
            vertices4D.push([x, y, z, w]);
          }
        }
      }
    }

    // 32 Edges connecting vertices with Hamming distance of 1
    const edges = [];
    for (let i = 0; i < 16; i++) {
      for (let j = i + 1; j < 16; j++) {
        let diffCount = 0;
        for (let k = 0; k < 4; k++) {
          if (vertices4D[i][k] !== vertices4D[j][k]) diffCount++;
        }
        if (diffCount === 1) {
          edges.push([i, j]);
        }
      }
    }

    let angleXY = 0;
    let angleXZ = 0;
    let angleXW = 0;
    let angleYZ = 0;
    let angleYW = 0;
    let angleZW = 0;
    let animationFrameId;

    // Rotation matrices in 4D
    const rotate4D = (v) => {
      let [x, y, z, w] = v;

      // XW rotation
      let cosXW = Math.cos(angleXW), sinXW = Math.sin(angleXW);
      let x1 = x * cosXW - w * sinXW;
      let w1 = x * sinXW + w * cosXW;
      x = x1; w = w1;

      // ZW rotation
      let cosZW = Math.cos(angleZW), sinZW = Math.sin(angleZW);
      let z1 = z * cosZW - w * sinZW;
      let w2 = z * sinZW + w * cosZW;
      z = z1; w = w2;

      // XY rotation
      let cosXY = Math.cos(angleXY), sinXY = Math.sin(angleXY);
      let x2 = x * cosXY - y * sinXY;
      let y1 = x * sinXY + y * cosXY;
      x = x2; y = y1;

      // YZ rotation
      let cosYZ = Math.cos(angleYZ), sinYZ = Math.sin(angleYZ);
      let y2 = y * cosYZ - z * sinYZ;
      let z2 = y * sinYZ + z * cosYZ;
      y = y2; z = z2;

      return [x, y, z, w];
    };

    // 4D to 3D to 2D Screen projection
    const project = (v, width, height, pulseFactor) => {
      let [x, y, z, w] = v;
      
      // Biometric pulse scaling based on heart rate
      const scale = 1.0 + (pulseFactor * 0.1);
      x *= scale; y *= scale; z *= scale; w *= scale;

      const distance4D = 2.5;
      const distance3D = 3.5;

      let factor4D;
      if (projectionMode === 'stereographic') {
        factor4D = 1 / (distance4D - w);
      } else {
        factor4D = 0.5; // Orthographic
      }

      const x3D = x * factor4D;
      const y3D = y * factor4D;
      const z3D = z * factor4D;

      const factor3D = 1 / (distance3D - z3D);
      const x2D = x3D * factor3D * (width * 0.9) + width / 2;
      const y2D = y3D * factor3D * (height * 0.9) + height / 2;

      return { x: x2D, y: y2D, depth: z3D + w, wVal: w };
    };

    const render = (time) => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Heartbeat pulse calculation
      const pulseSpeed = (heartRate / 60) * 2 * Math.PI;
      const pulseFactor = Math.sin((time / 1000) * pulseSpeed) * 0.5 + 0.5;

      if (isRotating) {
        angleXW += rotationSpeed * 0.8;
        angleZW += rotationSpeed * 0.6;
        angleXY += rotationSpeed * 0.4;
        angleYZ += rotationSpeed * 0.3;
      }

      // Project vertices
      const projected = vertices4D.map(v => {
        const rotated = rotate4D(v);
        return project(rotated, width, height, pulseFactor);
      });

      // Draw Edges with holographic depth coloring
      edges.forEach(([i, j]) => {
        const p1 = projected[i];
        const p2 = projected[j];

        const avgDepth = (p1.depth + p2.depth) / 2;
        const alpha = Math.max(0.2, Math.min(0.9, (avgDepth + 1.5) / 3));

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        // Color shifts based on stress & vitals resonance
        if (stressLevel > 50) {
          ctx.strokeStyle = `rgba(255, 42, 85, ${alpha})`;
          ctx.lineWidth = 2.0;
        } else {
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 1.6;
        }
        ctx.stroke();
      });

      // Draw Vertices (Bio-Resonance Nodes)
      projected.forEach((p, idx) => {
        const radius = 3.5 + Math.max(0, (p.wVal + 1) * 2.5) + (pulseFactor * 2);
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);

        // Outer glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 2.5);
        if (stressLevel > 50) {
          gradient.addColorStop(0, '#ff2a55');
          gradient.addColorStop(0.5, 'rgba(255, 42, 85, 0.4)');
          gradient.addColorStop(1, 'rgba(255, 42, 85, 0)');
        } else {
          gradient.addColorStop(0, '#00ff88');
          gradient.addColorStop(0.5, 'rgba(0, 240, 255, 0.5)');
          gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
        }

        ctx.fillStyle = gradient;
        ctx.fill();

        // Core white dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      });

      // Subtle Center Tesseract Energy Ring
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 60 + pulseFactor * 10, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [rotationSpeed, projectionMode, isRotating, heartRate, stressLevel]);

  return (
    <div className="hud-panel" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="status-dot nominal"></div>
          <h2 className="font-orbitron" style={{ fontSize: '1rem', color: '#fff', letterSpacing: '0.08em' }}>
            4D BIO-TESSERACT RESONATOR
          </h2>
        </div>
        <span className="cyber-badge cyber-badge-cyan font-mono">
          SO(4) ROTATION MATRIX
        </span>
      </div>

      {/* Canvas Screen */}
      <div style={{
        position: 'relative',
        background: 'radial-gradient(circle at center, rgba(0, 240, 255, 0.08) 0%, rgba(5, 10, 22, 0.9) 70%)',
        border: '1px solid rgba(0, 240, 255, 0.2)',
        borderRadius: '8px',
        overflow: 'hidden',
        flex: 1,
        minHeight: '340px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <canvas
          ref={canvasRef}
          width={480}
          height={340}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />

        {/* HUD Overlay Stats on Canvas */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: 'var(--text-secondary)',
          background: 'rgba(5, 10, 20, 0.7)',
          padding: '6px 10px',
          borderRadius: '4px',
          border: '1px solid rgba(0, 240, 255, 0.15)'
        }}>
          <div>VERTICES: <strong style={{ color: 'var(--hud-cyan)' }}>16 (4D Hyperspace)</strong></div>
          <div>EDGES: <strong style={{ color: 'var(--hud-emerald)' }}>32 Hyper-vectors</strong></div>
          <div>BIO-RESONANCE: <strong style={{ color: '#fff' }}>{(heartRate / 60).toFixed(2)} Hz</strong></div>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: 'var(--text-secondary)',
          background: 'rgba(5, 10, 20, 0.7)',
          padding: '6px 10px',
          borderRadius: '4px',
          border: '1px solid rgba(0, 240, 255, 0.15)'
        }}>
          <div>STRESS FLUX: <strong style={{ color: stressLevel > 50 ? 'var(--hud-crimson)' : 'var(--hud-emerald)' }}>{stressLevel}%</strong></div>
          <div>PROJECTION: <strong style={{ color: 'var(--hud-cyan)' }}>{projectionMode.toUpperCase()}</strong></div>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '14px',
        paddingTop: '12px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="hud-btn"
            style={{ padding: '6px 12px', fontSize: '0.72rem' }}
          >
            {isRotating ? '⏸ PAUSE 4D' : '▶ RESUME 4D'}
          </button>

          <button
            onClick={() => setProjectionMode(projectionMode === 'stereographic' ? 'orthographic' : 'stereographic')}
            className="hud-btn"
            style={{ padding: '6px 12px', fontSize: '0.72rem' }}
          >
            MODE: {projectionMode.slice(0, 6).toUpperCase()}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>ANGULAR VELOCITY</span>
          <input
            type="range"
            min="0.005"
            max="0.04"
            step="0.005"
            value={rotationSpeed}
            onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
            style={{ width: '90px', accentColor: 'var(--hud-cyan)', cursor: 'pointer' }}
          />
        </div>
      </div>
    </div>
  );
}
