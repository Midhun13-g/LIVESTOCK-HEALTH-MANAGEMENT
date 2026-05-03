import React from "react";
import "./DiseaseCard.css";

const RISK_ICONS = { high: "🔴", medium: "🟡", low: "🟢" };

const DiseaseCard = ({ disease, onLearnMore }) => (
  <div className={`dc-card risk-${disease.risk}`}>
    <div className="dc-card-header">
      <h4 className="dc-card-title">{disease.name}</h4>
      <span className={`dc-risk-badge ${disease.risk}`}>
        {RISK_ICONS[disease.risk]} {disease.risk}
      </span>
    </div>

    <span className="dc-species">🐾 {disease.species}</span>

    <div className="dc-symptoms-section">
      <span className="dc-symptoms-label">Key Symptoms</span>
      <div className="dc-symptom-list">
        {disease.keySymptoms.slice(0, 3).map((s, i) => (
          <div key={i} className="dc-symptom-item">
            <span className="dc-symptom-dot" />
            {s}
          </div>
        ))}
      </div>
    </div>

    <button className="dc-learn-btn" onClick={onLearnMore}>
      View Details →
    </button>
  </div>
);

export default DiseaseCard;
