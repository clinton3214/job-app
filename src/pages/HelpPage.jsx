// src/pages/HelpPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';

export default function HelpPage() {
  const navigate = useNavigate();

  return (
    <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#111518' }}>
      <Card className="p-4 shadow-sm" style={{ backgroundColor: '#1B2227', color: '#fff', maxWidth: '500px', width: '100%' }}>
        <Card.Body className="d-flex flex-column">
          <h3 className="mb-3">Need Help?</h3>
          <p className="card-text flex-grow-1">
            Connect with a support agent via live chat. Our team is ready to assist you with any issues or questions you may have.
          </p>
          <Button
            variant="warning"
            className="mt-3"
            onClick={() => navigate('/interview?type=customer-service')}
          >
            Start Chat
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}