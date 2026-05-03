import React, { useEffect, useState, useMemo } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title
} from "chart.js";
import api from "../api";
import "./ReportsPage.css";
import { getSettings } from "../contexts/settings";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const HEALTH_COLORS = { healthy: "#16a34a", treatment: "#d97706", critical: "#dc2626" };
const HEALTH_BG     = { healthy: "#f0fdf4", treatment: "#fffbeb", critical: "#fef2f2" };
const HEALTH_ICONS  = { healthy: "✓", treatment: "⚕", critical: "!" };

const CHECKUP_COLORS = {
  overdue: "#ef4444", today: "#f97316", upcoming: "#eab308",
  scheduled: "#3b82f6", future: "#22c55e", unknown: "#94a3b8",
};
const CHECKUP_LABELS = {
  overdue: "Overdue", today: "Today", upcoming: "Upcoming (7d)",
  scheduled: "Scheduled (30d)", future: "Future", unknown: "No Date",
};

const SPECIES_PALETTE = ["#3b82f6","#8b5cf6","#f97316","#06b6d4","#84cc16","#f43f5e","#14b8a6","#f59e0b"];

const DEFAULT_FILTERS = {
  search: "", species: "", healthStatus: [], checkupStatus: "", dateRange: "", urgentOnly: false,
};

const fmt = (d) => {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString(getSettings().display.dateFormat, { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return "—"; }
};

const daysUntil = (d) => {
  if (!d) return null;
  return Math.round((new Date(d) - new Date()) / 86400000);
};

const inDateRange = (dateStr, range) => {
  if (!range || !dateStr) return true;
  const d    = new Date(dateStr);
  const now  = new Date();
  const day  = 86400000;
  if (range === "last7")   return d >= new Date(now - 7  * day) && d <= now;
  if (range === "last30")  return d >= new Date(now - 30 * day) && d <= now;
  if (range === "next7")   return d >= now && d <= new Date(+now + 7  * day);
  if (range === "next30")  return d >= now && d <= new Date(+now + 30 * day);
  return true;
};

// ── Recompute chart data from filtered animals ──────────────────────────────
const buildCharts = (animals) => {
  const healthCounts  = {};
  const speciesCounts = {};
  const weightGroups  = {};
  const checkupCounts = {};

  animals.forEach(a => {
    healthCounts[a.status]   = (healthCounts[a.status]   || 0) + 1;
    speciesCounts[a.species] = (speciesCounts[a.species] || 0) + 1;
    const cs = a.checkup_status || "unknown";
    checkupCounts[cs] = (checkupCounts[cs] || 0) + 1;
    if (a.weight) {
      weightGroups[a.species] = weightGroups[a.species] || [];
      weightGroups[a.species].push(a.weight);
    }
  });

  const hd = Object.entries(healthCounts).filter(([,v]) => v > 0);
  const healthData = hd.length ? {
    labels: hd.map(([k]) => k),
    datasets: [{ data: hd.map(([,v]) => v), backgroundColor: hd.map(([k]) => HEALTH_COLORS[k] || "#94a3b8"), borderColor: "#fff", borderWidth: 3, hoverOffset: 8 }],
  } : null;

  const spd = Object.entries(speciesCounts);
  const speciesData = spd.length ? {
    labels: spd.map(([k]) => k),
    datasets: [{ label: "Animals", data: spd.map(([,v]) => v), backgroundColor: spd.map((_, i) => SPECIES_PALETTE[i % SPECIES_PALETTE.length]), borderRadius: 6, borderSkipped: false }],
  } : null;

  const order = ["overdue","today","upcoming","scheduled","future","unknown"];
  const checkupBreakdown = order.map(s => ({ status: s, count: checkupCounts[s] || 0 })).filter(d => d.count > 0);

  const wd = Object.entries(weightGroups).map(([sp, ws]) => ({ species: sp, avg_weight: Math.round(ws.reduce((a,b)=>a+b,0)/ws.length*10)/10 }));
  const weightData = wd.length ? {
    labels: wd.map(d => d.species),
    datasets: [{ label: "Avg Weight (kg)", data: wd.map(d => d.avg_weight), backgroundColor: wd.map((_,i) => SPECIES_PALETTE[i%SPECIES_PALETTE.length]+"cc"), borderColor: wd.map((_,i) => SPECIES_PALETTE[i%SPECIES_PALETTE.length]), borderWidth: 1.5, borderRadius: 6 }],
  } : null;

  return { healthData, speciesData, checkupBreakdown, weightData };
};

// ── Component ────────────────────────────────────────────────────────────────
const ReportsPage = () => {
  const [allAnimals,   setAllAnimals]   = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [filters,      setFilters]      = useState(DEFAULT_FILTERS);
  const [filtersOpen,  setFiltersOpen]  = useState(false);

  useEffect(() => {
    api.get("/animals/")
      .then(res => setAllAnimals(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setFilter = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));

  const toggleHealth = (s) => setFilters(prev => ({
    ...prev,
    healthStatus: prev.healthStatus.includes(s)
      ? prev.healthStatus.filter(x => x !== s)
      : [...prev.healthStatus, s],
  }));

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  const activeChips = useMemo(() => {
    const chips = [];
    if (filters.search)                chips.push({ key: "search",       label: `"${filters.search}"` });
    if (filters.species)               chips.push({ key: "species",      label: filters.species });
    filters.healthStatus.forEach(s =>  chips.push({ key: `hs_${s}`,     label: s, removeKey: "hs", removeVal: s }));
    if (filters.checkupStatus)         chips.push({ key: "checkupStatus",label: CHECKUP_LABELS[filters.checkupStatus] });
    if (filters.dateRange)             chips.push({ key: "dateRange",    label: { last7:"Last 7d", last30:"Last 30d", next7:"Next 7d", next30:"Next 30d" }[filters.dateRange] });
    if (filters.urgentOnly)            chips.push({ key: "urgentOnly",   label: "Urgent Only" });
    return chips;
  }, [filters]);

  const removeChip = (chip) => {
    if (chip.removeKey === "hs") toggleHealth(chip.removeVal);
    else setFilter(chip.key, chip.key === "healthStatus" ? [] : chip.key === "urgentOnly" ? false : "");
  };

  // ── Apply filters ──
  const filtered = useMemo(() => {
    return allAnimals.filter(a => {
      if (filters.search      && !a.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.species     && a.species !== filters.species) return false;
      if (filters.healthStatus.length && !filters.healthStatus.includes(a.status)) return false;
      if (filters.checkupStatus && a.checkup_status !== filters.checkupStatus) return false;
      if (filters.dateRange   && !inDateRange(a.next_checkup, filters.dateRange)) return false;
      if (filters.urgentOnly  && !["overdue","today","critical"].includes(a.checkup_status) && a.status !== "critical") return false;
      return true;
    });
  }, [allAnimals, filters]);

  // ── Derived data ──
  const { healthData, speciesData, checkupBreakdown, weightData } = useMemo(() => buildCharts(filtered), [filtered]);

  const summary = useMemo(() => ({
    total:     filtered.length,
    healthy:   filtered.filter(a => a.status === "healthy").length,
    treatment: filtered.filter(a => a.status === "treatment").length,
    critical:  filtered.filter(a => a.status === "critical").length,
    overdue:   filtered.filter(a => a.checkup_status === "overdue").length,
  }), [filtered]);

  const checkups = useMemo(() =>
    [...filtered].filter(a => a.next_checkup).sort((a,b) => new Date(a.next_checkup) - new Date(b.next_checkup)),
  [filtered]);

  const healthPct = summary.total > 0 ? Math.round(summary.healthy / summary.total * 100) : 0;
  const hasFilters = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);
  const rs = getSettings().reports;

  if (loading) return (
    <div className="rp-page">
      <div className="rp-loading"><div className="rp-spinner" /><p>Loading analytics...</p></div>
    </div>
  );

  return (
    <div className="rp-page">

      {/* ── Header ── */}
      <div className="rp-header">
        <div>
          <h1>Analytics & Reports</h1>
          <p>Interactive overview of your livestock health and checkup status</p>
        </div>
        <div className="rp-header-actions">
          <button className={`rp-filter-toggle ${filtersOpen ? "active" : ""} ${hasFilters ? "has-filters" : ""}`}
            onClick={() => setFiltersOpen(p => !p)}>
            ⚙ Filters {hasFilters && <span className="rp-filter-dot" />}
          </button>
          {hasFilters && <button className="rp-clear-btn" onClick={clearFilters}>✕ Clear</button>}
        </div>
      </div>

      {/* ── Quick filters ── */}
      <div className="rp-quick-filters">
        <span className="rp-qf-label">Quick:</span>
        {[
          { label: "🔴 Overdue",  action: () => setFilter("checkupStatus", filters.checkupStatus === "overdue" ? "" : "overdue") , active: filters.checkupStatus === "overdue" },
          { label: "🚨 Critical", action: () => toggleHealth("critical"),  active: filters.healthStatus.includes("critical") },
          { label: "📅 Today",    action: () => setFilter("checkupStatus", filters.checkupStatus === "today" ? "" : "today"),    active: filters.checkupStatus === "today" },
          { label: "⚠ Urgent",   action: () => setFilter("urgentOnly", !filters.urgentOnly), active: filters.urgentOnly },
        ].map(q => (
          <button key={q.label} className={`rp-qf-btn ${q.active ? "rp-qf-active" : ""}`} onClick={q.action}>{q.label}</button>
        ))}
      </div>

      {/* ── Filter panel ── */}
      {filtersOpen && (
        <div className="rp-filter-panel">
          <div className="rp-filter-grid">
            <div className="rp-filter-group">
              <label>Search</label>
              <input type="text" placeholder="Animal name..." value={filters.search}
                onChange={e => setFilter("search", e.target.value)} className="rp-filter-input" />
            </div>
            <div className="rp-filter-group">
              <label>Species</label>
              <select value={filters.species} onChange={e => setFilter("species", e.target.value)} className="rp-filter-select">
                <option value="">All Species</option>
                {["Cow","Cattle","Pig","Goat","Sheep","Chicken","Horse"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="rp-filter-group">
              <label>Health Status</label>
              <div className="rp-pill-group">
                {["healthy","treatment","critical"].map(s => (
                  <button key={s} className={`rp-pill ${filters.healthStatus.includes(s) ? "rp-pill-active" : ""}`}
                    style={filters.healthStatus.includes(s) ? { background: HEALTH_COLORS[s], color: "#fff", borderColor: HEALTH_COLORS[s] } : {}}
                    onClick={() => toggleHealth(s)}>{s}</button>
                ))}
              </div>
            </div>
            <div className="rp-filter-group">
              <label>Checkup Status</label>
              <select value={filters.checkupStatus} onChange={e => setFilter("checkupStatus", e.target.value)} className="rp-filter-select">
                <option value="">All</option>
                {Object.entries(CHECKUP_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="rp-filter-group">
              <label>Date Range</label>
              <select value={filters.dateRange} onChange={e => setFilter("dateRange", e.target.value)} className="rp-filter-select">
                <option value="">All Time</option>
                <option value="last7">Last 7 days</option>
                <option value="last30">Last 30 days</option>
                <option value="next7">Next 7 days</option>
                <option value="next30">Next 30 days</option>
              </select>
            </div>
            <div className="rp-filter-group rp-filter-toggle-row">
              <label>Show Urgent Only</label>
              <label className="rp-toggle">
                <input type="checkbox" checked={filters.urgentOnly} onChange={e => setFilter("urgentOnly", e.target.checked)} />
                <span className="rp-toggle-slider" />
              </label>
            </div>
          </div>
          <button className="rp-apply-btn" onClick={() => setFiltersOpen(false)}>Apply Filters</button>
        </div>
      )}

      {/* ── Active chips ── */}
      {activeChips.length > 0 && (
        <div className="rp-chips">
          {activeChips.map(chip => (
            <span key={chip.key} className="rp-chip">
              {chip.label}
              <button onClick={() => removeChip(chip)}>✕</button>
            </span>
          ))}
          <button className="rp-chip-clear" onClick={clearFilters}>Clear all</button>
        </div>
      )}

      {/* ── Empty state ── */}
      {filtered.length === 0 ? (
        <div className="rp-empty">
          <span>📊</span>
          <p>No data available for selected filters</p>
          <button onClick={clearFilters}>Clear Filters</button>
        </div>
      ) : (
        <>
          {/* ── Summary cards ── */}
          <div className="rp-summary-grid">
            <div className="rp-summary-card rp-card-total">
              <div className="rp-sc-icon">🐾</div>
              <div className="rp-sc-body">
                <span className="rp-sc-label">Total Animals</span>
                <span className="rp-sc-value">{summary.total}</span>
                {hasFilters && <span className="rp-sc-pct">of {allAnimals.length} total</span>}
              </div>
            </div>
            {["healthy","treatment","critical"].map(s => (
              <div key={s} className="rp-summary-card" style={{ borderLeftColor: HEALTH_COLORS[s], background: HEALTH_BG[s] }}>
                <div className="rp-sc-icon" style={{ background: HEALTH_COLORS[s]+"22", color: HEALTH_COLORS[s] }}>{HEALTH_ICONS[s]}</div>
                <div className="rp-sc-body">
                  <span className="rp-sc-label" style={{ color: HEALTH_COLORS[s] }}>{s.charAt(0).toUpperCase()+s.slice(1)}</span>
                  <span className="rp-sc-value" style={{ color: HEALTH_COLORS[s] }}>{summary[s]}</span>
                  <span className="rp-sc-pct">{summary.total > 0 ? Math.round(summary[s]/summary.total*100) : 0}% of filtered</span>
                </div>
              </div>
            ))}
            <div className="rp-summary-card rp-card-overdue">
              <div className="rp-sc-icon">⚠️</div>
              <div className="rp-sc-body">
                <span className="rp-sc-label">Overdue Checkups</span>
                <span className="rp-sc-value rp-overdue-val">{summary.overdue}</span>
                <span className="rp-sc-pct">{summary.overdue > 0 ? "Action required" : "All up to date"}</span>
              </div>
            </div>
            <div className="rp-summary-card rp-card-health">
              <div className="rp-sc-icon">💚</div>
              <div className="rp-sc-body">
                <span className="rp-sc-label">Herd Health Score</span>
                <span className="rp-sc-value">{healthPct}%</span>
                <div className="rp-progress-bar">
                  <div className="rp-progress-fill" style={{ width: `${healthPct}%`, background: healthPct > 70 ? "#16a34a" : healthPct > 40 ? "#d97706" : "#dc2626" }} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Charts row 1 ── */}
          <div className="rp-charts-row">
            {healthData && rs.showHealthPie && (
              <div className="rp-chart-card">
                <div className="rp-chart-header"><h3>Health Distribution</h3><span className="rp-chart-sub">By status</span></div>
                <div className="rp-doughnut-wrap">
                  <Doughnut data={healthData} options={{ cutout: "68%", plugins: { legend: { position: "bottom", labels: { padding: 16, font: { size: 12 } } }, tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw} animals` } } } }} />
                </div>
              </div>
            )}
            {speciesData && rs.showSpeciesChart && (
              <div className="rp-chart-card rp-chart-wide">
                <div className="rp-chart-header"><h3>Animals by Species</h3><span className="rp-chart-sub">Count per species</span></div>
                <Bar data={speciesData} options={{ indexAxis: "y", responsive: true, plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.raw} animals` } } }, scales: { x: { grid: { color: "#f1f5f9" }, ticks: { font: { size: 11 } } }, y: { grid: { display: false }, ticks: { font: { size: 12 } } } } }} />
              </div>
            )}
          </div>

          {/* ── Charts row 2 ── */}
          <div className="rp-charts-row">
            {checkupBreakdown.length > 0 && (
              <div className="rp-chart-card rp-chart-wide">
                <div className="rp-chart-header"><h3>Checkup Status Breakdown</h3><span className="rp-chart-sub">All animals by next checkup</span></div>
                <div className="rp-breakdown-list">
                  {checkupBreakdown.map(({ status, count }) => {
                    const total = checkupBreakdown.reduce((a,b) => a+b.count, 0);
                    const pct   = total > 0 ? Math.round(count/total*100) : 0;
                    return (
                      <div key={status} className={`rp-breakdown-row ${filters.checkupStatus === status ? "rp-bd-active" : ""}`}
                        onClick={() => setFilter("checkupStatus", filters.checkupStatus === status ? "" : status)}
                        title="Click to filter">
                        <span className="rp-bd-label">{CHECKUP_LABELS[status]}</span>
                        <div className="rp-bd-bar-wrap"><div className="rp-bd-bar" style={{ width: `${pct}%`, background: CHECKUP_COLORS[status] }} /></div>
                        <span className="rp-bd-count" style={{ color: CHECKUP_COLORS[status] }}>{count}</span>
                        <span className="rp-bd-pct">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {weightData && (
              <div className="rp-chart-card">
                <div className="rp-chart-header"><h3>Avg Weight by Species</h3><span className="rp-chart-sub">Kilograms</span></div>
                <Bar data={weightData} options={{ responsive: true, plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.raw} kg avg` } } }, scales: { x: { grid: { display: false }, ticks: { font: { size: 11 } } }, y: { grid: { color: "#f1f5f9" }, ticks: { font: { size: 11 }, callback: v => `${v} kg` } } } }} />
              </div>
            )}
          </div>

          {/* ── Table ── */}
          {rs.showUpcomingCheckups && (
            <div className="rp-table-card">
              <div className="rp-chart-header">
                <h3>Checkup Timeline</h3>
                <span className="rp-chart-sub">{checkups.length} animals</span>
              </div>
              {checkups.length === 0 ? (
                <p className="rp-table-empty">No animals match the current filters.</p>
              ) : (
                <div className="rp-table-wrap">
                  <table className="rp-table">
                    <thead>
                      <tr><th>Animal</th><th>Species</th><th>Next Checkup</th><th>Due In</th><th>Checkup Status</th><th>Health</th></tr>
                    </thead>
                    <tbody>
                      {checkups.map(a => {
                        const days = daysUntil(a.next_checkup);
                        const cs   = a.checkup_status || "unknown";
                        return (
                          <tr key={a.id}>
                            <td className="rp-td-name">{a.name}</td>
                            <td>{a.species}</td>
                            <td>{fmt(a.next_checkup)}</td>
                            <td><span className="rp-days" style={{ color: CHECKUP_COLORS[cs] }}>{days === null ? "—" : days < 0 ? `${Math.abs(days)}d ago` : days === 0 ? "Today" : `${days}d`}</span></td>
                            <td><span className="rp-cs-badge" style={{ color: CHECKUP_COLORS[cs], background: CHECKUP_COLORS[cs]+"18", borderColor: CHECKUP_COLORS[cs]+"44" }}>{CHECKUP_LABELS[cs]}</span></td>
                            <td><span className="rp-health-badge" style={{ color: HEALTH_COLORS[a.status]||"#64748b", background: HEALTH_BG[a.status]||"#f8fafc" }}>{a.status}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReportsPage;
