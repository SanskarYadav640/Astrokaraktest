
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  BarChart3,
  Settings, 
  LogOut, 
  Plus, 
  Search,
  ShoppingBag,
  ShoppingCart,
  Users,
  GraduationCap,
  MessageSquare,
  Image as ImageIcon,
  Tags,
  Map,
  Menu,
  X,
  Briefcase
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: 'overview' | 'blogs' | 'taxonomy' | 'starthere' | 'services' | 'bookings' | 'members' | 'analytics' | 'settings';
  setActiveTab: (
    tab: 'overview' | 'blogs' | 'taxonomy' | 'starthere' | 'services' | 'bookings' | 'members' | 'analytics' | 'settings',
  ) => void;
  onLogout: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  adminSessionLabel?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  onLogout,
  searchQuery = '',
  setSearchQuery,
  adminSessionLabel = ''
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const SidebarLink = ({ 
    active, 
    onClick, 
    icon: Icon, 
    label, 
    disabled = false 
  }: { 
    active?: boolean; 
    onClick?: () => void; 
    icon: any; 
    label: string; 
    disabled?: boolean;
  }) => (
    <button 
      onClick={() => {
        if (!disabled && onClick) {
          onClick();
          setIsSidebarOpen(false);
        }
      }}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all ${
        disabled 
          ? 'text-gray-600 cursor-not-allowed opacity-70' 
          : active 
            ? 'bg-amber-700 text-white' 
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon size={18} />
        <span>{label}</span>
      </div>
      {disabled && (
        <span className="text-[8px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
          Soon
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row relative overflow-x-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col h-full overflow-y-auto transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
          md:translate-x-0 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <Link to="/" title="Back to Public Site" className="group">
            <h2 className="text-xl font-serif font-bold tracking-tight group-hover:text-amber-500 transition-colors">ASTROKARAK</h2>
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest group-hover:text-white transition-colors">Admin Dashboard</span>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-grow p-4 space-y-1 mt-4">
          <SidebarLink 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')} 
            icon={LayoutDashboard} 
            label="Overview" 
          />
          <SidebarLink 
            active={activeTab === 'blogs'} 
            onClick={() => setActiveTab('blogs')} 
            icon={FileText} 
            label="Manage Blogs" 
          />
          <SidebarLink 
            active={activeTab === 'taxonomy'} 
            onClick={() => setActiveTab('taxonomy')} 
            icon={Tags} 
            label="Categories & Tags" 
          />
          <SidebarLink 
            active={activeTab === 'starthere'} 
            onClick={() => setActiveTab('starthere')} 
            icon={Map} 
            label="Start Here" 
          />
          <div className="my-2 border-t border-gray-800"></div>
          <SidebarLink 
            active={activeTab === 'bookings'} 
            onClick={() => setActiveTab('bookings')} 
            icon={Calendar} 
            label="Bookings" 
          />
          <SidebarLink 
            active={activeTab === 'services'} 
            onClick={() => setActiveTab('services')} 
            icon={Briefcase} 
            label="Services" 
          />
          <SidebarLink
            active={activeTab === 'members'}
            onClick={() => setActiveTab('members')}
            icon={Users}
            label="Member Management"
          />
          <SidebarLink
            active={activeTab === 'analytics'}
            onClick={() => setActiveTab('analytics')}
            icon={BarChart3}
            label="Analytics"
          />
          
          {/* Disabled Items */}
          <div className="pt-4 pb-2">
            <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">Modules</p>
            <SidebarLink icon={ShoppingBag} label="Products" disabled />
            <SidebarLink icon={ShoppingCart} label="Orders" disabled />
            <SidebarLink icon={GraduationCap} label="Courses" disabled />
            <SidebarLink icon={MessageSquare} label="Community" disabled />
            <SidebarLink icon={ImageIcon} label="Media" disabled />
          </div>

          <SidebarLink 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
            icon={Settings} 
            label="Site Settings" 
          />
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-gray-400 hover:text-white transition-all"
          >
            <LogOut size={18} />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 min-w-0 w-full">
        
        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-10 gap-4">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 capitalize truncate">
                {
                  activeTab === 'starthere' ? 'Start Here Manager'
                  : activeTab === 'taxonomy' ? 'Categories & Tags'
                  : activeTab === 'members' ? 'Member Management'
                  : activeTab === 'analytics' ? 'Analytics'
                  : activeTab
                }
              </h1>
              <p className="text-sm text-gray-500 hidden sm:block">Welcome back, Administrator</p>
              {adminSessionLabel ? (
                <p className="text-xs text-emerald-700 font-semibold mt-1">{adminSessionLabel}</p>
              ) : null}
            </div>
          </div>
          
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>
            <button className="bg-amber-700 text-white p-2 rounded-lg hover:bg-amber-800 shadow-sm shrink-0">
              <Plus size={20} />
            </button>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
