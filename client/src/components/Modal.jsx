import React from 'react';
import '../styles/Modal.css'; 

function Modal({ children, onClose }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="close-button">X</button>
                {children}
            </div>
        </div>
    );
}

export default Modal;