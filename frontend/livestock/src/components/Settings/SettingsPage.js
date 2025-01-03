import React from 'react';
import { useNotificationContext } from '../../contexts/NotificationContext';
import './SettingsPage.css';

const SettingsPage = () => {
  const { settings, toggleSetting, toggleChannel } = useNotificationContext();

  return (
    <div className="settings-page">
      <h2>Settings</h2>
      <div className="settings-list">
        {/* Toggle switches for categories */}
        <label>
          Health Monitoring
          <span className="switch">
            <input
              type="checkbox"
              checked={settings.healthMonitoring}
              onChange={() => toggleSetting('healthMonitoring')}
            />
            <span className="slider"></span>
          </span>
        </label>
        <label>
          Vaccination Management
          <span className="switch">
            <input
              type="checkbox"
              checked={settings.vaccinationManagement}
              onChange={() => toggleSetting('vaccinationManagement')}
            />
            <span className="slider"></span>
          </span>
        </label>
        <label>
          Nutrition Tracking
          <span className="switch">
            <input
              type="checkbox"
              checked={settings.nutritionTracking}
              onChange={() => toggleSetting('nutritionTracking')}
            />
            <span className="slider"></span>
          </span>
        </label>
        <label>
          Behavior Analysis
          <span className="switch">
            <input
              type="checkbox"
              checked={settings.behaviorAnalysis}
              onChange={() => toggleSetting('behaviorAnalysis')}
            />
            <span className="slider"></span>
          </span>
        </label>
        <label>
          Team Management
          <span className="switch">
            <input
              type="checkbox"
              checked={settings.teamManagement}
              onChange={() => toggleSetting('teamManagement')}
            />
            <span className="slider"></span>
          </span>
        </label>
        <label>
          Reports & Analytics
          <span className="switch">
            <input
              type="checkbox"
              checked={settings.reportsAnalytics}
              onChange={() => toggleSetting('reportsAnalytics')}
            />
            <span className="slider"></span>
          </span>
        </label>

        {/* Notification channels */}
        <h4>Notification Channels</h4>
        <label>
          Email Notifications
          <span className="switch">
            <input
              type="checkbox"
              checked={settings.notificationChannels.email}
              onChange={() => toggleChannel('email')}
            />
            <span className="slider"></span>
          </span>
        </label>
        <label>
          SMS Alerts
          <span className="switch">
            <input
              type="checkbox"
              checked={settings.notificationChannels.sms}
              onChange={() => toggleChannel('sms')}
            />
            <span className="slider"></span>
          </span>
        </label>
        <label>
          Push Notifications
          <span className="switch">
            <input
              type="checkbox"
              checked={settings.notificationChannels.push}
              onChange={() => toggleChannel('push')}
            />
            <span className="slider"></span>
          </span>
        </label>
      </div>
    </div>
  );
};

export default SettingsPage;
