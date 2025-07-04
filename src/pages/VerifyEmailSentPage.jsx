// src/pages/VerifyEmailSentPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function VerifyEmailSentPage() {
  return (
    <div className="container my-5 text-center">
      <h2>Almost there!</h2>
      <p>We’ve sent a confirmation email to your inbox.</p>
      <p>Click the link in that email to verify your address.</p>
      <p>If you don’t see it, check your Spam folder.</p>
      <Link to="/" className="btn btn-primary mt-3">
        Return to Login
      </Link>
    </div>
  );
}
