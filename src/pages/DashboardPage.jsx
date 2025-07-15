// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Offcanvas,
  Button,
  Modal,
  Container,
  Row,
  Col,
  Card,
} from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import {
  BsCurrencyDollar,
  BsClock,
  BsPeople,
  BsPlus,
  BsCreditCard,
  BsPerson,
  BsBoxArrowRight,
} from 'react-icons/bs';
import { ArrowLeftRight } from 'lucide-react';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

const jobCards = [
  {
    title: 'Deck Officer',
    company: 'Maritime Solutions Inc.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAkKsR32m71bcrJEXBrKLWULgBJ1XFSq38MoGMCv-WeK9j5lKBmpDWwHIM2jtST0c6scl_PDlc-Flnt0sak5oYWnwY4cJ6M9RXg-KgpmB5D7cGGuDOIJdqnP5nkdWTehG96-ngz9XBNhjWrg-jJOW-j-y1DQQQVUKRKA3_mFZ3MqWmcG1HP09Z554E32KMYxwAyHVBbZKCNJGdfjkxzVLJc-2mPjfiEUkNLwn0RzZ1sJhNgNTLRWP6Om_2Ly_lEUrhlC-ASYwmb8pQ',
  },
  {
    title: 'Remote Customer Service Representative',
    company: 'Customer Care Solutions',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA3s_vD_p6ViXHA5qVDorM2IASi80WqW53T4TMEpsG32Rs096kqBtNdxzrOwgS1FQntxODjQPHRPsvPsxJpQ_AiPp2JDHEAusQg6qkpa_U65iLwL6JZ3XkVtjNzSVlVwXFBehAjsXt0zSaRP0JtDDvZIJ56eCl5nLWPXl_KBPMy02Vjg71E7uAFrci18SU2JJz0tDkLACZRmD91VOYD9CYQliaa3jC7l4gOxZaGv3q30IvsP0UIDnjEYPf5UdkJ3YvsGHtKWsmbZLE',
  },
];

export default function DashboardPage() {
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [balance, setBalance] = useState(null);
  const [referralBonus, setReferralBonus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: 'Sophia Carter', role: 'Account Manager' });

  const navigate = useNavigate();

  const handleClose = () => setShowMenu(false);
  const handleShow = () => setShowMenu(true);
  const handleProfileToggle = () => setShowProfile(!showProfile);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setBalance(res.data.balance || 0);
        setReferralBonus(res.data.referralBonus || 0);
        setUser({
          name: res.data.name || 'Sophia Carter',
          role: res.data.role || 'Account Manager',
        });
      } catch (err) {
        console.error('Failed to fetch user data', err);
        setBalance('Failed');
        setReferralBonus('Failed');
      } finally {
        setLoading(false);
      }
    };
    fetchBalance();
  }, []);

  return (
    <div className="min-vh-100 bg-light text-dark" style={{ fontFamily: 'Inter, Noto Sans, sans-serif' }}>
      {/* Top Header */}
      <header className="d-flex justify-content-between align-items-center border-bottom px-4 py-3">
        <div className="d-flex align-items-center gap-3">
          <Button variant="outline-secondary" onClick={handleShow}>
            ☰
          </Button>
          <h2 className="fs-5 fw-bold m-0">RemoteWork Hub</h2>
        </div>

        <Button variant="secondary" onClick={handleProfileToggle} className="d-flex align-items-center gap-2">
          <BsPerson size={18} />
          Profile
        </Button>
      </header>

      {/* Profile Modal */}
      <Modal show={showProfile} onHide={handleProfileToggle} centered>
        <Modal.Body className="p-0">
          <Card className="border-0 p-4 text-center">
            <div className="d-flex flex-column align-items-center gap-3">
              <div
                className="rounded-circle shadow"
                style={{
                  width: '128px',
                  height: '128px',
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCOlL7TXThbt25VhAkaP7tIXJXXeCuLpZsiwa7Av46HTbXRJjjCLqVXHOwqccgCuGgefTMsfNhofkw8JORfk9z35Len82uJGSSmaKmEkUghAe5g878aFHmZ8nIqOtmBtKAXm6TJdHUSVSBGNtFBZb5WcWC50SVZzo8f55S4UM1CngNGUajtP84bHlSP5SzZx81HOdp1ZC1iU7ZgG6iWI0VYo_xsG_k2KOd8eS11Y729YwIjtBOzvbaa_TwuIArB0ItDld7wL0Atuw8")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              ></div>
              <div>
                <h5 className="fw-bold m-0">{user.name}</h5>
                <p className="text-muted mb-1 small">{user.email || 'user@email.com'}</p>
                <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="mt-4 d-grid gap-3">
              <Button
                variant="light"
                onClick={() => {
                  navigate('/profile');
                  handleProfileToggle();
                }}
                className="d-flex align-items-center gap-3 text-start border rounded p-2"
              >
                <div className="bg-secondary bg-opacity-25 rounded d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                  <BsPerson size={20} />
                </div>
                <span className="flex-grow-1">View Profile</span>
              </Button>
              <Button
                variant="light"
                onClick={() => {
                  navigate('/referrals');
                  handleProfileToggle();
                }}
                className="d-flex align-items-center gap-3 text-start border rounded p-2"
              >
                <div className="bg-secondary bg-opacity-25 rounded d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                  <BsPeople size={20} />
                </div>
                <span className="flex-grow-1">View Referrals</span>
              </Button>
              <Button
                variant="light"
                onClick={logout}
                className="d-flex align-items-center gap-3 text-start border rounded p-2"
              >
                <div className="bg-secondary bg-opacity-25 rounded d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                  <BsBoxArrowRight size={20} />
                </div>
                <span className="flex-grow-1">Logout</span>
              </Button>
            </div>
          </Card>
        </Modal.Body>
      </Modal>

      {/* Sidebar Offcanvas */}
      <Offcanvas show={showMenu} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="d-flex gap-3 align-items-center mb-4">
            <div
              className="rounded-circle bg-secondary"
              style={{
                width: 40,
                height: 40,
                backgroundImage: 'url("")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></div>
            <div>
              <h6 className="mb-0">{user.name}</h6>
              <small className="text-muted">{user.role}</small>
            </div>
          </div>
          <div className="list-group">
            <button className="list-group-item list-group-item-action d-flex align-items-center gap-3 mb-2" onClick={() => navigate('/total-profit')}>
              <BsCurrencyDollar size={24} /> <span>Total Profit</span>
            </button>
            <button className="list-group-item list-group-item-action d-flex align-items-center gap-3 mb-2" onClick={() => navigate('/history')}>
              <BsClock size={24} /> <span>Payment History</span>
            </button>
            <button className="list-group-item list-group-item-action d-flex align-items-center gap-3 mb-2" onClick={() => navigate('/withdraw')}>
              <ArrowLeftRight size={24} /> <span>Withdrawal</span>
            </button>
            <button className="list-group-item list-group-item-action d-flex align-items-center gap-3 mb-2" onClick={() => navigate('/referrals')}>
              <BsPeople size={24} /> <span>View Referrals</span>
            </button>
            <button className="list-group-item list-group-item-action d-flex align-items-center gap-3 mb-2" onClick={() => navigate('/deposit/add-funds')}>
              <BsPlus size={24} /> <span>Add Funds</span>
            </button>
            <button className="list-group-item list-group-item-action d-flex align-items-center gap-3 mb-2" onClick={() => navigate('/deposit/methods')}>
              <BsCreditCard size={24} /> <span>Payment Methods</span>
            </button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content */}
      <main className="container py-4">
        <h1 className="fw-bold display-6 mb-4">Dashboard</h1>
        <div className="row mb-5">
          <div className="col-md-6 mb-3">
            <div className="bg-white rounded shadow-sm p-3">
              <h6 className="mb-1">Normal Balance</h6>
              <h5>{loading ? '₦Loading…' : balance === 'Failed' ? 'Failed to load' : `₦${balance.toLocaleString()}`}</h5>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="bg-white rounded shadow-sm p-3">
              <h6 className="mb-1">Referral Bonus</h6>
              <h5>{loading ? '₦Loading…' : referralBonus === 'Failed' ? 'Failed to load' : `₦${referralBonus.toLocaleString()}`}</h5>
            </div>
          </div>
        </div>
        <h2 className="fw-bold h4 mb-3">Remote Work Opportunities</h2>
        {jobCards.map((job, idx) => {
          const path = `/jobs/${job.title.toLowerCase().replace(/\s+/g, '-')}`;
          return (
            <div key={idx} className="card mb-4 border-0 shadow-sm" style={{ cursor: 'pointer' }} onClick={() => navigate(path)}>
              <div className="row g-0">
                <div className="col-md-8 p-4">
                  <p className="text-muted small">Remote</p>
                  <h5 className="fw-bold m-0">{job.title}</h5>
                  <p className="text-muted mb-0">{job.company} - Remote</p>
                </div>
                <div className="col-md-4">
                  <div
                    className="h-100 rounded-end"
                    style={{
                      backgroundImage: `url(${job.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}