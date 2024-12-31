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
  
    // Prepare the data to send to the backend
    const animalData = {
      name: formData.name,
      species: formData.species,
      breed: formData.breed,
      dob: formData.birthDate,  // This will be sent as a date string
      next_checkup: formData.nextCheckup, // This will be sent as a date string
      weight: formData.weight || null,  // Assuming weight is optional
      status: formData.status,
    };
  
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/animals/', 
        animalData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          }
        }
      );
  
      if (onAdd && typeof onAdd === 'function') {
        onAdd(response.data); // Optionally pass the new animal data to the parent component
      }
  
      // Reset form data and close modal after submission
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
