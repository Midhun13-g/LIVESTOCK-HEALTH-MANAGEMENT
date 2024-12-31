import React from 'react';
import { Users, Activity, Calendar } from 'lucide-react';
import './ProfileStatus.css'; // Import the CSS file

const ProfileStats = () => {
  const stats = [
    { icon: <Users className="icon" />, label: 'Total Animals', value: '156' },
    { icon: <Activity className="icon" />, label: 'Active Treatments', value: '8' },
    { icon: <Calendar className="icon" />, label: 'Scheduled Checkups', value: '12' },
  ];

  return (
    <div className="profile-stats-container">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">{stat.icon}</div>
            <span className="stat-value">{stat.value}</span>
          </div>
          <p className="stat-label">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;
