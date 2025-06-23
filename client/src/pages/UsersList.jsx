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
                    setUsers(prev => prev.filter(u => u.id !== userId));
                },
                (err) => {
                    console.error("Error deleting user:", err);
                    alert("Failed to delete user.");
                }
            );
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
                            <th>#</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u, idx) => (
                            <tr key={u.id || idx}>
                                <td>{idx + 1}</td>
                                <td>{u.fullName}</td>
                                <td>{u.email}</td>
                                <td>{u.role}</td>
                                <td>{u.phone}</td>
                                <td>
                                    {u.id !== user.id ? (
                                        <button
                                            onClick={() => handleDelete(u.id)}
                                            className="delete-button"
                                            title="Delete user"
                                        >
                                            🗑️
                                        </button>
                                    ) : (
                                        <span className="self-text">Can't delete self</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
}

export default UsersList;