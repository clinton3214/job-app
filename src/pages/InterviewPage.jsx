// src/pages/InterviewPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import io from 'socket.io-client';
import axios from 'axios';

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No token found');
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data);
        socket.emit('register_email', res.data.email);
      })
      .catch((err) => {
        console.error('❌ Failed to load user:', err);
      });
  }, []);

  useEffect(() => {
    const handleReceive = (msg) => {
      if (msg.receiverEmail === user?.email) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on('receive_message', handleReceive);
    return () => socket.off('receive_message', handleReceive);
  }, [user]);

  const sendMessage = () => {
    if (!input.trim() || !user) return;

    const msg = {
      sender: 'user',
      text: input.trim(),
      senderEmail: user.email,
      receiverEmail: 'ezeobiclinton@gmail.com',
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
    };

    socket.emit('send_message', msg);
    setMessages((prev) => [...prev, msg]);
    setInput('');
  };

  return (
    <Container className="py-4">
      <h3 className="mb-4 text-center">Live Interview</h3>
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