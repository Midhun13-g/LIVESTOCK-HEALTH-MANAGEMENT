import React from 'react';
import { Calendar, Stethoscope, Syringe } from 'lucide-react';
import './HealthTimeline.css';
const HealthTimeline = ({ events }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'checkup':
        return <Stethoscope className="w-5 h-5" />;
      case 'vaccination':
        return <Syringe className="w-5 h-5" />;
      case 'treatment':
        return <Calendar className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="timeline-container">
      {events.map((event) => (
        <div key={event.id} className="timeline-event">
          <div className={`icon-wrapper ${event.status === 'completed' ? 'completed' : 'scheduled'}`}>
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
