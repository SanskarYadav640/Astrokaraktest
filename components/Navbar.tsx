
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Trophy, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Start Here', path: '/start-here' },
    { name: 'Consultations', path: '/consultations' },
    { name: 'Ebooks', path: '/shop' },
    { name: 'Courses', path: '/courses' },
    { name: 'Blog', path: '/blog' },
    { name: 'Community', path: '/community' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <span className="text-2xl font-serif font-bold tracking-tight text-gray-900 group-hover:text-amber-700 transition-colors">
                ASTROKARAK
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path) ? 'text-amber-700' : 'text-gray-600 hover:text-amber-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="flex items-center space-x-4 pl-4 border-l border-gray-100">
              {isLoggedIn && user ? (
                <div className="flex items-center space-x-6">
                  <Link to="/profile" className="group flex items-center space-x-2">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 group-hover:border-amber-700 transition-all">
                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                      {user.tier === 'Student' && (
                        <div className="absolute -top-1 -right-1 bg-amber-700 text-white p-0.5 rounded-full ring-2 ring-white">
                          <Trophy size={8} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                        {user.tier === 'Student' ? 'Student Portal' : 'Member Hub'}
                      </span>
                      <span className="text-[10px] font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                        My Dashboard
                      </span>
                    </div>
                  </Link>
                  <button onClick={handleLogout} className="text-gray-400 hover:text-red-600 transition-colors">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link 
                  to="/profile"
                  className="text-sm font-medium text-amber-700 hover:text-amber-800"
                >
                  Member Login
                </Link>
              )}
              
              <Link
                to="/consultations"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-700 hover:bg-amber-800 transition-all shadow-sm"
              >
                Book Session
              </Link>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 py-4 px-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.path) ? 'text-amber-700 bg-amber-50' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {isLoggedIn ? (
            <>
              <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-amber-700 bg-amber-50">
                {user?.tier === 'Student' ? 'Student Portal' : 'Member Hub'}
              </Link>
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600">
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-amber-700">
              Member Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
