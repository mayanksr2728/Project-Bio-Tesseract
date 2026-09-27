import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { VITAL_PARAMETERS, ENVIRONMENTAL_PARAMETERS, ORGANS, evaluateVitalStatus } from "./parameters.mjs";
import { initDatabase, getLatestReading, getReadingHistory, insertTelemetryRecord } from "./db.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

// Initialize database schema
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

  // Handle CORS Preflight
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
    // API: GET /api/vitals
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
          latest: latest, // null if no data in DB
          history: history, // [] if no data in DB
          status: status // NO_DATA, NORMAL, WARNING, CRITICAL
        });
      }

      return sendJson(res, 200, {
        success: true,
        hasVitalData: hasAnyData,
        vitals: results,
        organs: organStatusMap
      });
    }

    // API: GET /api/environmental
    if (req.method === "GET" && pathname === "/api/environmental") {
      const results = [];
      for (const param of ENVIRONMENTAL_PARAMETERS) {
        const latest = await getLatestReading(param.id);
        results.push({
          ...param,
          latest: latest // null if no data in DB
        });
      }
      return sendJson(res, 200, { success: true, environmental: results });
    }

    // API: POST /api/telemetry (Ingestion for real data)
    if (req.method === "POST" && pathname === "/api/telemetry") {
      const body = await parseBody(req);
      const { parameter_id, value, unit } = body;
      if (!parameter_id || typeof value !== "number") {
        return sendJson(res, 400, { success: false, error: "parameter_id and numeric value are required" });
      }
      await insertTelemetryRecord(parameter_id, value, unit || "");
      return sendJson(res, 201, { success: true, message: "Telemetry recorded to Turso" });
    }

    // Static Files (Frontend)
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
