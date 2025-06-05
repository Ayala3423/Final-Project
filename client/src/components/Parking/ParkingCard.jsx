import React, { useState } from 'react';
import { apiService } from '../../services/genericService';
function ParkingCard({ parking, currentUserId, onClose }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        address: parking.address,
        description: parking.description,
        imageUrl: parking.imageUrl
    });

    const isOwner = parking.ownerId === currentUserId;

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSave = async () => {
        try {
            console.log("Saving parking data:", formData);
            apiService.update('parking',parking.id, formData,()=>{
                            setIsEditing(false);
            } );
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update parking", error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this parking?")) return;

        try {
            await fetch(`/api/parkings/${parking.id}`, {
                method: 'DELETE'
                
            });
            onClose(); // סגור את החלונית לאחר מחיקה
        } catch (error) {
            console.error("Failed to delete parking", error);
        }
    };

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
        </div>
    );
}

export default ParkingCard;
