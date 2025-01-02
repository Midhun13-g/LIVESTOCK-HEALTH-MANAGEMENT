import React, { useState } from "react";
import "./Notification.css";

const Notification = ({ settings }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      category: "health_alert",
      title: "Urgent Health Check Required",
      description: "Cattle #C001 showing signs of respiratory distress",
      tag: "Animal: #C001",
      priority: "High",
      date: "2025-01-01",
      unread: true,
    },
    {
      id: 2,
      category: "vaccination_due",
      title: "Vaccination Due",
      description: "FMD vaccination due for 5 cattle",
      tag: "Due: 2025-03-20",
      priority: "Medium",
      date: "2025-01-02",
      unread: true,
    },
    {
      id: 3,
      category: "general",
      title: "Meeting Scheduled",
      description: "Quarterly meeting scheduled for tomorrow.",
      tag: "Meeting: #M001",
      priority: "Low",
      date: "2025-01-03",
      unread: false,
    },
  ]);

  const [filter, setFilter] = useState({
    category: "All Categories",
    priority: "All Priorities",
    date: "",
  });

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredNotifications = notifications.filter((notif) => {
    const categoryMatch =
      filter.category === "All Categories" || notif.category === filter.category;

    const priorityMatch =
      filter.priority === "All Priorities" || notif.priority === filter.priority;

    const dateMatch = filter.date === "" || notif.date === filter.date;

    const settingsMatch =
      (notif.category === "health_alert" && settings.healthMonitoring) ||
      (notif.category === "vaccination_due" && settings.vaccinationManagement) ||
      (notif.category === "nutrition" && settings.nutritionTracking) ||
      (notif.category === "behavior" && settings.behaviorAnalysis) ||
      (notif.category === "team" && settings.teamManagement) ||
      (notif.category === "report" && settings.reportsAnalytics);

    return categoryMatch && priorityMatch && dateMatch && settingsMatch;
  });

  const clearAllNotifications = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, unread: false }))
    );
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>Notifications</h2>
        <div className="summary">
          <p>Total Notifications: {notifications.length}</p>
          <p>{notifications.filter((notif) => notif.unread).length} unread</p>
        </div>
      </div>

      <div className="notifications-filters">
        <select
          name="category"
          value={filter.category}
          onChange={handleFilterChange}
        >
          <option value="All Categories">All Categories</option>
          <option value="health_alert">Health Alert</option>
          <option value="vaccination_due">Vaccination Due</option>
          <option value="general">General</option>
        </select>

        <select
          name="priority"
          value={filter.priority}
          onChange={handleFilterChange}
        >
          <option value="All Priorities">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <input
          type="date"
          name="date"
          value={filter.date}
          onChange={handleFilterChange}
        />

        <button className="clear-all" onClick={clearAllNotifications}>
          Mark All as Read
        </button>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <p>No notifications found.</p>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`notification-item ${notif.unread ? "unread" : "read"}`}
            >
              <div className="notification-content">
                <h3>{notif.title}</h3>
                <p>{notif.description}</p>
                <span className="notification-tag">{notif.tag}</span>
                <span className="notification-date">{notif.date}</span>
              </div>
              <div className="notification-actions">
                {notif.unread && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="mark-as-read"
                  >
                    ✔
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notif.id)}
                  className="delete"
                >
                  ✖
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;
