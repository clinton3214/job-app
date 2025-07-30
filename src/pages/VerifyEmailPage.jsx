// src/pages/VerifyEmailPage.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verifying...');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const verifiedParam = searchParams.get('verified');
    if (verifiedParam === '1') {
      setStatus('✅ Email verified! Redirecting to login…');
      setIsSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } else {
      setStatus('❌ Verification failed or link expired.');
    }
  }, [searchParams, navigate]);

  return (
    <div className="container my-5 text-center">
      <h2 className={isSuccess ? 'text-success' : 'text-danger'}>{status}</h2>
      {!isSuccess && (
        <p className="mt-3">
          <Link to="/" className="btn btn-outline-dark rounded-pill">
            Go back to login
          </Link>
        </p>
      )}
    </div>
  );
}