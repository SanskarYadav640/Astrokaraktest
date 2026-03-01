
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Radio, ChevronRight, PlayCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { listPublicPosts } from '../src/admin/blogStore';
import { listPublicCategories } from '../src/admin/taxonomyStore';
import BlogCard from '../components/BlogCard';
import { BlogPost } from '../types';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [taxCategories, setTaxCategories] = useState<{name: string, slug: string}[]>([]);

  // Load data on mount
  useEffect(() => {
    setPosts(listPublicPosts());
    const publicCats = listPublicCategories().map(c => ({ name: c.name, slug: c.slug }));
    setTaxCategories(publicCats);
  }, []);

  const filteredPosts = posts.filter(post => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = post.title.toLowerCase().includes(searchLower) || 
                          post.excerpt.toLowerCase().includes(searchLower);
    
    if (activeCategory === 'All') return matchesSearch;

    // Check match against category slug (preferred) or name (legacy)
    const activeSlug = taxCategories.find(c => c.name === activeCategory)?.slug || activeCategory.toLowerCase();
    const postCatSlug = post.category.toLowerCase(); // Assuming post.category is mostly slug now
    
    // Robust check: match slug OR name
    const matchesCategory = postCatSlug === activeSlug || 
                            post.category === activeCategory || 
                            post.category.toLowerCase().replace(/\s+/g, '-') === activeSlug;

    return matchesSearch && matchesCategory;
  });

  const reelTitles = [
    "Saturn's Grip", "Rahu Illusion", "Lunar Nodes", "Mars Fury", "Venus Grace", 
    "Jupiter's Law", "Solar Ego", "Mercury Logic", "D9 Secrets", "D10 Power",
    "Ketu Void", "Rising Sign"
  ];

  return (
    <div className="animate-fade-in bg-[#F9F9F7]">
      {/* Standard Blog Section */}
      <div className="bg-white py-12 md:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">The Research Archive</h1>
            <p className="text-gray-500 max-w-2xl">Technical documentation on Vedic placements, planetary periods, and divisional chart synthesis.</p>
          </div>
          
          <div className="flex flex-col space-y-8">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 md:gap-3">
              <button
                  onClick={() => setActiveCategory('All')}
                  className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border shadow-sm ${
                    activeCategory === 'All' 
                      ? 'bg-amber-700 text-white border-amber-700' 
                      : 'bg-white text-gray-500 border-gray-100 hover:border-amber-200 hover:text-amber-700'
                  }`}
                >
                  All
              </button>
              {taxCategories.map(cat => (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border shadow-sm ${
                    activeCategory === cat.name 
                      ? 'bg-amber-700 text-white border-amber-700' 
                      : 'bg-white text-gray-500 border-gray-100 hover:border-amber-200 hover:text-amber-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between border-t border-gray-50 pt-8">
              <div className="text-xs text-gray-400 font-medium">
                Showing <span className="text-gray-900 font-bold">{filteredPosts.length}</span> research papers in <span className="text-amber-700 font-bold">"{activeCategory}"</span>
              </div>
              
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search technical keywords (e.g. Navamsa, Saturn)..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none focus:bg-white transition-all text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 mb-20">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200 max-w-4xl mx-auto">
            <Search className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">No research found.</h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto mb-8">We haven't published any papers in "{activeCategory}" matching your search yet.</p>
            <button 
              onClick={() => {setActiveCategory('All'); setSearchTerm('');}} 
              className="text-amber-700 font-bold uppercase tracking-widest text-xs border-b-2 border-amber-700 pb-1"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Discovery Section: Animated Reels (9:16) */}
      <section className="bg-[#0A0A0A] pt-16 pb-24 text-white">
        <div className="max-w-[1400px] mx-auto px-4">
          
          {/* Section Separator */}
          <div className="relative flex items-center justify-center mb-16">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative">
              <div className="bg-white text-black px-8 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                Quick Discover
              </div>
            </div>
          </div>

          {/* Ultra-High Density Reel Grid (9:16) */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-3 md:gap-4">
            {reelTitles.map((title, idx) => (
              <div key={idx} className="group relative flex flex-col bg-[#1A1A1A] rounded-xl overflow-hidden hover:bg-[#252525] transition-all duration-300">
                <div className="relative aspect-[9/16] overflow-hidden bg-gray-900">
                  <img 
                    src={`https://picsum.photos/450/800?random=${idx + 200}&sig=planet`} 
                    alt={title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                  />
                  {/* Badge Overlay */}
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full flex items-center space-x-1 border border-white/10 scale-75 origin-top-left">
                    <Radio className="h-3 w-3 text-white" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Astro Reel</span>
                  </div>
                  {/* Play Icon Center */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full border border-white/30">
                      <PlayCircle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-2 md:p-3 flex flex-col flex-grow">
                  <h3 className="text-[10px] md:text-xs font-semibold leading-tight group-hover:text-amber-400 transition-colors line-clamp-2">
                    {title}
                  </h3>
                </div>
              </div>
            ))}

            {/* "Click for More" Card */}
            <Link 
              to="/reels" 
              className="group relative flex flex-col bg-amber-900/10 border border-amber-700/30 rounded-xl overflow-hidden hover:bg-amber-900/20 transition-all duration-300"
            >
              <div className="relative aspect-[9/16] flex flex-col items-center justify-center p-4 text-center">
                <div className="bg-amber-700 p-3 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-amber-900/40">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500">Discover</span>
                <h3 className="text-xs md:text-sm font-serif font-bold mt-2">Animated Shorts</h3>
              </div>
            </Link>
          </div>

          {/* Recently Published Category Buttons */}
          <div className="mt-20 pt-12 border-t border-gray-800">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-6 text-center">Popular Research Categories</p>
            <div className="flex flex-wrap justify-center gap-3">
              {taxCategories.slice(0, 10).map((cat) => (
                <button 
                  key={cat.slug}
                  onClick={() => {
                    setActiveCategory(cat.name);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 bg-[#1A1A1A] border border-gray-800 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-300 hover:bg-amber-700 hover:text-white hover:border-amber-700 transition-all flex items-center group"
                >
                  {cat.name}
                  <ChevronRight className="ml-2 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
