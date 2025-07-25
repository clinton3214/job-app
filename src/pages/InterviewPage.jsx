import React, { useEffect, useState } from 'react';
import { Container, Form, Button, InputGroup } from 'react-bootstrap';
import { Bell, Image as ImageIcon } from 'react-bootstrap-icons';
import io from 'socket.io-client';
import axios from 'axios';

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
    <div
      className="d-flex flex-column min-vh-100 bg-light"
      style={{ fontFamily: "Inter, 'Noto Sans', sans-serif" }}
    >
      {/* Header */}
      <header className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 border-bottom px-4 py-3 bg-white">
        <div className="d-flex align-items-center gap-2 text-dark">
          <div style={{ width: '24px' }}>
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-dark"
            >
              <path
                d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className="h5 fw-bold m-0">startnetnexus</h2>
        </div>
        <div className="d-flex flex-column flex-md-row align-items-center gap-3 w-100 justify-content-between justify-content-md-end">
          <nav className="d-flex gap-3">
            <a className="text-dark text-decoration-none fw-medium" href="#">
              Dashboard
            </a>
            <a className="text-dark text-decoration-none fw-medium" href="#">
              Candidates
            </a>
            <a className="text-dark text-decoration-none fw-medium" href="#">
              Jobs
            </a>
            <a className="text-dark text-decoration-none fw-medium" href="#">
              Interview
            </a>
          </nav>
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
        <h3 className="fw-bold mb-4">Interviewer {user?.name || '...'}</h3>

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
                className={`p-3 rounded mt-1 border border-2 ${
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
            <Button variant="dark" type="submit" className="border border-2 border-white">
              Send
            </Button>
          </InputGroup>
        </Form>
      </Container>
    </div>
  );
}