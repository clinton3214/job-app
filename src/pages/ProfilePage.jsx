// ProfilePage.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const containerRef = useRef(null);
  const [editBtnTextColor, setEditBtnTextColor] = useState("#000");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${API_BASE}/api/user/profile`, { headers });
        setProfile(res.data);
        setForm(res.data);
      } catch (err) {
        console.error("Error loading profile:", err);
        alert("Could not fetch profile data. Are you logged in?");
      }
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    // determine background color luminance and set text color accordingly
    function getRgbValues(rgbString) {
      const m = rgbString.match(/\d+/g);
      if (!m) return null;
      return m.slice(0, 3).map((v) => parseInt(v, 10));
    }

    function luminance([r, g, b]) {
      // convert to linearized sRGB
      const srgb = [r, g, b].map((v) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
    }

    const el = containerRef.current || document.body;
    const bg = window.getComputedStyle(el).backgroundColor;
    const rgb = getRgbValues(bg);

    if (rgb) {
      const lum = luminance(rgb);
      // light background => dark text, dark background => light text
      setEditBtnTextColor(lum > 0.5 ? "#000" : "#fff");
    } else {
      // fallback: check class names (bg-white -> light)
      const isLight = el.classList?.contains?.("bg-white");
      setEditBtnTextColor(isLight ? "#000" : "#fff");
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.put(`${API_BASE}/api/user/profile`, form, { headers });
      alert("Profile updated!");
      setProfile(res.data);
      setEditing(false);
    } catch (err) {
      console.error("Update error:", err);
      alert(err.response?.data?.error || "Update failed");
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
    <div
      ref={containerRef}
      className="d-flex flex-column min-vh-100 bg-white"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      {/* Header */}
      <header className="d-flex align-items-center justify-content-between border-bottom px-3 px-md-5 py-3">
        <div className="d-flex align-items-center gap-2 text-dark">
          <div style={{ width: "24px", height: "24px" }}>
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
            >
              <g clipPath="url(#clip0_6_319)">
                <path
                  d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                  fill="currentColor"
                />
              </g>
              <defs>
                <clipPath id="clip0_6_319">
                  <rect width="48" height="48" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <h2 className="fw-bold mb-0">Acme Co</h2>
        </div>
        <div className="d-flex align-items-center gap-3">
          <a href="#" className="text-dark fw-medium small">
            Dashboard
          </a>
          <div
            className="rounded-circle"
            style={{
              width: "40px",
              height: "40px",
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCGdclb9XkVXzZ5GAcveMoUXUGT4nSSbT5nQ2FVPm0fcXM8WzQJt2DsUCvdRk_I4tiIRVOfCq3uzRjCsv9FrLljZ6U_26W7XrAfqsd21I2QGdCoZxo5atklYVSHNOzWhwg5-TJFfBQJTbBBZkGOq3OKZV2SGd3IQbT9kL-JWsxL3ngvLcX6JBmblBUGSPZRWmXyN2eFRPZ0U7fBBedMMonBTpmxb-aI3YxvbKGDK_dKXK6jo9yjs2plZl837SXr9sH9tehpPAtpmEzT')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        </div>
      </header>

      {/* Content */}
      <div className="container-fluid flex-grow-1 d-flex justify-content-center py-4">
        <div className="w-100" style={{ maxWidth: "960px" }}>
          <div className="d-flex flex-wrap justify-content-between p-3">
            <p className="fw-bold text-dark" style={{ fontSize: "32px" }}>
              Profile
            </p>
          </div>

          {/* Form */}
          <div className="px-3 py-2">
            <label className="form-label fw-medium text-dark">Full Name</label>
            <input
              type="text"
              className="form-control form-control-lg"
              name="fullName"
              value={form.fullName || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          <div className="px-3 py-2">
            <label className="form-label fw-medium text-dark">Email</label>
            <input
              type="text"
              className="form-control form-control-lg"
              name="email"
              value={form.email || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          <div className="px-3 py-2">
            <label className="form-label fw-medium text-dark">Address</label>
            <input
              type="text"
              className="form-control form-control-lg"
              name="address"
              value={form.address || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          <div className="px-3 py-2">
            <label className="form-label fw-medium text-dark">State</label>
            <input
              type="text"
              className="form-control form-control-lg"
              name="state"
              value={form.state || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          <div className="px-3 py-2">
            <label className="form-label fw-medium text-dark">ZIP</label>
            <input
              type="text"
              className="form-control form-control-lg"
              name="zip"
              value={form.zip || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          <div className="px-3 py-2">
            <label className="form-label fw-medium text-dark">Home Phone</label>
            <input
              type="text"
              className="form-control form-control-lg"
              name="homePhone"
              value={form.homePhone || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          <div className="px-3 py-2">
            <label className="form-label fw-medium text-dark">Cell Phone</label>
            <input
              type="text"
              className="form-control form-control-lg"
              name="cellPhone"
              value={form.cellPhone || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
          <div className="px-3 py-2">
            <label className="form-label fw-medium text-dark">Balance</label>
            <input
              type="text"
              className="form-control form-control-lg"
              name="balance"
              value={form.balance || ""}
              disabled
            />
          </div>
          <div className="px-3 py-2">
            <label className="form-label fw-medium text-dark">
              Referral Bonus
            </label>
            <input
              type="text"
              className="form-control form-control-lg text-success"
              name="referralBonus"
              value={form.referralBonus || ""}
              disabled
            />
          </div>

          <div className="d-flex justify-content-end px-3 py-3">
            {editing ? (
              <>
                <button onClick={handleSave} className="btn btn-success me-2">
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setForm(profile);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="btn btn-primary"
                style={{ color: editBtnTextColor }}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}