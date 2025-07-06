// src/pages/WithdrawPage.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function WithdrawPage() {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: { method: 'crypto', currency: 'BTC' },
  });
  const [balance, setBalance] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch user balance
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${API_BASE}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setBalance(res.data.balance))
      .catch(err => setError('Failed to fetch balance'));
  }, []);

  const onSubmit = async (data) => {
    setMessage('');
    setError('');
    const { amount, method } = data;
    const numericBalance = parseFloat(balance);

    if (!amount || amount <= 0) {
      return setError('Enter a valid amount to withdraw.');
    }
    if (numericBalance && parseFloat(amount) > numericBalance) {
      return setError('Amount exceeds your current balance.');
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE}/api/withdraw`,
        { amount: parseFloat(amount), method },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Withdrawal request submitted successfully.');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Withdrawal request failed.');
    }
  };

  const selectedMethod = watch('method');

  return (
    <div className="page-wrapper text-white">
      <div className="form-container">
        <h4 className="mb-4 text-center">
          Withdraw Funds
          <small className="d-block text-muted">Your current balance: ₦{balance ?? 'Loading…'}</small>
        </h4>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Amount to withdraw</label>
            <input
              {...register('amount', { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="form-control"
              placeholder="e.g. 500.00"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Method</label>
            <div>
              <div className="form-check form-check-inline">
                <input
                  {...register('method')}
                  type="radio"
                  value="crypto"
                  id="withdrawCrypto"
                  className="form-check-input"
                />
                <label htmlFor="withdrawCrypto" className="form-check-label">
                  Crypto
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  {...register('method')}
                  type="radio"
                  value="card"
                  id="withdrawCard"
                  className="form-check-input"
                />
                <label htmlFor="withdrawCard" className="form-check-label">
                  Card
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  {...register('method')}
                  type="radio"
                  value="cashapp"
                  id="withdrawCashApp"
                  className="form-check-input"
                />
                <label htmlFor="withdrawCashApp" className="form-check-label">
                  Cash App
                </label>
              </div>
            </div>
          </div>

          {selectedMethod === 'crypto' && (
            <div className="mb-3">
              <label className="form-label">Currency</label>
              <select {...register('currency')} className="form-select w-auto">
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="BNB">Binance Coin (BNB)</option>
                <option value="USDT">Tether (USDT)</option>
                <option value="SOL">Solana (SOL)</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn btn-success w-100">
            Request Withdraw
          </button>
        </form>
      </div>
    </div>
  );
}
