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
    try {
      setUser(JSON.parse(loggedUser)); // פיענוח למבנה אובייקט
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      setUser(null);
    }
  }
  setLoading(false);
}, []);


  const loginContext = (userData, navigate) => {
    login(userData, (response) => {
      console.log('Login successful1:', response);
      setUser(response.user);

      localStorage.setItem('user', JSON.stringify(response.user));
      Cookies.set('token', response.token, { expires: 7 }); // שמירת הטוקן בעוגייה ל-7 ימים
      if(response.user.role === 'renter') {navigate('/'); return;} // ניתוב לעמוד הבית אם המשתמש הוא שוכר
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
    Cookies.remove('token'); // הסרת הטוקן מהעוגייה
    window.location.href = '/'; // ניתוב לעמוד הבית לאחר התנתקות                                      
     };

  return (
    <AuthContext.Provider value={{ user, loginContext, signupContext, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
