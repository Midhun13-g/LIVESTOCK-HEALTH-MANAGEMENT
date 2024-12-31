import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import './Profile.css';
import ProfileStatus from './ProfileStatus'; // Import ProfileStatus component

const Profile = () => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState(userDetails);

  // Simulate fetching user details from registration (replace with API call in real app)
  useEffect(() => {
    const registeredUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Farm Road, Rural County',
    };
    setUserDetails(registeredUser);
    setEditedDetails(registeredUser);
  }, []);

  const handleSave = () => {
    setUserDetails(editedDetails);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt="Profile"
          className="profile-image"
        />
        <div>
          <h2 className="profile-name">{userDetails.name}</h2>
          <p className="profile-role">Farm Manager</p>
        </div>
      </div>

      {!isEditing ? (
        <div className="profile-details">
          <div className="profile-item">
            <Mail className="profile-icon" />
            <span>{userDetails.email}</span>
          </div>
          <div className="profile-item">
            <Phone className="profile-icon" />
            <span>{userDetails.phone}</span>
          </div>
          <div className="profile-item">
            <MapPin className="profile-icon" />
            <span>{userDetails.address}</span>
          </div>
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        </div>
      ) : (
        <div className="edit-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={editedDetails.name}
              onChange={(e) => setEditedDetails({ ...editedDetails, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={editedDetails.email}
              onChange={(e) => setEditedDetails({ ...editedDetails, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              value={editedDetails.phone}
              onChange={(e) => setEditedDetails({ ...editedDetails, phone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              value={editedDetails.address}
              onChange={(e) => setEditedDetails({ ...editedDetails, address: e.target.value })}
            />
          </div>
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
        </div>
      )}

      {/* Add ProfileStatus below */}
      <ProfileStatus />
    </div>
  );
};

export default Profile;
