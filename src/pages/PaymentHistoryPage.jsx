// src/pages/PaymentHistoryPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function PaymentHistoryPage() {
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [publicPayments, setPublicPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch personal deposits
      const depRes = await axios.get(`${API_BASE}/api/history/deposits`, { headers });
      const depData = depRes.data;

      // Fetch personal withdrawals
      const witRes = await axios.get(`${API_BASE}/api/history/withdrawals`, { headers });
      const witData = witRes.data;

      // Fetch public payments (no auth required)
      const pubRes = await axios.get(`${API_BASE}/api/admin/payments`);
      const pubData = pubRes.data;

      setDeposits(depData);
      setWithdrawals(witData);
      setPublicPayments(pubData);
    } catch (err) {
      console.error('PaymentHistoryPage error:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <h2 className="mb-4">Payment History</h2>

      {/* Personal Deposit History */}
      <div className="card mb-5">
        <div className="card-header bg-secondary text-white">
          <strong>My Deposits</strong>
        </div>
        <div className="card-body p-0">
          <table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {deposits.length > 0 ? (
                deposits.map((d, i) => (
                  <tr key={i}>
                    <td>{d.amount}</td>
                    <td>{d.method}</td>
                    <td>
                      <span className={
                        d.status === 'successful'
                          ? 'badge bg-success'
                          : d.status === 'pending'
                          ? 'badge bg-warning text-dark'
                          : 'badge bg-danger'
                      }>
                        {d.status}
                      </span>
                    </td>
                    <td>{new Date(d.time || d.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-3">
                    No deposit records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Personal Withdrawal History */}
      <div className="card mb-5">
        <div className="card-header bg-secondary text-white">
          <strong>My Withdrawals</strong>
        </div>
        <div className="card-body p-0">
          <table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.length > 0 ? (
                withdrawals.map((w, i) => (
                  <tr key={i}>
                    <td>{w.amount}</td>
                    <td>{w.method}</td>
                    <td>
                      <span className={
                        w.status === 'successful'
                          ? 'badge bg-success'
                          : w.status === 'pending'
                          ? 'badge bg-warning text-dark'
                          : 'badge bg-danger'
                      }>
                        {w.status}
                      </span>
                    </td>
                    <td>{new Date(w.time || w.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-3">
                    No withdrawal records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Public Payment History (latest 50 payments) */}
      <div className="card mb-5">
        <div className="card-header bg-secondary text-white">
          <strong>Recent Public Payments (All Users)</strong>
        </div>
        <div className="card-body p-0">
          <table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>User ID</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {publicPayments.length > 0 ? (
                publicPayments.map((p, i) => (
                  <tr key={i}>
                    <td>{p.userId || 'N/A'}</td>
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
                    <td>{new Date(p.time || p.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-3">
                    No public payment records found.
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
