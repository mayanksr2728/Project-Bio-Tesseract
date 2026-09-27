// Client Application Controller

// Page Navigation
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

// Attach Nav Listeners
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const pageId = btn.getAttribute("data-page");
    navigateTo(pageId);
  });
});

// Load Home Page Anatomical Visualization from Turso
async function loadHome() {
  const badge = document.getElementById("body-status-badge");
  const bodyParts = document.querySelectorAll(".body-part");
  const allOrgans = ["brain", "heart", "lungs", "liver", "stomach", "kidneys"];

  try {
    const res = await fetch("/api/vitals");
    const data = await res.json();

    if (!data.success || !data.hasVitalData) {
      // Empty state: No data in database
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

    // Real Data Exists
    const organMap = data.organs || {};
    const vitals = data.vitals || [];

    // Evaluate overall body status
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

    // Body silhouette is healthy green base when data indicates normal overall context
    bodyParts.forEach(part => {
      part.classList.remove("body-neutral");
      part.classList.add("body-normal");
    });

    // Update each organ
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

// Load Vitals Telemetry from Turso
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

      // Status indicator class
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

      // Render chart only if real history data exists
      if (vital.hasGraph && vital.history && vital.history.length > 0) {
        renderChart(`canvas-${vital.id}`, vital.history, vital.unit);
      }
    });
  } catch (err) {
    container.innerHTML = `<div class="empty-state">Error connecting to database.</div>`;
  }
}

// Load Environmental Telemetry from Turso
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

// Minimal Real-Data Line Chart (Canvas)
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

  // Axes
  ctx.strokeStyle = "#2b3542";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, height - padding.bottom);
  ctx.lineTo(width - padding.right, height - padding.bottom);
  ctx.stroke();

  // Y-axis labels
  ctx.fillStyle = "#8c9ba8";
  ctx.font = "11px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(maxVal.toFixed(1), padding.left - 8, padding.top + 10);
  ctx.fillText(minVal.toFixed(1), padding.left - 8, height - padding.bottom);

  // Line
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

  // Data dots
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

// Initial Route
window.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash.replace("#", "") || "home";
  navigateTo(hash);
});
