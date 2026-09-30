import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { LifeBuoy } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/15 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
        <Link to="/login" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30">
            <LifeBuoy className="w-7 h-7" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Support<span className="text-indigo-400">Desk</span>
          </span>
        </Link>
      </div>

      {/* Main Form Box */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 z-10">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
