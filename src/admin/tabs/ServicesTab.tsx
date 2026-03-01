import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  DollarSign, 
  X,
  RotateCcw
} from 'lucide-react';
import { Service } from '../../../types';
import { 
  listServices, 
  upsertService, 
  deleteService, 
  toggleServiceActive,
  seedDefaultServicesIfEmpty 
} from '../servicesStore';

const ServicesTab: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service>>({});

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setServices(listServices());
  };

  const handleCreate = () => {
    setEditingService({
      title: '',
      durationMins: 60,
      priceInr: 1000,
      description: '',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService({ ...service });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      deleteService(id);
      refreshData();
    }
  };

  const handleToggle = (id: string) => {
    toggleServiceActive(id);
    refreshData();
  };

  const handleSeed = () => {
    seedDefaultServicesIfEmpty();
    refreshData();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService.title) return alert("Title required");
    
    upsertService(editingService);
    setIsModalOpen(false);
    refreshData();
  };

  return (
    <div className="animate-fade-in pb-20">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
         <div>
           <h3 className="text-xl font-serif font-bold text-gray-900">Consultation Services</h3>
           <p className="text-sm text-gray-500">Manage the active offerings shown on the public booking page.</p>
         </div>
         <div className="flex gap-3">
           {services.length === 0 && (
             <button onClick={handleSeed} className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-all">
               <RotateCcw size={16} /> <span>Load Defaults</span>
             </button>
           )}
           <button onClick={handleCreate} className="flex items-center space-x-2 px-4 py-2 bg-amber-700 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-amber-800 transition-all shadow-md">
             <Plus size={16} /> <span>Add Service</span>
           </button>
         </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Title</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Duration</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Price (INR)</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                    No services configured. Add one to get started.
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 text-sm">{service.title}</div>
                      <div className="text-xs text-gray-400 line-clamp-1 max-w-xs">{service.description}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1.5 text-gray-400" />
                        {service.durationMins} mins
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      ₹{service.priceInr.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleToggle(service.id)}
                        className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all ${
                          service.isActive 
                          ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                          : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {service.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        <span>{service.isActive ? 'Active' : 'Hidden'}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => handleEdit(service)} className="p-2 text-gray-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(service.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-serif font-bold text-lg text-gray-900">
                {editingService.id ? 'Edit Service' : 'New Service'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Service Title</label>
                <input 
                  type="text" 
                  required
                  value={editingService.title}
                  onChange={(e) => setEditingService({...editingService, title: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="e.g. Detailed Horoscope Analysis"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Duration (Mins)</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      type="number" 
                      required
                      min="1"
                      value={editingService.durationMins}
                      onChange={(e) => setEditingService({...editingService, durationMins: parseInt(e.target.value) || 0})}
                      className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Price (INR)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                    <input 
                      type="number" 
                      required
                      min="0"
                      value={editingService.priceInr}
                      onChange={(e) => setEditingService({...editingService, priceInr: parseInt(e.target.value) || 0})}
                      className="w-full bg-white border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Description</label>
                <textarea 
                  rows={3}
                  value={editingService.description}
                  onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="What is included in this session?"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input 
                  type="checkbox" 
                  id="activeCheck"
                  checked={editingService.isActive}
                  onChange={(e) => setEditingService({...editingService, isActive: e.target.checked})}
                  className="rounded text-amber-700 focus:ring-amber-500 w-4 h-4"
                />
                <label htmlFor="activeCheck" className="text-sm font-medium text-gray-700">Available for Booking</label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-gray-500 text-xs font-bold uppercase tracking-widest hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-amber-700 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-amber-800 shadow-sm transition-colors"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ServicesTab;
