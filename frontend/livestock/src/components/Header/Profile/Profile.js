import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    address: '',
    phone: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState(userDetails);

  // Fetch user details from the backend
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token'); // Replace with your token storage method
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/users/me/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch user details');
          return;
        }

        const data = await response.json();
        setUserDetails(data);
        setEditedDetails(data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleSave = () => {
    setUserDetails(editedDetails);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACUCAMAAABGFyDbAAAAMFBMVEXk5ueutLepsLPZ3N7n6erIzM7P0tTq7O2yuLvBxsje4eLV2NrR1da2u767wMPEycvljgLtAAADY0lEQVR4nO2byXLbMAxAuYDiou3//7akXLfxIosABciZ4bskMz3kDQiBC1ClOp1Op9PpdDqdTqfT6XR+DQDPv1wOeGUHF5dMjG6yX2EGaopaa6Nv5J8hWnWxGaR1vhv9x4ThWrGoX6VuXCcGbleqRGy8xAvSsut0I15hZQ+kcsDmJG41HVoVkuxCwrSfVQ9YSS8Y6qRKvAStxspYZYKcVwrVVlrPUsvoZ4SVNk7GC4b6JdwYRbSOC9YTQSJc/qi4v2AGfi+wyCXUMl8jOlgiWY/OrA1uLYj4Nczh4j7kAMVK64XZCrHt/IQ56YGQ8AUzsWop1L7zg8iaXLTvsOA5tYiplVeR0wocWctyakWiVc55xuTCnbQe4Nx/POZY+gjnp+ipqZXrfNfqWh+1vjTlv7NA0A6BBdZy+qWbT8NWzXuwIec868GGch3bgsV7DKQeIQzvOwTlTl3gvlcT6zxnjS/QSgT79ZV4yeD9DhUt6c3AbaVU+s6HJI/eF1n3w38kdLBE3nTRT7pCL/OwYLykHsAV7oFkYS8OdzBbkGBzRcFYrSXaG65+FRRt3NXGK4j30SF96J/fMItw8/XG0e4oVxkegOnjwIFwWv3wgjW8FzNBZB/cFUvuVcyYebp8ygZsnENW+Wukw+wuyfQXQNlxWMukVHTD+B2DUgXY8N5vP6+2UUXIg0o5WIPbGHK0bMqG132F+boxuvh6+y+TZcs62iQ+kQc+jW6ZjdmtW/mfstuQxMzyH7Ku/sC1jkqgWOR6sM77QXoXtxCZq1jO7oH2ksQ4xQh+3B8FPIzZwjMsCGp8MzOJIbjTxcBPqOvO+4jNZ4tZ4ivgM+HE1whIa3Ok7pjltGNY/TWnSuyUlQRFbhHsec3tAQO7c/5sovWUXz3IicO0DfDSezxHhBYtNqvsRU4waCzrnzHUE397Xf8MKV5Ab2nWQokXY17dwb99wXn7zScvZLioU21IsP081DB1ixdqUrahg4/1wiwh9uW9AcSMpdQSblQPM+K7Ok1Uv9uLWtVmPX3SjsZcFyvRzNK1TVDJz/DGXJNdDcNQREzN1kho+rayHic9OHGrqqQ/6f6MoeKAI/0dFiomcOgz3g1ax/dGmYPWE4eNY/qYXQuHlQsWcwWHBdVegcx/fut0Op1O5xfyBzfiKaWdaPkVAAAAAElFTkSuQmCC"
          alt="Profile"
          className="profile-image"
        />
        <div>
          <h2 className="profile-name">{userDetails.username}</h2>
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
            <span>{userDetails.phone || 'Not provided'}</span>
          </div>
          <div className="profile-item">
            <MapPin className="profile-icon" />
            <span>{userDetails.address || 'Not provided'}</span>
          </div>
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        </div>
      ) : (
        <div className="edit-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={editedDetails.username}
              onChange={(e) => setEditedDetails({ ...editedDetails, username: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
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
    </div>
  );
};

export default Profile;