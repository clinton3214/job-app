import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function DepositSuccessPage() {
  return (
    <div className="container my-5 text-center">
      <h2 className="text-success">Payment Successful!</h2>
      <p>Your deposit was completed successfully.</p>
      <Link to="/dashboard" className="btn btn-primary mt-3">
        Return to Dashboard
      </Link>
    </div>
  );
}
