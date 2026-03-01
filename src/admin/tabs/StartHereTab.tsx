
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Check, 
  X, 
  Map, 
  Link as LinkIcon, 
  FileText, 
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  getStartHereBlocks, 
  createBlock, 
  updateBlock, 
  deleteBlock, 
  reorderBlocks,
  createItem,
  updateItem,
  deleteItem,
  reorderItems,
  StartHereBlock,
  StartHereItem
} from '../startHereStore';

const StartHereTab: React.FC = () => {
  const [blocks, setBlocks] = useState<StartHereBlock[]>([]);
  const [editingBlock, setEditingBlock] = useState<StartHereBlock | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Item Editing State
  const [editingItem, setEditingItem] = useState<Partial<StartHereItem> | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setBlocks(getStartHereBlocks());
  };

  // --- Block Handlers ---

  const handleCreateBlock = () => {
    setEditingBlock({
      id: '',
      title: '',
      slug: '',
      description: '',
      items: [],
      order: 0,
      isPublished: true,
      updatedAt: 0
    });
    setIsModalOpen(true);
  };

  const handleEditBlock = (block: StartHereBlock) => {
    setEditingBlock({ ...block });
    setIsModalOpen(true);
  };

  const handleSaveBlock = () => {
    if (!editingBlock || !editingBlock.title.trim()) return;

    if (editingBlock.id) {
      updateBlock(editingBlock.id, {
        title: editingBlock.title,
        description: editingBlock.description,
        isPublished: editingBlock.isPublished
      });
    } else {
      createBlock({
        title: editingBlock.title,
        description: editingBlock.description,
        isPublished: editingBlock.isPublished
      });
    }
    setIsModalOpen(false);
    loadData();
  };

  const handleDeleteBlock = (id: string) => {
    if (confirm('Delete this block and all its items?')) {
      deleteBlock(id);
      loadData();
    }
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    if (direction === 'up' && index > 0) {
      [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
    } else if (direction === 'down' && index < newBlocks.length - 1) {
      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
    }
    reorderBlocks(newBlocks.map(b => b.id));
    loadData();
  };

  // --- Item Handlers ---

  const handleAddItem = () => {
    setEditingItem({
      title: '',
      description: '',
      type: 'internal_link',
      url: '',
      isPublished: true
    });
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item: StartHereItem) => {
    setEditingItem({ ...item });
    setIsItemModalOpen(true);
  };

  const handleSaveItem = () => {
    if (!editingBlock || !editingItem || !editingItem.title?.trim()) return;

    if (editingItem.id) {
      // Update existing in store
      updateItem(editingBlock.id, editingItem.id, editingItem);
      
      // Update local state to reflect changes immediately in the modal list
      setEditingBlock(prev => {
        if (!prev) return null;
        const newItems = prev.items.map(i => i.id === editingItem.id ? { ...i, ...editingItem } as StartHereItem : i);
        return { ...prev, items: newItems };
      });
    } else {
      // Create new
      const newItem = createItem(editingBlock.id, editingItem);
      // Update local state
      setEditingBlock(prev => {
        if (!prev) return null;
        return { ...prev, items: [...prev.items, newItem] };
      });
    }
    setIsItemModalOpen(false);
    // Don't reload full data here to keep the block modal open and fresh
    // Actually, we should probably sync if we want the block modal list to be accurate order-wise
  };

  const handleDeleteItem = (itemId: string) => {
    if (!editingBlock) return;
    deleteItem(editingBlock.id, itemId);
    setEditingBlock(prev => {
      if (!prev) return null;
      return { ...prev, items: prev.items.filter(i => i.id !== itemId) };
    });
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (!editingBlock) return;
    const newItems = [...editingBlock.items];
    if (direction === 'up' && index > 0) {
      [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
    } else if (direction === 'down' && index < newItems.length - 1) {
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    }
    // Update store
    reorderItems(editingBlock.id, newItems.map(i => i.id));
    // Update local state
    setEditingBlock({ ...editingBlock, items: newItems });
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center space-x-3 text-amber-900">
          <Map size={24} />
          <div>
            <h2 className="font-serif font-bold text-xl">Roadmap Builder</h2>
            <p className="text-xs text-gray-500">Manage the learning path steps.</p>
          </div>
        </div>
        <button 
          onClick={handleCreateBlock}
          className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-black transition-all"
        >
          <Plus size={14} />
          <span>New Step</span>
        </button>
      </div>

      <div className="space-y-4">
        {blocks.map((block, index) => (
          <div key={block.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-start space-x-4">
                <div className="bg-amber-50 text-amber-700 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                  {index + 1}
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="font-bold text-gray-900 text-lg">{block.title}</h3>
                    {!block.isPublished && (
                      <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest">Draft</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1 max-w-2xl">{block.description}</p>
                  <div className="mt-3 flex items-center space-x-4 text-xs text-gray-400 font-medium">
                    <span>{block.items.length} Resources</span>
                    <span>Slug: {block.slug}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => moveBlock(index, 'up')} className="p-2 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600" disabled={index === 0}><MoveUp size={16}/></button>
                <button onClick={() => moveBlock(index, 'down')} className="p-2 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600" disabled={index === blocks.length - 1}><MoveDown size={16}/></button>
                <div className="w-px h-6 bg-gray-200 mx-2"></div>
                <button onClick={() => handleEditBlock(block)} className="p-2 hover:bg-blue-50 rounded text-gray-400 hover:text-blue-600"><Edit2 size={16}/></button>
                <button onClick={() => handleDeleteBlock(block.id)} className="p-2 hover:bg-red-50 rounded text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
              </div>
            </div>
          </div>
        ))}
        {blocks.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No roadmap steps found. Create one to get started.</div>
        )}
      </div>

      {/* Block Modal */}
      {isModalOpen && editingBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center z-10">
              <h2 className="font-serif font-bold text-xl text-gray-900">
                {editingBlock.id ? 'Edit Step' : 'New Step'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-8 flex-grow overflow-y-auto">
              {/* Block Details */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Step Title</label>
                    <input 
                      type="text" 
                      value={editingBlock.title}
                      onChange={(e) => setEditingBlock({...editingBlock, title: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      placeholder="e.g. Core Foundations"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Visibility</label>
                    <div className="flex items-center space-x-4 h-[46px]">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={editingBlock.isPublished}
                          onChange={(e) => setEditingBlock({...editingBlock, isPublished: e.target.checked})}
                          className="w-5 h-5 text-amber-700 rounded focus:ring-amber-500"
                        />
                        <span className="text-sm font-bold text-gray-700">Published Publicly</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Description</label>
                  <textarea 
                    value={editingBlock.description}
                    onChange={(e) => setEditingBlock({...editingBlock, description: e.target.value})}
                    rows={2}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="Brief explanation of this learning phase..."
                  />
                </div>
              </div>

              {/* Items List */}
              {editingBlock.id && (
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-amber-900">Resources / Links</h3>
                    <button 
                      onClick={handleAddItem}
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center bg-amber-50 px-3 py-1.5 rounded-lg"
                    >
                      <Plus size={12} className="mr-1" /> Add Resource
                    </button>
                  </div>

                  <div className="space-y-2">
                    {editingBlock.items.map((item, idx) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-lg group">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-white rounded text-gray-400">
                            {item.type === 'pdf' ? <FileText size={16}/> : item.type === 'external_link' ? <ExternalLink size={16}/> : <LinkIcon size={16}/>}
                          </div>
                          <div>
                            <p className={`text-sm font-bold ${item.isPublished ? 'text-gray-900' : 'text-gray-400'}`}>{item.title}</p>
                            <p className="text-xs text-gray-500 truncate max-w-xs">{item.url}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => moveItem(idx, 'up')} className="p-1.5 text-gray-400 hover:bg-white hover:text-gray-600 rounded" disabled={idx === 0}><MoveUp size={14}/></button>
                          <button onClick={() => moveItem(idx, 'down')} className="p-1.5 text-gray-400 hover:bg-white hover:text-gray-600 rounded" disabled={idx === editingBlock.items.length - 1}><MoveDown size={14}/></button>
                          <div className="w-px h-4 bg-gray-300 mx-1"></div>
                          <button onClick={() => handleEditItem(item)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded"><Edit2 size={14}/></button>
                          <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded"><Trash2 size={14}/></button>
                        </div>
                      </div>
                    ))}
                    {editingBlock.items.length === 0 && (
                      <div className="text-center py-6 text-gray-400 text-xs italic bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        No resources added yet.
                      </div>
                    )}
                  </div>
                </div>
              )}
              {!editingBlock.id && (
                <div className="p-4 bg-amber-50 text-amber-800 text-sm rounded-lg text-center">
                  Save the block first to add resources.
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end space-x-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-200 rounded-lg transition-all">Cancel</button>
              <button onClick={handleSaveBlock} className="px-8 py-3 bg-amber-700 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-amber-800 shadow-md transition-all">Save Step</button>
            </div>
          </div>
        </div>
      )}

      {/* Item Modal */}
      {isItemModalOpen && editingItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl p-6">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center">
              {editingItem.id ? <Edit2 size={16} className="mr-2"/> : <Plus size={16} className="mr-2"/>}
              {editingItem.id ? 'Edit Resource' : 'Add Resource'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Title</label>
                <input 
                  type="text" 
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Type</label>
                <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
                  {(['internal_link', 'external_link', 'pdf'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setEditingItem({...editingItem, type: t})}
                      className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
                        editingItem.type === t ? 'bg-white text-amber-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {t.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">URL / Path</label>
                <input 
                  type="text" 
                  value={editingItem.url}
                  onChange={(e) => setEditingItem({...editingItem, url: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-amber-500 outline-none font-mono text-xs"
                  placeholder={editingItem.type === 'internal_link' ? '/category/planets' : 'https://...'}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Description (Optional)</label>
                <input 
                  type="text" 
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input 
                  type="checkbox" 
                  id="pubItem"
                  checked={editingItem.isPublished}
                  onChange={(e) => setEditingItem({...editingItem, isPublished: e.target.checked})}
                  className="w-4 h-4 text-amber-700 rounded focus:ring-amber-500"
                />
                <label htmlFor="pubItem" className="text-sm font-medium text-gray-700">Published</label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button onClick={() => setIsItemModalOpen(false)} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleSaveItem} className="px-6 py-2 bg-amber-700 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-amber-800">Save</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StartHereTab;
