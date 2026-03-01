
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, MessageCircle, Video } from 'lucide-react';
import { SAMPLE_BLOGS, HOME_FAQS, TESTIMONIALS, EBOOKS } from '../constants';
import FAQAccordion from '../components/FAQAccordion';
import TestimonialCard from '../components/TestimonialCard';
import ProductCard from '../components/ProductCard';
import BlogCard from '../components/BlogCard';
import CTASection from '../components/CTASection';

const Home: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="md:w-2/3 lg:w-1/2">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 leading-tight mb-8">
              Predictive Vedic astrology for the <span className="italic">logical mind.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              We move beyond mysticism. Astrokarak provides grounded, technical education in Jyotish. Master the mechanics of karma and time cycles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/consultations" className="px-8 py-4 bg-amber-700 text-white font-medium rounded-md hover:bg-amber-800 transition-all text-center shadow-md">
                Book a Consultation
              </Link>
              <Link to="/start-here" className="px-8 py-4 border border-amber-700 text-amber-700 font-medium rounded-md hover:bg-amber-50 transition-all text-center">
                Start Learning
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-50 hidden lg:block" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }} />
      </section>

      {/* Trust Bar */}
      <section className="py-8 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-12 items-center opacity-60">
          <span className="font-serif italic font-bold text-xl text-gray-400">Deep Tradition</span>
          <span className="font-serif italic font-bold text-xl text-gray-400">Grounded Logic</span>
          <span className="font-serif italic font-bold text-xl text-gray-400">Sidereal Accuracy</span>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Popular E-Books</h2>
              <p className="text-gray-600">Technical research available for immediate access.</p>
            </div>
            <Link to="/shop" className="hidden sm:inline-flex items-center text-amber-700 font-bold uppercase tracking-widest text-xs border-b-2 border-amber-700 pb-1">
              View All E-Books
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {EBOOKS.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Recent Research</h2>
              <p className="text-gray-600">Articles on technical placement and time cycles.</p>
            </div>
            <Link to="/blog" className="hidden sm:inline-flex items-center text-amber-700 font-bold uppercase tracking-widest text-xs border-b-2 border-amber-700 pb-1">
              Read More Posts
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SAMPLE_BLOGS.slice(0, 3).map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      <CTASection 
        title="Ready for technical clarity?"
        description="Book a professional consultation or priority DM to understand your specific life cycles."
        primaryCTA={{ text: "View Consultations", link: "/consultations" }}
        secondaryCTA={{ text: "Free Roadmap", link: "/start-here" }}
      />
    </div>
  );
};

export default Home;
