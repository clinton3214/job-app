import React, { useEffect, useState } from 'react';
import { Container, Form, Button, InputGroup } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { Bell, Image as ImageIcon } from 'react-bootstrap-icons';
import io from 'socket.io-client';
import axios from 'axios';
import logoImg from '../assets/logo.png'; // Adjust the path as necessary

// Initialize socket connection
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
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const chatType = queryParams.get('type'); // will be 'customer-service' if triggered from support

  // Fetch user data on component mount
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

//to know if its customer service 
  useEffect(() => {
  if (user && chatType === 'customer-service') {
    const systemMessage = {
      sender: 'system',
      content: `[System] ${user.name} is requesting Customer Service.`,
      senderEmail: user.email,
      receiverEmail: 'startnetnexus@gmail.com',
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
    };
    socket.emit('send_message', systemMessage);
    
  }
  }, [user, chatType]);

  // Handle incoming messages
  useEffect(() => {
    const handleReceive = (msg) => {
      if (msg.receiverEmail === user?.email) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on('receive_message', handleReceive);
    return () => socket.off('receive_message', handleReceive);
  }, [user]);

  // Send a message
  const sendMessage = () => {
    if (!input.trim() || !user) return;

    const msg = {
      sender: 'user',
      content: input.trim(),
      senderEmail: user.email,
      receiverEmail: 'startnetnexus@gmail.com',
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
    };

    socket.emit('send_message', msg);
    setMessages((prev) => [...prev, msg]);
    setInput('');
  };

  return (
    <div
      className="d-flex flex-column min-vh-100 bg-light"
      style={{ fontFamily: "Inter, 'Noto Sans', sans-serif" }}
    >
      {/* Header */}
      <header className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 border-bottom px-4 py-3 bg-white">
        <div className="d-flex align-items-center gap-2 text-dark">
          
          <img
      src={logoImg}
      alt="Startnet Nexus Logo"
      style={{ height: '50px', objectFit: 'contain' }}
    />
        </div>
        <div className="d-flex flex-column flex-md-row align-items-center gap-3 w-100 justify-content-between justify-content-md-end">
          
          <Button variant="light" className="rounded-circle p-2">
            <Bell size={20} className="text-dark" />
          </Button>
          <div
            className="rounded-circle bg-cover bg-center"
            style={{
              width: '40px',
              height: '40px',
              backgroundImage: `url(https://lh3.googleusercontent.com/aida-public/AB6AXuAXgLob3EsILUMd_LNcPzNv4f1MvK8_K453U1VscPCPcQBEGQZU8EzO9NXWLyQ6pER3nO9jGqOWhzaCrTjBtiVCDnxItD1_jx8cfMSGbUhP37VSwj7klrz4Gr0ZkPkVAEj_NbdvEfgjjd2UmnrmKbau9Ga3xU6fhgEwUfazD8DFUsEpaNS6vcI9QAJkR5sMS8qgAOPCfiN_sW10i2tMTUGU_h2xedC4Ymr88YYmRbZAZg6cd9IBdQHpG5UT-AQ2zWUtsNNMu0kv08A)`,
            }}
          ></div>
        </div>
      </header>

      {/* Main Content */}
      <Container className="flex-grow-1 py-4">
        <h3 className="fw-bold mb-4">chatting {user?.name || '...'}</h3>

        {/* Messages */}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`d-flex gap-3 mb-4 ${
              msg.sender === 'user'
                ? 'justify-content-end text-end'
                : 'text-start'
            }`}
          >
            
            <div>
              <small className="text-muted">
                {msg.sender === 'user' ? 'You' : 'Admin'}
              </small>
              <div
                className={`p-3 rounded mt-1 border border-3 ${
                  msg.sender === 'user'
                    ? 'bg-dark text-white border-white'
                    : 'bg-secondary-subtle text-dark border-secondary'
                }`}
                style={{
                  borderColor: msg.sender === 'user' ? '#ffffff' : '#6c757d', // white or Bootstrap's secondary
                }}
              >
                {msg.content}
              </div>
            </div>
            
          </div>
        ))}

        {/* Message Input */}
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <InputGroup className="mb-3">
          <Form.Control
              placeholder="Type a message"
              className="bg-secondary-subtle border-0 text-black"
              style={{ color: 'black' }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button variant="light" disabled>
              <ImageIcon className="text-muted" />
            </Button>
            <Button variant="dark" type="submit" className="border border-3 border-white">
              Send
            </Button>
          </InputGroup>
        </Form>
      </Container>
    </div>
  );
}