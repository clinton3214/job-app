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
  Navbar,
  Nav,
  Badge,
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
  BsChatQuote,
} from 'react-icons/bs';
import { ArrowLeftRight } from 'lucide-react';
import { SunFill, ShieldLockFill, BellFill } from 'react-bootstrap-icons';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

const jobCards = [
  { title: 'Advertising', company: 'Promote Products', image: 'https://via.placeholder.com/300x180?text=Ad' },
  { title: 'Customer Support', company: 'Help Desk', image: 'https://via.placeholder.com/300x180?text=Support' },
  { title: 'Logistics', company: 'Supply Chain', image: 'https://via.placeholder.com/300x180?text=Logistics' },
  { title: 'Desk Offices', company: 'Administration', image: 'https://via.placeholder.com/300x180?text=Desk' },
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
    const fetchUserData = async () => {
      try {
        const [meRes, profileRes] = await Promise.all([
          axios.get(`${API_BASE}/api/user/me`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get(`${API_BASE}/api/user/profile`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);
        setBalance(meRes.data.balance || 0);
        setReferralBonus(meRes.data.referralBonus || 0);
        setUser({
          name: profileRes.data.fullName || 'N/A',
          email: profileRes.data.email || 'N/A',
          role: 'User',
        });
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setBalance('Failed');
        setReferralBonus('Failed');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="bg-light min-vh-100">
      {/* Header Navbar */}
      <Navbar bg="white" expand="lg" className="shadow-sm px-3 fixed-top">
        <Navbar.Brand className="fw-bold text-primary">Pecan Finance</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link><SunFill /></Nav.Link>
            <Nav.Link><ShieldLockFill /></Nav.Link>
            <Nav.Link><BellFill /></Nav.Link>
            <Nav.Link className="fw-bold">{user.name}</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div style={{ paddingTop: '100px' }}>
        <Container>
          <Row className="g-4">
            <Col md={6} lg={3}>
              <Card className="text-center">
                <Card.Body>
                  <h6>Total Profit</h6>
                  <h4>
                    {loading ? '₦Loading…' : balance === 'Failed' ? 'Failed to load' : `₦${balance.toLocaleString()}`}
                  </h4>
                  <small className="text-success">+2.5% Last period</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="text-center">
                <Card.Body>
                  <h6>Bonus</h6>
                  <h4>
                    {loading ? '₦Loading…' : referralBonus === 'Failed' ? 'Failed to load' : `₦${referralBonus.toLocaleString()}`}
                  </h4>
                  <small className="text-muted">Rewards & Promotions</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="text-center">
                <Card.Body>
                  <h6>Total Deposit</h6>
                  <h4>₦0.00</h4>
                  <small className="text-muted">All time</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="text-center">
                <Card.Body>
                  <h6>Total Withdrawal</h6>
                  <h4>₦0.00</h4>
                  <small className="text-muted">All time</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <h5 className="mt-5">Available Jobs</h5>
          <Row className="g-4 mt-1">
            {jobCards.map((job, idx) => {
              const path = `/jobs/${job.title.toLowerCase().replace(/\s+/g, '-')}`;
              return (
                <Col md={6} lg={3} key={idx}>
                  <Card onClick={() => navigate(path)} className="h-100 cursor-pointer">
                    <Card.Img variant="top" src={job.image} height="160" style={{ objectFit: 'cover' }} />
                    <Card.Body>
                      <Card.Title>{job.title}</Card.Title>
                      <Card.Text>{job.company}</Card.Text>
                      <Button variant="outline-primary" size="sm">Apply</Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      </div>

      {/* Bottom Navigation */}
      <Navbar bg="white" fixed="bottom" className="border-top d-flex justify-content-around py-2">
        <Nav.Link className="text-center" onClick={() => navigate('/')}>
          <BsPerson size={20} />
          <div className="small">Home</div>
        </Nav.Link>
        <Nav.Link className="text-center" onClick={() => navigate('/deposit/add-funds')}>
          <BsPlus size={20} />
          <div className="small">Deposit</div>
        </Nav.Link>
        <Nav.Link className="text-center" onClick={() => navigate('/history')}>
          <BsClock size={20} />
          <div className="small">History</div>
        </Nav.Link>
        <Nav.Link className="text-center" onClick={() => navigate('/profile')}>
          <BsPerson size={20} />
          <div className="small">Profile</div>
        </Nav.Link>
      </Navbar>

      {/* Offcanvas Sidebar */}
      <Offcanvas show={showMenu} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{user.name}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="list-group">
            <button className="list-group-item list-group-item-action" onClick={() => navigate('/total-profit')}>
              <BsCurrencyDollar size={20} /> Total Profit
            </button>
            <button className="list-group-item list-group-item-action" onClick={() => navigate('/history')}>
              <BsClock size={20} /> Payment History
            </button>
            <button className="list-group-item list-group-item-action" onClick={() => navigate('/withdraw')}>
              <ArrowLeftRight size={20} /> Withdrawal
            </button>
            <button className="list-group-item list-group-item-action" onClick={() => navigate('/referrals')}>
              <BsPeople size={20} /> View Referrals
            </button>
            <button className="list-group-item list-group-item-action" onClick={() => navigate('/deposit/add-funds')}>
              <BsPlus size={20} /> Add Funds
            </button>
            <button className="list-group-item list-group-item-action" onClick={() => navigate('/deposit/methods')}>
              <BsCreditCard size={20} /> Payment Methods
            </button>
            <button className="list-group-item list-group-item-action" onClick={() => navigate('/interview')}>
              <BsChatQuote size={20} /> Interview
            </button>
            <button className="list-group-item list-group-item-action text-danger" onClick={logout}>
              <BsBoxArrowRight size={20} /> Logout
            </button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}