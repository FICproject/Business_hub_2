import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Public Pages
import { LandingPage } from '../pages/landing/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { MarketplacePage } from '../pages/marketplace/MarketplacePage';
import { ProductDetailPage } from '../pages/marketplace/ProductDetailPage';
import { CartPage } from '../pages/marketplace/CartPage';
import { CheckoutPage } from '../pages/marketplace/CheckoutPage';
import { EducationPage } from '../pages/education/EducationPage';
import { CourseDetailPage } from '../pages/education/CourseDetailPage';
import { LiveClassesPage } from '../pages/education/LiveClassesPage';
import { StudyMaterialsPage } from '../pages/education/StudyMaterialsPage';
import { TuitionPage } from '../pages/education/TuitionPage';
import { JobsPage } from '../pages/jobs/JobsPage';
import { JobDetailPage } from '../pages/jobs/JobDetailPage';
import { ShareRedirectPage } from '../pages/sharing/ShareRedirectPage';
import { TermsPage } from '../pages/legal/TermsPage';
import { PrivacyPolicyPage } from '../pages/legal/PrivacyPolicyPage';
import { BusinessDetailsPage } from '../pages/business/BusinessDetailsPage';
import { TeacherDetailsPage } from '../pages/teacher/TeacherDetailsPage';
import { CommunityPage } from '../pages/community/CommunityPage';
import { EventsPage } from '../pages/events/EventsPage';

// Dashboards
import { StudentDashboardPage } from '../pages/student/StudentDashboardPage';
import { TeacherDashboardPage } from '../pages/teacher/TeacherDashboardPage';
import { BusinessDashboardPage } from '../pages/business/BusinessDashboardPage';
import { NormalUserDashboardPage } from '../pages/user/NormalUserDashboardPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { SavedItemsView } from '../components/dashboard/SavedItemsView';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes with Navbar and Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/marketplace/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/education" element={<EducationPage />} />
        <Route path="/education/courses/:id" element={<CourseDetailPage />} />
        <Route path="/education/live-classes" element={<LiveClassesPage />} />
        <Route path="/education/materials" element={<StudyMaterialsPage />} />
        <Route path="/education/tuition" element={<TuitionPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/share/:code" element={<ShareRedirectPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

        {/* Direct Navigation Pages */}
        <Route path="/business" element={<BusinessDetailsPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/student" element={<Navigate to="/education" replace />} />
        <Route path="/teacher" element={<TeacherDetailsPage />} />
        <Route path="/about" element={<Navigate to="/#about" replace />} />
        <Route path="/contact" element={<Navigate to="/#contact" replace />} />
      </Route>

      {/* Role-Based Dashboards */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/dashboard/student" replace />} />
        <Route path="student/*" element={<StudentDashboardPage />} />
        <Route path="teacher/*" element={<TeacherDashboardPage />} />
        <Route path="business/*" element={<BusinessDashboardPage />} />
        <Route path="user/*" element={<NormalUserDashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="saved" element={<SavedItemsView />} />
        <Route path="admin" element={<Navigate to="http://localhost:3001" replace />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
