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
    const [reports, setReports] = useState([]);
    const [canReview, setCanReview] = useState(false);


    useEffect(() => {
        if (parking?.id) {
            apiService.getByValue('timeSlot', { parkingId: parking.id }, (response) => {
                console.log("TimeSlots fetched:", response);
                setTimeSlots(response);
            }, (error) => {
                console.error("Error fetching time slots:", error);
            });
            apiService.getByValue('report', { parkingId: parking.id }, (response) => {
                console.log("Parking reports fetched:", response);
                setReports(response);
            }, (error) => {
                console.error("Error fetching parking reports:", error);
            }
            );
        }
    }, [parking?.id]);

    useEffect(() => {
        if (parking?.id && user?.id) {

            // מניעת ביקורת עצמית
            if (user.id === parking.ownerId) {
                setCanReview(false);
                return;
            }

            apiService.getCheck('report', { parkingId: parking.id, userId: user.id }, (response) => {
                console.log("Check if user can review:", response.canReport.canReport);
                setCanReview(response.canReport.canReport); // אם אין ביקורת, אפשר להוסיף
            }, (error) => {
                console.error("Error checking if user can review:", error);
                setCanReview(false); // אם יש שגיאה, נניח שלא ניתן להוסיף ביקורת
            }
            );

        }
    }, [parking?.id, user?.id]);


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
                {reports.length > 0 ? (
                    <div className="review-list">
                        {reports.map((report, idx) => (
                            <div key={idx} className="review-card">
                                <div className="review-header">
                                    <FaStar className="star-icon" color="#ffc107" />
                                    <span className="review-rating">{report.rating}</span>
                                </div>
                                <p className="review-description">{report.description || 'אין תוכן לביקורת'}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>אין ביקורות עדיין.</p>
                )}

            </div>
            {canReview && (
                <button
                    className="add-review-button"
                    onClick={() => {
                        // כאן תפתח טופס להוספת תגובה
                        console.log('פתח טופס תגובה');
                    }}
                >
                    הוסף תגובה
                </button>
            )}


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
