// src/pages/PaymentMethodsPage.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * Displays all available payment options with brief descriptions.
 * Links to DepositPage for Add Funds (crypto/card/cash app).
 */
export default function PaymentMethodsPage() {
  const location = useLocation();
  const selectedJob = location.state?.job || 'a job position';

  return (
    <div className="container my-5">
      <h2 className="mb-3">Payment Methods</h2>

      {/* Job Application Message */}
      <div className="alert alert-info">
        <strong>You’re applying for:</strong> {selectedJob} <br />
        To complete your application, please make a payment using one of the methods below.
      </div>

      <div className="row g-4">
        {/* Crypto Card */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Pay with Crypto</h5>
              <p className="card-text flex-grow-1">
                Deposit using Bitcoin (BTC), Binance Coin (BNB), Tether (USDT), or Solana (SOL). 
                Fast, secure, and blockchain-based.
              </p>
              <a href="/deposit" className="btn btn-primary mt-auto">
                    Deposit via Crypto
                  </a>             
            </div>
          </div>
        </div>
        {/* Card Payment */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Pay with Card</h5>
              <p className="card-text flex-grow-1">
                Use your credit or debit card (Visa, MasterCard). 
                Currently a placeholder (not functional).
              </p>
              <a href="/not-available" className="btn btn-secondary mt-auto">
                Deposit via Card
              </a>
            </div>
          </div>
        </div>
        {/* Cash App */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Pay with Cash App</h5>
              <p className="card-text flex-grow-1">
                Deposit using Cash App. Placeholder integration. 
                Cash App username: <code>$YourCashAppID</code>
              </p>
              <a href="/not-available" className="btn btn-success mt-auto">
                Deposit via Cash App
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}