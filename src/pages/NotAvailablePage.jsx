import React from 'react';
import { Link } from 'react-router-dom';

export default function NotAvailablePage() {
  return (
    <div className="container text-center mt-5">
      <h1 className="text-danger">Feature currently Not Available</h1>
      <p className="lead">This is a technical issue we are working on it right now, please contact customer service to complete the transction with your choosen method.</p>

      <p className="card-text flex-grow-1">
        Need help? Connect with a support agent via live chat.
      </p>
      <button
        onClick={() => handleNavigate('/interview?type=customer-service')}
        className="btn btn-warning mt-auto"
      >
        Start Chat
      </button>
     
    </div>
  );
}
