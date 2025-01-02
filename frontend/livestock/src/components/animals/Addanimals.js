import React, { useState } from 'react';
import { X } from 'lucide-react';
import './Addanimals.css';

const Addanimals = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    birthDate: '',
    nextCheckup: '',
    status: 'healthy',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAdd && typeof onAdd === 'function') {
      onAdd(formData); // Ensure onAdd is a function before calling it
    }
    setFormData({
      name: '',
      species: '',
      breed: '',
      birthDate: '',
      nextCheckup: '',
      status: 'healthy',
    }); // Reset form data after submit
    onClose(); // Close the modal after submit
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Add New Animal</h2>
          <button onClick={onClose} className="close-btn">
            <X className="icon" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div>
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Species</label>
            <select
              value={formData.species}
              onChange={(e) => setFormData({ ...formData, species: e.target.value })}
              required
            >
              <option value="">Select Species</option>
              <option value="Cattle">Cattle</option>
              <option value="Pig">Pig</option>
              <option value="Sheep">Sheep</option>
            </select>
          </div>
          <div>
            <label>Breed</label>
            <input
              type="text"
              value={formData.breed}
              onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Birth Date</label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Next Checkup</label>
            <input
              type="date"
              value={formData.nextCheckup}
              onChange={(e) => setFormData({ ...formData, nextCheckup: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              required
            >
              <option value="healthy">Healthy</option>
              <option value="treatment">Treatment</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">Add Animal</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Addanimals; 