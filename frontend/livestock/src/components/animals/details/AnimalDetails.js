import React from 'react';
import { Calendar, Tag } from 'lucide-react';
import AnimalVitals from './AnimalVitals';  // Make sure this component is defined
import HealthTimeline from './HealthTimeline';  // Make sure this component is defined
import PropTypes from 'prop-types';
import './AnimalDetails.css';

const AnimalDetails = ({ animal }) => {
  // Handle the case where animal data is not available yet
  if (!animal) {
    return <div>Loading...</div>;  // You can display a loading message or a placeholder
  }

  // Function to calculate the age of the animal based on its birthDate
  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    return months < 0 ? `${years - 1} years ${12 + months} months` : `${years} years ${months} months`;
  };

  // Example health events for the timeline (can be passed as props or fetched dynamically)
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
    <div className="animal-details-container">
      <div className="animal-details-card">
        <div className="header">
          <div className="title-info">
            <h2 className="animal-name">{animal.name}</h2>
            <div className="info">
              <div className="info-item">
                <Tag className="icon" />
                <span>{animal.breed}</span>
              </div>
              <div className="info-item">
                <Calendar className="icon" />
                <span>Age: {calculateAge(animal.birthDate)}</span>
              </div>
            </div>
          </div>
          <span className={`status-tag ${animal.status}`}>
            {animal.status}
          </span>
        </div>

        {/* Animal vitals component */}
        <AnimalVitals
          heartRate={75}
          temperature={38.5}
          weight={450}
          lastUpdated="2 hours ago"
        />
      </div>

      {/* Health timeline */}
      <div className="health-timeline-card">
        <h3 className="timeline-title">Health Timeline</h3>
        <HealthTimeline events={healthEvents} />
      </div>
    </div>
  );
};

// Prop validation
AnimalDetails.propTypes = {
  animal: PropTypes.shape({
    name: PropTypes.string.isRequired,
    breed: PropTypes.string.isRequired,
    birthDate: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

export default AnimalDetails;
