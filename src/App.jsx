// src/App.jsx
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import LoginSignupPage     from './pages/LoginSignupPage';
import DashboardPage       from './pages/DashboardPage';
import DepositPage         from './pages/DepositPage';
import PaymentMethodsPage  from './pages/PaymentMethodsPage';
import DepositSuccessPage  from './pages/DepositSuccessPage';
import DepositCancelPage   from './pages/DepositCancelPage';
import WithdrawPage        from './pages/WithdrawPage';
import PaymentHistoryPage  from './pages/PaymentHistoryPage';
import ProfilePage         from './pages/ProfilePage';
import ReferralsPage       from './pages/ReferralsPage';
import AdminPage           from './pages/AdminPage';
import TotalProfitPage     from './pages/TotalProfitPage';
import JobDetailPage       from './pages/JobDetailPage';
import NotFoundPage        from './pages/NotFoundPage';
import ForgotPasswordPage  from './pages/ForgotPasswordPage';
import ResetPasswordPage   from './pages/ResetPasswordPage';
import AdminDashboard      from './pages/AdminDashboard';
import RequireAdmin        from './components/RequireAdmin';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"                element={<LoginSignupPage />} />
        <Route path="/dashboard"       element={<DashboardPage />} />

        {/* Deposit flows */}
        <Route path="/deposit/add-funds" element={<DepositPage />} />
        <Route path="/deposit/methods"   element={<PaymentMethodsPage />} />
        <Route path="/deposit/success"   element={<DepositSuccessPage />} />
        <Route path="/deposit/cancel"    element={<DepositCancelPage />} />

        {/* Other user flows */}
        <Route path="/withdraw"        element={<WithdrawPage />} />
        <Route path="/history"         element={<PaymentHistoryPage />} />
        <Route path="/profile"         element={<ProfilePage />} />
        <Route path="/referrals"       element={<ReferralsPage />} />

        {/* Admin and analytics */}
        <Route path="/admin"           element={<AdminPage />} />
        <Route path="/total-profit"    element={<TotalProfitPage />} />

        {/* Job detail */}
        <Route path="/jobs/:jobId"     element={<JobDetailPage />} />

        {/* Password reset flows */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password"  element={<ResetPasswordPage />} />

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />

        {/* 404 catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
