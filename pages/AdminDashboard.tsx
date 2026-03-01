
import React, { useState, useEffect } from 'react';
import AdminLayout from '../src/admin/AdminLayout';
import OverviewTab from '../src/admin/tabs/OverviewTab';
import BlogsTab from '../src/admin/tabs/BlogsTab';
import SettingsTab from '../src/admin/tabs/SettingsTab';
import TaxonomyTab from '../src/admin/tabs/TaxonomyTab';
import StartHereTab from '../src/admin/tabs/StartHereTab';
import ServicesTab from '../src/admin/tabs/ServicesTab';
import BookingsTab from '../src/admin/tabs/BookingsTab';
import { listBlogs, listBookings } from '../src/admin/adminData';
import { AdminBlogPost } from '../src/admin/adminTypes';
import { useAuth } from '../context/AuthContext';

const AdminDashboard: React.FC = () => {
  const { role, loading, loginWithGoogle, loginWithEmail, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'blogs' | 'taxonomy' | 'starthere' | 'services' | 'bookings' | 'settings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    await loginWithEmail(email, password);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-sm text-gray-500">Checking admin access…</div>
      </div>
    );
  }

  if (role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-3 text-center">Admin Access Only</h1>
          <p className="text-sm text-gray-500 mb-6 text-center">
            This dashboard is restricted to administrator accounts. Sign in with an admin email or Google account.
          </p>

          <form onSubmit={handleEmailLogin} className="space-y-4 mb-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all text-sm"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all text-sm"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition-all text-xs uppercase tracking-widest"
            >
              Sign in with Email
            </button>
          </form>

          <button
            onClick={loginWithGoogle}
            className="w-full py-3 bg-white text-gray-900 font-bold rounded-lg border border-gray-200 hover:border-amber-700 hover:text-amber-700 transition-all text-[11px] uppercase tracking-widest"
          >
            Or continue with Google
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
    >
      {renderTabContent()}
    </AdminLayout>
  );
};

export default AdminDashboard;
