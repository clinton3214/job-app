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
  const [unreadTotal, setUnreadTotal] = useState(0);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAll();
    fetchUnread();
  }, []);

  const fetchUnread = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/messages/unread-count`);
      setUnreadTotal(res.data.total || 0);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

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
      await axios.put(`${API_BASE}/api/admin/users/${userId}/disable`, { disabled: !currentStatus }, { headers });
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
      await axios.put(`${API_BASE}/api/admin/users/${userId}/balance`, { balance: newBalance }, { headers });
      setUsers(users.map((u) => (u.id === userId ? { ...u, balance: newBalance } : u)));
    } catch (err) {
      console.error('Update balance error:', err);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container-fluid bg-white min-vh-100" style={{ fontFamily: 'Inter, Noto Sans, sans-serif' }}>
      <div className="row g-0">
        <div className="col-md-3 border-end bg-white p-4">
          <h5 className="mb-4">Admin Panel</h5>
          <div className="list-group">
            <button className={`list-group-item list-group-item-action rounded-pill mb-2 ${tab === 'users' ? 'active bg-secondary text-white' : ''}`} onClick={() => setTab('users')}>
              Users
            </button>
            <button className={`list-group-item list-group-item-action rounded-pill mb-2 ${tab === 'logs' ? 'active bg-secondary text-white' : ''}`} onClick={() => setTab('logs')}>
              Logs
            </button>
            <button className={`list-group-item list-group-item-action rounded-pill mb-2 ${tab === 'referrals' ? 'active bg-secondary text-white' : ''}`} onClick={() => setTab('referrals')}>
              Referrals
            </button>
          </div>
        </div>
        <div className="col-md-9 p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
            <h2 className="fw-bold text-dark mb-0">Users</h2>
            <button
              className="btn btn-dark rounded-pill position-relative"
              onClick={() => navigate('/admin/inbox')}
            >
              💬 Chat Interviewers
              {unreadTotal > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {unreadTotal}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}