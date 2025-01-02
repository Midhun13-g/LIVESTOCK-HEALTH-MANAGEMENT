import React, { useState } from "react";
import "./SettingsPage.css";

const SettingsPage = () => {
  // Default settings object
  const defaultSettings = {
    healthMonitoring: false,
    vaccinationManagement: false,
    nutritionTracking: false,
    behaviorAnalysis: false,
    teamManagement: false,
    reportsAnalytics: false,
    notificationChannels: {
      email: false,
      sms: false,
      push: false,
    },
  };

  const [settings, setSettings] = useState(defaultSettings);

  // Toggle settings for each category
  const toggleSetting = (setting) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [setting]: !prevSettings[setting],
    }));
  };

  // Toggle notification channels
  const toggleChannel = (channel) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      notificationChannels: {
        ...prevSettings.notificationChannels,
        [channel]: !prevSettings.notificationChannels[channel],
      },
    }));
  };

  return (
    <div className="settings-page">
      <div className="notifications-settings">
        <h3>Settings</h3>
        <div className="settings-list">
          <label>
            <input
              type="checkbox"
              checked={settings.healthMonitoring}
              onChange={() => toggleSetting("healthMonitoring")}
            />
            Health Monitoring
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.vaccinationManagement}
              onChange={() => toggleSetting("vaccinationManagement")}
            />
            Vaccination Management
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.nutritionTracking}
              onChange={() => toggleSetting("nutritionTracking")}
            />
            Nutrition Tracking
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.behaviorAnalysis}
              onChange={() => toggleSetting("behaviorAnalysis")}
            />
            Behavior Analysis
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.teamManagement}
              onChange={() => toggleSetting("teamManagement")}
            />
            Team Management
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.reportsAnalytics}
              onChange={() => toggleSetting("reportsAnalytics")}
            />
            Reports & Analytics
          </label>

          <h4>Notification Channels</h4>
          <label>
            <input
              type="checkbox"
              checked={settings.notificationChannels.email}
              onChange={() => toggleChannel("email")}
            />
            Email Notifications
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.notificationChannels.sms}
              onChange={() => toggleChannel("sms")}
            />
            SMS Alerts
          </label>
          <label>
            <input
              type="checkbox"
              checked={settings.notificationChannels.push}
              onChange={() => toggleChannel("push")}
            />
            Push Notifications
          </label>
        </div>
      </div>

      {/* Pass settings to Notification component
      <Notification settings={settings} /> */}
    </div>
  );
};

export default SettingsPage;
