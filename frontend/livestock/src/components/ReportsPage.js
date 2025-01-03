import React from "react";

const SettingsPage = ({ settings, setSettings }) => {
  const toggleSetting = (settingKey) => {
    setSettings((prev) => ({
      ...prev,
      [settingKey]: !prev[settingKey],
    }));
  };

  const toggleChannel = (channel) => {
    setSettings((prev) => ({
      ...prev,
      notificationChannels: {
        ...prev.notificationChannels,
        [channel]: !prev.notificationChannels[channel],
      },
    }));
  };

  return (
    <div className="settings-page">
      <h2>Settings</h2>
      <div className="settings-list">
        {/* Toggle switches for categories */}
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

        {/* Notification channels */}
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
  );
};

export default SettingsPage;
