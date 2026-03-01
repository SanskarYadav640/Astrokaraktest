
import { BlogPost } from '../../types';

export interface AdminBlogPost extends BlogPost {
  // Extended Metadata
  tags: string[];
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  isFeatured: boolean;

  // Timestamps (ISO Strings)
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  scheduledFor?: string | null;

  // SEO
  seoTitle?: string;
  seoMetaDescription?: string;
  canonicalUrl?: string;
  noindex?: boolean;

  // Social / Open Graph
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
}
