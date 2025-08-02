import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import logoImg from '../assets/logo.png'; // Adjust the path as necessary

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function DepositPage() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      method: 'crypto',
      currency: 'BTC',
      fiatCurrency: 'USD', // default fiat currency
    },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async ({ amount, method, currency, fiatCurrency }) => {
    if (!amount || amount <= 0) {
      return alert('Please enter a valid amount');
    }

    if (method === 'crypto') {
      setLoading(true);
      try {
        const response = await axios.post(`${API_BASE}/api/payment/crypto-charge`, {
          amount,
          currency, // pay_currency
          price_currency: fiatCurrency.toLowerCase(), // send chosen fiat currency
        });
        const paymentUrl = response.data?.paymentUrl;
        if (!paymentUrl) {
          throw new Error('No payment URL returned from server');
        }
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
    <div className="container-fluid bg-light min-vh-100 d-flex flex-column text-black">
      <header className="d-flex justify-content-between align-items-center border-bottom px-3 py-2 bg-white">
        <div className="d-flex align-items-center gap-2">
          <img
      src={logoImg}
      alt="Startnet Nexus Logo"
      style={{ height: '50px', objectFit: 'contain' }}
    />
        </div>
        
        
        
      </header>
      <main className="container d-flex flex-column align-items-center py-5">
        <div className="w-100" style={{ maxWidth: '512px' }}>
          <h3 className="fw-bold mb-4">Deposit</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="text-black">
            <div className="mb-3">
              <label className="form-label">Amount</label>
              <input
                {...register('amount', { valueAsNumber: true })}
                type="number"
                step="0.01"
                 className="form-control form-control-lg bg-white text-black border border-secondary rounded shadow-sm"
                placeholder="Enter amount"
                required
              />
            </div>

            {/* New FIAT currency selector */}
            <div className="mb-4">
              <label className="form-label">Currency to Pay In</label>
              <select
                {...register('fiatCurrency')}
                className="form-select form-select-lg bg-light border-0 rounded"
              >
                <option value="USD">USD-united states dollars</option>
                <option value="NGN">NGN-nigeria naira</option>
                <option value="GBP">GBP-pounds</option>
                <option value="EUR">EUR-Euro</option>
              </select>
            </div>

            <h5 className="mt-4 mb-3">Payment Method</h5>
            <div className="mb-3">
              {['crypto', 'card', 'cashapp'].map((value) => (
                <div key={value} className="form-check mb-2">
                  <input
                    {...register('method')}
                    className="form-check-input"
                    type="radio"
                    value={value}
                    id={`method-${value}`}
                  />
                  <label className="form-check-label" htmlFor={`method-${value}`}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </label>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <label className="form-label">Crypto Currency</label>
              <select
                {...register('currency')}
                className="form-select form-select-lg bg-white text-black border border-secondary rounded shadow-sm"
              >
                <option value="BTC">BTC</option>
                <option value="SOL">SOL</option>
                <option value="BNB">BNB</option>
                
              </select>
            </div>

            <button type="submit" className="btn btn-dark w-100 py-3" disabled={loading}>
              {loading ? 'Processing…' : 'Deposit'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}