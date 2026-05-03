import React from "react";
import "./Modal.css";

const RISK_COLOR = { high: "#dc2626", medium: "#d97706", low: "#16a34a" };
const RISK_BG    = { high: "#fef2f2", medium: "#fffbeb", low: "#f0fdf4" };
const RISK_BORDER = { high: "#fecaca", medium: "#fde68a", low: "#bbf7d0" };

const Section = ({ icon, title, children }) => (
  <div className="dm-section">
    <div className="dm-section-title"><span>{icon}</span>{title}</div>
    {children}
  </div>
);

const ListItems = ({ items, icon }) => (
  <div className="dm-list">
    {items.map((item, i) => (
      <div key={i} className="dm-list-item">
        <span className="dm-list-icon">{icon}</span>
        <span>{item}</span>
      </div>
    ))}
  </div>
);

const Modal = ({ isOpen, onClose, disease }) => {
  if (!isOpen || !disease) return null;

  const riskColor  = RISK_COLOR[disease.risk];
  const riskBg     = RISK_BG[disease.risk];
  const riskBorder = RISK_BORDER[disease.risk];

  return (
    <div className="dm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dm-modal">

        {/* ── Header ── */}
        <div className="dm-modal-header">
          <div className="dm-header-left">
            <h2 className="dm-modal-title">🩺 {disease.name}</h2>
            <div className="dm-header-meta">
              <span className="dm-badge species">🐾 {disease.species}</span>
              <span className="dm-badge" style={{ color: riskColor, background: riskBg, borderColor: riskBorder }}>
                {disease.risk === "high" ? "🔴" : disease.risk === "medium" ? "🟡" : "🟢"} {disease.risk} risk
              </span>
              {disease.zoonotic && (
                <span className="dm-badge zoonotic">⚠️ Zoonotic</span>
              )}
            </div>
          </div>
          <button className="dm-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* ── Body ── */}
        <div className="dm-modal-body">

          {/* Quick stats row */}
          <div className="dm-quick-stats">
            <div className="dm-quick-stat">
              <span className="dm-qs-label">Detection</span>
              <span className="dm-qs-value">⏱ {disease.detectionTimeline}</span>
            </div>
            <div className="dm-quick-stat">
              <span className="dm-qs-label">Mortality Rate</span>
              <span className="dm-qs-value" style={{ color: riskColor }}>💀 {disease.mortalityRate}</span>
            </div>
            <div className="dm-quick-stat">
              <span className="dm-qs-label">Affects Humans</span>
              <span className="dm-qs-value">{disease.zoonotic ? "⚠️ Yes — Zoonotic" : "✅ No"}</span>
            </div>
            <div className="dm-quick-stat">
              <span className="dm-qs-label">Age Groups</span>
              <span className="dm-qs-value">👥 {disease.affectedAgeGroups}</span>
            </div>
          </div>

          {/* Transmission */}
          <Section icon="🔗" title="Transmission">
            <div className="dm-info-box">{disease.transmission}</div>
          </Section>

          {/* Early Warning Signs */}
          <Section icon="⚠️" title="Early Warning Signs">
            <ListItems items={disease.earlyWarningSigns} icon="🔸" />
          </Section>

          {/* Key Symptoms */}
          <Section icon="🤒" title="Key Symptoms">
            <ListItems items={disease.keySymptoms} icon="•" />
          </Section>

          {/* Treatment */}
          <Section icon="💊" title="Treatment">
            <div className="dm-info-box dm-info-box-green">{disease.treatment}</div>
          </Section>

          {/* Recommended Actions */}
          <Section icon="✅" title="Recommended Actions">
            <ListItems items={disease.recommendedActions} icon="✔️" />
          </Section>

          {/* Prevention */}
          <Section icon="🛡️" title="Prevention Tips">
            <ListItems items={disease.preventionTips} icon="💡" />
          </Section>

        </div>
      </div>
    </div>
  );
};

export default Modal;
