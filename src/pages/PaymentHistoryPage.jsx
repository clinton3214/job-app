// src/pages/PaymentHistoryPage.jsx
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function PaymentHistoryPage() {
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    setLoading(true);
    try {
      const depRes = await fetch('/api/history/deposits');
      const depData = await depRes.json();
      const witRes = await fetch('/api/history/withdrawals');
      const witData = await witRes.json();
      setDeposits(depData);
      setWithdrawals(witData);
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

      {/* Deposit History */}
      <div className="card mb-5">
        <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
          <strong>Deposit History</strong>
          <button className="btn btn-sm btn-outline-light" onClick={fetchHistory}>
            Refresh
          </button>
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
                    <td>{new Date(d.time).toLocaleString()}</td>
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

      {/* Withdrawal History */}
      <div className="card mb-5">
        <div className="card-header bg-warning text-dark">
          <strong>Withdrawal History</strong>
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
                    <td>{new Date(w.time).toLocaleString()}</td>
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
    </div>
  );
}
