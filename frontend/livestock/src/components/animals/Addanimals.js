import React, { useState } from 'react';
import { X } from 'lucide-react';
import './Addanimals.css';
import axios from 'axios';

const Addanimals = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    birthDate: '',
    nextCheckup: '',
    weight: '',
    status: 'healthy',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the token from localStorage (or wherever it's stored)
    const token = localStorage.getItem('token');

    if (!token) {
      alert("You must be logged in to add an animal.");
      return;
    }

    const animalData = {
      name: formData.name,
      species: formData.species,
      breed: formData.breed,
      dob: formData.birthDate,
      next_checkup: formData.nextCheckup,
      weight: formData.weight,
      status: formData.status,
    };

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/animals/', 
        animalData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Only call onAdd when the animal was successfully added
      if (onAdd && typeof onAdd === 'function') {
        onAdd(response.data); // Pass the new animal data to the parent component
      }

      // Reset form data after submission
      setFormData({
        name: '',
        species: '',
        breed: '',
        birthDate: '',
        nextCheckup: '',
        weight: '',
        status: 'healthy',
      });

      onClose(); // Close the modal after successful submission
    } catch (error) {
      console.error("Error adding animal:", error.response?.data || error.message);
      alert("Failed to add animal. Please check the form and try again.");
    }
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
            <label>Weight (kg)</label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              min="0"
              step="0.1"
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