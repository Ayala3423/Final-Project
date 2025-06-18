import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/MessagesPage.css';
import { apiService } from '../services/genericService';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const socket = io('http://localhost:3000'); // כתובת השרת שלך

export default function MessagesPage() {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [typingUsers, setTypingUsers] = useState({});
  const [unreadMessages, setUnreadMessages] = useState({});
  const messagesEndRef = useRef(null);
  const [newChatUsername, setNewChatUsername] = useState('');
  const [chatError, setChatError] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const soundEnabledRef = useRef(soundEnabled);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const playNotificationSound = () => {
    if (!soundEnabledRef.current) return;
    const audio = new Audio('-WPTWARN.wav');
    audio.play().catch(err => console.error("Audio play error:", err));
  };

  function generateUniqueConversationId() {
    return uuidv4();
  }

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on('receiveMessage', (messageData) => {
      console.log('📥 Message received via socket:', messageData);

      // אם השיחה לא קיימת - נכניס אותה
      setConversations(prev => {
        const exists = prev.some(conv => conv.conversationId === messageData.conversationId);
        if (!exists) {
          const newConv = {
            conversationId: messageData.conversationId,
            senderId: messageData.senderId,
            receiverId: messageData.receiverId
          };
          return [newConv, ...prev];
        }
        return prev;
      });

      // ממשיכים עם הקוד הרגיל
      const isMyMessage = messageData.senderId === user.id;
      if (messageData.conversationId === selectedChatId) {
        setMessages(prev => [...prev, messageData]);
      } else {
        setUnreadMessages(prev => ({
          ...prev,
          [messageData.conversationId]: (prev[messageData.conversationId] || 0) + 1
        }));
      }

      if (!isMyMessage) {
        playNotificationSound();
      }
    });

    socket.on('userTyping', ({ conversationId, senderId }) => {
      if (conversationId === selectedChatId && senderId !== user.id) {
        setTypingUsers(prev => ({ ...prev, [senderId]: true }));

        setTimeout(() => {
          setTypingUsers(prev => {
            const updated = { ...prev };
            delete updated[senderId];
            return updated;
          });
        }, 3000);
      }
    });

    socket.on('messagesRead', ({ conversationId, messageIds }) => {
      if (conversationId === selectedChatId) {
        setMessages(prev =>
          prev.map(msg =>
            messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
          )
        );
      }
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('userTyping');
      socket.off('messagesRead');
      socket.disconnect();
    };
  }, [selectedChatId]);

  useEffect(() => {
    apiService.get('messages', (data) => {
      const uniqueConversationsMap = {};
      data.forEach(msg => {
        const otherUserId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
        if (!uniqueConversationsMap[otherUserId]) {
          uniqueConversationsMap[otherUserId] = msg;
        }
      });

      const uniqueConversations = Object.values(uniqueConversationsMap);

      setConversations(uniqueConversations);
      console.log("Unique Conversations fetched:", uniqueConversations);

      if (uniqueConversations.length > 0 && !selectedChatId) {
        setSelectedChatId(uniqueConversations[0].conversationId);
      }
    }, (error) => {
      console.error("Error fetching conversations:", error);
    });
  }, [user]);

  useEffect(() => {
    if (!selectedChatId) {
      setMessages([]);
      return;
    }
    console.log("Fetching messages for conversationId:", selectedChatId);

    apiService.getByValue('messages/conversation', { conversationId: selectedChatId }, (data) => {
      console.log("Messages fetched for conversationId:", selectedChatId, data);
      setMessages(data);
      setUnreadMessages(prev => ({ ...prev, [selectedChatId]: 0 }));

      const unreadMessageIds = data
        .filter(msg => msg.receiverId === user.id && !msg.isRead)
        .map(msg => msg.id);

      if (unreadMessageIds.length > 0) {
        apiService.updateMany('messages/conversation', { messageIds: unreadMessageIds, field: { isRead: true } }, () => {
          socket.emit('messageRead', { conversationId: selectedChatId, messageIds: unreadMessageIds });

          console.log('Messages marked as read');
        }, (error) => {
          console.error('Error marking messages as read:', error);
        });
      }
    }, (error) => {
      console.error("Error fetching messages:", error);
    });

  }, [selectedChatId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMsg.trim()) return;

    const receiverId = conversations.find(conv => conv.conversationId === selectedChatId)?.receiverId;

    const messageObj = {
      conversationId: selectedChatId,
      senderId: user.id,
      receiverId: receiverId,
      content: newMsg,
      sentAt: new Date().toISOString(),
    };

    console.log("Sending message:", messageObj);

    try {
      apiService.create('messages', messageObj, (savedMessage) => {
        console.log("Message sent:", savedMessage);

        socket.emit('sendMessage', savedMessage);
        setNewMsg('');
      }, (error) => {
        console.error("Error sending message:", error);
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleTyping = () => {
    console.log('Im typing...');

    socket.emit('typing', { conversationId: selectedChatId, senderId: user.id, senderName: user.name });
  };

  const openNewChat = async () => {
    if (!newChatUsername.trim()) return;

    setChatError('');

    try {
      const userResult = await apiService.getByValue('users', { username: newChatUsername.trim() });
      if (!userResult || userResult.length === 0) {
        setChatError('משתמש לא נמצא');
        return;
      }
      const foundUser = userResult[0];

      if (foundUser.id === user.id) {
        setChatError('לא ניתן להתחיל שיחה עם עצמך');
        return;
      }

      const existingConversation = conversations.find(conv => {
        const chatPartnerId = conv.senderId === user.id ? conv.receiverId : conv.senderId;
        return chatPartnerId === foundUser.id;
      });

      if (existingConversation) {
        setSelectedChatId(existingConversation.conversationId);
        setNewChatUsername('');
        return;
      }

      // יצירת שיחה חדשה - תלוי איך מוגדרת השיחות ב-API שלך
      // אם אין endpoint ליצירת שיחה, אפשר ליצור הודעת פתיחה ריקה למשל
      const newConversationId = generateUniqueConversationId(); // תיצור פונקציה שמתאימה
      const newConv = {
        conversationId: newConversationId,
        senderId: user.id,
        receiverId: foundUser.id,
        // אפשר להוסיף שדות נוספים אם צריך
      };

      // הוסף את השיחה לרשימה המקומית
      setConversations(prev => [newConv, ...prev]);
      setSelectedChatId(newConversationId);
      setNewChatUsername('');
    } catch (error) {
      setChatError('שגיאה בפתיחת שיחה');
      console.error(error);
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-sidebar">
        <h3>שיחות</h3>
        <button
          onClick={() => setSoundEnabled(prev => !prev)}
          style={{ fontSize: '14px', padding: '4px 8px', cursor: 'pointer' }}
        >
          {soundEnabled ? '🔊 השתק' : '🔇 הפעל'}
        </button>
        <div className="new-chat">
          <input
            type="text"
            placeholder="הכנס שם משתמש לפתיחת שיחה"
            value={newChatUsername}
            onChange={e => setNewChatUsername(e.target.value)}
          />
          <button onClick={openNewChat}>פתח שיחה חדשה</button>
          {chatError && <div className="error">{chatError}</div>}
        </div>

        <ul>
          {conversations.map(conv => {
            const chatPartnerId = conv.senderId === user.id ? conv.receiverId : conv.senderId;
            const isActive = conv.conversationId === selectedChatId;

            return (
              <li
                key={conv.conversationId}
                className={isActive ? 'active' : ''}
                onClick={() => setSelectedChatId(conv.conversationId)}
              >
                שיחה עם: {chatPartnerId}
                {unreadMessages[conv.conversationId] > 0 && (
                  <span className="unread-count"> ({unreadMessages[conv.conversationId]})</span>
                )}
              </li>
            );
          })}
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
              {msg.senderId === user.id && (
                <span className="message-status">
                  {msg.isRead ? '✔✔' : '✔'}
                </span>
              )}
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault(); // מונע ירידת שורה אם זה textarea בעתיד
                  handleSend();
                } else {
                  handleTyping();
                }
              }}
              placeholder="כתוב הודעה..."
            />

            <button onClick={handleSend}>שלח</button>
          </div>
        )}

        {Object.values(typingUsers).length > 0 && (
          <div className="typing-indicator">
            {Object.values(typingUsers).join(', ')} מקליד/ים...
          </div>
        )}

      </div>
    </div>
  );
}