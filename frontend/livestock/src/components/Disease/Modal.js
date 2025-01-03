import React from "react";
import "./Modal.css"; // Styling for the modal

const Modal = ({ isOpen, onClose, disease }) => {
  if (!isOpen || !disease) return null; // Don't render the modal if it's not open or if no disease is selected

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{disease.name}</h2>
        
        <p><strong>Species:</strong> {disease.species}</p>

        <p><strong>Risk:</strong> {disease.risk}</p> {/* Display risk (e.g., 'high') in the 2nd position */}

        <p><strong>Key Symptoms:</strong></p>
        <ul>
          {disease.keySymptoms.map((symptom, idx) => (
            <li key={idx}>{symptom}</li>
          ))}
        </ul>
        
        <p><strong>Early Warning Signs:</strong></p>
        <ul>
          {disease.earlyWarningSigns.map((sign, idx) => (
            <li key={idx}>{sign}</li>
          ))}
        </ul>

        <p><strong>Detection Timeline:</strong> {disease.detectionTimeline}</p>

        <p><strong>Risk Level:</strong> {disease.riskLevel}</p> {/* Display detailed risk level in the 5th position */}

        <p><strong>Recommended Actions:</strong></p>
        <ul>
          {disease.recommendedActions.map((action, idx) => (
            <li key={idx}>{action}</li>
          ))}
        </ul>

        <p><strong>Prevention Tips:</strong></p>
        <ul>
          {disease.preventionTips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>

        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
