import React, { createContext, useState, useContext } from 'react';

// Create a Context for Notifications
const NotificationContext = createContext();

// Custom hook to access notification context
export const useNotificationContext = () => {
  return useContext(NotificationContext);
};

// Provider component to wrap around your app and manage settings
export const NotificationProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    healthMonitoring: true,
    vaccinationManagement: true,
    nutritionTracking: true,
    behaviorAnalysis: true,
    teamManagement: true,
    reportsAnalytics: true,
    notificationChannels: {
      email: true,
      sms: true,
      push: true,
    },
    emailFrequency: "Daily Digest",
  });

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
    <NotificationContext.Provider value={{ settings, toggleSetting, toggleChannel }}>
      {children}
    </NotificationContext.Provider>
  );
};
