import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // עדכני לפי הנתיב שלך
import UserParkings from '../../components/User/UserParkings'; // עדכני לנתיב שלך

function MyParkings() {
  const { user, loading } = useContext(AuthContext);
  const [parsedUser, setParsedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
      } else {
        // במידה וה-user ב-localStorage הוא מחרוזת
        const parsed = typeof user === 'string' ? JSON.parse(user) : user;
        setParsedUser(parsed);
      }
    }
  }, [user, loading, navigate]);

  if (loading || !parsedUser) {
    return <div>טוען נתונים...</div>;
  }

  return <UserParkings ownerId={parsedUser.id} />;
}

export default MyParkings;
// MyParkings.jsx