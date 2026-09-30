import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ticketService from '../../services/ticketService';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import Modal from '../../components/common/Modal';
import { formatDate, timeAgo } from '../../utils/formatDate';
import {
  ArrowLeft,
  User,
  Headphones,
  Calendar,
  Tag,
  RotateCcw,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export const UserTicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reopen Modal state
  const [reopenModalOpen, setReopenModalOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchTicketData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await ticketService.getTicketById(id);
      setTicket(res.ticket);
    } catch (err) {
      console.error('Error fetching ticket:', err);
      setFeedback({ type: 'error', message: err.message || 'Ticket not found' });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTicketData();
  }, [fetchTicketData]);

  const handleReopen = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const res = await ticketService.reopenTicket(ticket._id, reopenReason);
      setTicket(res.ticket);
      setReopenModalOpen(false);
      setReopenReason('');
      fetchTicketData();
      setFeedback({ type: 'success', message: 'Ticket reopened successfully' });
    } catch (err) {
      alert(err.message || 'Failed to reopen ticket');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClose = async () => {
    if (!window.confirm('Are you satisfied and want to close this ticket?')) return;
    try {
      setActionLoading(true);
      const res = await ticketService.closeTicket(ticket._id);
      setTicket(res.ticket);
      fetchTicketData();
      setFeedback({ type: 'success', message: 'Ticket closed successfully' });
    } catch (err) {
      alert(err.message || 'Failed to close ticket');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading ticket details...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Ticket Not Found</h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          The requested ticket does not exist or you do not have permission to view it.
        </p>
        <Link
          to="/user/tickets"
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700"
        >
          Return to My Tickets
        </Link>
      </div>
    );
  }

  const canReopen = ticket.status === 'Resolved' || ticket.status === 'Closed';
  const canClose = ticket.status === 'Resolved' || ticket.status === 'In Progress';

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/user/tickets')}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100">
                {ticket.ticketId}
              </span>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 line-clamp-1">
              {ticket.subject}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {canClose && (
            <button
              onClick={handleClose}
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs sm:text-sm font-semibold rounded-xl transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Accept & Close</span>
            </button>
          )}

          {canReopen && (
            <button
              onClick={() => setReopenModalOpen(true)}
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs sm:text-sm font-semibold rounded-xl transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reopen Ticket</span>
            </button>
          )}
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-sm flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs font-semibold underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Left conversation & details, Right meta & timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Description Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Problem Description
            </h3>
            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>

          </div>

        </div>

        {/* Right Column (1 Col) - Metadata & Activity */}
        <div className="space-y-6">
          {/* Ticket Info Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="font-semibold text-slate-900 text-sm pb-2 border-b border-slate-100">
              Ticket Details
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Status</span>
                <StatusBadge status={ticket.status} size="sm" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Priority</span>
                <PriorityBadge priority={ticket.priority} size="sm" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Category</span>
                <span className="font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  {ticket.category}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-slate-500">Assigned Agent</span>
                <div className="flex items-center gap-1.5 font-medium text-slate-800">
                  <Headphones className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{ticket.assignedAgent ? ticket.assignedAgent.name : 'Unassigned'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Created Date</span>
                <span className="text-slate-700">{formatDate(ticket.createdAt)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Last Updated</span>
                <span className="text-slate-700">{timeAgo(ticket.updatedAt)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Reopen Ticket Modal */}
      <Modal
        isOpen={reopenModalOpen}
        onClose={() => setReopenModalOpen(false)}
        title="Reopen Support Ticket"
      >
        <form onSubmit={handleReopen} className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Please tell us why you are reopening ticket{' '}
            <strong className="text-slate-900 font-mono">{ticket.ticketId}</strong>. Describe what
            issue persists so the agent can investigate.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Reason for Reopening *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Enter reason for reopening..."
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setReopenModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading || !reopenReason.trim()}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-sm"
            >
              {actionLoading ? 'Reopening...' : 'Confirm Reopen'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserTicketDetails;
