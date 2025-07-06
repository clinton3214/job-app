// src/pages/VerifyEmailPage.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verifying…');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('❌ Invalid or missing verification token.');
      return;
    }

    axios
      .get(`${API_BASE}/api/auth/verify-email?token=${token}`)
      .then(() => {
        setStatus('✅ Email verified! Redirecting to login…');
        setTimeout(() => navigate('/'), 3000);
      })
      .catch(() => {
        setStatus('❌ Verification failed or link expired.');
      });
  }, [searchParams, navigate]);

  return (
    <div className="container my-5 text-center">
      <h2>{status}</h2>
    </div>
  );
}
