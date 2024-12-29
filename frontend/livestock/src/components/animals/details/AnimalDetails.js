// AnimalDetails.js
import React from 'react';
import { Calendar, Tag } from 'lucide-react';
import AnimalVitals from './AnimalVitals';
import HealthTimeline from './HealthTimeline';
import './AnimalDetails.css';

const calculateAge = (birthDate) => {
  const birth = new Date(birthDate);
  const today = new Date();
  const years = today.getFullYear() - birth.getFullYear();
  const months = today.getMonth() - birth.getMonth();
  return months < 0
    ? `${years - 1} years ${12 + months} months`
    : `${years} years ${months} months`;
};

const AnimalDetails = ({ animal }) => {
  const healthEvents = [
    {
      id: '1',
      date: '2024-03-15',
      type: 'checkup',
      description: 'Regular health checkup',
      status: 'completed',
    },
    {
      id: '2',
      date: '2024-04-01',
      type: 'vaccination',
      description: 'Scheduled vaccination',
      status: 'scheduled',
    },
  ];

  return (
    <div className="animal-details">
      <div className="details-header">
        <div className="header-info">
          <h2 className="animal-name">{animal.name}</h2>
          <div className="animal-meta">
            <div className="meta-item">
              <Tag className="icon" />
              <span>{animal.breed}</span>
            </div>
            <div className="meta-item">
              <Calendar className="icon" />
              <span>Age: {calculateAge(animal.birthDate)}</span>
            </div>
          </div>
        </div>
        <span
          className={`status-label ${
            animal.status === 'healthy'
              ? 'status-healthy'
              : animal.status === 'treatment'
              ? 'status-treatment'
              : 'status-critical'
          }`}
        >
          {animal.status}
        </span>
      </div>

      <AnimalVitals
        heartRate={75}
        temperature={38.5}
        weight={450}
        lastUpdated="2 hours ago"
      />

      <div className="health-timeline">
        <h3>Health Timeline</h3>
        <HealthTimeline events={healthEvents} />
      </div>
    </div>
  );
};

export default AnimalDetails;
