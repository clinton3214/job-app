// File: src/pages/AdminInboxPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const API_BASE = import.meta.env.VITE_BACKEND_URL;


const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ['websocket'],   // Force WebSocket (not polling)
  withCredentials: true
});

// Listen for connection
socket.on('connect', () => {
  console.log('✅ Admin socket connected:', socket.id);
});

export default function AdminInboxPage() {
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || !storedUser.isAdmin) {
      navigate('/'); // Not an admin — redirect
    } else {
      fetchUsers();
    }
  }, []);

  useEffect(() => {
    if (activeUser) {
      fetchMessages();
    }
  }, [activeUser]);

  useEffect(() => {
    // Listen for real-time incoming messages
    const handleReceive = (msg) => {
      console.log('💬 Admin received message:', msg);
      if (
        msg.sender === activeUser ||
        msg.receiver === activeUser ||
        msg.senderEmail === activeUser ||
        msg.receiverEmail === activeUser
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on('receive_message', handleReceive);
    return () => socket.off('receive_message', handleReceive);
  }, [activeUser]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/messages/users`);
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/messages/${activeUser}`);
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    const message = {
      senderEmail: 'admin@example.com',
      receiverEmail: activeUser,
      content: newMsg,
    };

    try {
      await axios.post(`${API_BASE}/api/messages`, message);
      socket.emit('send_message', {
        sender: 'admin',
        text: newMsg,
        senderEmail: 'admin@example.com',
        receiverEmail: activeUser,
      });
      setMessages((prev) => [...prev, { ...message, isAdmin: true }]);
      setNewMsg('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row h-100">
      {/* Left Sidebar */}
      <div className="border-end w-100 w-md-25" style={{ maxHeight: '100vh', overflowY: 'auto' }}>
        <h5 className="p-3">Users</h5>
        <ul className="list-group">
          {users.map((email, idx) => (
            <li
              key={idx}
              className={`list-group-item ${email === activeUser ? 'active' : ''}`}
              onClick={() => setActiveUser(email)}
              style={{ cursor: 'pointer' }}
            >
              {email}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="flex-grow-1 d-flex flex-column justify-content-between" style={{ maxHeight: '100vh' }}>
        <div className="p-3 flex-grow-1 overflow-auto">
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-2 ${msg.isAdmin ? 'text-end' : 'text-start'}`}>
              <span className={`p-2 rounded ${msg.isAdmin ? 'bg-primary text-white' : 'bg-light'}`}>
                {msg.content}
              </span>
            </div>
          ))}
        </div>
        {activeUser && (
          <div className="p-3 border-top d-flex">
            <input
              className="form-control me-2"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="Type a message"
            />
            <button className="btn btn-dark" onClick={sendMessage}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
}