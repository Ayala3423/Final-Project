import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import '../styles/Register.css'

const Register = () => {

    const { signupContext } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '', username: '', phone: '', email: '', address: '', password: '', role: 'renter'
    });
    const [profileImage, setProfileImage] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setProfileImage(file);
        } else {
            alert('אנא העלה קובץ תמונה בלבד');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in form) {
            formData.append(key, form[key]);
        }
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        signupContext(formData, navigate);
    };

    return (
        <Modal onClose={() => navigate(-1)}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className="register-form" encType="multipart/form-data">
                <div><input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required /></div>
                <div><input name="username" placeholder="Username" value={form.username} onChange={handleChange} required /></div>
                <div><input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required /></div>
                <div><input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required /></div>
                <div><input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required /></div>
                <div><input name="address" placeholder="Address" value={form.address} onChange={handleChange} /></div>
                <div>
                    <select name="role" value={form.role} onChange={handleChange}>
                        <option value="renter">Renter</option>
                        <option value="owner">Owner</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div><input type="file" accept="image/*" onChange={handleImageChange} /></div>
                <div><button type="submit">Register</button></div>
            </form>

        </Modal>
    );
};

export default Register;