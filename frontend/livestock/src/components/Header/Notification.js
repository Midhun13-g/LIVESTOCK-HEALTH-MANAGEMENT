import React, { useState } from 'react';
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import { useNotificationContext } from '../../contexts/NotificationContext';
import './Notification.css';

const Notification = () => {
  const { settings } = useNotificationContext();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      category: "health_alert",
      title: "Urgent Health Check Required",
      description: "Cattle #C001 showing signs of respiratory distress",
      date: "2025-01-01",
      status: "unread",
    },
    {
      id: 2,
      category: "vaccination_due",
      title: "Vaccination Due",
      description: "FMD vaccination due for 5 cattle",
      date: "2025-01-02",
      status: "unread",
    },
    {
      id: 3,
      category: "general",
      title: "Meeting Scheduled",
      description: "Quarterly meeting scheduled for tomorrow.",
      date: "2025-01-03",
      status: "unread",
    },
  ]);

  // Filter notifications based on settings
  const filteredNotifications = notifications.filter((notif) => {
    if (
      (notif.category === "health_alert" && settings.healthMonitoring) ||
      (notif.category === "vaccination_due" && settings.vaccinationManagement) ||
      (notif.category === "general")
    ) {
      return true;
    }
    return false;
  });

  // Mark All Notifications as Read
  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({
      ...notif,
      status: 'read',
    })));
  };

  // Handle Accept Action
  const handleAccept = (id) => {
    setNotifications(notifications.map((notif) => 
      notif.id === id ? { ...notif, status: 'accepted' } : notif
    ));
  };

  // Handle Reject Action
  const handleReject = (id) => {
    setNotifications(notifications.map((notif) => 
      notif.id === id ? { ...notif, status: 'rejected' } : notif
    ));
  };

  return (
    <div className="notification-container">
      <h1>Notifications</h1>

      {/* Mark All as Read Button */}
      <button className="mark-all-read" onClick={markAllAsRead}>
        Mark All as Read
      </button>

      {/* Display Notifications */}
      <div className="notification-list">
        {filteredNotifications.length === 0 ? (
          <p className="no-notifications">No notifications to display.</p>
        ) : (
          filteredNotifications.map((notif) => (
            <div key={notif.id} className="notification-item">
              <h3>{notif.title}</h3>
              <p>{notif.description}</p>
              <p className="date">{notif.date}</p>

              {/* Accept/Reject and Status */}
              <div className="icons">
                {notif.status === 'unread' && (
                  <>
                    <FaCheck
                      onClick={() => handleAccept(notif.id)}
                      style={{ color: 'green' }}
                    />
                    <FaTimes
                      onClick={() => handleReject(notif.id)}
                      style={{ color: 'red' }}
                    />
                  </>
                )}
                {notif.status === 'read' && <FaEye style={{ color: 'blue' }} />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;
