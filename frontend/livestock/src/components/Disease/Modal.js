import React from "react";
import "./Modal.css"; // Import the advanced modal CSS

const Modal = ({ isOpen, onClose, disease }) => {
  if (!isOpen || !disease) return null; // Don't render the modal if it's not open or if no disease is selected

  // Get the appropriate risk level class
  const getRiskLevelClass = (riskLevel) => {
    if (riskLevel.toLowerCase() === "high risk") return "risk-level high";
    if (riskLevel.toLowerCase() === "low risk") return "risk-level low";
    return "risk-level"; // Default styling
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header with title */}
        <h2>{disease.name}</h2>

        {/* Close button */}
        <button className="close-button" onClick={onClose} title="Close">
          &times;
        </button>

        {/* Species */}
        <p>
          <strong>Species:</strong> {disease.species}
        </p>

        {/* Risk Level */}
        <p>
          <strong>Risk Level:</strong>{" "}
          <span className={getRiskLevelClass(disease.riskLevel)}>
            {disease.riskLevel}
          </span>
        </p>

        {/* Early Warning Signs */}
        <p>
          <strong>Early Warning Signs:</strong>
        </p>
        <ul>
          {disease.earlyWarningSigns.map((sign, idx) => (
            <li key={idx}>{sign}</li>
          ))}
        </ul>

        {/* Detection Timeline */}
        <p>
          <strong>Detection Timeline:</strong> {disease.detectionTimeline}
        </p>

        {/* Recommended Actions */}
        <p>
          <strong>Recommended Actions:</strong>
        </p>
        <ul>
          {disease.recommendedActions.map((action, idx) => (
            <li key={idx}>{action}</li>
          ))}
        </ul>

        {/* Prevention Tips */}
        <p>
          <strong>Prevention Tips:</strong>
        </p>
        <ul>
          {disease.preventionTips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Modal;
