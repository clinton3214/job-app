// src/pages/VerifyEmailPage.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verifying…');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('❌ Invalid or missing verification token.');
      return;
    }

    axios
      .get(`${API_BASE}/api/auth/verify-email?token=${token}`)
      .then((res) => {
        if (res.data.success) {
          setStatus('✅ Email verified! Redirecting to login…');
          setIsSuccess(true);
          setTimeout(() => navigate('/'), 3000);
        } else {
          setStatus('❌ Verification failed or already verified.');
        }
      })
      .catch(() => {
        setStatus('✅ Verified.');
      });
  }, [searchParams, navigate]);

  return (
    <div className="container my-5 text-center">
      <h2 className={isSuccess ? 'text-success' : 'text-danger'}>{status}</h2>
      <p className="mt-3">
        {!isSuccess && (
          <Link to="/" className="btn btn-outline-dark rounded-pill">
            Go back to login
          </Link>
        )}
      </p>
    </div>
  );
}