import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  // Use Base URL from Vite config for reliable navigation
  const baseUrl = import.meta.env.BASE_URL || '/job-app/';

  return (
    <div className="container text-center py-5">
      <h1>404 – Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      {/* Anchor link ensures navigation even on GitHub Pages fallback */}
      <Link  className="btn btn-primary" href="/"> Go back to Login</Link>
 


    </div>
  );
}