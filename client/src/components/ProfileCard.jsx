import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import '../styles/ProfileCard.css';
import { apiService } from '../services/genericService.js';

const ProfileCard = () => {
  const getFullImageUrl = (path) => {
    if (!path) return null;
    return `http://localhost:3000/${path.replace(/^\/+/, '')}`;
  };

  const { user, updateUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(user || {});
  const [originalProfile, setOriginalProfile] = useState(user || {});
  const [previewImage, setPreviewImage] = useState(getFullImageUrl(user?.profileImage));

  if (!user) return <div className="profile-card">No profile to display</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setEditedProfile({ ...editedProfile, profileImageFile: file });
    }
  };

  const handleSave = () => {
    const formData = new FormData();
    for (const key in editedProfile) {
      if (key === 'profileImageFile') {
        formData.append('profileImage', editedProfile.profileImageFile);
      } else {
        formData.append(key, editedProfile[key]);
      }
    }

    apiService.update('users', user.id, formData, (response) => {
      console.log('Profile updated successfully:', response);
      updateUser(response);
      setOriginalProfile(response);
      setPreviewImage(getFullImageUrl(response.profileImage));
      setIsEditing(false);
    }, (error) => {
      console.error('Error updating profile:', error);
    });
  };

  const handleCancel = () => {
    setEditedProfile(originalProfile);
    setPreviewImage(getFullImageUrl(originalProfile?.profileImage));
    setIsEditing(false);
  };

  const profileImageSrc =
    previewImage ||
    getFullImageUrl(editedProfile.profileImage) ||
    'https://via.placeholder.com/150';

  return (
    <div className="profile-card">
      <img
        src={profileImageSrc}
        alt="Profile"
        className="profile-image"
      />
      {isEditing && (
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="image-upload"
        />
      )}

      <h2 className="profile-title">User Profile</h2>

      <div className="profile-fields">
        <ProfileField label="Full Name" name="name" value={editedProfile.name} isEditing={isEditing} onChange={handleChange} />
        <ProfileField label="Username" name="username" value={editedProfile.username} isEditing={false} />
        <ProfileField label="Email" name="email" value={editedProfile.email} isEditing={isEditing} onChange={handleChange} />
        <ProfileField label="Phone" name="phone" value={editedProfile.phone} isEditing={isEditing} onChange={handleChange} />
        <ProfileField label="Address" name="address" value={editedProfile.address} isEditing={isEditing} onChange={handleChange} />
        <ProfileField label="Role" name="role" value={editedProfile.role} isEditing={false} />
        <ProfileField label="Average Rating" name="averageRating" value={editedProfile.averageRating} isEditing={false} />
        <ProfileField label="User ID" name="id" value={editedProfile.id} isEditing={false} />
      </div>

      <div className="profile-actions">
        {isEditing ? (
          <>
            <button className="save-button" onClick={handleSave}>Save</button>
            <button className="cancel-button" onClick={handleCancel}>❌ Cancel</button>
          </>
        ) : (
          <button className="edit-button" onClick={() => setIsEditing(true)}>Edit</button>
        )}
      </div>
    </div>
  );
};

const ProfileField = ({ label, name, value, isEditing, onChange }) => (
  <div className="profile-field">
    <label htmlFor={name} className="profile-label">{label}</label>
    {isEditing ? (
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        className="profile-input"
        readOnly={!onChange}
      />
    ) : (
      <div className="profile-value">{value}</div>
    )}
  </div>
);

export default ProfileCard;