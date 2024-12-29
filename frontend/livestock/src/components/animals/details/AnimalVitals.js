import React from 'react';
import PropTypes from 'prop-types';
import './AnimalVitals.css';

const AnimalVitals = ({ heartRate, temperature, weight, lastUpdated }) => {
  return (
    <div className="animal-vitals">
      <h3>Vitals</h3>
      <ul>
        <li>Heart Rate: {heartRate} bpm</li>
        <li>Temperature: {temperature} °C</li>
        <li>Weight: {weight} kg</li>
        <li>Last Updated: {lastUpdated}</li>
      </ul>
    </div>
  );
};

AnimalVitals.propTypes = {
  heartRate: PropTypes.number.isRequired,
  temperature: PropTypes.number.isRequired,
  weight: PropTypes.number.isRequired,
  lastUpdated: PropTypes.string.isRequired,
};

export default AnimalVitals;
