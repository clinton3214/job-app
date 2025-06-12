import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * ReferralsPage fetches the user’s referral code and list of referrals.
 * Endpoint: GET /api/user/referrals
 */
export default function ReferralsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/user/referrals')
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
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
      <h2 className="mb-4">Your Referrals</h2>

      {/* Referral Code Section */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5>Your Referral Code</h5>
          <div className="d-flex gap-2 align-items-center">
            <code className="p-2 bg-light rounded">{data.code}</code>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => {
                navigator.clipboard.writeText(data.code);
                alert('Referral code copied to clipboard.');
              }}
            >
              Copy
            </button>
          </div>
          <p className="mt-2 text-muted">
            Share this code with friends. You earn ₦1,000 each time they sign up using it.
          </p>
        </div>
      </div>

      {/* Total Bonus Earned */}
      <div className="card mb-4 text-white bg-success shadow-sm">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h5>Total Bonus Earned</h5>
            <p className="h4">{data.totalBonus}</p>
          </div>
        </div>
      </div>

      {/* List of Referrals */}
      <div className="card shadow-sm">
        <div className="card-header bg-info text-white">
          <strong>Referred Users</strong>
        </div>
        <div className="card-body p-0">
          <table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>Email</th>
                <th>Date Referred</th>
                <th>Bonus</th>
              </tr>
            </thead>
            <tbody>
              {data.referrals.length > 0 ? (
                data.referrals.map((ref, idx) => (
                  <tr key={idx}>
                    <td>{ref.email}</td>
                    <td>{new Date(ref.date).toLocaleDateString()}</td>
                    <td>{ref.bonus}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-3">
                    No referrals yet.
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
