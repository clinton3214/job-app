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
    <>
      {/* Header */}
      <Navbar bg="light" expand="lg" className="border-bottom px-3 py-2 shadow-sm">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <img src="/logo192.png" alt="Pecan Finance logo" height="40" className="me-2" />
            <h5 className="mb-0 fw-bold">PECAN FINANCE</h5>
          </div>
          <div className="d-flex align-items-center gap-3">
            <SunFill />
            <ShieldLockFill />
            <BellFill />
            <Button
              variant="outline-secondary"
              size="sm"
              className="rounded-pill px-3"
              onClick={handleProfileToggle}
            >
              Ez
            </Button>
          </div>
        </Container>
      </Navbar>

      {/* Dashboard Summary Cards */}
      <Container className="mt-4">
        <Row className="g-4">
          <Col xs={12} md={6} lg={3}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h6>Total Profit</h6>
                  <BsCurrencyDollar />
                </div>
                <h4 className="fw-bold">${balance || '0.00'}</h4>
                <div className="text-success small d-flex align-items-center gap-1">
                  <BsClock size={14} />
                  <span>+2.5% Last period</span>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6} lg={3}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h6>Bonus</h6>
                  <BsCreditCard />
                </div>
                <h4 className="fw-bold">${referralBonus || '0.00'}</h4>
                <div className="text-muted small">Rewards & Promotions</div>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6} lg={3}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h6>Total Deposit</h6>
                  <ArrowLeftRight />
                </div>
                <h4 className="fw-bold">$0.00</h4>
                <div className="text-muted small">
                  <BsClock size={14} /> All time
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6} lg={3}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h6>Total Withdrawal</h6>
                  <BsBoxArrowRight />
                </div>
                <h4 className="fw-bold">$0.00</h4>
                <div className="text-muted small">
                  <BsClock size={14} /> All time
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      {/* Available Jobs Section */}
      <Container className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold">Available Jobs</h5>
          <div>
            <Button variant="outline-secondary" size="sm" className="me-2">
              <i className="bi bi-chevron-left"></i>
            </Button>
            <Button variant="outline-secondary" size="sm">
              <i className="bi bi-chevron-right"></i>
            </Button>
          </div>
        </div>

        <Row className="g-3">
          {jobCards.map((job, index) => (
            <Col key={index} xs={12} sm={6} md={3}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Img
                  variant="top"
                  src={job.image}
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{job.title}</Card.Title>
                  <Card.Text>{job.company}</Card.Text>
                  <Button variant="primary" size="sm" className="mt-2">
                    Apply
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Bottom Navigation */}
      <div className="position-fixed bottom-0 start-0 end-0 bg-white border-top shadow-sm d-flex justify-content-around py-2 z-3">
        <div className="text-center">
          <i className="bi bi-house"></i>
          <div className="small">Home</div>
        </div>
        <div className="text-center">
          <i className="bi bi-download"></i>
          <div className="small">Deposit</div>
        </div>
        <div className="text-center">
          <i className="bi bi-lightning-fill"></i>
        </div>
        <div className="text-center">
          <i className="bi bi-clock-history"></i>
          <div className="small">History</div>
        </div>
        <div className="text-center">
          <i className="bi bi-person"></i>
          <div className="small">Profile</div>
        </div>
      </div>
      {/* Profile Modal */}
      <Modal show={showProfile} onHide={handleProfileToggle} centered>
        <Modal.Header closeButton>
          <Modal.Title>User Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleProfileToggle}>
            Close
          </Button>
          <Button variant="danger" onClick={logout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}