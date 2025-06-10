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
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewDescription, setReviewDescription] = useState('');

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

    const handleSubmitReview = () => {
        if (reviewRating === 0) {
            alert('אנא בחר דירוג');
            return;
        }

        const reviewData = {
            parkingId: parking.id,
            userId: user.id,
            rating: reviewRating,
            description: reviewDescription,
        };

        apiService.create('report', reviewData, (response) => {
            console.log("Review submitted:", response);
            setReports(prev => [...prev, response]);
            setCanReview(false);
            setShowReviewForm(false);
            setReviewRating(0);
            setReviewDescription('');
        }, (error) => {
            console.error("Error submitting review:", error);
            alert('אירעה שגיאה בעת שליחת הביקורת');
        });
    };

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
                <div className="review-form-wrapper">
                    {!showReviewForm ? (
                        <button
                            className="add-review-button"
                            onClick={() => setShowReviewForm(true)}
                        >
                            הוסף תגובה
                        </button>
                    ) : (
                        <div className="review-form">
                            <h4>הוספת ביקורת</h4>
                            <div className="rating-stars">
                                {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                                    <FaStar
                                        key={star}
                                        className="star"
                                        color={star <= (hoverRating || reviewRating) ? '#ffc107' : '#e4e5e9'}
                                        onClick={() => setReviewRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    />
                                ))}
                            </div>
                            <textarea
                                className="review-textarea"
                                placeholder="כתוב כאן את התגובה שלך (לא חובה)"
                                value={reviewDescription}
                                onChange={(e) => setReviewDescription(e.target.value)}
                            />
                            <button className="submit-review-button" onClick={handleSubmitReview}>
                                שלח ביקורת
                            </button>
                        </div>
                    )}
                </div>
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
