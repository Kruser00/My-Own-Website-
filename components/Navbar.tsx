import React, { useState } from 'react';
import { Search, Menu, Settings, X, Film, LogOut, User as UserIcon, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onSearch: (query: string) => void;
  onOpenSettings: () => void;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch, onOpenSettings, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    onNavigate('home');
  };

  return (
    <nav className="bg-filmento-dark border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-4">
             <div className="flex-shrink-0 cursor-pointer" onClick={() => onNavigate('home')}>
               <div className="flex items-center gap-2">
                <div className="bg-filmento-yellow text-black font-bold px-2 py-1 rounded text-xl">F</div>
                <span className="text-xl font-bold text-white tracking-wide">فیلمنتو</span>
               </div>
             </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                className="w-full bg-white text-gray-900 rounded-md py-2 pr-4 pl-10 focus:outline-none focus:ring-2 focus:ring-filmento-yellow"
                placeholder="جستجو در فیلم‌ها و سریال‌ها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute left-2 top-2 text-gray-500 hover:text-filmento-yellow">
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-6">
            <button 
                onClick={() => user ? onNavigate('profile') : onNavigate('login')}
                className="text-gray-300 hover:text-white font-medium flex items-center gap-2"
            >
              <Film size={18} />
              <span>لیست تماشا</span>
            </button>
            <button 
              onClick={onOpenSettings}
              className="text-gray-300 hover:text-white flex items-center gap-2"
            >
              <Settings size={20} />
            </button>

            {user ? (
              <div className="relative">
                <button 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 hover:bg-gray-800 p-1.5 rounded-lg transition"
                >
                    <img 
                        src={user.avatar || "https://ui-avatars.com/api/?background=random"} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full border border-gray-600" 
                    />
                    <span className="text-sm font-medium hidden lg:block">{user.name}</span>
                </button>

                {isProfileMenuOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 border border-gray-700">
                        <button onClick={() => { onNavigate('profile'); setIsProfileMenuOpen(false); }} className="block w-full text-right px-4 py-2 text-sm text-gray-200 hover:bg-gray-700">
                            <UserIcon size={16} className="inline ml-2"/> پروفایل من
                        </button>
                        <button onClick={handleLogout} className="block w-full text-right px-4 py-2 text-sm text-red-400 hover:bg-gray-700">
                            <LogOut size={16} className="inline ml-2"/> خروج
                        </button>
                    </div>
                )}
              </div>
            ) : (
                <button 
                  onClick={() => onNavigate('login')}
                  className="text-sm font-bold text-filmento-dark bg-filmento-yellow px-4 py-1.5 rounded hover:bg-yellow-500 transition"
                >
                  ورود
                </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={onOpenSettings} className="text-gray-300">
                <Settings size={24} />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-filmento-card border-t border-gray-700">
          <div className="px-4 pt-4 pb-2">
             <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                className="w-full bg-gray-700 text-white rounded py-2 pr-4 pl-10 focus:outline-none focus:ring-1 focus:ring-filmento-yellow"
                placeholder="جستجو..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute left-3 top-2.5 text-gray-400">
                <Search size={18} />
              </button>
            </form>
          </div>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#" onClick={() => onNavigate('home')} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700">خانه</a>
            <a href="#" onClick={() => user ? onNavigate('profile') : onNavigate('login')} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700">لیست‌های من</a>
            <div className="border-t border-gray-700 mt-2 pt-2">
                {user ? (
                   <button onClick={handleLogout} className="w-full text-right px-3 py-2 text-red-400 font-bold">خروج</button>
                ) : (
                   <button onClick={() => onNavigate('login')} className="w-full text-right px-3 py-2 text-filmento-yellow font-bold">ورود / ثبت نام</button>
                )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
