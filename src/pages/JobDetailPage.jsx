import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * JobDetailPage displays a given job’s name and a mock description, 
 * plus an “Apply Now” button.
 * 
 * URL: /jobs/:jobId
 */
export default function JobDetailPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  // Convert the URL-friendly jobId back to a display name, e.g. 'deck-officer' → 'Deck Officer'
  const displayName = jobId
    .split('-')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');

  // Mock description text
  const mockDescriptions = {
    'Deck Officer':
      'As a Deck Officer, you will coordinate deck operations, maintain safety standards, and supervise crew on maritime vessels.',
    Advertisers:
      'As an Advertiser, you will create and manage ad campaigns across various platforms to drive engagement and sales.',
    'Online Tutoring':
      'As an Online Tutor, you will teach students over video lessons in your subject area, preparing lesson plans and grading assignments.',
    'Social Media Management':
      'As a Social Media Manager, you will develop social strategies, create content, and engage with audiences across platforms.',
    'Transcription Services':
      'As a Transcriptionist, you will listen to audio recordings and convert them into accurate written transcripts.',
    'Online Survey Taker':
      'As an Online Survey Taker, you will complete surveys and provide feedback to help market researchers and organizations.',
    'Software Development':
      'As a Software Developer, you will design, code, and maintain applications and collaborate with cross-functional teams.',
    'E-commerce Selling':
      'As an E-commerce Seller, you will list products, manage inventory, and fulfill orders on online marketplaces.',
    'Remote Customer Service Representative':
      'As a Customer Service Rep, you will handle customer inquiries via chat, email, or phone and ensure satisfaction.',
  };

  const description =
    mockDescriptions[displayName] ||
    'This is a great opportunity. More details will be added soon.';

  return (
    <div className="container my-5">
      <h2 className="mb-3">{displayName}</h2>
      <p>{description}</p>
      <button
        className="btn btn-primary"
        onClick={() => {
          // Mock “apply” action: scroll to a simple application form or show an alert
          alert(`Applying for ${displayName} (mock).`);
          // Optionally, navigate back to dashboard:
          // navigate('/dashboard');
        }}
      >
        Apply Now
      </button>
    </div>
  );
}
