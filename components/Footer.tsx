
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-white text-lg font-serif font-bold mb-4 tracking-wider">ASTROKARAK</h3>
            <p className="text-sm leading-relaxed mb-4">
              Direct, grounded Vedic astrology education for the modern practitioner. We believe in clarity over mysticism.
            </p>
          </div>
          
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-4">Learning</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/start-here" className="hover:text-amber-500">Start Here</Link></li>
              <li><Link to="/blog" className="hover:text-amber-500">Blog</Link></li>
              <li><Link to="/courses" className="hover:text-amber-500">Courses</Link></li>
              <li><Link to="/shop" className="hover:text-amber-500">Ebooks</Link></li>
              <li><Link to="/jyotish-books" className="hover:text-amber-500">Jyotish Books</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/consultations" className="hover:text-amber-500">Consultations</Link></li>
              <li><Link to="/priority-dm" className="hover:text-amber-500">Priority DM</Link></li>
              <li><Link to="/reviews" className="hover:text-amber-500">Client Reviews</Link></li>
              <li><Link to="/community" className="hover:text-amber-500">Community</Link></li>
              <li><Link to="/contact" className="hover:text-amber-500">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="hover:text-amber-500">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-amber-500">Terms of Service</Link></li>
              <li><Link to="/refund-policy" className="hover:text-amber-500">Refund Policy</Link></li>
              <li><Link to="/disclaimer" className="hover:text-amber-500">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-center md:text-left text-gray-500">
            &copy; {new Date().getFullYear()} Astrokarak. All rights reserved. Sidereal calculations used.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
