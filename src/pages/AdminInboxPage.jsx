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
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const selectedUserRef = useRef(null);

  // Fetch list of users who have chatted with admin
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/messages/users`);
        // 🔒 Filter out admin email from user list
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
        setMessages(res.data);
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

      const currentUser = selectedUserRef.current;
      const involvedEmails = [msg.senderEmail, msg.receiverEmail];

      // ✅ Only display messages between admin and selected user, not admin↔admin
      if (
        involvedEmails.includes(ADMIN_EMAIL) &&
        involvedEmails.includes(currentUser) &&
        msg.senderEmail !== msg.receiverEmail
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  // Send message to selected user
  const sendMessage = async () => {
    if (!input.trim() || !selectedUserEmail) return;

    // 🔒 Prevent sending message to self
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

    // Emit via socket
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
                {messages.map((msg, idx) => {
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