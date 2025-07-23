// AdminInboxPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { getAdminSocket } from '../layouts/AdminLayout';

const socket = getAdminSocket();
const API_BASE = import.meta.env.VITE_BACKEND_URL;
const ADMIN_EMAIL = 'ezeobiclinton@gmail.com';

export default function AdminInboxPage() {
  const [users, setUsers] = useState([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);
  const [allMessages, setAllMessages] = useState({});
  const [input, setInput] = useState('');
  const selectedUserRef = useRef(null);

  // Fetch list of users who have chatted with admin
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/messages/users`);
        const filtered = res.data.filter((email) => email !== ADMIN_EMAIL);
        setUsers(filtered);
      } catch (err) {
        console.error('❌ Failed to fetch users:', err);
      }
    };
    fetchUsers();
  }, []);

  // Fetch chat history when a user is selected
  useEffect(() => {
    if (!selectedUserEmail) return;
    selectedUserRef.current = selectedUserEmail;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/messages/${selectedUserEmail}`);
        setAllMessages((prev) => ({
          ...prev,
          [selectedUserEmail]: res.data,
        }));
      } catch (err) {
        console.error('❌ Failed to fetch messages:', err);
      }
    };
    fetchMessages();
  }, [selectedUserEmail]);

  // Listen for incoming socket messages
  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Admin socket connected:', socket.id);
    });

    socket.on('receive_message', (msg) => {
      console.log('📩 Admin received message:', msg);

      const relevant = msg.senderEmail !== ADMIN_EMAIL && msg.receiverEmail === ADMIN_EMAIL;
      if (relevant) {
        console.log('✅ Message added to UI:', msg);
        const sender = msg.senderEmail;
        setAllMessages((prev) => ({
          ...prev,
          [sender]: [...(prev[sender] || []), msg],
        }));

        if (!users.includes(sender)) {
          setUsers((prevUsers) => [...prevUsers, sender]);
        }
      } else {
        console.log('🚫 Message ignored (not sent to admin)');
      }
    });

    return () => {
      socket.off('receive_message');
    };
  }, [users]);

  // Send message to selected user
  const sendMessage = async () => {
    if (!input.trim() || !selectedUserEmail) return;
    if (selectedUserEmail === ADMIN_EMAIL) {
      console.warn('⚠️ Cannot send message to self');
      return;
    }

    const msg = {
      sender: 'admin',
      text: input.trim(),
      senderEmail: ADMIN_EMAIL,
      receiverEmail: selectedUserEmail,
    };

    console.log('💬 Admin sending message:', msg);
    socket.emit('send_message', msg);

    try {
      await axios.post(`${API_BASE}/api/messages`, {
        senderEmail: msg.senderEmail,
        receiverEmail: msg.receiverEmail,
        content: msg.text,
      });
    } catch (err) {
      console.error('❌ Failed to save message:', err);
    }

    setAllMessages((prev) => ({
      ...prev,
      [selectedUserEmail]: [...(prev[selectedUserEmail] || []), msg],
    }));
    setInput('');
  };

  const currentMessages = allMessages[selectedUserEmail] || [];

  return (
    <Container fluid className="py-4">
      <h3 className="text-center mb-4">Admin Inbox</h3>
      <Row>
        {/* 📧 User List */}
        <Col md={4}>
          <h5>Users</h5>
          <ListGroup>
            {users.map((email) => (
              <ListGroup.Item
                key={email}
                active={email === selectedUserEmail}
                onClick={() => {
                  setSelectedUserEmail(email);
                  selectedUserRef.current = email;
                }}
                style={{ cursor: 'pointer', color: 'black' }}
              >
                {email}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        {/* 💬 Chat Area */}
        <Col md={8}>
          {selectedUserEmail ? (
            <>
              <h5>Chat with: {selectedUserEmail}</h5>
              <ListGroup style={{ maxHeight: '60vh', overflowY: 'auto' }} className="mb-3">
                {currentMessages.map((msg, idx) => {
                  const isFromAdmin = msg.senderEmail === ADMIN_EMAIL;
                  return (
                    <ListGroup.Item
                      key={idx}
                      className={isFromAdmin ? 'text-end' : 'text-start'}
                      style={{
                        backgroundColor: isFromAdmin ? '#fff' : '#e6f7ff',
                        color: 'black',
                      }}
                    >
                      <strong>{isFromAdmin ? 'Admin' : msg.senderEmail}:</strong>{' '}
                      {msg.content || msg.text}
                    </ListGroup.Item>
                  );
                })}
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
            </>
          ) : (
            <p>Select a user to start chatting</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}






// src/pages/InterviewPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Form, Button, ListGroup } from 'react-bootstrap';
import io from 'socket.io-client';
import axios from 'axios';

// Connect to socket server
// const socket = io(import.meta.env.VITE_BACKEND_URL, {
 // transports: ['websocket'],
 // withCredentials: true,
//});

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

    // ⛔ Prevent sending message to self (admin)
    if (user.email === 'ezeobiclinton@gmail.com') {
      console.warn("⚠️ You're logged in as admin. You can't send messages to yourself.");
      return;
    }

    const msg = {
      sender: 'user',
      text: input.trim(),
      senderEmail: user.email,
      receiverEmail: 'ezeobiclinton@gmail.com',
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