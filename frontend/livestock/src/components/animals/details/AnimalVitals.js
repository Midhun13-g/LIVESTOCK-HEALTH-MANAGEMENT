// AnimalVitals.js
import React from 'react';
import { Heart, Thermometer, Activity, Scale } from 'lucide-react';
import './AnimalVitals.css';

const AnimalVitals = ({ heartRate, temperature, weight, lastUpdated }) => {
  return (
    <div className="vitals-grid">
      <div className="vital-item vital-heart">
        <div className="vital-header">
          <Heart className="vital-icon" />
          <span>Heart Rate</span>
        </div>
        <p className="vital-value">{heartRate} BPM</p>
      </div>

      <div className="vital-item vital-temperature">
        <div className="vital-header">
          <Thermometer className="vital-icon" />
          <span>Temperature</span>
        </div>
        <p className="vital-value">{temperature}°C</p>
      </div>

      <div className="vital-item vital-weight">
        <div className="vital-header">
          <Scale className="vital-icon" />
          <span>Weight</span>
        </div>
        <p className="vital-value">{weight} kg</p>
      </div>

      <div className="vital-item vital-status">
        <div className="vital-header">
          <Activity className="vital-icon" />
          <span>Status</span>
        </div>
        <p className="vital-updated">Updated {lastUpdated}</p>
      </div>
    </div>
  );
};

export default AnimalVitals;
