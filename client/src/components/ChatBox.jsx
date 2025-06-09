import React, { useState, useEffect, useContext } from 'react';
import '../styles/ChatBox.css'; // Assuming you have a CSS file for styling 
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/genericService';

function ChatBox({ parkingOwnerId }) {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [status, setStatus] = useState(null);

    useEffect(() => {
        if (user) {
            // טעינת הודעות קיימות (מדומה כרגע)
            apiService.getByValue('message', {
                senderId: user.id,
                receiverId: parkingOwnerId
            }, (response) => {
                setMessages(response);
            }, (error) => {
                console.error("שגיאה בטעינת הודעות:", error);
            });
        }
    }, [user, parkingOwnerId]);

    const handleSend = () => {
        if (!newMessage.trim()) return;

        const messageData = {
            senderId: user.id,
            receiverId: parkingOwnerId,
            message: newMessage,
            timestamp: new Date().toISOString()
        };

        // שליחה לשרת
        apiService.create('message', messageData, () => {
            setMessages([...messages, messageData]);
            setNewMessage('');
        }, () => {
            setStatus('שגיאה בשליחת ההודעה');
        });
    };

    return (
        <div className="chat-box">
            <div className="chat-messages">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`chat-message ${msg.senderId === user.id ? 'self' : 'other'}`}
                    >
                        <span>{msg.message}</span>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    placeholder="כתוב הודעה..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend}>שלח</button>
            </div>
            {status && <div className="chat-status">{status}</div>}
        </div>
    );
}

export default ChatBox;
