import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Mail, 
  Clock, 
  Phone,
  MessageSquare,
  Check,
  X,
  Filter,
  Trash2
} from 'lucide-react';
import { Booking, BookingStatus } from '../../../types';
import { 
  listBookings, 
  updateBookingStatus, 
  deleteBooking 
} from '../bookingsStore';

const BookingsTab: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<'All' | BookingStatus>('All');

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setBookings(listBookings());
  };

  const filteredBookings = useMemo(() => {
    if (statusFilter === 'All') return bookings;
    return bookings.filter(b => b.status === statusFilter);
  }, [bookings, statusFilter]);

  const handleStatusChange = (id: string, newStatus: BookingStatus) => {
    updateBookingStatus(id, newStatus);
    refreshData();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this booking record?')) {
      deleteBooking(id);
      refreshData();
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'confirmed': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'done': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="animate-fade-in pb-20">
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
         <h3 className="text-xl font-serif font-bold text-gray-900">Client Bookings</h3>
         
         <div className="flex bg-gray-100 p-1 rounded-lg">
            {['All', 'new', 'confirmed', 'done', 'cancelled'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s as any)}
                className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all capitalize ${
                  statusFilter === s 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {s}
              </button>
            ))}
         </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-400">
            <Calendar size={32} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium">No bookings found for this filter.</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all group">
              <div className="flex flex-col md:flex-row gap-6">
                
                {/* Date Box */}
                <div className="md:w-32 shrink-0 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0">
                   <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Preferred</div>
                   <div className="font-serif text-lg font-bold text-gray-900">{booking.preferredDate}</div>
                   <div className="text-sm font-medium text-amber-700">{booking.preferredTime}</div>
                </div>

                {/* Main Content */}
                <div className="flex-grow space-y-3">
                   <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-1">{booking.serviceTitleSnapshot}</h4>
                        <div className="flex items-center text-xs text-gray-500 space-x-3">
                           <span className="font-bold text-amber-700">₹{booking.servicePriceSnapshot.toLocaleString()}</span>
                           <span>•</span>
                           <span className="flex items-center"><Clock size={12} className="mr-1"/> Booked {new Date(booking.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="relative group/status">
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border cursor-pointer ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                        
                        {/* Status Dropdown on Hover */}
                        <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden hidden group-hover/status:block z-10">
                           {['new', 'confirmed', 'done', 'cancelled'].map((s) => (
                             <button
                               key={s}
                               onClick={() => handleStatusChange(booking.id, s as BookingStatus)}
                               className="block w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 capitalize"
                             >
                               {s}
                             </button>
                           ))}
                        </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <div>
                         <div className="flex items-center space-x-2 text-sm font-bold text-gray-900 mb-1">
                            <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">{booking.name.charAt(0)}</span>
                            <span>{booking.name}</span>
                         </div>
                         <div className="flex items-center space-x-2 text-xs text-gray-500 ml-8">
                            <Mail size={12} /> <span>{booking.email}</span>
                         </div>
                         <div className="flex items-center space-x-2 text-xs text-gray-500 ml-8 mt-1">
                            <Phone size={12} /> <span>{booking.whatsapp}</span>
                         </div>
                      </div>
                      
                      {booking.message && (
                        <div className="text-xs text-gray-600 border-l-2 border-gray-200 pl-3 italic">
                           "{booking.message}"
                        </div>
                      )}
                   </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col justify-end gap-2 md:w-10 md:border-l border-gray-100 md:pl-4">
                   <button 
                     onClick={() => handleDelete(booking.id)}
                     className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                     title="Delete"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingsTab;
