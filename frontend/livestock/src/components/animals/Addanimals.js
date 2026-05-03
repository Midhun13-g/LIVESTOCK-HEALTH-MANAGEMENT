import React, { useState } from "react";
import { X } from "lucide-react";
import "./Addanimals.css";
import api from "../../api";

const Addanimals = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "", species: "", breed: "",
    birthDate: "", nextCheckup: "", weight: "", status: "healthy",
  });
  const [submitting, setSubmitting] = useState(false);

  const set = (key, val) => setFormData((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const animalData = {
      name:         formData.name,
      species:      formData.species,
      breed:        formData.breed,
      dob:          formData.birthDate   ? formData.birthDate   + "T00:00:00" : null,
      next_checkup: formData.nextCheckup ? formData.nextCheckup + "T00:00:00" : null,
      weight:       formData.weight      ? parseFloat(formData.weight)        : null,
      status:       formData.status,
    };
    try {
      // Single API call here — onAdd only updates parent state
      const res = await api.post("/animals/", animalData);
      onAdd(res.data);
      onClose();
    } catch (err) {
      console.error("Error adding animal:", err.response?.data || err.message);
      alert("Failed to add animal. Please check the form and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-container">

        <div className="modal-header">
          <h2>Add New Animal</h2>
          <button onClick={onClose} className="close-btn">
            <X className="add-modal-icon" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">

          <div>
            <label>Name *</label>
            <input type="text" value={formData.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Bessie" required />
          </div>

          <div>
            <label>Species *</label>
            <select value={formData.species} onChange={(e) => set("species", e.target.value)} required>
              <option value="">Select Species</option>
              <option value="Cow">🐄 Cow</option>
              <option value="Cattle">🐄 Cattle</option>
              <option value="Pig">🐷 Pig</option>
              <option value="Sheep">🐑 Sheep</option>
              <option value="Goat">🐐 Goat</option>
              <option value="Horse">🐴 Horse</option>
              <option value="Chicken">🐔 Chicken</option>
            </select>
          </div>

          <div>
            <label>Breed *</label>
            <input type="text" value={formData.breed} onChange={(e) => set("breed", e.target.value)} placeholder="e.g. Holstein" required />
          </div>

          <div>
            <label>Birth Date *</label>
            <input type="date" value={formData.birthDate} onChange={(e) => set("birthDate", e.target.value)} required />
          </div>

          <div>
            <label>Next Checkup *</label>
            <input type="date" value={formData.nextCheckup} onChange={(e) => set("nextCheckup", e.target.value)} required />
          </div>

          <div>
            <label>Weight (kg)</label>
            <input type="number" value={formData.weight} onChange={(e) => set("weight", e.target.value)} min="0" step="0.1" placeholder="e.g. 450" />
          </div>

          <div>
            <label>Status *</label>
            <select value={formData.status} onChange={(e) => set("status", e.target.value)} required>
              <option value="healthy">✅ Healthy</option>
              <option value="treatment">⚠️ Treatment</option>
              <option value="critical">🚨 Critical</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? "Adding..." : "Add Animal"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Addanimals;
