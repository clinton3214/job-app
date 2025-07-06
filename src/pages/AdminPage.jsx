// src/pages/AdminPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

/**
 * AdminPage shows:
 *  - Recent login entries (user, time, IP)
 *  - Recent payment records (user, amount, method, status)
 */
export default function AdminPage() {
  const [logins, setLogins] = useState([]);
  const [payments, setPayments] = useState([]);

  // Fetch data on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    axios.get(`${API_BASE}/api/admin/logins`, { headers })
      .then((res) => setLogins(res.data))
      .catch(console.error);

    axios.get(`${API_BASE}/api/admin/payments`, { headers })
      .then((res) => setPayments(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="container my-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      {/* Login Logs */}
      <div className="card mb-5">
        <div className="card-header bg-primary text-white">
          <strong>Recent Logins</strong>
        </div>
        <div className="card-body p-0">
          <table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>User</th>
                <th>Time</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {logins.length > 0 ? logins.map((entry, idx) => (
                <tr key={idx}>
                  <td>{entry.userEmail}</td>
                  <td>{new Date(entry.time).toLocaleString()}</td>
                  <td>{entry.ip}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="text-center py-3">
                    No login data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Records */}
      <div className="card mb-5">
        <div className="card-header bg-success text-white">
          <strong>Recent Payments</strong>
        </div>
        <div className="card-body p-0">
          <table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>User</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? payments.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.userEmail}</td>
                  <td>{p.amount}</td>
                  <td>{p.method}</td>
                  <td>
                    <span className={
                      p.status === 'successful'
                        ? 'badge bg-success'
                        : p.status === 'pending'
                        ? 'badge bg-warning text-dark'
                        : 'badge bg-danger'
                    }>
                      {p.status}
                    </span>
                  </td>
                  <td>{new Date(p.time).toLocaleString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center py-3">
                    No payment data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
