import React, { useEffect, useState } from "react";
import "./Notification.css";

const Notification = ({ notifications }) => {
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    // Whenever new notifications are passed, append them to the visible list
    setVisibleNotifications((prev) => [...prev, ...notifications]);
  }, [notifications]);

  const dismissNotification = (index) => {
    // Remove a notification when it's dismissed
    setVisibleNotifications((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="notification-container">
      {visibleNotifications.map((notification, index) => (
        <div className="notification-item" key={index}>
          <p>{notification.message}</p>
          <button
            className="dismiss-btn"
            onClick={() => dismissNotification(index)}
          >
            Dismiss
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notification;
