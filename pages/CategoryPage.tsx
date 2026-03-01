
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { listPublicPosts } from '../src/admin/blogStore';
import { getCategoryBySlug, getCategoryByName } from '../src/admin/taxonomyStore';
import BlogCard from '../components/BlogCard';
import { ArrowLeft, BookOpen, Layers } from 'lucide-react';
import { BlogPost } from '../types';

const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [categoryName, setCategoryName] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  
  // Find the pretty name from the slug and filter posts
  useEffect(() => {
    const slug = categorySlug || '';
    
    // 1. Resolve Name from Taxonomy Store
    const cat = getCategoryBySlug(slug);
    if (cat) {
      setCategoryName(cat.name);
    } else {
      // Fallback formatting if not found in taxonomy (e.g. legacy or just deleted but URL still hit)
      setCategoryName(slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '));
    }

    // 2. Fetch and Filter Posts
    const allPosts = listPublicPosts();
    const matches = allPosts.filter(post => {
      // Current system stores category as Slug in post.category (mostly).
      // Legacy data might have Name. 
      
      // Check 1: Exact match (Post category slug === URL slug)
      if (post.category === slug) return true;

      // Check 2: Post has Name, convert to slug and check
      const postCatSlug = getCategoryByName(post.category)?.slug;
      if (postCatSlug === slug) return true;

      // Check 3: Legacy simple slugify fallback
      const simpleSlug = post.category.toLowerCase().replace(/\s+/g, '-');
      if (simpleSlug === slug) return true;

      return false;
    });
    setFilteredPosts(matches);

  }, [categorySlug]);

  return (
    <div className="animate-fade-in pb-20 bg-[#F9F9F7] min-h-screen">
      <div className="bg-white border-b border-gray-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/start-here" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-amber-700 mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-3 w-3" /> Back to Roadmap
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-2 text-amber-700 mb-4">
                <Layers className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-widest">Category Archive</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                {categoryName}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Technical research, foundational concepts, and practical applications focused on {categoryName}. Master this specific area of Jyotish.
              </p>
            </div>
            
            <div className="hidden lg:block">
              <div className="p-6 bg-amber-50 rounded-xl border border-amber-100 max-w-xs">
                <div className="flex items-center space-x-3 mb-3 text-amber-900">
                  <BookOpen className="h-5 w-5" />
                  <span className="font-bold text-sm">Learning Resources</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Looking for more structure? Follow our complete Learning Roadmap to see how {categoryName} fits into the bigger picture.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 py-20 text-center">
            <div className="max-w-xs mx-auto">
              <Layers className="h-12 w-12 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-bold text-gray-400 mb-2">No research yet.</h3>
              <p className="text-sm text-gray-400 mb-6">We're currently documenting our research for this category. Check back soon.</p>
              <Link to="/blog" className="text-amber-700 font-bold uppercase tracking-widest text-xs border-b border-amber-700 pb-1">Browse All Research</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
