
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Edit2, 
  Trash2, 
  Plus, 
  Copy,
  Eye
} from 'lucide-react';
import { AdminBlogPost } from '../adminTypes';
import { deleteAdminBlog, duplicatePost } from '../blogStore';
import { getCategoryName } from '../taxonomyStore';

interface BlogsTabProps {
  posts: AdminBlogPost[];
  onDataChange: () => void;
  searchQuery?: string;
}

const BlogsTab: React.FC<BlogsTabProps> = ({ posts, onDataChange, searchQuery = '' }) => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft' | 'Scheduled'>('All');
  
  // Filtering logic
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' 
        ? true 
        : post.status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }, [posts, searchQuery, statusFilter]);

  const handleCreate = () => {
    navigate('/admin/blog/new');
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/blog/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      deleteAdminBlog(id);
      onDataChange();
    }
  };

  const handleDuplicate = (id: string) => {
    duplicatePost(id);
    onDataChange();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700 border-green-200';
      case 'draft': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex bg-gray-100 p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
          {['All', 'Published', 'Draft', 'Scheduled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab as any)}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                statusFilter === tab 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <button 
          onClick={handleCreate}
          className="flex items-center justify-center space-x-2 bg-amber-700 text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-amber-800 transition-all shadow-md w-full sm:w-auto"
        >
          <Plus size={16} />
          <span>New Post</span>
        </button>
      </div>

      {/* Blog List Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap md:whitespace-normal">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 w-12">
                  <input type="checkbox" className="rounded border-gray-300 text-amber-700 focus:ring-amber-500" />
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Post</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Published Date</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300 text-amber-700 focus:ring-amber-500" />
                  </td>
                  <td className="px-6 py-4 max-w-sm">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200 hidden sm:block">
                        <img src={post.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <button 
                          onClick={() => handleEdit(post.id)}
                          className="text-sm font-bold text-gray-900 hover:text-amber-700 transition-colors text-left block truncate max-w-[200px]"
                        >
                          {post.title}
                        </button>
                        <p className="text-[10px] text-gray-400 mt-1 truncate max-w-[200px] hidden sm:block">{post.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase border ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-md font-bold uppercase tracking-wider">
                      {getCategoryName(post.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center space-x-1">
                      <button onClick={() => window.open(`/#/blog/${post.slug}`, '_blank')} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all" title="View">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => handleDuplicate(post.id)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Duplicate">
                        <Copy size={16} />
                      </button>
                      <button onClick={() => handleEdit(post.id)} className="p-2 text-gray-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(post.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPosts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Search size={32} className="mb-4 opacity-50" />
                      <p className="text-sm font-medium">No posts found matching your filters.</p>
                      <button onClick={handleCreate} className="mt-4 text-amber-700 text-xs font-bold uppercase tracking-widest hover:underline">
                        Create New Post
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlogsTab;
