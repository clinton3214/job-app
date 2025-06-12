// src/pages/WithdrawPage.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * WithdrawPage lets the user request a withdrawal.
 * For now, form submission is a placeholder (alerts user).
 */
export default function WithdrawPage() {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: { method: 'crypto', currency: 'BTC' },
  });
  const [balance, setBalance] = useState(null);

  // Fetch current balance from mock profile endpoint
  useEffect(() => {
    fetch('/api/user/profile')
      .then((res) => res.json())
      .then((data) => {
        setBalance(data.balance);
      })
      .catch(console.error);
  }, []);

  const onSubmit = (data) => {
    const { amount, method, currency } = data;
    if (!amount || amount <= 0) {
      return alert('Enter a valid amount to withdraw.');
    }
    if (balance && parseFloat(amount) > parseFloat(balance.replace(/[^0-9.]/g, ''))) {
      return alert('Amount exceeds current balance.');
    }

    if (method === 'crypto') {
      alert(`Requesting withdraw of ₦${amount} via ${currency}. (Mock)`);
    } else if (method === 'card') {
      alert(`Requesting withdraw of ₦${amount} via Card. (Mock)`);
    } else if (method === 'cashapp') {
      alert(`Requesting withdraw of ₦${amount} via Cash App. (Mock)`);
    }
  };

  const selectedMethod = watch('method');

  return (
    <div className="page-wrapper text-white">
      <div className="form-container">
        <h4 className="mb-4 text-center">
          Withdraw Funds
          <small className="d-block text-muted">Your current balance: {balance || 'Loading…'}</small>
        </h4>

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
