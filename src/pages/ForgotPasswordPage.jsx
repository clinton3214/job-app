// src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post(`${API_BASE}/api/auth/forgot-password`, { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px', color: 'black' }}>
      <h3>Forgot Password</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email Address</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ color: 'black' }}
          />
        </div>
        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}
