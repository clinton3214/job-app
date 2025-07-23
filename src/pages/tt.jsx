// src/pages/AdminInboxPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ['websocket'],
  withCredentials: true,
});

export default function AdminInboxPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Admin socket connected:', socket.id);
    });

    socket.on('receive_message', (msg) => {
      console.log('📩 Admin received message:', msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = {
      sender: 'admin',
      text: input,
    };
    socket.emit('send_message', msg);
    setMessages((prev) => [...prev, msg]);
    setInput('');
  };

  return (
    <Container className="py-4">
      <h3 className="mb-4 text-center">Admin Inbox</h3>

      <ListGroup style={{ maxHeight: '60vh', overflowY: 'auto' }} className="mb-3">
        {messages.map((msg, idx) => (
          <ListGroup.Item
            key={idx}
            className={`${msg.sender === 'user' ? 'text-start' : 'text-end'}`}
            style={{
              color: 'black',
              backgroundColor: msg.sender === 'user' ? '#e6f7ff' : '#fff',
            }}
          >
            <strong>
              {msg.sender === 'user'
                ? `${msg.userName || 'User'} (${msg.userEmail || msg.userId || 'unknown'})`
                : 'Admin'}
              :
            </strong>{' '}
            {msg.text}
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
          placeholder="Reply to user..."
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


//newr update

// src/pages/AdminInboxPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import { getAdminSocket } from '../layouts/AdminLayout'; // ✅ shared socket

//const socket = getAdminSocket();

export default function AdminInboxPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Admin socket connected:', socket.id);
    });

    socket.on('receive_message', (msg) => {
      console.log('📩 Admin received message:', msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = {
      sender: 'admin',
      text: input,
        senderEmail: 'ezeobiclinton@gmail.com',     // static
        receiverEmail: selectedUserEmail,     // must be tracked based on current chat
    };
    console.log('📤 Admin sending message:', msg);
    socket.emit('send_message', msg);
    setMessages((prev) => [...prev, msg]);
    setInput('');
  };

  return (
    <Container className="py-4">
      <h3 className="mb-4 text-center">Admin Inbox</h3>

      <ListGroup style={{ maxHeight: '60vh', overflowY: 'auto' }} className="mb-3">
        {messages.map((msg, idx) => (
          <ListGroup.Item
            key={idx}
            className={`${msg.sender === 'user' ? 'text-start' : 'text-end'}`}
            style={{
              color: 'black',
              backgroundColor: msg.sender === 'user' ? '#e6f7ff' : '#fff',
            }}
          >
            <strong>
              {msg.sender === 'user'
                ? `${msg.userName || 'User'} (${msg.userEmail || msg.userId || 'unknown'})`
                : 'Admin'}
              :
            </strong>{' '}
            {msg.text}
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
          placeholder="Reply to user..."
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