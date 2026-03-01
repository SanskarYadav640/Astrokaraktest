
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Tag, ChevronRight, ArrowLeft, Send, Lock, MessageCircle } from 'lucide-react';
import { getPublicPostBySlug } from '../src/admin/blogStore';
import { useAuth } from '../context/AuthContext';
import { BlogPost as BlogPostType } from '../types';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { isLoggedIn, user } = useAuth();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { id: '1', user: 'VedicSeeker', text: 'This cleared up so much confusion about my Rahu period. Technical but understandable.', date: 'Oct 15, 2023' },
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (slug) {
      const found = getPublicPostBySlug(slug);
      setPost(found);
    }
    setLoading(false);
  }, [slug]);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;
    
    const newComment = {
      id: Date.now().toString(),
      user: user.name,
      text: comment,
      date: 'Just now'
    };
    
    setComments([newComment, ...comments]);
    setComment('');
  };

  if (loading) {
     return <div className="min-h-screen bg-white"></div>;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Post not found.</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">The research paper you are looking for has either been removed or is currently being updated by our editorial team.</p>
        <Link to="/blog" className="px-8 py-3 bg-amber-700 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-amber-800 transition-all">
          Return to Research Archive
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in bg-white pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-12 pb-8">
        <Link to="/blog" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-amber-700 mb-8">
          <ArrowLeft className="mr-2 h-3 w-3" /> Back to Research
        </Link>
        
        <div className="flex items-center space-x-4 mb-6">
          <span className="px-3 py-1 bg-amber-50 text-[10px] font-bold uppercase tracking-widest text-amber-700 rounded-full">
            {post.category}
          </span>
          <div className="flex items-center text-xs text-gray-400">
            <Calendar className="mr-1 h-3 w-3" /> {post.date}
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight mb-8">
          {post.title}
        </h1>

        <div className="relative aspect-video rounded-xl overflow-hidden mb-12 shadow-sm">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3 prose prose-amber max-w-none">
            <p className="text-lg text-gray-600 leading-relaxed italic mb-8 border-l-4 border-amber-700 pl-4">
              {post.excerpt}
            </p>
            
            <div id="content" className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {/* If HTML content is eventually used, this would use dangerouslySetInnerHTML. For now, text. */}
              {post.content}
            </div>

            {/* Comment Section */}
            <div className="mt-20 pt-12 border-t border-gray-100">
              <div className="flex items-center space-x-3 mb-10">
                <MessageCircle className="h-6 w-6 text-amber-700" />
                <h3 className="text-xl font-serif font-bold">Member Discussion</h3>
              </div>

              {isLoggedIn ? (
                <form onSubmit={handlePostComment} className="mb-12">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                      <img src={user?.avatar} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Join the research discussion..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all text-sm mb-3"
                        rows={3}
                      />
                      <button type="submit" className="px-6 py-2 bg-amber-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-amber-800 transition-all">
                        Post Comment
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="bg-gray-50 p-8 rounded-2xl text-center mb-12 border border-dashed border-gray-200">
                  <Lock className="h-8 w-8 text-gray-300 mx-auto mb-4" />
                  <p className="text-sm text-gray-500 mb-6">Join the conversation. Member access is required to post comments.</p>
                  <Link to="/profile" className="inline-flex items-center px-6 py-2 bg-amber-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-amber-800 transition-all">
                    Sign In to Comment
                  </Link>
                </div>
              )}

              <div className="space-y-8">
                {comments.map((c) => (
                  <div key={c.id} className="flex items-start space-x-4 pb-8 border-b border-gray-50 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700">
                      {c.user.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-bold text-sm">{c.user}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">{c.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                <h5 className="font-serif font-bold text-gray-900 mb-2">Need a personal look?</h5>
                <p className="text-xs text-gray-600 mb-4 leading-relaxed">Get a custom analysis of your placements by our technical experts.</p>
                <Link to="/consultations" className="block w-full py-3 bg-amber-700 text-white text-center text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-amber-800 transition-all shadow-sm">Book Session</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
