//admindashboard
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('users');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [userRes, logRes, refRes] = await Promise.all([
        axios.get(`${API_BASE}/api/admin/users`, { headers }),
        axios.get(`${API_BASE}/api/admin/logins`, { headers }),
        axios.get(`${API_BASE}/api/admin/referrals`, { headers }),
      ]);
      setUsers(userRes.data);
      setLogs(logRes.data);
      setReferrals(refRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Admin fetch error:', err);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${API_BASE}/api/admin/users/${userId}`, { headers });
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const toggleDisable = async (userId, currentStatus) => {
    try {
      await axios.put(
        `${API_BASE}/api/admin/users/${userId}/disable`,
        { disabled: !currentStatus },
        { headers }
      );
      setUsers(users.map((u) => (u.id === userId ? { ...u, disabled: !currentStatus } : u)));
    } catch (err) {
      console.error('Disable toggle error:', err);
    }
  };

  const promoteToAdmin = async (userId) => {
    try {
      await axios.put(`${API_BASE}/api/admin/users/${userId}/promote`, {}, { headers });
      setUsers(users.map((u) => (u.id === userId ? { ...u, isAdmin: true } : u)));
    } catch (err) {
      console.error('Promote error:', err);
    }
  };

  const updateBalance = async (userId, newBalance) => {
    try {
      await axios.put(
        `${API_BASE}/api/admin/users/${userId}/balance`,
        { balance: newBalance },
        { headers }
      );
      setUsers(users.map((u) => (u.id === userId ? { ...u, balance: newBalance } : u)));
    } catch (err) {
      console.error('Update balance error:', err);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div
      className="container-fluid bg-white min-vh-100"
      style={{ fontFamily: 'Inter, Noto Sans, sans-serif' }}
    >
      <div className="row g-0">
        {/* Sidebar */}
        <div className="col-md-3 border-end bg-white p-4">
          <h5 className="mb-4">Admin Panel</h5>
          <div className="list-group">
            <button
              className={`list-group-item list-group-item-action rounded-pill mb-2 ${
                tab === 'users' ? 'active bg-secondary text-white' : ''
              }`}
              onClick={() => setTab('users')}
            >
              Users
            </button>
            <button
              className={`list-group-item list-group-item-action rounded-pill mb-2 ${
                tab === 'logs' ? 'active bg-secondary text-white' : ''
              }`}
              onClick={() => setTab('logs')}
            >
              Logs
            </button>
            <button
              className={`list-group-item list-group-item-action rounded-pill mb-2 ${
                tab === 'referrals' ? 'active bg-secondary text-white' : ''
              }`}
              onClick={() => setTab('referrals')}
            >
              Referrals
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9 p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
            <h2 className="fw-bold text-dark mb-0">Users</h2>
            <button
              className="btn btn-dark rounded-pill"
              onClick={() => navigate('/admin/inbox')}
            >
              💬 Chat Interviewers
            </button>
          </div>

          {/* Users Tab */}
          {tab === 'users' && (
            <div className="table-responsive" style={{ overflowX: 'auto' }}>
    <table className="table table-bordered table-striped mb-0" style={{ minWidth: '600px' }}>
                <thead className="table-dark">
                  <tr>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Admin</th>
                    <th>Balance</th>
                    <th>Disabled</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.email}</td>
                      <td>{u.fullName}</td>
                      <td>{u.isAdmin ? 'Yes' : 'No'}</td>
                      <td>
                        <input
                          type="number"
                          value={u.balance}
                          onChange={(e) => updateBalance(u.id, parseFloat(e.target.value))}
                          className="form-control"
                          style={{ width: '100px' }}
                        />
                      </td>
                      <td>{u.disabled ? 'Yes' : 'No'}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger me-1"
                          onClick={() => handleDelete(u.id)}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn-sm btn-warning me-1"
                          onClick={() => toggleDisable(u.id, u.disabled)}
                        >
                          {u.disabled ? 'Enable' : 'Disable'}
                        </button>
                        {!u.isAdmin && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => promoteToAdmin(u.id)}
                          >
                            Make Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Logs Tab */}
          {tab === 'logs' && (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Email</th>
                    <th>IP Address</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <tr key={index}>
                      <td>{log.userEmail}</td>
                      <td>{log.ip}</td>
                      <td>{new Date(log.time).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Referrals Tab */}
          {tab === 'referrals' && (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>User</th>
                    <th>Referral Code</th>
                    <th>Referred By</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r, index) => (
                    <tr key={index}>
                      <td>{r.email}</td>
                      <td>{r.referralCode}</td>
                      <td>{r.referredBy || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}












// src/pages/AdminInboxPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Col, Form, Button, ListGroup, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { getAdminSocket } from '../layouts/AdminLayout';

const socket = getAdminSocket();
//const API_BASE = import.meta.env.VITE_BACKEND_URL;
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







// src/pages/LoginSignupPage.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import logoImg from '../assets/logo.jpg'; // adjust the path as needed

// Use environment variable for API base URL
const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function LoginSignupPage() {
  const [isSignup, setIsSignup] = useState(true);
  const [searchParams] = useSearchParams();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async data => {
    try {
      if (isSignup) {
        const refCode = data.referredBy?.trim();
        if (refCode) {
          data.referredBy = refCode;
        } else {
          delete data.referredBy;
        }
        // Sign up endpoint
        await axios.post(`${API_BASE}/api/auth/signup`, data);
        alert('Account created! Please log in.');
        setIsSignup(false);
      } else {
        // Login endpoint
        const resp = await axios.post(
          `${API_BASE}/api/auth/login`,
          {
            email: data.email,
            password: data.password,
          }
        );
        localStorage.setItem('token', resp.data.token);
        localStorage.setItem('user', JSON.stringify(resp.data.user));
        //localStorage.setItem('userEmail', data.email);

        const user = resp.data.user || {};
        console.log("Logged in user:", user); // 🆕 Debug line

        // ✅ FIXED: Check user.email only
        if (user.isAdmin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      const status = err.response?.status;
      const msg = err.response?.data?.error || err.message;
      if (status === 409) {
        alert('Email already registered. Please log in instead.');
        setIsSignup(false);
      } else if (status === 401 || msg.toLowerCase().includes('invalid')) {
        alert('Either email or password is incorrect.');
      } else {
        alert(msg);
      }
    }
  };

  return (
    <div className="position-relative d-flex min-vh-100 flex-column bg-light overflow-hidden" style={{ fontFamily: 'Inter, Noto Sans, sans-serif' }}>
      <div className="container-fluid d-flex flex-column flex-grow-1">
        <header className="d-flex flex-wrap align-items-center justify-content-between border-bottom px-3 px-md-5 py-3">
          <div className="d-flex align-items-center gap-3 text-dark">
            <div style={{ width: '1.5rem', height: '1.5rem' }}>
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="fs-5 fw-bold m-0">startnetnexus</h2>
          </div>
          <div className="d-flex flex-grow-1 justify-content-end gap-4">
            <nav className="d-flex align-items-center gap-4">
              <a className="text-dark fw-medium text-decoration-none" href="#">About</a>
              <a className="text-dark fw-medium text-decoration-none" href="#">Contact</a>
              <a className="text-dark fw-medium text-decoration-none" href="#">Help</a>
            </nav>
            <button className="btn rounded-pill bg-secondary text-dark fw-bold" onClick={() => setIsSignup(false)}>
              Login
            </button>
          </div>
        </header>

        <div className="px-3 px-md-5 d-flex flex-grow-1 justify-content-center py-5">
          <div className="w-100" style={{ maxWidth: '512px' }}>
            <h2 className="text-dark fw-bold fs-3 text-center py-3">{isSignup ? 'Create your account' : 'Login to your account'}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              {isSignup && (
                <>
                  {[['Full Name', 'fullName', 'John Doe'], ['Address', 'address', '123 Main St'], ['Email', 'email', 'you@example.com'], ['Password', 'password', '********'], ['Referral Code (Optional)', 'referredBy', 'Enter referral code'], ['Home Phone (Time to reach)', 'homePhone', '+234 1 234 5678'], ['Cell Phone (Time to reach)', 'cellPhone', '+234 80 1234 5678'], ['State', 'state', 'Lagos'], ['ZIP Code', 'zip', '100001']].map(([label, name, placeholder]) => (
                    <div className="mb-3 px-2 px-md-3" key={name}>
                      <label className="form-label fw-medium text-dark">{label}</label>
                      <input
                        {...register(name, name !== 'referredBy' ? { required: true } : {})}
                        type={name === 'password' ? 'password' : 'text'}
                        className="form-control rounded-4 border border-secondary bg-light text-dark p-3"
                        placeholder={placeholder}
                        defaultValue={name === 'referredBy' ? searchParams.get('ref') || '' : ''}
                      />
                      {errors[name] && <span className="text-danger">Required</span>}
                    </div>
                  ))}
                </>
              )}
              {!isSignup && (
                <>
                  <div className="row mb-3 gx-3">
                    <div className="col-12 col-md-6 mb-3 mb-md-0">
                      <label className="form-label text-dark">Email</label>
                      <input
                        {...register('email', { required: true })}
                        type="email"
                        className="form-control text-dark"
                        placeholder="you@example.com"
                      />
                      {errors.email && <span className="text-danger">Required</span>}
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label text-dark">Password</label>
                      <input
                        {...register('password', { required: true })}
                        type="password"
                        className="form-control text-dark"
                        placeholder="********"
                      />
                      {errors.password && <span className="text-danger">Required</span>}
                    </div>
                  </div>
                  <div className="text-end mb-3">
                    <Link to="/forgot-password" className="text-dark text-decoration-underline">
                      Forgot Password?
                    </Link>
                  </div>
                </>
              )}
              {isSignup && (
                <div className="form-check mb-3 px-3">
                  <input
                    {...register('terms', { required: true })}
                    type="checkbox"
                    className="form-check-input"
                    id="termsCheck"
                  />
                  <label className="form-check-label" htmlFor="termsCheck">
                    I agree to all the <a href="#">Terms</a>, <a href="#">Privacy Policy</a> and Fees
                  </label>
                  {errors.terms && <span className="text-danger">Required</span>}
                </div>
              )}
              <div className="px-3">
                <button type="submit" className="btn btn-dark w-100 rounded-pill fw-bold py-2">
                  {isSignup ? 'Create Account' : 'Login'}
                </button>
              </div>
            </form>
            <p className="text-center mt-3 text-dark">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  setIsSignup(!isSignup);
                }}
              >
                {isSignup ? 'Login' : 'Sign Up'}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

