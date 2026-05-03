import React, { useState, useEffect, useCallback } from "react";
import AnimalCard from "./AnimalCard";
import "./Dashboard.css";
import api from "../api";
import { getSettings } from "../contexts/settings";

function Dashboard() {
  const [animals, setAnimals]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [filterStatus, setFilterStatus] = useState(() => getSettings().dashboard.defaultFilter);

  const fetchAnimals = useCallback(() => {
    setLoading(true);
    api.get("/animals/")
      .then((res) => setAnimals(res.data))
      .catch((err) => {
        if (err.response?.status === 404) setAnimals([]);
        else setError("Failed to load animals. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Initial fetch
  useEffect(() => { fetchAnimals(); }, [fetchAnimals]);

  // refetch on focus — controlled by settings
  useEffect(() => {
    if (!getSettings().dashboard.refetchOnFocus) return;
    window.addEventListener("focus", fetchAnimals);
    return () => window.removeEventListener("focus", fetchAnimals);
  }, [fetchAnimals]);

  const handleRemove = async (id) => {
    try {
      await api.delete(`/animals/${id}`);
      setAnimals((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Failed to delete animal.");
    }
  };

  const handleSave = async (updated) => {
    try {
      const res = await api.put(`/animals/${updated.id}`, updated);
      setAnimals((prev) => prev.map((a) => (a.id === updated.id ? res.data : a)));
    } catch {
      alert("Failed to update animal.");
    }
  };

  const filtered = filterStatus
    ? animals.filter((a) => a.status === filterStatus)
    : animals;

  if (loading) return <div className="dashboard-container"><p className="state-msg">Loading animals...</p></div>;
  if (error)   return <div className="dashboard-container"><p className="state-msg error">{error}</p></div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Livestock Health Management</h1>
        <div className="filter-section">
          <select
            className="filter-dropdown"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Animals</option>
            <option value="healthy">✅ Healthy</option>
            <option value="treatment">⚠️ Treatment</option>
            <option value="critical">🚨 Critical</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="state-msg">
          {filterStatus ? `No ${filterStatus} animals found.` : "No animals found. Add animals from the Animals page."}
        </p>
      ) : (
        <div className="animal-cards-container">
          {filtered.map((animal) => (
            <AnimalCard
              key={animal.id}
              {...animal}
              onRemove={handleRemove}
              onSave={handleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
