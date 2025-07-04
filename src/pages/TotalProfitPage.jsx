import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function TotalProfitPage() {
  const [profitData, setProfitData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfit() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('You must be logged in to view profit data.');
          return;
        }

        const res = await axios.get('/api/user/total-profit', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfitData(res.data);
      } catch (err) {
        console.error('Failed to load profit data:', err);
        alert(
          err.response?.data?.error ||
          'Could not fetch profit data. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProfit();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading profit data...</p>;
  if (!profitData) return <p className="text-center mt-5">No profit data available.</p>;

  return (
    <div className="container mt-5 text-black">
      <h2>Total Profit Summary</h2>
      <div className="card p-4 bg-light mt-3 shadow-sm">
        <p><strong>Total Deposits:</strong> ₦{(profitData.totalDeposits || 0).toFixed(2)}</p>
        <p><strong>Total Withdrawals:</strong> ₦{(profitData.totalWithdrawals || 0).toFixed(2)}</p>
        <p><strong>Total Referral Bonuses:</strong> ₦{(profitData.totalReferrals || 0).toFixed(2)}</p>
        <hr />
        <p><strong>Net Profit:</strong> ₦{(profitData.netProfit || 0).toFixed(2)}</p>
      </div>
    </div>
  );
}
