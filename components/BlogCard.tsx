
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BlogPost } from '../types';
import { CATEGORY_MAP } from '../constants';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const categorySlug = CATEGORY_MAP[post.category] || post.category.toLowerCase().replace(/\s+/g, '-');

  return (
    <article className="group flex flex-col bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="block relative aspect-video overflow-hidden">
        <Link to={`/blog/${post.slug}`} className="w-full h-full block">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="absolute top-4 left-4 z-10">
          <Link 
            to={`/category/${categorySlug}`}
            className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-amber-800 rounded-full shadow-sm hover:bg-amber-700 hover:text-white transition-colors"
          >
            {post.category}
          </Link>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="text-xs text-gray-400 mb-2">{post.date}</div>
        <h3 className="font-serif text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-800 transition-colors">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
          {post.excerpt}
        </p>
        <Link 
          to={`/blog/${post.slug}`}
          className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-amber-700 hover:text-amber-900"
        >
          Read Post <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
