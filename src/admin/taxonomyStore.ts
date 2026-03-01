
import { SAMPLE_BLOGS } from '../../constants';
import { slugify } from './utils';
import { ADMIN_BLOGS_KEY, ADMIN_TAXONOMY_KEY } from './storageKeys';

// Types
export interface TaxonomyItem {
  id: string;
  name: string;
  slug: string;
  isPublic: boolean;
  sortOrder: number;
}

interface TaxonomyData {
  categories: TaxonomyItem[];
  tags: TaxonomyItem[];
}

// Internal State - Initially null
let store: TaxonomyData | null = null; 

const saveStorage = () => {
  if (typeof window !== 'undefined' && store) {
    localStorage.setItem(ADMIN_TAXONOMY_KEY, JSON.stringify(store));
  }
};

const seedData = () => {
  // Logic to read raw blogs from storage or constants without importing blogStore
  // This prevents circular dependencies.
  let posts: any[] = [];
  
  if (typeof window !== 'undefined') {
    const rawBlogs = localStorage.getItem(ADMIN_BLOGS_KEY);
    if (rawBlogs) {
      try {
        posts = JSON.parse(rawBlogs);
      } catch (e) {
        console.error('Failed to parse blog storage for seeding', e);
      }
    }
  }

  // Only fallback to constants if absolutely no blog data in storage
  if (!posts || posts.length === 0) {
    posts = SAMPLE_BLOGS;
  }

  const catSet = new Map<string, string>(); 
  const tagSet = new Map<string, string>(); 

  posts.forEach(p => {
    if (p.category && !catSet.has(p.category)) {
      catSet.set(p.category, slugify(p.category));
    }
    if (Array.isArray(p.tags)) {
      p.tags.forEach((t: string) => {
        if (t && !tagSet.has(t)) tagSet.set(t, slugify(t));
      });
    }
  });

  // Ensure default categories exist if none found
  if (catSet.size === 0) {
    const defaults = ['Foundations', 'Varga Charts', 'Dasha and Timing', 'Remedies', 'Career and Money', 'Nakshatra'];
    defaults.forEach(d => catSet.set(d, slugify(d)));
  }

  const newStore: TaxonomyData = {
    categories: Array.from(catSet.entries()).map(([name, slug], idx) => ({
      id: `cat-${Date.now()}-${idx}`,
      name,
      slug,
      isPublic: true,
      sortOrder: idx
    })),
    tags: Array.from(tagSet.entries()).map(([name, slug], idx) => ({
      id: `tag-${Date.now()}-${idx}`,
      name,
      slug,
      isPublic: true,
      sortOrder: idx
    }))
  };
  
  store = newStore;
  saveStorage();
};

const ensureSeeded = () => {
  if (store) return; // Already loaded

  if (typeof window === 'undefined') {
    store = { categories: [], tags: [] };
    return;
  }

  const raw = localStorage.getItem(ADMIN_TAXONOMY_KEY);
  if (raw) {
    try {
      store = JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse taxonomy store', e);
      seedData();
    }
  } else {
    // If no taxonomy storage, seed it from blogs (or defaults)
    seedData();
  }
  
  // Final safety check
  if (!store) {
    store = { categories: [], tags: [] };
  }
};

const ensureUniqueSlug = (slug: string, items: TaxonomyItem[], excludeId?: string): string => {
  let unique = slug;
  let counter = 1;
  while (items.some(i => i.slug === unique && i.id !== excludeId)) {
    unique = `${slug}-${counter}`;
    counter++;
  }
  return unique;
};

// --- Public API ---

export const listCategories = () => {
  ensureSeeded();
  return [...(store?.categories || [])].sort((a, b) => a.sortOrder - b.sortOrder);
};

export const listPublicCategories = () => {
  return listCategories().filter(c => c.isPublic);
};

export const getCategoryBySlug = (slug: string) => {
  ensureSeeded();
  return store?.categories.find(c => c.slug === slug);
};

export const getCategoryByName = (name: string) => {
  ensureSeeded();
  return store?.categories.find(c => c.name.toLowerCase() === name.toLowerCase());
};

export const getCategoryName = (identifier: string) => {
  ensureSeeded();
  if (!store) return identifier;
  
  let found = store.categories.find(c => c.slug === identifier);
  if (!found) found = store.categories.find(c => c.name.toLowerCase() === identifier.toLowerCase());
  
  return found ? found.name : identifier;
};

export const createCategory = (name: string) => {
  ensureSeeded();
  if (!store) throw new Error('Store not initialized');

  const slug = ensureUniqueSlug(slugify(name), store.categories);
  const newItem: TaxonomyItem = {
    id: `cat-${Date.now()}`,
    name,
    slug,
    isPublic: true,
    sortOrder: store.categories.length
  };
  store.categories.push(newItem);
  saveStorage();
  return newItem;
};

export const updateCategory = (id: string, updates: Partial<TaxonomyItem>) => {
  ensureSeeded();
  if (!store) return;

  const idx = store.categories.findIndex(c => c.id === id);
  if (idx === -1) return;
  
  if (updates.name && !updates.slug) {
    updates.slug = ensureUniqueSlug(slugify(updates.name), store.categories, id);
  } else if (updates.slug) {
    updates.slug = ensureUniqueSlug(slugify(updates.slug), store.categories, id);
  }

  store.categories[idx] = { ...store.categories[idx], ...updates };
  saveStorage();
};

export const deleteCategory = (id: string) => {
  ensureSeeded();
  if (!store) return;
  store.categories = store.categories.filter(c => c.id !== id);
  saveStorage();
};

export const reorderCategories = (ids: string[]) => {
  ensureSeeded();
  if (!store) return;

  const map = new Map(store.categories.map(c => [c.id, c]));
  const reordered: TaxonomyItem[] = [];
  ids.forEach((id, idx) => {
    const item = map.get(id);
    if (item) {
      item.sortOrder = idx;
      reordered.push(item);
      map.delete(id);
    }
  });
  Array.from(map.values()).forEach(item => reordered.push(item));
  
  store.categories = reordered;
  saveStorage();
};

// --- Tags API ---

export const listTags = () => {
  ensureSeeded();
  return [...(store?.tags || [])].sort((a, b) => a.sortOrder - b.sortOrder);
};

export const listPublicTags = () => {
  return listTags().filter(t => t.isPublic);
};

export const getTagBySlug = (slug: string) => {
  ensureSeeded();
  return store?.tags.find(t => t.slug === slug);
}

export const createTag = (name: string) => {
  ensureSeeded();
  if (!store) throw new Error('Store not initialized');

  const slug = ensureUniqueSlug(slugify(name), store.tags);
  const newItem: TaxonomyItem = {
    id: `tag-${Date.now()}`,
    name,
    slug,
    isPublic: true,
    sortOrder: store.tags.length
  };
  store.tags.push(newItem);
  saveStorage();
  return newItem;
};

export const updateTag = (id: string, updates: Partial<TaxonomyItem>) => {
  ensureSeeded();
  if (!store) return;

  const idx = store.tags.findIndex(t => t.id === id);
  if (idx === -1) return;

  if (updates.name && !updates.slug) {
    updates.slug = ensureUniqueSlug(slugify(updates.name), store.tags, id);
  } else if (updates.slug) {
    updates.slug = ensureUniqueSlug(slugify(updates.slug), store.tags, id);
  }

  store.tags[idx] = { ...store.tags[idx], ...updates };
  saveStorage();
};

export const deleteTag = (id: string) => {
  ensureSeeded();
  if (!store) return;
  store.tags = store.tags.filter(t => t.id !== id);
  saveStorage();
};

export const reorderTags = (ids: string[]) => {
  ensureSeeded();
  if (!store) return;

  const map = new Map(store.tags.map(t => [t.id, t]));
  const reordered: TaxonomyItem[] = [];
  ids.forEach((id, idx) => {
    const item = map.get(id);
    if (item) {
      item.sortOrder = idx;
      reordered.push(item);
      map.delete(id);
    }
  });
  Array.from(map.values()).forEach(item => reordered.push(item));
  store.tags = reordered;
  saveStorage();
};
