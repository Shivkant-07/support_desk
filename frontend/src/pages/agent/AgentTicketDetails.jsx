import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ticketService from '../../services/ticketService';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import { formatDate, timeAgo } from '../../utils/formatDate';
import {
  ArrowLeft,
  User,
  Calendar,
  Tag,
  CheckCircle2,
  Clock,
  AlertCircle,
  Mail,
  Building,
} from 'lucide-react';

export const AgentTicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
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

  const handleStatusChange = async (newStatus) => {
    if (newStatus === ticket.status) return;
    try {
      setStatusUpdating(true);
      const res = await ticketService.updateTicket(ticket._id, { status: newStatus });
      setTicket(res.ticket);
      fetchTicketData();
      setFeedback({ type: 'success', message: `Status updated to "${newStatus}"` });
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading ticket...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Ticket Not Accessible</h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          This ticket is either not assigned to you or does not exist.
        </p>
        <Link
          to="/agent/tickets"
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700"
        >
          Return to Assigned Tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Status Controller */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/agent/tickets')}
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

        {/* Quick Status Changers for Agent */}
        <div className="flex items-center gap-2 flex-wrap bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 pl-2">Update Status:</span>

          {ticket.status !== 'In Progress' && ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
            <button
              onClick={() => handleStatusChange('In Progress')}
              disabled={statusUpdating}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg border border-amber-200 transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Mark In Progress</span>
            </button>
          )}

          {ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
            <button
              onClick={() => handleStatusChange('Resolved')}
              disabled={statusUpdating}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resolve Ticket</span>
            </button>
          )}

          {/* Fallback Dropdown */}
          <select
            value={ticket.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={statusUpdating}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              User Description
            </h3>
            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>

          </div>

        </div>

        {/* Right Column (1 Col) - User Information & Timeline */}
        <div className="space-y-6">
          {/* Requester Info Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="font-semibold text-slate-900 text-sm pb-2 border-b border-slate-100">
              Requester Details
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                {ticket.createdBy?.name?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {ticket.createdBy?.name}
                </p>
                <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {ticket.createdBy?.email}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Department</span>
                <span className="text-slate-800 font-medium">
                  {ticket.createdBy?.department || 'General'}
                </span>
              </div>
              {ticket.createdBy?.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Phone</span>
                  <span className="text-slate-800 font-medium">{ticket.createdBy.phone}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Category</span>
                <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium">
                  {ticket.category}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Created At</span>
                <span className="text-slate-700">{formatDate(ticket.createdAt)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AgentTicketDetails;
