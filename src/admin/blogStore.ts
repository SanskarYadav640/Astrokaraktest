
import { SAMPLE_BLOGS } from '../../constants';
import { AdminBlogPost } from './adminTypes';
import { BlogPost } from '../../types';
import { slugify } from './utils';
import { getCategoryName } from './taxonomyStore'; 
import { ADMIN_BLOGS_KEY } from './storageKeys';

// Helper: Normalize Data
const normalizePost = (post: any): AdminBlogPost => {
  const now = new Date().toISOString();
  
  let categorySlug = post.category || 'uncategorized';
  if (/[A-Z]|\s/.test(categorySlug)) {
     const slug = slugify(categorySlug);
     categorySlug = slug;
  }

  const tagSlugs = (post.tags || []).map((t: string) => {
    if (/[A-Z]|\s/.test(t)) return slugify(t);
    return t;
  });

  return {
    ...post,
    category: categorySlug,
    tags: tagSlugs,
    status: post.status || 'draft',
    isFeatured: post.isFeatured || false,
    createdAt: post.createdAt || now,
    updatedAt: post.updatedAt || now,
    publishedAt: post.publishedAt || (post.status === 'published' ? (post.date ? new Date(post.date).toISOString() : now) : null),
    scheduledFor: post.scheduledFor || null,
    
    // SEO Defaults
    seoTitle: post.seoTitle || post.title || '',
    seoMetaDescription: post.seoMetaDescription || post.excerpt || '',
    canonicalUrl: post.canonicalUrl || '',
    noindex: post.noindex || false,

    // Social Defaults
    ogTitle: post.ogTitle || '',
    ogDescription: post.ogDescription || '',
    ogImageUrl: post.ogImageUrl || ''
  };
};

const getInitialData = (): AdminBlogPost[] => {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(ADMIN_BLOGS_KEY);
  let posts: AdminBlogPost[] = [];

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // We have data, normalize it just in case structure changed
        posts = parsed.map(normalizePost);
      }
    } catch (e) {
      console.error('Error parsing blog storage', e);
      // Fallback to empty if parse failed, seeding logic below will handle if truly empty context
    }
  }

  // Only seed if absolutely no data exists in storage
  if (posts.length === 0 && !stored) {
    posts = SAMPLE_BLOGS.map(post => normalizePost({
      ...post,
      status: 'published',
      tags: ['vedic', 'astrology'],
    }));
    localStorage.setItem(ADMIN_BLOGS_KEY, JSON.stringify(posts));
  }
  
  // Check for scheduled posts that need promotion
  const now = new Date();
  let hasUpdates = false;
  posts.forEach(p => {
    if (p.status === 'scheduled' && p.scheduledFor) {
      if (new Date(p.scheduledFor) <= now) {
        p.status = 'published';
        p.publishedAt = p.scheduledFor;
        p.scheduledFor = null;
        hasUpdates = true;
      }
    }
  });

  if (hasUpdates) {
    localStorage.setItem(ADMIN_BLOGS_KEY, JSON.stringify(posts));
  }

  return posts;
};

// CRUD Operations

export const listPosts = (): AdminBlogPost[] => {
  const posts = getInitialData();
  return posts.sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return dateB - dateA;
  });
};

export const listPublicPosts = (): BlogPost[] => {
  const posts = getInitialData(); 
  
  const publicPosts = posts.filter(post => post.status === 'published');

  return publicPosts.sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return dateB - dateA;
  }).map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    // Lazy usage of taxonomyStore
    category: getCategoryName(p.category),
    date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : p.date, 
    image: p.image,
    author: p.author
  }));
};

export const getPostById = (id: string): AdminBlogPost | undefined => {
  const posts = listPosts();
  return posts.find(p => p.id === id);
};

export const getPublicPostBySlug = (slug: string): BlogPost | null => {
  const publicPosts = listPublicPosts();
  return publicPosts.find(p => p.slug === slug) || null;
};

export const createPost = (data: Partial<AdminBlogPost>): AdminBlogPost => {
  const posts = listPosts();
  const now = new Date().toISOString();
  
  let finalStatus = data.status || 'draft';
  
  // Unique Slug Logic
  let baseSlug = data.slug ? slugify(data.slug) : slugify(data.title || 'untitled');
  let finalSlug = baseSlug;
  let counter = 2;
  while (posts.some(p => p.slug === finalSlug)) {
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  const newPost: AdminBlogPost = {
    ...normalizePost(data),
    id: `blog-${Date.now()}`,
    slug: finalSlug,
    createdAt: now,
    updatedAt: now,
    status: finalStatus,
  };
  
  const updatedPosts = [newPost, ...posts];
  localStorage.setItem(ADMIN_BLOGS_KEY, JSON.stringify(updatedPosts));
  return newPost;
};

export const updatePost = (id: string, patch: Partial<AdminBlogPost>): AdminBlogPost | null => {
  const posts = listPosts();
  const index = posts.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  const currentPost = posts[index];
  const now = new Date().toISOString();
  
  // Handle Slug updates carefully
  let finalSlug = currentPost.slug;
  if (patch.slug && patch.slug !== currentPost.slug) {
    let baseSlug = slugify(patch.slug);
    finalSlug = baseSlug;
    let counter = 2;
    while (posts.some(p => p.slug === finalSlug && p.id !== id)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  const updatedPost: AdminBlogPost = {
    ...currentPost,
    ...patch,
    slug: finalSlug,
    updatedAt: now,
  };
  
  // Logic for publishedAt vs scheduledFor handled in normalize or UI, 
  // but ensure date string format consistency
  if (updatedPost.status === 'published' && !updatedPost.publishedAt) {
    updatedPost.publishedAt = now;
  }

  posts[index] = updatedPost;
  localStorage.setItem(ADMIN_BLOGS_KEY, JSON.stringify(posts));
  return updatedPost;
};

export const deletePost = (id: string): void => {
  const posts = listPosts();
  const filtered = posts.filter(p => p.id !== id);
  localStorage.setItem(ADMIN_BLOGS_KEY, JSON.stringify(filtered));
};

export const duplicatePost = (id: string): AdminBlogPost | null => {
  const posts = listPosts();
  const original = posts.find(p => p.id === id);
  if (!original) return null;

  const copy = { ...original, title: `${original.title} (Copy)`, status: 'draft' as const, publishedAt: null, scheduledFor: null };
  // remove id to force new creation
  delete (copy as any).id;
  
  return createPost(copy);
};

export const generateSlug = (text: string, excludeId?: string): string => {
  const posts = listPosts();
  let base = slugify(text);
  if (!base) base = 'untitled';
  
  let slug = base;
  let count = 1;
  
  while (posts.some(p => p.slug === slug && p.id !== excludeId)) {
    slug = `${base}-${count}`;
    count++;
  }
  
  return slug;
};

// Exports for Admin UI and internal use
export const getAdminBlogs = listPosts;
export const createAdminBlog = createPost;
export const updateAdminBlog = updatePost;
export const deleteAdminBlog = deletePost;
export { slugify };
