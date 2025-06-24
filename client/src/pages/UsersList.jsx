import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/genericService';
import '../styles/UsersList.css';
import { useParams } from 'react-router-dom';

function UsersList() {

    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { role } = useParams();
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleEdit = (userToEdit) => {
        setSelectedUser(userToEdit);
        setShowEditModal(true);
    };

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            setError('Only admins can view the user list');
            setLoading(false);
            return;
        }

        fetchUsers();
    }, [user, role]);

    const fetchUsers = () => {
        apiService.getByValue('users', { role },
            (data) => {
                setUsers(data);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching users:", err);
                setError('Failed to load users');
                setLoading(false);
            }
        );

    };

    const handleDelete = (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            apiService.remove('users', userId,
                () => {
                    setUsers(prev => prev.filter(u => Number(u.id) !== Number(userId)));
                },
                (err) => {
                    console.error("Error deleting user:", err);
                    alert("Failed to delete user.");
                }
            );
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('fullName', selectedUser.fullName);
            formData.append('email', selectedUser.email);
            formData.append('phone', selectedUser.phone);
            formData.append('address', selectedUser.address);
            if (selectedUser.newProfileImage) {
                formData.append('profileImage', selectedUser.newProfileImage);
            }

            await apiService.update('users', selectedUser.id, formData, (res) => {
                console.log("updated", res);
                setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, ...selectedUser } : u));
                setShowEditModal(false);
            }, (error) => {
                console.log(error);

            });

        } catch (error) {
            console.error("Failed to update user:", error);
            alert("שגיאה בעדכון המשתמש");
        }
    };

    if (!user) return <p>Please log in to view users.</p>;
    if (loading) return <p>Loading users...</p>;
    if (error) return <p>{error}</p>;

    return (
        <section className="users-section">
            <h3 className="users-title">Manage Users</h3>
            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Id</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u, idx) => (
                            <tr key={u.id || idx}>
                                <td>
                                    <img
                                        src={`http://localhost:3000/uploads/profileImages/${u.profileImage}`}
                                        alt={u.fullName}
                                        style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                </td>
                                <td>{idx + 1}</td>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.phone}</td>
                                <td>
                                    {u.id !== user.id ? (
                                        <>
                                            <button
                                                onClick={() => handleEdit(u)}
                                                className="edit-button"
                                                title="Edit user"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(u.id)}
                                                className="delete-button"
                                                title="Delete user"
                                            >
                                                🗑️
                                            </button>
                                        </>
                                    ) : (
                                        <span className="self-text">Can't delete self</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showEditModal && selectedUser && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>עריכת משתמש</h3>
                        <form onSubmit={handleUpdateUser}>
                            <input type="text" value={selectedUser.fullName} onChange={(e) => setSelectedUser({ ...selectedUser, fullName: e.target.value })} />
                            <input type="email" value={selectedUser.email} onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })} />
                            <input type="text" value={selectedUser.phone} onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })} />
                            <input type="text" value={selectedUser.address} onChange={(e) => setSelectedUser({ ...selectedUser, address: e.target.value })} />

                            <label>העלה תמונה חדשה:</label>
                            <input type="file" onChange={(e) => setSelectedUser({ ...selectedUser, newProfileImage: e.target.files[0] })} />

                            <div className="modal-buttons">
                                <button type="submit">שמור</button>
                                <button type="button" onClick={() => setShowEditModal(false)}>ביטול</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </section>
    );
}

export default UsersList;