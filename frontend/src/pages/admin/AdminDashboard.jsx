import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import dashboardService from '../../services/dashboardService';
import StatCard from '../../components/common/StatCard';
import TicketList from '../../components/tickets/TicketList';
import AssignTicketModal from '../../components/tickets/AssignTicketModal';
import ticketService from '../../services/ticketService';
import { Users, Headphones, Ticket, ArrowRight, AlertTriangle } from 'lucide-react';

export const AdminDashboard = () => {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Assign Modal state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [assignSubmitting, setAssignSubmitting] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getStats();
      setData(res);
    } catch (err) {
      console.error('Error fetching admin dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignSubmit = async (agentId) => {
    if (!selectedTicket) return;
    try {
      setAssignSubmitting(true);
      await ticketService.assignTicket(selectedTicket._id, agentId);
      setAssignModalOpen(false);
      setSelectedTicket(null);
      fetchStats();
    } catch (err) {
      alert(err.message || 'Failed to assign ticket');
    } finally {
      setAssignSubmitting(false);
    }
  };

  const stats = data?.stats || {
    totalUsers: 0,
    totalAgents: 0,
    totalTickets: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    reopened: 0,
    highPriorityCount: 0,
  };

  const agentWorkload = data?.agentWorkload || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="inline-block px-2.5 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
            System Administration
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            SupportDesk Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time analytics, queue distribution, and operational metrics
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/admin/tickets"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors"
          >
            Manage Tickets
          </Link>
          <Link
            to="/admin/agents"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors"
          >
            Agent Workload
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          title="Total Tickets"
          count={stats.totalTickets}
          icon={Ticket}
          color="indigo"
          onClick={() => navigate('/admin/tickets')}
        />
        <StatCard
          title="Total Users"
          count={stats.totalUsers}
          icon={Users}
          color="blue"
          onClick={() => navigate('/admin/users')}
        />
        <StatCard
          title="Support Agents"
          count={stats.totalAgents}
          icon={Headphones}
          color="emerald"
          onClick={() => navigate('/admin/agents')}
        />
      </div>


      {/* Agent Workload & High Priority Tickets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Workload Overview */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Agent Workload</h3>
              <p className="text-xs text-slate-500">Active tickets per agent</p>
            </div>
            <Link
              to="/admin/agents"
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {agentWorkload.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No agents registered</p>
            ) : (
              agentWorkload.map((agent) => (
                <div
                  key={agent.agentId}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                      {agent.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{agent.name}</p>
                      <p className="text-[10px] text-slate-400">{agent.department || 'Support'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900">{agent.pending}</span>
                    <span className="text-[10px] text-slate-400 block">pending</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* High Priority Tickets */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                Critical & High Priority Queue
              </h3>
              <p className="text-xs text-slate-500">Urgent issues requiring immediate oversight</p>
            </div>
            <Link
              to="/admin/tickets?priority=Critical"
              className="text-xs font-semibold text-rose-600 hover:underline"
            >
              Filter Urgent &rarr;
            </Link>
          </div>

          <TicketList
            tickets={data?.highPriorityTickets || []}
            loading={loading}
            detailBaseUrl="/admin/tickets"
            onAssign={(ticket) => {
              setSelectedTicket(ticket);
              setAssignModalOpen(true);
            }}
            emptyMessage="No urgent tickets currently open. Great job!"
          />
        </div>
      </div>

      {/* Recent Tickets Full Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Global Tickets</h2>
            <p className="text-xs text-slate-500">Latest tickets submitted across the entire platform</p>
          </div>
          <Link
            to="/admin/tickets"
            className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
          >
            <span>View All Tickets</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <TicketList
          tickets={data?.recentTickets || []}
          loading={loading}
          detailBaseUrl="/admin/tickets"
          onAssign={(ticket) => {
            setSelectedTicket(ticket);
            setAssignModalOpen(true);
          }}
          emptyMessage="No tickets found in the system yet."
        />
      </div>

      {/* Assign Agent Modal */}
      <AssignTicketModal
        isOpen={assignModalOpen}
        onClose={() => {
          setAssignModalOpen(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
        onAssign={handleAssignSubmit}
        submitting={assignSubmitting}
      />
    </div>
  );
};

export default AdminDashboard;
