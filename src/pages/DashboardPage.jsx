import React, { useState, useEffect } from 'react';
import { Offcanvas, Button, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import { BsCurrencyDollar, BsClock, BsPeople, BsPlus, BsCreditCard, BsPerson, BsBoxArrowRight } from 'react-icons/bs';
import { ArrowLeftRight } from 'lucide-react';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function DashboardPage() {
  const [showMenu, setShowMenu] = useState(false);
  const [balance, setBalance] = useState(null);
  const [referralBonus, setReferralBonus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: 'Sophia Carter', role: 'Account Manager' });

  const navigate = useNavigate();
  const handleClose = () => setShowMenu(false);
  const handleShow = () => setShowMenu(true);
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

  const [showProfile, setShowProfile] = useState(false);

  const jobCards = [
    // Job cards removed for brevity in this snippet. You can include them if needed.
  ];

  return (
    <div className="min-vh-100 bg-light text-dark" style={{ fontFamily: 'Inter, Noto Sans, sans-serif' }}>
      <header className="d-flex justify-content-between align-items-center border-bottom px-4 py-3">
        <div className="d-flex align-items-center gap-3">
          <Button variant="outline-secondary" onClick={handleShow}>
            ☰
          </Button>
          <h2 className="fs-5 fw-bold m-0">RemoteWork Hub</h2>
        </div>
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="profile-dropdown">
            Profile
          </Dropdown.Toggle>
          <Dropdown.Menu align="end">
            <Dropdown.Item as={Link} to="#" onClick={() => setShowProfile(true)}>View Profile</Dropdown.Item>
            <Dropdown.Item as={Link} to="/referrals">View Referrals</Dropdown.Item>
            <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </header>

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

      {showProfile ? (
        <div className="container py-5 text-center">
          <div className="d-flex flex-column align-items-center">
            <div
              className="rounded-circle mb-3"
              style={{
                width: 128,
                height: 128,
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCOlL7TXThbt25VhAkaP7tIXJXXeCuLpZsiwa7Av46HTbXRJjjCLqVXHOwqccgCuGgefTMsfNhofkw8JORfk9z35Len82uJGSSmaKmEkUghAe5g878aFHmZ8nIqOtmBtKAXm6TJdHUSVSBGNtFBZb5WcWC50SVZzo8f55S4UM1CngNGUajtP84bHlSP5SzZx81HOdp1ZC1iU7ZgG6iWI0VYo_xsG_k2KOd8eS11Y729YwIjtBOzvbaa_TwuIArB0ItDld7wL0Atuw8")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></div>
            <h4 className="fw-bold">{user.name}</h4>
            <p className="text-muted">sophia.carter@email.com</p>
          </div>
          <div className="mt-4">
            <div className="d-flex align-items-center gap-3 justify-content-center mb-3">
              <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                <BsPerson size={20} />
              </div>
              <span>View Profile</span>
            </div>
            <div className="d-flex align-items-center gap-3 justify-content-center mb-3">
              <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                <BsPeople size={20} />
              </div>
              <span>View Referrals</span>
            </div>
            <div className="d-flex align-items-center gap-3 justify-content-center">
              <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                <BsBoxArrowRight size={20} />
              </div>
              <span style={{ cursor: 'pointer' }} onClick={logout}>Logout</span>
            </div>
          </div>
        </div>
      ) : (
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
          {/* jobCards rendering can go here if needed */}
        </main>
      )}
    </div>
  );
}
