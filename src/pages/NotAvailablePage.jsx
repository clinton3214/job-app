import React from 'react';
import { Link } from 'react-router-dom';

export default function NotAvailablePage() {
  return (
    <div className="container text-center mt-5">
      <h1 className="text-danger">Feature currently Not Available</h1>
      <p className="lead">This is a technical issue we are working on it right now, try other payment methods. Please check back later.</p>
      <Link to="/deposit/add-funds" className="btn btn-primary mt-3">
        Go to Deposit Page
      </Link>
    </div>
  );
}
