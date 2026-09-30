import React, { useState, useRef, useEffect } from 'react';
import { Menu, User, LogOut, ChevronDown, ShieldCheck, Headphones, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export const Navbar = ({ onToggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3" /> Admin
          </span>
        );
      case 'agent':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
            <Headphones className="w-3 h-3" /> Agent
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            <UserCheck className="w-3 h-3" /> User
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6">
      {/* Left: Mobile hamburger & Branding title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
            S
          </div>
          <span className="font-bold text-slate-900 tracking-tight text-lg hidden sm:inline">
            Support<span className="text-indigo-600">Desk</span>
          </span>
        </div>
      </div>

      {/* Right: Role & User Avatar Menu */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center text-sm ring-2 ring-indigo-500/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-800 line-clamp-1 max-w-[130px]">
                  {user?.name}
                </span>
                {getRoleBadge(user?.role)}
              </div>
              <span className="text-[11px] text-slate-400 block truncate max-w-[150px]">
                {user?.email}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {/* Dropdown Popover */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden py-1 animate-in fade-in duration-100">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                <p className="text-xs text-slate-500 font-medium">Signed in as</p>
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                <div className="mt-1">{getRoleBadge(user?.role)}</div>
              </div>

              <div className="p-1">
                <Link
                  to="/profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/60 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-slate-500" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Direct Quick Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-900 border border-slate-200 rounded-xl transition-all shadow-xs"
          title="Sign out and return to Login"
        >
          <LogOut className="w-3.5 h-3.5 text-slate-500" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
