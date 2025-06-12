import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * TotalProfitPage fetches and displays overall profit metrics.
 * Endpoint: GET /api/admin/total-profit
 */
export default function TotalProfitPage() {
  const [profitData, setProfitData] = useState(null);

  useEffect(() => {
    fetch('/api/admin/total-profit')
      .then((res) => res.json())
      .then(setProfitData)
      .catch(console.error);
  }, []);

  if (!profitData) {
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
      <h2 className="mb-4">Total Profit Dashboard</h2>

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-white bg-secondary mb-3">
            <div className="card-body">
              <h6 className="card-title">Total Deposits</h6>
              <p className="card-text h4">{profitData.totalDeposits}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-danger mb-3">
            <div className="card-body">
              <h6 className="card-title">Total Withdrawals</h6>
              <p className="card-text h4">{profitData.totalWithdrawals}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-info mb-3">
            <div className="card-body">
              <h6 className="card-title">Fees Collected</h6>
              <p className="card-text h4">{profitData.totalFeesCollected}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h6 className="card-title">Net Profit</h6>
              <p className="card-text h4">{profitData.netProfit}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          Profit Breakdown (Recent)
        </div>
        <div className="card-body p-0">
          <table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Profit</th>
              </tr>
            </thead>
            <tbody>
              {profitData.breakdown.map((entry, idx) => (
                <tr key={idx}>
                  <td>{entry.date}</td>
                  <td>{entry.profit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
