// src/pages/ContactPage.jsx
import React from 'react';
import { Container, Card } from 'react-bootstrap';

export default function ContactPage() {
  return (
    <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#111518' }}>
      <Card className="p-4 shadow-sm" style={{ backgroundColor: '#1B2227', color: '#fff', maxWidth: '600px', width: '100%' }}>
        <Card.Body>
          <h3 className="mb-4">Contact Us</h3>
          <p className="mb-2">
            We'd love to hear from you. If you have any questions, feedback, or need assistance, feel free to reach out:
          </p>
          <p className="fw-bold mb-0">📧 Email:</p>
          <p><a href="mailto:startnetnexus@gmail.com" className="text-warning">startnetnexus@gmail.com</a></p>
        </Card.Body>
      </Card>
    </Container>
  );
}