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
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
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

