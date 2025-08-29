import React from 'react';
import { useNavigate } from 'react-router-dom';
import errorImg from '../assets/error.png'; // make sure the filename matches the file in src/assets

export default function NotAvailablePage() {
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
      <img
        src={errorImg}
        alt="Error"
        className="img-fluid mb-0"
        style={{ maxWidth: 320, marginBottom: -5, display: 'block' }}
      />
      <h1 className="text-danger" style={{ marginTop: 0 }}>
        Feature currently Not Available
      </h1>
      <p className="lead" style={{ marginTop: 0 }}>
        This is a technical issue we are working on it right now. Please contact customer service to complete the transaction with your chosen method.
      </p>
      <p className="card-text flex-grow-1" style={{ marginTop: 0 }}>
        Need help? Connect with a support agent via live chat.
      </p>
      <button
        onClick={() => navigate('/interview?type=customer-service')}
        className="btn btn-warning mt-3"
        style={{ borderRadius: '48px' }}
      >
        Start Chat
      </button>
    </div>
  );
}