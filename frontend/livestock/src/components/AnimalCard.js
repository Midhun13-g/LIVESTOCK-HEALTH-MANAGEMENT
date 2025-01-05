import React, { useState } from "react";
import AnimalDetails from "./animals/details/AnimalDetails"; // Import AnimalDetails for detailed info
import "./AnimalCard.css";

function AnimalCard({
  id,
  name,
  type,
  status,
  born,
  nextCheckup,
  insemination,
  onRemove,
  onSave
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [editedAnimal, setEditedAnimal] = useState({
    name,
    type,
    status,
    born,
    nextCheckup,
    insemination,
  });

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    return months < 0 ? `${years - 1} years ${12 + months} months` : `${years} years ${months} months`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedAnimal((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (typeof onSave === "function") {
      onSave(editedAnimal);
      setIsEditing(false);
    } else {
      console.error("onSave is not a function");
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);
  const handleRemove = () => onRemove(id);
  const handleViewDetails = () => setIsViewingDetails(true);
  const handleHideDetails = () => setIsViewingDetails(false);

  return (
    <div className="animal-card">
      <div className="animal-card-details">
        {isEditing ? (
          <div className="edit-form-container show">
            <div className="edit-form">
              <button className="close" onClick={handleCancel}>&times;</button>
              <h3>Edit Animal Details</h3>

              <div className="form-group">
                <label>Animal Name</label>
                <input
                  type="text"
                  name="name"
                  value={editedAnimal.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <input
                  type="text"
                  name="type"
                  value={editedAnimal.type}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={editedAnimal.status}
                  onChange={handleChange}
                >
                  <option value="healthy">Healthy</option>
                  <option value="treatment">Treatment</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="born"
                  value={editedAnimal.born}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Next Checkup</label>
                <input
                  type="date"
                  name="nextCheckup"
                  value={editedAnimal.nextCheckup}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Insemination Date (optional)</label>
                <input
                  type="date"
                  name="insemination"
                  value={editedAnimal.insemination}
                  onChange={handleChange}
                />
              </div>

              <div className="form-actions">
                <button className="btn save-btn" onClick={handleSave}>
                  Save
                </button>
                <button className="btn cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
          <div className="info-row">
              <p className="info-label">Name:</p>
              <p className="info-value">{name}</p>
            </div>
            <div className="info-row">
              <p className="info-label">Status:</p>
              <p className={`status-${status} info-value`}>{status}</p>
            </div>
            <div className="info-row">
              <p className="info-label">Born:</p>
              <p className="info-value">{born}</p>
            </div>
            <div className="info-row">
              <p className="info-label">Next Checkup:</p>
              <p className="info-value">{nextCheckup}</p>
            </div>
            <div className="info-row">
              <p className="info-label">Insemination Date:</p>
              <p className="info-value">
                {insemination || "Not Available"}
              </p>
            </div>

            <div className="animal-card-buttons">
              <button className="btn btn-primary" onClick={handleEdit}>
                Edit
              </button>
              <button className="btn btn-info" onClick={handleViewDetails}>
                View Details
              </button>
              <button className="btn btn-danger" onClick={handleRemove}>
                Remove
              </button>
            </div>
          </>
        )}

        {isViewingDetails && (
          <div className="animal-details-modal">
            <div className="modal-content">
              <div className="modal-header">
                <button className="back-button" onClick={handleHideDetails}>
                  &lt; Back
                </button>
                <h3>{editedAnimal.name} - {calculateAge(editedAnimal.born)}</h3>
              </div>
              <AnimalDetails animal={{ id, ...editedAnimal }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnimalCard;
