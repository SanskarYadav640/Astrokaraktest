
import React from 'react';
import { useLocation } from 'react-router-dom';

const Legal: React.FC = () => {
  const location = useLocation();
  const path = location.pathname.substring(1);
  const title = path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="animate-fade-in bg-white pb-20">
      <div className="max-w-3xl mx-auto px-4 pt-16">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-12 pb-4 border-b border-gray-100">{title}</h1>
        
        <div className="prose prose-sm max-w-none text-gray-600 space-y-8">
          <p className="text-xs font-bold text-gray-400">LAST UPDATED: OCTOBER 2023</p>
          
          <section>
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">1. Overview</h2>
            <p>Welcome to Astrokarak. By using this website, you agree to comply with and be bound by the following terms and conditions of use. Our services provide educational astrological information for entertainment and informational purposes only.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">2. Professional Disclaimer</h2>
            <p>Astrological consultations and reports are not a substitute for professional legal, medical, or financial advice. We do not guarantee the accuracy or reliability of any predictions made.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">3. Refund Policy</h2>
            <p>Ebooks are digital products and are non-refundable once downloaded. Consultations may be rescheduled with 24-hour notice. Cancellations made less than 24 hours before the session are subject to a 50% fee.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">4. Intellectual Property</h2>
            <p>All content on this site, including text, graphics, and code, is the property of Astrokarak. Unauthorized reproduction is strictly prohibited.</p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">5. Contact</h2>
            <p>For any legal inquiries, please contact us at legal@astrokarak.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Legal;
