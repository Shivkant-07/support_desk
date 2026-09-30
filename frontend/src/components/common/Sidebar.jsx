import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  Ticket,
  Users,
  Headphones,
  Tag,
  User,
  LogOut,
  X,
  LifeBuoy,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Build role-specific navigation menu
  const getNavItems = () => {
    if (user?.role === 'admin') {
      return [
        { label: 'Admin Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Ticket Management', to: '/admin/tickets', icon: Ticket },
        { label: 'User Management', to: '/admin/users', icon: Users },
        { label: 'Agent Management', to: '/admin/agents', icon: Headphones },
        { label: 'Categories', to: '/admin/categories', icon: Tag },
        { label: 'My Profile', to: '/profile', icon: User },
      ];
    } else if (user?.role === 'agent') {
      return [
        { label: 'Agent Dashboard', to: '/agent/dashboard', icon: LayoutDashboard },
        { label: 'Assigned Tickets', to: '/agent/tickets', icon: Ticket },
        { label: 'My Profile', to: '/profile', icon: User },
      ];
    } else {
      // User role
      return [
        { label: 'Dashboard', to: '/user/dashboard', icon: LayoutDashboard },
        { label: 'Create Ticket', to: '/user/tickets/new', icon: PlusCircle },
        { label: 'My Tickets', to: '/user/tickets', icon: Ticket },
        { label: 'My Profile', to: '/profile', icon: User },
      ];
    }
  };

  const navItems = getNavItems();

  const content = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-indigo-600/30">
            <LifeBuoy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight leading-tight">
              Support<span className="text-indigo-400">Desk</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              {user?.role ? `${user.role} Portal` : 'Portal'}
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom User Card & Logout */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-xl transition-all border border-slate-700/60"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Persistent) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 z-40 shadow-xl border-r border-slate-800">
        {content}
      </aside>

      {/* Mobile Drawer (Responsive slide-out) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-50">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
