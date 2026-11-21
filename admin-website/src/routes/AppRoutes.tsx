import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { AdminLayout } from '../layouts/AdminLayout';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { AdminBusinessesPage } from '../pages/AdminBusinessesPage';
import { AdminMarketplacePage } from '../pages/AdminMarketplacePage';
import { AdminOrdersPage } from '../pages/AdminOrdersPage';
import { AdminTeacherPaymentsPage } from '../pages/AdminTeacherPaymentsPage';
import { AdminAuditLogsPage } from '../pages/AdminAuditLogsPage';
import { AdminSettingsPage } from '../pages/AdminSettingsPage';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { AdminEducationPage } from '../pages/AdminEducationPage';
import { AdminJobsPage } from '../pages/AdminJobsPage';
import { AdminReferralsPage } from '../pages/AdminReferralsPage';

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.adminAuth);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="businesses" element={<AdminBusinessesPage />} />
        <Route path="marketplace" element={<AdminMarketplacePage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="education" element={<AdminEducationPage />} />
        <Route path="teacher-payments" element={<AdminTeacherPaymentsPage />} />
        <Route path="jobs" element={<AdminJobsPage />} />
        <Route path="referrals" element={<AdminReferralsPage />} />
        <Route path="audit-logs" element={<AdminAuditLogsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
