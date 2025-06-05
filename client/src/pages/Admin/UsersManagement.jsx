
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Home from '../Home';
import { useState, useEffect } from 'react';
import { apiService } from '../../services/genericService';
import UserParkings from '../../components/User/UserParkings';
import Modal from '../../components/Ui/Modal';

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
        <div>
            <h1>Users Management</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.name} - {user.email}
                        {userType=='owner' && <button onClick={() => handleOpenModal(user)}>ראה חניות</button>}
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