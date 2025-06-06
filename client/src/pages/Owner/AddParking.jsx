import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'; // עדכני לפי הנתיב שלך
import { apiService } from '../../services/genericService';
function AddParkingForm() {
    const { user } = useContext(AuthContext);
    const [parking, setParking] = useState({
        address: '',
        description: '',
        imageUrl: ''
    });

    const handleChange = (e) => {
        setParking({ ...parking, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            apiService.create('parking', {
                ...parking,
                ownerId: user.id
            }, () => {
                alert('החניה נוספה בהצלחה!');

            }, (error) => {
                console.error("Error adding parking:", error);
            })
        } catch (error) {
            console.error("Failed to add parking", error);  }
    }
    
    return (
            <form onSubmit={handleSubmit}>
                <input name="address" placeholder="כתובת" value={parking.address} onChange={handleChange} required />
                <input name="imageUrl" placeholder="קישור לתמונה (לא חובה)" value={parking.imageUrl} onChange={handleChange} />
                <textarea name="description" placeholder="תיאור (אופציונלי)" value={parking.description} onChange={handleChange} />

                <button type="submit">הוסף חניה</button>
            </form>
        );
    }

    export default AddParkingForm;
