import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/genericService';
import '../styles/AddParking.css';
import { useNavigate } from 'react-router-dom';
import AddTimeSlot from './AddTimeSlot';  

function AddParking() {
    
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [parking, setParking] = useState({
        address: '',
        description: '',
        isAllowSubReservations: false
    });

    const [imageFile, setImageFile] = useState(null);
    const [availability, setAvailability] = useState([
        {
            type: 'fixed',
            days: [],
            startTime: '',
            endTime: '',
            price: ''
        }
    ]);

    const handleChange = (e) => {
        setParking({ ...parking, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('address', parking.address);
            formData.append('description', parking.description);
            formData.append('ownerId', user.id);
            formData.append('isAllowSubReservations', parking.isAllowSubReservations);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            // שולחים קודם את החניה
            apiService.create('parkings', formData, (res) => {
                console.log("Parking added successfully:", res);
                const parkingId = res.id;

                // שולחים את זמני הזמינות כולל מחירים
                apiService.create('timeSlots', availability.map(slot => ({
                    ...slot,
                    parkingId,
                    price: parseFloat(slot.price), // המרה למספר
                })), (res) => {
                    console.log("success", res);

                    // איפוס שדות:
                    setParking({
                        address: '',
                        description: '',
                        isAllowSubReservations: false
                    });
                    setAvailability([{
                        type: 'fixed',
                        days: [],
                        startTime: '',
                        endTime: '',
                        price: ''
                    }]);
                    setImageFile(null);

                    // ניווט לדף החניות שלי
                    navigate('/owner/my-parkings');

                }, (error) => {
                    console.error("Error adding timeslot:", error)
                });

            }, (error) => {
                console.error("Error adding parking:", error)
            });

        } catch (error) {
            console.error("Failed to add parking or availability", error);
        }
    };

    return (
        <form className="parking-form" onSubmit={handleSubmit}>
            <label>
                Address:
                <input name="address" value={parking.address} onChange={handleChange} required />
            </label>

            <label>
                Picture:
                <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
            </label>

            <label>
                Description:
                <textarea name="description" value={parking.description} onChange={handleChange} />
            </label>

            <label>
                <input
                    type="checkbox"
                    checked={parking.isAllowSubReservations}
                    onChange={(e) =>
                        setParking({ ...parking, isAllowSubReservations: e.target.checked })
                    }
                />
                אפשר השכרות משנה (Sub-Reservations)
            </label>

            {imageFile && (
                <img
                    src={URL.createObjectURL(imageFile)}
                    alt="תצוגה מקדימה"
                    style={{ width: '200px', marginTop: '10px' }}
                />
            )}

            {/* כאן אנחנו מקבלים ומעדכנים זמינות */}
            <AddTimeSlot availability={availability} setAvailability={setAvailability} />

            <br /><br />
            <button type="submit">Add parking</button>
        </form>
    );
}

export default AddParking;