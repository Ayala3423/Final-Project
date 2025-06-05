

import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileCard = ({ user }) => {
    const navigate = useNavigate();
    
    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    return (
        <div className="profile-card">
            <h2>Profile</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <button onClick={handleEditProfile}>Edit Profile</button>
        </div>
    );
}

export default ProfileCard;