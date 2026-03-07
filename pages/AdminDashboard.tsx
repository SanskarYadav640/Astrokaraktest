import React, { useEffect, useState } from 'react';
import AdminLayout from '../src/admin/AdminLayout';
import OverviewTab from '../src/admin/tabs/OverviewTab';
import BlogsTab from '../src/admin/tabs/BlogsTab';
import SettingsTab from '../src/admin/tabs/SettingsTab';
import TaxonomyTab from '../src/admin/tabs/TaxonomyTab';
import StartHereTab from '../src/admin/tabs/StartHereTab';
import ServicesTab from '../src/admin/tabs/ServicesTab';
import BookingsTab from '../src/admin/tabs/BookingsTab';
import MembersTab from '../src/admin/tabs/MembersTab';
import AnalyticsTab from '../src/admin/tabs/AnalyticsTab';
import { listBlogs, listBookings } from '../src/admin/adminData';
import { AdminBlogPost } from '../src/admin/adminTypes';
import { useAuth } from '../context/AuthContext';

const AdminDashboard: React.FC = () => {
  const { role, user, loading, loginWithGoogle, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'blogs' | 'taxonomy' | 'starthere' | 'services' | 'bookings' | 'members' | 'analytics' | 'settings'
  >('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Data State
  const [blogs, setBlogs] = useState<AdminBlogPost[]>([]);
  const [bookings, setBookings] = useState(listBookings());

  // Initial Load
  useEffect(() => {
    setBlogs(listBlogs());
  }, []);

  // Refresh Handler
  const refreshData = () => {
    setBlogs(listBlogs());
  };

  const getAdminLoginIndicator = () => {
    if (role !== 'admin') return '';
    if (user?.email) return `Logged in as admin (${user.email})`;
    return 'Logged in as admin';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-sm text-gray-500">Checking admin access...</div>
      </div>
    );
  }

  if (role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-3 text-center">Admin Access Only</h1>
          <p className="text-sm text-gray-500 mb-6 text-center">
            This dashboard is restricted to administrator accounts. Use Google sign-in with an admin-authorized account.
          </p>

          <button
            onClick={() => loginWithGoogle('/admin')}
            className="w-full py-3 bg-white text-gray-900 font-bold rounded-lg border border-gray-200 hover:border-amber-700 hover:text-amber-700 transition-all text-[11px] uppercase tracking-widest"
          >
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab blogs={blogs} bookings={bookings} />;
      case 'blogs':
        return <BlogsTab posts={blogs} onDataChange={refreshData} searchQuery={searchQuery} />;
      case 'taxonomy':
        return <TaxonomyTab />;
      case 'starthere':
        return <StartHereTab />;
      case 'services':
        return <ServicesTab />;
      case 'bookings':
        return <BookingsTab />;
      case 'members':
        return <MembersTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab blogs={blogs} bookings={bookings} />;
    }
  };

  return (
    <AdminLayout
      activeTab={activeTab as any}
      setActiveTab={setActiveTab as any}
      onLogout={logout}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      adminSessionLabel={getAdminLoginIndicator()}
    >
      {renderTabContent()}
    </AdminLayout>
  );
};

export default AdminDashboard;
