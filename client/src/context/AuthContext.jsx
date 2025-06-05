import React, { createContext, useState, useEffect } from 'react';
import { login, signup } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedUser = localStorage.getItem('user');
    if (loggedUser) {
      setUser(loggedUser);
    }
    setLoading(false);
  }, []);

  const loginContext = (userData, navigate) => {
    login(userData, (response) => {
      console.log('Login successful1:', response);
      setUser(response.user);
      console.log('Login successful2:', response);

      localStorage.setItem('user', JSON.stringify(response.user));
      console.log('Login successful3:', response);
      Cookies.set('token', response.token, { expires: 7 }); // שמירת הטוקן בעוגייה ל-7 ימים

      navigate(`/${response.user.role}`); // ניתוב לעמוד הבית או לעמוד המתאים לפי התפקיד
    }, (error) => {
      console.error('Login failed:', error);
      alert(error.message || 'Login failed');
    });

  };

  const signupContext = (userData, navigate) => {
    signup(userData, (response) => {
      console.log('Signup successful:', response);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      Cookies.set('token', response.token, { expires: 7 }); // שמירת הטוקן בעוגייה ל-7 ימים

      navigate(`/${response.user.role}`); // ניתוב לעמוד הבית או לעמוד המתאים לפי התפקיד
    }, (error) => {
      console.error('Signup failed:', error);
      alert(error.message || 'Signup failed');
    });

  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loginContext, signupContext, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
