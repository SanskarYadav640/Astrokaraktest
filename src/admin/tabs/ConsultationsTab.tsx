
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  ExternalLink, 
  Copy, 
  Calendar, 
  Clock, 
  DollarSign, 
  ArrowUpRight,
  Filter,
  Search,
  CheckCircle2,
  X,
  Image as ImageIcon,
  Briefcase,
  Table,
  ChevronDown,
  Star,
  MoreHorizontal
} from 'lucide-react';
import { 
  getServices, 
  getAdminBookings, 
  Service, 
  AdminBooking, 
  BookingCategory,
  saveService, 
  deleteService 
} from '../consultationsStore';

interface ConsultationsTabProps {
  bookings?: any[]; // Legacy
}

const ConsultationsTab: React.FC<ConsultationsTabProps> = () => {
  const [activeTab, setActiveTab] = useState<'services' | 'bookings'>('bookings');
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  
  // Bookings Filter State
  const [activeCategory, setActiveCategory] = useState<BookingCategory>('1:1 Calls');
  const [timelineFilter, setTimelineFilter] = useState<'Upcoming' | 'Completed'>('Completed');
  const [searchQuery, setSearchQuery] = useState('');

  // Service Edit State
  const [isEditingService, setIsEditingService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setServices(getServices());
    setBookings(getAdminBookings());
  };

  // --- Filtering Logic ---
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      // 1. Category Filter
      if (b.category !== activeCategory) return false;
      
      // 2. Timeline Filter
      // Note: In a real app we compare dates. Here we mock it by status or just show all for demo if dates are confusing
      const isCompleted = b.status === 'Completed' || b.status === 'Cancelled';
      if (timelineFilter === 'Completed' && !isCompleted) return false;
      if (timelineFilter === 'Upcoming' && isCompleted) return false;

      // 3. Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return b.clientName.toLowerCase().includes(query) || b.title.toLowerCase().includes(query);
      }

      return true;
    });
  }, [bookings, activeCategory, timelineFilter, searchQuery]);

  // Group bookings by date for the list view
  const groupedBookings = useMemo(() => {
    const groups: { [key: string]: AdminBooking[] } = {};
    filteredBookings.forEach(b => {
      if (!groups[b.date]) groups[b.date] = [];
      groups[b.date].push(b);
    });
    return groups;
  }, [filteredBookings]);

  // --- Handlers ---
  const handleCreateNew = () => {
    setIsEditingService({
      id: `srv-${Date.now()}`,
      title: '',
      duration: 60,
      price: 100,
      currency: 'USD',
      description: '',
      isActive: true,
      bookingsCount: 0,
      image: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (service: Service) => {
    setIsEditingService({ ...service });
    setIsModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditingService) {
      saveService(isEditingService);
      refreshData();
      setIsModalOpen(false);
    }
  };

  const handleDeleteService = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      deleteService(id);
      refreshData();
    }
  };

  // --- Helper Components for the Topmate Style ---
  const CategoryPill = ({ label }: { label: BookingCategory }) => (
    <button
      onClick={() => setActiveCategory(label)}
      className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all border ${
        activeCategory === label
          ? 'border-amber-900 text-amber-900 bg-amber-50/50 shadow-sm font-bold'
          : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="animate-fade-in pb-20">
      
      {/* Header & Tabs */}
      <div className="flex flex-col gap-8 mb-10">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          <div>
             <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Management</h2>
             <p className="text-gray-500">Overview of your offerings and global booking history.</p>
          </div>
          <div className="flex items-center space-x-4">
             <button
              onClick={() => setActiveTab('services')}
              className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === 'services' ? 'bg-gray-900 text-white shadow-lg' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
             >
               Services
             </button>
             <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === 'bookings' ? 'bg-gray-900 text-white shadow-lg' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
             >
               Bookings
             </button>
          </div>
        </div>
      </div>

      {/* --- SERVICES VIEW --- */}
      {activeTab === 'services' && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-xl font-serif font-bold text-gray-900">Active Offerings</h3>
             <button onClick={handleCreateNew} className="flex items-center space-x-2 px-4 py-2 bg-amber-700 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-amber-800 transition-all">
               <Plus size={16} /> <span>New Service</span>
             </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all group flex flex-col">
                <div className="relative h-40 bg-gray-100 overflow-hidden">
                  {service.image ? (
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-amber-50 text-amber-200">
                      <Calendar size={48} />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(service)} className="p-2 bg-white/90 backdrop-blur rounded-full text-gray-700 hover:text-amber-700 shadow-sm">
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="font-bold text-lg text-gray-900 mb-1 leading-tight line-clamp-2">{service.title}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4 h-8">{service.description}</p>
                  <div className="mt-auto flex items-end justify-between border-t border-gray-50 pt-4">
                    <div>
                      <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Price</span>
                      <span className="text-lg font-bold text-gray-900">${service.price}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Duration</span>
                      <span className="text-sm font-medium text-gray-700 flex items-center justify-end">
                        <Clock size={12} className="mr-1" /> {service.duration}m
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- BOOKINGS VIEW (Topmate Style) --- */}
      {activeTab === 'bookings' && (
        <div className="animate-fade-in space-y-8">
          
          {/* 1. Category Pills */}
          <div className="flex flex-wrap gap-3">
            <CategoryPill label="1:1 Calls" />
            <CategoryPill label="Webinars" />
            <CategoryPill label="eBooks" />
            <CategoryPill label="Packages" />
          </div>

          {/* 2. Timeline Tabs */}
          <div className="flex items-center space-x-8 border-b border-gray-200">
            {['Upcoming', 'Completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setTimelineFilter(tab as any)}
                className={`pb-3 text-sm font-bold transition-all border-b-2 ${
                  timelineFilter === tab
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 3. Bookings List */}
          <div className="space-y-12">
            {Object.entries(groupedBookings).length > 0 ? (
              Object.entries(groupedBookings).map(([date, items]) => (
                <div key={date}>
                  {/* Date Header */}
                  <h4 className="text-lg font-serif font-bold text-gray-600 mb-6">{date}</h4>
                  
                  {/* Items Grid */}
                  <div className="space-y-6">
                    {items.map((booking) => (
                      <div key={booking.id} className="bg-white rounded-xl border border-gray-200 p-0 flex flex-col md:flex-row overflow-hidden shadow-sm hover:shadow-md transition-all">
                        
                        {/* Main Content Area */}
                        <div className="flex-grow p-6 md:p-8 md:border-r border-gray-100 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-4">
                              <span className="text-sm text-gray-500 font-medium">
                                {booking.startTime && booking.endTime 
                                  ? `${booking.startTime} - ${booking.endTime}`
                                  : 'Flexible Timing'}
                              </span>
                              <span className="bg-amber-700 text-white text-xs font-bold px-3 py-1 rounded-full">
                                {booking.currency === 'INR' ? '₹' : '$'}{booking.amount.toLocaleString()}
                              </span>
                            </div>
                            
                            <div className="mb-6">
                              <h3 className="text-lg font-bold text-gray-900 mb-1">{booking.clientName}</h3>
                              <p className="text-sm text-gray-500">{booking.title}</p>
                              {booking.stats && (
                                <p className="text-xs text-gray-400 mt-2">
                                  {booking.stats.sales} Participants • {booking.stats.followers || 0} Followers
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wide">
                              <CheckCircle2 size={12} className="mr-1.5" />
                              {booking.status}
                            </span>
                            
                            <div className="flex-grow"></div>

                            <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-xs font-bold border border-gray-200 transition-colors flex items-center">
                              More Actions <ChevronDown size={14} className="ml-1" />
                            </button>
                            
                            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors shadow-sm">
                              {activeCategory.includes('Product') ? 'View Sales' : 'Testimonial'}
                            </button>
                          </div>
                        </div>

                        {/* Right Summary Panel (Desktop Only) */}
                        <div className="w-full md:w-72 bg-gray-50/50 p-6 flex flex-col justify-center gap-4 text-sm">
                          <div className="flex justify-between items-center text-gray-900 font-bold mb-2">
                            <span>Price Breakdown</span>
                            <button className="text-gray-400 hover:text-gray-600"><X size={16}/></button>
                          </div>
                          
                          <div className="flex justify-between text-gray-500 text-xs">
                            <span>Base Price</span>
                            <span>{booking.currency === 'INR' ? '₹' : '$'}{booking.amount.toLocaleString()}</span>
                          </div>
                          
                          {activeCategory.includes('Product') && (
                             <div className="flex justify-between text-gray-500 text-xs">
                               <span>Platform Fee</span>
                               <span className="text-red-400">- {booking.currency === 'INR' ? '₹' : '$'}{Math.round(booking.amount * 0.05)}</span>
                             </div>
                          )}

                          <div className="border-t border-gray-200 my-2"></div>
                          
                          <div className="flex justify-between font-bold text-gray-900">
                            <span>Total</span>
                            <span>{booking.currency === 'INR' ? '₹' : '$'}{booking.amount.toLocaleString()}</span>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <Calendar size={32} />
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">No {timelineFilter.toLowerCase()} bookings found.</h3>
                <p className="text-gray-500 text-sm">No records for {activeCategory} in this period.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Service Editor Modal (Reused) */}
      {isModalOpen && isEditingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white px-8 py-5 border-b border-gray-100 flex justify-between items-center z-10">
              <h3 className="font-serif font-bold text-xl text-gray-900">
                {isEditingService.title ? 'Edit Service' : 'New Service'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveService} className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Service Title</label>
                    <input 
                      type="text" 
                      required
                      value={isEditingService.title}
                      onChange={(e) => setIsEditingService({...isEditingService, title: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Duration (Minutes)</label>
                    <input 
                      type="number" 
                      required
                      value={isEditingService.duration}
                      onChange={(e) => setIsEditingService({...isEditingService, duration: parseInt(e.target.value)})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                   <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Price (USD)</label>
                   <div className="relative">
                     <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                     <input 
                      type="number" 
                      required
                      value={isEditingService.price}
                      onChange={(e) => setIsEditingService({...isEditingService, price: parseInt(e.target.value)})}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                   </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Description</label>
                  <textarea 
                    rows={3}
                    value={isEditingService.description}
                    onChange={(e) => setIsEditingService({...isEditingService, description: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="What will the client receive?"
                  />
                </div>

                <div>
                   <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Cover Image URL</label>
                   <div className="flex gap-4">
                     <input 
                        type="text" 
                        value={isEditingService.image}
                        onChange={(e) => setIsEditingService({...isEditingService, image: e.target.value})}
                        className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                        placeholder="https://..."
                      />
                      <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                        {isEditingService.image ? (
                          <img src={isEditingService.image} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={18} /></div>
                        )}
                      </div>
                   </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => handleDeleteService(isEditingService.id)}
                  className="px-4 py-2 text-red-500 text-xs font-bold uppercase tracking-widest hover:bg-red-50 rounded-lg transition-colors"
                >
                  Delete
                </button>
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 text-gray-500 text-xs font-bold uppercase tracking-widest hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-3 bg-amber-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-amber-800 shadow-md transition-colors"
                  >
                    Save Service
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ConsultationsTab;
