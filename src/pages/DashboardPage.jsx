// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Offcanvas,
  Button,
  Modal,
  Card,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  BsCurrencyDollar,
  BsClock,
  BsPeople,
  BsPlus,
  BsCreditCard,
  BsPerson,
  BsBoxArrowRight,
  BsChatQuote,
  BsSun,
  BsMoon,
} from 'react-icons/bs';
import logoImg from '../assets/logo.png';
import '../index.css';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

const jobCards = [
  {
    title: 'Deck Officer',
    company: 'Maritime Solutions Inc.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAkKsR32m71bcrJEXBrKLWULgBJ1XFSq38MoGMCv-WeK9j5lKBmpDWwHIM2jtST0c6scl_PDlc-Flnt0sak5oYWnwY4cJ6M9RXg-KgpmB5D7cGGuDOIJdqnP5nkdWTehG96-ngz9XBNhjWrg-jJOW-j-y1DQQQVUKRKA3_mFZ3MqWmcG1HP09Z554E32KMYxwAyHVBbZKCNJGdfjkxzVLJc-2mPjfiEUkNLwn0RzZ1sJhNgNTLRWP6Om_2Ly_lEUrhlC-ASYwmb8pQ',
  },
  {
    title: "Advertisers",
    company: "Digital Marketing Co.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4rlgSTu2bPSXWEKyNPdHZv_p3FvrHknekdXnPfX1xW_3eyjgBnc5hWvtaBdQLubeeCl_suJEtgC0Xvv9zvOy2C_iahrRiSNRhT79paHJe852d4uaFZPPjjO1P0k0T7XB9KaDNFhogpLtxmnBG6vpS_4nKmYG0AAq79RjkIH6HLlMQsKycvIHEjoD4_AkKZwx_fA-DuoUxe9wpAFm_Tb4G8Myo5q2Xaz4okjiKycJmwCjuZhO-CzmZyEuh_ztgO-Q2vkRVoYCylmc",
  },
  {
    title: "Online Tutoring",
    company: "EduConnect",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtEaVxCGnR7PPQQM4D2rfk_ewhdxyb1tR06B4vSHNnmN8PM6YtifyTw0VWLT9wKAA-b6I-qhcxg5bQBwcpCiPgXIoCOo0CGGmo4MtsYhC5MoGRjo2iZkSbAPAgpvIo9wjDmdSgzFiaIoM8MsinbB1YTRMT38mdxa6olN1w02SuDTLJc7ebuKfP9SKjFSjEdALPg8qIYtJGXL_WpQMVPE4Yeow9rN4mj094596AI4KoTolACzQf1VnoyFUT6MiW-R9ad_D6eNRpiuA",
  },
  {
    title: "Social Media Management",
    company: "Social Media Agency",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-mwPVTPHnO_YbKtvBVvbKgLxkQDVDLw46_nMQDg3ud5HWwJIgi77OQ4CwGNsR0dDsxpsKofqcNUgkMaWzBLHQkgOW3ECgcSMSSvMUtckGL8nsvUdCMDKsBR__O3hr4lLrqXayX1UmGhNLfYRRaOlDAdXiNiJZ0ioquPLZBwkBjfz6IT1viNKrrXly-sEhcZDYnEZo-d9a8gRH0bP3UjNHFFyjyHITU51onFMYizqqYnqn_PR-EAENEgKP3NmNjqWfLX7P4fD5kDA",
  },
  {
    title: "Transcription Services",
    company: "TranscribeIt",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcQA0X258xN-lnXtEixX5VOT51lsFFPkz1i4zAJtxhO1rZnPrn74LLG8WYcqdl0S82xF3EFXgcy2e2DLK__BfuE8Q9hhtsTEHXFOu7G56rZDs13_9tiyxKLAig7Jx1SoYp6NMtIRulijZcusjDraxpl1bdTEg6RgZAf4lyF9bd9cGskqK8DK5-_ELF9S9Y_NcNeqLavoB_Jf0s4-gbQ4752gNJRqwCaGt_U7mJaEskpreBUA1YS_YAh0vzqhC33ylT-ypsWy2eipc",
  },
  {
    title: "Online Survey Taker",
    company: "SurveyCentral",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfYcn2BlhgGRwCZZEUWkYWcUe9BVG_McwJFgx3-5rJ7FQxXeZV2IR_XMIM8Heeu1RZhhBnZ4V97OYcUOlV9cxMOov7T_QEzs92C-gLN63c8bw2RlqQMEpOLpYMt8Z1t5x0SByn2NhWxq58VxOk_DW29RM6qNL3DluUA7GKdeaHUUseSgv8ZVjIrCwmIjikyzq7ZzLgUJmG36Z4A2TD3tdH_Cnu_HvDer-3WKHpCqFMBzbKOm3tIanUgMHYfGwXuYoudXz0u78GZEs",
  },
  {
    title: "Software Development",
    company: "Tech Innovators",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKcQ3VNCytGBkExQB3wBa9PeheDsutL2bIcfEt7ma7p9sQPrr9aEYMcSStdjdKqxvEENYsKePl2s4l0hZrfx4fgtFwQd6sjgYKFJqVSedCrFEo6c8JhtlSbNrzUxIhkbOaa4D63xWQ2UtVqO3JLrdDPa-R4rpB0BI3-9VoS7oYDeu9Kh9mGnpR-hnCW0kFzl1VuCI8jl1KD2nZHE9v9KuGuZt7E5GUFMk69zczj217CWLLIUwoAssqMRZph0DTTh2Tacgd1dwV0ko",
  },
  {
    title: "E-commerce Selling",
    company: "Online Retail Group",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaEhVJm9HYgbLyWbSFF-RDJknjPn6lRkw_-h4GQqrNEAuizYTzUX0Q5tKh1mTbDrDG4naFF-VGq34MSedcMFNSQn2b-R-74lfdta5IRL9kclVKHsfBsPvYbTgSXi9osR8H3bYilUNhr0C20ulLyKRXzJGRd5e0RpY27NK20AX4D64nTEQ5NpJdecpR1nhllPPezmq0xhV3IlgpMvSCXgZZQIPvss6y62y1QV1FrAI3Hbr_dpVcqQ4hBi45ObXVHlvNx7clnxBlykA",
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
  const [user, setUser] = useState({ name: 'user', role: 'guest' });
  const [darkMode, setDarkMode] = useState(false);
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
          name: profileRes.data.fullName || 'user',
          email: profileRes.data.email || 'user@email.com',
          role: 'User',
        });
      } catch (err) {
        setBalance('Failed');
        setReferralBonus('Failed');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className={`min-vh-100 ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header
        className={`d-flex justify-content-between align-items-center border-bottom px-4 py-3 shadow-sm ${darkMode ? 'bg-secondary' : 'bg-white'}`}
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1030, height: '80px' }}
      >
        <div className="d-flex align-items-center gap-3">
          <Button variant={darkMode ? 'light' : 'outline-secondary'} onClick={handleShow}>☰</Button>
          <img src={logoImg} alt="Logo" style={{ height: '50px', objectFit: 'contain' }} />
        </div>
        <div className="d-flex align-items-center gap-2">
          <Button variant={darkMode ? 'light' : 'secondary'} onClick={handleProfileToggle}>
            <BsPerson size={18} /> Profile
          </Button>
          <Button variant={darkMode ? 'outline-light' : 'outline-dark'} onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <BsSun size={18} /> : <BsMoon size={18} />}
          </Button>
        </div>
      </header>

      {/* Spacer */}
      <div style={{ height: '80px' }}></div>

      {/* Main Content */}
      <main className="container py-4">
        <h1 className="fw-bold display-6 mb-4">Dashboard</h1>

        <div className="row mb-5">
          <div className="col-md-6 mb-3">
            <div className={`rounded shadow-sm p-3 ${darkMode ? 'bg-secondary text-light' : 'bg-white text-dark'}`}>
              <h6>Normal Balance</h6>
              <h5>{loading ? 'Loading…' : balance === 'Failed' ? 'Failed to load' : `$${balance.toLocaleString()}`}</h5>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className={`rounded shadow-sm p-3 ${darkMode ? 'bg-secondary text-light' : 'bg-white text-dark'}`}>
              <h6>Referral Bonus</h6>
              <h5>{loading ? 'Loading…' : referralBonus === 'Failed' ? 'Failed to load' : `$${referralBonus.toLocaleString()}`}</h5>
            </div>
          </div>
        </div>

        <h2 className="fw-bold h4 mb-3">Remote Work Opportunities</h2>

        {jobCards.map((job, idx) => {
          const path = `/jobs/${job.title.toLowerCase().replace(/\s+/g, '-')}`;
          return (
            <motion.div
              key={idx}
              className={`card mb-4 border-0 shadow-sm ${darkMode ? 'bg-secondary text-light' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(path)}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
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
            </motion.div>
          );
        })}
      </main>

      {/* Profile Modal and Offcanvas here... (use same code as before and optionally style with darkMode condition) */}
    </div>
  );
}