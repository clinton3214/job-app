import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    async function fetchProfile() {
      try {
        // Grab token from localStorage
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch profile data
        const res = await axios.get(`${API_BASE}/api/user/profile`, { headers });

        // Populate state
        setProfile(res.data);
        setForm(res.data);
      } catch (err) {
        console.error('Error loading profile:', err);
        alert('Could not fetch profile data. Are you logged in?');
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Update profile data
      const res = await axios.put(`${API_BASE}/api/user/profile`, form, { headers });
      alert('Profile updated!');
      setProfile(res.data);
      setEditing(false);
    } catch (err) {
      console.error('Update error:', err);
      alert(err.response?.data?.error || 'Update failed');
    }
  };

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
      <h2 className="mb-4 text-white">Your Profile</h2>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label text-dark">Full Name</label>
              <input
                className="form-control text-dark bg-white"
                name="fullName"
                value={form.fullName || ''}
                disabled={!editing}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label text-dark">Email</label>
              <input
                className="form-control text-dark bg-white"
                name="email"
                value={form.email || ''}
                disabled={!editing}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label text-dark">Address</label>
              <input
                className="form-control text-dark bg-white"
                name="address"
                value={form.address || ''}
                disabled={!editing}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label text-dark">State</label>
              <input
                className="form-control text-dark bg-white"
                name="state"
                value={form.state || ''}
                disabled={!editing}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label text-dark">ZIP</label>
              <input
                className="form-control text-dark bg-white"
                name="zip"
                value={form.zip || ''}
                disabled={!editing}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label text-dark">Home Phone</label>
              <input
                className="form-control text-dark bg-white"
                name="homePhone"
                value={form.homePhone || ''}
                disabled={!editing}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label text-dark">Cell Phone</label>
              <input
                className="form-control text-dark bg-white"
                name="cellPhone"
                value={form.cellPhone || ''}
                disabled={!editing}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <label className="form-label text-dark">Balance</label>
              <input
                className="form-control text-dark bg-white"
                name="balance"
                value={form.balance || ''}
                disabled
              />
            </div>
            <div className="col-md-6">
              <label className="form-label text-dark">Referral Bonus</label>
              <input
                className="form-control text-success bg-white"
                name="referralBonus"
                value={form.referralBonus || ''}
                disabled
              />
            </div>
          </div>

          <div className="text-end mt-4">
            {editing ? (
              <>
                <button onClick={handleSave} className="btn btn-success me-2">Save</button>
                <button onClick={() => { setEditing(false); setForm(profile); }} className="btn btn-secondary">Cancel</button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="btn btn-primary">Edit Profile</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
