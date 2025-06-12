import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function DepositCancelPage() {
  return (
    <div className="container my-5 text-center">
      <h2 className="text-danger">Payment Cancelled</h2>
      <p>Your deposit was not completed.</p>
      <Link to="/deposit/add-funds" className="btn btn-secondary mt-3">
        Try Again
      </Link>
    </div>
  );
}
