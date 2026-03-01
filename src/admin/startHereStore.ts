
import { slugify } from './utils';

export interface StartHereItem {
  id: string;
  title: string;
  description: string;
  type: "internal_link" | "external_link" | "pdf";
  url: string;
  order: number;
  isPublished: boolean;
}

export interface StartHereBlock {
  id: string;
  title: string;
  slug: string;
  description: string;
  items: StartHereItem[];
  order: number;
  isPublished: boolean;
  updatedAt: number;
}

const STORE_KEY = 'astrokarak_admin_start_here_v1';

const DEFAULT_BLOCKS: StartHereBlock[] = [
  {
    id: 'block-1',
    title: 'Foundations',
    slug: 'foundations',
    description: 'Start with the building blocks of a chart. Learn how the sky looked at the moment of your birth.',
    order: 1,
    isPublished: true,
    updatedAt: Date.now(),
    items: [
      { id: 'item-1-1', title: 'Start Here Guide', description: 'The absolute basics.', type: 'internal_link', url: '/category/start-here', order: 1, isPublished: true },
      { id: 'item-1-2', title: 'Houses (Bhāva)', description: 'Understanding the 12 environments of life.', type: 'internal_link', url: '/category/houses', order: 2, isPublished: true },
      { id: 'item-1-3', title: 'Planets (Graha)', description: 'The forces acting upon you.', type: 'internal_link', url: '/category/planets', order: 3, isPublished: true },
    ]
  },
  {
    id: 'block-2',
    title: 'Core Techniques',
    slug: 'core-techniques',
    description: 'Learn the systems that power prediction and timing.',
    order: 2,
    isPublished: true,
    updatedAt: Date.now(),
    items: [
      { id: 'item-2-1', title: 'Dasha Systems', description: 'Planetary periods.', type: 'internal_link', url: '/category/dasha', order: 1, isPublished: true },
      { id: 'item-2-2', title: 'Transits', description: 'Current planetary movements.', type: 'internal_link', url: '/category/transits', order: 2, isPublished: true },
    ]
  },
  {
    id: 'block-3',
    title: 'Life Topics',
    slug: 'life-topics',
    description: 'Apply astrology to real-life questions.',
    order: 3,
    isPublished: true,
    updatedAt: Date.now(),
    items: [
      { id: 'item-3-1', title: 'Career & Money', description: '10th and 2nd/11th house analysis.', type: 'internal_link', url: '/category/career', order: 1, isPublished: true },
      { id: 'item-3-2', title: 'Relationships', description: 'Navigating the 7th house.', type: 'internal_link', url: '/category/relationships', order: 2, isPublished: true },
    ]
  },
  {
    id: 'block-4',
    title: 'Get Help',
    slug: 'get-help',
    description: 'Personalized guidance from professional astrologers.',
    order: 4,
    isPublished: true,
    updatedAt: Date.now(),
    items: [
      { id: 'item-4-1', title: 'Book Consultation', description: '1:1 Video Sessions.', type: 'internal_link', url: '/consultations', order: 1, isPublished: true },
    ]
  }
];

const getStorage = (): StartHereBlock[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORE_KEY);
  if (!stored) {
    localStorage.setItem(STORE_KEY, JSON.stringify(DEFAULT_BLOCKS));
    return DEFAULT_BLOCKS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Error parsing start here store', e);
    return [];
  }
};

const setStorage = (data: StartHereBlock[]) => {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
};

export const getStartHereBlocks = (): StartHereBlock[] => {
  return getStorage().sort((a, b) => a.order - b.order);
};

export const createBlock = (partial: Partial<StartHereBlock>): StartHereBlock => {
  const blocks = getStartHereBlocks();
  const title = partial.title || 'Untitled Block';
  let slug = slugify(title);
  
  // Ensure unique slug
  let counter = 1;
  while (blocks.some(b => b.slug === slug)) {
    counter++;
    slug = `${slugify(title)}-${counter}`;
  }

  const newBlock: StartHereBlock = {
    id: `block-${Date.now()}`,
    title,
    slug,
    description: partial.description || '',
    items: [],
    order: blocks.length + 1,
    isPublished: partial.isPublished ?? false,
    updatedAt: Date.now()
  };

  setStorage([...blocks, newBlock]);
  return newBlock;
};

export const updateBlock = (id: string, patch: Partial<StartHereBlock>): StartHereBlock | null => {
  const blocks = getStartHereBlocks();
  const idx = blocks.findIndex(b => b.id === id);
  if (idx === -1) return null;

  // Handle slug update uniqueness if title changes and slug isn't manually provided
  let newSlug = patch.slug || blocks[idx].slug;
  if (patch.title && !patch.slug && patch.title !== blocks[idx].title) {
     newSlug = slugify(patch.title);
     let counter = 1;
     while (blocks.some(b => b.slug === newSlug && b.id !== id)) {
        counter++;
        newSlug = `${slugify(patch.title)}-${counter}`;
     }
  }

  const updated = {
    ...blocks[idx],
    ...patch,
    slug: newSlug,
    updatedAt: Date.now()
  };
  blocks[idx] = updated;
  setStorage(blocks);
  return updated;
};

export const deleteBlock = (id: string): void => {
  const blocks = getStartHereBlocks();
  setStorage(blocks.filter(b => b.id !== id));
};

export const reorderBlocks = (idsInOrder: string[]): void => {
  const blocks = getStartHereBlocks();
  const mapped = idsInOrder.map((id, index) => {
    const block = blocks.find(b => b.id === id);
    if (block) {
      return { ...block, order: index + 1 };
    }
    return null;
  }).filter(Boolean) as StartHereBlock[];
  
  // Preserve any blocks not in the list at the end
  const touchedIds = new Set(idsInOrder);
  const untouched = blocks.filter(b => !touchedIds.has(b.id));
  
  setStorage([...mapped, ...untouched]);
};

// Item Operations

export const createItem = (blockId: string, partial: Partial<StartHereItem>): StartHereItem => {
  const blocks = getStartHereBlocks();
  const blockIdx = blocks.findIndex(b => b.id === blockId);
  if (blockIdx === -1) throw new Error('Block not found');

  const newItem: StartHereItem = {
    id: `item-${Date.now()}`,
    title: partial.title || 'New Resource',
    description: partial.description || '',
    type: partial.type || 'internal_link',
    url: partial.url || '',
    order: blocks[blockIdx].items.length + 1,
    isPublished: partial.isPublished ?? true
  };

  blocks[blockIdx].items.push(newItem);
  blocks[blockIdx].updatedAt = Date.now();
  setStorage(blocks);
  return newItem;
};

export const updateItem = (blockId: string, itemId: string, patch: Partial<StartHereItem>): StartHereItem | null => {
  const blocks = getStartHereBlocks();
  const blockIdx = blocks.findIndex(b => b.id === blockId);
  if (blockIdx === -1) return null;

  const items = blocks[blockIdx].items;
  const itemIdx = items.findIndex(i => i.id === itemId);
  if (itemIdx === -1) return null;

  const updatedItem = { ...items[itemIdx], ...patch };
  blocks[blockIdx].items[itemIdx] = updatedItem;
  blocks[blockIdx].updatedAt = Date.now();
  
  setStorage(blocks);
  return updatedItem;
};

export const deleteItem = (blockId: string, itemId: string): void => {
  const blocks = getStartHereBlocks();
  const blockIdx = blocks.findIndex(b => b.id === blockId);
  if (blockIdx === -1) return;

  blocks[blockIdx].items = blocks[blockIdx].items.filter(i => i.id !== itemId);
  blocks[blockIdx].updatedAt = Date.now();
  setStorage(blocks);
};

export const reorderItems = (blockId: string, idsInOrder: string[]): void => {
  const blocks = getStartHereBlocks();
  const blockIdx = blocks.findIndex(b => b.id === blockId);
  if (blockIdx === -1) return;

  const currentItems = blocks[blockIdx].items;
  const mapped = idsInOrder.map((id, index) => {
    const item = currentItems.find(i => i.id === id);
    if (item) return { ...item, order: index + 1 };
    return null;
  }).filter(Boolean) as StartHereItem[];

  blocks[blockIdx].items = mapped;
  blocks[blockIdx].updatedAt = Date.now();
  setStorage(blocks);
};
