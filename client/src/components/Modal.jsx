import React, { useEffect } from 'react';
import '../styles/Modal.css';

function Modal({ children, onClose }) {

    const handleClickInside = (e) => {
        e.stopPropagation(); 
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