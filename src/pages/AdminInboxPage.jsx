// src/pages/AdminInboxPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function AdminInboxPage() {
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
   // const storedUser = JSON.parse(localStorage.getItem('user'));
   // if (!storedUser || storedUser.email !== 'admin@example.com') {
   //   navigate('/'); // Not an admin — redirect
   // } else {
   //   fetchUsers();
   // }
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
    try {
      await axios.post(`${API_BASE}/api/messages`, {
        senderEmail: 'admin@example.com',
        receiverEmail: activeUser,
        content: newMsg
      });
      setNewMsg('');
      fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row h-100">
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