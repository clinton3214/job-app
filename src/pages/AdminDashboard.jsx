import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('users'); // tabs: users, logs, referrals

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
    <div className="container my-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      <div className="btn-group mb-3">
        <button className="btn btn-outline-primary" onClick={() => setTab('users')}>Users</button>
        <button className="btn btn-outline-primary" onClick={() => setTab('logs')}>Logs</button>
        <button className="btn btn-outline-primary" onClick={() => setTab('referrals')}>Referrals</button>
      </div>

      {tab === 'users' && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
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
                    <button className="btn btn-sm btn-danger me-1" onClick={() => handleDelete(u.id)}>Delete</button>
                    <button className="btn btn-sm btn-warning me-1" onClick={() => toggleDisable(u.id, u.disabled)}>
                      {u.disabled ? 'Enable' : 'Disable'}
                    </button>
                    {!u.isAdmin && (
                      <button className="btn btn-sm btn-success" onClick={() => promoteToAdmin(u.id)}>Make Admin</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
  );
}
