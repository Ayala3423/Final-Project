import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ParkingList from '../components/ParkingList';
import { apiService } from '../services/genericService';

function MyParkings() {
  const { user, loading } = useContext(AuthContext);
  const [myParkings, setMyParkings] = useState([]);
  const navigate = useNavigate();
  console.log("user in MyParkings:", user);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
      } else {
        apiService.getByValue('parkings', { 'ownerId': user.id }, (response) => {
          setMyParkings(response);
        }, (error) => {
          console.error("Error fetching user parkings:", error);
          alert('שגיאה בטעינת החניות שלך');
        });
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading data...</div>;
  }

  return <>
    <ParkingList parkings={myParkings}/>;
  </>
}

export default MyParkings;