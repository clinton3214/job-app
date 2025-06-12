import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * ProfilePage fetches and displays the user’s profile data.
 * Endpoint: GET /api/user/profile
 */
export default function ProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch('/api/user/profile')
      .then(res => res.json())
      .then(setProfile)
      .catch(console.error);
  }, []);

  if (!profile) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <h2 className="mb-4">Your Profile</h2>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <h6>Full Name</h6>
              <p>{profile.fullName}</p>
            </div>
            <div className="col-md-6">
              <h6>Email</h6>
              <p>{profile.email}</p>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <h6>Address</h6>
              <p>{profile.address}</p>
            </div>
            <div className="col-md-3">
              <h6>State</h6>
              <p>{profile.state}</p>
            </div>
            <div className="col-md-3">
              <h6>ZIP Code</h6>
              <p>{profile.zip}</p>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <h6>Home Phone</h6>
              <p>{profile.homePhone}</p>
            </div>
            <div className="col-md-6">
              <h6>Cell Phone</h6>
              <p>{profile.cellPhone}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <h6>Balance</h6>
              <p>{profile.balance}</p>
            </div>
            <div className="col-md-6">
              <h6>Referral Bonus</h6>
              <p className="text-success">{profile.referralBonus}</p>
            </div>
          </div>
        </div>
      </div>
      {/* You can add Edit Profile or other actions here */}
    </div>
  );
}
