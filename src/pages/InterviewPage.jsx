import React, { useEffect, useState } from 'react';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_BACKEND_URL); // Make sure your backend supports this

export default function InterviewPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off('receive_message');
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
      <h3 className="mb-4">Live Interview</h3>
      <ListGroup style={{ maxHeight: '60vh', overflowY: 'auto' }} className="mb-3">
        {messages.map((msg, idx) => (
          <ListGroup.Item key={idx} className={msg.sender === 'user' ? 'text-end' : 'text-start'}>
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
        />
        <Button type="submit" className="mt-2 w-100">
          Send
        </Button>
      </Form>
    </Container>
  );
}