import React, { use, useEffect, useState } from 'react';
import { apiService } from '../../services/genericService';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/ParkingCard.css';
import Modal from '../Ui/Modal';
import { useContext } from 'react';

function ParkingCard({ parking, currentUserId, onClose }) {
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        address: parking.address,
        description: parking.description,
        imageUrl: parking.imageUrl
    });
    const [timeSlots, setTimeSlots] = useState([]);
    const [orderModal, setOrderModal] = useState(false);
    const isOwner = parking.ownerId === currentUserId;

    useEffect(() => {
        apiService.getByValue('timeSlot', { parkingId: parking.id }, (response) => {
            console.log("Fetched Time Slots for Parking:", response);
            setTimeSlots(response);
        }, (error) => {
            console.error("Error fetching time slots:", error);
        });
    }, [parking.id]);

    const handleClose = () => {
        setOrderModal(false);
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSave = async () => {
        try {
            console.log("Saving parking data:", formData);
            apiService.update('parking', parking.id, formData, () => {
                setIsEditing(false);
            }, (error) => {
                console.error("Error updating parking:", error);
            });
        } catch (error) {
            console.error("Failed to update parking", error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this parking?")) return;

        try {
            apiService.remove('parking', parking.id, () => {
                console.log("Parking deleted successfully");
                onClose();
            }, (error) => {
                console.error("Error deleting parking:", error);
            });
        } catch (error) {
            console.error("Failed to delete parking", error);
        }
    };

    const handleOrder = () => {
        if (!user) {
            navigate('/login');
            alert('Please log in to order a parking spot.');
            return;
        }
        else {
            navigate('/reservation', {
                state: {
                    parking,
                    timeSlots
                }
            });
        }
    }

    return (
        <div className="parking-card">
            <h3>Parking Details</h3>
            {isEditing ? (
                <>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Address"
                    />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Description"
                    />
                    <input
                        type="text"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="Image URL"
                    />
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </>
            ) : (
                <>
                    <p><strong>Address:</strong> {parking.address}</p>
                    <p><strong>Description:</strong> {parking.description}</p>
                    {parking.imageUrl && (
                        <img src={parking.imageUrl} alt="Parking" style={{ width: '100%', maxHeight: 200 }} />
                    )}
                    {isOwner && (
                        <div style={{ marginTop: '1rem' }}>
                            <button onClick={() => setIsEditing(true)}>Edit</button>
                            <button onClick={handleDelete}>Delete</button>
                        </div>
                    )}
                </>
            )}
            {timeSlots.length > 0 && (
                <div className="time-slots-section" style={{ marginTop: '1.5rem' }}>
                    <h4>זמני חניה:</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {timeSlots.map((slot, index) => (
                            <div key={index} style={{
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                padding: '0.5rem',
                                backgroundColor: '#f9f9f9',
                            }}>
                                <p><strong>התחלה:</strong> {new Date(slot.startTime).toLocaleString()}</p>
                                <p><strong>סיום:</strong> {new Date(slot.endTime).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>

                </div>
            )}
            <button className='order-button' onClick={() => handleOrder()}>
                Order Now
            </button>

        </div>
    );
}

export default ParkingCard;