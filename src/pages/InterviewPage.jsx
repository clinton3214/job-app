// src/pages/InterviewPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import io from 'socket.io-client';

// Connect to backend via socket
const socket = io(import.meta.env.VITE_BACKEND_URL);

export default function InterviewPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Listen for messages from admin
    const handleReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('receive_message', handleReceiveMessage);

    // Clean up socket listener on unmount
    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const msg = { sender: 'user', text: input };
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
            className={`${msg.sender === 'user' ? 'text-end' : 'text-start'}`}
            style={{ color: 'black', backgroundColor: msg.sender === 'user' ? '#e6f7ff' : '#fff' }}
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