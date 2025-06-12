import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginSignupPage() {
  const [isSignup, setIsSignup] = useState(true);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async data => {
    try {
      if (isSignup) {
        // Signup flow
        await axios.post('/api/auth/signup', data);
        alert('Account created! Please log in.');
        setIsSignup(false);

      } else {
        // Login flow
        const resp = await axios.post('/api/auth/login', {
          email: data.email,
          password: data.password,
        });
        localStorage.setItem('token', resp.data.token);
        localStorage.setItem('userEmail', data.email);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Auth error:', err);
          const status = err.response?.status;
          const msg = err.response?.data?.error || err.message;
          if (status === 409) {
            alert('Email already registered. Please log in instead.');
            setIsSignup(false);
          } else {
            alert(msg);
          }
    }
  };

  return (
    <div className="page-wrapper text-white">
      <div className="form-container">
        <h4 className="mb-4 text-center">
          Let’s Get <strong>Started</strong><br />
          <small className="text-muted">
            {isSignup ? 'Create Your Account.' : 'Login to Your Account.'}
          </small>
        </h4>

        <form onSubmit={handleSubmit(onSubmit)}>
          {isSignup && (
            <>
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Full Name</label>
                  <input
                    {...register('fullName', { required: true })}
                    type="text"
                    className="form-control"
                    placeholder="John Doe"
                  />
                  {errors.fullName && <span className="text-danger">Required</span>}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Address</label>
                  <input
                    {...register('address', { required: true })}
                    type="text"
                    className="form-control"
                    placeholder="123 Main St"
                  />
                  {errors.address && <span className="text-danger">Required</span>}
                </div>
                <div className="col">
                  <label className="form-label">State</label>
                  <input
                    {...register('state', { required: true })}
                    type="text"
                    className="form-control"
                    placeholder="Lagos"
                  />
                  {errors.state && <span className="text-danger">Required</span>}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">ZIP Code</label>
                  <input
                    {...register('zip', { required: true })}
                    type="text"
                    className="form-control"
                    placeholder="100001"
                  />
                  {errors.zip && <span className="text-danger">Required</span>}
                </div>
                <div className="col">
                  <label className="form-label">Home Phone (Time to reach)</label>
                  <input
                    {...register('homePhone', { required: true })}
                    type="tel"
                    className="form-control"
                    placeholder="+234 1 234 5678"
                  />
                  {errors.homePhone && <span className="text-danger">Required</span>}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Cell Phone (Time to reach)</label>
                  <input
                    {...register('cellPhone', { required: true })}
                    type="tel"
                    className="form-control"
                    placeholder="+234 80 1234 5678"
                  />
                  {errors.cellPhone && <span className="text-danger">Required</span>}
                </div>
              </div>
            </>
          )}

          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Email</label>
              <input
                {...register('email', { required: true })}
                type="email"
                className="form-control"
                placeholder="you@example.com"
              />
              {errors.email && <span className="text-danger">Required</span>}
            </div>
            <div className="col">
              <label className="form-label">Password</label>
              <input
                {...register('password', { required: true })}
                type="password"
                className="form-control"
                placeholder="••••••••"
              />
              {errors.password && <span className="text-danger">Required</span>}
            </div>
          </div>

          {isSignup && (
            <div className="form-check mb-3">
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

          <button type="submit" className="btn btn-success w-100">
            {isSignup ? 'Create Account' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-3">
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
  );
}