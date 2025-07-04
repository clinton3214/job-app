import React from 'react';

export default function NotFoundPage() {
  return (
    <div className="container text-center py-5">
      <h1>404 – Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      {/* Use an anchor link to ensure navigation even on 404 fallback */}
      <a
        className="btn btn-primary"
        href="/job-app/"
      >
        Go back to Login
      </a>
    </div>
  );
}