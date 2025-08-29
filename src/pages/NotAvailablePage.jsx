import React from 'react';
import { useNavigate } from 'react-router-dom';
import errorImg from '../assets/error.png';

export default function NotAvailablePage() {
  const navigate = useNavigate();

  return (
    <div
      className="text-center"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // vertical center
        alignItems: 'center',     // horizontal center
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <img
        src={errorImg}
        alt="Error"
        className="img-fluid"
        style={{
          maxWidth: 320,
          marginBottom: 0, // no space below image
          display: 'block',
        }}
      />
      <h1
        className="text-danger"
        style={{ marginTop: 0, marginBottom: 0 }} // no space above/below heading
      >
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
        style={{ borderRadius: '9999px' }} // very rounded
      >
        Start Chat
      </button>
    </div>
  );
}