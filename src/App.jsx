import React from 'react';
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import Sidebar from './components/common/Sidebar.jsx';
import BottomNav from './components/common/BottomNav.jsx';

// Public & Browse Pages
import HomePage from './pages/HomePage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import ServiceDetailPage from './pages/ServiceDetailPage.jsx';
import CategoriesPage from './pages/CategoriesPage.jsx';
import ProvidersPage from './pages/ProvidersPage.jsx';
import ProviderDetailPage from './pages/ProviderDetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import BecomeProviderPage from './pages/BecomeProviderPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Protected Pages
import ProfilePage from './pages/ProfilePage.jsx';
import CustomerDashboardPage from './pages/CustomerDashboardPage.jsx';
import ProviderDashboardPage from './pages/ProviderDashboardPage.jsx';
import BookingsPage from './pages/BookingsPage.jsx';
import ProviderServicesPage from './pages/ProviderServicesPage.jsx';
import ReviewsPage from './pages/ReviewsPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AdminUsersPage from './pages/AdminUsersPage.jsx';
import AdminProvidersPage from './pages/AdminProvidersPage.jsx';
import AdminCategoriesPage from './pages/AdminCategoriesPage.jsx';
import AdminBookingsPage from './pages/AdminBookingsPage.jsx';
import AdminReportsPage from './pages/AdminReportsPage.jsx';

// Route Guards
import { PrivateRoute, PublicRoute, RoleRoute } from './routes/PrivateRoute.jsx';

// Dashboard Layout Wrapper with Sidebar
function DashboardLayout() {
  return (
    <div className="w-full flex-1 bg-[#0b0d11]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-4.5rem)]">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full flex flex-col items-center">
          <div className="w-full max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

// Public Marketplace Layout
function PublicLayout() {
  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex flex-col justify-between">
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#0b0d11] text-neutral-100 flex flex-col pb-16 md:pb-0">
      <Navbar />

      <Routes>
        {/* Public Marketplace Views */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/providers" element={<ProvidersPage />} />
          <Route path="/providers/:id" element={<ProviderDetailPage />} />
          <Route path="/become-provider" element={<BecomeProviderPage />} />

          {/* Auth (Redirects away if already logged in) */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>

        {/* Authenticated Dashboard Views (With Sidebar) */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/dashboard/notifications" element={<NotificationsPage />} />
            <Route path="/dashboard/bookings" element={<BookingsPage />} />
            <Route path="/dashboard/reviews" element={<ReviewsPage />} />

            {/* Customer Portal */}
            <Route element={<RoleRoute allowedRoles={['customer', 'admin']} />}>
              <Route path="/dashboard/customer" element={<CustomerDashboardPage />} />
            </Route>

            {/* Provider Portal */}
            <Route element={<RoleRoute allowedRoles={['provider', 'admin']} />}>
              <Route path="/dashboard/provider" element={<ProviderDashboardPage />} />
              <Route path="/dashboard/services" element={<ProviderServicesPage />} />
            </Route>

            {/* Root Admin Portal */}
            <Route element={<RoleRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/providers" element={<AdminProvidersPage />} />
              <Route path="/admin/categories" element={<AdminCategoriesPage />} />
              <Route path="/admin/bookings" element={<AdminBookingsPage />} />
              <Route path="/admin/reports" element={<AdminReportsPage />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback 404 */}
        <Route element={<PublicLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      {/* Mobile Bottom Quick-Access Bar */}
      <BottomNav />
    </div>
  );
}
