import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const { signupContext } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        username: '',
        phone: '',
        email: '',
        address: '',
        password: '',
        role: 'renter',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        signupContext(form, navigate)
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Full Name" onChange={handleChange} required />
                <br />
                <input name="username" placeholder="Username" onChange={handleChange} required />
                <br />
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                <br />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                <br />
                <input name="phone" placeholder="Phone" onChange={handleChange} required />
                <br />
                <input name="address" placeholder="Address" onChange={handleChange} />
                <br />
                <select name="role" value={form.role} onChange={handleChange}>
                    <option value="renter">Renter</option>
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                </select>
                <br />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;