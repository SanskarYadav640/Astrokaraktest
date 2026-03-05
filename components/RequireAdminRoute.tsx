import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RequireAdminRoute: React.FC = () => {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-sm text-gray-500">Checking admin permissions...</div>
      </div>
    );
  }

  if (role !== 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default RequireAdminRoute;
