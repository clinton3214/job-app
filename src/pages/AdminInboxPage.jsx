import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { getAdminSocket } from '../layouts/AdminLayout';

const socket = getAdminSocket();
const API_BASE = import.meta.env.VITE_BACKEND_URL;
const ADMIN_EMAIL = 'ezeobiclinton@gmail.com';

export default function AdminInboxPage() {
  const [users, setUsers] = useState([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // ✅ Fetch list of users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/messages/users`);
        setUsers(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch users:', err);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Load messages when user is selected
  useEffect(() => {
    if (!selectedUserEmail) return;
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/messages/${selectedUserEmail}`);
        setMessages(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch messages:', err);
      }
    };
    fetchMessages();
  }, [selectedUserEmail]);

  // ✅ Setup socket listener
  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Admin socket connected:', socket.id);
    });

    socket.on('receive_message', (msg) => {
      console.log('📩 Admin received message:', msg);
      if (
        msg.senderEmail === selectedUserEmail ||
        msg.receiverEmail === selectedUserEmail
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off('receive_message');
    };
  }, [selectedUserEmail]);

  // ✅ Send admin message
  const sendMessage = async () => {
    if (!input.trim() || !selectedUserEmail) return;
    const msg = {
      sender: 'admin',
      text: input.trim(),
      senderEmail: ADMIN_EMAIL,
      receiverEmail: selectedUserEmail,
    };
    console.log('💬 Admin sending message:', msg);

    // Emit socket
    socket.emit('send_message', msg);

    // Save to DB
    try {
      await axios.post(`${API_BASE}/api/messages`, {
        senderEmail: msg.senderEmail,
        receiverEmail: msg.receiverEmail,
        content: msg.text,
      });
    } catch (err) {
      console.error('❌ Failed to save message:', err);
    }

    setMessages((prev) => [...prev, msg]);
    setInput('');
  };

  return (
    <Container fluid className="py-4">
      <h3 className="text-center mb-4">Admin Inbox</h3>
      <Row>
        {/* 📇 User List */}
        <Col md={4}>
          <h5>Users</h5>
          <ListGroup>
            {users.map((email) => (
              <ListGroup.Item
                key={email}
                active={email === selectedUserEmail}
                onClick={() => setSelectedUserEmail(email)}
                style={{ cursor: 'pointer', color: 'black' }}
              >
                {email}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        {/* 💬 Chat Window */}
        <Col md={8}>
          {selectedUserEmail ? (
            <>
              <h5>Chat with: {selectedUserEmail}</h5>
              <ListGroup
                style={{ maxHeight: '60vh', overflowY: 'auto' }}
                className="mb-3"
              >
                {messages.map((msg, idx) => {
                  const isAdmin = msg.senderEmail === ADMIN_EMAIL;
                  return (
                    <ListGroup.Item
                      key={idx}
                      className={isAdmin ? 'text-end' : 'text-start'}
                      style={{
                        backgroundColor: isAdmin ? '#fff' : '#e6f7ff',
                        color: 'black',
                      }}
                    >
                      <strong>{isAdmin ? 'Admin' : msg.senderEmail}:</strong>{' '}
                      {msg.content || msg.text}
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>

              {/* 📝 Input */}
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