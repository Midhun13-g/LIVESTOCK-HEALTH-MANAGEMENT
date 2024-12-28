import React, { useState, useEffect, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./SettingsPage.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SettingsPage() {
  const [healthAlerts, setHealthAlerts] = useState(true);
  const [diseaseOutbreaks, setDiseaseOutbreaks] = useState(true);
  const [trackWeight, setTrackWeight] = useState(true);
  const [trackTemperature, setTrackTemperature] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);
  const [alertFrequency, setAlertFrequency] = useState("daily");
  const [notification, setNotification] = useState("");

  // Load settings from localStorage
  useEffect(() => {
    setHealthAlerts(localStorage.getItem("healthAlerts") === "true" || true);
    setDiseaseOutbreaks(localStorage.getItem("diseaseOutbreaks") === "true" || true);
    setTrackWeight(localStorage.getItem("trackWeight") === "true" || true);
    setTrackTemperature(localStorage.getItem("trackTemperature") === "true" || false);
    setDataSharing(localStorage.getItem("dataSharing") === "true" || false);
    setAlertFrequency(localStorage.getItem("alertFrequency") || "daily");
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("healthAlerts", healthAlerts);
    localStorage.setItem("diseaseOutbreaks", diseaseOutbreaks);
    localStorage.setItem("trackWeight", trackWeight);
    localStorage.setItem("trackTemperature", trackTemperature);
    localStorage.setItem("dataSharing", dataSharing);
    localStorage.setItem("alertFrequency", alertFrequency);
  }, [healthAlerts, diseaseOutbreaks, trackWeight, trackTemperature, dataSharing, alertFrequency]);

  // Display notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Handle setting change with feedback
  const handleSettingChange = (setter, value, message) => {
    setter(value);
    setNotification(message);
  };

  // Memoized data visualization for weight tracking
  const chartData = useMemo(() => ({
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Animal Weight (kg)",
        data: [150, 160, 165, 170],
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  }), []);

  const chartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  }), []);

  return (
    <div className="settings">
      <h2 className="settings-title">Livestock Health Management Settings</h2>

      {/* Notifications */}
      {notification && <div className="notification">{notification}</div>}

      {/* Health Alerts */}
      <div className="setting-option">
        <label htmlFor="healthAlerts" className="setting-label">Health Alerts</label>
        <div className="switch">
          <input
            type="checkbox"
            id="healthAlerts"
            checked={healthAlerts}
            onChange={() => handleSettingChange(setHealthAlerts, !healthAlerts, "Health Alerts updated")}
          />
          <span className="slider"></span>
        </div>
      </div>

      {/* Disease Outbreak Notifications */}
      <div className="setting-option">
        <label htmlFor="diseaseOutbreaks" className="setting-label">Disease Outbreaks Notifications</label>
        <div className="switch">
          <input
            type="checkbox"
            id="diseaseOutbreaks"
            checked={diseaseOutbreaks}
            onChange={() => handleSettingChange(setDiseaseOutbreaks, !diseaseOutbreaks, "Disease Outbreaks Notifications updated")}
          />
          <span className="slider"></span>
        </div>
      </div>

      {/* Track Weight */}
      <div className="setting-option">
        <label htmlFor="trackWeight" className="setting-label">Track Weight</label>
        <div className="switch">
          <input
            type="checkbox"
            id="trackWeight"
            checked={trackWeight}
            onChange={() => handleSettingChange(setTrackWeight, !trackWeight, "Weight Tracking updated")}
          />
          <span className="slider"></span>
        </div>
      </div>

      {/* Track Temperature */}
      <div className="setting-option">
        <label htmlFor="trackTemperature" className="setting-label">Track Temperature</label>
        <div className="switch">
          <input
            type="checkbox"
            id="trackTemperature"
            checked={trackTemperature}
            onChange={() => handleSettingChange(setTrackTemperature, !trackTemperature, "Temperature Tracking updated")}
          />
          <span className="slider"></span>
        </div>
      </div>

      {/* Data Sharing with Veterinarians */}
      <div className="setting-option">
        <label htmlFor="dataSharing" className="setting-label">Data Sharing with Veterinarians</label>
        <div className="switch">
          <input
            type="checkbox"
            id="dataSharing"
            checked={dataSharing}
            onChange={() => handleSettingChange(setDataSharing, !dataSharing, "Data Sharing updated")}
          />
          <span className="slider"></span>
        </div>
      </div>

      {/* Alert Frequency */}
      <div className="setting-option">
        <label htmlFor="alertFrequency" className="setting-label">Alert Frequency</label>
        <select
          id="alertFrequency"
          value={alertFrequency}
          onChange={(e) => handleSettingChange(setAlertFrequency, e.target.value, "Alert Frequency updated")}
          className="select"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Data Visualization: Weight Tracking */}
      {trackWeight && (
        <div className="chart-container">
          <h3>Animal Weight Tracking</h3>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}

export default SettingsPage;
