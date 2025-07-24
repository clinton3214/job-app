// src/pages/AdminInboxPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Col, Form, Button, ListGroup, Spinner } from 'react-bootstrap';
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
  const [loading, setLoading] = useState(false);
  const selectedUserRef = useRef(null);

  // Register admin on socket
  useEffect(() => {
    socket.emit('register_email', ADMIN_EMAIL);
  }, []);

  // Fetch users who chatted with admin
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

  // Fetch messages for selected user
  useEffect(() => {
    if (!selectedUserEmail) return;
    selectedUserRef.current = selectedUserEmail;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/api/messages/${selectedUserEmail}`);
        setAllMessages((prev) => ({
          ...prev,
          [selectedUserEmail]: res.data,
        }));
      } catch (err) {
        console.error('❌ Failed to fetch messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedUserEmail]);

  // Handle new incoming messages
  useEffect(() => {
    const handleReceive = (msg) => {
      const userEmail = msg.senderEmail === ADMIN_EMAIL ? msg.receiverEmail : msg.senderEmail;
      setAllMessages((prev) => ({
        ...prev,
        [userEmail]: [...(prev[userEmail] || []), msg],
      }));
      if (!users.includes(userEmail)) {
        setUsers((prev) => [...prev, userEmail]);
      }
    };

    socket.on('receive_message', handleReceive);

    return () => {
      socket.off('receive_message', handleReceive);
    };
  }, [users]);

  // Send admin reply
  const sendMessage = async () => {
    if (!input.trim() || !selectedUserEmail) return;

    const msg = {
      sender: 'admin',
      text: input.trim(),
      senderEmail: ADMIN_EMAIL,
      receiverEmail: selectedUserEmail,
    };

    // Emit to socket
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

    // Update UI
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
        {/* Left: User List */}
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

        {/* Right: Chat Box */}
        <Col md={8}>
          {selectedUserEmail ? (
            <>
              <h5>Chat with: {selectedUserEmail}</h5>

              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" />
                </div>
              ) : (
                <>
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
              )}
            </>
          ) : (
            <p>Select a user to start chatting</p>
          )}
        </Col>
      </Row>
    </Container>
  );
}