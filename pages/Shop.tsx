
import React from 'react';
import { EBOOKS, PACKAGES } from '../constants';
import ProductCard from '../components/ProductCard';
import { BookOpen, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const Shop: React.FC = () => {
  return (
    <div className="animate-fade-in pb-20 bg-[#F9F9F7]">
      <div className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Publications & Reports</h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Technical guides and individual research papers for serious students of Vedic Astrology. 
          </p>
          <div className="mt-8">
            <Link to="/courses" className="text-sm font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-6 py-2 rounded-full border border-amber-100 hover:bg-amber-100 transition-all">
              Switch to Academy Courses
            </Link>
          </div>
        </div>
      </div>

      {/* Technical E-Books */}
      <div className="max-w-7xl mx-auto px-4 mt-20">
        <div className="flex items-center space-x-3 mb-10">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
            <BookOpen className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 uppercase tracking-widest text-sm">Technical E-Books</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {EBOOKS.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Reports & Packages */}
      <div className="max-w-7xl mx-auto px-4 mt-24">
        <div className="flex items-center space-x-3 mb-10">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
            <Package className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 uppercase tracking-widest text-sm">Reports & Value Packages</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl">
          {PACKAGES.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-32 text-center">
        <div className="p-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-serif font-bold mb-4 text-gray-900">Immediate Digital Delivery</h2>
          <p className="text-gray-600 mb-8 leading-relaxed text-sm">Currently, all our publications and reports are digital (PDF) to ensure immediate worldwide delivery. Secure payments via Topmate.</p>
          <a href="mailto:support@astrokarak.com" className="text-amber-700 font-bold uppercase tracking-widest text-xs border-b-2 border-amber-700 pb-1 hover:text-amber-900 hover:border-amber-900 transition-colors">
            Bulk Purchase Inquiry
          </a>
        </div>
      </div>
    </div>
  );
};

export default Shop;
