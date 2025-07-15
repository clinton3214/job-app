import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function DepositPage() {
  const { register, handleSubmit } = useForm({
    defaultValues: { method: 'crypto', currency: 'BTC' },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async ({ amount, method, currency }) => {
    if (!amount || amount <= 0) {
      return alert('Please enter a valid amount');
    }
    if (method === 'crypto') {
      setLoading(true);
      try {
        const response = await axios.post(`${API_BASE}/api/payment/crypto-charge`, {
          amount,
          currency,
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
          <svg
            width="32"
            height="32"
            fill="currentColor"
            className="bi bi-circle-fill text-primary"
            viewBox="0 0 16 16"
          >
            <circle cx="8" cy="8" r="8" />
          </svg>
          <h5 className="mb-0 fw-bold">Coinbase</h5>
        </div>
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline-secondary p-2 rounded-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
            </svg>
          </button>
          <div
            className="rounded-circle bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD59nzejPTLr-9l4nXhSP4ZeRxBIyNNhJ3tCpFHfXOJY3jYHHFWUDcEOFLFIlGwatF9AOZvbcCTs-c6GpWBQ9wi8bpPUE53WERzDEVGu2VsPMy5rB2_qFmU0gQn1mFxDIw-SIyWSf-_E6JU-nXcO8X5u4Z9ZbdHUi87__I_GtkY53VlzX75HLmZLKS8JpKk3j3CPN615I6eOmMJuluWcEbSemf7r2DMh4WWqDGZCYfLRNxtoP7DFsHjirwfO4wRo8uM4sEKYqgH5UA")',
              width: '40px',
              height: '40px',
            }}
          ></div>
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
                className="form-control form-control-lg bg-light text-black border-0 rounded"
                placeholder="Enter amount"
                required
              />
            </div>

            <h5 className="mt-4 mb-3">Payment method</h5>
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
              <label className="form-label">Currency</label>
              <select
                {...register('currency')}
                className="form-select form-select-lg bg-light border-0 rounded"
              >
                <option value="BTC">BTC</option>
                <option value="SOL">SOL</option>
                <option value="BNB">BNB</option>
                <option value="TT">TT</option>
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
