import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';

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
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
                <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
                <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
                <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
                <select name="role" value={form.role} onChange={handleChange}>
                    <option value="renter">Renter</option>
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                </select>

                <input type="file" accept="image/*" onChange={handleImageChange} />

                <button type="submit">Register</button>
            </form>
        </Modal>
    );
};

export default Register;
