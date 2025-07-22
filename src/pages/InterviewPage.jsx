// src/pages/InterviewPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import io from 'socket.io-client';
import axios from 'axios';

// Connect to socket server
const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ['websocket'],
  withCredentials: true,
});

socket.on('connect', () => {
  console.log('✅ User socket connected:', socket.id);
});

export default function InterviewPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState(null);

  // Fetch user info with token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No token found in localStorage');
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((res) => {
        console.log('👤 User info loaded:', res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.error('❌ Failed to fetch user info:', err);
      });
  }, []);

  // Receive messages from server
  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      console.log('📩 Message received:', msg);
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('receive_message', handleReceiveMessage);
    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, []);

  // Send message
  const sendMessage = () => {
    if (!input.trim()) return;

    if (!user) {
      console.warn('⚠️ User info not loaded yet. Message not sent.');
      return;
    }

    const msg = {
      sender: 'user',
      text: input.trim(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
    };

    console.log('📤 Sending message:', msg);
    socket.emit('send_message', msg);
    setMessages((prev) => [...prev, msg]);
    setInput('');
  };

  return (
    <Container className="py-4">
      <h3 className="mb-4 text-center">Live Interview</h3>

      {/* Messages */}
      <ListGroup style={{ maxHeight: '60vh', overflowY: 'auto' }} className="mb-3">
        {messages.map((msg, idx) => (
          <ListGroup.Item
            key={idx}
            className={msg.sender === 'user' ? 'text-end' : 'text-start'}
            style={{
              color: 'black',
              backgroundColor: msg.sender === 'user' ? '#e6f7ff' : '#fff',
            }}
          >
            <strong>{msg.sender === 'user' ? 'You' : 'Admin'}:</strong> {msg.text}
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Input */}
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <Form.Control
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ color: 'black' }}
        />
        <Button type="submit" className="mt-2 w-100">
          Send
        </Button>
      </Form>
    </Container>
  );
}