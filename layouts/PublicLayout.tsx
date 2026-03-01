
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LeadMagnetModal from '../components/LeadMagnetModal';

const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen selection:bg-amber-100 selection:text-amber-900">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <LeadMagnetModal />
    </div>
  );
};

export default PublicLayout;
