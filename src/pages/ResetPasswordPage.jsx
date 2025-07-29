// src/pages/ResetPasswordPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage('Invalid or missing token.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!newPassword || newPassword.length < 6) {
      return setMessage('Password must be at least 6 characters.');
    }

    if (newPassword !== confirmPassword) {
      return setMessage('Passwords do not match.');
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/reset-password`, {
        token,
        newPassword,
      });
      setMessage(res.data.message);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px', color: 'black' }}>
      <h3>Reset Password</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>New Password</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ color: 'black' }}
          />
        </div>
        <div className="mb-3">
          <label>Confirm Password</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ color: 'black' }}
          />
        </div>
        <button className="btn btn-success w-100" type="submit" disabled={loading || !token}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}
