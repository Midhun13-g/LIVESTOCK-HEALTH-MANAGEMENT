import React from 'react';
import './HealthTimeline.css';
import { Calendar, Stethoscope, Syringe } from 'lucide-react';

const HealthTimeline = ({ events }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'checkup':
        return <Stethoscope className="icon" />;
      case 'vaccination':
        return <Syringe className="icon" />;
      case 'treatment':
        return <Calendar className="icon" />;
      default:
        return null;
    }
  };

  return (
    <div className="timeline-container">
      {events.map((event) => (
        <div key={event.id} className="timeline-event">
          <div className={`event-icon ${event.status === 'completed' ? 'completed' : 'scheduled'}`}>
            {getIcon(event.type)}
          </div>
          <div className="event-details">
            <p className="event-description">{event.description}</p>
            <p className="event-date">{event.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HealthTimeline;
