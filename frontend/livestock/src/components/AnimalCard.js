import React, { useState } from "react";
import "./AnimalCard.css";
import { getSettings } from "../contexts/settings";

const CS = {
  overdue:   { label: "Overdue",              color: "#EF4444", bg: "#FEF2F2", border: "#FECACA" },
  today:     { label: "Today",                color: "#F97316", bg: "#FFF7ED", border: "#FED7AA" },
  upcoming:  { label: "Upcoming",             color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  scheduled: { label: "Scheduled",            color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
  future:    { label: "Future",               color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
  unknown:   { label: "No Checkup Scheduled", color: "#6B7280", bg: "#F9FAFB", border: "#E5E7EB" },
};

const SPECIES_ICONS = {
  Cattle: "🐄", Cow: "🐄", Pig: "🐷", Sheep: "🐑",
  Goat: "🐐", Horse: "🐴", Chicken: "🐔", default: "🐾",
};

const toDateInput = (d) => {
  if (!d) return "";
  try {
    if (typeof d === "string" && d.length >= 10) return d.slice(0, 10);
    return new Date(d).toISOString().slice(0, 10);
  } catch { return ""; }
};

const fmt = (d) => {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString(getSettings().display.dateFormat, { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return "—"; }
};

const calcAge = (d) => {
  if (!d) return "—";
  try {
    const yrs = Math.floor((Date.now() - new Date(d)) / (1000 * 60 * 60 * 24 * 365));
    return yrs < 1 ? "< 1 yr" : `${yrs} yr${yrs > 1 ? "s" : ""}`;
  } catch { return "—"; }
};

function AnimalCard({ id, name, species, breed, status, dob, next_checkup, checkup_status, weight, onRemove, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited]       = useState({ name, species, breed, status, dob, next_checkup, weight });

  const icon      = SPECIES_ICONS[species] || SPECIES_ICONS.default;
  const cs        = CS[checkup_status] || CS.unknown;
  const isOverdue = checkup_status === "overdue";
  const isToday   = checkup_status === "today";

  const handleOpen = () => {
    setEdited({ name, species, breed, status,
      dob: toDateInput(dob),
      next_checkup: toDateInput(next_checkup),
      weight,
    });
    setIsEditing(true);
  };

  const toISO = (d) => {
    if (!d) return null;
    if (d.length > 10) return d;
    return d + "T00:00:00";
  };

  const handleSave = () => {
    onSave({
      id, ...edited,
      dob:          toISO(edited.dob),
      next_checkup: toISO(edited.next_checkup),
      weight:       edited.weight ? parseFloat(edited.weight) : null,
    });
    setIsEditing(false);
  };

  return (
    <>
      <div className={`ac-card ${isOverdue ? "ac-overdue" : ""} ${isToday ? "ac-today" : ""}`}
        style={{ borderLeftColor: cs.color }}>

        {/* ── Header ── */}
        <div className="ac-header">
          <div className="ac-species-icon">{icon}</div>
          <div className="ac-title-group">
            <h3 className="ac-name">{name}</h3>
            <p className="ac-meta">{species}{breed ? ` · ${breed}` : ""}</p>
          </div>
          <span className={`ac-health-badge ac-health-${status}`}>{status}</span>
        </div>

        {/* ── Divider ── */}
        <div className="ac-divider" />

        {/* ── Stats ── */}
        <div className="ac-stats">
          <div className="ac-stat">
            <span className="ac-stat-label">Age</span>
            <span className="ac-stat-value">{calcAge(dob)}</span>
          </div>
          <div className="ac-stat">
            <span className="ac-stat-label">Weight</span>
            <span className="ac-stat-value">{weight ? `${weight} kg` : "—"}</span>
          </div>
          <div className="ac-stat ac-stat-full">
            <span className="ac-stat-label">Date of Birth</span>
            <span className="ac-stat-value">{fmt(dob)}</span>
          </div>
        </div>

        {/* ── Checkup section ── */}
        <div className="ac-checkup" style={{ background: cs.bg, borderColor: cs.border }}>
          <div className="ac-checkup-row">
            <span className="ac-checkup-label">Next Checkup</span>
            <span className="ac-checkup-badge" style={{ color: cs.color, background: cs.bg, borderColor: cs.border }}>
              {cs.label}
            </span>
          </div>
          <span className="ac-checkup-date" style={{ color: cs.color }}>
            {next_checkup ? fmt(next_checkup) : "No date set"}
          </span>
        </div>

        {/* ── Footer ── */}
        <div className="ac-footer">
          <button className="ac-btn ac-btn-edit"   onClick={handleOpen}>✏️ Edit</button>
          <button className="ac-btn ac-btn-delete" onClick={() => onRemove(id)}>🗑️ Remove</button>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {isEditing && (
        <div className="ac-modal-overlay" onClick={(e) => e.target === e.currentTarget && setIsEditing(false)}>
          <div className="ac-modal ac-modal-in">
            <div className="ac-modal-header">
              <div className="ac-modal-header-left">
                <div className="ac-modal-icon">{icon}</div>
                <div>
                  <h3>Edit Animal</h3>
                  <p>{name}</p>
                </div>
              </div>
              <button className="ac-modal-close" onClick={() => setIsEditing(false)}>✕</button>
            </div>

            <div className="ac-modal-body">
              <div className="ac-fields-grid">
                <div className="ac-field">
                  <label>Name</label>
                  <input type="text" value={edited.name || ""} onChange={e => setEdited({ ...edited, name: e.target.value })} />
                </div>
                <div className="ac-field">
                  <label>Species</label>
                  <select value={edited.species || ""} onChange={e => setEdited({ ...edited, species: e.target.value })}>
                    <option value="">Select species</option>
                    <option value="Cow">🐄 Cow</option>
                    <option value="Cattle">🐄 Cattle</option>
                    <option value="Pig">🐷 Pig</option>
                    <option value="Sheep">🐑 Sheep</option>
                    <option value="Goat">🐐 Goat</option>
                    <option value="Horse">🐴 Horse</option>
                    <option value="Chicken">🐔 Chicken</option>
                  </select>
                </div>
                <div className="ac-field">
                  <label>Breed</label>
                  <input type="text" value={edited.breed || ""} onChange={e => setEdited({ ...edited, breed: e.target.value })} />
                </div>
                <div className="ac-field">
                  <label>Weight (kg)</label>
                  <input type="number" step="0.1" value={edited.weight || ""} onChange={e => setEdited({ ...edited, weight: e.target.value })} />
                </div>
                <div className="ac-field">
                  <label>Date of Birth</label>
                  <input type="date" value={edited.dob || ""} onChange={e => { const v = e.target.value; setEdited(prev => ({ ...prev, dob: v })); }} autoComplete="off" />
                </div>
                <div className="ac-field">
                  <label>Next Checkup</label>
                  <input type="date" value={edited.next_checkup || ""} onChange={e => { const v = e.target.value; setEdited(prev => ({ ...prev, next_checkup: v })); }} autoComplete="off" />
                </div>
                <div className="ac-field ac-field-full">
                  <label>Status</label>
                  <select value={edited.status || "healthy"} onChange={e => setEdited({ ...edited, status: e.target.value })}>
                    <option value="healthy">✅ Healthy</option>
                    <option value="treatment">🟡 Treatment</option>
                    <option value="critical">🔴 Critical</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="ac-modal-footer">
              <button className="ac-btn ac-btn-save"   onClick={handleSave}>💾 Save Changes</button>
              <button className="ac-btn ac-btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AnimalCard;
