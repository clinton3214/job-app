import React from 'react'; import { useParams, useNavigate } from 'react-router-dom'; import 'bootstrap/dist/css/bootstrap.min.css';

export default function JobDetailPage() { const { jobId } = useParams(); const navigate = useNavigate();

const displayName = jobId .split('-') .map(word => word[0].toUpperCase() + word.slice(1)) .join(' ');

const jobDescriptions = { 'Deck Officer': `Are you fascinated by ships, sea travel, or navigation? You can now step into the world of maritime operations from your own home. As a Remote Deck Officer Trainee, you’ll be trained to oversee virtual cargo handling, manage simulated ship routes, and monitor weather conditions using real maritime data. Work with international teams to simulate real-life challenges that deck officers face. You’ll learn about marine safety protocols, international shipping codes, and team management—all from a laptop.

Start building sea-worthy skills today.`, 

'Advertisers':` We’re looking for witty, bold, and creative minds to develop attention-grabbing ads for local and international brands. As a freelance advertiser, you’ll receive project briefs and be tasked with creating ad captions, graphics concepts, and short video scripts. You'll work closely with our design team or use simple design tools like Canva to bring your vision to life. Let your words and ideas sell products.`, 

'Online Tutoring': `Are you good at Math, English, Physics, or any subject you loved in school? Turn that into income. As an online tutor, you’ll teach students live on Zoom or Google Meet. You’ll be given prepared material—or you can create your own—and help students boost their grades or pass exams. Change lives while working from your bedroom`, 


'Social Media Management': `Brands are constantly looking for someone to manage their Instagram, Facebook, TikTok, and Twitter pages. As a Social Media Manager, you’ll schedule posts, reply to messages, track post performance, and sometimes run promotions. Turn your screen time into income.`, 

'Transcription Services':` Ever listened to something once and repeated it word-for-word? Put that skill to use. As a transcriber, you’ll convert voice recordings—like interviews, lectures, or speeches—into clean, readable text. Type your way to steady income.`, 

'Online Survey Taker': `Love expressing your thoughts? Earn money by simply answering questions. Companies are paying people like you to give feedback on products, ads, and services. Surveys take only a few minutes and can be done while watching TV or during breaks. Turn your opinions into cash.`, 

'Software Development': `If you love solving problems with code, this one’s for you. Work on real projects using React, Node.js, Python, or PHP. You’ll be fixing bugs, building APIs, or designing dashboards for startups and businesses that need affordable developers. Build your coding career from your bedroom. 💰 Pay: ₦100,000 – ₦300,000 monthly 👉 Look at payment method → /payment-method, 'E-Commerce Selling': Want to sell phones, fashion, books, or anything else online? We’ll show you how to start selling using WhatsApp, Instagram, and e-commerce platforms. You don’t need to own stock—we'll teach you how to dropship, set prices, and talk to customers. Start your online business today.`, 

'Remote Customer Service Representative': `Be the friendly voice (or message) that solves customer problems. As a support agent, you’ll help people via chat, calls, or email—answering their questions, solving small issues, or guiding them through processes. Be the hero behind the scenes`, 
};

const description = jobDescriptions[displayName] || 'This is a great opportunity. More details will be added soon.';

return ( <div className="container py-5"> <div className="row mb-4"> <div className="col-12"> <nav aria-label="breadcrumb"> <ol className="breadcrumb"> <li className="breadcrumb-item"><a href="/">Jobs</a></li> <li className="breadcrumb-item active" aria-current="page">{displayName}</li> </ol> </nav> <h2 className="fw-bold mb-2">{displayName}</h2> <p className="text-muted">Remote</p> </div> </div>

<h4 className="fw-bold mt-4">Job Details</h4>
  <ul className="list-unstyled border-top pt-3">
    <li className="mb-2"><strong>Job type:</strong> Full-time</li>
    <li className="mb-2"><strong>Role:</strong> {displayName}</li>
    <li className="mb-2"><strong>Seniority level:</strong> Mid-level</li>
    <li className="mb-2"><strong>Industry:</strong> Technology</li>
    <li className="mb-2"><strong>Compensation:</strong> Included below</li>
  </ul>

  <h4 className="fw-bold mt-4">About the Job</h4>
  <p className="mb-3" style={{ whiteSpace: 'pre-line' }}>{description}</p>

  <div className="text-end mt-4">
    <button
      className="btn btn-dark px-4 py-2"
      onClick={() => navigate('/deposit/methods', { state: { job: displayName } })}
    >
      Apply Now
    </button>
  </div>
</div>

); }

