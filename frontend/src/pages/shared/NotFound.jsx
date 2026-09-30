import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'agent') return '/agent/dashboard';
    if (user?.role === 'user') return '/user/dashboard';
    return '/login';
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-2xl mb-4 ring-8 ring-indigo-50/50">
        404
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
        Page Not Found
      </h1>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">
        The page you are looking for doesn&apos;t exist, has been moved, or you don&apos;t have
        permission to access it.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>

        <Link
          to={getDashboardPath()}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
