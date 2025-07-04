// src/pages/PaymentHistoryPage.jsx
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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

      // Fetch personal deposits
      const depRes = await fetch('/api/history/deposits', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const depData = await depRes.json();

      // Fetch personal withdrawals
      const witRes = await fetch('/api/history/withdrawals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const witData = await witRes.json();

      // Fetch public payments (no auth required)
      const pubRes = await fetch('/api/admin/payments');
      const pubData = await pubRes.json();

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
