
import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Save, X, Tag, Folder
} from 'lucide-react';
import { 
  listCategories, createCategory, updateCategory, deleteCategory, reorderCategories,
  listTags, createTag, updateTag, deleteTag, reorderTags,
  TaxonomyItem 
} from '../taxonomyStore';

const TaxonomyTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'categories' | 'tags'>('categories');
  const [items, setItems] = useState<TaxonomyItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [newItemName, setNewItemName] = useState('');

  const isCat = activeSection === 'categories';

  const refresh = () => {
    setItems(isCat ? listCategories() : listTags());
  };

  useEffect(() => {
    refresh();
    setEditingId(null);
  }, [activeSection]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    if (isCat) createCategory(newItemName);
    else createTag(newItemName);
    setNewItemName('');
    refresh();
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this item? Existing posts may become uncategorized.')) return;
    if (isCat) deleteCategory(id);
    else deleteTag(id);
    refresh();
  };

  const handleTogglePublic = (item: TaxonomyItem) => {
    const update = { isPublic: !item.isPublic };
    if (isCat) updateCategory(item.id, update);
    else updateTag(item.id, update);
    refresh();
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    if (direction === 'up' && index > 0) {
      [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
    } else if (direction === 'down' && index < newItems.length - 1) {
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    }
    const ids = newItems.map(i => i.id);
    if (isCat) reorderCategories(ids);
    else reorderTags(ids);
    refresh();
  };

  const startEdit = (item: TaxonomyItem) => {
    setEditingId(item.id);
    setEditName(item.name);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      if (isCat) updateCategory(editingId, { name: editName });
      else updateTag(editingId, { name: editName });
      setEditingId(null);
      refresh();
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl">
      
      {/* STANDARD PILL TABS DESIGN SYSTEM */}
      <div className="flex bg-gray-100 p-1 rounded-lg w-full sm:w-auto inline-flex mb-8">
        <button
          onClick={() => setActiveSection('categories')}
          className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap flex items-center space-x-2 ${
            isCat 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Folder size={14} />
          <span>Categories</span>
        </button>
        <button
          onClick={() => setActiveSection('tags')}
          className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap flex items-center space-x-2 ${
            !isCat 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Tag size={14} />
          <span>Tags</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-4">
          <form onSubmit={handleAdd} className="flex-grow flex gap-4">
            <input 
              type="text" 
              placeholder={`New ${isCat ? 'Category' : 'Tag'} Name...`}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="flex-grow px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button 
              type="submit"
              className="flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-black transition-all shadow-md"
            >
              <Plus size={14} /> <span>Add Item</span>
            </button>
          </form>
        </div>

        <div className="divide-y divide-gray-100">
          {items.map((item, idx) => (
            <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-4 flex-grow">
                <div className="flex flex-col gap-1">
                  <button 
                    onClick={() => handleMove(idx, 'up')} 
                    disabled={idx === 0}
                    className="text-gray-300 hover:text-amber-700 disabled:opacity-20 transition-colors"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button 
                    onClick={() => handleMove(idx, 'down')} 
                    disabled={idx === items.length - 1}
                    className="text-gray-300 hover:text-amber-700 disabled:opacity-20 transition-colors"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
                
                {editingId === item.id ? (
                  <div className="flex items-center gap-2 w-full max-w-md">
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full focus:ring-2 focus:ring-amber-500 outline-none"
                      autoFocus
                    />
                    <button onClick={saveEdit} className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><Save size={16} /></button>
                    <button onClick={() => setEditingId(null)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><X size={16} /></button>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                    <p className="text-[10px] text-gray-400 font-mono">/{item.slug}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleTogglePublic(item)}
                  title={item.isPublic ? "Public" : "Hidden"}
                  className={`p-2 rounded-lg transition-colors ${item.isPublic ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-100'}`}
                >
                  {item.isPublic ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <div className="h-6 w-px bg-gray-200 mx-2"></div>
                <button onClick={() => startEdit(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Tag size={24} />
              </div>
              <p className="text-gray-500 text-sm font-medium">No items found.</p>
              <p className="text-xs text-gray-400 mt-1">Create one above to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaxonomyTab;
