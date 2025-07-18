// src/pages/LoginSignupPage.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

// Use environment variable for API base URL
const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function LoginSignupPage() {
  const [isSignup, setIsSignup] = useState(true);
  const [searchParams] = useSearchParams();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async data => {
    try {
      if (isSignup) {
        const refCode = data.referredBy?.trim();
        if (refCode) {
          data.referredBy = refCode;
        } else {
          delete data.referredBy;
        }
        // Sign up endpoint
        await axios.post(`${API_BASE}/api/auth/signup`, data);
        alert('Account created! Please log in.');
        setIsSignup(false);
      } else {
        // Login endpoint
        const resp = await axios.post(
          `${API_BASE}/api/auth/login`,
          {
            email: data.email,
            password: data.password,
          }
        );
        localStorage.setItem('token', resp.data.token);
        localStorage.setItem('userEmail', data.email);

        const user = resp.data.user || {};
        console.log("Logged in user:", user); // 🆕 Debug line

        // ✅ FIXED: Check user.email only
        if (user.isAdmin) {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      const status = err.response?.status;
      const msg = err.response?.data?.error || err.message;
      if (status === 409) {
        alert('Email already registered. Please log in instead.');
        setIsSignup(false);
      } else if (status === 401 || msg.toLowerCase().includes('invalid')) {
        alert('Either email or password is incorrect.');
      } else {
        alert(msg);
      }
    }
  };

  return (
    <div className="position-relative d-flex min-vh-100 flex-column bg-light overflow-hidden" style={{ fontFamily: 'Inter, Noto Sans, sans-serif' }}>
      <div className="container-fluid d-flex flex-column flex-grow-1">
        <header className="d-flex flex-wrap align-items-center justify-content-between border-bottom px-3 px-md-5 py-3">
          <div className="d-flex align-items-center gap-3 text-dark">
            <div style={{ width: '1.5rem', height: '1.5rem' }}>
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="fs-5 fw-bold m-0">startnetnexus</h2>
          </div>
          <div className="d-flex flex-grow-1 justify-content-end gap-4">
            <nav className="d-flex align-items-center gap-4">
              <a className="text-dark fw-medium text-decoration-none" href="#">About</a>
              <a className="text-dark fw-medium text-decoration-none" href="#">Contact</a>
              <a className="text-dark fw-medium text-decoration-none" href="#">Help</a>
            </nav>
            <button className="btn rounded-pill bg-secondary text-dark fw-bold" onClick={() => setIsSignup(false)}>
              Login
            </button>
          </div>
        </header>

        <div className="px-3 px-md-5 d-flex flex-grow-1 justify-content-center py-5">
          <div className="w-100" style={{ maxWidth: '512px' }}>
            <h2 className="text-dark fw-bold fs-3 text-center py-3">{isSignup ? 'Create your account' : 'Login to your account'}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              {isSignup && (
                <>
                  {[['Full Name', 'fullName', 'John Doe'], ['Address', 'address', '123 Main St'], ['Email', 'email', 'you@example.com'], ['Password', 'password', '********'], ['Referral Code (Optional)', 'referredBy', 'Enter referral code'], ['Home Phone (Time to reach)', 'homePhone', '+234 1 234 5678'], ['Cell Phone (Time to reach)', 'cellPhone', '+234 80 1234 5678'], ['State', 'state', 'Lagos'], ['ZIP Code', 'zip', '100001']].map(([label, name, placeholder]) => (
                    <div className="mb-3 px-2 px-md-3" key={name}>
                      <label className="form-label fw-medium text-dark">{label}</label>
                      <input
                        {...register(name, name !== 'referredBy' ? { required: true } : {})}
                        type={name === 'password' ? 'password' : 'text'}
                        className="form-control rounded-4 border border-secondary bg-light text-dark p-3"
                        placeholder={placeholder}
                        defaultValue={name === 'referredBy' ? searchParams.get('ref') || '' : ''}
                      />
                      {errors[name] && <span className="text-danger">Required</span>}
                    </div>
                  ))}
                </>
              )}
              {!isSignup && (
                <>
                  <div className="row mb-3 gx-3">
                    <div className="col-12 col-md-6 mb-3 mb-md-0">
                      <label className="form-label text-dark">Email</label>
                      <input
                        {...register('email', { required: true })}
                        type="email"
                        className="form-control text-dark"
                        placeholder="you@example.com"
                      />
                      {errors.email && <span className="text-danger">Required</span>}
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label text-dark">Password</label>
                      <input
                        {...register('password', { required: true })}
                        type="password"
                        className="form-control text-dark"
                        placeholder="********"
                      />
                      {errors.password && <span className="text-danger">Required</span>}
                    </div>
                  </div>
                  <div className="text-end mb-3">
                    <Link to="/forgot-password" className="text-dark text-decoration-underline">
                      Forgot Password?
                    </Link>
                  </div>
                </>
              )}
              {isSignup && (
                <div className="form-check mb-3 px-3">
                  <input
                    {...register('terms', { required: true })}
                    type="checkbox"
                    className="form-check-input"
                    id="termsCheck"
                  />
                  <label className="form-check-label" htmlFor="termsCheck">
                    I agree to all the <a href="#">Terms</a>, <a href="#">Privacy Policy</a> and Fees
                  </label>
                  {errors.terms && <span className="text-danger">Required</span>}
                </div>
              )}
              <div className="px-3">
                <button type="submit" className="btn btn-dark w-100 rounded-pill fw-bold py-2">
                  {isSignup ? 'Create Account' : 'Login'}
                </button>
              </div>
            </form>
            <p className="text-center mt-3 text-dark">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  setIsSignup(!isSignup);
                }}
              >
                {isSignup ? 'Login' : 'Sign Up'}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

