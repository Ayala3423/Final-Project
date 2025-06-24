import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/genericService';

function RenewReservation() {
  const { id } = useParams(); // מזהה ההזמנה מה־URL
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    apiService.getById(`reservations/${id}`, 
      (data) => {
        setReservation(data);
        setLoading(false);
      },
      (err) => {
        setError('Failed to load reservation');
        setLoading(false);
      }
    );
  }, [id]);

  const handleRenew = () => {
    apiService.create(`reservations/renew/${id}`, {}, 
      (res) => {
        setSuccess('ההזמנה חודש בהצלחה!');
        setTimeout(() => navigate('/'), 2000);
      },
      (err) => {
        setError('נכשל בחידוש ההזמנה');
      }
    );
  };

  if (loading) return <p>טוען...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!reservation) return <p>הזמנה לא נמצאה</p>;

  return (
    <div>
      <h2>חידוש הזמנה</h2>
      <p>חניה: {reservation.parkingAddress}</p>
      <p>מחיר: {reservation.totalPrice} ₪</p>
      <button onClick={handleRenew}>חדש הזמנה לחודש נוסף</button>
      {success && <p className="success">{success}</p>}
    </div>
  );
}

export default RenewReservation;