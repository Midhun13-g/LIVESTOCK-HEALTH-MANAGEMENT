import React from 'react';
import './Disease.css';

const Disease = () => {
  return (
    <div className="diseases-container">
      <h1 className="diseases-title">Common Diseases and Prevention Tips</h1>
      <div className="disease-list">
        <div className="disease-item">
          <h2>Flu</h2>
          <p>Prevention: Get vaccinated annually, wash hands frequently, and avoid close contact with sick individuals.</p>
        </div>
        <div className="disease-item">
          <h2>Diabetes</h2>
          <p>Prevention: Maintain a healthy weight, exercise regularly, and eat a balanced diet.</p>
        </div>
        <div className="disease-item">
          <h2>Heart Disease</h2>
          <p>Prevention: Avoid smoking, control blood pressure and cholesterol, and stay physically active.</p>
        </div>
        <div className="disease-item">
          <h2>COVID-19</h2>
          <p>Prevention: Wear a mask, practice social distancing, and stay updated with vaccinations.</p>
        </div>
      </div>
    </div>
  );
};

export default Disease;
