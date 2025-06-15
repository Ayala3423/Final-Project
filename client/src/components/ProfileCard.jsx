import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import '../styles/ProfileCard.css';
import { apiService } from '../services/genericService.js';

const ProfileCard = () => {
  const { user ,updateUser} = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(user || {});
  const [originalProfile, setOriginalProfile] = useState(user || {});
  const [previewImage, setPreviewImage] = useState(user?.profileImage ? `${user.profileImage}` : null);

  if (!user) return <div className="profile-card">לא נמצא פרופיל להצגה</div>;

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

  apiService.updateWithFormData('user', user.id, formData, (response) => {
    console.log('פרופיל עודכן בהצלחה:', response);
    updateUser(response); // עדכני את הקונטקסט עם התשובה מהשרת
    setOriginalProfile(response);
    setPreviewImage(response.profileImage ? `http://localhost:3000/uploads/${response.profileImage}` : null);
    setIsEditing(false);
  }, (error) => {
    console.error('שגיאה בעדכון הפרופיל:', error);
  });
};


const handleCancel = () => {
  setEditedProfile(originalProfile);
  setPreviewImage(originalProfile?.profileImage ? `http://localhost:3000/uploads/${originalProfile.profileImage}` : null);
  setIsEditing(false);
};


  const profileImageSrc = previewImage ||
    (editedProfile.profileImage
      ? `http://localhost:3000/uploads/${editedProfile.profileImage}`
      : 'https://via.placeholder.com/150');

  return (
    <div className="profile-card">
      <img
        src={profileImageSrc}
        alt="תמונת פרופיל"
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

      <h2 className="profile-title">פרופיל משתמש</h2>

      <div className="profile-fields">
        <ProfileField label="שם" name="name" value={editedProfile.name} isEditing={isEditing} onChange={handleChange} />
        <ProfileField label="שם משתמש" name="username" value={editedProfile.username} isEditing={false} />
        <ProfileField label="אימייל" name="email" value={editedProfile.email} isEditing={isEditing} onChange={handleChange} />
        <ProfileField label="טלפון" name="phone" value={editedProfile.phone} isEditing={isEditing} onChange={handleChange} />
        <ProfileField label="כתובת" name="address" value={editedProfile.address} isEditing={isEditing} onChange={handleChange} />
        <ProfileField label="תפקיד" name="role" value={editedProfile.role} isEditing={false} />
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
        readOnly={!onChange}
      />
    ) : (
      <div className="profile-value">{value}</div>
    )}
  </div>
);

export default ProfileCard;
