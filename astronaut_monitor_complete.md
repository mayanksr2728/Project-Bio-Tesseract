# Complete Astronaut Health & Environmental Monitoring System
**All-in-One Documentation & Source Code Bundle**

This document contains the entire architecture, database integration schema, backend APIs, frontend UI, styles, client scripts, parameters registry, and configuration for the Astronaut Health & Environmental Monitoring Application.

---

## Table of Contents
1. [Architecture & System Overview](#1-architecture--system-overview)
2. [Turso Database Schema & Configuration](#2-turso-database-schema--configuration)
3. [Environment Configuration (`.env`)](#3-environment-configuration-env)
4. [Project Manifest (`package.json`)](#4-project-manifest-packagejson)
5. [Parameters & Thresholds Registry (`parameters.mjs`)](#5-parameters--thresholds-registry-parametersmjs)
6. [Turso Database Client (`db.mjs`)](#6-turso-database-client-dbmjs)
7. [HTTP API Server (`server.mjs`)](#7-http-api-server-servermjs)
8. [Frontend Structure (`public/index.html`)](#8-frontend-structure-publicindexhtml)
9. [Design System & Styles (`public/styles.css`)](#9-design-system--styles-publicstylescss)
10. [Client Controller & Visualization Logic (`public/app.js`)](#10-client-controller--visualization-logic-publicappjs)
11. [Documentation Guide (`README.md`)](#11-documentation-guide-readmemd)

---

## 1. Architecture & System Overview

The system is a minimal, clean 3-page web application designed for space telemetry and physiological monitoring:
- **Page 1 (Home):** Welcome greeting and real-time anatomical human body map reflecting live organ status (Brain, Heart, Lungs, Liver, Kidneys, Stomach).
- **Page 2 (Astronaut Vitals):** Heart Rate (`bpm`) and Breathing Rate (`breaths/min`) with circular status indicators (`●`) and real-data graphs.
- **Page 3 (Environmental Factors):** Complete structure for all 28 environmental, atmospheric, and toxicological parameters.
- **Real Database Integration:** Direct connection to Turso (libSQL) via backend HTTP pipeline without exposing credentials. No dummy/mock data is ever generated.

---

## 2. Turso Database Schema & Configuration

```sql
-- Telemetry Table
CREATE TABLE IF NOT EXISTS telemetry_readings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  parameter_id TEXT NOT NULL,
  value REAL NOT NULL,
  unit TEXT,
  recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_param_time ON telemetry_readings(parameter_id, recorded_at DESC);

-- Files Storage Table
CREATE TABLE IF NOT EXISTS files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  filepath TEXT,
  mimetype TEXT,
  size_bytes INTEGER,
  content_text TEXT,
  content_base64 TEXT,
  metadata TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Environment Configuration (`.env`)

```env
PORT=3000
TURSO_DATABASE_URL=https://bio-arnav-mukherji.aws-ap-south-1.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTA1MDA5OTAsImlkIjoiMDFhMGQ4NmMtOGEwMS03ODdhLWI5NDEtMzUzNWNlYWFkZjIxIiwia2lkIjoia3d6bkUxWlZxOHh4cjhQOTNibmxQaTZLM3U5Ym02R1h1blBfMEM5MUQ4QSIsInJpZCI6ImJmMmE0OTdkLTM3YzItNDk0Yi05MjE1LTY4Y2M1OWZkMDZkMCJ9.WvhOX3o8Hg3dE-MLLKdnN62ZfmlOW2Z65160Pgwvkie_KUoryEXWRHe2l6-JDgZcY_Tc9RTmkXVW2iw4u7qHAA
```

---

## 4. Project Manifest (`package.json`)

```json
{
  "name": "astronaut-health-environmental-monitor",
  "version": "1.0.0",
  "description": "Minimal, clean astronaut health and environmental monitoring web application with Turso database integration.",
  "type": "module",
  "main": "server.mjs",
  "scripts": {
    "start": "node server.mjs"
  },
  "keywords": [
    "astronaut",
    "telemetry",
    "turso",
    "monitoring",
    "vitals",
    "environmental"
  ],
  "author": "",
  "license": "MIT"
}
```

---

## 5. Parameters & Thresholds Registry (`parameters.mjs`)

```javascript
// Parameter and Organ Registry
// System is structured for easy addition of future vitals, thresholds, and organ mappings.

export const ORGANS = [
  { id: "brain", name: "Brain" },
  { id: "lungs", name: "Lungs" },
  { id: "heart", name: "Heart" },
  { id: "liver", name: "Liver" },
  { id: "stomach", name: "Stomach" },
  { id: "kidneys", name: "Kidneys" }
];

export const VITAL_PARAMETERS = [
  {
    id: "heart_rate",
    name: "Heart Rate",
    unit: "bpm",
    organ: "heart",
    hasGraph: true,
    description: "Cardiac beats per minute",
    thresholds: {
      lowCritical: 40,
      lowWarning: 55,
      highWarning: 100,
      highCritical: 130
    }
  },
  {
    id: "breathing_rate",
    name: "Breathing Rate",
    unit: "breaths/min",
    organ: "lungs",
    hasGraph: true,
    description: "Respiratory cycles per minute",
    thresholds: {
      lowCritical: 8,
      lowWarning: 12,
      highWarning: 20,
      highCritical: 28
    }
  }
];

export const ENVIRONMENTAL_PARAMETERS = [
  { id: "co2", name: "Carbon Dioxide (CO₂)", unit: "ppm" },
  { id: "co", name: "Carbon Monoxide (CO)", unit: "ppm" },
  { id: "o2_concentration", name: "Oxygen Concentration (O₂)", unit: "%" },
  { id: "methane", name: "Methane (CH₄)", unit: "% / ppm" },
  { id: "h2s", name: "Hydrogen Sulfide (H₂S)", unit: "ppm" },
  { id: "nox", name: "Nitrous Gases (NOx)", unit: "ppm" },
  { id: "combustible_gases_lel", name: "Combustible Gases / Lower Explosive Limit (LEL)", unit: "% LEL" },
  { id: "radon_gas", name: "Radon Gas", unit: "Bq/m³" },
  { id: "diesel_particulate_matter", name: "Diesel Particulate Matter (DPM)", unit: "µg/m³" },
  { id: "silica_dust", name: "Silica Dust", unit: "mg/m³" },
  { id: "coal_dust", name: "Coal Dust", unit: "mg/m³" },
  { id: "mercury_vapor", name: "Mercury Vapor", unit: "mg/m³" },
  { id: "ambient_pressure", name: "Ambient Pressure (Hyperbaric / Hypobaric)", unit: "kPa / mmHg" },
  { id: "partial_pressure_o2", name: "Partial Pressure of Oxygen (ppO₂)", unit: "kPa" },
  { id: "partial_pressure_n2", name: "Partial Pressure of Nitrogen (ppN₂)", unit: "kPa" },
  { id: "ambient_temperature", name: "Ambient Temperature", unit: "°C" },
  { id: "relative_humidity", name: "Relative Humidity", unit: "%" },
  { id: "vapor_pressure_deficit", name: "Vapor Pressure Deficit (VPD)", unit: "kPa" },
  { id: "acoustic_noise", name: "Acoustic Noise Pollution", unit: "dBA" },
  { id: "infrasound_vibrations", name: "Infrasound Vibrations", unit: "Hz / dB" },
  { id: "whole_body_vibrations", name: "Whole-Body Mechanical Vibrations", unit: "m/s²" },
  { id: "air_ionization", name: "Air Ionization", unit: "ions/cm³" },
  { id: "gamma_cosmic_radiation", name: "Gamma and Cosmic Radiation", unit: "µSv/h" },
  { id: "emf", name: "Electromagnetic Fields (EMF)", unit: "µT / V/m" },
  { id: "blue_light_radiance", name: "Blue Light Radiance", unit: "W/(m²·sr)" },
  { id: "complete_darkness_circadian", name: "Complete Darkness / Circadian Disruption", unit: "lux" },
  { id: "waterborne_pathogens", name: "Waterborne Pathogens", unit: "CFU/100mL" },
  { id: "water_salinity_minerals", name: "Water Salinity and Mineral Loading", unit: "mg/L (TDS)" }
];

// Threshold Evaluation Helper
export function evaluateVitalStatus(value, thresholds) {
  if (value === null || value === undefined || isNaN(value)) {
    return "NO_DATA";
  }
  if (!thresholds) {
    return "NORMAL";
  }
  if (value < thresholds.lowCritical) {
    return "CRITICAL"; // LOW CRITICAL
  }
  if (value < thresholds.lowWarning) {
    return "WARNING"; // LOW WARNING
  }
  if (value > thresholds.highCritical) {
    return "CRITICAL"; // HIGH CRITICAL
  }
  if (value > thresholds.highWarning) {
    return "WARNING"; // HIGH WARNING
  }
  return "NORMAL";
}
```

---

## 6. Turso Database Client (`db.mjs`)

```javascript
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const envPath = path.join(__dirname, ".env");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const match = line.trim().match(/^([^=]+)=(.*)$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].trim();
      }
    }
  }
}
loadEnv();

let dbUrl = process.env.TURSO_DATABASE_URL || "https://bio-arnav-mukherji.aws-ap-south-1.turso.io";
if (dbUrl.startsWith("libsql://")) {
  dbUrl = dbUrl.replace("libsql://", "https://");
}
const TURSO_DATABASE_URL = dbUrl;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN || "";

export async function executeQuery(sql, args = []) {
  const url = `${TURSO_DATABASE_URL}/v2/pipeline`;
  const formattedArgs = args.map(arg => {
    if (arg === null || arg === undefined) return { type: "null" };
    if (typeof arg === "number") {
      return Number.isInteger(arg) ? { type: "integer", value: String(arg) } : { type: "float", value: arg };
    }
    if (typeof arg === "string") return { type: "text", value: arg };
    if (typeof arg === "boolean") return { type: "integer", value: arg ? "1" : "0" };
    return { type: "text", value: JSON.stringify(arg) };
  });

  const payload = {
    requests: [
      {
        type: "execute",
        stmt: {
          sql: sql,
          args: formattedArgs
        }
      },
      { type: "close" }
    ]
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${TURSO_AUTH_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Turso HTTP Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const execResult = data.results?.[0];
  if (execResult?.type === "error") {
    throw new Error(`Turso SQL Error: ${execResult.error.message}`);
  }
  return execResult?.response?.result;
}

export async function initDatabase() {
  const schema = `
    CREATE TABLE IF NOT EXISTS telemetry_readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parameter_id TEXT NOT NULL,
      value REAL NOT NULL,
      unit TEXT,
      recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await executeQuery(schema);
  await executeQuery(`CREATE INDEX IF NOT EXISTS idx_param_time ON telemetry_readings(parameter_id, recorded_at DESC);`);
}

export async function getLatestReading(parameterId) {
  const sql = `
    SELECT id, parameter_id, value, unit, recorded_at 
    FROM telemetry_readings 
    WHERE parameter_id = ? 
    ORDER BY recorded_at DESC, id DESC 
    LIMIT 1;
  `;
  const res = await executeQuery(sql, [parameterId]);
  if (!res?.rows || res.rows.length === 0) {
    return null;
  }
  const row = res.rows[0];
  return {
    id: row[0]?.value ?? row[0],
    parameter_id: row[1]?.value ?? row[1],
    value: parseFloat(row[2]?.value ?? row[2]),
    unit: row[3]?.value ?? row[3],
    recorded_at: row[4]?.value ?? row[4]
  };
}

export async function getReadingHistory(parameterId, limit = 50) {
  const sql = `
    SELECT id, parameter_id, value, unit, recorded_at 
    FROM telemetry_readings 
    WHERE parameter_id = ? 
    ORDER BY recorded_at ASC, id ASC 
    LIMIT ?;
  `;
  const res = await executeQuery(sql, [parameterId, limit]);
  if (!res?.rows || res.rows.length === 0) {
    return [];
  }
  return res.rows.map(row => ({
    id: row[0]?.value ?? row[0],
    parameter_id: row[1]?.value ?? row[1],
    value: parseFloat(row[2]?.value ?? row[2]),
    unit: row[3]?.value ?? row[3],
    recorded_at: row[4]?.value ?? row[4]
  }));
}

export async function insertTelemetryRecord(parameterId, value, unit = "") {
  const sql = `
    INSERT INTO telemetry_readings (parameter_id, value, unit, recorded_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP);
  `;
  return await executeQuery(sql, [parameterId, value, unit]);
}
```

---

## 7. HTTP API Server (`server.mjs`)

```javascript
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { VITAL_PARAMETERS, ENVIRONMENTAL_PARAMETERS, ORGANS, evaluateVitalStatus } from "./parameters.mjs";
import { initDatabase, getLatestReading, getReadingHistory, insertTelemetryRecord } from "./db.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

initDatabase().then(() => {
  console.log("Turso telemetry schema verified.");
}).catch(err => {
  console.error("Failed to initialize Turso database schema:", err.message);
});

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    res.end();
    return;
  }

  try {
    if (req.method === "GET" && pathname === "/api/vitals") {
      const results = [];
      const organStatusMap = {};
      ORGANS.forEach(o => { organStatusMap[o.id] = "NO_DATA"; });

      let hasAnyData = false;

      for (const param of VITAL_PARAMETERS) {
        const latest = await getLatestReading(param.id);
        const history = param.hasGraph ? await getReadingHistory(param.id, 50) : [];
        
        let status = "NO_DATA";
        if (latest && latest.value !== null && latest.value !== undefined) {
          hasAnyData = true;
          status = evaluateVitalStatus(latest.value, param.thresholds);
          if (param.organ) {
            organStatusMap[param.organ] = status;
          }
        }

        results.push({
          ...param,
          latest: latest,
          history: history,
          status: status
        });
      }

      return sendJson(res, 200, {
        success: true,
        hasVitalData: hasAnyData,
        vitals: results,
        organs: organStatusMap
      });
    }

    if (req.method === "GET" && pathname === "/api/environmental") {
      const results = [];
      for (const param of ENVIRONMENTAL_PARAMETERS) {
        const latest = await getLatestReading(param.id);
        results.push({
          ...param,
          latest: latest
        });
      }
      return sendJson(res, 200, { success: true, environmental: results });
    }

    if (req.method === "POST" && pathname === "/api/telemetry") {
      const body = await parseBody(req);
      const { parameter_id, value, unit } = body;
      if (!parameter_id || typeof value !== "number") {
        return sendJson(res, 400, { success: false, error: "parameter_id and numeric value are required" });
      }
      await insertTelemetryRecord(parameter_id, value, unit || "");
      return sendJson(res, 201, { success: true, message: "Telemetry recorded to Turso" });
    }

    let filePath = path.join(__dirname, "public", pathname === "/" ? "index.html" : pathname);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(__dirname, "public", "index.html");
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content);
      }
    });

  } catch (error) {
    console.error("Server error:", error);
    sendJson(res, 500, { success: false, error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`Astronaut Monitor running on http://localhost:${PORT}`);
});
```

---

## 8. Frontend Structure (`public/index.html`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Astronaut Health & Environmental Monitoring</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="app-header">
    <div class="header-container">
      <div class="brand">Astronaut Monitoring System</div>
      <nav class="nav-menu">
        <button class="nav-btn active" data-page="home" id="nav-home">Home</button>
        <button class="nav-btn" data-page="vitals" id="nav-vitals">Astronaut Vitals</button>
        <button class="nav-btn" data-page="environmental" id="nav-environmental">Environmental Factors</button>
      </nav>
    </div>
  </header>

  <main class="main-content">
    <!-- PAGE 1: HOME -->
    <section id="page-home" class="page-view active">
      <div class="home-layout">
        <div class="home-intro">
          <h1 class="welcome-heading">Welcome, Astronaut</h1>
          <p class="welcome-description">
            This application monitors astronaut vitals and environmental conditions in real time using telemetry data.
          </p>

          <div class="home-navigation">
            <button class="home-nav-card" onclick="navigateTo('vitals')">
              <h2>Astronaut Vitals</h2>
              <p>View physiological parameters, status indicators, and vital trends.</p>
            </button>
            <button class="home-nav-card" onclick="navigateTo('environmental')">
              <h2>Environmental Factors</h2>
              <p>View atmospheric, toxicological, and habitat parameters.</p>
            </button>
          </div>
        </div>

        <!-- Human Anatomical Visualization -->
        <div class="anatomical-panel">
          <div class="panel-header">
            <h2 class="panel-title">Physiological Body Map</h2>
            <div id="body-status-badge" class="status-badge status-neutral">No vital data available</div>
          </div>
          
          <div class="body-svg-container">
            <svg id="human-body-svg" viewBox="0 0 280 460" xmlns="http://www.w3.org/2000/svg" class="body-svg">
              <defs>
                <filter id="subtle-shadow" x="-5%" y="-5%" width="110%" height="110%">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.25"/>
                </filter>
              </defs>

              <!-- Body Base Silhouette -->
              <g id="body-silhouette-group">
                <path id="body-head" class="body-part body-neutral" d="M140,25 C158,25 170,38 170,60 C170,80 156,92 140,92 C124,92 110,80 110,60 C110,38 122,25 140,25 Z" />
                <path id="body-neck" class="body-part body-neutral" d="M132,92 L148,92 L150,105 L130,105 Z" />
                <path id="body-torso" class="body-part body-neutral" d="M130,105 L150,105 C178,107 195,116 195,145 L190,240 C190,260 175,275 140,275 C105,275 90,260 90,240 L85,145 C85,116 102,107 130,105 Z" />
                <path id="body-arm-left" class="body-part body-neutral" d="M85,115 C72,125 60,150 56,190 L52,260 C50,272 60,275 66,265 L76,195 C78,165 84,145 92,130 Z" />
                <path id="body-arm-right" class="body-part body-neutral" d="M195,115 C208,125 220,150 224,190 L228,260 C230,272 220,275 214,265 L204,195 C202,165 196,145 188,130 Z" />
                <path id="body-leg-left" class="body-part body-neutral" d="M102,270 L135,270 L130,360 L126,435 C125,445 110,445 108,435 L106,360 L100,275 Z" />
                <path id="body-leg-right" class="body-part body-neutral" d="M145,270 L178,270 L180,275 L174,360 L172,435 C170,445 155,445 154,435 L150,360 L145,270 Z" />
              </g>

              <!-- Major Internal Organs -->
              <g id="organ-brain" class="organ organ-neutral" data-organ="brain" data-name="Brain">
                <path d="M125,44 C125,36 132,32 140,32 C148,32 155,36 155,44 C158,48 158,56 154,62 C150,68 146,70 140,70 C134,70 130,68 126,62 C122,56 122,48 125,44 Z" />
                <path d="M140,34 L140,68" stroke="#000" stroke-width="0.8" stroke-opacity="0.3" fill="none" />
              </g>

              <g id="organ-lungs" class="organ organ-neutral" data-organ="lungs" data-name="Lungs">
                <path d="M110,128 C118,124 128,128 132,136 L132,175 C128,185 112,185 106,172 C100,160 102,138 110,128 Z" />
                <path d="M170,128 C162,124 152,128 148,136 L148,175 C152,185 168,185 174,172 C180,160 178,138 170,128 Z" />
              </g>

              <g id="organ-heart" class="organ organ-neutral" data-organ="heart" data-name="Heart">
                <path d="M136,142 C134,136 142,132 146,138 C150,132 158,136 156,142 C154,152 146,160 146,164 C146,160 138,152 136,142 Z" />
              </g>

              <g id="organ-liver" class="organ organ-neutral" data-organ="liver" data-name="Liver">
                <path d="M112,188 C124,184 142,186 146,192 C146,204 135,214 116,212 C108,210 106,198 112,188 Z" />
              </g>

              <g id="organ-stomach" class="organ organ-neutral" data-organ="stomach" data-name="Stomach">
                <path d="M150,192 C158,188 170,194 172,204 C174,216 160,222 152,220 C146,218 144,202 150,192 Z" />
              </g>

              <g id="organ-kidneys" class="organ organ-neutral" data-organ="kidneys" data-name="Kidneys">
                <ellipse cx="120" cy="228" rx="6" ry="10" transform="rotate(-10 120 228)" />
                <ellipse cx="160" cy="228" rx="6" ry="10" transform="rotate(10 160 228)" />
              </g>
            </svg>
          </div>

          <!-- Organ Status Details List -->
          <div class="organ-status-list">
            <div class="organ-item" id="organ-item-brain">
              <span class="status-dot dot-neutral"></span>
              <span class="organ-name">Brain</span>
              <span class="organ-val">No data</span>
            </div>
            <div class="organ-item" id="organ-item-heart">
              <span class="status-dot dot-neutral"></span>
              <span class="organ-name">Heart</span>
              <span class="organ-val">No data</span>
            </div>
            <div class="organ-item" id="organ-item-lungs">
              <span class="status-dot dot-neutral"></span>
              <span class="organ-name">Lungs</span>
              <span class="organ-val">No data</span>
            </div>
            <div class="organ-item" id="organ-item-liver">
              <span class="status-dot dot-neutral"></span>
              <span class="organ-name">Liver</span>
              <span class="organ-val">No data</span>
            </div>
            <div class="organ-item" id="organ-item-stomach">
              <span class="status-dot dot-neutral"></span>
              <span class="organ-name">Stomach</span>
              <span class="organ-val">No data</span>
            </div>
            <div class="organ-item" id="organ-item-kidneys">
              <span class="status-dot dot-neutral"></span>
              <span class="organ-name">Kidneys</span>
              <span class="organ-val">No data</span>
            </div>
          </div>

          <!-- Status Color Legend -->
          <div class="status-legend">
            <div class="legend-item"><span class="status-dot dot-normal"></span> Normal</div>
            <div class="legend-item"><span class="status-dot dot-warning"></span> Warning</div>
            <div class="legend-item"><span class="status-dot dot-critical"></span> Critical</div>
            <div class="legend-item"><span class="status-dot dot-neutral"></span> No Data</div>
          </div>
        </div>
      </div>
    </section>

    <!-- PAGE 2: ASTRONAUT VITALS -->
    <section id="page-vitals" class="page-view">
      <div class="page-header">
        <h1 class="page-title">Astronaut Vitals</h1>
        <p class="page-subtitle">Physiological monitoring and vital sign telemetry with dynamic status indicators.</p>
      </div>
      <div id="vitals-grid" class="vitals-grid">
        <!-- Injected dynamically via JavaScript from real Turso database data -->
      </div>
    </section>

    <!-- PAGE 3: ENVIRONMENTAL FACTORS -->
    <section id="page-environmental" class="page-view">
      <div class="page-header">
        <h1 class="page-title">Environmental Factors</h1>
        <p class="page-subtitle">Atmospheric composition, physical conditions, radiation, and water quality.</p>
      </div>
      <div id="environmental-grid" class="environmental-grid">
        <!-- Injected dynamically via JavaScript from real Turso database data -->
      </div>
    </section>
  </main>

  <script src="app.js"></script>
</body>
</html>
```

---

## 9. Design System & Styles (`public/styles.css`)

```css
:root {
  --bg-primary: #0f1318;
  --bg-surface: #171d24;
  --bg-card: #1c232c;
  --bg-card-hover: #222b36;
  --border-color: #2b3542;
  --text-main: #f0f4f8;
  --text-muted: #8c9ba8;
  --text-sub: #5c6b78;
  --accent: #3b82f6;
  
  --color-normal: #22c55e;
  --color-warning: #eab308;
  --color-critical: #ef4444;
  --color-neutral: #64748b;
  
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  background-color: var(--bg-primary);
  color: var(--text-main);
  line-height: 1.5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.9rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.brand {
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--text-main);
}

.nav-menu {
  display: flex;
  gap: 0.5rem;
}

.nav-btn {
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-muted);
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.nav-btn:hover {
  color: var(--text-main);
  background-color: var(--bg-card);
}

.nav-btn.active {
  color: #ffffff;
  background-color: var(--accent);
  border-color: var(--accent);
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.page-view {
  display: none;
}

.page-view.active {
  display: block;
}

.page-header {
  margin-bottom: 1.75rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.page-subtitle {
  font-size: 0.92rem;
  color: var(--text-muted);
}

.home-layout {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 2.5rem;
  align-items: start;
  margin-top: 1rem;
}

.home-intro {
  display: flex;
  flex-direction: column;
}

.welcome-heading {
  font-size: 2.2rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-main);
}

.welcome-description {
  font-size: 1.02rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.home-navigation {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.home-nav-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  padding: 1.35rem 1.5rem;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  color: inherit;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.home-nav-card:hover {
  border-color: var(--accent);
  background-color: var(--bg-card);
}

.home-nav-card h2 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.35rem;
}

.home-nav-card p {
  font-size: 0.88rem;
  color: var(--text-muted);
}

.anatomical-panel {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.panel-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.panel-title {
  font-size: 1.05rem;
  font-weight: 600;
}

.status-badge {
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.25rem 0.65rem;
  border-radius: 4px;
}

.status-badge.status-neutral {
  background-color: rgba(100, 116, 139, 0.15);
  color: var(--color-neutral);
  border: 1px solid rgba(100, 116, 139, 0.3);
}

.status-badge.status-normal {
  background-color: rgba(34, 197, 94, 0.15);
  color: var(--color-normal);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.status-badge.status-warning {
  background-color: rgba(234, 179, 8, 0.15);
  color: var(--color-warning);
  border: 1px solid rgba(234, 179, 8, 0.3);
}

.status-badge.status-critical {
  background-color: rgba(239, 68, 68, 0.15);
  color: var(--color-critical);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.body-svg-container {
  width: 100%;
  max-width: 240px;
  display: flex;
  justify-content: center;
  margin: 0.5rem 0 1.25rem 0;
}

.body-svg {
  width: 100%;
  height: auto;
  max-height: 340px;
}

.body-part {
  transition: fill 0.3s ease, stroke 0.3s ease;
}

.body-neutral {
  fill: #1e2630;
  stroke: #334155;
  stroke-width: 1.5;
}

.body-normal {
  fill: #122820;
  stroke: #16a34a;
  stroke-width: 1.5;
}

.organ {
  cursor: default;
  transition: fill 0.3s ease, stroke 0.3s ease;
}

.organ-neutral path, .organ-neutral ellipse {
  fill: #2b3543;
  stroke: #475569;
  stroke-width: 1;
}

.organ-normal path, .organ-normal ellipse {
  fill: #16a34a;
  stroke: #22c55e;
  stroke-width: 1.5;
}

.organ-warning path, .organ-warning ellipse {
  fill: #ca8a04;
  stroke: #eab308;
  stroke-width: 1.5;
}

.organ-critical path, .organ-critical ellipse {
  fill: #dc2626;
  stroke: #ef4444;
  stroke-width: 1.5;
}

.organ-status-list {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem 1rem;
  margin-bottom: 1.25rem;
  padding: 0.75rem 0.9rem;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
}

.organ-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.organ-name {
  color: var(--text-main);
  font-weight: 500;
}

.organ-val {
  margin-left: auto;
  color: var(--text-muted);
  font-size: 0.8rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

.dot-normal { background-color: var(--color-normal); }
.dot-warning { background-color: var(--color-warning); }
.dot-critical { background-color: var(--color-critical); }
.dot-neutral { background-color: var(--color-neutral); }

.status-legend {
  width: 100%;
  display: flex;
  justify-content: space-around;
  font-size: 0.78rem;
  color: var(--text-muted);
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-color);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.vitals-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.vital-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.vital-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.vital-title-group {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.status-circle {
  font-size: 1.1rem;
  line-height: 1;
}

.circle-normal { color: var(--color-normal); }
.circle-warning { color: var(--color-warning); }
.circle-critical { color: var(--color-critical); }
.circle-no_data { color: var(--color-neutral); }

.vital-title {
  font-size: 1.1rem;
  font-weight: 600;
}

.vital-unit {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
}

.vital-current {
  margin-bottom: 1.25rem;
}

.vital-value-row {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
}

.vital-value {
  font-size: 2.4rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.vital-timestamp {
  font-size: 0.8rem;
  color: var(--text-sub);
  margin-top: 0.2rem;
}

.vital-graph-container {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  min-height: 220px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vital-graph-canvas {
  width: 100%;
  height: 220px;
}

.environmental-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.env-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.1rem 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 110px;
}

.env-header {
  margin-bottom: 0.6rem;
}

.env-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-main);
  line-height: 1.3;
}

.env-unit {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-top: 0.15rem;
}

.env-reading {
  margin-top: auto;
}

.env-value {
  font-size: 1.4rem;
  font-weight: 600;
}

.empty-state {
  color: var(--text-muted);
  font-size: 0.9rem;
  font-style: normal;
  font-weight: 400;
}

.empty-graph {
  color: var(--text-sub);
  font-size: 0.88rem;
  text-align: center;
  padding: 2rem;
}

@media (max-width: 860px) {
  .home-layout {
    grid-template-columns: 1fr;
  }
  .vitals-grid {
    grid-template-columns: 1fr;
  }
  .environmental-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## 10. Client Controller & Visualization Logic (`public/app.js`)

```javascript
// Client Application Controller

function navigateTo(pageId) {
  document.querySelectorAll(".page-view").forEach(page => {
    page.classList.remove("active");
  });
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  const targetPage = document.getElementById(`page-${pageId}`);
  const targetNav = document.getElementById(`nav-${pageId}`);

  if (targetPage) targetPage.classList.add("active");
  if (targetNav) targetNav.classList.add("active");

  window.location.hash = pageId;

  if (pageId === "home") {
    loadHome();
  } else if (pageId === "vitals") {
    loadVitals();
  } else if (pageId === "environmental") {
    loadEnvironmental();
  }
}

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const pageId = btn.getAttribute("data-page");
    navigateTo(pageId);
  });
});

async function loadHome() {
  const badge = document.getElementById("body-status-badge");
  const bodyParts = document.querySelectorAll(".body-part");
  const allOrgans = ["brain", "heart", "lungs", "liver", "stomach", "kidneys"];

  try {
    const res = await fetch("/api/vitals");
    const data = await res.json();

    if (!data.success || !data.hasVitalData) {
      if (badge) {
        badge.className = "status-badge status-neutral";
        badge.textContent = "No vital data available";
      }

      bodyParts.forEach(part => {
        part.classList.remove("body-normal");
        part.classList.add("body-neutral");
      });

      allOrgans.forEach(org => {
        const svgOrgan = document.getElementById(`organ-${org}`);
        if (svgOrgan) {
          svgOrgan.className.baseVal = "organ organ-neutral";
        }
        const listItem = document.getElementById(`organ-item-${org}`);
        if (listItem) {
          const dot = listItem.querySelector(".status-dot");
          const val = listItem.querySelector(".organ-val");
          if (dot) dot.className = "status-dot dot-neutral";
          if (val) val.textContent = "No data";
        }
      });
      return;
    }

    const organMap = data.organs || {};
    const vitals = data.vitals || [];

    let hasCritical = false;
    let hasWarning = false;
    Object.values(organMap).forEach(st => {
      if (st === "CRITICAL") hasCritical = true;
      if (st === "WARNING") hasWarning = true;
    });

    if (badge) {
      if (hasCritical) {
        badge.className = "status-badge status-critical";
        badge.textContent = "Critical Attention Required";
      } else if (hasWarning) {
        badge.className = "status-badge status-warning";
        badge.textContent = "Warning / Monitoring";
      } else {
        badge.className = "status-badge status-normal";
        badge.textContent = "Normal Status";
      }
    }

    bodyParts.forEach(part => {
      part.classList.remove("body-neutral");
      part.classList.add("body-normal");
    });

    allOrgans.forEach(org => {
      const status = organMap[org] || "NO_DATA";
      const svgOrgan = document.getElementById(`organ-${org}`);
      const listItem = document.getElementById(`organ-item-${org}`);
      const dot = listItem ? listItem.querySelector(".status-dot") : null;
      const val = listItem ? listItem.querySelector(".organ-val") : null;

      let organClass = "organ organ-neutral";
      let dotClass = "status-dot dot-neutral";
      let valText = "No data";

      const matchedVital = vitals.find(v => v.organ === org && v.latest);

      if (matchedVital && matchedVital.latest) {
        valText = `${matchedVital.latest.value} ${matchedVital.unit}`;
        if (status === "NORMAL") {
          organClass = "organ organ-normal";
          dotClass = "status-dot dot-normal";
        } else if (status === "WARNING") {
          organClass = "organ organ-warning";
          dotClass = "status-dot dot-warning";
        } else if (status === "CRITICAL") {
          organClass = "organ organ-critical";
          dotClass = "status-dot dot-critical";
        }
      }

      if (svgOrgan) {
        svgOrgan.className.baseVal = organClass;
      }
      if (dot) dot.className = dotClass;
      if (val) val.textContent = valText;
    });

  } catch (err) {
    if (badge) {
      badge.className = "status-badge status-neutral";
      badge.textContent = "Database connection error";
    }
  }
}

async function loadVitals() {
  const container = document.getElementById("vitals-grid");
  try {
    const res = await fetch("/api/vitals");
    const data = await res.json();

    if (!data.success || !data.vitals) {
      container.innerHTML = `<div class="empty-state">Unable to query vitals data.</div>`;
      return;
    }

    container.innerHTML = "";
    data.vitals.forEach(vital => {
      const card = document.createElement("div");
      card.className = "vital-card";
      card.id = `vital-card-${vital.id}`;

      const statusClass = `circle-${(vital.status || "NO_DATA").toLowerCase()}`;

      let currentHtml = "";
      if (vital.latest && vital.latest.value !== null && vital.latest.value !== undefined) {
        currentHtml = `
          <div class="vital-value-row">
            <div class="vital-value">${vital.latest.value}</div>
            <div class="vital-unit">${escapeHtml(vital.unit.toUpperCase())}</div>
          </div>
          <div class="vital-timestamp">Recorded: ${new Date(vital.latest.recorded_at).toLocaleString()}</div>
        `;
      } else {
        currentHtml = `
          <div class="empty-state">No data available</div>
        `;
      }

      let graphHtml = "";
      if (vital.hasGraph) {
        if (vital.history && vital.history.length > 0) {
          graphHtml = `
            <div class="vital-graph-container" id="graph-container-${vital.id}">
              <canvas id="canvas-${vital.id}" class="vital-graph-canvas"></canvas>
            </div>
          `;
        } else {
          graphHtml = `
            <div class="vital-graph-container">
              <div class="empty-graph">No data available</div>
            </div>
          `;
        }
      }

      card.innerHTML = `
        <div class="vital-header">
          <div class="vital-title-group">
            <span class="status-circle ${statusClass}">●</span>
            <span class="vital-title">${escapeHtml(vital.name)}</span>
          </div>
          <div class="vital-unit">${escapeHtml(vital.unit)}</div>
        </div>
        <div class="vital-current">
          ${currentHtml}
        </div>
        ${graphHtml}
      `;

      container.appendChild(card);

      if (vital.hasGraph && vital.history && vital.history.length > 0) {
        renderChart(`canvas-${vital.id}`, vital.history, vital.unit);
      }
    });
  } catch (err) {
    container.innerHTML = `<div class="empty-state">Error connecting to database.</div>`;
  }
}

async function loadEnvironmental() {
  const container = document.getElementById("environmental-grid");
  try {
    const res = await fetch("/api/environmental");
    const data = await res.json();

    if (!data.success || !data.environmental) {
      container.innerHTML = `<div class="empty-state">Unable to query environmental data.</div>`;
      return;
    }

    container.innerHTML = "";
    data.environmental.forEach(param => {
      const card = document.createElement("div");
      card.className = "env-card";
      card.id = `env-card-${param.id}`;

      let readingHtml = "";
      if (param.latest && param.latest.value !== null && param.latest.value !== undefined) {
        readingHtml = `
          <div class="env-value">${param.latest.value} <span class="env-unit">${escapeHtml(param.unit)}</span></div>
        `;
      } else {
        readingHtml = `
          <div class="empty-state">No data available</div>
        `;
      }

      card.innerHTML = `
        <div class="env-header">
          <div class="env-title">${escapeHtml(param.name)}</div>
          <div class="env-unit">${escapeHtml(param.unit)}</div>
        </div>
        <div class="env-reading">
          ${readingHtml}
        </div>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = `<div class="empty-state">Error connecting to database.</div>`;
  }
}

function renderChart(canvasId, history, unit) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = rect.height;
  const padding = { top: 20, right: 20, bottom: 30, left: 45 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const values = history.map(d => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal === minVal ? 1 : maxVal - minVal;

  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = "#2b3542";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, height - padding.bottom);
  ctx.lineTo(width - padding.right, height - padding.bottom);
  ctx.stroke();

  ctx.fillStyle = "#8c9ba8";
  ctx.font = "11px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(maxVal.toFixed(1), padding.left - 8, padding.top + 10);
  ctx.fillText(minVal.toFixed(1), padding.left - 8, height - padding.bottom);

  ctx.strokeStyle = "#3b82f6";
  ctx.lineWidth = 2;
  ctx.beginPath();

  history.forEach((point, i) => {
    const x = padding.left + (i / (history.length - 1 || 1)) * plotWidth;
    const y = padding.top + plotHeight - ((point.value - minVal) / range) * plotHeight;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  ctx.fillStyle = "#3b82f6";
  history.forEach((point, i) => {
    const x = padding.left + (i / (history.length - 1 || 1)) * plotWidth;
    const y = padding.top + plotHeight - ((point.value - minVal) / range) * plotHeight;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

window.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash.replace("#", "") || "home";
  navigateTo(hash);
});
```

---

## 11. Documentation Guide (`README.md`)

```markdown
# Astronaut Health & Environmental Monitoring Application

A minimal, clean, 3-page astronaut physiological and environmental monitoring web application directly connected to a real Turso database.

### Quick Start
```bash
node server.mjs
```
Open http://localhost:3000 in your browser.
```
