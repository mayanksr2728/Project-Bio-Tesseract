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
