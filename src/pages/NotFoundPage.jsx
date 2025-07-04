// src/pages/NotFoundPage.jsx
import React from 'react';

export default function NotFoundPage() {
  return (
    <div className="container text-center py-5">
      <h1>404 – Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <button
        className="btn btn-primary"
        onClick={() => {
          // Redirect back to the GitHub Pages root for your app
          window.location.href = '/job-app/';
        }}
      >
        Go back to Login
      </button>
    </div>
  );
}
