
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiService } from '../../services/genericService';
import UserParkings from '../../components/User/UserParkings';
import Modal from '../../components/Ui/Modal';
import '../../styles/usersManagement.css'; // Assuming you have a CSS file for styling

function UsersManagement() {
    const { userType } = useParams();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);


    useEffect(() => {
        apiService.getByValue('user', { "role": userType }, (response) => {
            console.log("Fetched Users:", response);
            setUsers(response);
        }, (error) => {
            console.error("Error fetching users:", error.message);
        });
    }, [userType]);

    const handleOpenModal = (user) => {
        setSelectedUser(user);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
    };

    return (
        <div className="users-management">
            <h1 className="title">ניהול משתמשים</h1>
            <ul className="user-grid">
                {users.map(user => (
                    <li key={user.id} className="user-card">
                        <div className="user-info">
                            <span className="user-name">{user.name}</span>
                            <span className="user-email">{user.email}</span>
                        </div>
                        {userType === 'owner' && (
                            <button className="view-parking-btn" onClick={() => handleOpenModal(user)}>
                                ראה חניות
                            </button>
                        )}
                    </li>
                ))}
            </ul>


            {selectedUser && (
                <Modal onClose={handleCloseModal}>
                    <h2>חניות של {selectedUser.name}</h2>
                    <UserParkings ownerId={selectedUser.id} />
                </Modal>
            )}
        </div>

    );
}

export default UsersManagement;