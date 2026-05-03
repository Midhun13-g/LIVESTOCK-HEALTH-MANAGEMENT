import React from "react";
import { useNotificationContext } from "../../contexts/NotificationContext";
import "./Notification.css";

const TYPE_ICON = { checkup: "📅", critical: "🚨", prediction: "🔬", general: "🔔" };

const TYPE_COLOR = { checkup: "#2196f3", critical: "#f44336", prediction: "#9c27b0", general: "#607d8b" };

const Notifications = () => {
  const { notifications, unreadCount, markRead, markAllRead, remove } = useNotificationContext();

  return (
    <div className="nc-page">
      <div className="nc-header">
        <div className="nc-title">
          <h2>Notifications</h2>
          {unreadCount > 0 && <span className="nc-count">{unreadCount} unread</span>}
        </div>
        {unreadCount > 0 && (
          <button className="nc-mark-all" onClick={markAllRead}>✓ Mark all as read</button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="nc-empty">
          <span>🔔</span>
          <p>No notifications yet</p>
        </div>
      ) : (
        <div className="nc-list">
          {notifications.map((n) => (
            <div key={n.id} className={`nc-item ${n.read ? "nc-read" : "nc-unread"}`}
              style={{ borderLeftColor: TYPE_COLOR[n.type] || "#607d8b" }}>
              <span className="nc-icon">{TYPE_ICON[n.type] || "🔔"}</span>
              <div className="nc-body">
                <p className="nc-msg">{n.message}</p>
                <small className="nc-time">{new Date(n.created_at).toLocaleString()}</small>
              </div>
              <div className="nc-actions">
                {!n.read && (
                  <button className="nc-btn-read" onClick={() => markRead(n.id)}>✓</button>
                )}
                <button className="nc-btn-del" onClick={() => remove(n.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
