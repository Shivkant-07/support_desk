import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import dashboardService from '../../services/dashboardService';
import StatCard from '../../components/common/StatCard';
import TicketList from '../../components/tickets/TicketList';
import { useAuth } from '../../context/AuthContext';
import { Ticket, ArrowRight } from 'lucide-react';

export const AgentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getStats();
      setData(res);
    } catch (err) {
      console.error('Error fetching agent dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = data?.stats || {
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  };

  return (
    <div className="space-y-6">
      {/* Agent Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-1">
            Agent Operations Center
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user?.name || 'Agent'} 🎧
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your assigned support queue and track ticket resolutions.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to="/agent/tickets"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm rounded-xl shadow-sm transition-colors"
          >
            <span>View All Assigned Tickets</span>
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
          onClick={() => navigate('/agent/tickets')}
        />
      </div>

      {/* Recent Assigned Tickets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recently Updated Workload</h2>
            <p className="text-xs text-slate-500">Tickets requiring your response or active progress</p>
          </div>
          <Link
            to="/agent/tickets"
            className="text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 hover:underline"
          >
            <span>View All Assigned</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <TicketList
          tickets={data?.recentTickets || []}
          loading={loading}
          detailBaseUrl="/agent/tickets"
          emptyMessage="No assigned tickets in your queue currently."
        />
      </div>
    </div>
  );
};

export default AgentDashboard;
