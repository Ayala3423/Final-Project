import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import '../styles/Login.css'

const Login = () => {

    const { loginContext } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', password: '', role: 'renter' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        loginContext(form, navigate);
    };

    return (
        <Modal onClose={() => navigate(-1)}>
            <form onSubmit={handleSubmit} className="login-form">
                <h2 className="login-title">Login</h2>

                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Enter your username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="renter">Renter</option>
                        <option value="owner">Owner</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <button type="submit" className="login-button">Login</button>
            </form>

        </Modal>
    );
};

export default Login;