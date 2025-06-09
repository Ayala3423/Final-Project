import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaStar, FaPhone, FaPaperPlane, FaCommentDots, FaClipboardList } from 'react-icons/fa';
import '../styles/ParkingPage.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiService } from '../services/genericService';
import { AuthContext } from '../context/AuthContext';
import TimeSlots from '../components/TimeSlots';

function ParkingPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const parking = location.state?.parking;
    const { user } = useContext(AuthContext);
    const [timeSlots, setTimeSlots] = useState([]);

    useEffect(() => {
        if (parking?.id) {
            apiService.getByValue('timeSlot', { parkingId: parking.id }, (response) => {
                console.log("TimeSlots fetched:", response);
                setTimeSlots(response);
            }, (error) => {
                console.error("Error fetching time slots:", error);
            });
        }
    }, [parking?.id]);

    if (!parking) {
        return <div className="loading">טוען...</div>;
    }

    const handleReservation = () => {
        if (!user) {
            alert("יש להתחבר כדי לבצע הזמנה");
            navigate("/login");
            return;
        }

        navigate("/reservation", {
            state: {
                parking,
                timeSlots
            }
        });
    };

    return (
        <div className="parking-page">
            <Header />

            <div className="parking-header">
                <img
                    src={parking.imageUrl || '/default-parking.jpg'}
                    alt="תמונה של חניה"
                    className="parking-image"
                />
                <div className="parking-title-section">
                    <h1 className="parking-title">{parking.address}</h1>
                    <div className="rating-section">
                        {Array.from({ length: 5 }, (_, i) => (
                            <FaStar
                                key={i}
                                className="star"
                                color={i < parking.rating ? '#ffc107' : '#e4e5e9'}
                            />
                        ))}
                        <span className="rating-number">{parking.rating}</span>
                    </div>
                    <div className="action-buttons">
                        <button className="circle-button"><FaCommentDots /></button>
                        <button className="circle-button"><FaPhone /></button>
                        <button className="circle-button"><FaPaperPlane /></button>
                    </div>
                </div>
            </div>

            <div className="parking-info-box">
                <p><strong>תיאור:</strong> {parking.description || 'אין תיאור זמין'}</p>
                <p><strong>מחיר:</strong> ₪{parking.price || '—'}</p>
                <p><strong>מקומות פנויים:</strong> {parking.availableSpots ?? '—'}</p>
            </div>

            <TimeSlots timeSlots={timeSlots} />

            <div className="parking-reviews">
                <h3>ביקורות</h3>
                {parking.reviews && parking.reviews.length > 0 ? (
                    <ul className="review-list">
                        {parking.reviews.map((review, idx) => (
                            <li key={idx}>{review}</li>
                        ))}
                    </ul>
                ) : (
                    <p>אין ביקורות עדיין.</p>
                )}
            </div>

            <button
                className="booking-button"
                onClick={handleReservation}
                aria-label="יצירת הזמנה"
            >
                <FaClipboardList size={24} />
            </button>

            <Footer />
        </div>
    );
}

export default ParkingPage;
