import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/genericService';
import '../styles/MessagesPage.css';

function MessagesPage() {
    const { user } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [status, setStatus] = useState(null);

    useEffect(() => {
        if (user) {
            apiService.getByValue('conversations', { userId: user.id }, (response) => {
                setConversations(response);
            }, (error) => {
                console.error("שגיאה בטעינת שיחות", error);
            });
        }
    }, [user]);

    const handleConversationClick = (conv) => {
        setSelectedConversation(conv);
        setStatus(null);
    };

    const handleSendMessage = () => {
        if (!messageInput.trim()) return;

        const newMessage = {
            senderId: user.id,
            receiverId: selectedConversation.otherUserId,
            message: messageInput,
            timestamp: new Date().toISOString()
        };

        apiService.create('message', newMessage, () => {
            setSelectedConversation({
                ...selectedConversation,
                messages: [...selectedConversation.messages, newMessage]
            });
            setMessageInput('');
        }, () => {
            setStatus("שגיאה בשליחת הודעה");
        });
    };

    return (
        <div className="messages-page">
            <div className="conversation-list">
                <h2>השיחות שלי</h2>
                <ul>
                    {conversations.map((conv, idx) => (
                        <li
                            key={idx}
                            onClick={() => handleConversationClick(conv)}
                            className={selectedConversation === conv ? 'active' : ''}
                        >
                            <strong>{conv.otherUserName}</strong><br />
                            <span>{conv.lastMessage}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="chat-window">
                {selectedConversation ? (
                    <>
                        <div className="chat-header">
                            <h3>שיחה עם {selectedConversation.otherUserName}</h3>
                        </div>
                        <div className="chat-messages">
                            {selectedConversation.messages.map((msg, idx) => (
                                <div key={idx} className={`chat-message ${msg.senderId === user.id ? 'self' : 'other'}`}>
                                    <span>{msg.message}</span>
                                </div>
                            ))}
                        </div>
                        <div className="chat-input">
                            <input
                                type="text"
                                placeholder="כתוב הודעה..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button onClick={handleSendMessage}>שלח</button>
                        </div>
                        {status && <div className="status">{status}</div>}
                    </>
                ) : (
                    <div className="empty-chat">בחר שיחה כדי להתחיל</div>
                )}
            </div>
        </div>
    );
}

export default MessagesPage;