import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/MessagesPage.css'; // Assuming you have a CSS file for styling
import { apiService } from '../services/genericService';

export default function MessagesPage() {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  console.log("messages page userId:", user.id);

  useEffect(() => {
    apiService.getByValue('message', { userId: user.id }, (data) => {
      setConversations(data);
    }, (error) => {
      console.error("Error fetching conversations:", error);
    });
  }, [user]);

  useEffect(() => {
    if (!selectedChatId) return;
    // טען את ההודעות של שיחה נבחרת
    // fetch(`/api/messages?chatId=${selectedChatId}`)
    //   .then(res => res.json())
    //   .then(setMessages);
  }, [selectedChatId]);

  const handleSend = async () => {
    if (!newMsg.trim()) return;
    const messageObj = {
      chatId: selectedChatId,
      senderId: userId,
      text: newMsg,
      timestamp: new Date().toISOString(),
    };

    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageObj),
    });
    const saved = await res.json();
    setMessages([...messages, saved]);
    setNewMsg('');
  };

  return (
    <div className="chat-box">
      <div className="chat-sidebar">
        <h3>שיחות</h3>
        <ul>
          {conversations.map(conv => (
            <li
              key={conv.chatId}
              className={conv.chatId === selectedChatId ? 'active' : ''}
              onClick={() => setSelectedChatId(conv.chatId)}
            >
              {conv.participantName}
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-content">
        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-bubble ${msg.senderId === userId ? 'sent' : 'received'}`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {selectedChatId && (
          <div className="chat-input">
            <input
              type="text"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="כתוב הודעה..."
            />
            <button onClick={handleSend}>שלח</button>
          </div>
        )}
      </div>
    </div>
  );
}