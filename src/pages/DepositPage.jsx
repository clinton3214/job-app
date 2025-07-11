// src/pages/DepositPage.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function DepositPage() {
  const { register, handleSubmit } = useForm({ defaultValues: { method: 'crypto', currency: 'BTC' } });
  const [loading, setLoading] = useState(false);

  const onSubmit = async ({ amount, method, currency }) => {
    if (!amount || amount <= 0) {
      return alert('Please enter a valid amount');
    }

    if (method === 'crypto') {
      setLoading(true);
      try {
        const response = await axios.post(`${API_BASE}/api/payment/crypto-charge`, { amount, currency });

        console.log("FULL RESPONSE:", response);


        // ✅ Correctly access the invoice_url returned from NOWPayments
        const paymentUrl = response.data?.invoice_url;

        if (!paymentUrl) {
          throw new Error('No payment URL returned from server');
        }

        // Redirect user to the payment page
        window.location.assign(paymentUrl);
      } catch (err) {
        console.error('DepositPage error:', err);
        const msg = err.response?.data?.error || err.message || 'Unknown error';
        alert(`Failed to create crypto charge: ${msg}`);
      } finally {
        setLoading(false);
      }
    } else if (method === 'card') {
      alert('Card payments are not yet enabled.');
    } else if (method === 'cashapp') {
      alert('Cash App payments are not yet enabled.');
    }
  };

  return (
    <div className="page-wrapper text-white">
      <div className="form-container">
        <h4 className="mb-4 text-center">
          Deposit Funds
          <small className="d-block text-muted">Choose your payment method</small>
        </h4>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label">Amount to deposit</label>
            <input
              {...register('amount', { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="form-control"
              placeholder="e.g. 100.00"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mode of deposit</label>
            <div>
              <div className="form-check form-check-inline">
                <input
                  {...register('method')}
                  type="radio"
                  value="crypto"
                  id="methodCrypto"
                  className="form-check-input"
                />
                <label htmlFor="methodCrypto" className="form-check-label">
                  Crypto
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  {...register('method')}
                  type="radio"
                  value="card"
                  id="methodCard"
                  className="form-check-input"
                />
                <label htmlFor="methodCard" className="form-check-label">
                  Card
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  {...register('method')}
                  type="radio"
                  value="cashapp"
                  id="methodCashApp"
                  className="form-check-input"
                />
                <label htmlFor="methodCashApp" className="form-check-label">
                  Cash App
                </label>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="d-flex align-items-center">
              <label className="form-label me-3">Currency</label>
              <select {...register('currency')} className="form-select w-auto">
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="BNB">Binance Coin (BNB)</option>
                <option value="SOL">Solana (SOL)</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-success w-100" disabled={loading}>
            {loading ? 'Processing…' : 'Deposit'}
          </button>
        </form>
      </div>
    </div>
  );
}
