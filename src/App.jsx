// src/App.jsx
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


import LoginSignupPage     from './pages/LoginSignupPage';
import DashboardPage       from './pages/DashboardPage';
import DepositPage         from './pages/DepositPage';
import PaymentMethodsPage  from './pages/PaymentMethodsPage';
import NotAvailablePage from './pages/NotAvailablePage';
import DepositSuccessPage  from './pages/DepositSuccessPage';
import DepositCancelPage   from './pages/DepositCancelPage';
import PaymentHistoryPage  from './pages/PaymentHistoryPage';
import InterviewPage from './pages/InterviewPage';
import ProfilePage         from './pages/ProfilePage';
import ReferralsPage       from './pages/ReferralsPage';
import TotalProfitPage     from './pages/TotalProfitPage';
import JobDetailPage       from './pages/JobDetailPage';
import AboutPage from './pages/AboutPage';
import HelpPage from './pages/HelpPage';
import ContactPage from './pages/ContactPage';
import AdminInboxPage from './pages/AdminInboxPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import NotFoundPage        from './pages/NotFoundPage';
import ForgotPasswordPage  from './pages/ForgotPasswordPage';
import ResetPasswordPage   from './pages/ResetPasswordPage';
import AdminDashboard      from './pages/AdminDashboard';
import RequireAdmin        from './components/RequireAdmin';
import AdminLayout, { getAdminSocket } from './layouts/AdminLayout';

export default function App() {
  return (
      <div className="container-fluid px-0">
         <Router>
      <Routes>
        <Route path="/"                element={<LoginSignupPage />} />
        <Route path="/dashboard"       element={<DashboardPage />} />

        {/* Deposit flows */}
        <Route path="/deposit/add-funds" element={<DepositPage />} />
        <Route path="/deposit/methods"   element={<PaymentMethodsPage />} />
        <Route path="/not-available" element={<NotAvailablePage />} />
        <Route path="/deposit/success"   element={<DepositSuccessPage />} />
        <Route path="/deposit/cancel"    element={<DepositCancelPage />} />

        {/* Other user flows */}
        
        <Route path="/history"         element={<PaymentHistoryPage />} />
        <Route path="/profile"         element={<ProfilePage />} />
        <Route path="/referrals"       element={<ReferralsPage />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/verify-email"   element={<VerifyEmailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Admin and analytics */}
       
        <Route path="/total-profit"    element={<TotalProfitPage />} />

        {/* Job detail */}
        <Route path="/jobs/:jobId"     element={<JobDetailPage />} />

        {/* Password reset flows */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password"  element={<ResetPasswordPage />} />

        {/* Protected Admin Dashboard */}
                <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="inbox" element={<AdminInboxPage />} />
          {/* Add more admin pages here if needed */}
        </Route>

        {/* 404 catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>

      </div>
   
  );
}
