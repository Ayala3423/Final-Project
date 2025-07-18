import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { FaStar, FaPhone, FaPaperPlane, FaCommentDots, FaClipboardList } from 'react-icons/fa';
import '../styles/ParkingPage.css';
import Footer from '../components/Footer';
import { apiService } from '../services/genericService';
import { AuthContext } from '../context/AuthContext';
import TimeSlots from '../components/TimeSlots';
import AddTimeSlot from './AddTimeSlot';

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
    const [newTimeSlots, setNewTimeSlots] = useState([{
        type: 'fixed',
        days: [],
        startTime: '',
        endTime: '',
        price: ''
    }]);
    const averageRating = reports.length > 0
        ? reports.reduce((sum, r) => sum + (r.rating || 0), 0) / reports.length
        : 0;

    const [showAddTimeSlotForm, setShowAddTimeSlotForm] = useState(false);

    useEffect(() => {

        if (parking?.id) {
            apiService.getByValue('timeSlots', { parkingId: parking.id }, (response) => {
                setTimeSlots(response);
            }, (error) => {
                console.error("Error fetching time slots:", error);
            });
            apiService.getByValue('reports', { parkingId: parking.id }, (response) => {
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
            reportedUserId: parking.ownerId,
            reporterId: user.id,
            rating: reviewRating,
            description: reviewDescription,
        };

        apiService.create('reports', reviewData, (response) => {
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

            if (user.id === parking.ownerId) {
                setCanReview(false);
                return;
            }

            apiService.getCheck('reports', { parkingId: parking.id, userId: user.id }, (response) => {
                console.log("Check if user can review:", response.canReport.canReport);
                setCanReview(response.canReport.canReport);
            }, (error) => {
                console.error("Error checking if user can review:", error);
                setCanReview(false);
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


        navigate('reservation', {
            state: {
                parking,
                timeSlots
            }
        });
    };

    const handleAddTimeSlots = () => {
        apiService.create('timeSlots', newTimeSlots.map(slot => ({
            ...slot,
            parkingId: parking.id,
            price: parseFloat(slot.price),
        })), (res) => {
            console.log("TimeSlots added successfully:", res);

            // עדכון הרשימה המוצגת
            setTimeSlots(prev => [...prev, ...res]);

            // איפוס הטופס
            setNewTimeSlots([{
                type: 'fixed',
                days: [],
                startTime: '',
                endTime: '',
                price: ''
            }]);

            setShowAddTimeSlotForm(false);
        }, (error) => {
            console.error("Error adding timeslot:", error);
            alert('אירעה שגיאה בעת הוספת זמינות חדשה');
        });
    };

    return (
        <div className="parking-page">

            <div className="parking-header">
                <img id='parking-image-page'
                    src={`http://localhost:3000/uploads/parkings/${parking.imageUrl.replace(/^\/+/, '')}` || '/default-parking.jpg'}
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
                                color={i < Math.round(averageRating) ? '#ffc107' : '#e4e5e9'}
                            />
                        ))}
                        <span className="rating-number">{averageRating.toFixed(1)}</span>
                    </div>

                    <div className="action-buttons">
                        <button className="circle-button" onClick={() => navigate('/messages')}><FaCommentDots /></button>
                        <button className="circle-button"><FaPhone /></button>
                        <button className="circle-button"><FaPaperPlane /></button>
                    </div>
                </div>
            </div>

            <div className="parking-info-box">
                <p><strong>Descreption:</strong> {parking.description || 'אין תיאור זמין'}</p>
            </div>

            <TimeSlots timeSlots={timeSlots} setTimeSlots={setTimeSlots} />

            {user?.id === parking.ownerId && (
                <div className="add-timeslot-section">
                    {!showAddTimeSlotForm ? (
                        <button className="add-timeslot-button" onClick={() => setShowAddTimeSlotForm(true)}>
                            Add time
                        </button>
                    ) : (
                        <div className="add-timeslot-form">
                            <AddTimeSlot availability={newTimeSlots} setAvailability={setNewTimeSlots} />
                            <button onClick={handleAddTimeSlots}>שמור זמינות</button>
                            <button onClick={() => setShowAddTimeSlotForm(false)}>ביטול</button>
                        </div>
                    )}
                </div>
            )}

            <div className="parking-reviews">
                <h3>Reports</h3>
                {reports.length > 0 ? (
                    <div className="review-list">
                        {reports.map((report, idx) => (
                            <div key={idx} className="review-card">
                                <div className="review-header">
                                    <FaStar className="star-icon" color="#ffc107" />
                                    <span className="review-rating">{report?.rating?.toFixed(2)}</span>
                                </div>
                                <p className="review-description">
                                    {report?.description?.trim() ? report.description : 'אין תוכן לביקורת'}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>There are no reports.</p>
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
                            <h4>Add a review</h4>
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
                                Send Review
                            </button>
                        </div>
                    )}
                </div>
            )}

            {user?.role === "renter" && <button
                className="booking-button"
                onClick={handleReservation}
                aria-label="יצירת הזמנה"
            >
                <FaClipboardList size={24} />
            </button>}

            <Footer />

            <Outlet />
        </div>
    );
}

export default ParkingPage;