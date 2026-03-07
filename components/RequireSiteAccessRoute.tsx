import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RequireSiteAccessRoute: React.FC = () => {
  const { loading, hasAccess } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-sm text-gray-500">Checking sign-in status...</div>
      </div>
    );
  }

  if (!hasAccess) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RequireSiteAccessRoute;
