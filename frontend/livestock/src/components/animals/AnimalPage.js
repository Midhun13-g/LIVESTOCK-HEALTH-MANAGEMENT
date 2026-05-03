import React, { useState, useEffect, useMemo } from "react";
import Addanimals from "./Addanimals";
import AnimalList from "./AnimalList";
import "./AnimalPage.css";
import api from "../../api";
import { getSettings } from "../../contexts/settings";

const AnimalPage = () => {
  const [animals, setAnimals]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(() => { const s = getSettings(); return { species: "", status: s.animals.defaultStatus, sortBy: s.animals.defaultSort, checkupStatus: "" }; });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchAnimals = () => {
    setLoading(true);
    api.get("/animals/")
      .then((res) => setAnimals(res.data))
      .catch((err) => {
        if (err.response?.status === 404) setAnimals([]);
        else setError("Failed to load animals.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAnimals(); }, []);

  // Bug fix: handleAddAnimal only updates state — Addanimals already posted to API
  const handleAddAnimal = (newAnimal) => {
    setAnimals((prev) => [...prev, newAnimal]);
    setIsModalOpen(false);
  };

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

  const resetFilters = () => setFilters({ species: "", status: "", sortBy: "checkup_asc", checkupStatus: "" });

  // Bug fix: use useMemo so applyFilters only runs once per render
  const filtered = useMemo(() => {
    let list = [...animals];
    if (searchQuery)    list = list.filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filters.species)       list = list.filter((a) => a.species.toLowerCase() === filters.species.toLowerCase());
    if (filters.status)        list = list.filter((a) => a.status.toLowerCase() === filters.status.toLowerCase());
    if (filters.checkupStatus) list = list.filter((a) => a.checkup_status === filters.checkupStatus);
    if (filters.sortBy === "name")         list.sort((a, b) => a.name.localeCompare(b.name));
    if (filters.sortBy === "checkup_asc")  list.sort((a, b) => new Date(a.next_checkup) - new Date(b.next_checkup));
    if (filters.sortBy === "checkup_desc") list.sort((a, b) => new Date(b.next_checkup) - new Date(a.next_checkup));
    return list;
  }, [animals, searchQuery, filters]);

  const hasActiveFilters = filters.species || filters.status || filters.checkupStatus || filters.sortBy !== "checkup_asc";

  if (loading) return <div className="animal-page"><p className="ap-state">Loading animals...</p></div>;
  if (error)   return <div className="animal-page"><p className="ap-state error">{error}</p></div>;

  return (
    <div className="animal-page">

      {/* Top bar */}
      <div className="top-bar">
        <button onClick={() => setIsModalOpen(true)} className="add-animal-btn">+ Add Animal</button>
        <button onClick={() => setIsFilterOpen(true)} className={`filter-btn ${hasActiveFilters ? "filter-btn-active" : ""}`}>
          ⚙ Filters {hasActiveFilters && <span className="filter-badge">●</span>}
        </button>
        {hasActiveFilters && (
          <button onClick={resetFilters} className="reset-btn">✕ Reset</button>
        )}
      </div>

      {/* Search */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search animals by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
      </div>

      {/* Animal list */}
      {filtered.length === 0
        ? <p className="ap-state">No animals found.</p>
        : <AnimalList animals={filtered} onRemove={handleRemove} onSave={handleSave} />
      }

      {/* Add animal modal */}
      {isModalOpen && (
        <Addanimals onClose={() => setIsModalOpen(false)} onAdd={handleAddAnimal} />
      )}

      {/* Filter modal */}
      {isFilterOpen && (
        <div className="filter-overlay" onClick={(e) => e.target === e.currentTarget && setIsFilterOpen(false)}>
          <div className="filter-modal">
            <div className="filter-modal-header">
              <h3>Filter Animals</h3>
              <button className="filter-close-x" onClick={() => setIsFilterOpen(false)}>✕</button>
            </div>
            <div className="filter-options">
              <div className="filter-option-group">
                <label className="filter-label">Species</label>
                <select value={filters.species} onChange={(e) => setFilters({ ...filters, species: e.target.value })}>
                  <option value="">All Species</option>
                  <option value="Cow">🐄 Cow</option>
                  <option value="Cattle">🐄 Cattle</option>
                  <option value="Pig">🐷 Pig</option>
                  <option value="Sheep">🐑 Sheep</option>
                  <option value="Goat">🐐 Goat</option>
                  <option value="Horse">🐴 Horse</option>
                  <option value="Chicken">🐔 Chicken</option>
                </select>
              </div>
              <div className="filter-option-group">
                <label className="filter-label">Checkup Status</label>
                <select value={filters.checkupStatus} onChange={(e) => setFilters({ ...filters, checkupStatus: e.target.value })}>
                  <option value="">All</option>
                  <option value="overdue">🔴 Overdue</option>
                  <option value="today">🟠 Today</option>
                  <option value="upcoming">🟡 Upcoming (7 days)</option>
                  <option value="scheduled">🔵 Scheduled (30 days)</option>
                  <option value="future">🟢 Future</option>
                  <option value="unknown">⚪ No date</option>
                </select>
              </div>
              <div className="filter-option-group">
                <label className="filter-label">Health Status</label>
                <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                  <option value="">All Statuses</option>
                  <option value="healthy">✅ Healthy</option>
                  <option value="treatment">⚠️ Treatment</option>
                  <option value="critical">🚨 Critical</option>
                </select>
              </div>
              <div className="filter-option-group">
                <label className="filter-label">Sort By</label>
                <select value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}>
                  <option value="checkup_asc">Checkup Date ↑ Ascending</option>
                  <option value="checkup_desc">Checkup Date ↓ Descending</option>
                  <option value="name">Name A–Z</option>
                </select>
              </div>
            </div>
            <div className="filter-modal-footer">
              <button className="reset-filters-btn" onClick={() => { resetFilters(); setIsFilterOpen(false); }}>Reset</button>
              <button className="apply-filter-btn" onClick={() => setIsFilterOpen(false)}>Apply Filters</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimalPage;
