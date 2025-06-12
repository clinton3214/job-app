import React from 'react';

export default function NotFoundPage() {
  return (
    <div className="container my-5 text-center">
      <h2>404 - Page Not Found</h2>
      <p>The page you’re looking for does not exist.</p>
      <a href="/" className="btn btn-primary mt-3">
        Return to Login
      </a>
    </div>
  );
}
