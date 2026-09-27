'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import TesseractViewer from '../components/TesseractViewer';
import LiveEcgChart from '../components/LiveEcgChart';
import LifeSupportGauges from '../components/LifeSupportGauges';
import AiMedicalAdvisor from '../components/AiMedicalAdvisor';
import CrewRoster from '../components/CrewRoster';
import AlertsFeed from '../components/AlertsFeed';

const INITIAL_CREW = [
  { id: 'AST-01', name: 'Cmdr. Sarah Vance', role: 'Mission Commander (EVA-1)', initials: 'SV', hr: 72, spo2: 98.4, bpSys: 118, bpDia: 76, suitP: 4.3, o2: 94, stress: 18, status: 'Nominal' },
  { id: 'AST-02', name: 'Dr. Marcus Chen', role: 'Medical Specialist (EVA-2)', initials: 'MC', hr: 78, spo2: 99.0, bpSys: 122, bpDia: 80, suitP: 4.3, o2: 91, stress: 24, status: 'Nominal' },
  { id: 'AST-03', name: 'Eng. Elena Rostova', role: 'Flight Engineer (Airlock)', initials: 'ER', hr: 68, spo2: 98.8, bpSys: 115, bpDia: 74, suitP: 14.7, o2: 98, stress: 15, status: 'Nominal' },
  { id: 'AST-04', name: 'Pilot David Kalu', role: 'Command Pilot (Orbiter)', initials: 'DK', hr: 74, spo2: 98.2, bpSys: 120, bpDia: 78, suitP: 14.7, o2: 96, stress: 20, status: 'Nominal' }
];

const INITIAL_ALERTS = [
  { id: 'ALT-101', severity: 'NOMINAL', title: 'DSN Goldstone X-band lock confirmed', subsystem: 'Comms', time: '14:28:02', acknowledged: true },
  { id: 'ALT-102', severity: 'NOMINAL', title: 'EMU-X Suit telemetry sync complete', subsystem: 'PLSS', time: '14:27:40', acknowledged: true },
  { id: 'ALT-103', severity: 'CAUTION', title: 'Solar particle event flux elevation (low risk)', subsystem: 'Radiation', time: '14:25:15', acknowledged: false },
  { id: 'ALT-104', severity: 'NOMINAL', title: '4D Bio-Tesseract hypercube resonance calibrated', subsystem: 'Bio-Core', time: '14:20:00', acknowledged: true }
];

export default function Home() {
  const [crew, setCrew] = useState(INITIAL_CREW);
  const [activeAstronautId, setActiveAstronautId] = useState('AST-01');
  const [activeTab, setActiveTab] = useState('overview');
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);

  const activeAstronaut = crew.find(c => c.id === activeAstronautId) || crew[0];

  // Dynamic telemetry live drift simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCrew(prevCrew =>
        prevCrew.map(ast => {
          // Slight natural biological variance
          const hrDelta = Math.floor(Math.random() * 3) - 1;
          const newHr = Math.min(110, Math.max(58, ast.hr + hrDelta));
          const newSpo2 = +(Math.min(99.8, Math.max(97.0, ast.spo2 + (Math.random() * 0.2 - 0.1)))).toFixed(1);
          return {
            ...ast,
            hr: newHr,
            spo2: newSpo2
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleToggleAlarm = () => {
    const nextAlarm = !isAlarmActive;
    setIsAlarmActive(nextAlarm);

    if (nextAlarm) {
      setAlerts(prev => [
        {
          id: `ALT-${Date.now()}`,
          severity: 'CRITICAL',
          title: 'SIMULATED TACHYCARDIA & METABOLIC ELEVATION',
          subsystem: 'Cardio-Bio',
          time: new Date().toTimeString().slice(0, 8),
          acknowledged: false
        },
        ...prev
      ]);
      // Temporarily elevate active astronaut HR and stress
      setCrew(prev => prev.map(a => a.id === activeAstronautId ? { ...a, hr: 125, stress: 78, status: 'Warning' } : a));
    } else {
      setCrew(prev => prev.map(a => a.id === activeAstronautId ? { ...a, hr: 72, stress: 18, status: 'Nominal' } : a));
    }
  };

  const handleAcknowledgeAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  return (
    <>
      <Navbar
        activeAstronaut={activeAstronaut}
        onSelectAstronaut={setActiveAstronautId}
        isAlarmActive={isAlarmActive}
        onToggleAlarm={handleToggleAlarm}
      />

      <div className="main-content-wrapper">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeAstronaut={activeAstronaut}
        />

        <main className="main-viewport">
          {/* Quick Mission Stage Ribbon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            background: 'rgba(10, 18, 36, 0.7)',
            padding: '12px 20px',
            borderRadius: '10px',
            border: '1px solid rgba(0, 240, 255, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span className="cyber-badge cyber-badge-emerald">ACTIVE EVA STAGE: 03/06</span>
              <span className="font-orbitron" style={{ fontSize: '0.9rem', color: '#fff' }}>
                MISSION ARTEMIS-BIO-VII • EXTERNAL HULL REPAIR & SENSOR ARRAY DEPLOYMENT
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setActiveTab('overview')}
                className={`hud-btn ${activeTab === 'overview' ? 'hud-btn-emerald' : ''}`}
                style={{ padding: '6px 12px', fontSize: '0.72rem' }}
              >
                MISSION MATRIX
              </button>
              <button
                onClick={() => setActiveTab('tesseract')}
                className={`hud-btn ${activeTab === 'tesseract' ? 'hud-btn-emerald' : ''}`}
                style={{ padding: '6px 12px', fontSize: '0.72rem' }}
              >
                4D TESSERACT
              </button>
            </div>
          </div>

          {/* Dynamic Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid-dashboard">
              {/* Left Column: 4D Tesseract Viewer */}
              <div style={{ gridColumn: 'span 5' }}>
                <TesseractViewer
                  heartRate={activeAstronaut.hr}
                  stressLevel={activeAstronaut.stress}
                  suitStatus={activeAstronaut.status}
                />
              </div>

              {/* Center/Right Column: Live ECG & Telemetry */}
              <div style={{ gridColumn: 'span 7' }}>
                <LiveEcgChart
                  heartRate={activeAstronaut.hr}
                  spO2={activeAstronaut.spo2}
                  bpSys={activeAstronaut.bpSys}
                  bpDia={activeAstronaut.bpDia}
                />
              </div>

              {/* Bottom Left: Life Support Gauges */}
              <div style={{ gridColumn: 'span 6' }}>
                <LifeSupportGauges
                  suitPressure={activeAstronaut.suitP}
                  o2Primary={activeAstronaut.o2}
                />
              </div>

              {/* Bottom Right: AI Diagnostic Advisor */}
              <div style={{ gridColumn: 'span 6' }}>
                <AiMedicalAdvisor
                  astronautName={activeAstronaut.name}
                  heartRate={activeAstronaut.hr}
                  stress={activeAstronaut.stress}
                />
              </div>

              {/* Full Width: Crew Roster */}
              <div style={{ gridColumn: 'span 8' }}>
                <CrewRoster
                  crewMembers={crew}
                  activeId={activeAstronautId}
                  onSelect={setActiveAstronautId}
                />
              </div>

              {/* Full Width: Alerts Feed */}
              <div style={{ gridColumn: 'span 4' }}>
                <AlertsFeed
                  alerts={alerts}
                  onAcknowledge={handleAcknowledgeAlert}
                />
              </div>
            </div>
          )}

          {activeTab === 'tesseract' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <TesseractViewer
                heartRate={activeAstronaut.hr}
                stressLevel={activeAstronaut.stress}
                suitStatus={activeAstronaut.status}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <LifeSupportGauges
                  suitPressure={activeAstronaut.suitP}
                  o2Primary={activeAstronaut.o2}
                />
                <AiMedicalAdvisor
                  astronautName={activeAstronaut.name}
                  heartRate={activeAstronaut.hr}
                  stress={activeAstronaut.stress}
                />
              </div>
            </div>
          )}

          {activeTab === 'ecg' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <LiveEcgChart
                heartRate={activeAstronaut.hr}
                spO2={activeAstronaut.spo2}
                bpSys={activeAstronaut.bpSys}
                bpDia={activeAstronaut.bpDia}
              />
              <AiMedicalAdvisor
                astronautName={activeAstronaut.name}
                heartRate={activeAstronaut.hr}
                stress={activeAstronaut.stress}
              />
            </div>
          )}

          {activeTab === 'lifesupport' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <LifeSupportGauges
                suitPressure={activeAstronaut.suitP}
                o2Primary={activeAstronaut.o2}
              />
              <CrewRoster
                crewMembers={crew}
                activeId={activeAstronautId}
                onSelect={setActiveAstronautId}
              />
            </div>
          )}

          {activeTab === 'ai-doc' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <AiMedicalAdvisor
                astronautName={activeAstronaut.name}
                heartRate={activeAstronaut.hr}
                stress={activeAstronaut.stress}
              />
              <LiveEcgChart
                heartRate={activeAstronaut.hr}
                spO2={activeAstronaut.spo2}
                bpSys={activeAstronaut.bpSys}
                bpDia={activeAstronaut.bpDia}
              />
            </div>
          )}

          {activeTab === 'crew' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <CrewRoster
                crewMembers={crew}
                activeId={activeAstronautId}
                onSelect={setActiveAstronautId}
              />
              <AlertsFeed
                alerts={alerts}
                onAcknowledge={handleAcknowledgeAlert}
              />
            </div>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
}
