
import React from 'react';
import { 
  CheckCircle, 
  Calendar, 
  FileText, 
  AlertCircle, 
  MoreVertical, 
  Clock 
} from 'lucide-react';
import { Booking } from '../adminData';
import { BlogPost } from '../../../types';

interface OverviewTabProps {
  blogs: BlogPost[];
  bookings: Booking[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ blogs, bookings }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: '$12,450', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Active Bookings', value: '24', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'New Blog Posts', value: '3', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'System Health', value: 'Optimum', icon: AlertCircle, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Recent Bookings</h3>
            <button className="text-xs text-amber-700 font-bold uppercase tracking-widest">View All</button>
          </div>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold">{booking.name.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{booking.name}</p>
                    <p className="text-xs text-gray-500">{booking.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-900">{booking.date}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    booking.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 
                    booking.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Site Performance</h3>
            <MoreVertical size={16} className="text-gray-400" />
          </div>
          <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <div className="text-center">
              <Clock size={32} className="text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-400 italic">Traffic Chart Under Maintenance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
