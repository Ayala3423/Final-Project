// LoginModal.jsx
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/form.css'; // נניח שיש לך קובץ CSS חיצוני

const LoginModal = () => {
  const { loginContext } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginContext(form, navigate);
  };

  // סגירה בלחיצה על Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') navigate(-1);
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [navigate]);

  // פונקציית סגירה בלחיצה על האיקס
  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* כפתור יציאה */}
        <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
          &#x2715;
        </button>

        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
