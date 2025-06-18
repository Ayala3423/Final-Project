import React, { useEffect } from 'react';
import '../styles/Modal.css';

function Modal({ children, onClose }) {

    const handleClickInside = (e) => {
        e.stopPropagation(); // עוצר את ההדיפה של האירוע כלפי מעלה
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={handleClickInside}>
                <button onClick={onClose} className="close-button">X</button>
                {children}
            </div>
        </div>
    );
}

export default Modal;