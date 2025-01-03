import React from "react";
import "./DiseaseCard.css";

const DiseaseCard = ({ disease, onLearnMore }) => {
  return (
    <div className="disease-card">
      <h4>{disease.name}</h4>
      <p><strong>Species:</strong> {disease.species}</p>
      <p><strong>Risk :</strong> {disease.risk}</p>
      <p><strong>Key Symptoms:</strong> {disease.keySymptoms.join(", ")}</p>

      {/* Learn More Button */}
      <button onClick={onLearnMore}>Learn More</button>
    </div>
  );
};

export default DiseaseCard;
