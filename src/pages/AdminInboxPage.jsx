// src/pages/AdminInboxPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import io from 'socket.io-client';

// ✅ Connect to backend socket
const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ['websocket'],
  withCredentials: true,
});

export default function AdminInboxPage() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // ✅ Log when admin connects
    socket.on('connect', () => {
      console.log('✅ Admin socket connected:', socket.id);
    });

    // ✅ Receive messages from users
    socket.on('receive_message', (msg) => {
      console.log('📩 Admin received message:', msg);
      setMessages((prev) => [...prev, msg]);
    });

    // Cleanup
    return () => {
      socket.off('receive_message');
    };
  }, []);

  return (
    <Container className="py-4">
      <h3 className="mb-4 text-center">Admin Inbox</h3>

      {messages.length === 0 ? (
        <p className="text-muted text-center">No messages yet...</p>
      ) : (
        <ListGroup style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {messages.map((msg, idx) => (
            <ListGroup.Item
              key={idx}
              className={`${msg.sender === 'user' ? 'text-start' : 'text-end'}`}
              style={{
                color: 'black',
                backgroundColor: msg.sender === 'user' ? '#e6f7ff' : '#fff',
              }}
            >
              <strong>{msg.sender === 'user' ? 'User' : 'Admin'}:</strong> {msg.text}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
}