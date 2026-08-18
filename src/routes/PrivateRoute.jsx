import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

export const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0d11]">
        <LoadingSpinner size="lg" message="Authenticating session..." />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export const PublicRoute = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0d11]">
        <LoadingSpinner size="lg" message="Loading FIXIT..." />
      </div>
    );
  }

  // If already logged in and visiting login/register, redirect to dashboard or home
  if (isAuthenticated && user) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'provider') return <Navigate to="/dashboard/provider" replace />;
    return <Navigate to="/dashboard/customer" replace />;
  }

  return <Outlet />;
};

export const RoleRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0d11]">
        <LoadingSpinner size="lg" message="Verifying permissions..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isAllowed =
    user &&
    (allowedRoles.includes(user.role) ||
      (allowedRoles.includes('provider') &&
        (user.role === 'provider' ||
          user.providerProfile?.verification_status === 'verified' ||
          user.verification_status === 'verified')) ||
      user.role === 'admin');

  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
