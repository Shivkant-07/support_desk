import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import dashboardService from '../../services/dashboardService';
import StatCard from '../../components/common/StatCard';
import TicketList from '../../components/tickets/TicketList';
import { useAuth } from '../../context/AuthContext';
import { Ticket, PlusCircle, ArrowRight } from 'lucide-react';

export const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getStats();
      setData(res);
    } catch (err) {
      console.error('Failed to load user dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = data?.stats || {
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="inline-block px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-1">
            User Workspace
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Hello, {user?.name || 'User'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Need assistance or have an issue? Submit a new ticket or track the progress of your existing requests.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to="/user/tickets/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm rounded-xl shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Ticket</span>
          </Link>
          <Link
            to="/user/tickets"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs sm:text-sm rounded-xl transition-colors"
          >
            <span>View My Tickets</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Tickets"
          count={stats.total}
          icon={Ticket}
          color="indigo"
          onClick={() => navigate('/user/tickets')}
        />
      </div>

      {/* Recent Tickets Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Tickets</h2>
            <p className="text-xs text-slate-500">Your most recently updated requests</p>
          </div>
          <Link
            to="/user/tickets"
            className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <TicketList
          tickets={data?.recentTickets || []}
          loading={loading}
          detailBaseUrl="/user/tickets"
          emptyMessage="You haven't submitted any tickets yet."
          onCreateNew={() => navigate('/user/tickets/new')}
        />
      </div>
    </div>
  );
};

export default UserDashboard;
