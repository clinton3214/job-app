// src/pages/DashboardPage.jsx
import React, { useState } from 'react';
import { Offcanvas, Button, Card, Nav, Dropdown, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';  // Make sure your CSS for .balance-card and .clickable-card is in this file

const jobs = [
  'Deck Officer',
  'Advertisers',
  'Online Tutoring',
  'Social Media Management',
  'Transcription Services',
  'Online Survey Taker',
  'Software Development',
  'E-commerce Selling',
  'Remote Customer Service Representative',
];

export default function DashboardPage() {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShowMenu(false);
  const handleShow  = () => setShowMenu(true);
  const logout      = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="navbar navbar-dark bg-dark px-3">
        <Button variant="outline-light" onClick={handleShow}>☰</Button>
        <span className="navbar-brand mx-auto">Job Application Dashboard</span>
        <Dropdown>
          <Dropdown.Toggle variant="outline-light" id="profile-dropdown">Profile</Dropdown.Toggle>
          <Dropdown.Menu align="end">
            <Dropdown.Item href="/profile">View Profile</Dropdown.Item>
            <Dropdown.Item href="/referrals">View Referrals</Dropdown.Item>
            <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </nav>

      {/* Offcanvas Menu */}
      <Offcanvas show={showMenu} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Item className="mb-2">
              <strong>Pages</strong>
              <Nav.Link href="/total-profit">• Total Profit</Nav.Link>
            </Nav.Item>
            <Nav.Item className="mb-2">
              <strong>Payment History</strong>
              <Nav.Link href="/history">• View All History</Nav.Link>
            </Nav.Item>
            <Nav.Item className="mb-2">
              <strong>Withdraw</strong>
              <Nav.Link href="/withdraw">• Withdraw Funds</Nav.Link>
            </Nav.Item>
            <Nav.Item className="mb-2">
              <strong>Referrals</strong>
              <Nav.Link href="/referrals">• View Referrals</Nav.Link>
            </Nav.Item>
            <Nav.Item className="mb-2">
              <strong>Deposit</strong>
              <Nav.Link href="/deposit/add-funds">• Add Funds</Nav.Link>
              <Nav.Link href="/deposit/methods">• Payment Methods</Nav.Link>
            </Nav.Item>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      <div className="container mt-4">
        {/* Dark multicolor Balance & Referral Card */}
        <Card className="mb-4 shadow-sm balance-card">
          <Card.Body className="d-flex justify-content-between align-items-center">
            <div>
              <Card.Title>Your Balance</Card.Title>
              <Card.Text className="h2">₦ 25,000</Card.Text>
            </div>
            <div>
              <Card.Title>Referral Bonus</Card.Title>
              <Card.Text className="h4 referral-bonus">₦ 3,500</Card.Text>
            </div>
          </Card.Body>
        </Card>

        {/* Jobs Grid (cards are fully clickable) */}
        <Row xs={1} sm={2} lg={3} className="g-4">
          {jobs.map((job, idx) => {
            const path = `/jobs/${job.toLowerCase().replace(/\s+/g, '-')}`;
            return (
              <Col key={idx}>
                <Card
                  className="h-100 text-center shadow-sm clickable-card"
                  onClick={() => navigate(path)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body className="d-flex flex-column justify-content-center">
                    <Card.Title>{job}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </>
  );
}
