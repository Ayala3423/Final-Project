import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/genericService';
import '../styles/AddParking.css'; // נניח שזה קובץ ה-CSS שלך

function AddParkingForm() {
    const { user } = useContext(AuthContext);
    const [parking, setParking] = useState({
        address: '',
        description: ''
    });
    const [imageFile, setImageFile] = useState(null);

    const handleChange = (e) => {
        setParking({ ...parking, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('address', parking.address);
        formData.append('description', parking.description);
        formData.append('ownerId', user.id);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            await apiService.create('parking', formData, () => {
                alert('החניה נוספה בהצלחה!');
            }, (error) => {
                console.error("Error adding parking:", error);
            });
        } catch (error) {
            console.error("Failed to add parking", error);
        }
    };

    return (
        <form className="parking-form" onSubmit={handleSubmit}>
            <label>
                כתובת:
                <input name="address" value={parking.address} onChange={handleChange} required />
            </label>

            <label>
                תמונה:
                <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
            </label>

            <label>
                תיאור:
                <textarea name="description" value={parking.description} onChange={handleChange} />
            </label>
            {imageFile && (
                <img
                    src={URL.createObjectURL(imageFile)}
                    alt="תצוגה מקדימה"
                    style={{ width: '200px', marginTop: '10px' }}
                />
            )}

            <button type="submit">הוסף חניה</button>
        </form>
    );
}

export default AddParkingForm;
