import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/MessagesPage.css';
import { apiService } from '../services/genericService';

export default function MessagesPage() {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const messagesEndRef = useRef(null);

  // טוען את כל השיחות של המשתמש
  useEffect(() => {
    apiService.getByValue('message', { senderId: user.id }, (data) => {
      setConversations(data);
      console.log("Conversations fetched:", data);

      // אפשר להגדיר שיחה ראשונית אוטומטית אם רוצים:
      if (data.length > 0 && !selectedChatId) {
        setSelectedChatId(data[0].conversationId);
      }
    }, (error) => {
      console.error("Error fetching conversations:", error);
    });
  }, [user]);

  // טוען הודעות של השיחה הנבחרת
  useEffect(() => {
    if (!selectedChatId) {
      setMessages([]);
      return;
    }
    console.log("Fetching messages for conversationId:", selectedChatId);

    apiService.getByValue('message/conversation', { conversationId: selectedChatId }, (data) => {
      console.log("Messages fetched for conversationId:", selectedChatId, data);
      setMessages(data);
    }, (error) => {
      console.error("Error fetching messages:", error);
    });
  }, [selectedChatId]);

  // גלילה אוטומטית לתחתית תיבת ההודעות בכל שינוי הודעות
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMsg.trim()) return;

    const receiverId = conversations.find(conv => conv.conversationId === selectedChatId)?.receiverId;

    const messageObj = {
      "conversationId": selectedChatId,
      "senderId": user.id,
      "receiverId": receiverId, // דרוש לטבלה
      "content": newMsg, // בשם הנכון לפי המודל
      "sentAt": new Date().toISOString(), // אפשר גם להשמיט
    };
    console.log("Sending message:", messageObj);
    
    try {
      apiService.create('message', messageObj, (savedMessage) => {
        console.log("Message sent:", savedMessage);
        setMessages(prev => [...prev, savedMessage]);
        setNewMsg('');
      }, (error) => {
        console.error("Error sending message:", error);
      });

    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-sidebar">
        <h3>שיחות</h3>
        <ul>
          {conversations.map(conv => (

            <li
              key={conv.id}
              // className={conv.conversationId === selectedChatId ? 'active' : ''}
              onClick={() => setSelectedChatId(conv.conversationId)}
            >
              {/* כאן אפשר להחליף ליותר ידידותי כמו שם המשתמש */}
              שיחה עם: {conv.receiverId}
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-content">
        <div className="chat-messages">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`chat-bubble ${msg.senderId === user.id ? 'sent' : 'received'}`}
            >
              {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
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