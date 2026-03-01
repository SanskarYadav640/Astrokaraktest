import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Check, Settings, Image as ImageIcon, 
  MoreHorizontal, ChevronRight, ChevronDown, Calendar, 
  Globe, Share2, Type, Layout, X, Plus
} from 'lucide-react';
import { createPost, updatePost, getPostById, slugify } from '../blogStore';
import { listCategories, listTags } from '../taxonomyStore';
import { AdminBlogPost } from '../adminTypes';

const BlogEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Data State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState<Partial<AdminBlogPost>>({
    title: '',
    content: '',
    status: 'draft',
    category: '',
    tags: []
  });

  // UI State
  const [activeTab, setActiveTab] = useState<'settings' | 'seo' | 'social'>('settings');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [taxonomy, setTaxonomy] = useState<{categories: any[], tags: any[]}>({categories: [], tags: []});

  // Load Data
  useEffect(() => {
    // Load taxonomy
    setTaxonomy({
      categories: listCategories(),
      tags: listTags()
    });

    if (id) {
      const found = getPostById(id);
      if (found) {
        setPost(found);
      } else {
        navigate('/admin'); // Fallback if invalid ID
      }
    } else {
        // New Post Defaults
        setPost(prev => ({
            ...prev,
            author: 'Astrokarak',
            category: listCategories()[0]?.slug || '',
            image: 'https://picsum.photos/seed/new/800/450'
        }));
    }
    setLoading(false);
  }, [id, navigate]);

  // Handlers
  const handleChange = (field: keyof AdminBlogPost, value: any) => {
    setPost(prev => {
      const newState = { ...prev, [field]: value };

      // Auto-generate slug from title if user hasn't manually overridden it
      if (field === 'title') {
        const currentSlug = prev.slug || '';
        const prevTitleSlug = slugify(prev.title || '');
        
        if (!currentSlug || currentSlug === prevTitleSlug) {
          newState.slug = slugify(value);
        }
      }

      return newState;
    });
  };

  const handleSave = async (newStatus?: 'draft' | 'published' | 'scheduled') => {
    if (!post.title) return alert('Title is required');
    if (!post.category) return alert('Category is required');

    setSaving(true);
    
    const payload = { 
      ...post, 
      status: newStatus || post.status 
    };

    // Simulate delay for UX
    await new Promise(r => setTimeout(r, 600));

    if (id) {
      updatePost(id, payload);
    } else {
      const created = createPost(payload);
      // Redirect to edit mode to prevent duplicate creation on next save
      navigate(`/admin/blog/edit/${created.id}`, { replace: true });
    }
    
    setSaving(false);
  };

  const handleInsertBlock = (type: 'divider' | 'image' | 'button') => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    let insertion = '';
    switch(type) {
        case 'divider': insertion = '\n\n---\n\n'; break;
        case 'image': insertion = '\n![Image Description](https://picsum.photos/800/400)\n'; break;
        case 'button': insertion = '\n[BUTTON: Button Text](https://link.com)\n'; break;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = post.content || '';
    const newText = text.substring(0, start) + insertion + text.substring(end);
    
    handleChange('content', newText);
    
    // Reset focus
    setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + insertion.length, start + insertion.length);
    }, 0);
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading editor...</div>;

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
        
        {/* LEFT SIDEBAR (Settings) */}
        {isSidebarOpen && (
            <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-full shrink-0 overflow-hidden z-20 shadow-xl absolute md:relative animate-fade-in">
                {/* Sidebar Header/Tabs */}
                <div className="flex border-b border-gray-200 bg-white shrink-0">
                    {[
                        { id: 'settings', icon: Settings, label: 'General' },
                        { id: 'seo', icon: Globe, label: 'SEO' },
                        { id: 'social', icon: Share2, label: 'Social' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-3 flex justify-center items-center text-gray-500 hover:text-gray-900 border-b-2 transition-all ${
                                activeTab === tab.id ? 'border-amber-700 text-amber-700 bg-amber-50/50' : 'border-transparent'
                            }`}
                            title={tab.label}
                        >
                            <tab.icon size={18} />
                        </button>
                    ))}
                </div>

                {/* Sidebar Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50">
                    
                    {/* GENERAL SETTINGS */}
                    {activeTab === 'settings' && (
                        <>
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Publishing</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Publish Date</label>
                                        <input 
                                            type="datetime-local" 
                                            value={post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : ''}
                                            onChange={(e) => handleChange('publishedAt', e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Author</label>
                                        <select 
                                            value={post.author}
                                            onChange={(e) => handleChange('author', e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs"
                                        >
                                            <option value="Astrokarak">Astrokarak</option>
                                            <option value="Guest">Guest Contributor</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-200">
                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Featured Image</h3>
                                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden relative group">
                                    <img src={post.image} alt="Featured" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="text-xs font-bold text-white uppercase tracking-widest border border-white px-3 py-1.5 rounded hover:bg-white hover:text-black transition-all">
                                            Change
                                        </button>
                                    </div>
                                </div>
                                <input 
                                    type="text" 
                                    value={post.image} 
                                    onChange={(e) => handleChange('image', e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs"
                                    placeholder="Image URL..."
                                />
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-200">
                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Excerpt</h3>
                                <textarea 
                                    rows={4}
                                    value={post.excerpt}
                                    onChange={(e) => handleChange('excerpt', e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs leading-relaxed"
                                    placeholder="Short summary for list view..."
                                />
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-200">
                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Taxonomy</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 mb-1">Category</label>
                                        <select 
                                            value={post.category}
                                            onChange={(e) => handleChange('category', e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs"
                                        >
                                            <option value="" disabled>Select Category</option>
                                            {taxonomy.categories.map(c => (
                                                <option key={c.id} value={c.slug}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* SEO SETTINGS */}
                    {activeTab === 'seo' && (
                        <div className="space-y-6">
                            <div>
                                <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                                    <div className="text-xs text-gray-800 mb-1">Preview on Google</div>
                                    <div className="text-blue-800 text-sm font-medium hover:underline truncate cursor-pointer">
                                        {post.seoTitle || post.title}
                                    </div>
                                    <div className="text-green-700 text-xs truncate">
                                        https://astrokarak.com/blog/{post.slug}
                                    </div>
                                    <div className="text-gray-600 text-xs mt-1 line-clamp-2">
                                        {post.seoMetaDescription || post.excerpt}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">URL Slug</label>
                                <div className="flex">
                                    <span className="bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg px-2 py-2 text-xs text-gray-500 select-none">/blog/</span>
                                    <input 
                                        type="text" 
                                        value={post.slug}
                                        onChange={(e) => handleChange('slug', slugify(e.target.value))}
                                        className="w-full bg-white border border-gray-200 rounded-r-lg px-3 py-2 text-xs"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Title Tag</label>
                                <input 
                                    type="text" 
                                    value={post.seoTitle}
                                    onChange={(e) => handleChange('seoTitle', e.target.value)}
                                    placeholder={post.title}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Meta Description</label>
                                <textarea 
                                    rows={3}
                                    value={post.seoMetaDescription}
                                    onChange={(e) => handleChange('seoMetaDescription', e.target.value)}
                                    placeholder={post.excerpt}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs"
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={!post.noindex}
                                        onChange={(e) => handleChange('noindex', !e.target.checked)}
                                        className="rounded text-amber-700 focus:ring-amber-500"
                                    />
                                    <span className="text-xs text-gray-700">Let search engines index this page</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* SOCIAL SETTINGS */}
                    {activeTab === 'social' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="bg-gray-100 p-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest border-b border-gray-200">
                                    Facebook / Twitter Preview
                                </div>
                                <div className="aspect-[1.91/1] bg-gray-100 overflow-hidden">
                                    <img src={post.ogImageUrl || post.image} className="w-full h-full object-cover" alt="Social" />
                                </div>
                                <div className="p-3 bg-gray-50">
                                    <div className="text-xs font-bold text-gray-900 truncate">{post.ogTitle || post.title}</div>
                                    <div className="text-[10px] text-gray-500 mt-1 line-clamp-2">{post.ogDescription || post.excerpt}</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">OG Image</label>
                                <input 
                                    type="text" 
                                    value={post.ogImageUrl}
                                    onChange={(e) => handleChange('ogImageUrl', e.target.value)}
                                    placeholder={post.image}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">OG Title</label>
                                <input 
                                    type="text" 
                                    value={post.ogTitle}
                                    onChange={(e) => handleChange('ogTitle', e.target.value)}
                                    placeholder={post.title}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">OG Description</label>
                                <textarea 
                                    rows={3}
                                    value={post.ogDescription}
                                    onChange={(e) => handleChange('ogDescription', e.target.value)}
                                    placeholder={post.excerpt}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs"
                                />
                            </div>
                        </div>
                    )}

                </div>
            </div>
        )}

        {/* MAIN EDITOR CANVAS */}
        <div className="flex-1 flex flex-col h-full relative min-w-0 bg-white">
            {/* Top Toolbar */}
            <div className="h-16 border-b border-gray-100 flex items-center justify-between px-4 md:px-6 bg-white shrink-0 z-10">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/admin')} className="text-gray-400 hover:text-gray-900 transition-colors" title="Back to Dashboard">
                        <ArrowLeft size={20} />
                    </button>
                    
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={`p-2 rounded-lg transition-all ${isSidebarOpen ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-900'}`}
                        title="Toggle Settings Sidebar"
                    >
                        <Settings size={20} />
                    </button>

                    <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:inline">
                        {post.status === 'published' ? 'Published' : post.status === 'scheduled' ? 'Scheduled' : 'Draft'}
                    </span>
                    {saving && <span className="text-xs text-amber-600 animate-pulse font-medium">Saving...</span>}
                </div>
                <div className="flex items-center space-x-3">
                    <button 
                        onClick={() => handleSave('draft')}
                        className="hidden sm:block px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg uppercase tracking-widest transition-all"
                    >
                        Save Draft
                    </button>
                    <button 
                        onClick={() => handleSave('published')}
                        className="px-4 md:px-6 py-2 bg-amber-700 text-white text-xs font-bold rounded-lg hover:bg-amber-800 uppercase tracking-widest transition-all shadow-md flex items-center"
                    >
                        {post.status === 'published' ? 'Update' : 'Publish'}
                    </button>
                </div>
            </div>

            {/* Writing Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-16">
                <div className="max-w-3xl mx-auto space-y-8">
                    <input 
                        type="text" 
                        placeholder="Add Title"
                        value={post.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        className="w-full text-3xl md:text-5xl font-serif font-bold text-gray-900 placeholder-gray-300 border-none outline-none bg-transparent"
                    />
                    
                    {/* Insert Block Toolbar */}
                    <div className="flex items-center space-x-2 py-2 border-y border-dashed border-gray-100 opacity-60 hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2">Insert:</span>
                        <button onClick={() => handleInsertBlock('image')} className="p-1.5 hover:bg-gray-100 rounded text-gray-500" title="Image"><ImageIcon size={16} /></button>
                        <button onClick={() => handleInsertBlock('divider')} className="p-1.5 hover:bg-gray-100 rounded text-gray-500" title="Divider"><MoreHorizontal size={16} /></button>
                        <button onClick={() => handleInsertBlock('button')} className="p-1.5 hover:bg-gray-100 rounded text-gray-500" title="CTA Button"><Plus size={16} /></button>
                    </div>

                    <textarea 
                        id="content-editor"
                        placeholder="Start writing your research..."
                        value={post.content}
                        onChange={(e) => handleChange('content', e.target.value)}
                        className="w-full h-[50vh] md:h-[60vh] text-base md:text-lg text-gray-700 leading-relaxed border-none outline-none resize-none bg-transparent font-serif"
                    />
                </div>
            </div>
        </div>
    </div>
  );
};

export default BlogEditor;