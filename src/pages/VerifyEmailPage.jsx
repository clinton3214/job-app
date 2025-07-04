// src/pages/VerifyEmailPage.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verifying…');

  useEffect(() => {
    const token = searchParams.get('token');
    axios.get(`/api/auth/verify-email?token=${token}`)
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
