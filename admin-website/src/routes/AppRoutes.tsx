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
import { AdminReportsPage } from '../pages/AdminReportsPage';

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

        {/* User Management Routes matching user specification:
            - All Users
            - Students
            - Teachers
            - Businessmen
            - Entrepreneurs
            - Normal Users
            - Pending Verifications
            - Blocked / Suspended Users
        */}
        <Route path="users" element={<AdminUsersPage initialCategory="all" />} />
        <Route path="users/students" element={<AdminUsersPage initialCategory="students" />} />
        <Route path="users/teachers" element={<AdminUsersPage initialCategory="teachers" />} />
        <Route path="users/businessmen" element={<AdminUsersPage initialCategory="businessmen" />} />
        <Route path="users/entrepreneurs" element={<AdminUsersPage initialCategory="entrepreneurs" />} />
        <Route path="users/normal-users" element={<AdminUsersPage initialCategory="normal-users" />} />
        <Route path="users/pending" element={<AdminUsersPage initialCategory="pending" />} />
        <Route path="users/blocked-suspended" element={<AdminUsersPage initialCategory="blocked-suspended" />} />

        <Route path="businesses" element={<AdminBusinessesPage />} />
        <Route path="marketplace" element={<AdminMarketplacePage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        
        {/* Education Routes */}
        <Route path="education" element={<Navigate to="/education/courses" replace />} />
        <Route path="education/courses" element={<AdminEducationPage initialTab="courses" />} />
        <Route path="education/live-classes" element={<AdminEducationPage initialTab="live-classes" />} />
        <Route path="education/study-materials" element={<AdminEducationPage initialTab="study-materials" />} />
        <Route path="education/categories" element={<AdminEducationPage initialTab="categories" />} />
        <Route path="education/content-reports" element={<AdminEducationPage initialTab="content-reports" />} />

        {/* Reports Routes */}
        <Route path="reports" element={<Navigate to="/reports/overview" replace />} />
        <Route path="reports/overview" element={<AdminReportsPage initialTab="overview" />} />
        <Route path="reports/users" element={<AdminReportsPage initialTab="users" />} />
        <Route path="reports/businesses" element={<AdminReportsPage initialTab="businesses" />} />
        <Route path="reports/marketplace" element={<AdminReportsPage initialTab="marketplace" />} />
        <Route path="reports/orders-sales" element={<AdminReportsPage initialTab="orders-sales" />} />
        <Route path="reports/revenue" element={<AdminReportsPage initialTab="revenue" />} />
        <Route path="reports/education" element={<AdminReportsPage initialTab="education" />} />
        <Route path="reports/teachers" element={<AdminReportsPage initialTab="teachers" />} />
        <Route path="reports/jobs" element={<AdminReportsPage initialTab="jobs" />} />
        <Route path="reports/referrals" element={<AdminReportsPage initialTab="referrals" />} />

        <Route path="teacher-payments" element={<AdminTeacherPaymentsPage />} />
        <Route path="audit-logs" element={<AdminAuditLogsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
