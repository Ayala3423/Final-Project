import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import '../styles/ProfileCard.css';

const ProfileCard = () => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(user || {});
  const [originalProfile, setOriginalProfile] = useState(user || {});

  if (!user) return <div className="profile-card">לא נמצא פרופיל להצגה</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  const handleSave = () => {
    console.log('שמירה:', editedProfile);
    setOriginalProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(originalProfile);
    setIsEditing(false);
  };

  return (
    <div className="profile-card">
      <img
        src="https://via.placeholder.com/150"
        alt="תמונת פרופיל"
        className="profile-image"
      />
      <h2 className="profile-title">פרופיל משתמש</h2>

      <div className="profile-fields">
        <ProfileField label="שם" name="name" value={editedProfile.name} isEditing={isEditing} onChange={handleChange} />
        <ProfileField label="שם משתמש" name="username" value={editedProfile.username} isEditing={isEditing} onChange={handleChange} />
        <ProfileField label="אימייל" name="email" value={editedProfile.email} isEditing={isEditing} onChange={handleChange} />
        <ProfileField label="טלפון" name="phone" value={editedProfile.phone} isEditing={isEditing} onChange={handleChange} />
        <ProfileField label="כתובת" name="address" value={editedProfile.address} isEditing={isEditing} onChange={handleChange} />
        <ProfileField label="תפקיד" name="role" value={editedProfile.role} isEditing={isEditing} onChange={handleChange} />
        <ProfileField label="דירוג ממוצע" name="averageRating" value={editedProfile.averageRating} isEditing={false} />
        <ProfileField label="מספר מזהה" name="id" value={editedProfile.id} isEditing={false} />
      </div>

      <div className="profile-actions">
        {isEditing ? (
          <>
            <button className="save-button" onClick={handleSave}>שמירה</button>
            <button className="cancel-button" onClick={handleCancel}>❌ ביטול</button>
          </>
        ) : (
          <button className="edit-button" onClick={() => setIsEditing(true)}>עריכה</button>
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
      />
    ) : (
      <div className="profile-value">{value}</div>
    )}
  </div>
);

export default ProfileCard;
